import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Briefcase,
  ChevronRight,
  FileText,
  Send,
  Users,
  Target,
  TrendingUp,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../../data/studentMockData';
export const InternshipView = ({ onShowToast }) => {
  const [isAssigned, setIsAssigned] = useState(true);
  const [activeContactModal, setActiveContactModal] = useState(null);
  const [selectedWeekDetail, setSelectedWeekDetail] = useState(null);
  const weeklyPlans = [
    {
      week: 1,
      title: "Kh\u1EDFi \u0111\u1ED9ng & Onboarding",
      goal: "Ti\u1EBFp nh\u1EADn v\u1ECB tr\xED, t\xECm hi\u1EC3u quy tr\xECnh Agile/Scrum v\xE0 setup m\xF4i tr\u01B0\u1EDDng d\u1EF1 \xE1n SmartHR.",
      status: "Ho\xE0n th\xE0nh",
      progress: 100,
      deliverable: "B\xE1o c\xE1o tu\u1EA7n 1 & Bi\xEAn b\u1EA3n ti\u1EBFp nh\u1EADn th\u1EF1c t\u1EADp"
    },
    {
      week: 2,
      title: "Nghi\xEAn c\u1EE9u T\xE0i li\u1EC7u & Design System",
      goal: "\u0110\u1ECDc t\xE0i li\u1EC7u SRS d\u1EF1 \xE1n, nghi\xEAn c\u1EE9u UI Kit Figma c\u1EE7a FPT Software v\xE0 thi\u1EBFt k\u1EBF component c\u01A1 b\u1EA3n.",
      status: "Ho\xE0n th\xE0nh",
      progress: 100,
      deliverable: "B\xE1o c\xE1o tu\u1EA7n 2 & File thi\u1EBFt k\u1EBF UI layout"
    },
    {
      week: 3,
      title: "X\xE2y d\u1EF1ng UI Component Library",
      goal: "L\u1EADp tr\xECnh c\xE1c React Component t\xE1i s\u1EED d\u1EE5ng: Buttons, Inputs, Tables, Modals v\u1EDBi TailwindCSS.",
      status: "Ho\xE0n th\xE0nh",
      progress: 100,
      deliverable: "B\xE1o c\xE1o tu\u1EA7n 3 & Source code Storybook"
    },
    {
      week: 4,
      title: "T\xEDch h\u1EE3p Authentication & Ph\xE2n quy\u1EC1n",
      goal: "X\xE2y d\u1EF1ng trang Login, Register, Forgot Password v\xE0 k\u1EBFt n\u1ED1i RESTful API v\u1EDBi Bearer Token.",
      status: "Ho\xE0n th\xE0nh",
      progress: 100,
      deliverable: "B\xE1o c\xE1o tu\u1EA7n 4 & Demo m\xE0n h\xECnh \u0111\u0103ng nh\u1EADp"
    },
    {
      week: 5,
      title: "Ph\xE1t tri\u1EC3n Dashboard Quan tr\u1ECDng",
      goal: "L\u1EADp tr\xECnh giao di\u1EC7n Dashboard qu\u1EA3n l\xFD nh\xE2n s\u1EF1, t\xEDch h\u1EE3p Recharts bi\u1EC3u \u0111\u1ED3 th\u1ED1ng k\xEA.",
      status: "Ho\xE0n th\xE0nh",
      progress: 100,
      deliverable: "B\xE1o c\xE1o tu\u1EA7n 5 & UI Dashboard ho\xE0n ch\u1EC9nh"
    },
    {
      week: 6,
      title: "T\xEDch h\u1EE3p Module B\xE1o c\xE1o & State Management",
      goal: "X\xE2y d\u1EF1ng b\u1ED9 l\u1ECDc d\u1EEF li\u1EC7u n\xE2ng cao, t\u1ED1i \u01B0u Context State v\xE0 x\u1EED l\xFD l\u1ED7i form validation.",
      status: "\u0110ang th\u1EF1c hi\u1EC7n",
      progress: 70,
      deliverable: "B\xE1o c\xE1o tu\u1EA7n 6 (H\u1EA1n ch\xF3t 22/09/2026)"
    },
    {
      week: 7,
      title: "Ki\u1EC3m th\u1EED Unit Test & T\u1ED1i \u01B0u Performance",
      goal: "Vi\u1EBFt Jest/React Testing Library test cases v\xE0 t\u1ED1i \u01B0u h\xF3a th\u1EDDi gian t\u1EA3i trang d\u01B0\u1EDBi 1.5s.",
      status: "Ch\u01B0a b\u1EAFt \u0111\u1EA7u",
      progress: 0,
      deliverable: "B\xE1o c\xE1o tu\u1EA7n 7 & Test coverage report"
    },
    {
      week: 8,
      title: "Ho\xE0n thi\u1EC7n B\xE1o c\xE1o T\u1ED5ng k\u1EBFt & B\u1EA3o v\u1EC7",
      goal: "T\u1ED5ng h\u1EE3p to\xE0n b\u1ED9 qu\xE1 tr\xECnh th\u1EF1c t\u1EADp, \u0111\xF3ng g\xF3i s\u1EA3n ph\u1EA9m v\xE0 chu\u1EA9n b\u1ECB Slide b\u1EA3o v\u1EC7 tr\u01B0\u1EDBc H\u1ED9i \u0111\u1ED3ng.",
      status: "Ch\u01B0a b\u1EAFt \u0111\u1EA7u",
      progress: 0,
      deliverable: "B\xE1o c\xE1o T\u1ED5ng k\u1EBFt Th\u1EF1c t\u1EADp & Slide thuy\u1EBFt tr\xECnh"
    }
  ];
  if (!isAssigned) {
    return <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600">
            Thử nghiệm giao diện:
          </span>
          <button
      onClick={() => setIsAssigned(true)}
      className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
    >
            Xem state: Đã phân công Doanh nghiệp
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">
              Bạn chưa được phân công doanh nghiệp thực tập
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Hệ thống chưa ghi nhận đơn vị tiếp nhận hoặc hồ sơ của bạn đang được Khoa xét duyệt.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
      onClick={() => setActiveContactModal("lecturer")}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
    >
              <Mail className="w-4 h-4" /> Liên hệ Giảng viên
            </button>
            <button
      onClick={() => onShowToast("Chuy\u1EC3n h\u01B0\u1EDBng \u0111\u1EBFn Bi\u1EC3u m\u1EABu \u0111\u0103ng k\xFD")}
      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
    >
              <FileText className="w-4 h-4 text-slate-500" /> Xem Biểu mẫu
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {
    /* 1. COMPACT HEADER BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Kỳ thực tập của tôi
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              Mã kỳ: TT-2026-CNTT
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đang thực tập
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Thông tin đơn vị tiếp nhận, đội ngũ hướng dẫn và kế hoạch lộ trình thực tập.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
    onClick={() => onShowToast("Chuy\u1EC3n h\u01B0\u1EDBng \u0111\u1EBFn m\xE0n h\xECnh N\u1ED9p b\xE1o c\xE1o tu\u1EA7n")}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
            <FileText className="w-3.5 h-3.5" />
            <span>Nộp báo cáo tuần</span>
          </button>
          <button
    onClick={() => onShowToast("Xu\u1EA5t phi\u1EBFu th\xF4ng tin th\u1EF1c t\u1EADp (PDF)")}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-slate-200/80"
  >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất phiếu</span>
          </button>
        </div>
      </div>

      {
    /* 2. MAIN INTERNSHIP & MENTORS INTEGRATED CARD */
  }
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        {
    /* Company Header */
  }
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              FPT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{STUDENT_PROFILE.company}</h2>
                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                  Đối tác Khoa
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">
                Vị trí: {STUDENT_PROFILE.position} • Dự án SmartHR Platform (Hybrid)
              </p>
            </div>
          </div>

          <a
    href="https://fpt-software.com"
    target="_blank"
    rel="noreferrer"
    className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
  >
            <Building2 className="w-3.5 h-3.5 text-blue-600" /> fpt-software.com <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {
    /* Essential Internship Details Grid */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Địa điểm làm việc
            </span>
            <p className="font-bold text-slate-800 line-clamp-2">{STUDENT_PROFILE.companyAddress}</p>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Thời gian thực tập
            </span>
            <p className="font-bold text-slate-800">01/08/2026 — 30/09/2026</p>
            <p className="text-[10px] text-slate-500 font-medium">8 Tuần (2 Tháng)</p>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1 sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Hình thức & Thời gian
            </span>
            <p className="font-bold text-slate-800">Hybrid (3 Onsite / 2 Remote)</p>
            <p className="text-[10px] text-slate-500 font-medium">08:00 — 17:30 (Thứ 2 - Thứ 6)</p>
          </div>
        </div>

        {
    /* Mentors Section */
  }
        <div className="pt-2">
          <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" /> Đội ngũ Hướng dẫn
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {
    /* Lecturer Card */
  }
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  P
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Giảng viên hướng dẫn</span>
                  <h4 className="font-bold text-slate-900 truncate">{STUDENT_PROFILE.lecturerName}</h4>
                  <p className="text-[11px] text-slate-500 truncate">phuoc.nv@internlink.edu.vn</p>
                </div>
              </div>
              <button
    onClick={() => setActiveContactModal("lecturer")}
    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors border border-blue-200/60 shrink-0 flex items-center gap-1"
  >
                <Mail className="w-3.5 h-3.5" /> Liên hệ
              </button>
            </div>

            {
    /* Mentor Card */
  }
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  H
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Mentor Doanh nghiệp</span>
                  <h4 className="font-bold text-slate-900 truncate">{STUDENT_PROFILE.supervisorName}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{STUDENT_PROFILE.supervisorEmail}</p>
                </div>
              </div>
              <button
    onClick={() => setActiveContactModal("mentor")}
    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-colors border border-emerald-200/60 shrink-0 flex items-center gap-1"
  >
                <Phone className="w-3.5 h-3.5" /> Liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>

      {
    /* 3. STREAMLINED PROGRESS SUMMARY & TIMELINE */
  }
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Tiến độ Kỳ thực tập</h2>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Tuần 6 / 8 (75%)
          </span>
        </div>

        {
    /* Progress Bar & Quick Stats */
  }
        <div className="space-y-2">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
    style={{ width: "75%" }}
  />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
            <span>Bắt đầu (01/08/2026)</span>
            <span className="text-blue-700 font-extrabold">Đang ở Tuần 6 (75%)</span>
            <span>Kết thúc (30/09/2026)</span>
          </div>
        </div>

        {
    /* Timeline Steps Bar */
  }
        <div className="pt-2 overflow-x-auto">
          <div className="min-w-[550px] flex items-start justify-between px-2 py-1">
            {[
    { label: "\u0110\u0103ng k\xFD", date: "01/07", status: "done" },
    { label: "\u0110\u01B0\u1EE3c duy\u1EC7t", date: "15/07", status: "done" },
    { label: "B\u1EAFt \u0111\u1EA7u", date: "01/08", status: "done" },
    { label: "Gi\u1EEFa k\u1EF3", date: "Tu\u1EA7n 6", status: "active" },
    { label: "Cu\u1ED1i k\u1EF3", date: "30/09", status: "upcoming" },
    { label: "Ho\xE0n th\xE0nh", date: "15/10", status: "upcoming" }
  ].map((step, idx, arr) => {
    const isDone = step.status === "done";
    const isActive = step.status === "active";
    return <React.Fragment key={idx}>
                  <div className="flex flex-col items-center min-w-[70px] text-center z-10">
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${isDone ? "bg-blue-600 text-white shadow-2xs" : isActive ? "bg-blue-600 text-white ring-4 ring-blue-100 font-extrabold" : "bg-white text-slate-400 border border-slate-300"}`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-bold mt-1.5 ${isActive ? "text-blue-700 font-extrabold" : isDone ? "text-slate-700" : "text-slate-400"}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {step.date}
                    </span>
                  </div>

                  {idx < arr.length - 1 && <div className="flex-1 mt-4 h-0.5 bg-slate-200 self-start">
                      <div
      className={`h-full transition-all duration-300 ${idx < 3 ? "bg-blue-600" : "bg-transparent"}`}
    />
                    </div>}
                </React.Fragment>;
  })}
          </div>
        </div>
      </div>

      {
    /* 4. MAIN CONTENT GRID: 8-WEEK PLAN & SIDEBAR */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Left 2 Cols: 8-Week Plan Table */
  }
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Kế hoạch thực tập (Weekly Plan)
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Lộ trình công việc 8 tuần đã phê duyệt bởi Giảng viên & Doanh nghiệp.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold">
                    <th className="p-3 w-16">Tuần</th>
                    <th className="p-3">Mục tiêu & Sản phẩm</th>
                    <th className="p-3 w-28">Trạng thái</th>
                    <th className="p-3 w-28">Tiến độ</th>
                    <th className="p-3 text-right w-24">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {weeklyPlans.map((item) => <tr key={item.week} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-bold text-blue-700">
                        Tuần {item.week}
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.goal}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold inline-block ${item.status === "Ho\xE0n th\xE0nh" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : item.status === "\u0110ang th\u1EF1c hi\u1EC7n" ? "bg-blue-50 text-blue-800 border border-blue-200" : "bg-slate-100 text-slate-500"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600">{item.progress}%</span>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
    className={`h-full rounded-full ${item.progress === 100 ? "bg-emerald-500" : "bg-blue-600"}`}
    style={{ width: `${item.progress}%` }}
  />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
    onClick={() => setSelectedWeekDetail(item)}
    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold text-[11px] rounded-lg transition-colors"
  >
                          Xem
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {
    /* Right 1 Col: Milestones & Quick Actions */
  }
        <div className="lg:col-span-1 space-y-6">
          {
    /* Key Milestones */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" /> Mốc thời gian quan trọng
            </h3>

            <div className="space-y-3 text-xs">
              {[
    { title: "N\u1ED9p b\xE1o c\xE1o tu\u1EA7n 6", date: "22/09/2026", nearest: true, status: "C\xF2n 3 ng\xE0y" },
    { title: "\u0110\xE1nh gi\xE1 gi\u1EEFa k\u1EF3", date: "25/09/2026", nearest: false, status: "Doanh nghi\u1EC7p ch\u1EA5m" },
    { title: "Demo d\u1EF1 \xE1n SmartHR", date: "05/10/2026", nearest: false, status: "Thuy\u1EBFt tr\xECnh" },
    { title: "N\u1ED9p b\xE1o c\xE1o cu\u1ED1i k\u1EF3", date: "15/10/2026", nearest: false, status: "B\xE1o c\xE1o PDF ch\xEDnh th\u1EE9c" }
  ].map((m, idx) => <div
    key={idx}
    className={`p-3 rounded-xl border transition-all ${m.nearest ? "bg-blue-50/70 border-blue-300" : "bg-slate-50/80 border-slate-200"}`}
  >
                  <div className="flex items-center justify-between">
                    <p className={`font-bold ${m.nearest ? "text-blue-900" : "text-slate-800"}`}>
                      {m.title}
                    </p>
                    <span className={`text-[10px] font-bold ${m.nearest ? "text-blue-700" : "text-slate-500"}`}>
                      {m.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Hạn chót: {m.date}
                  </p>
                </div>)}
            </div>
          </div>

          {
    /* Quick Actions */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Thao tác nhanh
            </h3>

            <div className="space-y-2">
              <button
    onClick={() => onShowToast("Chuy\u1EC3n sang m\xE0n h\xECnh N\u1ED9p B\xE1o c\xE1o tu\u1EA7n")}
    className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-between"
  >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Nộp báo cáo tuần
                </span>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </button>

              <button
    onClick={() => onShowToast("Chuy\u1EC3n h\u01B0\u1EDBng \u0111\u1EBFn danh m\u1EE5c Bi\u1EC3u m\u1EABu")}
    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-between"
  >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500" /> Xem biểu mẫu & quy chế
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
    onClick={() => setActiveContactModal("lecturer")}
    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-between"
  >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" /> Liên hệ Giảng viên
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {
    /* CONTACT MODAL */
  }
      {activeContactModal && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                {activeContactModal === "lecturer" ? "G\u1EEDi tin nh\u1EAFn cho Gi\u1EA3ng vi\xEAn" : "G\u1EEDi tin nh\u1EAFn cho Mentor Doanh nghi\u1EC7p"}
              </h3>
              <button
    onClick={() => setActiveContactModal(null)}
    className="text-slate-400 hover:text-slate-600 font-bold text-sm"
  >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Người nhận</label>
                <input
    type="text"
    disabled
    value={activeContactModal === "lecturer" ? `${STUDENT_PROFILE.lecturerName} (GVHD)` : `${STUDENT_PROFILE.supervisorName} (Mentor FPT)`}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chủ đề cần hỗ trợ</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium outline-none">
                  <option>Hỏi về Báo cáo thực tập tuần</option>
                  <option>Xin hỗ trợ tài liệu dự án</option>
                  <option>Xin nghỉ phép 1 ngày tại Doanh nghiệp</option>
                  <option>Khác...</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung tin nhắn</label>
                <textarea
    rows={4}
    placeholder="Nhập nội dung thắc mắc hoặc đề xuất hỗ trợ..."
    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500"
  />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
    onClick={() => setActiveContactModal(null)}
    className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl text-slate-700"
  >
                Hủy
              </button>
              <button
    onClick={() => {
      setActiveContactModal(null);
      onShowToast(`\u0110\xE3 g\u1EEDi tin nh\u1EAFn \u0111\u1EBFn ${activeContactModal === "lecturer" ? "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn" : "Mentor Doanh nghi\u1EC7p"}`);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
  >
                <Send className="w-3.5 h-3.5" /> Gửi tin nhắn
              </button>
            </div>
          </div>
        </div>}

      {
    /* WEEKLY DETAIL MODAL */
  }
      {selectedWeekDetail && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                  Chi tiết Tuần {selectedWeekDetail.week}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {selectedWeekDetail.title}
                </h3>
              </div>
              <button
    onClick={() => setSelectedWeekDetail(null)}
    className="text-slate-400 hover:text-slate-600 font-bold text-sm"
  >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mục tiêu công việc</span>
                <p className="text-slate-800 font-medium leading-relaxed">{selectedWeekDetail.goal}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sản phẩm / Bài nộp yêu cầu</span>
                <p className="text-blue-700 font-bold">{selectedWeekDetail.deliverable}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedWeekDetail.status}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mức độ hoàn thành</span>
                  <p className="font-bold text-blue-600 mt-0.5">{selectedWeekDetail.progress}%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
    onClick={() => setSelectedWeekDetail(null)}
    className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl text-slate-700"
  >
                Đóng
              </button>
              <button
    onClick={() => {
      setSelectedWeekDetail(null);
      onShowToast(`M\u1EDF form n\u1ED9p b\xE1o c\xE1o cho Tu\u1EA7n ${selectedWeekDetail.week}`);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
  >
                Nộp báo cáo tuần {selectedWeekDetail.week}
              </button>
            </div>
          </div>
        </div>}
    </div>;
};

export { InternshipView as StudentInternshipView };
