namespace BizFlow.Application.Reports;

using BizFlow.Application.Reports.DTOs;

public interface IReportGenerator
{
    byte[] GenerateDashboardReport(DashboardReportDto data);
}
