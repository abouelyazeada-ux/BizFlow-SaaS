using System.Collections.Generic;

namespace BizFlow.Application.Dashboard.DTOs;

public class InventoryAnalyticsDto
{
    public decimal TotalInventoryValue { get; set; }
    public int LowStockProductsCount { get; set; }
    public int OutOfStockProductsCount { get; set; }
    
    public List<ProductSummaryDto> LowStockProducts { get; set; } = new();
    public List<ProductSummaryDto> TopSellingProducts { get; set; } = new();
}

public class ProductSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string StockStatus { get; set; } = string.Empty;
    public int SalesCount { get; set; }
}
