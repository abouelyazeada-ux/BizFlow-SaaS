namespace BizFlow.Application.Reports.Queries.GetDashboardReport;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using BizFlow.Application.Reports.DTOs;
using BizFlow.Application.Dashboard.Queries.GetDashboardOverview;
using BizFlow.Application.Dashboard.Queries.GetSalesAnalytics;
using BizFlow.Application.Dashboard.Queries.GetInventoryAnalytics;
using BizFlow.Application.Dashboard.Queries.GetRecentActivities;
using System.Linq;

public class GetDashboardReportQueryHandler : IRequestHandler<GetDashboardReportQuery, byte[]>
{
    private readonly IMediator _mediator;
    private readonly IReportGenerator _reportGenerator;

    public GetDashboardReportQueryHandler(IMediator mediator, IReportGenerator reportGenerator)
    {
        _mediator = mediator;
        _reportGenerator = reportGenerator;
    }

    public async Task<byte[]> Handle(GetDashboardReportQuery request, CancellationToken cancellationToken)
    {
        var overview = await _mediator.Send(new GetDashboardOverviewQuery(null, null), cancellationToken);
        var sales = await _mediator.Send(new GetSalesAnalyticsQuery(null, null), cancellationToken);
        var inventory = await _mediator.Send(new GetInventoryAnalyticsQuery(), cancellationToken);
        var activities = await _mediator.Send(new GetRecentActivitiesQuery(10), cancellationToken);

        var data = new DashboardReportDto
        {
            Overview = overview,
            Sales = sales,
            Inventory = inventory,
            RecentActivities = activities.ToList()
        };

        return _reportGenerator.GenerateDashboardReport(data);
    }
}
