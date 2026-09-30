using BizFlow.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using BizFlow.Domain.Constants;

namespace BizFlow.API.Middlewares;

public class TenantResolverMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolverMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ICurrentTenantService currentTenantService)
    {
        // Try to get tenant ID from header
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantIdValues))
        {
            if (Guid.TryParse(tenantIdValues.FirstOrDefault(), out var tenantId))
            {
                currentTenantService.SetTenant(tenantId);
            }
        }
        else if (context.User.Identity?.IsAuthenticated == true)
        {
            // Fallback to getting tenant ID from JWT Claims if available
            var tenantClaim = context.User.Claims.FirstOrDefault(c => c.Type == CustomClaimTypes.CompanyId);
            if (tenantClaim != null && Guid.TryParse(tenantClaim.Value, out var tenantId))
            {
                currentTenantService.SetTenant(tenantId);
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { Message = "Tenant ID is missing or invalid in token." });
                return;
            }
        }

        await _next(context);
    }
}
