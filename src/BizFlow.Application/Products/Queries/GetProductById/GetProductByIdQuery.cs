using BizFlow.Application.Products.DTOs;
using MediatR;

namespace BizFlow.Application.Products.Queries.GetProductById;

public class GetProductByIdQuery : IRequest<ProductDto>
{
    public Guid Id { get; set; }
}
