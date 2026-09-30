using MediatR;

namespace BizFlow.Application.Invoices.Commands.CancelInvoice;

public class CancelInvoiceCommand : IRequest
{
    public Guid Id { get; set; }
}
