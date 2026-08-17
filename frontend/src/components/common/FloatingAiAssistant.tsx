import { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  Minimize2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface FloatingAiAssistantProps {
  activeTab: string;
  onNavigateTab?: (tab: string) => void;
  onOpenAction?: (actionKey: string) => void;
}

interface MessageAction {
  label: string;
  actionKey: string;
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  actions?: MessageAction[];
}

export const FloatingAiAssistant = ({
  activeTab,
  onNavigateTab,
  onOpenAction,
}: FloatingAiAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(true);
  const [reminderMessage, setReminderMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Xin chào Thầy Phước! Tôi là **Trợ lý AI InternLink**. Tôi có thể hỗ trợ Thầy phân tích tiến độ sinh viên, tổng hợp tương tác doanh nghiệp, hoặc khởi tạo thông báo đôn đốc.",
      timestamp: "Vừa xong",
      actions: [
        {
          label: "Sinh viên có nguy cơ trượt tiến độ",
          actionKey: "risk_students",
        },
        {
          label: "Doanh nghiệp chưa phản hồi",
          actionKey: "inactive_enterprises",
        },
        { label: "Soạn thông báo nộp báo cáo", actionKey: "compose_notice" },
      ],
    },
  ]);

  useEffect(() => {
    let msg = "";
    switch (activeTab) {
      case "dashboard":
        msg =
          "Hệ thống AI: Đã phát hiện 5 sinh viên cần lưu ý tiến độ & 4 doanh nghiệp chưa tương tác tuần này.";
        break;
      case "students":
        msg =
          "Hệ thống AI: Đề xuất hỗ trợ lọc nhanh sinh viên theo tiêu chí điểm số hoặc tình trạng nộp báo cáo.";
        break;
      case "enterprises":
        msg =
          "Hệ thống AI: Đã tổng hợp 4 doanh nghiệp chưa cập nhật phản hồi đánh giá thực tập sinh.";
        break;
      case "internships":
        msg =
          "Hệ thống AI: Hỗ trợ kiểm tra tiến độ nộp nhật ký và báo cáo định kỳ của sinh viên.";
        break;
      case "evaluations":
        msg =
          "Hệ thống AI: Đã xác định 5 sinh viên đủ điều kiện tổng hợp điểm môn Thực tập.";
        break;
      case "reports":
      case "analytics":
        msg =
          "Hệ thống AI: Đã tổng hợp dữ liệu thống kê phân bố GPA và xếp loại thực tập đợt này.";
        break;
      case "notifications":
        msg =
          "Hệ thống AI: Có 2 gợi ý nội dung thông báo đôn đốc tự động cho báo cáo chưa nộp.";
        break;
      case "templates":
        msg =
          "Hệ thống AI: Hỗ trợ tạo và quản lý mẫu công văn xác nhận thực tập.";
        break;
      case "account":
        msg =
          "Hệ thống AI: Thông tin tài khoản Giảng viên đã được bảo mật & đồng bộ.";
        break;
      default:
        msg = "Trợ lý AI InternLink đã sẵn sàng hỗ trợ bạn.";
    }
    setReminderMessage(msg);
    setShowReminder(true);
    const timer = setTimeout(() => {
      setShowReminder(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShowReminder(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      let actions: MessageAction[] | undefined = undefined;
      const query = text.toLowerCase();

      if (
        query.includes("nguy cơ") ||
        query.includes("rủi ro") ||
        query.includes("trượt")
      ) {
        aiText =
          "Dựa trên dữ liệu hệ thống: Hiện có **5 sinh viên** chậm nộp báo cáo tuần quá 3 ngày (Nguyễn Văn An, Lê Hoàng Nam, Phạm Quốc Bảo...). Hệ thống đề xuất khởi tạo thông báo nhắc nhở.";
        actions = [
          { label: "Gửi email nhắc nhở", actionKey: "send_risk_email" },
          { label: "Xem danh sách sinh viên", actionKey: "view_students" },
        ];
      } else if (query.includes("doanh nghiệp") || query.includes("dn")) {
        aiText =
          "Hiện có **4 doanh nghiệp** (FPT Software, Viettel Telecom, KMS Solutions...) chưa phản hồi đánh giá tuần 5. Hệ thống hỗ trợ soạn mẫu văn bản đôn đốc.";
        actions = [
          {
            label: "Xem danh sách Doanh nghiệp",
            actionKey: "view_enterprises",
          },
          {
            label: "Tạo văn bản đôn đốc",
            actionKey: "compose_enterprise_notice",
          },
        ];
      } else if (query.includes("chấm điểm") || query.includes("đánh giá")) {
        aiText =
          "Đã có **5 sinh viên** nộp đủ Báo cáo giữa kỳ và đạt điểm Doanh nghiệp >= 8.0. Thầy có thể mở mục **Đánh giá** để phê duyệt điểm tổng kết.";
        actions = [
          { label: "Mở phân hệ Đánh giá", actionKey: "view_evaluations" },
        ];
      } else if (query.includes("báo cáo") || query.includes("thống kê")) {
        aiText =
          "Tỷ lệ hoàn thành đợt thực tập HK1-2026 đạt **82.5%**. Điểm đánh giá trung bình từ doanh nghiệp đạt **3.42/4.0**. Thầy có thể trích xuất báo cáo chi tiết.";
        actions = [
          { label: "Xem Báo cáo chi tiết", actionKey: "view_reports" },
        ];
      } else {
        aiText = `Đã tiếp nhận yêu cầu: "${text}". Hệ thống AI InternLink đang tổng hợp dữ liệu để hỗ trợ theo quy trình quản lý thực tập.`;
        actions = [
          { label: "Danh sách sinh viên", actionKey: "view_students" },
          { label: "Soạn thông báo chung", actionKey: "compose_notice" },
        ];
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actions,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleActionClick = (actionKey: string) => {
    switch (actionKey) {
      case "risk_students":
      case "view_students":
        if (onNavigateTab) onNavigateTab("students");
        break;
      case "inactive_enterprises":
      case "view_enterprises":
        if (onNavigateTab) onNavigateTab("enterprises");
        break;
      case "view_evaluations":
        if (onNavigateTab) onNavigateTab("evaluations");
        break;
      case "view_reports":
        if (onNavigateTab) onNavigateTab("reports");
        break;
      case "compose_notice":
      case "send_risk_email":
      case "compose_enterprise_notice":
        if (onNavigateTab) onNavigateTab("notifications");
        break;
      default:
        if (onOpenAction) onOpenAction(actionKey);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* 1. GENTLE PAGE-LOAD REMINDER BUBBLE */}
      {showReminder && !isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto mb-3 max-w-xs md:max-w-sm bg-slate-900 text-white p-3 rounded-lg shadow-md border border-slate-700/80 cursor-pointer transition-all duration-200 animate-in slide-in-from-bottom-3 fade-in group relative"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReminder(false);
            }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full flex items-center justify-center border border-slate-600 text-xs transition-colors"
            title="Đóng thông báo"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-xs text-blue-300 flex items-center gap-1">
                  Trợ lý AI InternLink
                </span>
                <span className="text-[10px] text-slate-400">Xem chi tiết</span>
              </div>
              <p className="text-xs text-slate-200 leading-snug font-medium">
                {reminderMessage}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700" />
        </div>
      )}

      {/* 2. EXPANDED FLOATING CHAT WINDOW */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[350px] sm:w-[390px] h-[520px] bg-slate-900 text-white rounded-lg shadow-md border border-slate-700/80 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-md bg-white p-1 flex items-center justify-center shadow-md">
                  <img
                    src="/logo/logo_internlink-02.png"
                    alt="InternLink AI"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white tracking-tight">
                    Trợ lý AI InternLink
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-900/80 text-blue-200 text-[10px] font-semibold rounded-md border border-blue-700/60">
                    Hệ thống AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Hỗ trợ công tác quản lý thực tập Doanh nghiệp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                title="Thu gọn khung chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-300 flex items-center justify-between shrink-0">
            <span className="truncate font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              Đang làm việc tại:{" "}
              <strong className="text-white capitalize">{activeTab}</strong>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
              Sẵn sàng
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white rounded-tr-xs" : "bg-slate-800 text-slate-100 border border-slate-700/80 rounded-tl-xs space-y-2"}`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Contextual Quick Actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-1.5">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.actionKey)}
                          className="w-full text-left px-2.5 py-1.5 bg-slate-900/80 hover:bg-blue-900/60 text-blue-300 hover:text-white rounded-lg text-[11px] font-semibold border border-slate-700 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <span>{act.label}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 px-1 mt-0.5">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-lg w-36 border border-slate-700/60">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium text-[11px]">
                  Đang xử lý dữ liệu...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0 text-[10px]">
            <button
              onClick={() =>
                handleSendMessage("Cho tôi danh sách SV nguy cơ trượt tiến độ")
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shrink-0 whitespace-nowrap transition-colors"
            >
              Danh sách SV nguy cơ
            </button>
            <button
              onClick={() =>
                handleSendMessage("Những doanh nghiệp nào chưa phản hồi?")
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shrink-0 whitespace-nowrap transition-colors"
            >
              Doanh nghiệp trễ hạn
            </button>
            <button
              onClick={() =>
                handleSendMessage("Gợi ý danh sách SV đủ điều kiện chấm điểm")
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shrink-0 whitespace-nowrap transition-colors"
            >
              Đủ ĐK chấm điểm
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhập câu hỏi hoặc yêu cầu xử lý..."
              className="flex-1 bg-slate-900 text-white placeholder-slate-400 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-md transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. FLOATING ASSISTANT TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto relative p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-all duration-200 transform border border-blue-400/30 flex items-center justify-center cursor-pointer group"
        title="Mở Trợ lý AI InternLink"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  );
};
