using System;
using System.Threading.Tasks;
using BizFlow.Application.Common.Models;
using BizFlow.Application.Notifications.Commands.MarkAllAsRead;
using BizFlow.Application.Notifications.Commands.MarkAsRead;
using BizFlow.Application.Notifications.DTOs;
using BizFlow.Application.Notifications.Queries.GetNotifications;
using BizFlow.Application.Notifications.Queries.GetUnreadCount;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BizFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<NotificationDto>>> GetNotifications([FromQuery] GetNotificationsQuery query)
    {
        return await _mediator.Send(query);
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        return await _mediator.Send(new GetUnreadNotificationCountQuery());
    }

    [HttpPut("{id:guid}/read")]
    public async Task<ActionResult<bool>> MarkAsRead(Guid id)
    {
        return await _mediator.Send(new MarkNotificationAsReadCommand { Id = id });
    }

    [HttpPut("read-all")]
    public async Task<ActionResult<bool>> MarkAllAsRead()
    {
        return await _mediator.Send(new MarkAllNotificationsAsReadCommand());
    }
}
