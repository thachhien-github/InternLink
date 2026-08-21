using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternLink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class StandardizeColumnNaming : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Users_UploadedById",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Users_AuthorId",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "WeeklyReports",
                newName: "WeeklyReportId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Submissions",
                newName: "SubmissionId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Students",
                newName: "StudentId");

            migrationBuilder.RenameColumn(
                name: "StudentNumber",
                table: "Students",
                newName: "StudentCode");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Notifications",
                newName: "NotificationId");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Notifications",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Lecturers",
                newName: "LecturerId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Internships",
                newName: "InternshipId");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Internships",
                newName: "Position");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Feedbacks",
                newName: "FeedbackId");

            migrationBuilder.RenameColumn(
                name: "AuthorId",
                table: "Feedbacks",
                newName: "LecturerId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_AuthorId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_LecturerId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Evaluations",
                newName: "EvaluationId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Documents",
                newName: "DocumentId");

            migrationBuilder.RenameColumn(
                name: "DocumentType",
                table: "Documents",
                newName: "Category");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Companies",
                newName: "CompanyId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Companies",
                newName: "CompanyName");

            migrationBuilder.RenameColumn(
                name: "ContactName",
                table: "Companies",
                newName: "ContactPerson");

            // Remap User IDs → Lecturer IDs (legacy AuthorId / UploadedById pointed at Users)
            migrationBuilder.Sql("""
                UPDATE f
                SET f.LecturerId = l.LecturerId
                FROM Feedbacks f
                INNER JOIN Lecturers l ON l.UserId = f.LecturerId
                WHERE f.LecturerId IS NOT NULL
                  AND NOT EXISTS (SELECT 1 FROM Lecturers l2 WHERE l2.LecturerId = f.LecturerId);
                """);

            migrationBuilder.Sql("""
                UPDATE d
                SET d.UploadedById = l.LecturerId
                FROM Documents d
                INNER JOIN Lecturers l ON l.UserId = d.UploadedById
                WHERE d.UploadedById IS NOT NULL
                  AND NOT EXISTS (SELECT 1 FROM Lecturers l2 WHERE l2.LecturerId = d.UploadedById);
                """);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Lecturers_UploadedById",
                table: "Documents",
                column: "UploadedById",
                principalTable: "Lecturers",
                principalColumn: "LecturerId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Lecturers_LecturerId",
                table: "Feedbacks",
                column: "LecturerId",
                principalTable: "Lecturers",
                principalColumn: "LecturerId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Lecturers_UploadedById",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Lecturers_LecturerId",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "WeeklyReportId",
                table: "WeeklyReports",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "SubmissionId",
                table: "Submissions",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Students",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "StudentCode",
                table: "Students",
                newName: "StudentNumber");

            migrationBuilder.RenameColumn(
                name: "NotificationId",
                table: "Notifications",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Notifications",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "LecturerId",
                table: "Lecturers",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "InternshipId",
                table: "Internships",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Position",
                table: "Internships",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "FeedbackId",
                table: "Feedbacks",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "LecturerId",
                table: "Feedbacks",
                newName: "AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_LecturerId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_AuthorId");

            migrationBuilder.RenameColumn(
                name: "EvaluationId",
                table: "Evaluations",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "DocumentId",
                table: "Documents",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "Documents",
                newName: "DocumentType");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "Companies",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ContactPerson",
                table: "Companies",
                newName: "ContactName");

            migrationBuilder.RenameColumn(
                name: "CompanyName",
                table: "Companies",
                newName: "Name");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Users_UploadedById",
                table: "Documents",
                column: "UploadedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Users_AuthorId",
                table: "Feedbacks",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
