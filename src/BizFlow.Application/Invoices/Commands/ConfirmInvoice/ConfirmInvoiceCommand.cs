using MediatR;

namespace BizFlow.Application.Invoices.Commands.ConfirmInvoice;

public class ConfirmInvoiceCommand : IRequest
{
    public Guid Id { get; set; }
}
