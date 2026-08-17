import {
  Calendar,
  FileUp,
  KeyRound,
  Bell,
  Clock,
  Activity,
} from "lucide-react";
export const AdminRightSidebar = ({ onShowToast, onNavigateTab }) => {
  return (
    <div className="space-y-4">
      {/* 1. TODAY'S SUMMARY */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Tóm tắt hôm nay
          </span>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-100">
            02/08/2026
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
            <span className="font-bold text-slate-600">
              Báo cáo mới thu nhận
            </span>
            <span className="font-bold text-blue-900">+45 bài nộp</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
            <span className="font-bold text-slate-600">
              Sinh viên được phân công
            </span>
            <span className="font-bold text-emerald-700">+18 SV</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
            <span className="font-bold text-slate-600">
              Tài khoản kích hoạt
            </span>
            <span className="font-bold text-blue-700">+3 GV</span>
          </div>
        </div>
      </div>

      {/* 2. RECENT IMPORTS */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <FileUp className="w-3.5 h-3.5 text-blue-600" /> Lần Import gần nhất
          </span>
          <button
            onClick={() =>
              onShowToast("M\u1EDF l\u1ECBch s\u1EED Import file Excel")
            }
            className="text-[10px] text-blue-600 font-bold hover:underline"
          >
            Lịch sử
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-blue-50/70 rounded-md border border-blue-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 text-xs">
                SV_KhoaCNTT_K20.xlsx
              </span>
              <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded">
                Thành công
              </span>
            </div>
            <p className="text-[10px] text-blue-700 font-medium">
              120 bản ghi sinh viên • 10:15 Hôm nay
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">
                DS_GiangVien_HK1.xlsx
              </span>
              <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded">
                Thành công
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              42 bản ghi giảng viên • 14:00 Hôm qua
            </p>
          </div>
        </div>
      </div>

      {/* 3. PENDING REQUESTS */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Yêu cầu chờ
            duyệt
          </span>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
            8 yêu cầu
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-amber-50/80 rounded-md border border-amber-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-amber-950 text-xs">
                Cấp tài khoản GV thỉnh giảng
              </p>
              <p className="text-[10px] text-amber-800 font-medium">
                TS. Trần Văn M (Khoa ĐTVT)
              </p>
            </div>
            <button
              onClick={() => {
                onNavigateTab("admin-account-requests");
                onShowToast(
                  "M\u1EDF m\xE0n h\xECnh duy\u1EC7t Y\xEAu c\u1EA7u t\xE0i kho\u1EA3n",
                );
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-lg shadow-2xs"
            >
              Duyệt
            </button>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 text-xs">
                Đặt lại mật khẩu Sinh viên
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                5 sinh viên Lớp 20DTH2
              </p>
            </div>
            <button
              onClick={() => {
                onNavigateTab("admin-account-requests");
                onShowToast(
                  "M\u1EDF danh s\xE1ch \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u",
                );
              }}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] rounded-lg"
            >
              Xem
            </button>
          </div>
        </div>
      </div>

      {/* 4. LATEST NOTIFICATIONS */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-blue-600" /> Thông báo mới nhất
          </span>
          <button
            onClick={() => onNavigateTab("admin-notifications")}
            className="text-[10px] text-blue-600 font-bold hover:underline"
          >
            Tất cả
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-blue-50/70 rounded-md border border-blue-100 space-y-0.5">
            <p className="font-bold text-blue-950 text-xs">
              Cập nhật danh sách Doanh nghiệp
            </p>
            <p className="text-[10px] text-blue-800 font-medium">
              Thêm 15 đối tác mới ký kết MOU đợt 1
            </p>
          </div>
        </div>
      </div>

      {/* 5. UPCOMING DEADLINES SUMMARY */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-600" /> Hạn chót kế tiếp
          </span>
        </div>

        <div className="p-3 bg-rose-50/70 rounded-md border border-rose-100 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-950">Nộp báo cáo cuối kỳ</span>
            <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded">
              Còn 15 ngày
            </span>
          </div>
          <p className="text-[10px] text-rose-800 font-medium">
            Hạn chót: 30/11/2025 • 1,280 sinh viên
          </p>
        </div>
      </div>

      {/* 6. SYSTEM HEALTH WIDGET */}
      <div className="il-panel p-4 space-y-3 border-l-4 border-l-emerald-600">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Sức khỏe Hệ
            thống
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Online
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Uptime Cloud Run</span>
            <span className="font-bold text-slate-900">99.98%</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Độ trễ PostgreSQL</span>
            <span className="font-bold text-emerald-700">12ms</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Lưu trữ file PDF</span>
            <span className="font-bold text-slate-900">128GB / 500GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
