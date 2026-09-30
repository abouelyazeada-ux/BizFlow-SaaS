using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Models;
using BizFlow.Application.Products.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Products.Queries.GetLowStockProducts;

public class GetLowStockProductsQueryHandler : IRequestHandler<GetLowStockProductsQuery, PagedResult<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLowStockProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<ProductDto>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .Where(p => p.IsActive && p.Quantity <= p.MinimumStockLevel)
            .OrderBy(p => p.Quantity);

        var projectedQuery = query.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : null,
            Price = p.Price,
            CostPrice = p.CostPrice,
            Quantity = p.Quantity,
            MinimumStockLevel = p.MinimumStockLevel,
            IsActive = p.IsActive,
            IsLowStock = true,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.LastModifiedAt
        });

        return await PagedResult<ProductDto>.CreateAsync(projectedQuery, request.PageNumber, request.PageSize);
    }
}
