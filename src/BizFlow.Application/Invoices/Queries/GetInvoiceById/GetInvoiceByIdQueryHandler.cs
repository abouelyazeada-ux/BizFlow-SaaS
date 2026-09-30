using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Invoices.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Invoices.Queries.GetInvoiceById;

public class GetInvoiceByIdQueryHandler : IRequestHandler<GetInvoiceByIdQuery, InvoiceDto>
{
    private readonly IApplicationDbContext _context;

    public GetInvoiceByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InvoiceDto> Handle(GetInvoiceByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Items)
                .ThenInclude(item => item.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Invoice {request.Id} not found.");
        }

        return new InvoiceDto
        {
            Id = entity.Id,
            CustomerId = entity.CustomerId,
            CustomerName = entity.Customer.Name,
            InvoiceNumber = entity.InvoiceNumber,
            InvoiceDate = entity.InvoiceDate,
            Status = entity.Status,
            SubTotal = entity.SubTotal,
            Discount = entity.Discount,
            Tax = entity.Tax,
            Total = entity.Total,
            CreatedAt = entity.CreatedAt,
            Items = entity.Items.Select(item => new InvoiceItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductNameSnapshot = item.ProductNameSnapshot,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Total = item.Total
            }).ToList()
        };
    }
}
