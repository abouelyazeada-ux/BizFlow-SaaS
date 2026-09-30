using BizFlow.Domain.Common;

namespace BizFlow.Domain.Entities;

public class InvoiceItem : BaseEntity
{
    public Guid InvoiceId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductNameSnapshot { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total => Quantity * UnitPrice;
    
    public Invoice Invoice { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
