using FluentValidation;

namespace BizFlow.Application.Products.Commands.AdjustStock;

public class AdjustStockCommandValidator : AbstractValidator<AdjustStockCommand>
{
    public AdjustStockCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty();
        RuleFor(v => v.QuantityAdjustment).NotEqual(0);
    }
}
