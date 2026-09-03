import { useState, useEffect, useCallback } from "react";
import { Toast } from "../../../components/common/Toast";
import {
  BarChart2,
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  Award,
  Printer,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Filter,
  Star,
  GraduationCap,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import { Panel } from "../../../components/common/Panel";
import { apiRequest } from "../../../lib/apiClient";
import { lecturerExportService } from "../../../services/lecturerExport.service";
import { useSemester } from "../../../contexts/SemesterContext";

interface DashboardStatsDto {
  totalStudents: number;
  interningCount: number;
  pendingReviewsCount: number;
  completedCount: number;
  overdueReportsCount: number;
  averageGrade: number;
  evaluatedCount: number;
  statusDistribution: Record<string, number>;
}

interface WeeklyTrendItem {
  weekNumber: number;
  label: string;
  onTimeCount: number;
  lateCount: number;
  missingCount: number;
  totalStudents: number;
  complianceRate: number;
}

interface GradeDistribution {
  excellentCount: number;
  goodCount: number;
  fairCount: number;
  averageCount: number;
  failCount: number;
  notYetGradedCount: number;
  overallAverage: number;
  totalStudents: number;
}

interface CompanyStatItem {
  companyName: string;
  studentCount: number;
  positions: string;
  averageGrade: number;
  partnershipLevel: string;
}

interface ActivityStats {
  reviewedReportsCount: number;
  pendingReportsCount: number;
  completedStudentsCount: number;
  totalStudentsCount: number;
  averageResponseDays: number;
  complianceRate: number;
}

export const LecturerAnalytics = () => {
  const { semesters, selectedSemesterId, selectedSemester, selectSemester } = useSemester();
  const [selectedClass, setSelectedClass] = useState("Tất cả lớp");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<DashboardStatsDto | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrendItem[]>([]);
  const [gradeDist, setGradeDist] = useState<GradeDistribution | null>(null);
  const [companyStats, setCompanyStats] = useState<CompanyStatItem[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const qs = selectedSemesterId ? `?semesterId=${selectedSemesterId}` : "";
    try {
      const [stats, trend, grade, company, activity] = await Promise.all([
        apiRequest<DashboardStatsDto>("/api/Lecturer/stats"),
        apiRequest<WeeklyTrendItem[]>(`/api/Lecturer/analytics/weekly-trend${qs}`),
        apiRequest<GradeDistribution>(`/api/Lecturer/analytics/grade-distribution${qs}`),
        apiRequest<CompanyStatItem[]>(`/api/Lecturer/analytics/company-stats${qs}`),
        apiRequest<ActivityStats>(`/api/Lecturer/analytics/activity-stats${qs}`),
      ]);
      setStatsData(stats);
      setWeeklyTrend(trend);
      setGradeDist(grade);
      setCompanyStats(company);
      setActivityStats(activity);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [selectedSemesterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3e3);
  };

  const handleExportExcel = async () => {
    try {
      showToast("Đang tạo file Excel báo cáo...");
      const { blob, filename } = await lecturerExportService.downloadEndOfTerm();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Đã tải xuống ${filename}`);
    } catch {
      showToast("Xuất Excel thất bại.");
    }
  };

  const handleExportPDF = () => {
    showToast("Đang xuất Báo cáo Thống kê định dạng PDF...");
  };

  const handlePrint = () => {
    window.print();
  };

  const totalStudents = statsData ? statsData.totalStudents : 0;
  const interningStudents = statsData ? statsData.interningCount : 0;
  const overdueCount = statsData ? statsData.overdueReportsCount : 0;
  const avgGrade = statsData ? statsData.averageGrade : 0;
  const complianceRate = totalStudents > 0 ? `${Math.round(((totalStudents - overdueCount) / totalStudents) * 100)}%` : "100%";

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto animate-in fade-in duration-200 pb-12 font-sans">
      {/* Toast Notification */}
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      <PageHeader
        icon={BarChart2}
        title="Thống kê & Phân tích Chuyên sâu"
        subtitle="Phân tích tiến độ 12 tuần, phổ điểm tiêu chí, hiệu suất hướng dẫn và chất lượng doanh nghiệp tiếp nhận."
        badge="Báo cáo Khoa CNTT"
        actions={[
          {
            label: "Xuất Excel",
            icon: FileSpreadsheet,
            variant: "secondary",
            onClick: handleExportExcel,
            ariaLabel: "Xuất dữ liệu thống kê ra file Excel",
          },
          {
            label: "Xuất PDF",
            icon: FileText,
            variant: "primary",
            onClick: handleExportPDF,
            ariaLabel: "Xuất báo cáo thống kê định dạng PDF",
          },
          {
            label: "In Báo cáo",
            icon: Printer,
            variant: "ghost",
            onClick: handlePrint,
            ariaLabel: "In báo cáo thống kê",
          },
        ]}
      />

      <KpiGrid>
        <KpiCard
          tone="blue"
          title="Sinh viên hướng dẫn"
          value={totalStudents}
          unit="sinh viên"
          icon={Users}
          footer="100% Đã phân công giảng viên"
          onClick={() => {
            setSelectedClass("Tất cả lớp");
            if (semesters.length > 0) selectSemester(semesters[0].id);
          }}
        />
        <KpiCard
          tone="emerald"
          title="Đang thực tập tại DN"
          value={interningStudents}
          unit="sinh viên"
          icon={CheckCircle2}
          footer={`${totalStudents > 0 ? Math.round((interningStudents / totalStudents) * 100) : 0}% Đã có vị trí tại DN`}
        />
        <KpiCard
          tone="sky"
          title="Tuân thủ Tiến độ Nộp"
          value={complianceRate}
          unit="đúng hạn"
          icon={TrendingUp}
          footer={`${overdueCount} sinh viên trễ báo cáo tuần`}
        />
        <KpiCard
          tone="amber"
          title="Điểm Trung Bình Đợt"
          value={avgGrade}
          unit="/ 10"
          icon={Award}
          footer="Xếp loại Khá - Giỏi - Xuất sắc"
        />
      </KpiGrid>

      {/* FILTER & ANALYTICAL SCOPE BAR */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
              Phạm vi phân tích &amp; Lọc dữ liệu báo cáo
            </h2>
          </div>

          {(selectedSemesterId !== "" ||
            selectedClass !== "Tất cả lớp") && (
            <button
              onClick={() => {
                if (semesters.length > 0) selectSemester(semesters[0].id);
                setSelectedClass("Tất cả lớp");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div>
            <select
              value={selectedSemesterId}
              onChange={(e) => selectSemester(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              {semesters.length === 0 ? (
                <option value="">Chưa có kỳ thực tập</option>
              ) : (
                semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name} — [{sem.status === "active" ? "Đang chạy" : sem.status === "upcoming" ? "Sắp tới" : "Đã đóng"}]
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả lớp">Tất cả Lớp hướng dẫn</option>
              <option value="C24A.TH1">Lớp C24A.TH1 (28 SV)</option>
              <option value="CNTT-K15A">Lớp CNTT-K15A (14 SV)</option>
              <option value="CNTT-K15B">Lớp CNTT-K15B (14 SV)</option>
            </select>
          </div>

          <div>
            <select
              defaultValue="Tất cả doanh nghiệp"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả doanh nghiệp">
                Tất cả Doanh nghiệp đối tác
              </option>
              <option value="FPT Software">FPT Software</option>
              <option value="Viettel Telecom">Viettel Telecom</option>
              <option value="VNG Corporation">VNG Corporation</option>
              <option value="MISA">MISA Joint Stock Co.</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. CHARTS & VISUAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Submission Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Xu hướng nộp Báo cáo tuần (Tuần 1 - Tuần 12)
              </h3>
              <p className="text-xs text-slate-500">
                Tỷ lệ sinh viên nộp báo cáo đúng hạn, trễ hạn và quá hạn theo
                từng tuần
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 shrink-0">
              89.3% Tuân thủ
            </span>
          </div>

          {/* Visual Bar Chart from API */}
          <div className="space-y-3 pt-2">
            {weeklyTrend.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Chưa có dữ liệu báo cáo tuần</p>
            ) : (
              weeklyTrend.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{item.label}</span>
                    <span className="text-slate-500 text-[11px]">
                      <strong className="text-emerald-600">{item.onTimeCount}</strong>{" "}
                      đúng hạn •{" "}
                      <strong className="text-amber-600">{item.lateCount}</strong> trễ
                      • <strong className="text-rose-600">{item.missingCount}</strong>{" "}
                      thiếu
                    </span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${item.totalStudents > 0 ? (item.onTimeCount / item.totalStudents) * 100 : 0}%` }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                      title={`Đúng hạn: ${item.onTimeCount} SV`}
                    />
                    <div
                      style={{ width: `${item.totalStudents > 0 ? (item.lateCount / item.totalStudents) * 100 : 0}%` }}
                      className="bg-amber-400 h-full transition-all duration-500"
                      title={`Trễ hạn: ${item.lateCount} SV`}
                    />
                    <div
                      style={{ width: `${item.totalStudents > 0 ? (item.missingCount / item.totalStudents) * 100 : 0}%` }}
                      className="bg-rose-500 h-full transition-all duration-500"
                      title={`Thiếu: ${item.missingCount} SV`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                Nộp đúng hạn (89.3%)
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                Trễ 1-3 ngày (7.1%)
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                Quá hạn / Thiếu (3.6%)
              </span>
            </div>
            <span className="font-bold text-blue-600">
              Tổng 12 báo cáo tuần / SV
            </span>
          </div>
        </div>

        {/* Grade Distribution Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                Phân bố Phổ điểm Đánh giá
              </h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                28 Sinh viên
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              {gradeDist ? (
                [
                  { label: "Xuất sắc (9.0 - 10.0)", count: gradeDist.excellentCount, color: "bg-emerald-500", textColor: "text-emerald-700" },
                  { label: "Giỏi (8.0 - 8.9)", count: gradeDist.goodCount, color: "bg-blue-500", textColor: "text-blue-700" },
                  { label: "Khá (7.0 - 7.9)", count: gradeDist.fairCount, color: "bg-amber-500", textColor: "text-amber-700" },
                  { label: "Trung bình (5.5 - 6.9)", count: gradeDist.averageCount, color: "bg-slate-400", textColor: "text-slate-600" },
                  { label: "Không đạt (< 5.5)", count: gradeDist.failCount, color: "bg-rose-500", textColor: "text-rose-600" },
                ].map((item, idx) => {
                  const pct = gradeDist.totalStudents > 0 ? ((item.count / gradeDist.totalStudents) * 100).toFixed(1) : "0";
                  return (
                    <div key={idx}>
                      <div className="flex justify-between font-bold mb-1">
                        <span className={`${item.textColor} flex items-center gap-1`}>
                          <span className={`w-2 h-2 rounded-full ${item.color}`} />
                          {item.label}
                        </span>
                        <span className="text-slate-900 font-bold">{item.count} SV ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-center py-4">Chưa có dữ liệu đánh giá</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>Tỷ lệ xếp loại Khá - Giỏi - Xuất sắc:</span>
            <strong className="text-emerald-700 font-bold">89.3%</strong>
          </div>
        </div>
      </div>

      {/* 3. LECTURER GUIDANCE STATISTICS (THỐNG KÊ HOẠT ĐỘNG HƯỚNG DẪN) */}
      <Panel className="space-y-4 border-l-4 border-l-[#1d4ed8]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-[#1d4ed8] border border-blue-100 flex items-center justify-center font-bold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Thống kê Hoạt động Hướng dẫn Giảng viên
              </h3>
              <p className="text-xs text-slate-500">
                Hiệu suất chấm bài, phản hồi sinh viên và hoàn thành đợt thực
                tập
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-full">
            Hoạt động hướng dẫn
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
              <span>Báo cáo đã nhận xét</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 il-kpi-val">{activityStats?.reviewedReportsCount ?? 0} bài</p>
            <p className="text-[11px] text-emerald-700 font-medium">
              {activityStats && activityStats.totalStudentsCount > 0
                ? `Đạt ${Math.round((activityStats.reviewedReportsCount / (activityStats.reviewedReportsCount + activityStats.pendingReportsCount || 1)) * 100)}% tổng số bài nộp`
                : "Chưa có dữ liệu"}
            </p>
          </div>

          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
              <span>Báo cáo chờ phản hồi</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-700 il-kpi-val">{activityStats?.pendingReportsCount ?? 0} bài</p>
            <p className="text-[11px] text-amber-700 font-medium">
              Cần xử lý trong tuần này
            </p>
          </div>

          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
              <span>SV Hoàn thành đợt</span>
              <GraduationCap className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 il-kpi-val">{activityStats?.completedStudentsCount ?? 0} / {activityStats?.totalStudentsCount ?? 0} SV</p>
            <p className="text-[11px] text-sky-700 font-medium">
              Đã chấm điểm &amp; bảo vệ
            </p>
          </div>

          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
              <span>Tỷ lệ tuân thủ</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 il-kpi-val">{activityStats?.complianceRate ?? 100}%</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Nộp báo cáo đúng hạn
            </p>
          </div>
        </div>
      </Panel>

      {/* 4. COMPANY STATISTICS (THỐNG KÊ DOANH NGHIỆP TIẾP NHẬN SINH VIÊN) */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Thống kê Doanh nghiệp Hợp tác &amp; Vị trí Thực tập
            </h3>
            <p className="text-xs text-slate-500">
              Danh sách các đơn vị tiếp nhận sinh viên hướng dẫn của giảng viên
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200">
            6 Doanh nghiệp đối tác chính
          </span>
        </div>

        {/* Company Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3">Doanh nghiệp</th>
                <th className="p-3">Số SV hướng dẫn</th>
                <th className="p-3">Vị trí thực tập chính</th>
                <th className="p-3">Đánh giá chất lượng</th>
                <th className="p-3 text-right">Xếp hạng Đối tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {companyStats.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400 text-xs">Chưa có dữ liệu doanh nghiệp</td></tr>
              ) : (
                companyStats.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{item.companyName}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">
                        {item.studentCount} sinh viên
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-normal">
                      {item.positions}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.averageGrade} / 10</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.partnershipLevel.includes("Xuất") ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-blue-600 bg-blue-50 border-blue-200"}`}>
                        {item.partnershipLevel}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. AI PLAGIARISM & ORIGINALITY SUMMARY */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Kiểm tra Trùng lặp AI &amp; Độ nguyên bản báo cáo
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            94.2% Nguyên bản Trung bình
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-1.5">
            <p className="font-bold text-slate-900 flex items-center justify-between">
              <span>Báo cáo tuần 12 - Lớp C24A.TH1</span>
              <span className="text-emerald-600 font-bold">
                An toàn (&lt; 10%)
              </span>
            </p>
            <p className="text-slate-500 leading-relaxed">
              Tất cả 26 bài nộp đúng hạn đều đạt chỉ số trùng lặp thấp, không
              phát hiện sao chép từ kho tài liệu khóa trước.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-md space-y-1.5">
            <p className="font-bold text-amber-900 flex items-center justify-between">
              <span>Báo cáo Giữa kỳ - 2 bài cần lưu ý</span>
              <span className="text-amber-700 font-bold">
                Trùng lặp 24% - 32%
              </span>
            </p>
            <p className="text-amber-800 leading-relaxed">
              Phát hiện một số đoạn trích dẫn tài liệu kỹ thuật từ Viettel chưa
              ghi rõ nguồn tham khảo. Giảng viên đã nhắc nhở chỉnh sửa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
