using System;
using System.Collections.Generic;

namespace BizFlow.Application.Account.DTOs;

public class CurrentUserProfileDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Guid? CompanyId { get; set; }
    public IList<string> Role { get; set; } = new List<string>();
}
