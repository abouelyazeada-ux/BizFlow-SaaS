using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Exceptions;
using MediatR;

namespace BizFlow.Application.Products.Commands.AdjustStock;

public class AdjustStockCommandHandler : IRequestHandler<AdjustStockCommand>
{
    private readonly IApplicationDbContext _context;

    public AdjustStockCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Product {request.Id} not found.");
        }

        try
        {
            entity.AdjustStock(request.QuantityAdjustment);
        }
        catch (InvalidOperationException ex)
        {
            var failures = new List<FluentValidation.Results.ValidationFailure>
            {
                new FluentValidation.Results.ValidationFailure("Quantity", ex.Message)
            };
            throw new ValidationException(failures);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
