using MediatR;

namespace BizFlow.Application.Customers.Commands.DeleteCustomer;

public class DeleteCustomerCommand : IRequest
{
    public Guid Id { get; set; }
}
