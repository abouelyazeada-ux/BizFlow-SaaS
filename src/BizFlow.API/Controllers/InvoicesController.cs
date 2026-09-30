using BizFlow.Application.Common.Models;
using BizFlow.Application.Invoices.Commands.ConfirmInvoice;
using BizFlow.Application.Invoices.Commands.CancelInvoice;
using BizFlow.Application.Invoices.Commands.CreateInvoice;
using BizFlow.Application.Invoices.Commands.DeleteInvoice;
using BizFlow.Application.Invoices.DTOs;
using BizFlow.Application.Invoices.Queries.GetInvoiceById;
using BizFlow.Application.Invoices.Queries.GetInvoices;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BizFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IMediator _mediator;

    public InvoicesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<InvoiceDto>>> GetInvoices([FromQuery] GetInvoicesQuery query)
    {
        return await _mediator.Send(query);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceDto>> GetInvoice(Guid id)
    {
        return await _mediator.Send(new GetInvoiceByIdQuery { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateInvoice(CreateInvoiceCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetInvoice), new { id }, id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInvoice(Guid id)
    {
        await _mediator.Send(new DeleteInvoiceCommand { Id = id });
        return NoContent();
    }

    [HttpPost("{id}/confirm")]
    public async Task<ActionResult> ConfirmInvoice(Guid id)
    {
        await _mediator.Send(new ConfirmInvoiceCommand { Id = id });
        return NoContent();
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> CancelInvoice(Guid id)
    {
        await _mediator.Send(new CancelInvoiceCommand { Id = id });
        return NoContent();
    }
}
