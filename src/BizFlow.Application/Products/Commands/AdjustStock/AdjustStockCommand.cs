using MediatR;

namespace BizFlow.Application.Products.Commands.AdjustStock;

public class AdjustStockCommand : IRequest
{
    public Guid Id { get; set; }
    public int QuantityAdjustment { get; set; } // e.g. -5 for sale, +10 for restock
}
