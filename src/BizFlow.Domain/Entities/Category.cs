using BizFlow.Domain.Common;

namespace BizFlow.Domain.Entities;

public class Category : BaseEntity, IMustHaveTenant
{
    public Guid CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public Company Company { get; set; } = null!;
}
