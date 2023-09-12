using Microsoft.AspNetCore.Identity;

namespace VmihailovUi.Models;

public class ApplicationUser : IdentityUser
{
    public virtual string? HouseId { get; set; }
    public virtual string? ApartmentId { get; set; }
    public virtual string? ResidentId { get; set; }
}
