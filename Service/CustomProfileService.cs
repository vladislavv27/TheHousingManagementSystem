using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using VmihailovUi.Models;

namespace VMihailovUi.Service
{
    public class CustomProfileService: IProfileService
    {
       
            private readonly UserManager<ApplicationUser> _userManager;

            public CustomProfileService(UserManager<ApplicationUser> userManager)
            {
                _userManager = userManager;
            }

            public async Task GetProfileDataAsync(ProfileDataRequestContext context)
            {
                var user = await _userManager.GetUserAsync(context.Subject);
                if (user == null)
                {
                    throw new ArgumentException("User not found");
                }

                var roles = await _userManager.GetRolesAsync(user);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim("nameidentifier", user.Id),
                    new Claim("name", user.UserName),
                    new Claim("houseid", user.HouseId),
                    new Claim("apartmentid", user.ApartmentId), 
                    new Claim("residentid", user.ResidentId) 
                };

                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                    claims.Add(new Claim("role", role));
                }

                context.IssuedClaims.AddRange(claims);
            }

            public async Task IsActiveAsync(IsActiveContext context)
            {
                var user = await _userManager.GetUserAsync(context.Subject);
                context.IsActive = (user != null);
            }
    }
}

