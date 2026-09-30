using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using MediatR;
using BizFlow.Application.Common.Exceptions;

namespace BizFlow.Application.Profile.Commands.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUserService;

    public ChangePasswordCommandHandler(IIdentityService identityService, ICurrentUserService currentUserService)
    {
        _identityService = identityService;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(_currentUserService.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = Guid.Parse(_currentUserService.UserId);
        
        var result = await _identityService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
        
        if (!result.Success)
        {
            var failures = result.Errors.Select(e => new FluentValidation.Results.ValidationFailure("Password", e)).ToList();
            throw new ValidationException(failures);
        }

        return true;
    }
}
