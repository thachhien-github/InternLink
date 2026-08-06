import { useState } from 'react';
import { Toast } from '../../../components/common/Toast';
import {
  Save,
  Award,
  ArrowLeft,
  Building2,
  Printer
} from 'lucide-react';
const DEFAULT_STUDENT = {
  id: "eval-1",
  name: "Nguy\u1EC5n V\u0103n An",
  mssv: "20210001",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  class: "CNTT-K15A",
  major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
  company: "FPT Software",
  supervisor: "Nguy\u1EC5n V\u0103n H\u1EA3i (Mentor)",
  progress: 100,
  enterpriseScore: 9.2,
  lecturerScore: 9,
  presentationScore: 9.5,
  totalScore: 9.2,
  status: "Ho\xE0n th\xE0nh",
  weeklyReportCount: "12/12",
  finalReportSubmitted: true,
  enterpriseFeedbackSubmitted: true,
  lecturerComments: "Sinh vi\xEAn ho\xE0n th\xE0nh xu\u1EA5t s\u1EAFc \u0111\u1EC1 t\xE0i.",
  gradeClassification: "Xu\u1EA5t s\u1EAFc"
};
export const RubricEvaluation = ({
  student = DEFAULT_STUDENT,
  onBack,
  onSave
}) => {
  const [scores, setScores] = useState({
    awareness: 9.5,
    // 1. Ý thức
    progress: 9,
    // 2. Tiến độ
    quality: 9.2,
    // 3. Chất lượng công việc
    report: 8.8,
    // 4. Báo cáo
    enterprise: 9.2,
    // 5. Doanh nghiệp đánh giá
    presentation: 9
    // 6. Thuyết trình (Optional)
  });
  const [includePresentation, setIncludePresentation] = useState(true);
  const [comments, setComments] = useState({
    awareness: "T\xE1c phong r\u1EA5t chuy\xEAn nghi\u1EC7p, \u0111i l\xE0m \u0111\xFAng gi\u1EDD, ch\u1EA5p h\xE0nh t\u1ED1t n\u1ED9i quy.",
    progress: "N\u1ED9p \u0111\u1EA7y \u0111\u1EE7 12/12 nh\u1EADt k\xFD th\u1EF1c t\u1EADp \u0111\xFAng th\u1EDDi h\u1EA1n.",
    quality: "Code s\u1EA1ch, tu\xE2n th\u1EE7 Clean Architecture, ho\xE0n th\xE0nh c\xE1c API \u0111\xFAng ti\u1EBFn \u0111\u1ED9.",
    report: "C\u1EA5u tr\xFAc b\xE1o c\xE1o khoa h\u1ECDc, ph\xE2n t\xEDch y\xEAu c\u1EA7u \u0111\u1EA7y \u0111\u1EE7.",
    enterprise: "Mentor \u0111\xE1nh gi\xE1 r\u1EA5t cao tinh th\u1EA7n l\xE0m vi\u1EC7c v\xE0 k\u1EF9 n\u0103ng giao ti\u1EBFp.",
    presentation: "Thuy\u1EBFt tr\xECnh t\u1EF1 tin, tr\u1EA3 l\u1EDDi ch\xEDnh x\xE1c c\xE1c c\xE2u h\u1ECFi c\u1EE7a H\u1ED9i \u0111\u1ED3ng."
  });
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const calculateFinalScore = () => {
    if (includePresentation) {
      const total = scores.awareness * 0.1 + scores.progress * 0.1 + scores.quality * 0.25 + scores.report * 0.25 + scores.enterprise * 0.15 + scores.presentation * 0.15;
      return parseFloat(total.toFixed(2));
    } else {
      const total = scores.awareness * 0.15 + scores.progress * 0.15 + scores.quality * 0.25 + scores.report * 0.25 + scores.enterprise * 0.2;
      return parseFloat(total.toFixed(2));
    }
  };
  const finalScore = calculateFinalScore();
  const getClassification = (score) => {
    if (score >= 9) return { label: "Xu\u1EA5t s\u1EAFc", color: "bg-purple-100 text-purple-800 border-purple-300" };
    if (score >= 8) return { label: "Gi\u1ECFi", color: "bg-blue-100 text-blue-800 border-blue-300" };
    if (score >= 6.5) return { label: "Kh\xE1", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    if (score >= 5) return { label: "Trung b\xECnh", color: "bg-amber-100 text-amber-800 border-amber-300" };
    return { label: "Kh\xF4ng \u0111\u1EA1t", color: "bg-rose-100 text-rose-800 border-rose-300" };
  };
  const classification = getClassification(finalScore);
  const handleApplyPreset = (type) => {
    if (type === "excellent") {
      setScores({ awareness: 9.5, progress: 9.5, quality: 9.2, report: 9, enterprise: 9.5, presentation: 9.2 });
      showToast("\u0110\xE3 \xE1p d\u1EE5ng khung \u0111i\u1EC3m m\u1EABu: Xu\u1EA5t s\u1EAFc");
    } else if (type === "good") {
      setScores({ awareness: 8.5, progress: 8.5, quality: 8.2, report: 8, enterprise: 8.5, presentation: 8.2 });
      showToast("\u0110\xE3 \xE1p d\u1EE5ng khung \u0111i\u1EC3m m\u1EABu: Gi\u1ECFi");
    } else {
      setScores({ awareness: 6.5, progress: 6.5, quality: 6, report: 6, enterprise: 6.5, presentation: 6 });
      showToast("\u0110\xE3 \xE1p d\u1EE5ng khung \u0111i\u1EC3m m\u1EABu: Trung b\xECnh");
    }
  };
  const handleSave = () => {
    const data = {
      studentId: student.id,
      scores,
      comments,
      finalScore,
      classification: classification.label
    };
    if (onSave) onSave(data);
    showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu \u0111\xE1nh gi\xE1 cho sinh vi\xEAn ${student.name} (${finalScore} \u0111i\u1EC3m)`);
  };
  const handleExportPDF = () => {
    showToast(`\u0110\xE3 xu\u1EA5t phi\u1EBFu \u0111\xE1nh gi\xE1 ti\xEAu chu\u1EA9n cho ${student.name} d\u01B0\u1EDBi \u0111\u1ECBnh d\u1EA1ng PDF!`);
  };
  return <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {
    /* Toast Alert */
  }
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {
    /* HEADER SECTION */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && <button
    onClick={onBack}
    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
    title="Quay lại"
  >
              <ArrowLeft className="w-5 h-5" />
            </button>}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Phiếu đánh giá tiêu chí thực tập
              </h1>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-full border border-blue-200">
                Khung đánh giá tiêu chuẩn
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đánh giá sinh viên theo 6 tiêu chí định lượng chuẩn hóa của Khoa Công nghệ Thông tin.
            </p>
          </div>
        </div>

        {
    /* TOP ACTION BUTTONS */
  }
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
    onClick={handleExportPDF}
    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5 shrink-0"
  >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Xuất PDF</span>
          </button>

          <button
    onClick={handleSave}
    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 shrink-0"
  >
            <Save className="w-4 h-4" />
            <span>Lưu kết quả</span>
          </button>
        </div>
      </div>

      {
    /* STUDENT CONTEXT BANNER & PRESETS */
  }
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
    src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
    alt={student.name}
    className="w-12 h-12 rounded-xl object-cover border border-blue-300 shrink-0"
  />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm">{student.name}</h2>
              <span className="text-xs text-slate-400">({student.mssv})</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-md border border-slate-200">
                {student.class}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{student.company}</span>
              <span className="text-slate-300">•</span>
              <span>Mentor: {student.supervisor}</span>
            </p>
          </div>
        </div>

        {
    /* Quick Presets */
  }
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase hidden md:inline">Mẫu nhanh:</span>
          <button
    onClick={() => handleApplyPreset("excellent")}
    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] rounded-lg border border-purple-200 transition-colors"
  >
            Mẫu Xuất sắc
          </button>
          <button
    onClick={() => handleApplyPreset("good")}
    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] rounded-lg border border-blue-200 transition-colors"
  >
            Mẫu Giỏi
          </button>
          <button
    onClick={() => handleApplyPreset("average")}
    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-lg border border-amber-200 transition-colors"
  >
            Mẫu TB
          </button>
        </div>
      </div>

      {
    /* 6 CRITERIA CARDS */
  }
      <div className="space-y-4">
        {
    /* CRITERION 1: Ý THỨC */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">Ý thức &amp; Kỷ luật</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                  Trọng số: {includePresentation ? "10%" : "15%"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Tác phong làm việc, chấp hành giờ giấc, tuân thủ quy định bảo mật thông tin của doanh nghiệp.
              </p>
            </div>

            <div className="flex items-center gap-2 pl-8 sm:pl-0">
              <span className="text-xs font-bold text-slate-500">Điểm:</span>
              <input
    type="number"
    min="0"
    max="10"
    step="0.1"
    value={scores.awareness}
    onChange={(e) => setScores({ ...scores, awareness: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })}
    className="w-16 p-1.5 text-center font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-sm outline-none"
  />
              <span className="text-xs text-slate-400 font-bold">/ 10</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={scores.awareness}
    onChange={(e) => setScores({ ...scores, awareness: parseFloat(e.target.value) })}
    className="w-full accent-blue-600 cursor-pointer"
  />

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhận xét chi tiết tiêu chí 1:</label>
              <input
    type="text"
    value={comments.awareness}
    onChange={(e) => setComments({ ...comments, awareness: e.target.value })}
    placeholder="Nhập nhận xét về ý thức kỷ luật của sinh viên..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
  />
            </div>
          </div>
        </div>

        {
    /* CRITERION 2: TIẾN ĐỘ */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">Tiến độ thực tập</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                  Trọng số: {includePresentation ? "10%" : "15%"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Nộp nhật ký thực tập hàng tuần đúng hạn, hoàn thành đúng các mốc công việc (milestones).
              </p>
            </div>

            <div className="flex items-center gap-2 pl-8 sm:pl-0">
              <span className="text-xs font-bold text-slate-500">Điểm:</span>
              <input
    type="number"
    min="0"
    max="10"
    step="0.1"
    value={scores.progress}
    onChange={(e) => setScores({ ...scores, progress: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })}
    className="w-16 p-1.5 text-center font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-sm outline-none"
  />
              <span className="text-xs text-slate-400 font-bold">/ 10</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={scores.progress}
    onChange={(e) => setScores({ ...scores, progress: parseFloat(e.target.value) })}
    className="w-full accent-blue-600 cursor-pointer"
  />

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhận xét chi tiết tiêu chí 2:</label>
              <input
    type="text"
    value={comments.progress}
    onChange={(e) => setComments({ ...comments, progress: e.target.value })}
    placeholder="Nhập nhận xét về tiến độ nộp nhật ký và hoàn thành nhiệm vụ..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
  />
            </div>
          </div>
        </div>

        {
    /* CRITERION 3: CHẤT LƯỢNG CÔNG VIỆC */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">Chất lượng công việc</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                  Trọng số: 25%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Năng lực chuyên môn, chất lượng mã nguồn/sản phẩm thực tế, khả năng giải quyết vấn đề thực tế.
              </p>
            </div>

            <div className="flex items-center gap-2 pl-8 sm:pl-0">
              <span className="text-xs font-bold text-slate-500">Điểm:</span>
              <input
    type="number"
    min="0"
    max="10"
    step="0.1"
    value={scores.quality}
    onChange={(e) => setScores({ ...scores, quality: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })}
    className="w-16 p-1.5 text-center font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-sm outline-none"
  />
              <span className="text-xs text-slate-400 font-bold">/ 10</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={scores.quality}
    onChange={(e) => setScores({ ...scores, quality: parseFloat(e.target.value) })}
    className="w-full accent-blue-600 cursor-pointer"
  />

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhận xét chi tiết tiêu chí 3:</label>
              <input
    type="text"
    value={comments.quality}
    onChange={(e) => setComments({ ...comments, quality: e.target.value })}
    placeholder="Nhập nhận xét về chất lượng sản phẩm công việc..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
  />
            </div>
          </div>
        </div>

        {
    /* CRITERION 4: BÁO CÁO */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">Báo cáo thực tập</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                  Trọng số: 25%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Cấu trúc báo cáo, chuẩn mực trình bày, hàm lượng tri thức và giá trị thực tiễn đóng góp.
              </p>
            </div>

            <div className="flex items-center gap-2 pl-8 sm:pl-0">
              <span className="text-xs font-bold text-slate-500">Điểm:</span>
              <input
    type="number"
    min="0"
    max="10"
    step="0.1"
    value={scores.report}
    onChange={(e) => setScores({ ...scores, report: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })}
    className="w-16 p-1.5 text-center font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-sm outline-none"
  />
              <span className="text-xs text-slate-400 font-bold">/ 10</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={scores.report}
    onChange={(e) => setScores({ ...scores, report: parseFloat(e.target.value) })}
    className="w-full accent-blue-600 cursor-pointer"
  />

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhận xét chi tiết tiêu chí 4:</label>
              <input
    type="text"
    value={comments.report}
    onChange={(e) => setComments({ ...comments, report: e.target.value })}
    placeholder="Nhập nhận xét về cuốn báo cáo thực tập..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
  />
            </div>
          </div>
        </div>

        {
    /* CRITERION 5: DOANH NGHIỆP ĐÁNH GIÁ */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                  5
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">Doanh nghiệp đánh giá</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                  Trọng số: {includePresentation ? "15%" : "20%"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Điểm số và đánh giá toàn diện ghi trong Phiếu đánh giá chính thức của Mentor Doanh nghiệp.
              </p>
            </div>

            <div className="flex items-center gap-2 pl-8 sm:pl-0">
              <span className="text-xs font-bold text-slate-500">Điểm:</span>
              <input
    type="number"
    min="0"
    max="10"
    step="0.1"
    value={scores.enterprise}
    onChange={(e) => setScores({ ...scores, enterprise: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })}
    className="w-16 p-1.5 text-center font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-sm outline-none"
  />
              <span className="text-xs text-slate-400 font-bold">/ 10</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={scores.enterprise}
    onChange={(e) => setScores({ ...scores, enterprise: parseFloat(e.target.value) })}
    className="w-full accent-blue-600 cursor-pointer"
  />

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhận xét chi tiết tiêu chí 5:</label>
              <input
    type="text"
    value={comments.enterprise}
    onChange={(e) => setComments({ ...comments, enterprise: e.target.value })}
    placeholder="Trích dẫn nhận xét từ phía Doanh nghiệp..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
  />
            </div>
          </div>
        </div>

        {
    /* CRITERION 6: THUYẾT TRÌNH (OPTIONAL) */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <input
    type="checkbox"
    id="includePres"
    checked={includePresentation}
    onChange={(e) => setIncludePresentation(e.target.checked)}
    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
  />
                <label htmlFor="includePres" className="font-extrabold text-slate-900 text-sm cursor-pointer flex items-center gap-2">
                  <span>6. Thuyết trình &amp; Phản biện</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-md">
                    Optional (Trọng số 15%)
                  </span>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-6">
                Kỹ năng thuyết trình, slide báo cáo và phản biện trước Hội đồng chấm thực tập.
              </p>
            </div>

            {includePresentation && <div className="flex items-center gap-2 pl-6 sm:pl-0">
                <span className="text-xs font-bold text-slate-500">Điểm:</span>
                <input
    type="number"
    min="0"
    max="10"
    step="0.1"
    value={scores.presentation}
    onChange={(e) => setScores({ ...scores, presentation: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) })}
    className="w-16 p-1.5 text-center font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-sm outline-none"
  />
                <span className="text-xs text-slate-400 font-bold">/ 10</span>
              </div>}
          </div>

          {includePresentation && <div className="space-y-2">
              <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={scores.presentation}
    onChange={(e) => setScores({ ...scores, presentation: parseFloat(e.target.value) })}
    className="w-full accent-blue-600 cursor-pointer"
  />

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhận xét chi tiết tiêu chí 6:</label>
                <input
    type="text"
    value={comments.presentation}
    onChange={(e) => setComments({ ...comments, presentation: e.target.value })}
    placeholder="Nhập nhận xét về buổi thuyết trình bảo vệ..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
  />
              </div>
            </div>}
        </div>
      </div>

      {
    /* BOTTOM SCORE SUMMARY & CLASSIFICATION PANEL */
  }
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="font-extrabold text-base text-white">Kết quả chấm điểm theo tiêu chí</h2>
          </div>

          <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
            Điểm tổng kết được tính toán tự động dựa trên trọng số chuẩn ({includePresentation ? "6 ti\xEAu ch\xED" : "5 ti\xEAu ch\xED"}).
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-300">
            <span className="px-2 py-1 bg-white/10 rounded-lg text-[11px]">
              Tỷ lệ trọng số: {includePresentation ? "10-10-25-25-15-15" : "15-15-25-25-20"}
            </span>
          </div>
        </div>

        {
    /* Big Score Box & Badge */
  }
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 shrink-0 self-stretch md:self-auto justify-between md:justify-end">
          <div>
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block">Điểm tổng kết:</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-black text-amber-400">{finalScore}</span>
              <span className="text-xs text-slate-300 font-bold">/ 10</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block mb-1">Xếp loại:</span>
            <span className={`px-3 py-1.5 font-black text-xs rounded-xl border ${classification.color}`}>
              {classification.label}
            </span>
          </div>
        </div>
      </div>

      {
    /* FOOTER BUTTONS */
  }
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
    onClick={handleExportPDF}
    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
  >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Xuất PDF</span>
        </button>

        <button
    onClick={handleSave}
    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
  >
          <Save className="w-4 h-4" />
          <span>Lưu bảng điểm tiêu chuẩn</span>
        </button>
      </div>
    </div>;
};
