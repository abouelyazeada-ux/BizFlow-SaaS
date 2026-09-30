using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Invoices.Commands.ConfirmInvoice;

public class ConfirmInvoiceCommandHandler : IRequestHandler<ConfirmInvoiceCommand>
{
    private readonly IApplicationDbContext _context;

    public ConfirmInvoiceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(ConfirmInvoiceCommand request, CancellationToken cancellationToken)
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
            // 1 & 2. Validate and reduce stock quantities
            foreach (var item in invoice.Items)
            {
                var product = await _context.Products.FindAsync(new object[] { item.ProductId }, cancellationToken);
                if (product == null)
                    throw new KeyNotFoundException($"Product {item.ProductId} not found.");

                product.AdjustStock(-item.Quantity);
            }

            // 4. Change invoice status
            invoice.Confirm();

            // 5. Save everything in one implicit database transaction
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
