namespace BizFlow.Domain.Common;

public interface IMustHaveTenant
{
    Guid CompanyId { get; set; }
}
