using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RouteManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class fix_seasons_unique_index_filter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seasons_Year_SeasonType",
                table: "Seasons");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_Year_SeasonType",
                table: "Seasons",
                columns: new[] { "Year", "SeasonType" },
                unique: true,
                filter: "[IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seasons_Year_SeasonType",
                table: "Seasons");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_Year_SeasonType",
                table: "Seasons",
                columns: new[] { "Year", "SeasonType" },
                unique: true);
        }
    }
}
