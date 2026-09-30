using BizFlow.Application.Common.Interfaces;
using MediatR;

namespace BizFlow.Application.Products.Commands.DeleteProduct;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Product {request.Id} not found.");
        }

        _context.Products.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
