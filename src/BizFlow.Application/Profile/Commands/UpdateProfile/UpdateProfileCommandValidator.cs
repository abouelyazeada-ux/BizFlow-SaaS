using FluentValidation;

namespace BizFlow.Application.Profile.Commands.UpdateProfile;

public class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator()
    {
        RuleFor(v => v.FirstName)
            .MaximumLength(100).WithMessage("FirstName must not exceed 100 characters.")
            .NotEmpty().WithMessage("FirstName is required.");

        RuleFor(v => v.LastName)
            .MaximumLength(100).WithMessage("LastName must not exceed 100 characters.")
            .NotEmpty().WithMessage("LastName is required.");
    }
}
