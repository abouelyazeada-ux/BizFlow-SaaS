using BizFlow.Application.Auth.DTOs;
using MediatR;

namespace BizFlow.Application.Auth.Commands.RefreshToken;

public class RefreshTokenCommand : IRequest<LoginResultDto>
{
    public string RefreshToken { get; set; } = string.Empty;
}
