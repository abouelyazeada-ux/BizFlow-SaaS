using System;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Account.DTOs;
using MediatR;

namespace BizFlow.Application.Account.Queries.GetCurrentUserProfile;

public class GetCurrentUserProfileQueryHandler : IRequestHandler<GetCurrentUserProfileQuery, CurrentUserProfileDto>
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUserService;

    public GetCurrentUserProfileQueryHandler(IIdentityService identityService, ICurrentUserService currentUserService)
    {
        _identityService = identityService;
        _currentUserService = currentUserService;
    }

    public async Task<CurrentUserProfileDto> Handle(GetCurrentUserProfileQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(_currentUserService.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = Guid.Parse(_currentUserService.UserId);
        var profile = await _identityService.GetProfileAsync(userId);
        
        if (profile == null)
        {
            throw new Exception("Profile not found.");
        }

        return new CurrentUserProfileDto
        {
            Id = profile.UserId,
            Email = profile.Email,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            CompanyId = profile.CompanyId,
            Role = profile.Roles
        };
    }
}
