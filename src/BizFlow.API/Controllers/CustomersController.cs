using BizFlow.Application.Common.Models;
using BizFlow.Application.Customers.Commands.CreateCustomer;
using BizFlow.Application.Customers.Commands.DeleteCustomer;
using BizFlow.Application.Customers.Commands.UpdateCustomer;
using BizFlow.Application.Customers.DTOs;
using BizFlow.Application.Customers.Queries.GetCustomerById;
using BizFlow.Application.Customers.Queries.GetCustomers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BizFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<CustomerDto>>> GetCustomers([FromQuery] GetCustomersQuery query)
    {
        return await _mediator.Send(query);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetCustomer(Guid id)
    {
        try
        {
            return await _mediator.Send(new GetCustomerByIdQuery { Id = id });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateCustomer(CreateCustomerCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCustomer), new { id }, id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCustomer(Guid id, UpdateCustomerCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCustomer(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteCustomerCommand { Id = id });
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
