using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VmihailovUi.Migrations
{
    /// <inheritdoc />
    public partial class adding3varib : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApartmentId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HouseId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResidentId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApartmentId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "HouseId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ResidentId",
                table: "AspNetUsers");
        }
    }
}
