using BizFlow.Domain.Common;
using BizFlow.Domain.Enums;

namespace BizFlow.Domain.Entities;

public class Invoice : BaseEntity, IMustHaveTenant
{
    public Guid CompanyId { get; set; }
    public Guid CustomerId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public InvoiceStatus Status { get; private set; } = InvoiceStatus.Draft;
    
    public decimal SubTotal { get; private set; }
    public decimal Discount { get; private set; }
    public decimal Tax { get; private set; }
    public decimal Total { get; private set; }
    
    public Company Company { get; set; } = null!;
    public Customer Customer { get; set; } = null!;
    
    private readonly List<InvoiceItem> _items = new();
    public IReadOnlyCollection<InvoiceItem> Items => _items.AsReadOnly();
    
    public void AddItem(Guid productId, string productNameSnapshot, int quantity, decimal unitPrice)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.");
        if (unitPrice < 0) throw new ArgumentException("Price cannot be negative.");
        
        _items.Add(new InvoiceItem 
        { 
            ProductId = productId, 
            ProductNameSnapshot = productNameSnapshot,
            Quantity = quantity, 
            UnitPrice = unitPrice 
        });
        
        Recalculate();
    }

    public void ClearItems()
    {
        _items.Clear();
        Recalculate();
    }
    
    public void SetDiscountAndTax(decimal discount, decimal tax)
    {
        Discount = discount;
        Tax = tax;
        Recalculate();
    }
    
    private void Recalculate()
    {
        SubTotal = _items.Sum(i => i.Quantity * i.UnitPrice);
        Total = SubTotal - Discount + Tax;
        if (Total < 0) Total = 0;
    }
    
    public void Confirm()
    {
        if (Status != InvoiceStatus.Draft) throw new InvalidOperationException("Only draft invoices can be confirmed.");
        if (!_items.Any()) throw new InvalidOperationException("Invoice must have at least one item.");
        Status = InvoiceStatus.Pending;
    }
    
    public void Cancel()
    {
        if (Status == InvoiceStatus.Cancelled) return;
        if (Status == InvoiceStatus.Paid) throw new InvalidOperationException("Paid invoices cannot be cancelled.");
        Status = InvoiceStatus.Cancelled;
    }

    public void MarkAsPaid()
    {
        if (Status != InvoiceStatus.Pending) throw new InvalidOperationException("Only pending invoices can be paid.");
        Status = InvoiceStatus.Paid;
    }
}
