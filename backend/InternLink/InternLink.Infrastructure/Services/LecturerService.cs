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


