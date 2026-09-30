using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Models;
using BizFlow.Application.Invoices.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Invoices.Queries.GetInvoices;

public class GetInvoicesQueryHandler : IRequestHandler<GetInvoicesQuery, PagedResult<InvoiceDto>>
{
    private readonly IApplicationDbContext _context;

    public GetInvoicesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<InvoiceDto>> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Invoices
            .Include(i => i.Customer)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            query = query.Where(i => 
                (i.InvoiceNumber != null && i.InvoiceNumber.ToLower().Contains(search)) ||
                (i.Customer.Name != null && i.Customer.Name.ToLower().Contains(search)));
        }

        if (request.Status.HasValue)
        {
            query = query.Where(i => i.Status == request.Status.Value);
        }

        query = request.SortBy?.ToLower() switch
        {
            "invoicenumber" => request.SortDescending ? query.OrderByDescending(i => i.InvoiceNumber) : query.OrderBy(i => i.InvoiceNumber),
            "date" => request.SortDescending ? query.OrderByDescending(i => i.InvoiceDate) : query.OrderBy(i => i.InvoiceDate),
            "total" => request.SortDescending ? query.OrderByDescending(i => i.Total) : query.OrderBy(i => i.Total),
            "createdat" => request.SortDescending ? query.OrderByDescending(i => i.CreatedAt) : query.OrderBy(i => i.CreatedAt),
            _ => query.OrderByDescending(i => i.CreatedAt) // Default sort
        };

        var projectedQuery = query.Select(i => new InvoiceDto
        {
            Id = i.Id,
            CustomerId = i.CustomerId,
            CustomerName = i.Customer.Name,
            InvoiceNumber = i.InvoiceNumber,
            InvoiceDate = i.InvoiceDate,
            Status = i.Status,
            SubTotal = i.SubTotal,
            Discount = i.Discount,
            Tax = i.Tax,
            Total = i.Total,
            CreatedAt = i.CreatedAt
            // Not projecting Items in list view for performance
        });

        return await PagedResult<InvoiceDto>.CreateAsync(projectedQuery, request.PageNumber, request.PageSize);
    }
}
