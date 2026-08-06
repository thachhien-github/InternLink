import { useState } from 'react';
import {
  Bot,
  AlertTriangle,
  Building2,
  FileWarning,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileCheck,
  Upload,
  BookMarked
} from 'lucide-react';
export const AIInsightsBanner = ({ onSelectInsight }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const handleInsightClick = (key) => {
    setActiveModal(key);
    onSelectInsight?.(key);
  };
  return <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md relative overflow-hidden border border-blue-800/50 transition-all duration-300">
      {
    /* Background Robot Watermark */
  }
      <div className="absolute right-3 top-3 opacity-10 text-white pointer-events-none">
        <Bot className="w-24 h-24" />
      </div>

      {
    /* Card Header & Toggle Bar */
  }
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isExpanded ? "pb-3 border-b border-blue-800/80" : ""}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm md:text-base text-white tracking-tight">
                AI Phân tích &amp; Gợi ý
              </h3>
              <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[10px] font-bold rounded-full">
                4 Khuyến nghị
              </span>
            </div>
            {!isExpanded && <p className="text-[11px] text-blue-200/90 truncate max-w-md mt-0.5 font-medium">
                5 SV nguy cơ • 4 DN chưa tương tác • 2 báo cáo trùng lặp • 3 đề xuất khen thưởng
              </p>}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs rounded-xl border border-blue-400/40 transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
  >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isExpanded ? "Thu g\u1ECDn AI" : "Hi\u1EC3n th\u1ECB g\u1EE3i \xFD AI"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {
    /* Expanded 4 Insight Grid Cards */
  }
      {isExpanded && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 pt-3 animate-in fade-in duration-200">
          {
    /* 1. Risk Students */
  }
          <div
    onClick={() => handleInsightClick("risk")}
    className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/10 hover:border-red-400/50 shadow-2xs transition-all cursor-pointer flex items-start gap-3 group"
  >
            <div className="p-2 bg-rose-500/20 text-rose-300 rounded-lg shrink-0 border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                Phát hiện <span className="font-extrabold text-rose-400">5 sinh viên</span> có nguy cơ trượt tiến độ.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors shrink-0" />
          </div>

          {
    /* 2. Inactive Enterprises */
  }
          <div
    onClick={() => handleInsightClick("enterprises")}
    className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/10 hover:border-amber-400/50 shadow-2xs transition-all cursor-pointer flex items-start gap-3 group"
  >
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg shrink-0 border border-amber-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                <span className="font-extrabold text-amber-400">4 doanh nghiệp</span> chưa có hoạt động tuần này.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors shrink-0" />
          </div>

          {
    /* 3. Duplicate Reports */
  }
          <div
    onClick={() => handleInsightClick("duplicate")}
    className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/10 hover:border-orange-400/50 shadow-2xs transition-all cursor-pointer flex items-start gap-3 group"
  >
            <div className="p-2 bg-orange-500/20 text-orange-300 rounded-lg shrink-0 border border-orange-500/30">
              <FileWarning className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                <span className="font-extrabold text-orange-400">2 báo cáo</span> có dấu hiệu trùng lặp nội dung.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors shrink-0" />
          </div>

          {
    /* 4. Reward High GPA */
  }
          <div
    onClick={() => handleInsightClick("reward")}
    className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/10 hover:border-blue-400/50 shadow-2xs transition-all cursor-pointer flex items-start gap-3 group"
  >
            <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg shrink-0 border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                Đề xuất khen thưởng <span className="font-extrabold text-blue-300">3 sinh viên</span> có GPA &gt; 3.4.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors shrink-0" />
          </div>
        </div>}

      {
    /* Insight Modal */
  }
      {activeModal && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Chi tiết gợi ý từ AI
            </h3>

            {activeModal === "risk" && <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Hệ thống AI đã phân tích tần suất nộp bài và đánh giá từ doanh nghiệp. Danh sách 5 sinh viên có nguy cơ không đạt đợt thực tập này:
                Nguyễn Văn A, Phạm Phương Thảo, Vũ Minh Đức, Lê Quốc Bảo, Hoàng Thu Trang.
              </p>}
            {activeModal === "enterprises" && <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Các doanh nghiệp CMC Global, MISA Software, BKAV và FPT IS chưa cập nhật điểm danh tuần này. Bạn có thể nhấn nút gửi email nhắc nhở tự động.
              </p>}
            {activeModal === "duplicate" && <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Phát hiện 2 báo cáo trùng lặp trên 35%:
                <br />- Nguyễn Văn C (MSSV: 20120555): 38% giống với Báo cáo khóa K14.
                <br />- Phạm Phương Thảo (MSSV: 20120999): 42% giống tài liệu tham khảo trực tuyến.
              </p>}
            {activeModal === "reward" && <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Đề xuất khen thưởng 3 sinh viên có thành tích xuất sắc, đạt điểm tuyệt đối từ doanh nghiệp:
                Hoàng Anh Thư (GPA 3.82 - VNG), Lê Minh Tâm (GPA 3.65 - FPT Software), Nguyễn Hà Phương (GPA 3.75 - Viettel).
              </p>}

            <div className="flex justify-end gap-2">
              <button
    onClick={() => setActiveModal(null)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
  >
                Đóng
              </button>
              <button
    onClick={() => {
      alert("\u0110\xE3 x\u1EED l\xFD th\xF4ng tin g\u1EE3i \xFD th\xE0nh c\xF4ng!");
      setActiveModal(null);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs"
  >
                Thực hiện hành động
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export const QuickTemplatesCard = ({ onSelectTemplate }) => {
  return <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs">
      <h4 className="text-xs font-extrabold tracking-wider text-slate-500 uppercase mb-3">
        TIỆN ÍCH BIỂU MẪU
      </h4>

      <div className="grid grid-cols-2 gap-2.5">
        <button
    onClick={() => onSelectTemplate?.("K\u1EBF ho\u1EA1ch TT")}
    className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 hover:border-blue-200 rounded-xl transition-all flex flex-col items-center gap-1.5 text-center group"
  >
          <BookMarked className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          <span className="text-xs font-bold leading-tight">Kế hoạch TT</span>
        </button>

        <button
    onClick={() => onSelectTemplate?.("Nh\u1EADt k\xFD")}
    className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 hover:border-blue-200 rounded-xl transition-all flex flex-col items-center gap-1.5 text-center group"
  >
          <BookOpen className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          <span className="text-xs font-bold leading-tight">Nhật ký</span>
        </button>

        <button
    onClick={() => onSelectTemplate?.("B\xE1o c\xE1o m\u1EABu")}
    className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 hover:border-blue-200 rounded-xl transition-all flex flex-col items-center gap-1.5 text-center group"
  >
          <FileCheck className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          <span className="text-xs font-bold leading-tight">Báo cáo mẫu</span>
        </button>

        <button
    onClick={() => onSelectTemplate?.("T\u1EA3i l\xEAn")}
    className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 hover:border-blue-200 rounded-xl transition-all flex flex-col items-center gap-1.5 text-center group"
  >
          <Upload className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          <span className="text-xs font-bold leading-tight">Tải lên</span>
        </button>
      </div>
    </div>;
};
export const AIInsightsSection = ({
  onSelectInsight,
  onSelectTemplate
}) => {
  return <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3">
        <AIInsightsBanner onSelectInsight={onSelectInsight} />
      </div>
      <div>
        <QuickTemplatesCard onSelectTemplate={onSelectTemplate} />
      </div>
    </div>;
};
