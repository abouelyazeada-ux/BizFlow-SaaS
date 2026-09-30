using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Exceptions;
using BizFlow.Domain.Enums;
using MediatR;

namespace BizFlow.Application.Invoices.Commands.DeleteInvoice;

public class DeleteInvoiceCommandHandler : IRequestHandler<DeleteInvoiceCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteInvoiceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteInvoiceCommand request, CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices.FindAsync(new object[] { request.Id }, cancellationToken);

        if (invoice == null)
        {
            throw new KeyNotFoundException($"Invoice {request.Id} not found.");
        }

        if (invoice.Status != InvoiceStatus.Draft)
        {
            throw new ValidationException(new List<FluentValidation.Results.ValidationFailure>
            {
                new("Status", "Only draft invoices can be deleted.")
            });
        }

        _context.Invoices.Remove(invoice);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
