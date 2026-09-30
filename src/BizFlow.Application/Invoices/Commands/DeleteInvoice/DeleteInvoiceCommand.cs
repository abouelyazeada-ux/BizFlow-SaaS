using MediatR;

namespace BizFlow.Application.Invoices.Commands.DeleteInvoice;

public class DeleteInvoiceCommand : IRequest
{
    public Guid Id { get; set; }
}
