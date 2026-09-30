using BizFlow.API.Extensions;
using BizFlow.API.Infrastructure;
using BizFlow.Application;
using BizFlow.Infrastructure;
using BizFlow.Infrastructure.Data;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);


// Application
builder.Services.AddApplicationServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<BizFlow.Application.Common.Interfaces.ICurrentUserService, BizFlow.API.Services.CurrentUserService>();


// Infrastructure
builder.Services.AddInfrastructureServices(builder.Configuration);


// Authentication
builder.Services.AddJwtAuthentication(builder.Configuration);


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// Controllers
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ApiResponseFilter>();
});


// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1",
        new OpenApiInfo
        {
            Title = "BizFlow API",
            Version = "v1",
            Description = "BizFlow SaaS Backend API"
        });


    options.AddSecurityDefinition("Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter JWT token: Bearer {token}"
        });


    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                    new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
});


// Exception Handling
builder.Services.AddExceptionHandler<CustomExceptionHandler>();

builder.Services.AddProblemDetails();



var app = builder.Build();



// Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();


    using var scope = app.Services.CreateScope();

    var initializer =
        scope.ServiceProvider
        .GetRequiredService<ApplicationDbContextInitializer>();

    await initializer.SeedAsync();
}



app.UseCors("AllowFrontend");


app.UseExceptionHandler();


app.UseHttpsRedirection();


app.UseAuthentication();

app.UseMiddleware<BizFlow.API.Middlewares.TenantResolverMiddleware>();

app.UseAuthorization();


app.MapControllers();


app.Run();