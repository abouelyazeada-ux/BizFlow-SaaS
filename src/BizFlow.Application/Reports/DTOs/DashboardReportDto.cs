namespace BizFlow.Application.Reports.DTOs;

using System.Collections.Generic;
using BizFlow.Application.Dashboard.DTOs;

public class DashboardReportDto
{
    public DashboardOverviewDto Overview { get; set; } = null!;
    public SalesAnalyticsDto Sales { get; set; } = null!;
    public InventoryAnalyticsDto Inventory { get; set; } = null!;
    public List<RecentActivityDto> RecentActivities { get; set; } = new();
}
