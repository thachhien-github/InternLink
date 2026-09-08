using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternLink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentDownloadCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DownloadCount",
                table: "Documents",
                type: "int",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Documents",
                type: "bit",
                nullable: false,
                defaultValue: true);
            migrationBuilder.AddColumn<string>(
                name: "ArchiveReason",
                table: "Documents",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);
            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "Documents",
                type: "datetime2",
                nullable: true);
            migrationBuilder.AddColumn<string>(
                name: "ArchivedBy",
                table: "Documents",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DownloadCount",
                table: "Documents");
            migrationBuilder.DropColumn(name: "IsPublished", table: "Documents");
            migrationBuilder.DropColumn(name: "ArchiveReason", table: "Documents");
            migrationBuilder.DropColumn(name: "ArchivedAt", table: "Documents");
            migrationBuilder.DropColumn(name: "ArchivedBy", table: "Documents");
        }
    }
}
