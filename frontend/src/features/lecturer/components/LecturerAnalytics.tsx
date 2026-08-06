import { useState } from 'react';
import { Toast } from '../../../components/common/Toast';
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
  GraduationCap
} from 'lucide-react';
export const LecturerAnalytics = () => {
  const [selectedSemester, setSelectedSemester] = useState("HK I - 2026");
  const [selectedClass, setSelectedClass] = useState("T\u1EA5t c\u1EA3 l\u1EDBp");
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3e3);
  };
  const handleExportExcel = () => {
    showToast("\u0110ang t\u1EA1o v\xE0 t\u1EA3i xu\u1ED1ng file Excel Th\u1ED1ng k\xEA B\xE1o c\xE1o Th\u1EF1c t\u1EADp...");
  };
  const handleExportPDF = () => {
    showToast("\u0110ang xu\u1EA5t B\xE1o c\xE1o Th\u1ED1ng k\xEA \u0111\u1ECBnh d\u1EA1ng PDF...");
  };
  const handlePrint = () => {
    window.print();
  };
  return <div className="space-y-6 animate-in fade-in duration-200 pb-12 font-sans">
      {
    /* Toast Notification */
  }
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      {
    /* HEADER & EXPORT ACTION BAR */
  }
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Thống kê &amp; Phân tích Chuyên sâu
            </h1>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[10px] rounded-full border border-indigo-200">
              Báo cáo Khoa CNTT
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Phân tích tiến độ 12 tuần, phổ điểm tiêu chí, hiệu suất hướng dẫn và chất lượng doanh nghiệp tiếp nhận.
          </p>
        </div>

        {
    /* Export Actions */
  }
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
    onClick={handleExportExcel}
    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
    title="Xuất dữ liệu Excel"
  >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>

          <button
    onClick={handleExportPDF}
    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
    title="Xuất file PDF"
  >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất PDF</span>
          </button>

          <button
    onClick={handlePrint}
    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
    title="In báo cáo"
  >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">In Báo cáo</span>
          </button>
        </div>
      </div>

      {
    /* 4 SYNCHRONIZED TOP METRIC CARDS */
  }
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {
    /* 1. TỔNG SINH VIÊN HD */
  }
        <div
    onClick={() => {
      setSelectedClass("T\u1EA5t c\u1EA3 l\u1EDBp");
      setSelectedSemester("HK I - 2026");
    }}
    className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">
              Sinh viên hướng dẫn
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">28</span>
            <span className="text-xs font-bold text-slate-400">sinh viên</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">100% Đã phân công giảng viên</span>
        </div>

        {
    /* 2. ĐANG THỰC TẬP TẠI DN */
  }
        <div
    className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
              Đang thực tập tại DN
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-800">25</span>
            <span className="text-xs font-bold text-emerald-600">sinh viên</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">89.3% Đã có vị trí tại DN</span>
        </div>

        {
    /* 3. TUÂN THỦ TIẾN ĐỘ NỘP BÀI */
  }
        <div
    className="bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/40 p-4 rounded-2xl border border-sky-200/80 border-l-4 border-l-sky-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-[10px] font-extrabold uppercase text-sky-800 tracking-wider">
              Tuân thủ Tiến độ Nộp
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-100/80 text-sky-600 border border-sky-200/60 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-sky-800">89.3%</span>
            <span className="text-xs font-bold text-sky-600">đúng hạn</span>
          </div>
          <span className="text-[11px] text-sky-600 font-bold block">3 sinh viên trễ báo cáo tuần</span>
        </div>

        {
    /* 4. ĐIỂM TRUNG BÌNH ĐỢT */
  }
        <div
    className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
              Điểm Trung Bình Đợt
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-800">8.65</span>
            <span className="text-xs font-bold text-amber-600">/ 10</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">Xếp loại Khá - Giỏi - Xuất sắc</span>
        </div>
      </section>

      {
    /* FILTER & ANALYTICAL SCOPE BAR */
  }
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
              Phạm vi phân tích &amp; Lọc dữ liệu báo cáo
            </h2>
          </div>

          {(selectedSemester !== "HK I - 2026" || selectedClass !== "T\u1EA5t c\u1EA3 l\u1EDBp") && <button
    onClick={() => {
      setSelectedSemester("HK I - 2026");
      setSelectedClass("T\u1EA5t c\u1EA3 l\u1EDBp");
    }}
    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
  >
              Xóa bộ lọc
            </button>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div>
            <select
    value={selectedSemester}
    onChange={(e) => setSelectedSemester(e.target.value)}
    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="HK I - 2026">Học kỳ: HK I - 2026 (Hiện tại)</option>
              <option value="HK II - 2025">Học kỳ: HK II - 2025</option>
              <option value="HK I - 2025">Học kỳ: HK I - 2025</option>
            </select>
          </div>

          <div>
            <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
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
    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả doanh nghiệp">Tất cả Doanh nghiệp đối tác</option>
              <option value="FPT Software">FPT Software</option>
              <option value="Viettel Telecom">Viettel Telecom</option>
              <option value="VNG Corporation">VNG Corporation</option>
              <option value="MISA">MISA Joint Stock Co.</option>
            </select>
          </div>
        </div>
      </div>

      {
    /* 2. CHARTS & VISUAL ANALYTICS */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {
    /* Weekly Submission Trend */
  }
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Xu hướng nộp Báo cáo tuần (Tuần 1 - Tuần 12)
              </h3>
              <p className="text-xs text-slate-500">Tỷ lệ sinh viên nộp báo cáo đúng hạn, trễ hạn và quá hạn theo từng tuần</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 shrink-0">
              89.3% Tuân thủ
            </span>
          </div>

          {
    /* Simulated Visual Bar Chart */
  }
          <div className="space-y-3 pt-2">
            {[
    { week: "Tu\u1EA7n 1-3 (Kh\u1EDFi \u0111\u1ED9ng & Nh\u1EADn \u0111\u1EC1 t\xE0i)", onTime: 27, late: 1, missing: 0 },
    { week: "Tu\u1EA7n 4-6 (Ph\xE2n t\xEDch & Thi\u1EBFt k\u1EBF)", onTime: 26, late: 2, missing: 0 },
    { week: "Tu\u1EA7n 7-9 (L\u1EADp tr\xECnh & Tri\u1EC3n khai)", onTime: 24, late: 3, missing: 1 },
    { week: "Tu\u1EA7n 10-12 (Ki\u1EC3m th\u1EED & B\xE1o c\xE1o cu\u1ED1i \u0111\u1EE3t)", onTime: 22, late: 4, missing: 2 }
  ].map((item, idx) => <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{item.week}</span>
                  <span className="text-slate-500 text-[11px]">
                    <strong className="text-emerald-600">{item.onTime}</strong> đúng hạn •{" "}
                    <strong className="text-amber-600">{item.late}</strong> trễ •{" "}
                    <strong className="text-rose-600">{item.missing}</strong> thiếu
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
    style={{ width: `${item.onTime / 28 * 100}%` }}
    className="bg-emerald-500 h-full transition-all duration-500"
    title={`\u0110\xFAng h\u1EA1n: ${item.onTime} SV`}
  />
                  <div
    style={{ width: `${item.late / 28 * 100}%` }}
    className="bg-amber-400 h-full transition-all duration-500"
    title={`Tr\u1EC5 h\u1EA1n: ${item.late} SV`}
  />
                  <div
    style={{ width: `${item.missing / 28 * 100}%` }}
    className="bg-rose-500 h-full transition-all duration-500"
    title={`Thi\u1EBFu: ${item.missing} SV`}
  />
                </div>
              </div>)}
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
            <span className="font-bold text-blue-600">Tổng 12 báo cáo tuần / SV</span>
          </div>
        </div>

        {
    /* Grade Distribution Breakdown */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                Phân bố Phổ điểm Đánh giá
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                28 Sinh viên
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Xuất sắc (9.0 - 10.0)
                  </span>
                  <span className="text-slate-900 font-extrabold">8 SV (28.6%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "28.6%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-blue-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Giỏi (8.0 - 8.9)
                  </span>
                  <span className="text-slate-900 font-extrabold">12 SV (42.8%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "42.8%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-amber-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Khá (7.0 - 7.9)
                  </span>
                  <span className="text-slate-900 font-extrabold">5 SV (17.9%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "17.9%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Trung bình (5.5 - 6.9)
                  </span>
                  <span className="text-slate-900 font-extrabold">2 SV (7.1%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: "7.1%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-rose-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Không đạt (&lt; 5.5)
                  </span>
                  <span className="text-slate-900 font-extrabold">1 SV (3.6%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: "3.6%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>Tỷ lệ xếp loại Khá - Giỏi - Xuất sắc:</span>
            <strong className="text-emerald-700 font-extrabold">89.3%</strong>
          </div>
        </div>
      </div>

      {
    /* 3. LECTURER GUIDANCE STATISTICS (THỐNG KÊ HOẠT ĐỘNG HƯỚNG DẪN) */
  }
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 rounded-2xl shadow-md border border-blue-800/60 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Thống kê Hoạt động Hướng dẫn Giảng viên</h3>
              <p className="text-xs text-blue-200">Hiệu suất chấm bài, phản hồi sinh viên và hoàn thành đợt thực tập</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold rounded-full">
            GV: Trần Minh Huy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-blue-200 text-xs font-semibold">
              <span>Báo cáo đã nhận xét</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">142 bài</p>
            <p className="text-[11px] text-emerald-300 font-medium">Đạt 96% tổng số bài nộp</p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-blue-200 text-xs font-semibold">
              <span>Báo cáo chờ phản hồi</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-300">6 bài</p>
            <p className="text-[11px] text-amber-200 font-medium">Cần xử lý trong tuần này</p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-blue-200 text-xs font-semibold">
              <span>SV Hoàn thành đợt</span>
              <GraduationCap className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-black text-sky-300">18 / 28 SV</p>
            <p className="text-[11px] text-sky-200 font-medium">Đã chấm điểm &amp; bảo vệ</p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-blue-200 text-xs font-semibold">
              <span>Thời gian phản hồi TB</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-indigo-300">1.2 ngày</p>
            <p className="text-[11px] text-indigo-200 font-medium">Nhanh hơn 85% GV toàn khoa</p>
          </div>
        </div>
      </div>

      {
    /* 4. COMPANY STATISTICS (THỐNG KÊ DOANH NGHIỆP TIẾP NHẬN SINH VIÊN) */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Thống kê Doanh nghiệp Hợp tác &amp; Vị trí Thực tập
            </h3>
            <p className="text-xs text-slate-500">Danh sách các đơn vị tiếp nhận sinh viên hướng dẫn của giảng viên</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200">
            6 Doanh nghiệp đối tác chính
          </span>
        </div>

        {
    /* Company Table */
  }
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
              {[
    {
      company: "FPT Software (H\xE0 N\u1ED9i)",
      count: 6,
      positions: "Fullstack Developer, React Frontend",
      rating: 4.9,
      rank: "H\u1EE3p t\xE1c Xu\u1EA5t s\u1EAFc",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      company: "Viettel Telecom",
      count: 5,
      positions: "Data Engineer, Python Backend",
      rating: 4.8,
      rank: "H\u1EE3p t\xE1c Xu\u1EA5t s\u1EAFc",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      company: "VNG Corporation",
      count: 4,
      positions: "Cloud DevOps, Infrastructure",
      rating: 4.7,
      rank: "H\u1EE3p t\xE1c T\u1ED1t",
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      company: "MISA Joint Stock Company",
      count: 3,
      positions: "Java Backend, QA/QC Tester",
      rating: 4.6,
      rank: "H\u1EE3p t\xE1c T\u1ED1t",
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      company: "Shopee Vietnam",
      count: 3,
      positions: "Data Analyst, Mobile React Native",
      rating: 4.8,
      rank: "H\u1EE3p t\xE1c Xu\u1EA5t s\u1EAFc",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      company: "CMC Global",
      count: 2,
      positions: "Business Analyst, Web Frontend",
      rating: 4.5,
      rank: "H\u1EE3p t\xE1c T\u1ED1t",
      color: "text-blue-600 bg-blue-50 border-blue-200"
    }
  ].map((item, index) => <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{item.company}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-extrabold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">
                      {item.count} sinh viên
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-normal">{item.positions}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating} / 5.0</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${item.color}`}>
                      {item.rank}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* 5. AI PLAGIARISM & ORIGINALITY SUMMARY */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Kiểm tra Trùng lặp AI &amp; Độ nguyên bản báo cáo</h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            94.2% Nguyên bản Trung bình
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <p className="font-bold text-slate-900 flex items-center justify-between">
              <span>Báo cáo tuần 12 - Lớp C24A.TH1</span>
              <span className="text-emerald-600 font-extrabold">An toàn (&lt; 10%)</span>
            </p>
            <p className="text-slate-500 leading-relaxed">
              Tất cả 26 bài nộp đúng hạn đều đạt chỉ số trùng lặp thấp, không phát hiện sao chép từ kho tài liệu khóa trước.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
            <p className="font-bold text-amber-900 flex items-center justify-between">
              <span>Báo cáo Giữa kỳ - 2 bài cần lưu ý</span>
              <span className="text-amber-700 font-extrabold">Trùng lặp 24% - 32%</span>
            </p>
            <p className="text-amber-800 leading-relaxed">
              Phát hiện một số đoạn trích dẫn tài liệu kỹ thuật từ Viettel chưa ghi rõ nguồn tham khảo. Giảng viên đã nhắc nhở chỉnh sửa.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
