using FluentValidation;

namespace BizFlow.Application.Customers.Commands.CreateCustomer;

public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(v => v.Name)
            .MaximumLength(200)
            .NotEmpty();

        RuleFor(v => v.Email)
            .MaximumLength(200)
            .EmailAddress().When(v => !string.IsNullOrEmpty(v.Email));

        RuleFor(v => v.Phone)
            .MaximumLength(50);
    }
}
