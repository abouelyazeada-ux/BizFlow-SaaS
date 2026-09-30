using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Models;
using BizFlow.Application.Products.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Products.Queries.GetProducts;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products.Include(p => p.Category).AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            query = query.Where(p => 
                (p.Name != null && p.Name.ToLower().Contains(search)) ||
                (p.Description != null && p.Description.ToLower().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            // Assuming request.Category might be CategoryId (Guid string)
            if (Guid.TryParse(request.Category, out var categoryId))
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }
        }

        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "price" => request.SortDescending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "quantity" => request.SortDescending ? query.OrderByDescending(p => p.Quantity) : query.OrderBy(p => p.Quantity),
            "createdat" => request.SortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt) // Default sort
        };

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
            IsLowStock = p.Quantity <= p.MinimumStockLevel,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.LastModifiedAt
        });

        return await PagedResult<ProductDto>.CreateAsync(projectedQuery, request.PageNumber, request.PageSize);
    }
}
