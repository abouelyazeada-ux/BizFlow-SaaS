namespace BizFlow.Application.Dashboard.DTOs;

public class DashboardOverviewDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalInvoices { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalProducts { get; set; }
    public int LowStockProductsCount { get; set; }
    public int PendingInvoicesCount { get; set; }
}
