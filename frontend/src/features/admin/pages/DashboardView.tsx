import { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Download,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { AdminKpiSection } from '../components/KpiSection';
import { InternshipOverviewCard } from '../components/cards/InternshipOverviewCard';
import { WorkloadOverviewCard } from '../components/cards/WorkloadOverviewCard';
import { AdminActivityTimeline } from '../components/ActivityTimeline';
import { CreateSemesterModal } from '../components/modals/CreateSemesterModal';
import { AssignLecturerModal } from '../components/modals/AssignLecturerModal';
import { SendNotificationModal } from '../components/modals/SendNotificationModal';
export const DashboardView = ({
  onShowToast,
  onNavigateTab
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateSemesterModal, setShowCreateSemesterModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSendNotificationModal, setShowSendNotificationModal] = useState(false);
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast("\u0110\xE3 l\xE0m m\u1EDBi d\u1EEF li\u1EC7u to\xE0n h\u1EC7 th\u1ED1ng Super Admin!");
    }, 600);
  };
  return <div className="p-6 space-y-6 max-w-[1500px] mx-auto animate-in fade-in duration-300">
      
      {
    /* EXECUTIVE HEADER BAR */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
    onClick={handleRefresh}
    disabled={isRefreshing}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200/80 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
  >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới chỉ số</span>
          </button>

          <button
    onClick={() => onShowToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED5ng quan k\u1EF3 th\u1EF1c t\u1EADp (Excel / PDF)")}
    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs rounded-xl border border-blue-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
  >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Xuất báo cáo KPI</span>
          </button>

          <button
    onClick={() => setShowCreateSemesterModal(true)}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
  >
            <Plus className="w-4 h-4" />
            <span>Tạo đợt thực tập</span>
          </button>
        </div>
      </div>

      {
    /* EXECUTIVE KPI OVERVIEW CARDS */
  }
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Chỉ số Vận hành Trọng yếu (Executive Metrics)
          </h2>
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-500" /> Cập nhật lúc 08:30 hôm nay
          </span>
        </div>

        <AdminKpiSection
    onCardClick={(metric) => {
      if (metric === "unassigned-students" || metric === "unassigned-lecturers") {
        onNavigateTab("admin-assignments");
      } else if (metric === "account-requests") {
        onNavigateTab("admin-account-requests");
      } else if (metric === "lecturers") {
        onNavigateTab("admin-lecturers");
      } else if (metric === "students") {
        onNavigateTab("admin-students");
      } else {
        onShowToast(`Chi ti\u1EBFt ch\u1EC9 s\u1ED1: ${metric}`);
      }
    }}
  />
      </section>

      {
    /* CLEAN 2-COLUMN AGGREGATED SUMMARY LAYOUT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {
    /* LEFT COLUMN: ACTIVE INTERNSHIP & WORKLOAD SUMMARY (7 COLS) */
  }
        <div className="lg:col-span-7 space-y-6">
          
          {
    /* SECTION 1: INTERNSHIP PROGRESS SUMMARY */
  }
          <InternshipOverviewCard
    onViewDetails={() => onNavigateTab("admin-semesters")}
    onEditSemester={() => setShowCreateSemesterModal(true)}
  />

          {
    /* SECTION 2: WORKLOAD ALLOCATION SUMMARY */
  }
          <WorkloadOverviewCard
    onAssignClick={() => onNavigateTab("admin-assignments")}
  />

        </div>

        {
    /* RIGHT COLUMN: RECENT ACTIVITIES & URGENT PENDING MATTERS (5 COLS) */
  }
        <div className="lg:col-span-5 space-y-6">
          
          {
    /* URGENT PENDING ITEMS QUICK DIRECTORY */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Hạng mục chờ xử lý
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Tóm tắt các đầu việc cần Trưởng BĐH quyết định</p>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[11px] rounded-full">
                3 mục
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div
    onClick={() => onNavigateTab("admin-assignments")}
    className="p-3 bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
  >
                <div>
                  <p className="font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">45 Sinh viên chưa phân công Giảng viên hướng dẫn</p>
                  <p className="text-[11px] text-slate-500 font-medium">Đợt thực tập HK1 2025-2026</p>
                </div>
                <div className="flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>Phân công</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
    onClick={() => onNavigateTab("admin-account-requests")}
    className="p-3 bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
  >
                <div>
                  <p className="font-extrabold text-slate-900 group-hover:text-blue-800 transition-colors">8 Yêu cầu đặt lại mật khẩu</p>
                  <p className="text-[11px] text-slate-500 font-medium">Xác minh danh tính giảng viên & sinh viên</p>
                </div>
                <div className="flex items-center gap-1 text-blue-700 font-bold text-[11px]">
                  <span>Xử lý</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
    onClick={() => onNavigateTab("admin-lecturers")}
    className="p-3 bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
  >
                <div>
                  <p className="font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">3 Giảng viên chưa kích hoạt tài khoản</p>
                  <p className="text-[11px] text-slate-500 font-medium">Gửi lại email mời tham gia hệ thống</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                  <span>Xem</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {
    /* SYSTEM ACTIVITY TIMELINE */
  }
          <AdminActivityTimeline
    onViewAllHistory={() => onShowToast("M\u1EDF L\u1ECBch s\u1EED Nh\u1EADt k\xFD H\u1EC7 th\u1ED1ng")}
  />

        </div>

      </div>

      {
    /* MODALS FOR QUICK TOP-BAR ACTIONS */
  }
      <CreateSemesterModal
    isOpen={showCreateSemesterModal}
    onClose={() => setShowCreateSemesterModal(false)}
    onShowToast={onShowToast}
  />

      <AssignLecturerModal
    isOpen={showAssignModal}
    onClose={() => setShowAssignModal(false)}
    onShowToast={onShowToast}
  />

      <SendNotificationModal
    isOpen={showSendNotificationModal}
    onClose={() => setShowSendNotificationModal(false)}
    onShowToast={onShowToast}
  />

    </div>;
};

export { DashboardView as AdminDashboardView };
