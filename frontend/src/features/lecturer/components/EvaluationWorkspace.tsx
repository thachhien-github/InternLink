import { useState } from 'react';
import { Toast } from '../../../components/common/Toast';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Award,
  FileCheck,
  Download,
  Eye,
  Bold,
  Italic,
  List,
  History
} from 'lucide-react';
export const EvaluationWorkspace = ({
  student,
  onBack,
  onSave
}) => {
  const [activeLeftTab, setActiveLeftTab] = useState("tiendo");
  const [processScore, setProcessScore] = useState(student.lecturerScore ? Number((student.lecturerScore * 0.9).toFixed(1)) : 9);
  const [reportScore, setReportScore] = useState(student.lecturerScore || 9);
  const [enterpriseScore, setEnterpriseScore] = useState(student.enterpriseScore || 9.2);
  const [hasPresentation, setHasPresentation] = useState(true);
  const [presentationScore, setPresentationScore] = useState(student.presentationScore || 9.5);
  const [commentText, setCommentText] = useState(
    student.lecturerComments || "Sinh vi\xEAn n\u1EAFm v\u1EEFng ki\u1EBFn th\u1EE9c chuy\xEAn m\xF4n, ch\u1EE7 \u0111\u1ED9ng h\u1ECDc h\u1ECFi c\xF4ng ngh\u1EC7 m\u1EDBi t\u1EA1i doanh nghi\u1EC7p. B\xE1o c\xE1o th\u1EF1c t\u1EADp \u0111\u01B0\u1EE3c tr\xECnh b\xE0y m\u1EA1ch l\u1EA1c, k\u1EBFt qu\u1EA3 th\u1EF1c hi\u1EC7n d\u1EF1 \xE1n \u0111\u1EA1t y\xEAu c\u1EA7u cao t\u1EEB Mentor."
  );
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const calculateFinalScore = () => {
    if (hasPresentation) {
      const total = processScore * 0.2 + reportScore * 0.3 + enterpriseScore * 0.3 + presentationScore * 0.2;
      return parseFloat(total.toFixed(1));
    } else {
      const total = processScore * 0.25 + reportScore * 0.35 + enterpriseScore * 0.4;
      return parseFloat(total.toFixed(1));
    }
  };
  const finalScore = calculateFinalScore();
  const getGradeBadge = (score) => {
    if (score >= 9) return { label: "Xu\u1EA5t s\u1EAFc", color: "bg-purple-100 text-purple-800 border-purple-200" };
    if (score >= 8) return { label: "Gi\u1ECFi", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (score >= 6.5) return { label: "Kh\xE1", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (score >= 5) return { label: "Trung b\xECnh", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "Kh\xF4ng \u0111\u1EA1t", color: "bg-rose-100 text-rose-800 border-rose-200" };
  };
  const gradeInfo = getGradeBadge(finalScore);
  const handleSaveDraft = () => {
    const updated = {
      ...student,
      enterpriseScore,
      lecturerScore: reportScore,
      presentationScore: hasPresentation ? presentationScore : void 0,
      totalScore: finalScore,
      status: "\u0110ang ch\u1EA5m",
      lecturerComments: commentText,
      gradeClassification: gradeInfo.label
    };
    onSave(updated);
    showToast(`\u0110\xE3 l\u01B0u nh\xE1p k\u1EBFt qu\u1EA3 ch\u1EA5m \u0111i\u1EC3m cho ${student.name}`);
  };
  const handleComplete = () => {
    const updated = {
      ...student,
      enterpriseScore,
      lecturerScore: reportScore,
      presentationScore: hasPresentation ? presentationScore : void 0,
      totalScore: finalScore,
      status: "Ho\xE0n th\xE0nh",
      lecturerComments: commentText,
      gradeClassification: gradeInfo.label
    };
    onSave(updated);
    showToast(`\u0110\xE3 ho\xE0n th\xE0nh & ch\xEDnh th\u1EE9c c\xF4ng b\u1ED1 \u0111i\u1EC3m cho ${student.name}`);
  };
  return <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {
    /* Toast Alert */
  }
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {
    /* WORKSPACE PAGE HEADER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
    onClick={onBack}
    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
    title="Quay lại danh sách"
  >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Không gian chấm điểm thực tập (Evaluation Workspace)
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đánh giá chi tiết báo cáo, tổng hợp điểm quá trình và doanh nghiệp cho sinh viên.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
    onClick={handleSaveDraft}
    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
  >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Lưu nháp</span>
          </button>

          <button
    onClick={handleComplete}
    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
  >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn thành &amp; Công bố điểm</span>
          </button>
        </div>
      </div>

      {
    /* MAIN TWO-COLUMN WORKSPACE LAYOUT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {
    /* LEFT COLUMN (5 cols on lg) - STUDENT INFO, TABS, TIMELINE */
  }
        <div className="lg:col-span-5 space-y-6">
          {
    /* STUDENT INFORMATION CARD */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <img
    src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
    alt={student.name}
    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
  />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-slate-900 text-base">{student.name}</h2>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-200">
                    {student.class}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <span>MSSV: <strong className="text-slate-800">{student.mssv}</strong></span>
                  <span>•</span>
                  <span>{student.major}</span>
                </p>

                <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 pt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-800">{student.company}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Thời gian thực tập</span>
                <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  12 tuần (01/08 - 24/10)
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Mentor hướng dẫn</span>
                <span className="font-bold text-slate-800 text-[11px] truncate block mt-0.5">
                  {student.supervisor}
                </span>
              </div>
            </div>
          </div>

          {
    /* LEFT TABS & CONTENTS */
  }
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {
    /* Tab Headers */
  }
            <div className="flex border-b border-slate-200 bg-slate-50/80 p-1 text-xs font-bold">
              {[
    { id: "tiendo", label: "Ti\u1EBFn \u0111\u1ED9" },
    { id: "bainop", label: "B\xE0i n\u1ED9p" },
    { id: "nhanxet", label: "Nh\u1EADn x\xE9t" },
    { id: "diem", label: "L\u1ECBch s\u1EED \u0111i\u1EC3m" }
  ].map((tab) => <button
    key={tab.id}
    onClick={() => setActiveLeftTab(tab.id)}
    className={`flex-1 py-2 text-center rounded-xl transition-all ${activeLeftTab === tab.id ? "bg-white text-blue-600 font-extrabold shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
  >
                  {tab.label}
                </button>)}
            </div>

            {
    /* Tab Body Content */
  }
            <div className="p-4 text-xs font-sans space-y-4">
              {activeLeftTab === "tiendo" && <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Tổng tiến độ thực tập:</span>
                    <span className="font-black text-blue-700 text-sm">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.progress}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                      <div className="flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Nhật ký hàng tuần</span>
                      </div>
                      <p className="text-[11px] font-extrabold">{student.weeklyReportCount} bài đã nộp</p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 space-y-1">
                      <div className="flex items-center gap-1 font-bold">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>Báo cáo cuối kỳ</span>
                      </div>
                      <p className="text-[11px] font-extrabold">Đã hoàn thành</p>
                    </div>
                  </div>
                </div>}

              {activeLeftTab === "bainop" && <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">Bao_Cao_Thuc_Tap_Final.docx</p>
                        <p className="text-[10px] text-slate-400">1.8 MB • Nộp ngày 22/10/2026</p>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-blue-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">Phieu_Danh_Gia_Doanh_Nghiep.pdf</p>
                        <p className="text-[10px] text-slate-400">420 KB • Mentor đã ký tên &amp; đóng dấu</p>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-emerald-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">Slide_Bao_Ve_Thuc_Tap.pptx</p>
                        <p className="text-[10px] text-slate-400">4.2 MB • Nộp ngày 24/10/2026</p>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-amber-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>}

              {activeLeftTab === "nhanxet" && <div className="space-y-2.5">
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                    <p className="font-bold text-blue-900 text-xs">Nhận xét từ Mentor Doanh nghiệp:</p>
                    <p className="text-slate-700 italic text-[11px]">
                      "Sinh viên chấp hành tốt kỷ luật lao động, nắm bắt nhanh bài toán nghiệp vụ FPT Software. Đánh giá xuất sắc."
                    </p>
                  </div>
                </div>}

              {activeLeftTab === "diem" && <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-600">Điểm Doanh nghiệp:</span>
                    <strong className="text-blue-700">{student.enterpriseScore || "Ch\u01B0a c\xF3"}</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-600">Điểm Báo cáo Giảng viên:</span>
                    <strong className="text-blue-700">{student.lecturerScore || "Ch\u01B0a ch\u1EA5m"}</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-600">Điểm Tổng kết:</span>
                    <strong className="text-purple-700 font-black">{student.totalScore || "--"}</strong>
                  </div>
                </div>}
            </div>
          </div>

          {
    /* SUBMISSION & EVALUATION TIMELINE */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-blue-600" />
              <span>Nhật ký tiến trình nộp bài &amp; đánh giá (Timeline)</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              {
    /* Timeline item 1 */
  }
              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                <p className="font-bold text-slate-900">Hoàn thành 12/12 Nhật ký thực tập hàng tuần</p>
                <p className="text-[10px] text-slate-400">20/10/2026 • Sinh viên đã nộp đầy đủ</p>
              </div>

              {
    /* Timeline item 2 */
  }
              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                <p className="font-bold text-slate-900">Nộp Báo cáo thực tập cuối kỳ (File Word)</p>
                <p className="text-[10px] text-slate-400">22/10/2026 • Đúng thời hạn qui định</p>
              </div>

              {
    /* Timeline item 3 */
  }
              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                <p className="font-bold text-slate-900">Doanh nghiệp tải lên Phiếu đánh giá Mentor</p>
                <p className="text-[10px] text-slate-400">23/10/2026 • Đạt 9.2/10 điểm</p>
              </div>

              {
    /* Timeline item 4 */
  }
              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white" />
                <p className="font-bold text-blue-700">Giảng viên thực hiện chấm điểm cuối kỳ</p>
                <p className="text-[10px] text-slate-400">Hôm nay (Đang xử lý)</p>
              </div>
            </div>
          </div>
        </div>

        {
    /* RIGHT COLUMN (7 cols on lg) - AI SUGGESTIONS & EVALUATION FORM */
  }
        <div className="lg:col-span-7 space-y-6">


          {
    /* MAIN EVALUATION FORM CARD */
  }
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Biểu mẫu đánh giá &amp; Chấm điểm chi tiết</span>
            </h2>

            <div className="space-y-5 text-xs font-sans">
              {
    /* SECTION 1: ĐIỂM QUÁ TRÌNH */
  }
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 text-xs">
                    1. Điểm quá trình thực tập (Thang 10 - Trọng số 20%)
                  </label>
                  <span className="font-black text-blue-700 text-base">{processScore}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Dựa trên thái độ, tính kỷ luật và việc nộp báo cáo tuần đúng hạn (12/12 bài).
                </p>
                <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={processScore}
    onChange={(e) => setProcessScore(parseFloat(e.target.value))}
    className="w-full accent-blue-600 cursor-pointer"
  />
              </div>

              {
    /* SECTION 2: ĐIỂM BÁO CÁO */
  }
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 text-xs">
                    2. Điểm Báo cáo thực tập do Giảng viên chấm (Thang 10 - Trọng số 30%)
                  </label>
                  <span className="font-black text-blue-700 text-base">{reportScore}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Đánh giá độ sâu nội dung đề tài, định dạng báo cáo và khối lượng công việc thực hiện.
                </p>
                <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={reportScore}
    onChange={(e) => setReportScore(parseFloat(e.target.value))}
    className="w-full accent-blue-600 cursor-pointer"
  />
              </div>

              {
    /* SECTION 3: ĐIỂM DOANH NGHIỆP */
  }
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 text-xs">
                    3. Điểm đánh giá từ Doanh nghiệp (Thang 10 - Trọng số 30%)
                  </label>
                  <span className="font-black text-blue-700 text-base">{enterpriseScore}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Lấy trực tiếp từ Phiếu nhận xét chính thức do Mentor {student.supervisor} ký tên.
                </p>
                <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={enterpriseScore}
    onChange={(e) => setEnterpriseScore(parseFloat(e.target.value))}
    className="w-full accent-blue-600 cursor-pointer"
  />
              </div>

              {
    /* SECTION 4: ĐIỂM BẢO VỆ (OPTIONAL) */
  }
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
    type="checkbox"
    id="hasPres"
    checked={hasPresentation}
    onChange={(e) => setHasPresentation(e.target.checked)}
    className="accent-blue-600 w-4 h-4 rounded"
  />
                    <label htmlFor="hasPres" className="font-extrabold text-slate-900 text-xs cursor-pointer">
                      4. Điểm Bảo vệ trước Hội đồng (Tùy chọn - Trọng số 20%)
                    </label>
                  </div>

                  {hasPresentation && <span className="font-black text-blue-700 text-base">{presentationScore}</span>}
                </div>

                {hasPresentation && <div className="space-y-2 pt-1">
                    <p className="text-[11px] text-slate-500">
                      Điểm thuyết trình và trả lời câu hỏi phản biện của sinh viên trước Hội đồng chấm.
                    </p>
                    <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={presentationScore}
    onChange={(e) => setPresentationScore(parseFloat(e.target.value))}
    className="w-full accent-blue-600 cursor-pointer"
  />
                  </div>}
              </div>

              {
    /* FINAL SCORE SUMMARY BANNER */
  }
              <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 rounded-2xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    Điểm tổng kết tự động (Calculated Final Score):
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-blue-900">{finalScore}</span>
                    <span className="text-xs text-slate-500 font-bold">/ 10.0</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Xếp loại tổng kết:</span>
                  <span className={`px-3 py-1 font-black text-xs rounded-xl border ${gradeInfo.color}`}>
                    {gradeInfo.label}
                  </span>
                </div>
              </div>

              {
    /* COMMENT: RICH TEXT EDITOR SIMULATION */
  }
              <div className="space-y-2">
                <label className="block font-extrabold text-slate-900 text-xs">
                  Nhận xét chi tiết của Giảng viên (Lecturer Comments)
                </label>

                {
    /* Editor Toolbar */
  }
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white focus-within:border-blue-500 transition-colors">
                  <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1">
                    <button
    type="button"
    onClick={() => showToast("\u0110\xE3 \u0111\u1ECBnh d\u1EA1ng In \u0111\u1EADm")}
    className="p-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold"
    title="In đậm"
  >
                      <Bold className="w-3.5 h-3.5" />
                    </button>

                    <button
    type="button"
    onClick={() => showToast("\u0110\xE3 \u0111\u1ECBnh d\u1EA1ng In nghi\xEAng")}
    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
    title="In nghiêng"
  >
                      <Italic className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    <button
    type="button"
    onClick={() => showToast("Th\xEAm danh s\xE1ch g\u1EA1ch \u0111\u1EA7u d\xF2ng")}
    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
    title="Danh sách"
  >
                      <List className="w-3.5 h-3.5" />
                    </button>

                    <button
    type="button"
    onClick={() => showToast("Th\xEAm m\u1EABu nh\u1EADn x\xE9t chu\u1EA9n")}
    className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded border border-slate-200 ml-auto"
  >
                      + Mẫu nhận xét đạt yêu cầu
                    </button>
                  </div>

                  <textarea
    rows={4}
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder="Nhập nhận xét đánh giá dành cho sinh viên..."
    className="w-full p-3 text-xs outline-none font-medium text-slate-800 leading-relaxed resize-none"
  />
                </div>
              </div>

              {
    /* BOTTOM ACTIONS */
  }
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
    type="button"
    onClick={handleSaveDraft}
    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
  >
                  <Save className="w-4 h-4 text-slate-500" />
                  <span>Lưu nháp</span>
                </button>

                <button
    type="button"
    onClick={handleComplete}
    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
  >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn thành đánh giá</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
