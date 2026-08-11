import { useState } from 'react';
import {
  Target,
  FileCheck2,
  Award,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Building2,
  MessageSquare,
  Bell,
  Upload,
  Send,
  Calendar as CalendarIcon,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import {
  STUDENT_PROFILE,
  INITIAL_STUDENT_TASKS,
  STUDENT_REPORT_DEADLINES,
  STUDENT_FEEDBACKS,
  STUDENT_NOTIFICATIONS
} from '../../../data/studentMockData';
import { EducationDashboardChart } from '../components/EducationDashboardChart';
export const DashboardView = ({
  onNavigate,
  onShowToast
}) => {
  const [tasks, setTasks] = useState(INITIAL_STUDENT_TASKS);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitWeek, setSubmitWeek] = useState("B\xE1o c\xE1o tu\u1EA7n 6");
  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        onShowToast(nextState ? `\u0110\xE3 \u0111\xE1nh d\u1EA5u ho\xE0n th\xE0nh: "${t.title}"` : `\u0110\xE3 b\u1ECF ch\u1ECDn: "${t.title}"`);
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };
  return <div className="space-y-5 animate-in fade-in duration-200">
      {
    /* DEMO SWITCHER & GREETING BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {
    /* Subtle accent border top */
  }
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Xin chào, {STUDENT_PROFILE.name} 👋
            </h1>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[11px] rounded-full border border-indigo-200">
              {STUDENT_PROFILE.mssv}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-full border border-emerald-200">
              {STUDENT_PROFILE.statusBadge}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Thực tập sinh tại <strong className="text-slate-800">{STUDENT_PROFILE.company}</strong> ({STUDENT_PROFILE.position}) • Hướng dẫn: <strong className="text-slate-800">{STUDENT_PROFILE.lecturerName}</strong>
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-500" /> Học kỳ: {STUDENT_PROFILE.semester}
            </span>
            <span className="flex items-center gap-1 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200/60 font-bold">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Lớp: CNTT-K15A
            </span>
          </div>
        </div>

        {
    /* Demo Switcher - Removed as requested */
  }
      </div>

      {
    /* EMPTY STATE VIEW IF DEMO IS ENABLED */
  }
      {showEmptyState ? <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-4 shadow-sm my-6 max-w-2xl mx-auto animate-in zoom-in-95">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800">
              Bạn chưa bắt đầu kỳ thực tập
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Vui lòng hoàn tất đăng ký đợt thực tập, chọn doanh nghiệp nguyện vọng hoặc nộp hồ sơ xác nhận tiếp nhận để mở khóa toàn bộ tính năng báo cáo.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
    onClick={() => {
      setShowEmptyState(false);
      onShowToast("\u0110ang m\u1EDF H\u01B0\u1EDBng d\u1EABn \u0110\u0103ng k\xFD th\u1EF1c t\u1EADp \u0111\u1EE3t I - 2026");
    }}
    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
  >
              <span>Xem hướng dẫn đăng ký đợt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
    onClick={() => onNavigate("student-templates")}
    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
  >
              Tải mẫu đơn đăng ký
            </button>
          </div>
        </div> : <>
          {
    /* SECTION 1: QUICK OVERVIEW (4 KPI Cards) */
  }
          {/* SECTION 1: QUICK OVERVIEW (4 Bento KPI Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Tiến độ thực tập */}
            <div className="il-bento-card p-5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display">Tiến độ thực tập</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 il-kpi-val">
                  {STUDENT_PROFILE.overallProgress}%
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Đã đi qua 7 / 8 tuần thực tập</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${STUDENT_PROFILE.overallProgress}%` }}
                />
              </div>
            </div>

            {/* KPI 2: Báo cáo đã nộp */}
            <div className="il-bento-card p-5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display">Báo cáo đã nộp</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 il-kpi-val">
                  {STUDENT_PROFILE.reportsSubmitted} <span className="text-sm font-semibold text-slate-400">/ {STUDENT_PROFILE.totalReports}</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Còn 3 báo cáo tuần nữa</p>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">Tỷ lệ nộp đúng hạn: 100%</div>
            </div>

            {/* KPI 3: Điểm hiện tại */}
            <div className="il-bento-card p-5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display">Điểm hiện tại</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-900 il-kpi-val">
                  {STUDENT_PROFILE.currentGrade} <span className="text-sm font-semibold text-slate-400">/ 10</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Trung bình đánh giá GV & Doanh nghiệp</p>
              </div>
              <div className="text-[10px] text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-md border border-amber-200/60 inline-block w-fit font-display">
                Xếp loại: Xuất sắc
              </div>
            </div>

            {/* KPI 4: Hạn nộp tiếp theo */}
            <div className="il-bento-card p-5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display">Hạn nộp tiếp theo</span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold animate-pulse">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600 il-kpi-val">
                  3 ngày
                </div>
                <p className="text-[11px] text-rose-900 font-bold mt-1">Hạn Báo cáo tuần 6 (22/09)</p>
              </div>
              <button
                onClick={() => {
                  setSubmitWeek("Báo cáo tuần 6");
                  setShowSubmitModal(true);
                }}
                className="w-full py-2 text-center text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer font-display"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>

          {
    /* MAIN CHART FOCUS SECTION */
  }
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.9fr_1fr]">
            <EducationDashboardChart />
            <div className="space-y-5">
              <div className="bg-white border border-slate-200/80 rounded-[10px] p-5 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Tình hình học thuật</h2>
                    <p className="text-sm text-slate-500">Kết quả báo cáo và đánh giá theo lộ trình thực tập.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tuần 6</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[10px] border border-slate-200/80 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Điểm trung bình</p>
                    <p className="mt-3 text-3xl font-black text-emerald-700">8.6</p>
                    <p className="text-sm text-slate-500 mt-1">Ổn định, đủ điều kiện học phần.</p>
                  </div>
                  <div className="rounded-[10px] border border-slate-200/80 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Báo cáo đúng hạn</p>
                    <p className="mt-3 text-3xl font-black text-indigo-700">100%</p>
                    <p className="text-sm text-slate-500 mt-1">Tuân thủ tiến độ cho cả kỳ.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-[10px] p-5 shadow-xs">
                <h2 className="text-base font-semibold text-slate-900 mb-3">Quan sát nhanh</h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-[10px] bg-indigo-50 border border-indigo-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Đánh giá giảng viên</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">8.8</p>
                    <p className="text-sm text-slate-500 mt-1">Chất lượng phản hồi tăng nhẹ.</p>
                  </div>
                  <div className="p-4 rounded-[10px] bg-slate-50 border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Đánh giá doanh nghiệp</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">8.6</p>
                    <p className="text-sm text-slate-500 mt-1">Phối hợp thực hành tốt.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {
    /* MASTER GRID LAYOUT (2 Cols Left + 1 Col Right Panel) */
  }
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            
            {
    /* LEFT COLUMN: Main Operations (2 Cols) */
  }
            <div className="lg:col-span-2 space-y-5">
              
              {
    /* SECTION 2: VIỆC CẦN LÀM HÔM NAY (Task List) */
  }
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" /> Nhiệm vụ cần hoàn thành
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Các công việc ưu tiên giúp duy trì tiến độ thực tập.
                    </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 font-extrabold px-2.5 py-1 rounded-full border border-blue-100">
                    {tasks.filter((t) => !t.completed).length} việc cần làm
                  </span>
                </div>

                <div className="space-y-2.5">
                  {tasks.map((task) => <div
    key={task.id}
    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${task.completed ? "bg-slate-50/70 border-slate-200 opacity-60" : task.priority === "Cao" ? "bg-rose-50/30 border-rose-200/80 hover:border-rose-300" : "bg-white border-slate-200 hover:border-blue-300"}`}
  >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
    onClick={() => toggleTask(task.id)}
    className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
    title={task.completed ? "B\u1ECF \u0111\xE1nh d\u1EA5u" : "\u0110\xE1nh d\u1EA5u ho\xE0n th\xE0nh"}
  >
                          {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div className="space-y-1 min-w-0">
                          <p className={`text-xs md:text-sm font-bold text-slate-800 leading-snug ${task.completed ? "line-through text-slate-500" : ""}`}>
                            {task.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${task.priority === "Cao" ? "bg-rose-100 text-rose-800" : task.priority === "Trung b\xECnh" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
                              Ưu tiên: {task.priority}
                            </span>
                            <span className="text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> Hạn: {task.deadline}
                            </span>
                          </div>
                        </div>
                      </div>

                      {
    /* Quick Action Button */
  }
                      {!task.completed && <button
    onClick={() => {
      if (task.category === "B\xE1o c\xE1o") {
        setSubmitWeek("B\xE1o c\xE1o tu\u1EA7n 6");
        setShowSubmitModal(true);
      } else {
        onShowToast(`\u0110ang th\u1EF1c hi\u1EC7n: ${task.actionLabel}`);
      }
    }}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${task.priority === "Cao" ? "bg-rose-600 hover:bg-rose-700 text-white shadow-2xs" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
  >
                          {task.actionLabel}
                        </button>}
                    </div>)}
                </div>
              </div>

              {
    /* SECTION 4: LỊCH NỘP BÁO CÁO (Timeline & Deadlines) */
  }
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" /> Lịch nộp báo cáo & Các mốc quan trọng
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Danh sách các kỳ báo cáo định kỳ theo lộ trình đào tạo của Khoa.
                    </p>
                  </div>
                  <button
    onClick={() => onNavigate("student-weekly-reports")}
    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
  >
                    Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {STUDENT_REPORT_DEADLINES.map((item) => <div
    key={item.id}
    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${item.urgent ? "bg-rose-50/50 border-rose-300 ring-1 ring-rose-200" : item.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? "bg-slate-50/80 border-slate-200" : "bg-white border-slate-200"}`}
  >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${item.urgent ? "bg-rose-600 text-white" : item.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                          {item.deadlineDate}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs md:text-sm font-bold text-slate-800">
                              {item.weekName}
                            </p>
                            {item.urgent && <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                                🔥 Sắp đến hạn
                              </span>}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {item.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? `\u0110\xE3 n\u1ED9p \u0111\xFAng h\u1EA1n \u2022 \u0110i\u1EC3m \u0111\xE1nh gi\xE1: ${item.score}/10` : `H\u1EA1n ch\xF3t: 23:59 ng\xE0y ${item.deadlineDate}/2026`}
                          </p>
                        </div>
                      </div>

                      <div>
                        {item.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                            Đã nộp
                          </span> : <button
    onClick={() => {
      setSubmitWeek(item.weekName);
      setShowSubmitModal(true);
    }}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${item.urgent ? "bg-rose-600 hover:bg-rose-700 text-white shadow-2xs" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
  >
                            Nộp bài
                          </button>}
                      </div>
                    </div>)}
                </div>
              </div>

              {
    /* SECTION 5: PHẢN HỒI MỚI NHẤT */
  }
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" /> Phản hồi mới nhất từ Giảng viên & Doanh nghiệp
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Nhận xét trực tiếp giúp sinh viên kịp thời điều chỉnh nội dung thực tập.
                    </p>
                  </div>
                  <button
    onClick={() => onNavigate("student-feedback")}
    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
  >
                    Xem tất cả
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STUDENT_FEEDBACKS.map((fb) => <div
    key={fb.id}
    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-blue-300 transition-all flex flex-col justify-between"
  >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
    src={fb.avatar}
    alt={fb.senderName}
    className="w-9 h-9 rounded-full object-cover border border-slate-200"
  />
                            <div>
                              <p className="text-xs font-bold text-slate-800">{fb.senderName}</p>
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${fb.senderRole === "Gi\u1EA3ng vi\xEAn" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                                {fb.senderRole}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{fb.timeAgo}</span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-100">
                          "{fb.preview}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-slate-500">
                          {fb.reportRef}
                        </span>
                        <button
    onClick={() => setSelectedFeedback(fb)}
    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
  >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>)}
                </div>
              </div>

            </div>

            {
    /* RIGHT COLUMN PANEL (1 Col) */
  }
            <div className="lg:col-span-1 space-y-5">
              
              {
    /* SECTION 7: THÔNG TIN DOANH NGHIỆP (Company Card) */
  }
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" /> Doanh nghiệp thực tập
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md">
                    Chính thức
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
                      FPT
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {STUDENT_PROFILE.company}
                      </h4>
                      <p className="text-xs text-blue-600 font-bold">
                        {STUDENT_PROFILE.position}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Mentor: <strong className="text-slate-800">{STUDENT_PROFILE.supervisorName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{STUDENT_PROFILE.supervisorEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{STUDENT_PROFILE.supervisorPhone}</span>
                    </div>
                    <div className="flex items-start gap-2 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight text-slate-500">{STUDENT_PROFILE.companyAddress}</span>
                    </div>
                  </div>

                  <button
    onClick={() => onNavigate("student-internship")}
    className="w-full py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
  >
                    <span>Xem chi tiết hồ sơ</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {
    /* RIGHT PANEL: UPCOMING KEY DEADLINES */
  }
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-600" /> Mốc thời gian quan trọng
                  </h3>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-100">
                    Tháng 09/2026
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-800 font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      <span>Hạn Báo cáo tuần 6</span>
                    </div>
                    <span className="font-extrabold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md text-[11px]">22/09</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Hạn Báo cáo giữa kỳ</span>
                    </div>
                    <span className="font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md text-[11px]">28/09</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>Hạn Báo cáo cuối kỳ</span>
                    </div>
                    <span className="font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md text-[11px]">05/10</span>
                  </div>
                </div>
              </div>

              {
    /* SECTION 6: THÔNG BÁO MỚI NHẤT */
  }
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" /> Thông báo mới
                  </h3>
                  <button
    onClick={() => onNavigate("student-notifications")}
    className="text-xs text-blue-600 font-bold hover:underline"
  >
                    Xem tất cả
                  </button>
                </div>

                <div className="space-y-2">
                  {STUDENT_NOTIFICATIONS.map((n) => <div
    key={n.id}
    className={`p-3 rounded-xl text-xs space-y-1 transition-colors ${n.unread ? "bg-blue-50/90 border border-blue-200 font-semibold" : "bg-slate-50 text-slate-600"}`}
  >
                      <p className="text-slate-800 leading-snug">{n.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{n.timeAgo}</p>
                    </div>)}
                </div>
              </div>

            </div>
          </div>
        </>}

      {
    /* FEEDBACK DETAIL MODAL */
  }
      {selectedFeedback && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <img src={selectedFeedback.avatar} alt={selectedFeedback.senderName} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{selectedFeedback.senderName}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{selectedFeedback.senderRole} • {selectedFeedback.timeAgo}</p>
                </div>
              </div>
              <button onClick={() => setSelectedFeedback(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-100 inline-block">
                {selectedFeedback.reportRef}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedFeedback.detail}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
    onClick={() => {
      setSelectedFeedback(null);
      onShowToast("\u0110\xE3 ghi nh\u1EADn ph\u1EA3n h\u1ED3i!");
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
  >
                Đóng
              </button>
            </div>
          </div>
        </div>}

      {
    /* SUBMIT REPORT MODAL */
  }
      {showSubmitModal && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /> Nộp bài: {submitWeek}
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài nộp</label>
                <input
    type="text"
    defaultValue={`[B\xE1o c\xE1o] Nguy\u1EC5n V\u0103n A - ${submitWeek}`}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tóm tắt nội dung thực tập trong tuần</label>
                <textarea
    rows={3}
    placeholder="Mô tả tóm tắt các task đã thực hiện, kết quả đạt được và khó khăn gặp phải..."
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đính kèm tệp báo cáo (PDF, DOCX, ZIP)</label>
                <div className="border-2 border-dashed border-blue-200 bg-blue-50/40 p-4 text-center rounded-xl hover:bg-blue-50 transition-colors cursor-pointer space-y-1">
                  <Upload className="w-6 h-6 text-blue-600 mx-auto" />
                  <p className="font-bold text-blue-800 text-xs">Kéo thả tệp vào đây hoặc Bấm để chọn tệp</p>
                  <p className="text-[10px] text-slate-400">Tối đa 25MB (PDF, DOCX, ZIP)</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
    onClick={() => setShowSubmitModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
  >
                Hủy
              </button>
              <button
    onClick={() => {
      setShowSubmitModal(false);
      onShowToast(`\u0110\xE3 n\u1ED9p th\xE0nh c\xF4ng ${submitWeek}!`);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
  >
                <Send className="w-3.5 h-3.5" />
                <span>Nộp ngay</span>
              </button>
            </div>
          </div>
        </div>}
    </div>;
};

export { DashboardView as StudentDashboardView };
