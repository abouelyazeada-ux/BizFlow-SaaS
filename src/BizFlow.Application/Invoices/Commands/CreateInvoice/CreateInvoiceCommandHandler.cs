using BizFlow.Application.Common.Interfaces;
using BizFlow.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using BizFlow.Application.Common.Exceptions;
using BizFlow.Domain.Enums;

namespace BizFlow.Application.Invoices.Commands.CreateInvoice;

public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateInvoiceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        var customerExists = await _context.Customers.AnyAsync(c => c.Id == request.CustomerId, cancellationToken);
        if (!customerExists)
            throw new KeyNotFoundException($"Customer {request.CustomerId} not found.");

        var invoice = new Invoice
        {
            CustomerId = request.CustomerId,
            InvoiceNumber = request.InvoiceNumber,
            InvoiceDate = request.InvoiceDate
        };

        var productIds = request.Items.Select(x => x.ProductId).ToList();
        var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id, cancellationToken);

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
            {
                throw new KeyNotFoundException($"Product {item.ProductId} not found.");
            }
            invoice.AddItem(item.ProductId, product.Name, item.Quantity, item.UnitPrice);
        }

        invoice.SetDiscountAndTax(request.Discount, request.Tax);

        _context.Invoices.Add(invoice);

        var notification = new Notification
        {
            CompanyId = invoice.CompanyId,
            Title = "New Invoice Created",
            Message = $"Invoice {invoice.InvoiceNumber} was created successfully.",
            Type = NotificationType.Invoice,
            Link = $"/invoices/{invoice.Id}"
        };
        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync(cancellationToken);

        return invoice.Id;
    }
}
