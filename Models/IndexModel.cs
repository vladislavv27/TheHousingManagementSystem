using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace VmihailovUi.Models
{
    public class IndexModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public IndexModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        [BindProperty]
        public string HouseId { get; set; }

        [BindProperty]
        public string ApartmentId { get; set; }

        [BindProperty]
        public string ResidentId { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);

  

            await _userManager.UpdateAsync(user);

            HouseId = user.HouseId;
            ApartmentId = user.ApartmentId;
            ResidentId = user.ResidentId;

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return RedirectToPage("/Account/Login"); 
            }

            // Check if HouseId is null and set it to a default value if needed
            if (user.HouseId == null)
            {
            
            user.HouseId = HouseId;
            user.ApartmentId = ApartmentId;
            user.ResidentId = ResidentId;

            await _userManager.UpdateAsync(user);

            }
            return RedirectToPage();

        }

    }
}


