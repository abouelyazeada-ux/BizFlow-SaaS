using BizFlow.Application.Account.DTOs;
using MediatR;

namespace BizFlow.Application.Account.Queries.GetCurrentUserProfile;

public class GetCurrentUserProfileQuery : IRequest<CurrentUserProfileDto>
{
}
