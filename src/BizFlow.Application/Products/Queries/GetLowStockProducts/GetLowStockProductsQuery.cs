using BizFlow.Application.Common.Models;
using BizFlow.Application.Products.DTOs;
using MediatR;

namespace BizFlow.Application.Products.Queries.GetLowStockProducts;

public class GetLowStockProductsQuery : IRequest<PagedResult<ProductDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
