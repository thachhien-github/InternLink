using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternLink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLecturerEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Internships_Users_LecturerId",
                table: "Internships");

            migrationBuilder.CreateTable(
                name: "Lecturers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    StaffCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Department = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lecturers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lecturers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lecturers_StaffCode",
                table: "Lecturers",
                column: "StaffCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lecturers_UserId",
                table: "Lecturers",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            // Backfill Lecturer profiles from existing Lecturer users, then remap Internship.LecturerId
            migrationBuilder.Sql("""
                INSERT INTO Lecturers (Id, UserId, StaffCode, FullName, Email, Phone, Department, CreatedAt, IsDeleted)
                SELECT
                    NEWID(),
                    u.Id,
                    CASE
                        WHEN EXISTS (SELECT 1 FROM Lecturers l WHERE l.StaffCode = CONCAT('GV-', u.Username))
                            THEN CONCAT('GV-', LEFT(CONVERT(nvarchar(36), u.Id), 8))
                        ELSE CONCAT('GV-', u.Username)
                    END,
                    COALESCE(u.FullName, u.Username),
                    u.Email,
                    NULL,
                    NULL,
                    GETUTCDATE(),
                    0
                FROM Users u
                WHERE u.Role = 1
                  AND u.IsDeleted = 0
                  AND NOT EXISTS (SELECT 1 FROM Lecturers l WHERE l.UserId = u.Id);

                UPDATE i
                SET LecturerId = l.Id
                FROM Internships i
                INNER JOIN Lecturers l ON l.UserId = i.LecturerId;

                UPDATE Internships
                SET LecturerId = NULL
                WHERE LecturerId IS NOT NULL
                  AND LecturerId NOT IN (SELECT Id FROM Lecturers);
                """);

            migrationBuilder.AddForeignKey(
                name: "FK_Internships_Lecturers_LecturerId",
                table: "Internships",
                column: "LecturerId",
                principalTable: "Lecturers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Internships_Lecturers_LecturerId",
                table: "Internships");

            migrationBuilder.DropTable(
                name: "Lecturers");

            migrationBuilder.AddForeignKey(
                name: "FK_Internships_Users_LecturerId",
                table: "Internships",
                column: "LecturerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
