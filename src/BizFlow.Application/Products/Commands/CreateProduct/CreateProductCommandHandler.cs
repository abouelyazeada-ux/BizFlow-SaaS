using BizFlow.Application.Common.Interfaces;
using BizFlow.Domain.Entities;
using MediatR;

namespace BizFlow.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = new Product
        {
            Name = request.Name,
            Description = request.Description,
            CategoryId = request.CategoryId,
            Price = request.Price,
            CostPrice = request.CostPrice,
            Quantity = request.Quantity,
            MinimumStockLevel = request.MinimumStockLevel,
            IsActive = request.IsActive
        };

        _context.Products.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
