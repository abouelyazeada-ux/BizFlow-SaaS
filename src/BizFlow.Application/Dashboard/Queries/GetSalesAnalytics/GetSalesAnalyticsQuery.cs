using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Dashboard.DTOs;
using BizFlow.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Dashboard.Queries.GetSalesAnalytics;

public record GetSalesAnalyticsQuery(DateTime? StartDate, DateTime? EndDate) : IRequest<SalesAnalyticsDto>;

public class GetSalesAnalyticsQueryHandler : IRequestHandler<GetSalesAnalyticsQuery, SalesAnalyticsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentTenantService _currentTenantService;

    public GetSalesAnalyticsQueryHandler(IApplicationDbContext context, ICurrentTenantService currentTenantService)
    {
        _context = context;
        _currentTenantService = currentTenantService;
    }

    public async Task<SalesAnalyticsDto> Handle(GetSalesAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentTenantService.TenantId ?? throw new UnauthorizedAccessException();
        var startDate = request.StartDate ?? DateTime.UtcNow.AddDays(-30);
        var endDate = request.EndDate ?? DateTime.UtcNow;

        var invoices = await _context.Invoices
            .Where(i => i.CompanyId == companyId && i.InvoiceDate >= startDate && i.InvoiceDate <= endDate && i.Status != InvoiceStatus.Draft && i.Status != InvoiceStatus.Cancelled)
            .ToListAsync(cancellationToken);

        var dto = new SalesAnalyticsDto
        {
            TotalInvoices = invoices.Count,
            AverageInvoiceValue = invoices.Count > 0 ? invoices.Average(i => i.Total) : 0
        };

        // Group by day for line chart
        var dailyGrouping = invoices
            .GroupBy(i => i.InvoiceDate.Date)
            .OrderBy(g => g.Key)
            .Select(g => new RevenueDataPoint
            {
                Label = g.Key.ToString("MMM dd"),
                Revenue = g.Sum(i => i.Total),
                InvoiceCount = g.Count()
            }).ToList();

        dto.RevenueByDay = dailyGrouping;

        return dto;
    }
}
