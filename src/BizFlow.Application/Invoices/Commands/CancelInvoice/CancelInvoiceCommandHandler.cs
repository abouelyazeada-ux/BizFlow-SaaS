using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Invoices.Commands.CancelInvoice;

public class CancelInvoiceCommandHandler : IRequestHandler<CancelInvoiceCommand>
{
    private readonly IApplicationDbContext _context;

    public CancelInvoiceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(CancelInvoiceCommand request, CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (invoice == null)
        {
            throw new KeyNotFoundException($"Invoice {request.Id} not found.");
        }

        try
        {
            var wasPending = invoice.Status == Domain.Enums.InvoiceStatus.Pending;
            
            invoice.Cancel();

            // If it was confirmed/pending, we need to return the stock
            if (wasPending)
            {
                foreach (var item in invoice.Items)
                {
                    var product = await _context.Products.FindAsync(new object[] { item.ProductId }, cancellationToken);
                    if (product != null)
                    {
                        product.AdjustStock(item.Quantity);
                    }
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ValidationException(new List<FluentValidation.Results.ValidationFailure>
            {
                new("Status", ex.Message)
            });
        }
    }
}
