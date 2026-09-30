using FluentValidation;

namespace BizFlow.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty();

        RuleFor(v => v.Name)
            .MaximumLength(200)
            .NotEmpty();

        RuleFor(v => v.Price)
            .GreaterThan(0);
            
        RuleFor(v => v.CostPrice)
            .GreaterThanOrEqualTo(0);

        RuleFor(v => v.Quantity)
            .GreaterThanOrEqualTo(0);
            
        RuleFor(v => v.MinimumStockLevel)
            .GreaterThanOrEqualTo(0);
    }
}
