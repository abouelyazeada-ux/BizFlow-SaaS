using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Dashboard.DTOs;
using BizFlow.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Dashboard.Queries.GetDashboardOverview;

public record GetDashboardOverviewQuery(DateTime? StartDate = null, DateTime? EndDate = null) : IRequest<DashboardOverviewDto>;

public class GetDashboardOverviewQueryHandler : IRequestHandler<GetDashboardOverviewQuery, DashboardOverviewDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentTenantService _currentTenantService;

    public GetDashboardOverviewQueryHandler(IApplicationDbContext context, ICurrentTenantService currentTenantService)
    {
        _context = context;
        _currentTenantService = currentTenantService;
    }

    public async Task<DashboardOverviewDto> Handle(GetDashboardOverviewQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentTenantService.TenantId ?? throw new UnauthorizedAccessException("Tenant ID is missing.");

        // Since EF Core Global Query Filters are usually applied for CompanyId, we might not need to explicitly filter,
        // but we'll do it explicitly here to be absolutely safe as per requirements.

        var startDate = request.StartDate;
        var endDate = request.EndDate;

        var invoiceQuery = _context.Invoices.Where(i => i.CompanyId == companyId);
        if (startDate.HasValue) invoiceQuery = invoiceQuery.Where(i => i.InvoiceDate >= startDate.Value);
        if (endDate.HasValue) invoiceQuery = invoiceQuery.Where(i => i.InvoiceDate <= endDate.Value);

        var totalRevenue = await invoiceQuery
            .Where(i => i.Status == InvoiceStatus.Paid)
            .SumAsync(i => i.Total, cancellationToken);

        var totalInvoices = await invoiceQuery.CountAsync(cancellationToken);

        var customerQuery = _context.Customers.Where(c => c.CompanyId == companyId);
        if (startDate.HasValue) customerQuery = customerQuery.Where(c => c.CreatedAt >= startDate.Value);
        if (endDate.HasValue) customerQuery = customerQuery.Where(c => c.CreatedAt <= endDate.Value);

        var totalCustomers = await customerQuery.CountAsync(cancellationToken);

        var totalProducts = await _context.Products
            .Where(p => p.CompanyId == companyId)
            .CountAsync(cancellationToken);

        var lowStockProductsCount = await _context.Products
            .Where(p => p.CompanyId == companyId && p.IsActive && p.Quantity <= p.MinimumStockLevel && p.Quantity > 0)
            .CountAsync(cancellationToken);

        var pendingInvoicesCount = await invoiceQuery
            .Where(i => i.Status == InvoiceStatus.Pending)
            .CountAsync(cancellationToken);

        return new DashboardOverviewDto
        {
            TotalRevenue = totalRevenue,
            TotalInvoices = totalInvoices,
            TotalCustomers = totalCustomers,
            TotalProducts = totalProducts,
            LowStockProductsCount = lowStockProductsCount,
            PendingInvoicesCount = pendingInvoicesCount
        };
    }
}
