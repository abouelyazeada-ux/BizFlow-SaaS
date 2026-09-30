using BizFlow.Domain.Common;

namespace BizFlow.Domain.Entities;

public class Product : BaseEntity, IMustHaveTenant
{
    public Guid CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public decimal Price { get; set; }
    public decimal CostPrice { get; set; }
    public int Quantity { get; set; }
    public int MinimumStockLevel { get; set; }
    public bool IsActive { get; set; } = true;
    
    public Company Company { get; set; } = null!;
    public Category? Category { get; set; }
    
    public bool IsLowStock() => Quantity <= MinimumStockLevel;
    
    public void AdjustStock(int adjustment)
    {
        if (Quantity + adjustment < 0)
            throw new InvalidOperationException("Stock cannot fall below zero.");
            
        Quantity += adjustment;
    }
}
