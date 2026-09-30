using System;
using System.Threading.Tasks;
using BizFlow.Application.Dashboard.Queries.GetDashboardOverview;
using BizFlow.Application.Dashboard.Queries.GetSalesAnalytics;
using BizFlow.Application.Dashboard.Queries.GetInventoryAnalytics;
using BizFlow.Application.Dashboard.Queries.GetRecentActivities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BizFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var result = await _mediator.Send(new GetDashboardOverviewQuery(startDate, endDate));
        return Ok(result);
    }

    [HttpGet("sales")]
    public async Task<IActionResult> GetSales([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var result = await _mediator.Send(new GetSalesAnalyticsQuery(startDate, endDate));
        return Ok(result);
    }

    [HttpGet("inventory")]
    public async Task<IActionResult> GetInventory()
    {
        var result = await _mediator.Send(new GetInventoryAnalyticsQuery());
        return Ok(result);
    }

    [HttpGet("recent-activities")]
    public async Task<IActionResult> GetRecentActivities([FromQuery] int limit = 5)
    {
        var result = await _mediator.Send(new GetRecentActivitiesQuery(limit));
        return Ok(result);
    }
}
