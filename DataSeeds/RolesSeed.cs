using Microsoft.AspNetCore.Identity;
using static System.Formats.Asn1.AsnWriter;
using System.Data;
using System.Net.NetworkInformation;
using VmihailovUi.Models;

namespace VMihailovUi.DataSeeds
{
    public class RolesSeed
    {
        public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleNames = new[] { "Manager", "Resident" };

            foreach (var roleName in roleNames)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    var role = new IdentityRole(roleName);
                    await roleManager.CreateAsync(role);
                }
            }

            var managerUser = await userManager.FindByNameAsync("manager@test.lv");
            if (managerUser != null)
            {
                await userManager.AddToRoleAsync(managerUser, "Manager");
            }

            var residentUser = await userManager.FindByNameAsync("resident@test.lv");
            if (residentUser != null)
            {
                await userManager.AddToRoleAsync(residentUser, "Resident");
            }
        }
    }
}
