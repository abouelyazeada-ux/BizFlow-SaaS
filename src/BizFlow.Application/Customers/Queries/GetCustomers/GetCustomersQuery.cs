using BizFlow.Application.Common.Models;
using BizFlow.Application.Customers.DTOs;
using MediatR;

namespace BizFlow.Application.Customers.Queries.GetCustomers;

public class GetCustomersQuery : IRequest<PagedResult<CustomerDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}
