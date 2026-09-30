using System.Threading.Tasks;
using BizFlow.Application.Account.Queries.GetCurrentUserProfile;
using BizFlow.Application.Account.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BizFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly IMediator _mediator;

    public AccountController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<CurrentUserProfileDto>> GetProfile()
    {
        var result = await _mediator.Send(new GetCurrentUserProfileQuery());
        return Ok(result);
    }
}
