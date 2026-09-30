using BizFlow.Domain.Common;
using TaskStatus = BizFlow.Domain.Enums.TaskStatus;

namespace BizFlow.Domain.Entities;

public class AppTask : BaseEntity, IMustHaveTenant
{
    public Guid CompanyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    public Guid? AssignedUserId { get; set; }
    public DateTime? DueDate { get; set; }
    
    public Company Company { get; set; } = null!;
}
