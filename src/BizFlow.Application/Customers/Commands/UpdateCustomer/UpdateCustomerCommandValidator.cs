using FluentValidation;

namespace BizFlow.Application.Customers.Commands.UpdateCustomer;

public class UpdateCustomerCommandValidator : AbstractValidator<UpdateCustomerCommand>
{
    public UpdateCustomerCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty();

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
