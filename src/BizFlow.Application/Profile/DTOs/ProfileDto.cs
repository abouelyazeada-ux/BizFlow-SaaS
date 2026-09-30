using System;
using System.Collections.Generic;

namespace BizFlow.Application.Profile.DTOs;

public class ProfileDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? CompanyId { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
}
