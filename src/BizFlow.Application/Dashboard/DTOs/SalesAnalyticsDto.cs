using System.Collections.Generic;

namespace BizFlow.Application.Dashboard.DTOs;

public class SalesAnalyticsDto
{
    public decimal AverageInvoiceValue { get; set; }
    public int TotalInvoices { get; set; }
    public List<RevenueDataPoint> RevenueByDay { get; set; } = new();
    public List<RevenueDataPoint> RevenueByMonth { get; set; } = new();
}

public class RevenueDataPoint
{
    public string Label { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int InvoiceCount { get; set; }
}
