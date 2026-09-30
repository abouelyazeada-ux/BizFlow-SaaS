using Microsoft.AspNetCore.Identity;

namespace BizFlow.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public Guid? CompanyId { get; set; } // Nullable for Super Admins
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public List<RefreshToken> RefreshTokens { get; set; } = new();
}
