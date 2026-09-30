using BizFlow.Application.Customers.DTOs;
using MediatR;

namespace BizFlow.Application.Customers.Queries.GetCustomerById;

public class GetCustomerByIdQuery : IRequest<CustomerDto>
{
    public Guid Id { get; set; }
}
