using System;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Exceptions;
using BizFlow.Application.Common.Interfaces;
using BizFlow.Domain.Entities;
using MediatR;

namespace BizFlow.Application.Notifications.Commands.MarkAsRead;

public class MarkNotificationAsReadCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class MarkNotificationAsReadCommandHandler : IRequestHandler<MarkNotificationAsReadCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public MarkNotificationAsReadCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        var notification = await _context.Notifications.FindAsync(new object[] { request.Id }, cancellationToken);

        if (notification == null)
        {
            throw new NotFoundException(nameof(Notification), request.Id);
        }

        var userGuid = Guid.Parse(_currentUserService.UserId!);
        if (notification.UserId.HasValue && notification.UserId != userGuid)
        {
            throw new UnauthorizedAccessException("You cannot mark another user's notification as read.");
        }

        notification.MarkAsRead();
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
