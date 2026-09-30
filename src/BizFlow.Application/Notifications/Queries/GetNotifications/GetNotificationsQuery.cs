using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BizFlow.Application.Common.Interfaces;
using BizFlow.Application.Common.Models;
using BizFlow.Application.Notifications.DTOs;
using BizFlow.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BizFlow.Application.Notifications.Queries.GetNotifications;

public class GetNotificationsQuery : IRequest<PagedResult<NotificationDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool UnreadOnly { get; set; } = false;
}

public class GetNotificationsQueryHandler : IRequestHandler<GetNotificationsQuery, PagedResult<NotificationDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetNotificationsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<NotificationDto>> Handle(GetNotificationsQuery request, CancellationToken cancellationToken)
    {
        var userGuid = Guid.Parse(_currentUserService.UserId!);

        var query = _context.Notifications
            .Where(n => n.UserId == null || n.UserId == userGuid)
            .AsNoTracking();

        if (request.UnreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        query = query.OrderByDescending(n => n.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                Link = n.Link
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<NotificationDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
