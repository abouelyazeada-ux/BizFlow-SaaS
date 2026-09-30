using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BizFlow.API.Infrastructure;

public class ApiResponseFilter : IAsyncResultFilter
{
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        if (context.Result is ObjectResult objectResult)
        {
            // Skip wrapping if it's already an error wrapper (ProblemDetails or anonymous error)
            var type = objectResult.Value?.GetType();
            if (type != null && (type.Name.Contains("ProblemDetails") || type.GetProperty("success") != null))
            {
                await next();
                return;
            }

            var wrapped = new
            {
                success = true,
                data = objectResult.Value,
                message = ""
            };
            context.Result = new ObjectResult(wrapped)
            {
                StatusCode = objectResult.StatusCode
            };
        }
        else if (context.Result is StatusCodeResult statusCodeResult && statusCodeResult.StatusCode >= 200 && statusCodeResult.StatusCode < 300)
        {
             var wrapped = new
             {
                 success = true,
                 data = (object?)null,
                 message = ""
             };
             context.Result = new ObjectResult(wrapped)
             {
                 StatusCode = statusCodeResult.StatusCode
             };
        }

        await next();
    }
}
