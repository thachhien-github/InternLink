using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternLink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDefenseDetailsToEvaluations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefenseCouncilName",
                table: "Evaluations",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DefenseDate",
                table: "Evaluations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DefenseExaminerName",
                table: "Evaluations",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DefenseStatus",
                table: "Evaluations",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefenseCouncilName",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "DefenseDate",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "DefenseExaminerName",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "DefenseStatus",
                table: "Evaluations");
        }
    }
}
