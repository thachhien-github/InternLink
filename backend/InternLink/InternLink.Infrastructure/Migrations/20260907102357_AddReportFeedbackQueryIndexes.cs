using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternLink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReportFeedbackQueryIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_SubmissionId",
                table: "Feedbacks");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyReports_InternshipId_Status_WeekNumber",
                table: "WeeklyReports",
                columns: new[] { "InternshipId", "Status", "WeekNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_SubmissionId_CreatedAt",
                table: "Feedbacks",
                columns: new[] { "SubmissionId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_WeeklyReportId_CreatedAt",
                table: "Feedbacks",
                columns: new[] { "WeeklyReportId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WeeklyReports_InternshipId_Status_WeekNumber",
                table: "WeeklyReports");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_SubmissionId_CreatedAt",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_WeeklyReportId_CreatedAt",
                table: "Feedbacks");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_SubmissionId",
                table: "Feedbacks",
                column: "SubmissionId");
        }
    }
}
