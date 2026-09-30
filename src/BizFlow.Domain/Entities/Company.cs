using BizFlow.Domain.Common;

namespace BizFlow.Domain.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? SubscriptionPlan { get; set; }
    public bool IsActive { get; set; } = true;
}
