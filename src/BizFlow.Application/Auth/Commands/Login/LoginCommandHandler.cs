using System;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Auth.DTOs;
using BizFlow.Application.Common.Interfaces;
using MediatR;

namespace BizFlow.Application.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResultDto>
{
    private readonly IIdentityService _identityService;

    public LoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<LoginResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.AuthenticateAsync(request.Email, request.Password);

        if (result == null)
        {
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        return result;
    }
}
