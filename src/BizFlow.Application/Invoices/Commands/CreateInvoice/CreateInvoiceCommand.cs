using MediatR;

namespace BizFlow.Application.Invoices.Commands.CreateInvoice;

public class CreateInvoiceItemCommand
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class CreateInvoiceCommand : IRequest<Guid>
{
    public Guid CustomerId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    
    public List<CreateInvoiceItemCommand> Items { get; set; } = new();
}
