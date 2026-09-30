using BizFlow.Application.Common.Models;
using BizFlow.Application.Products.DTOs;
using MediatR;

namespace BizFlow.Application.Products.Queries.GetProducts;

public class GetProductsQuery : IRequest<PagedResult<ProductDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? Category { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}
