using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternLink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWeeklyReportFeedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "SubmissionId",
                table: "Feedbacks",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "WeeklyReportId",
                table: "Feedbacks",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_WeeklyReportId",
                table: "Feedbacks",
                column: "WeeklyReportId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_WeeklyReports_WeeklyReportId",
                table: "Feedbacks",
                column: "WeeklyReportId",
                principalTable: "WeeklyReports",
                principalColumn: "WeeklyReportId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_WeeklyReports_WeeklyReportId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_WeeklyReportId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "WeeklyReportId",
                table: "Feedbacks");

            migrationBuilder.AlterColumn<Guid>(
                name: "SubmissionId",
                table: "Feedbacks",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
