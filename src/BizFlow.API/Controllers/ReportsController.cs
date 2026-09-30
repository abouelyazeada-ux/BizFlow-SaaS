namespace BizFlow.API.Controllers;

using System.Threading.Tasks;
using BizFlow.Application.Reports.Queries.GetDashboardReport;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardReport()
    {
        var pdfBytes = await _mediator.Send(new GetDashboardReportQuery());
        return File(pdfBytes, "application/pdf", "BizFlow_Report.pdf");
    }
}
