using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Dashboard.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Dashboard.Queries.GetInventoryAnalytics;

public record GetInventoryAnalyticsQuery : IRequest<InventoryAnalyticsDto>;

public class GetInventoryAnalyticsQueryHandler : IRequestHandler<GetInventoryAnalyticsQuery, InventoryAnalyticsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentTenantService _currentTenantService;

    public GetInventoryAnalyticsQueryHandler(IApplicationDbContext context, ICurrentTenantService currentTenantService)
    {
        _context = context;
        _currentTenantService = currentTenantService;
    }

    public async Task<InventoryAnalyticsDto> Handle(GetInventoryAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentTenantService.TenantId ?? throw new UnauthorizedAccessException();

        var products = await _context.Products
            .Where(p => p.CompanyId == companyId && p.IsActive)
            .ToListAsync(cancellationToken);

        var totalInventoryValue = products.Sum(p => p.Quantity * p.CostPrice);
        
        var lowStockProducts = products
            .Where(p => p.Quantity <= p.MinimumStockLevel && p.Quantity > 0)
            .Select(p => new ProductSummaryDto
            {
                Id = p.Id.ToString(),
                Name = p.Name,
                Quantity = p.Quantity,
                Price = p.Price,
                StockStatus = "LowStock"
            })
            .OrderBy(p => p.Quantity)
            .Take(10)
            .ToList();

        var outOfStockCount = products.Count(p => p.Quantity == 0);

        return new InventoryAnalyticsDto
        {
            TotalInventoryValue = totalInventoryValue,
            LowStockProductsCount = lowStockProducts.Count,
            OutOfStockProductsCount = outOfStockCount,
            LowStockProducts = lowStockProducts
        };
    }
}
