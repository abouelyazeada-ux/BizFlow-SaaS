using BizFlow.Application.Auth.DTOs;
using MediatR;

namespace BizFlow.Application.Auth.Commands.Login;

public class LoginCommand : IRequest<LoginResultDto>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
