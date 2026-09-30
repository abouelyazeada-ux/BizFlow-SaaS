using BizFlow.Application.Invoices.DTOs;
using MediatR;

namespace BizFlow.Application.Invoices.Queries.GetInvoiceById;

public class GetInvoiceByIdQuery : IRequest<InvoiceDto>
{
    public Guid Id { get; set; }
}
