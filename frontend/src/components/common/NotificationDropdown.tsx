import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  Clock,
  Trash2,
  FileText,
  Award,
  Building2,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { UserRole } from "../../types/common";
import { notificationService } from "../../services/notification.service";
import { signalRNotificationService } from "../../services/signalr.service";
import { USE_MOCK } from "../../config/env";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: "report" | "grade" | "enterprise" | "deadline" | "system" | "announcement";
  priority?: "urgent" | "normal" | "low";
  timestamp: string; // e.g. "5 phút trước" or ISO string
  isRead: boolean;
  targetTab?: string;
  actionUrl?: string;
  sender?: {
    name: string;
    role: string;
  };
}

interface NotificationDropdownProps {
  role: UserRole;
  onNavigate?: (tab: string) => void;
  onShowToast?: (msg: string) => void;
}

const DEFAULT_MOCK_NOTIFICATIONS: Record<UserRole, AppNotification[]> = {
  Student: [
    {
      id: "notif-s1",
      title: "GVHD đã nhận xét Báo cáo tuần 11",
      message: "ThS. Nguyễn Văn Phước đã phản hồi và phê duyệt báo cáo tuần 11 của bạn: 'Tiến độ tốt, cần bổ sung tài liệu API...'",
      category: "report",
      priority: "normal",
      timestamp: "5 phút trước",
      isRead: false,
      targetTab: "student-weekly-reports",
      sender: { name: "ThS. Nguyễn Văn Phước", role: "GVHD" },
    },
    {
      id: "notif-s2",
      title: "Doanh nghiệp đã cập nhật đánh giá giữa kỳ",
      message: "Mentor FPT Software đã hoàn tất bảng đánh giá năng lực & chuyên cần (Điểm: 9.2/10).",
      category: "grade",
      priority: "urgent",
      timestamp: "2 giờ trước",
      isRead: false,
      targetTab: "student-feedback",
      sender: { name: "FPT Software Mentor", role: "Doanh nghiệp" },
    },
    {
      id: "notif-s3",
      title: "Nhắc nhở: Hạn nộp Báo cáo cuối kỳ",
      message: "Chỉ còn 3 ngày để hoàn thành nộp Báo cáo tổng kết, Slide bảo vệ và Mã nguồn dự án lên hệ thống.",
      category: "deadline",
      priority: "urgent",
      timestamp: "Hôm qua",
      isRead: true,
      targetTab: "student-submissions",
      sender: { name: "Phòng Đào tạo", role: "Ban Quản lý" },
    },
    {
      id: "notif-s4",
      title: "Lịch bảo vệ thực tập tốt nghiệp",
      message: "Hội đồng đánh giá thực tập sẽ bắt đầu làm việc từ ngày 28/08/2026 tại Phòng A2-301.",
      category: "announcement",
      priority: "normal",
      timestamp: "3 ngày trước",
      isRead: true,
      targetTab: "student-internship",
      sender: { name: "Khoa CNTT", role: "Thông báo chung" },
    },
  ],
  Lecturer: [
    {
      id: "notif-l1",
      title: "Sinh viên mới nộp Báo cáo tuần 12",
      message: "Nguyễn Văn An (MSSV: 20210001) vừa nộp báo cáo tuần 12 kèm sản phẩm mã nguồn GitHub.",
      category: "report",
      priority: "normal",
      timestamp: "10 phút trước",
      isRead: false,
      targetTab: "reports",
      sender: { name: "Nguyễn Văn An", role: "Sinh viên" },
    },
    {
      id: "notif-l2",
      title: "3 sinh viên chưa nộp sản phẩm cuối kỳ",
      message: "Hạn chót khóa cổng nộp sản phẩm là 23:59 ngày mai. Vui lòng kiểm tra và gửi nhắc nhở.",
      category: "deadline",
      priority: "urgent",
      timestamp: "1 giờ trước",
      isRead: false,
      targetTab: "students",
      sender: { name: "Hệ thống InternLink", role: "Tự động" },
    },
    {
      id: "notif-l3",
      title: "Cổng nhập điểm đợt 1 đã mở",
      message: "Ban Quản lý đã kích hoạt cổng nhập điểm Rubric và xuất file điểm cuối kỳ (.xlsx) cho Giảng viên.",
      category: "grade",
      priority: "normal",
      timestamp: "Hôm qua",
      isRead: true,
      targetTab: "evaluations",
      sender: { name: "Khoa CNTT", role: "Ban Quản lý" },
    },
  ],
  Admin: [
    {
      id: "notif-a1",
      title: "Yêu cầu liên kết từ Doanh nghiệp mới",
      message: "Tập đoàn VNG Corporation đã gửi đề xuất tiếp nhận 20 sinh viên thực tập học kỳ I 2026.",
      category: "enterprise",
      priority: "normal",
      timestamp: "15 phút trước",
      isRead: false,
      targetTab: "admin-companies",
      sender: { name: "VNG HR Talent", role: "Đối tác" },
    },
    {
      id: "notif-a2",
      title: "Tạo tài khoản tự động hoàn tất",
      message: "Đã kích hoạt thành công 120 tài khoản sinh viên khóa K15 và 15 tài khoản GVHD.",
      category: "system",
      priority: "normal",
      timestamp: "2 giờ trước",
      isRead: true,
      targetTab: "admin-users",
      sender: { name: "System Scheduler", role: "Core Service" },
    },
    {
      id: "notif-a3",
      title: "Cảnh báo bảo mật hệ thống",
      message: "Phát hiện 3 lần đăng nhập sai liên tiếp từ địa chỉ IP lạ. Đã tự động kích hoạt bảo vệ 2FA.",
      category: "system",
      priority: "urgent",
      timestamp: "1 ngày trước",
      isRead: true,
      targetTab: "admin-settings",
      sender: { name: "Security Audit", role: "Bảo mật" },
    },
  ],
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  role,
  onNavigate,
  onShowToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "reports" | "system">("all");
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return DEFAULT_MOCK_NOTIFICATIONS[role] || DEFAULT_MOCK_NOTIFICATIONS.Student;
  });
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with API when available
  useEffect(() => {
    if (USE_MOCK) return;

    let isMounted = true;
    const fetchApiNotifs = async () => {
      try {
        setIsLoading(true);
        const rows = await notificationService.getMine();
        if (!isMounted) return;

        if (rows && rows.length > 0) {
          setNotifications(
            rows.map((dto) => ({
              id: dto.id,
              title: dto.title,
              message: dto.content,
              category: (dto.category as any) || "report",
              priority: dto.priority === "High" ? "urgent" : "normal",
              timestamp: dto.createdAt ? new Date(dto.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "Vừa xong",
              isRead: dto.isRead,
              targetTab: dto.link ?? undefined,
              sender: { name: dto.senderName ?? "Hệ thống", role: "Thông báo" },
            }))
          );
        }
      } catch {
        // Fallback to initial mock if API is down
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchApiNotifs();
    return () => {
      isMounted = false;
    };
  }, [role]);

  // Real-time SignalR Notification Listener
  useEffect(() => {
    // Start SignalR connection (graceful fallback if offline/mock)
    signalRNotificationService.start();

    const unsubscribeNotif = signalRNotificationService.onNotification((incoming) => {
      const newNotif: AppNotification = {
        id: incoming.id || `notif-rt-${Date.now()}`,
        title: incoming.title,
        message: incoming.content,
        category: "report",
        priority: "urgent",
        timestamp: "Vừa xong",
        isRead: false,
        targetTab: incoming.link,
        sender: { name: "Hệ thống (Live)", role: "Realtime Hub" },
      };

      setNotifications((prev) => [newNotif, ...prev]);

      if (onShowToast) {
        onShowToast(`🔔 ${incoming.title}: ${incoming.content}`);
      }
    });

    const unsubscribeReportStatus = signalRNotificationService.onReportStatusChanged(
      (reportId, status, message) => {
        const newNotif: AppNotification = {
          id: `notif-rep-${reportId}-${Date.now()}`,
          title: `Cập nhật báo cáo: ${status}`,
          message: message || `Báo cáo tuần của bạn đã được chuyển sang trạng thái ${status}`,
          category: "report",
          priority: "urgent",
          timestamp: "Vừa xong",
          isRead: false,
          targetTab: "student-weekly-reports",
          sender: { name: "Giảng viên hướng dẫn", role: "GVHD" },
        };
        setNotifications((prev) => [newNotif, ...prev]);
        if (onShowToast) {
          onShowToast(`📑 Báo cáo đã cập nhật: ${status}`);
        }
      }
    );

    return () => {
      unsubscribeNotif();
      unsubscribeReportStatus();
    };
  }, [onShowToast]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "unread") return !item.isRead;
    if (activeFilter === "reports") return item.category === "report" || item.category === "grade";
    if (activeFilter === "system") return item.category === "system" || item.category === "deadline" || item.category === "enterprise";
    return true;
  });

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (!USE_MOCK) {
      try {
        await notificationService.markRead(id);
      } catch {}
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onShowToast?.("Đã đánh dấu tất cả thông báo là đã đọc!");
    if (!USE_MOCK) {
      try {
        await notificationService.markAllRead();
      } catch {}
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    onShowToast?.("Đã xóa thông báo khỏi danh sách.");
  };

  const handleNotificationClick = (item: AppNotification) => {
    handleMarkAsRead(item.id);
    setIsOpen(false);

    if (item.targetTab && onNavigate) {
      onNavigate(item.targetTab);
    }
  };

  const handleSimulateNewNotification = () => {
    const newItems: Record<UserRole, AppNotification> = {
      Student: {
        id: `notif-sim-${Date.now()}`,
        title: "⚡ Thông báo mới từ GVHD",
        message: "Giảng viên vừa duyệt báo cáo tuần và để lại lời nhắn động viên.",
        category: "report",
        priority: "urgent",
        timestamp: "Vừa xong",
        isRead: false,
        targetTab: "student-weekly-reports",
        sender: { name: "ThS. Nguyễn Văn Phước", role: "GVHD" },
      },
      Lecturer: {
        id: `notif-sim-${Date.now()}`,
        title: "⚡ Sinh viên nộp báo cáo bổ sung",
        message: "Trần Thị Bình vừa gửi lại tệp báo cáo tuần đã chỉnh sửa.",
        category: "report",
        priority: "normal",
        timestamp: "Vừa xong",
        isRead: false,
        targetTab: "reports",
        sender: { name: "Trần Thị Bình", role: "Sinh viên" },
      },
      Admin: {
        id: `notif-sim-${Date.now()}`,
        title: "⚡ Cập nhật đồng bộ kỳ thực tập",
        message: "Hệ thống vừa đồng bộ danh sách 25 giảng viên từ Phòng Đào tạo.",
        category: "system",
        priority: "normal",
        timestamp: "Vừa xong",
        isRead: false,
        targetTab: "admin-lecturers",
        sender: { name: "Core API", role: "System" },
      },
    };

    const newItem = newItems[role];
    setNotifications((prev) => [newItem, ...prev]);
    onShowToast?.(`🔔 Thông báo mới: ${newItem.title}`);
  };

  const getCategoryIcon = (category: AppNotification["category"]) => {
    switch (category) {
      case "report":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "grade":
        return <Award className="w-4 h-4 text-amber-600" />;
      case "enterprise":
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case "deadline":
        return <Clock className="w-4 h-4 text-rose-600" />;
      case "system":
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        title="Trung tâm thông báo"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 transition-transform active:scale-90" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[340px] sm:w-[420px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs tracking-tight">
                  Trung tâm Thông báo
                </h4>
                <p className="text-[10px] text-slate-300">
                  {unreadCount > 0
                    ? `Bạn có ${unreadCount} thông báo chưa đọc`
                    : "Đã cập nhật toàn bộ thông báo"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="px-2 py-1 text-[11px] font-semibold text-blue-300 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Đã đọc hết</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
                activeFilter === "unread"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("reports")}
              className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
                activeFilter === "reports"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Báo cáo & Điểm
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("system")}
              className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
                activeFilter === "system"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Hạn chót & Hệ thống
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Không có thông báo nào trong mục này
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Mọi phản hồi và tin tức mới nhất sẽ tự động xuất hiện tại đây.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative p-3 rounded-lg transition-all cursor-pointer flex items-start gap-3 ${
                    !item.isRead
                      ? "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-l-blue-600"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* Category Icon */}
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h5
                        className={`text-xs leading-snug line-clamp-1 ${
                          !item.isRead
                            ? "font-bold text-slate-900"
                            : "font-medium text-slate-800"
                        }`}
                      >
                        {item.title}
                      </h5>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        {item.sender?.name || "Hệ thống"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Actions on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNotification(item.id, e)}
                      className="p-1 hover:bg-rose-100 rounded text-slate-400 hover:text-rose-600"
                      title="Xóa thông báo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={handleSimulateNewNotification}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-100/60 hover:bg-blue-100 rounded-md transition-colors"
              title="Thử nghiệm nhận thông báo đẩy tức thì"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Mô phỏng tin mới</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) {
                  if (role === "Student") onNavigate("student-notifications");
                  else if (role === "Lecturer") onNavigate("notifications");
                  else onNavigate("admin-notifications");
                }
              }}
              className="font-bold text-[11px] text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
