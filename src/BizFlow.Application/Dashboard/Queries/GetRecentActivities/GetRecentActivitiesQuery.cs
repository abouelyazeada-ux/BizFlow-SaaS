using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Dashboard.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Dashboard.Queries.GetRecentActivities;

public record GetRecentActivitiesQuery(int Limit = 5) : IRequest<List<RecentActivityDto>>;

public class GetRecentActivitiesQueryHandler : IRequestHandler<GetRecentActivitiesQuery, List<RecentActivityDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentTenantService _currentTenantService;

    public GetRecentActivitiesQueryHandler(IApplicationDbContext context, ICurrentTenantService currentTenantService)
    {
        _context = context;
        _currentTenantService = currentTenantService;
    }

    public async Task<List<RecentActivityDto>> Handle(GetRecentActivitiesQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentTenantService.TenantId ?? throw new UnauthorizedAccessException();
        var activities = new List<RecentActivityDto>();

        // Get latest invoices
        var recentInvoices = await _context.Invoices
            .Where(i => i.CompanyId == companyId)
            .OrderByDescending(i => i.CreatedAt)
            .Take(request.Limit)
            .Select(i => new RecentActivityDto
            {
                Id = i.Id.ToString(),
                Type = "Invoice",
                Description = $"New invoice {i.InvoiceNumber} created",
                Timestamp = i.CreatedAt
            })
            .ToListAsync(cancellationToken);
            
        activities.AddRange(recentInvoices);

        // Get latest customers
        var recentCustomers = await _context.Customers
            .Where(c => c.CompanyId == companyId)
            .OrderByDescending(c => c.CreatedAt)
            .Take(request.Limit)
            .Select(c => new RecentActivityDto
            {
                Id = c.Id.ToString(),
                Type = "Customer",
                Description = $"New customer {c.Name} registered",
                Timestamp = c.CreatedAt
            })
            .ToListAsync(cancellationToken);

        activities.AddRange(recentCustomers);

        return activities
            .OrderByDescending(a => a.Timestamp)
            .Take(request.Limit)
            .ToList();
    }
}
