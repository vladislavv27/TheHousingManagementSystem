using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using VmihailovUi.Models;

namespace VMihailovUi.Factories
{
    public class AppUserClaimsPrincipalFactory: UserClaimsPrincipalFactory<ApplicationUser>
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AppUserClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, optionsAccessor)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);

            // Fetch user roles from the database
            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                identity.AddClaim(new Claim("role", role));
            }

            return identity;
        }
    }
}
