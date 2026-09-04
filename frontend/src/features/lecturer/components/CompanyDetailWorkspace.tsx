import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import type { Enterprise } from "../../../types/enterprise";

interface CompanyDetailWorkspaceProps {
  company?: Enterprise;
  onBack?: () => void;
  onAssignStudents?: (company: Enterprise) => void;
}

const formatDate = (d?: string) => {
  if (!d || d === "—") return null;
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("vi-VN");
  } catch {
    return null;
  }
};

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 py-2 border-b border-slate-100 last:border-0">
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-xs font-semibold text-slate-800 break-words">
      {children}
    </span>
  </div>
);

export const CompanyDetailWorkspace = ({
  company,
  onBack,
  onAssignStudents,
}: CompanyDetailWorkspaceProps) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };

  if (!company) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 pb-12 font-sans">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>← Quay lại danh sách doanh nghiệp</span>
          </button>
        )}
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-10 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            Không có dữ liệu doanh nghiệp
          </p>
          <p className="text-xs text-slate-500">
            Vui lòng chọn một doanh nghiệp từ danh sách để xem chi tiết.
          </p>
        </div>
      </div>
    );
  }

  const hasEmail = company.contactEmail && company.contactEmail !== "—";
  const updatedDate = formatDate(company.updatedAt);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12 font-sans">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* TOP BREADCRUMB & BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>← Quay lại danh sách doanh nghiệp</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Doanh nghiệp</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">{company.shortCode}</span>
        </div>
      </div>

      {/* COMPANY PROFILE HERO CARD Header */}
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-6 space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Company Brand Logo & Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
              {(company.shortCode || "DN").slice(0, 3)}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  {company.name || "Doanh nghiệp"}
                </h1>
                {company.status && (
                  <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[10px] rounded-full">
                    {company.status}
                  </span>
                )}
              </div>

              {company.field && (
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {company.field}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {company.location}
                  </span>
                )}
                {company.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {company.website}
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end flex-wrap">
            {hasEmail && (
              <a
                href={`mailto:${company.contactEmail}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md border border-slate-200 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Liên hệ doanh nghiệp</span>
              </a>
            )}

            <button
              onClick={() => {
                onAssignStudents?.(company);
                triggerToast(
                  `Mở giao diện phân công sinh viên thực tập cho ${company.shortCode}`,
                );
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Phân công sinh viên</span>
            </button>
          </div>
        </div>

        {/* Quick Attributes Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-md space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Người liên hệ trực tiếp
            </span>
            <p className="font-bold text-slate-900 truncate">
              {company.contactPerson || "—"}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              {company.contactPhone || "—"}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-md space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Số lượng tiếp nhận
            </span>
            {company.studentCount > 0 ? (
              <p className="font-bold text-blue-600 text-sm">
                {company.studentCount}{" "}
                {company.capacity > 0 && (
                  <span className="text-xs font-normal text-slate-500">
                    / {company.capacity} Sinh viên
                  </span>
                )}
              </p>
            ) : (
              <p className="font-bold text-slate-500 text-sm">—</p>
            )}
            {company.studentCount === 0 && (
              <span className="text-[10px] text-slate-400 block">
                Chưa ghi nhận trong kỳ này
              </span>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-md space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Chính sách trợ cấp
            </span>
            {company.hasStipend ? (
              <p className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Có trợ cấp hàng tháng
              </p>
            ) : (
              <p className="font-bold text-slate-500">Chưa cập nhật</p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-md space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Đánh giá chất lượng
            </span>
            {company.rating > 0 ? (
              <div className="flex items-center gap-1 font-bold text-slate-900">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{company.rating} / 5.0</span>
              </div>
            ) : (
              <p className="font-bold text-slate-500">Chưa có đánh giá</p>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="w-full space-y-6">
        {/* Company Contact & Profile Facts (from real data) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            Thông tin doanh nghiệp
          </h3>

          <div className="mt-2">
            <InfoRow label="Lĩnh vực hoạt động">
              {company.field || "—"}
            </InfoRow>
            <InfoRow label="Địa chỉ">{company.location || "—"}</InfoRow>
            <InfoRow label="Website">
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  {company.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                "—"
              )}
            </InfoRow>
            <InfoRow label="Email liên hệ">
              {hasEmail ? (
                <a
                  href={`mailto:${company.contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {company.contactEmail}
                </a>
              ) : (
                "—"
              )}
            </InfoRow>
            <InfoRow label="Người đại diện">
              <span className="inline-flex items-center gap-1.5">
                {company.contactPerson || "—"}
                {company.contactPhone && (
                  <span className="inline-flex items-center gap-1 text-slate-500 font-normal">
                    <Phone className="w-3 h-3" />
                    {company.contactPhone}
                  </span>
                )}
              </span>
            </InfoRow>
            <InfoRow label="Trạng thái hợp tác">
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                  company.status?.includes("Đang") ||
                  company.status?.includes("hợp tác")
                    ? "bg-teal-50 text-teal-800 border-teal-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {company.status || "Chưa xác định"}
              </span>
            </InfoRow>
            {updatedDate && (
              <InfoRow label="Cập nhật lần cuối">
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {updatedDate}
                </span>
              </InfoRow>
            )}
          </div>
        </div>

        {/* Students (honest empty state — backend does not track per-company lists yet) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            Sinh viên thực tập
          </h3>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Users className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-600">
              Chưa ghi nhận sinh viên thực tập cho doanh nghiệp này
            </p>
            <p className="text-[11px] text-slate-500 max-w-md">
              Danh sách sinh viên theo doanh nghiệp sẽ xuất hiện sau khi có phân
              công thực tập trong học kỳ. Dữ liệu tiếp nhận hiện được quản lý ở
              phía quản trị.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
