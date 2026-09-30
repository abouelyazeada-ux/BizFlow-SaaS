using FluentValidation;

namespace BizFlow.Application.Invoices.Commands.CreateInvoice;

public class CreateInvoiceItemCommandValidator : AbstractValidator<CreateInvoiceItemCommand>
{
    public CreateInvoiceItemCommandValidator()
    {
        RuleFor(v => v.ProductId).NotEmpty();
        RuleFor(v => v.Quantity).GreaterThan(0);
        RuleFor(v => v.UnitPrice).GreaterThanOrEqualTo(0);
    }
}

public class CreateInvoiceCommandValidator : AbstractValidator<CreateInvoiceCommand>
{
    public CreateInvoiceCommandValidator()
    {
        RuleFor(v => v.CustomerId).NotEmpty();
        RuleFor(v => v.InvoiceNumber).NotEmpty().MaximumLength(50);
        RuleFor(v => v.Discount).GreaterThanOrEqualTo(0);
        RuleFor(v => v.Tax).GreaterThanOrEqualTo(0);
        RuleFor(v => v.Items).NotEmpty().WithMessage("Invoice must have at least one item.");
        RuleForEach(v => v.Items).SetValidator(new CreateInvoiceItemCommandValidator());
    }
}
