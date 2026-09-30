using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Products.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IApplicationDbContext _context;

    public GetProductByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Product {request.Id} not found.");
        }

        return new ProductDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category?.Name,
            Price = entity.Price,
            CostPrice = entity.CostPrice,
            Quantity = entity.Quantity,
            MinimumStockLevel = entity.MinimumStockLevel,
            IsActive = entity.IsActive,
            IsLowStock = entity.IsLowStock(),
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.LastModifiedAt
        };
    }
}
