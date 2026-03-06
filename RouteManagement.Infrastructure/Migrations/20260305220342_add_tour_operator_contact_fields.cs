using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RouteManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class add_tour_operator_contact_fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "TourOperators",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPerson",
                table: "TourOperators",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "TourOperators",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "TourOperators");

            migrationBuilder.DropColumn(
                name: "ContactPerson",
                table: "TourOperators");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "TourOperators");
        }
    }
}
