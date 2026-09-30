using System;
using System.Threading.Tasks;
using BizFlow.Application.Auth.DTOs;
using BizFlow.Application.Profile.DTOs;

namespace BizFlow.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<LoginResultDto?> AuthenticateAsync(string email, string password);
    Task<LoginResultDto?> RefreshTokenAsync(string refreshToken);
    Task<ProfileDto?> GetProfileAsync(Guid userId);
    Task<bool> UpdateProfileAsync(Guid userId, string firstName, string lastName);
    Task<(bool Success, string[] Errors)> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
}
