using BizFlow.Application.Common.Models;
using BizFlow.Application.Invoices.DTOs;
using BizFlow.Domain.Enums;
using MediatR;

namespace BizFlow.Application.Invoices.Queries.GetInvoices;

public class GetInvoicesQuery : IRequest<PagedResult<InvoiceDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; } // Search by invoice number or customer name
    public InvoiceStatus? Status { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}
