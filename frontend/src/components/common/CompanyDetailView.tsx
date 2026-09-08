import { useEffect, useState } from "react";
import {
  Building2,
  ArrowLeft,
  ArrowRight,
  Users,
  FileText,
  Mail,
  Phone,
  Download,
  AlertCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../common/PageHeader";
import { Panel } from "../common/Panel";

interface CompanyDetailDto {
  id: string;
  name: string;
  industry?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  studentCount: number;
  totalSubmissions: number;
  totalWeeklyReports: number;
  pendingReviewsCount: number;
  internships: {
    id: string;
    studentId: string;
    studentCode?: string | null;
    studentName: string;
    position: string;
    status: string;
    startDate?: string;
    endDate?: string;
    submissionCount: number;
  }[];
}

interface CompanyDetailViewProps {
  /** Fetch function returning the company detail DTO. */
  fetchDetail: (companyId: string, semesterId?: string) => Promise<CompanyDetailDto>;
  /** Label for the back button. */
  backLabel: string;
  /** Path to navigate back to. */
  backPath: string;
  /** Current semester id for API scoping. */
  semesterId?: string;
  /** Optional: override the page title subtitle. */
  subtitle?: string;
  /** Optional: additional actions for PageHeader. */
  actions?: Array<{
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    variant?: "secondary" | "primary" | "ghost";
  }>;
  studentPath?: (internshipId: string) => string;
}

function formatViDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
}

const STATUS_LABEL: Record<string, string> = {
  NotStarted: "Chưa bắt đầu",
  InProgress: "Đang thực tập",
  BehindSchedule: "Quá hạn",
  AwaitingFeedback: "Chờ phản hồi",
  RequiresRevision: "Đang chỉnh sửa",
  Completed: "Hoàn thành",
  Graded: "Đã chấm điểm",
};

export const CompanyDetailView = ({
  fetchDetail,
  backLabel,
  backPath,
  semesterId,
  subtitle,
  actions = [],
  studentPath = (internshipId) => `/lecturer/students/${internshipId}`,
}: CompanyDetailViewProps) => {
  const params = useParams<{ id?: string; companyId?: string }>();
  const companyId = params.companyId ?? params.id;
  const navigate = useNavigate();
  const [detail, setDetail] = useState<CompanyDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    fetchDetail(companyId, semesterId)
      .then(setDetail)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Không tải được thông tin doanh nghiệp")
      )
      .finally(() => setLoading(false));
  }, [companyId, semesterId, fetchDetail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm font-medium text-slate-500">
        Đang tải thông tin doanh nghiệp…
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="space-y-4 max-w-[1000px] mx-auto animate-in fade-in duration-200 pb-10">
        <PageHeader
          icon={Building2}
          title="Doanh nghiệp"
          subtitle={
            error
              ? "Không tìm thấy thông tin doanh nghiệp."
              : subtitle ?? "Thông tin doanh nghiệp"
          }
          actions={[
            {
              label: backLabel,
              icon: ArrowLeft,
              onClick: () => navigate(backPath),
              variant: "secondary",
            },
            ...actions,
          ]}
        />
        <Panel className="border-red-200 bg-red-50/40">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold">Không có dữ liệu</p>
              <p className="text-xs mt-1 text-red-600">
                {error ?? "Không tìm thấy doanh nghiệp này."}
              </p>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const pendingFeedbacks = detail.pendingReviewsCount;
  const totalStudents = detail.studentCount;
  const completedStudents = detail.internships.filter(
    (i) => i.status === "Completed" || i.status === "Graded"
  ).length;

  return (
    <div className="space-y-5 max-w-[1100px] mx-auto pb-10">
      <PageHeader
        icon={Building2}
        title={detail.name}
        subtitle={
          subtitle ??
          `Mã DN: ${detail.id.slice(0, 8).toUpperCase()} · ${totalStudents} sinh viên`
        }
        actions={[
          {
            label: backLabel,
            icon: ArrowLeft,
            onClick: () => navigate(backPath),
            variant: "secondary",
          },
          ...actions,
        ]}
      />

      {/* THÔNG TIN CƠ BẢN */}
      <Panel className="space-y-4">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-blue-50 text-blue-700 font-bold flex items-center justify-center border border-blue-100">
              {detail.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{detail.name}</h2>
              <p className="text-xs text-slate-500">Thông tin doanh nghiệp theo học kỳ đang chọn</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Đang hướng dẫn
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 text-xs">
          <div className="border border-slate-200 rounded-md p-3">
            <span className="text-slate-500">Lĩnh vực hoạt động</span>
            <strong className="mt-1 block text-slate-900">{detail.industry ?? "—"}</strong>
          </div>
          <div className="border border-slate-200 rounded-md p-3">
            <span className="text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />Địa chỉ
            </span>
            <strong className="mt-1 block text-slate-900">{detail.address ?? "—"}</strong>
          </div>
          <div className="border border-slate-200 rounded-md p-3">
            <span className="text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />Sinh viên được phân công
            </span>
            <strong className="mt-1 block text-slate-900">{totalStudents} sinh viên</strong>
          </div>
          <div className="border border-slate-200 rounded-md p-3">
            <span className="text-slate-500 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />Tổng bài nộp / nhật ký
            </span>
            <strong className="mt-1 block text-slate-900">
              {detail.totalSubmissions} bài · {detail.totalWeeklyReports} nhật ký
            </strong>
          </div>
          <div className="border border-slate-200 rounded-md p-3">
            <span className="text-slate-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />Người liên hệ
            </span>
            <strong className="mt-1 block text-slate-900">{detail.contactPerson ?? "—"}</strong>
            <p className="text-[10px] text-slate-500 mt-0.5">{detail.contactEmail ?? "—"}</p>
          </div>
          <div className="border border-slate-200 rounded-md p-3">
            <span className="text-slate-500 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />Số điện thoại
            </span>
            <strong className="mt-1 block text-slate-900">{detail.contactPhone ?? "—"}</strong>
          </div>
        </div>
      </Panel>

      {/* DANH SÁCH SINH VIÊN THỰC TẬP */}
      <Panel className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Danh sách sinh viên thực tập
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {detail.internships.length} sinh viên · Nhắn tin / theo dõi từng sinh viên
            </p>
          </div>
        </div>

        {detail.internships.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            Chưa có sinh viên nào được phân công cho doanh nghiệp này.
          </div>
        ) : (
          <div className="space-y-2">              {detail.internships.map((internship) => {
              const isCompleted =
                internship.status === "Completed" || internship.status === "Graded";
              const isPending =
                internship.status === "AwaitingFeedback" ||
                internship.status === "RequiresRevision";
              const statusLabel = STATUS_LABEL[internship.status] ?? internship.status;
              return (
                <div
                  key={internship.id}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-md border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer"
                  onClick={() => navigate(studentPath(internship.id))}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-100 shrink-0">
                      {initials(internship.studentName)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 text-xs block truncate">
                        {internship.studentName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        MSSV: {internship.studentCode ?? "—"} · {internship.position}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <span className="text-slate-400 font-mono text-[10px]">
                      {internship.startDate ? formatViDate(internship.startDate) : "—"} →{" "}
                      {internship.endDate ? formatViDate(internship.endDate) : "—"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isPending
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono">
                      {internship.submissionCount} bài
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {/* THỐNG KÊ BÀI NỘP / NHẬT KÝ */}
      <Panel className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Nhật ký nhận sinh viên & bài nộp
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tổng quan hoạt động tại doanh nghiệp trong học kỳ này
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4 text-xs">            <div className="border border-slate-200 rounded-md p-3 bg-blue-50">
            <span className="text-slate-500">Sinh viên thực tập</span>
            <strong className="mt-1 block text-blue-700 text-lg font-bold font-mono">
              {totalStudents}
            </strong>
            <span className="text-[10px] text-slate-500">sinh viên đang được hướng dẫn</span>
          </div>
          <div className="border border-slate-200 rounded-md p-3 bg-emerald-50">
            <span className="text-slate-500">Hoàn thành / đã chấm</span>
            <strong className="mt-1 block text-emerald-700 text-lg font-bold font-mono">
              {completedStudents}
            </strong>
            <span className="text-[10px] text-slate-500">sinh viên hoàn thành thực tập</span>
          </div>
          <div className="border border-slate-200 rounded-md p-3 bg-amber-50">
            <span className="text-slate-500">Chờ duyệt / phản hồi</span>
            <strong className="mt-1 block text-amber-700 text-lg font-bold font-mono">
              {pendingFeedbacks}
            </strong>
            <span className="text-[10px] text-slate-500">bài nộp / nhật ký cần xử lý</span>
          </div>
          <div className="border border-slate-200 rounded-md p-3">
            <span className="text-slate-500">Tổng bài nộp</span>
            <strong className="mt-1 block text-slate-900 text-lg font-bold font-mono">
              {detail.totalSubmissions}
            </strong>
            <span className="text-[10px] text-slate-500">bài nộp sản phẩm / báo cáo</span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-md p-4 text-xs text-slate-600">
          <p className="font-medium text-slate-700 mb-1">Nhật ký nhận sinh viên:</p>
          <p className="text-slate-500 leading-relaxed">
            Doanh nghiệp đã tiếp nhận {totalStudents} sinh viên thực tập trong học kỳ này.
            Tất cả sinh viên đã ký hợp đồng thực tập và được hướng dẫn bởi giảng viên đứng nhóm.
            Hiển thị chi tiết từng sinh viên, trạng thái thực tập và bài nộp tại trang danh sách
            sinh viên.
          </p>
        </div>
      </Panel>
    </div>
  );
};
