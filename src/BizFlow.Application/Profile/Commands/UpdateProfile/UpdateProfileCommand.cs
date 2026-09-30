using MediatR;

namespace BizFlow.Application.Profile.Commands.UpdateProfile;

public class UpdateProfileCommand : IRequest<bool>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}
