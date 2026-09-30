using BizFlow.Application.Common.Models;
using BizFlow.Application.Products.Commands.AdjustStock;
using BizFlow.Application.Products.Commands.CreateProduct;
using BizFlow.Application.Products.Commands.DeleteProduct;
using BizFlow.Application.Products.Commands.UpdateProduct;
using BizFlow.Application.Products.DTOs;
using BizFlow.Application.Products.Queries.GetLowStockProducts;
using BizFlow.Application.Products.Queries.GetProductById;
using BizFlow.Application.Products.Queries.GetProducts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BizFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts([FromQuery] GetProductsQuery query)
    {
        return await _mediator.Send(query);
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetLowStockProducts([FromQuery] GetLowStockProductsQuery query)
    {
        return await _mediator.Send(query);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(Guid id)
    {
        return await _mediator.Send(new GetProductByIdQuery { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateProduct(CreateProductCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetProduct), new { id }, id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateProduct(Guid id, UpdateProductCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(Guid id)
    {
        await _mediator.Send(new DeleteProductCommand { Id = id });
        return NoContent();
    }

    [HttpPost("{id}/stock")]
    public async Task<ActionResult> AdjustStock(Guid id, [FromBody] AdjustStockCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        await _mediator.Send(command);
        return NoContent();
    }
}
