using BizFlow.Application.Common.Interfaces;
using BizFlow.Infrastructure.Data;
using BizFlow.Infrastructure.Identity;
using BizFlow.Infrastructure.Reports;
using BizFlow.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BizFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<ApplicationDbContextInitializer>();

        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options => 
        {
            options.SignIn.RequireConfirmedAccount = false;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        services.AddScoped<ICurrentTenantService, CurrentTenantService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<BizFlow.Application.Reports.IReportGenerator, QuestPdfReportGenerator>();

        return services;
    }
}
