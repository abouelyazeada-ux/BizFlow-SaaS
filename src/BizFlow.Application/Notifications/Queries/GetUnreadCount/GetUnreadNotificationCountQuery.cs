using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Notifications.Queries.GetUnreadCount;

public class GetUnreadNotificationCountQuery : IRequest<int>
{
}

public class GetUnreadNotificationCountQueryHandler : IRequestHandler<GetUnreadNotificationCountQuery, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetUnreadNotificationCountQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(GetUnreadNotificationCountQuery request, CancellationToken cancellationToken)
    {
        var userGuid = Guid.Parse(_currentUserService.UserId!);

        return await _context.Notifications
            .Where(n => (n.UserId == null || n.UserId == userGuid) && !n.IsRead)
            .CountAsync(cancellationToken);
    }
}
