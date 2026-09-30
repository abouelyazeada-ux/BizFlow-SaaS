using BizFlow.Application.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace BizFlow.API.Infrastructure;

public class CustomExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is ValidationException validationException)
        {
            var response = new
            {
                success = false,
                message = "One or more validation errors occurred.",
                errors = validationException.Errors
            };

            httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
            return true;
        }
        
        if (exception is KeyNotFoundException)
        {
            var response = new
            {
                success = false,
                message = exception.Message,
                errors = new { }
            };
            
            httpContext.Response.StatusCode = StatusCodes.Status404NotFound;
            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
            return true;
        }
        
        if (exception is UnauthorizedAccessException)
        {
            var response = new
            {
                success = false,
                message = "Unauthorized access.",
                errors = new { }
            };
            
            httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
            return true;
        }

        // Generic error
        var genericResponse = new
        {
            success = false,
            message = "An unexpected error occurred.",
            errors = new { detail = exception.Message }
        };
        
        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(genericResponse, cancellationToken);
        
        return true;
    }
}
