using AutoMapper;

using ClosedXML.Excel;

using InternLink.Application.DTOs;

using InternLink.Application.Interfaces;

using InternLink.Domain.Entities;

using InternLink.Domain.Enums;

using InternLink.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;



namespace InternLink.Infrastructure.Services;



public class LecturerService : ILecturerService

{

    private readonly AppDbContext _db;

    private readonly IMapper _mapper;

    private readonly INotificationService _notificationService;



    public LecturerService(AppDbContext db, IMapper mapper, INotificationService notificationService)
    {
        _db = db;
        _mapper = mapper;
        _notificationService = notificationService;
    }

    public async Task<LecturerOverviewDto?> GetMeAsync(Guid userId)
    {
        var lecturer = await _db.Lecturers
            .FirstOrDefaultAsync(l => l.UserId == userId && !l.IsDeleted);

        if (lecturer == null)
            return null;

        var internships = await _db.Internships
            .Where(i => i.LecturerId == lecturer.Id && !i.IsDeleted)
            .Include(i => i.Student)
            .Include(i => i.Company)
            .Include(i => i.Submissions)
            .Include(i => i.WeeklyReports)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        var summaries = internships.Select(i => new LecturerInternshipSummaryDto
        {
            InternshipId = i.Id,
            StudentId = i.StudentId,
            StudentCode = i.Student?.StudentCode ?? string.Empty,
            StudentName = i.Student?.FullName ?? string.Empty,
            CompanyName = i.Company?.CompanyName,
            Status = i.Status.ToString(),
            SubmissionCount = i.Submissions?.Count(s => !s.IsDeleted) ?? 0,
            WeeklyReportCount = i.WeeklyReports?.Count(w => !w.IsDeleted) ?? 0,
            StartDate = i.StartDate,
            EndDate = i.EndDate
        }).ToList();

        var statusCounts = summaries
            .GroupBy(s => s.Status)
            .ToDictionary(g => g.Key, g => g.Count());

        return new LecturerOverviewDto
        {
            Lecturer = _mapper.Map<LecturerDto>(lecturer),
            TotalInternships = summaries.Count,
            StatusCounts = statusCounts,
            Internships = summaries
        };
    }

    public async Task<LecturerDashboardStatsDto> GetDashboardStatsAsync(Guid userId)
    {
        var lecturerId = await ResolveLecturerIdAsync(userId);
        if (lecturerId == null)
        {
            return new LecturerDashboardStatsDto();
        }

        var internships = await _db.Internships
            .Where(i => i.LecturerId == lecturerId.Value && !i.IsDeleted)
            .Include(i => i.Submissions)
            .Include(i => i.WeeklyReports)
            .ToListAsync();

        var internshipIds = internships.Select(i => i.Id).ToList();

        var evaluations = await _db.Evaluations
            .Where(e => !e.IsDeleted && internshipIds.Contains(e.InternshipId))
            .ToListAsync();

        var total = internships.Count;
        var interning = internships.Count(i =>
            i.Status is InternshipStatus.InProgress
                or InternshipStatus.BehindSchedule
                or InternshipStatus.AwaitingFeedback
                or InternshipStatus.RequiresRevision);
        var completed = internships.Count(i => i.Status == InternshipStatus.Completed);
        
        var pendingSubmissions = internships.Sum(i => i.Submissions.Count(s => !s.IsDeleted && s.Status == SubmissionStatus.Submitted));
        var pendingReports = internships.Sum(i => i.WeeklyReports.Count(w => !w.IsDeleted && w.Status == WeeklyReportStatus.Submitted));
        var pendingReviews = pendingSubmissions + pendingReports;

        var overdueReports = internships.Sum(i => i.WeeklyReports.Count(w => !w.IsDeleted && w.Status == WeeklyReportStatus.Draft && w.CreatedAt < DateTime.UtcNow.AddDays(-7)));

        var finalizedEvals = evaluations.Where(e => e.IsFinalized).ToList();
        var avgGrade = finalizedEvals.Any() ? Math.Round(finalizedEvals.Average(e => e.FinalGrade), 2) : 0m;

        var statusDict = internships
            .GroupBy(i => i.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        return new LecturerDashboardStatsDto
        {
            TotalStudents = total,
            InterningCount = interning,
            PendingReviewsCount = pendingReviews,
            CompletedCount = completed,
            OverdueReportsCount = overdueReports,
            AverageGrade = avgGrade,
            EvaluatedCount = evaluations.Count,
            StatusDistribution = statusDict
        };
    }

    public async Task<IEnumerable<LecturerStudentListItemDto>> GetAssignedStudentsAsync(Guid userId, string? search = null, string? status = null)
    {
        var lecturerId = await ResolveLecturerIdAsync(userId);
        if (lecturerId == null)
            return Array.Empty<LecturerStudentListItemDto>();

        var query = _db.Internships
            .Where(i => i.LecturerId == lecturerId.Value && !i.IsDeleted)
            .Include(i => i.Student)
            .Include(i => i.Company)
            .Include(i => i.Submissions)
            .Include(i => i.WeeklyReports)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(i =>
                (i.Student != null && (i.Student.FullName.ToLower().Contains(s) || i.Student.StudentCode.ToLower().Contains(s) || (i.Student.Class != null && i.Student.Class.ToLower().Contains(s)))) ||
                (i.Company != null && i.Company.CompanyName.ToLower().Contains(s)) ||
                (i.Position != null && i.Position.ToLower().Contains(s)));
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<InternshipStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(i => i.Status == parsedStatus);
        }

        var internships = await query
            .OrderBy(i => i.Student != null ? i.Student.FullName : string.Empty)
            .ToListAsync();

        var internshipIds = internships.Select(i => i.Id).ToList();

        var evaluations = await _db.Evaluations
            .Where(e => !e.IsDeleted && internshipIds.Contains(e.InternshipId))
            .ToDictionaryAsync(e => e.InternshipId);

        var result = new List<LecturerStudentListItemDto>();

        foreach (var i in internships)
        {
            evaluations.TryGetValue(i.Id, out var eval);
            var weeklyCount = i.WeeklyReports?.Count(w => !w.IsDeleted) ?? 0;
            var pendingReportCount = i.WeeklyReports?.Count(w => !w.IsDeleted && w.Status == WeeklyReportStatus.Submitted) ?? 0;
            var submissionCount = i.Submissions?.Count(s => !s.IsDeleted) ?? 0;

            // Simple progress calculation based on weeks/reports/status
            int progressPercent = 0;
            if (i.Status == InternshipStatus.Completed)
            {
                progressPercent = 100;
            }
            else if (i.Status is InternshipStatus.InProgress
                or InternshipStatus.BehindSchedule
                or InternshipStatus.AwaitingFeedback
                or InternshipStatus.RequiresRevision)
            {
                // Typically 10-12 weekly reports expected
                progressPercent = Math.Min(95, Math.Max(10, weeklyCount * 8));
            }

            result.Add(new LecturerStudentListItemDto
            {
                StudentId = i.StudentId,
                InternshipId = i.Id,
                StudentCode = i.Student?.StudentCode ?? string.Empty,
                FullName = i.Student?.FullName ?? string.Empty,
                Email = i.Student?.Email,
                Phone = i.Student?.Phone,
                Class = i.Student?.Class,
                Major = i.Student?.Major,
                CompanyId = i.CompanyId,
                CompanyName = i.Company?.CompanyName,
                Position = i.Position,
                InternshipStatus = i.Status.ToString(),
                StartDate = i.StartDate,
                EndDate = i.EndDate,
                WeeklyReportCount = weeklyCount,
                PendingReportCount = pendingReportCount,
                SubmissionCount = submissionCount,
                FinalGrade = eval?.FinalGrade,
                HasEvaluation = eval != null,
                IsEvaluationFinalized = eval?.IsFinalized ?? false,
                ProgressPercent = progressPercent
            });
        }

        return result;
    }

    public async Task<IEnumerable<LecturerCompanySummaryDto>> GetAssignedCompaniesAsync(Guid userId)
    {
        var lecturerId = await ResolveLecturerIdAsync(userId);
        if (lecturerId == null)
            return Array.Empty<LecturerCompanySummaryDto>();

        var internships = await _db.Internships
            .Where(i => i.LecturerId == lecturerId.Value && !i.IsDeleted && i.CompanyId != null)
            .Include(i => i.Company)
            .ToListAsync();

        var companyGroups = internships
            .Where(i => i.Company != null && !i.Company.IsDeleted)
            .GroupBy(i => i.Company!)
            .Select(g => new LecturerCompanySummaryDto
            {
                Id = g.Key.Id,
                CompanyName = g.Key.CompanyName,
                Industry = g.Key.Industry,
                ContactPerson = g.Key.ContactPerson,
                ContactEmail = g.Key.ContactEmail,
                ContactPhone = g.Key.ContactPhone,
                Address = g.Key.Address,
                AssignedStudentsCount = g.Count()
            })
            .OrderByDescending(c => c.AssignedStudentsCount)
            .ThenBy(c => c.CompanyName)
            .ToList();

        return companyGroups;
    }




    public async Task<IEnumerable<InternshipDto>> GetInternshipsAsync(Guid userId)

    {

        var lecturerId = await ResolveLecturerIdAsync(userId);

        if (lecturerId == null)

            return Array.Empty<InternshipDto>();



        var internships = await _db.Internships

            .Where(i => !i.IsDeleted && i.LecturerId == lecturerId && i.Semester!.Status == SemesterStatus.Active)

            .Include(i => i.Student)

            .Include(i => i.Company)

            .Include(i => i.Semester)

            .OrderByDescending(i => i.CreatedAt)

            .ToListAsync();



        return _mapper.Map<List<InternshipDto>>(internships);

    }



    public async Task<InternshipDetailDto?> GetInternshipAsync(Guid internshipId, Guid userId)

    {

        var lecturerId = await ResolveLecturerIdAsync(userId);

        if (lecturerId == null)

            return null;



        var internship = await _db.Internships

            .Where(i => !i.IsDeleted && i.LecturerId == lecturerId)

            .Include(i => i.Student)

            .Include(i => i.Company)

            .Include(i => i.Submissions.Where(s => !s.IsDeleted))

                .ThenInclude(s => s.Feedbacks.Where(f => !f.IsDeleted))

                    .ThenInclude(f => f.Lecturer)

            .FirstOrDefaultAsync(i => i.Id == internshipId);



        return internship == null ? null : _mapper.Map<InternshipDetailDto>(internship);

    }



    public async Task<IEnumerable<SubmissionDto>> GetSubmissionsByInternshipAsync(Guid internshipId, Guid userId)

    {

        var lecturerId = await ResolveLecturerIdAsync(userId);

        if (lecturerId == null)

            return Array.Empty<SubmissionDto>();



        var ownsInternship = await _db.Internships

            .AnyAsync(i => i.Id == internshipId && i.LecturerId == lecturerId && !i.IsDeleted);

        if (!ownsInternship)

            return Array.Empty<SubmissionDto>();



        var submissions = await _db.Submissions

            .Where(s => s.InternshipId == internshipId && !s.IsDeleted)

            .Include(s => s.Feedbacks.Where(f => !f.IsDeleted))

                .ThenInclude(f => f.Lecturer)

            .OrderByDescending(s => s.SubmittedAt)

            .ToListAsync();



        return _mapper.Map<List<SubmissionDto>>(submissions);

    }



    public async Task<FeedbackDto?> AddFeedbackAsync(Guid submissionId, Guid authorId, CreateFeedbackRequest request)

    {

        var lecturerId = await ResolveLecturerIdAsync(authorId);



        var submission = await _db.Submissions

            .Include(s => s.Internship)

                .ThenInclude(i => i.Student)

            .FirstOrDefaultAsync(s => s.Id == submissionId && !s.IsDeleted);



        if (submission == null)

            return null;



        if (lecturerId == null || submission.Internship.LecturerId != lecturerId)

            throw new UnauthorizedAccessException("You can only give feedback on internships assigned to you");



        var newStatus = string.IsNullOrWhiteSpace(request.NewStatus)

            ? SubmissionStatus.RevisionRequested

            : Enum.TryParse<SubmissionStatus>(request.NewStatus, true, out var parsed)

                ? parsed

                : throw new InvalidOperationException($"Invalid status: {request.NewStatus}");



        submission.Status = newStatus;

        submission.UpdatedAt = DateTime.UtcNow;



        var feedback = new Feedback

        {

            Id = Guid.NewGuid(),

            SubmissionId = submissionId,

            LecturerId = lecturerId,

            Comment = request.Comment,

            IsPublic = request.IsPublic,

            CreatedAt = DateTime.UtcNow

        };



        await _db.Feedbacks.AddAsync(feedback);

        await _db.SaveChangesAsync();



        var studentUserId = submission.Internship.Student?.UserId;

        if (studentUserId.HasValue)

        {

            await _notificationService.CreateAsync(new CreateNotificationRequest

            {

                UserId = studentUserId.Value,

                Title = "New feedback on your submission",

                Content = $"Your submission \"{submission.Title ?? submission.Type.ToString()}\" received feedback.",

                Link = $"/submissions/{submission.Id}"

            });

        }



        await _db.Entry(feedback).Reference(f => f.Lecturer).LoadAsync();



        return _mapper.Map<FeedbackDto>(feedback);

    }



    public async Task<byte[]> ExportEndOfTermExcelAsync(Guid userId)

    {

        var lecturerId = await ResolveLecturerIdAsync(userId)

            ?? throw new UnauthorizedAccessException("Lecturer profile not found for current user");



        var lecturer = await _db.Lecturers

            .AsNoTracking()

            .FirstAsync(l => l.Id == lecturerId && !l.IsDeleted);



        var internships = await _db.Internships

            .AsNoTracking()

            .Where(i => !i.IsDeleted && i.LecturerId == lecturerId)

            .Include(i => i.Student)

            .Include(i => i.Company)

            .OrderBy(i => i.Student!.FullName)

            .ToListAsync();



        var internshipIds = internships.Select(i => i.Id).ToList();



        var evaluations = await _db.Evaluations

            .AsNoTracking()

            .Where(e => !e.IsDeleted && internshipIds.Contains(e.InternshipId))

            .ToDictionaryAsync(e => e.InternshipId);



        var weeklyReportCounts = await _db.WeeklyReports

            .AsNoTracking()

            .Where(r => !r.IsDeleted && internshipIds.Contains(r.InternshipId))

            .GroupBy(r => r.InternshipId)

            .Select(g => new { InternshipId = g.Key, Count = g.Count() })

            .ToDictionaryAsync(x => x.InternshipId, x => x.Count);



        var submissionCounts = await _db.Submissions

            .AsNoTracking()

            .Where(s => !s.IsDeleted && internshipIds.Contains(s.InternshipId))

            .GroupBy(s => s.InternshipId)

            .Select(g => new { InternshipId = g.Key, Count = g.Count() })

            .ToDictionaryAsync(x => x.InternshipId, x => x.Count);



        using var workbook = new XLWorkbook();

        var sheet = workbook.Worksheets.Add("TongKetCuoiKy");



        sheet.Cell(1, 1).Value = "InternLink - Bao cao tong ket cuoi ky thuc tap";

        sheet.Cell(2, 1).Value = "Giang vien:";

        sheet.Cell(2, 2).Value = lecturer.FullName;

        sheet.Cell(3, 1).Value = "Ma GV:";

        sheet.Cell(3, 2).Value = lecturer.StaffCode;

        sheet.Cell(4, 1).Value = "Ngay xuat:";

        sheet.Cell(4, 2).Value = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm") + " UTC";



        var headerRow = 6;

        var headers = new[]

        {

            "MSSV", "HoTen", "Lop", "Nganh", "TenDoanhNghiep", "ViTri",

            "NgayBatDau", "NgayKetThuc", "TrangThai", "SoBaoCaoTuan", "SoBaiNop",

            "DiemKyThuat", "DiemGiaoTiep", "DiemTeamwork", "DiemChuDong", "DiemTong",

            "DaChotDiem", "NhanXet"

        };



        for (var col = 0; col < headers.Length; col++)

            sheet.Cell(headerRow, col + 1).Value = headers[col];



        sheet.Row(headerRow).Style.Font.Bold = true;



        var row = headerRow + 1;

        foreach (var internship in internships)

        {

            evaluations.TryGetValue(internship.Id, out var evaluation);

            weeklyReportCounts.TryGetValue(internship.Id, out var weeklyCount);

            submissionCounts.TryGetValue(internship.Id, out var submissionCount);



            sheet.Cell(row, 1).Value = internship.Student?.StudentCode ?? string.Empty;

            sheet.Cell(row, 2).Value = internship.Student?.FullName ?? string.Empty;

            sheet.Cell(row, 3).Value = internship.Student?.Class ?? string.Empty;

            sheet.Cell(row, 4).Value = internship.Student?.Major ?? string.Empty;

            sheet.Cell(row, 5).Value = internship.Company?.CompanyName ?? string.Empty;

            sheet.Cell(row, 6).Value = internship.Position ?? string.Empty;

            sheet.Cell(row, 7).Value = internship.StartDate?.ToString("yyyy-MM-dd") ?? string.Empty;

            sheet.Cell(row, 8).Value = internship.EndDate?.ToString("yyyy-MM-dd") ?? string.Empty;

            sheet.Cell(row, 9).Value = internship.Status.ToString();

            sheet.Cell(row, 10).Value = weeklyCount;

            sheet.Cell(row, 11).Value = submissionCount;



            if (evaluation != null)

            {

                sheet.Cell(row, 12).Value = evaluation.TechnicalScore;

                sheet.Cell(row, 13).Value = evaluation.CommunicationScore;

                sheet.Cell(row, 14).Value = evaluation.TeamworkScore;

                sheet.Cell(row, 15).Value = evaluation.InitiativeScore;

                sheet.Cell(row, 16).Value = evaluation.FinalGrade;

                sheet.Cell(row, 17).Value = evaluation.IsFinalized ? "Co" : "Chua";

                sheet.Cell(row, 18).Value = evaluation.Comments ?? string.Empty;

            }



            row++;

        }



        sheet.Columns().AdjustToContents();

        sheet.SheetView.FreezeRows(headerRow);



        using var stream = new MemoryStream();

        workbook.SaveAs(stream);

        return stream.ToArray();

    }



    private async Task<Guid?> ResolveLecturerIdAsync(Guid userId)

    {

        return await _db.Lecturers

            .Where(l => l.UserId == userId && !l.IsDeleted)

            .Select(l => (Guid?)l.Id)

            .FirstOrDefaultAsync();

    }

}


