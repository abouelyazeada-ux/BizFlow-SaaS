using FluentValidation;

namespace BizFlow.Application.Products.Commands.CreateProduct;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
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
