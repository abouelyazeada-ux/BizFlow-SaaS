using System;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Auth.DTOs;
using BizFlow.Application.Common.Interfaces;
using MediatR;

namespace BizFlow.Application.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResultDto>
{
    private readonly IIdentityService _identityService;

    public RefreshTokenCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<LoginResultDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.RefreshTokenAsync(request.RefreshToken);

        if (result == null)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        return result;
    }
}
