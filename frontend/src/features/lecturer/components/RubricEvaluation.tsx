import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import {
  Save,
  Award,
  ArrowLeft,
  Building2,
  Printer,
  CheckCircle2,
  CalendarCheck,
  Calculator,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const RubricEvaluation = ({
  student = {} as any,
  onBack,
  onSave,
}:
  student?: any;
  onBack?: () => void;
  onSave?: (data: any) => void;
}) => {
  // Trọng số tiêu chuẩn (Chuẩn Khoa CNTT)
  const [weights] = useState({
    weeklyReports: 20, // 1. Báo cáo tuần & Chuyên cần (5–6 tuần)
    enterprise: 30, // 2. Doanh nghiệp đánh giá
    finalReportAndProduct: 30, // 3. Báo cáo cuối kỳ & Sản phẩm
    lecturerDefense: 20, // 4. Đánh giá chuyên môn GV & Vấn đáp
  });

  const [includeDefense, setIncludeDefense] = useState(true);

  // Điểm thành phần chi tiết của 4 trụ cột
  const [scores, setScores] = useState({
    // Trụ cột 1: Quá trình & Báo cáo tuần (20%)
    weeklyAttendance: 10.0, // Tỷ lệ nộp báo cáo tuần đúng hạn (6/6 tuần)
    weeklyContentQuality: 9.0, // Chất lượng nhật ký công việc & giải quyết vấn đề

    // Trụ cột 2: Doanh nghiệp tiếp nhận (30%)
    enterpriseWorkEthic: 9.5, // Kỷ luật & tác phong tại công ty
    enterpriseTechnicalOutput: 9.0, // Đóng góp thực tế vào dự án DN

    // Trụ cột 3: Báo cáo cuối kỳ & Sản phẩm hoàn thành (30%)
    reportAcademicQuality: 9.0, // Bố cục, phân tích yêu cầu, kiến trúc hệ thống
    practicalProductDemo: 9.2, // Tính năng sản phẩm, source code, chạy demo thực tế

    // Trụ cột 4: Đánh giá GV & Vấn đáp bảo vệ (20%)
    lecturerHolistic: 9.0, // Đánh giá của GV về mức độ hiểu bài & năng lực
    oralDefenseResponse: 9.5, // Trả lời câu hỏi phản biện / bảo vệ đề tài
  });

  const [comments, setComments] = useState({
    weeklyReports:
      "Nộp đầy đủ 6/6 báo cáo tuần đúng tiến độ, ghi chép nhật ký công việc rõ ràng, trung thực.",
    enterprise:
      "Mentor FPT Software đánh giá cao tinh thần trách nhiệm, hòa nhập nhanh với quy trình Scrum của dự án.",
    finalReportAndProduct:
      "Quyển báo cáo cấu trúc chuẩn khoa học, sản phẩm phần mềm chạy mượt mà, áp dụng đúng Clean Architecture.",
    lecturerDefense:
      "Nắm vững kiến thức nền tảng, giải thích logic kiến trúc và trả lời tự tin các câu hỏi của giảng viên.",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Tính điểm từng trụ cột
  const pillar1Score = parseFloat(
    ((scores.weeklyAttendance * 0.5 + scores.weeklyContentQuality * 0.5)).toFixed(2),
  );
  const pillar2Score = parseFloat(
    ((scores.enterpriseWorkEthic * 0.4 + scores.enterpriseTechnicalOutput * 0.6)).toFixed(2),
  );
  const pillar3Score = parseFloat(
    ((scores.reportAcademicQuality * 0.5 + scores.practicalProductDemo * 0.5)).toFixed(2),
  );
  const pillar4Score = parseFloat(
    ((scores.lecturerHolistic * 0.4 + scores.oralDefenseResponse * 0.6)).toFixed(2),
  );

  // Tính điểm tổng kết
  const calculateFinalScore = () => {
    if (includeDefense) {
      const w1 = weights.weeklyReports / 100;
      const w2 = weights.enterprise / 100;
      const w3 = weights.finalReportAndProduct / 100;
      const w4 = weights.lecturerDefense / 100;
      const total =
        pillar1Score * w1 +
        pillar2Score * w2 +
        pillar3Score * w3 +
        pillar4Score * w4;
      return parseFloat(total.toFixed(2));
    } else {
      // Khi không tổ chức vấn đáp: 25% Tuần - 35% DN - 40% Báo cáo & SP
      const total =
        pillar1Score * 0.25 + pillar2Score * 0.35 + pillar3Score * 0.4;
      return parseFloat(total.toFixed(2));
    }
  };

  const finalScore = calculateFinalScore();

  const getClassification = (score: number) => {
    if (score >= 9)
      return {
        label: "Xuất sắc",
        color: "bg-emerald-100 text-emerald-800 border-emerald-300",
        desc: "Đạt chuẩn xuất sắc toàn diện cả quá trình, doanh nghiệp và sản phẩm",
      };
    if (score >= 8)
      return {
        label: "Giỏi",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        desc: "Hoàn thành tốt yêu cầu thực tập, sản phẩm đạt yêu cầu kỹ thuật cao",
      };
    if (score >= 6.5)
      return {
        label: "Khá",
        color: "bg-sky-100 text-sky-800 border-sky-300",
        desc: "Đạt yêu cầu thực tập, báo cáo và sản phẩm ở mức khá",
      };
    if (score >= 5)
      return {
        label: "Trung bình",
        color: "bg-amber-100 text-amber-800 border-amber-300",
        desc: "Đủ điều kiện qua môn, cần cải thiện tính chủ động và chất lượng sản phẩm",
      };
    return {
      label: "Không đạt",
      color: "bg-rose-100 text-rose-800 border-rose-300",
      desc: "Chưa hoàn thành đủ khối lượng hoặc vi phạm quy định thực tập",
    };
  };

  const classification = getClassification(finalScore);

  // Tự động tính điểm quá trình từ số tuần nộp
  const handleAutoCalculateWeekly = () => {
    const parts = (student.weeklyReportCount || "6/6").split("/");
    const submitted = parseInt(parts[0], 10) || 6;
    const total = parseInt(parts[1], 10) || 6;
    const ratio = Math.min(1, submitted / total);
    const calculatedScore = parseFloat((ratio * 10).toFixed(1));

    setScores((prev) => ({
      ...prev,
      weeklyAttendance: calculatedScore,
      weeklyContentQuality: Math.min(10, calculatedScore >= 9 ? 9.2 : calculatedScore),
    }));
    showToast(
      `Đã tự động tính điểm Chuyên cần: ${calculatedScore}/10 dựa trên ${submitted}/${total} tuần báo cáo!`,
    );
  };

  // Lấy điểm từ Doanh nghiệp
  const handleAutoFetchEnterprise = () => {
    const eScore = student.enterpriseScore || 9.2;
    setScores((prev) => ({
      ...prev,
      enterpriseWorkEthic: parseFloat(Math.min(10, eScore + 0.2).toFixed(1)),
      enterpriseTechnicalOutput: eScore,
    }));
    showToast(
      `Đã đồng bộ điểm Doanh nghiệp ${eScore}/10 từ Phiếu nhận xét của Mentor!`,
    );
  };

  const handleApplyPreset = (type: "excellent" | "good" | "average") => {
    if (type === "excellent") {
      setScores({
        weeklyAttendance: 10.0,
        weeklyContentQuality: 9.5,
        enterpriseWorkEthic: 9.5,
        enterpriseTechnicalOutput: 9.2,
        reportAcademicQuality: 9.2,
        practicalProductDemo: 9.5,
        lecturerHolistic: 9.2,
        oralDefenseResponse: 9.5,
      });
      showToast("Đã áp dụng mẫu đánh giá: Xuất sắc (Toàn diện)");
    } else if (type === "good") {
      setScores({
        weeklyAttendance: 9.0,
        weeklyContentQuality: 8.5,
        enterpriseWorkEthic: 8.8,
        enterpriseTechnicalOutput: 8.5,
        reportAcademicQuality: 8.5,
        practicalProductDemo: 8.8,
        lecturerHolistic: 8.5,
        oralDefenseResponse: 8.5,
      });
      showToast("Đã áp dụng mẫu đánh giá: Giỏi");
    } else {
      setScores({
        weeklyAttendance: 7.5,
        weeklyContentQuality: 6.5,
        enterpriseWorkEthic: 7.0,
        enterpriseTechnicalOutput: 6.5,
        reportAcademicQuality: 6.5,
        practicalProductDemo: 6.5,
        lecturerHolistic: 6.5,
        oralDefenseResponse: 6.0,
      });
      showToast("Đã áp dụng mẫu đánh giá: Trung bình");
    }
  };

  const handleSave = () => {
    const data = {
      studentId: student.id,
      scores: {
        pillar1_weekly: pillar1Score,
        pillar2_enterprise: pillar2Score,
        pillar3_report_product: pillar3Score,
        pillar4_defense: pillar4Score,
      },
      detailedScores: scores,
      comments,
      finalScore,
      classification: classification.label,
    };
    if (onSave) onSave(data);
    showToast(
      `Đã lưu bảng điểm chuẩn hóa cho sinh viên ${student.name} (${finalScore} điểm - ${classification.label})`,
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* HEADER SECTION */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Khung Đánh Giá Chuẩn Hóa Thực Tập Tốt Nghiệp
              </h1>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-full border border-blue-200">
                Mô hình 4 Trụ Cột Khách Quan
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đánh giá toàn diện dựa trên: Báo cáo tuần thực tế (20%) • Doanh nghiệp đánh giá (30%) • Báo cáo &amp; Sản phẩm (30%) • Đánh giá chuyên môn GV &amp; Vấn đáp (20%).
            </p>
          </div>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() =>
              showToast(`Đã in phiếu đánh giá chuẩn hóa cho ${student.name}`)
            }
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-md transition-colors border border-slate-200 flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In Phiếu Điểm</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Lưu &amp; Chốt Điểm</span>
          </button>
        </div>
      </div>

      {/* STUDENT CONTEXT & EVIDENCE CHECK BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={
                student.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={student.name}
              className="w-13 h-13 rounded-md object-cover border-2 border-blue-400 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm">
                  {student.name}
                </h2>
                <span className="text-xs text-slate-400 font-mono">({student.mssv})</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-200">
                  {student.class}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md">
                  {student.major}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold">{student.company}</span>
                <span className="text-slate-300">•</span>
                <span>Mentor: {student.supervisor}</span>
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => handleApplyPreset("excellent")}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-md border border-emerald-200 transition-colors"
            >
              Mẫu Xuất sắc
            </button>
            <button
              onClick={() => handleApplyPreset("good")}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] rounded-md border border-blue-200 transition-colors"
            >
              Mẫu Giỏi
            </button>
            <button
              onClick={() => handleApplyPreset("average")}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-md border border-amber-200 transition-colors"
            >
              Mẫu Đạt
            </button>
          </div>
        </div>

        {/* EVIDENCE VERIFICATION STATUS */}
        <div className="lg:col-span-4 bg-slate-50 p-4 rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-center space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Đối soát minh chứng thực tế</span>
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
            <div className="p-1.5 bg-white rounded border border-emerald-200 text-emerald-800">
              <span className="block text-emerald-600 font-mono text-xs">{student.weeklyReportCount || "6/6"}</span>
              <span>Báo cáo tuần</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-blue-200 text-blue-800">
              <span className="block text-blue-600 text-xs">Đã nộp</span>
              <span>Báo cáo cuối kỳ</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-purple-200 text-purple-800">
              <span className="block text-purple-600 font-mono text-xs">{student.enterpriseScore || 9.2}đ</span>
              <span>Phiếu điểm DN</span>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULA TRANSPARENCY BANNER */}
      <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 rounded-lg border border-blue-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="font-bold text-blue-900 block">
              Công thức tính điểm minh bạch theo quy chế Khoa:
            </span>
            <p className="text-slate-600 text-[11px] mt-0.5">
              {includeDefense
                ? "Điểm Tổng = (Báo cáo tuần × 20%) + (Doanh nghiệp × 30%) + (Báo cáo & Sản phẩm × 30%) + (Đánh giá GV/Vấn đáp × 20%)"
                : "Điểm Tổng = (Báo cáo tuần × 25%) + (Doanh nghiệp × 35%) + (Báo cáo & Sản phẩm × 40%) (Không tổ chức vấn đáp)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <label className="flex items-center gap-1.5 font-bold text-slate-700 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={includeDefense}
              onChange={(e) => setIncludeDefense(e.target.checked)}
              className="accent-blue-600 rounded"
            />
            <span>Bao gồm Vấn đáp/Bảo vệ</span>
          </label>
        </div>
      </div>

      {/* 4 MAIN OBJECTIVE PILLARS */}
      <div className="space-y-4">
        {/* PILLAR 1: BÁO CÁO TUẦN & CHUYÊN CẦN */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Quá trình &amp; Báo cáo thực tập hàng tuần
                </h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                  Trọng số: {includeDefense ? "20%" : "25%"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Đánh giá mức độ chuyên cần, tính kỷ luật qua việc nộp báo cáo tuần đều đặn và chất lượng nhật ký công việc.
              </p>
            </div>

            <div className="flex items-center gap-3 pl-8 sm:pl-0">
              <button
                type="button"
                onClick={handleAutoCalculateWeekly}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded border border-emerald-200 flex items-center gap-1 transition-colors"
                title="Tự động tính từ số tuần báo cáo đã nộp"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Tự động tính ({student.weeklyReportCount || "12/12"} tuần)</span>
              </button>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">Điểm Trụ cột 1</span>
                <span className="text-lg font-bold text-emerald-700">{pillar1Score}/10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            {/* Sub-criterion 1.1 */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  1.1. Tỷ lệ &amp; Tiến độ nộp báo cáo tuần ({student.weeklyReportCount || "12/12"} tuần)
                </label>
                <span className="font-bold text-emerald-700 font-mono text-sm">{scores.weeklyAttendance}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scores.weeklyAttendance}
                onChange={(e) =>
                  setScores({ ...scores, weeklyAttendance: parseFloat(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Nộp đủ 12 tuần = 10đ • Nộp 10-11 tuần = 8.5-9đ • Nộp &lt; 9 tuần = &lt; 7.5đ</span>
            </div>

            {/* Sub-criterion 1.2 */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  1.2. Chất lượng nhật ký công việc &amp; Kỹ năng giải quyết vấn đề
                </label>
                <span className="font-bold text-emerald-700 font-mono text-sm">{scores.weeklyContentQuality}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scores.weeklyContentQuality}
                onChange={(e) =>
                  setScores({ ...scores, weeklyContentQuality: parseFloat(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Mô tả công việc chi tiết, có minh chứng công việc, chỉ ra bài học kinh nghiệm.</span>
            </div>
          </div>

          <input
            type="text"
            value={comments.weeklyReports}
            onChange={(e) => setComments({ ...comments, weeklyReports: e.target.value })}
            placeholder="Nhận xét về quá trình và báo cáo tuần..."
            className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white text-slate-800 font-medium"
          />
        </div>

        {/* PILLAR 2: DOANH NGHIỆP ĐÁNH GIÁ */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Đánh giá từ Doanh nghiệp &amp; Mentor tiếp nhận
                </h3>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-200">
                  Trọng số: {includeDefense ? "30%" : "35%"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Căn cứ theo Phiếu đánh giá chính thức có ký tên đóng dấu của Mentor {student.supervisor} tại {student.company}.
              </p>
            </div>

            <div className="flex items-center gap-3 pl-8 sm:pl-0">
              <button
                type="button"
                onClick={handleAutoFetchEnterprise}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] rounded border border-blue-200 flex items-center gap-1 transition-colors"
                title="Lấy điểm từ phiếu đánh giá của doanh nghiệp"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Lấy điểm từ Phiếu DN ({student.enterpriseScore || 9.2}đ)</span>
              </button>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">Điểm Trụ cột 2</span>
                <span className="text-lg font-bold text-blue-700">{pillar2Score}/10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            {/* Sub-criterion 2.1 */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  2.1. Kỷ luật, văn hóa doanh nghiệp &amp; Thái độ làm việc
                </label>
                <span className="font-bold text-blue-700 font-mono text-sm">{scores.enterpriseWorkEthic}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scores.enterpriseWorkEthic}
                onChange={(e) =>
                  setScores({ ...scores, enterpriseWorkEthic: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Đúng giờ, tuân thủ NDA/bảo mật, giao tiếp chuyên nghiệp với đội ngũ.</span>
            </div>

            {/* Sub-criterion 2.2 */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  2.2. Năng lực chuyên môn &amp; Đóng góp thực tế vào dự án DN
                </label>
                <span className="font-bold text-blue-700 font-mono text-sm">{scores.enterpriseTechnicalOutput}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scores.enterpriseTechnicalOutput}
                onChange={(e) =>
                  setScores({ ...scores, enterpriseTechnicalOutput: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Hoàn thành các task/user stories được giao, chất lượng code và khả năng thích ứng.</span>
            </div>
          </div>

          <input
            type="text"
            value={comments.enterprise}
            onChange={(e) => setComments({ ...comments, enterprise: e.target.value })}
            placeholder="Ghi chú đánh giá từ phía Doanh nghiệp..."
            className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white text-slate-800 font-medium"
          />
        </div>

        {/* PILLAR 3: BÁO CÁO CUỐI KỲ & SẢN PHẨM HOÀN THÀNH */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Quyển Báo cáo Tổng kết &amp; Sản phẩm / Source Code thực tế
                </h3>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold text-[10px] rounded-md border border-purple-200">
                  Trọng số: {includeDefense ? "30%" : "40%"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-8">
                Đánh giá chất lượng học thuật của cuốn báo cáo và mức độ hoàn thiện của sản phẩm ứng dụng/hệ thống.
              </p>
            </div>

            <div className="flex items-center gap-3 pl-8 sm:pl-0">
              <button
                type="button"
                onClick={() => showToast("Đang mở file báo cáo Bao_Cao_Thuc_Tap_Final.pdf...")}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] rounded border border-purple-200 flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-purple-600" />
                <span>Xem Báo Cáo &amp; Source Code</span>
              </button>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">Điểm Trụ cột 3</span>
                <span className="text-lg font-bold text-purple-700">{pillar3Score}/10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            {/* Sub-criterion 3.1 */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  3.1. Bố cục, phân tích bài toán &amp; Hàm lượng học thuật của báo cáo
                </label>
                <span className="font-bold text-purple-700 font-mono text-sm">{scores.reportAcademicQuality}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scores.reportAcademicQuality}
                onChange={(e) =>
                  setScores({ ...scores, reportAcademicQuality: parseFloat(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Định dạng chuẩn, phân tích yêu cầu, thiết kế kiến trúc, lược đồ CSDL đầy đủ.</span>
            </div>

            {/* Sub-criterion 3.2 */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  3.2. Mức độ hoàn thiện của Sản phẩm thực tế / Demo / Source Code
                </label>
                <span className="font-bold text-purple-700 font-mono text-sm">{scores.practicalProductDemo}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scores.practicalProductDemo}
                onChange={(e) =>
                  setScores({ ...scores, practicalProductDemo: parseFloat(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Chạy thực tế trơn tru, xử lý lỗi tốt, áp dụng đúng các công nghệ theo cam kết đề cương.</span>
            </div>
          </div>

          <input
            type="text"
            value={comments.finalReportAndProduct}
            onChange={(e) => setComments({ ...comments, finalReportAndProduct: e.target.value })}
            placeholder="Nhận xét về chất lượng quyển báo cáo và sản phẩm..."
            className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white text-slate-800 font-medium"
          />
        </div>

        {/* PILLAR 4: ĐÁNH GIÁ GV & VẤN ĐÁP / BẢO VỆ */}
        {includeDefense && (
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Đánh giá Chuyên môn của Giảng viên &amp; Vấn đáp / Bảo vệ
                  </h3>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-md border border-indigo-200">
                    Trọng số: 20%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 pl-8">
                  Đánh giá năng lực độc lập, mức độ thấu hiểu bài toán và khả năng phản biện của sinh viên trước Giảng viên/Hội đồng.
                </p>
              </div>

              <div className="text-right pl-8 sm:pl-0">
                <span className="text-[10px] text-slate-400 block font-bold">Điểm Trụ cột 4</span>
                <span className="text-lg font-bold text-indigo-700">{pillar4Score}/10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              {/* Sub-criterion 4.1 */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    4.1. Năng lực tư duy &amp; Mức độ nắm bắt kiến thức chuyên ngành
                  </label>
                  <span className="font-bold text-indigo-700 font-mono text-sm">{scores.lecturerHolistic}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scores.lecturerHolistic}
                  onChange={(e) =>
                    setScores({ ...scores, lecturerHolistic: parseFloat(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Hiểu rõ bài toán, giải thích được lý do chọn giải pháp kỹ thuật, chủ động tương tác với GV.</span>
              </div>

              {/* Sub-criterion 4.2 */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    4.2. Khả năng thuyết trình, trả lời câu hỏi vấn đáp phản biện
                  </label>
                  <span className="font-bold text-indigo-700 font-mono text-sm">{scores.oralDefenseResponse}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scores.oralDefenseResponse}
                  onChange={(e) =>
                    setScores({ ...scores, oralDefenseResponse: parseFloat(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Trình bày tự tin, rành mạch, bảo vệ được kết quả đạt được trước hội đồng.</span>
              </div>
            </div>

            <input
              type="text"
              value={comments.lecturerDefense}
              onChange={(e) => setComments({ ...comments, lecturerDefense: e.target.value })}
              placeholder="Nhận xét chuyên môn và vấn đáp của Giảng viên..."
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white text-slate-800 font-medium"
            />
          </div>
        )}
      </div>

      {/* FINAL SCORE SUMMARY CARD */}
      <div className="bg-white p-6 rounded-lg border-2 border-blue-500/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Kết quả Tổng kết Đánh giá Thực tập (Final Internship Grade):
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900 font-mono">
              {finalScore}
            </span>
            <span className="text-sm text-slate-500 font-bold">/ 10.0</span>
            <span
              className={`px-3 py-1 font-bold text-xs rounded-md border ${classification.color}`}
            >
              {classification.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {classification.desc}
          </p>
        </div>

        {/* Pillar mini breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs w-full md:w-auto">
          <div className="p-2.5 bg-emerald-50 rounded-md border border-emerald-200">
            <span className="text-[10px] text-emerald-700 block font-bold">Báo cáo tuần ({includeDefense ? "20%" : "25%"})</span>
            <span className="font-bold text-emerald-900 font-mono text-sm">{pillar1Score}</span>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-md border border-blue-200">
            <span className="text-[10px] text-blue-700 block font-bold">Doanh nghiệp ({includeDefense ? "30%" : "35%"})</span>
            <span className="font-bold text-blue-900 font-mono text-sm">{pillar2Score}</span>
          </div>
          <div className="p-2.5 bg-purple-50 rounded-md border border-purple-200">
            <span className="text-[10px] text-purple-700 block font-bold">Báo cáo &amp; SP ({includeDefense ? "30%" : "40%"})</span>
            <span className="font-bold text-purple-900 font-mono text-sm">{pillar3Score}</span>
          </div>
          {includeDefense && (
            <div className="p-2.5 bg-indigo-50 rounded-md border border-indigo-200">
              <span className="text-[10px] text-indigo-700 block font-bold">Đánh giá GV (20%)</span>
              <span className="font-bold text-indigo-900 font-mono text-sm">{pillar4Score}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu &amp; Hoàn tất Đánh giá</span>
          </button>
        </div>
      </div>
    </div>
  );
};
