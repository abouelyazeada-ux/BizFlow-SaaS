using System;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using MediatR;

namespace BizFlow.Application.Profile.Commands.UpdateProfile;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, bool>
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUserService;

    public UpdateProfileCommandHandler(IIdentityService identityService, ICurrentUserService currentUserService)
    {
        _identityService = identityService;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(_currentUserService.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = Guid.Parse(_currentUserService.UserId);
        
        var result = await _identityService.UpdateProfileAsync(userId, request.FirstName, request.LastName);
        
        if (!result)
        {
            throw new Exception("Failed to update profile.");
        }

        return true;
    }
}
