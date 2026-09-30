using BizFlow.Application.Profile.DTOs;
using MediatR;

namespace BizFlow.Application.Profile.Queries.GetProfile;

public class GetProfileQuery : IRequest<ProfileDto>
{
}
