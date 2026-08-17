import { useState, useEffect, useMemo } from "react";
import {
  Bell,
  CheckCheck,
  Clock,
  Search,
  FileText,
  MessageSquare,
  Building2,
  Download,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  Pin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapNotificationDtoToStudentUi } from "../../../lib/portalMappers";
import { notificationService } from "../../../services/notification.service";
import { weeklyReportService } from "../../../services/weeklyReport.service";
import { INTERNSHIP_WEEKS } from "../../../config/internship";

export const NotificationsView = ({ onShowToast, onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState("T\u1EA5t c\u1EA3");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);
  const [selectedModalNotif, setSelectedModalNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [weeklyReports, setWeeklyReports] = useState<
    { weekNumber: number; title: string; status: string }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [notifRows, reportRows] = await Promise.all([
          notificationService.getMine(),
          weeklyReportService.getMine().catch(() => []),
        ]);
        if (!cancelled) {
          const mapped = notifRows.map(mapNotificationDtoToStudentUi);
          setNotifications(mapped);
          if (mapped.length > 0) setSelectedNotifId(mapped[0].id);
          setWeeklyReports(
            reportRows.map((r) => ({
              weekNumber: r.weekNumber,
              title: r.title,
              status: r.status,
            })),
          );
        }
      } catch (err) {
        if (!cancelled) onShowToast?.(getApiErrorMessage(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onShowToast]);

  const pinnedAnnouncements = useMemo(
    () =>
      notifications
        .filter((n) => n.priority === "Quan trọng" || n.isUnread)
        .slice(0, 3)
        .map((n) => ({
          id: n.id,
          title: n.title,
          source: n.senderName,
          date: n.dateStr,
          desc: n.description,
          badge: n.category,
        })),
    [notifications],
  );

  const upcomingDeadlines = useMemo(() => {
    const items = [];
    for (let w = 1; w <= INTERNSHIP_WEEKS; w++) {
      const r = weeklyReports.find((x) => x.weekNumber === w);
      const pending =
        !r ||
        r.status === "Draft" ||
        r.status === "RevisionRequested" ||
        r.status === "Submitted";
      if (pending) {
        items.push({
          id: `wr-${w}`,
          title: `Nộp Báo cáo Tuần ${w}`,
          deadlineStr: r?.title ?? "Chưa nộp",
          daysLeft: r?.status === "RevisionRequested" ? "Cần sửa" : "Chưa nộp",
          tab: "student-weekly-reports",
        });
      }
    }
    if (
      items.length < 2 &&
      !weeklyReports.some((s) => s.status === "Approved")
    ) {
      items.push({
        id: "sub-final",
        title: "Nộp sản phẩm thực tập",
        deadlineStr: "Cuối kỳ thực tập",
        daysLeft: "Quan trọng",
        tab: "student-submissions",
      });
    }
    return items.slice(0, 4);
  }, [weeklyReports]);
  const handleMarkAllRead = async () => {
    {
      try {
        await notificationService.markAllRead();
        const rows = await notificationService.getMine();
        setNotifications(rows.map(mapNotificationDtoToStudentUi));
        onShowToast("Đã đánh dấu tất cả thông báo là đã đọc.");
        return;
      } catch (err) {
        onShowToast(getApiErrorMessage(err));
        return;
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    onShowToast(
      "\u0110\xE3 \u0111\xE1nh d\u1EA5u t\u1EA5t c\u1EA3 th\xF4ng b\xE1o l\xE0 \u0110\xE3 \u0111\u1ECDc!",
    );
  };
  const handleMarkSingleRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = notifications.find((n) => n.id === id);
    if (target?.isUnread) {
      try {
        await notificationService.markRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n)),
        );
        return;
      } catch (err) {
        onShowToast(getApiErrorMessage(err));
        return;
      }
    }
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return { ...n, isUnread: !n.isUnread };
        }
        return n;
      }),
    );
  };
  const filteredNotifications = notifications.filter((n) => {
    let matchCat = true;
    if (activeFilter === "Ch\u01B0a \u0111\u1ECDc") matchCat = n.isUnread;
    else if (activeFilter === "\u0110\xE3 \u0111\u1ECDc")
      matchCat = !n.isUnread;
    else if (activeFilter === "Gi\u1EA3ng vi\xEAn")
      matchCat = n.category === "Gi\u1EA3ng vi\xEAn";
    else if (activeFilter === "Doanh nghi\u1EC7p")
      matchCat = n.category === "Doanh nghi\u1EC7p";
    else if (activeFilter === "Deadline") matchCat = n.category === "Deadline";
    else if (activeFilter === "Th\xF4ng b\xE1o Khoa")
      matchCat = n.category === "Th\xF4ng b\xE1o Khoa";
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const selectedNotif =
    notifications.find((n) => n.id === selectedNotifId) || notifications[0];
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Gi\u1EA3ng vi\xEAn":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "Doanh nghi\u1EC7p":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case "Deadline":
        return <Clock className="w-4 h-4 text-rose-600" />;
      case "Th\xF4ng b\xE1o Khoa":
        return <Bell className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };
  const getPriorityBadge = (p) => {
    switch (p) {
      case "Kh\u1EA9n":
        return "bg-rose-100 text-rose-800 border-rose-200 font-bold";
      case "Quan tr\u1ECDng":
        return "bg-amber-100 text-amber-800 border-amber-200 font-bold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-medium";
    }
  };
  const unreadCount = notifications.filter((n) => n.isUnread).length;
  return (
    <div className="space-y-5 animate-in fade-in duration-200 max-w-7xl mx-auto">
      <PageHeader
        icon={Bell}
        title="Thông báo"
        subtitle="Cập nhật tin tức, nhắc nhở deadline và nhận xét từ Giảng viên & Doanh nghiệp."
        badge={`${notifications.length} thông báo`}
        badgeColor="bg-blue-100 text-blue-800 border-blue-200"
        actions={[
          {
            label: "Đánh dấu tất cả đã đọc",
            icon: CheckCheck,
            onClick: handleMarkAllRead,
            variant: "primary",
          },
        ]}
      >
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 font-semibold text-[10px] rounded-md border bg-amber-100 text-amber-800 border-amber-200">
            {unreadCount} chưa đọc
          </span>
        )}
      </PageHeader>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: NOTIFICATION LIST & SELECTED NOTIFICATION DETAIL */}
        <div className="lg:col-span-2 space-y-6">
          {/* NOTIFICATION LIST CARD */}
          <Panel className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" /> Danh sách thông báo
              </h2>

              <div className="relative w-40 sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm thông báo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-md text-xs outline-none font-medium"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1">
              {[
                "T\u1EA5t c\u1EA3",
                "Ch\u01B0a \u0111\u1ECDc",
                "\u0110\xE3 \u0111\u1ECDc",
                "Gi\u1EA3ng vi\xEAn",
                "Doanh nghi\u1EC7p",
                "Deadline",
                "Th\xF4ng b\xE1o Khoa",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setActiveFilter(chip);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${activeFilter === chip ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* List items */}
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-md overflow-hidden">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-medium">
                  Không tìm thấy thông báo nào phù hợp.
                </div>
              ) : (
                paginatedNotifications.map((n) => {
                  const isSelected = selectedNotifId === n.id;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedNotifId(n.id);
                        if (n.isUnread) handleMarkSingleRead(n.id);
                      }}
                      className={`p-3.5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isSelected ? "bg-blue-50/70 border-l-4 border-l-blue-600" : n.isUnread ? "bg-slate-50/80 font-bold" : "hover:bg-slate-50/50"}`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                          {getCategoryIcon(n.category)}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {n.senderName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-md">
                              {n.category}
                            </span>
                          </div>
                          <p
                            className={`text-xs truncate ${isSelected ? "text-blue-900 font-bold" : "text-slate-800 font-medium"}`}
                          >
                            {n.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {n.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] rounded-md border ${getPriorityBadge(n.priority)}`}
                        >
                          {n.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {n.timeAgo}
                        </span>
                        <button
                          onClick={() => setSelectedModalNotif(n)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                          title="Xem nhanh"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">
                Hiển thị {paginatedNotifications.length} /{" "}
                {filteredNotifications.length} thông báo
              </span>

              <div className="flex items-center gap-1.5 font-bold">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Panel>

          {/* SELECTED NOTIFICATION DETAIL PANEL */}
          {selectedNotif && (
            <Panel className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 shrink-0">
                    {getCategoryIcon(selectedNotif.category)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedNotif.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedNotif.senderName} ({selectedNotif.senderRole}) •{" "}
                      {selectedNotif.dateStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 text-xs rounded-md border ${getPriorityBadge(selectedNotif.priority)}`}
                  >
                    {selectedNotif.priority}
                  </span>
                </div>
              </div>

              {/* Detailed Content */}
              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3 text-xs text-slate-800">
                <p className="font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                  {selectedNotif.fullContent}
                </p>

                {/* Attachment */}
                {selectedNotif.attachment && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Tệp đính kèm:
                    </p>
                    <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2 max-w-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-800">
                            {selectedNotif.attachment.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {selectedNotif.attachment.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          onShowToast(
                            `\u0110ang t\u1EA3i t\u1EC7p ${selectedNotif.attachment?.name}...`,
                          )
                        }
                        className="p-1.5 hover:bg-slate-100 text-blue-600 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Action */}
              {selectedNotif.relatedTab && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate(selectedNotif.relatedTab);
                      else
                        onShowToast(
                          `Chuy\u1EC3n sang trang ${selectedNotif.relatedModule}`,
                        );
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Xem tại mục: {selectedNotif.relatedModule}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </Panel>
          )}
        </div>

        {/* RIGHT 1 COL: PINNED NOTICES & UPCOMING DEADLINES */}
        <div className="lg:col-span-1 space-y-6">
          {/* PINNED ANNOUNCEMENTS */}
          <Panel className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-600" /> Thông báo từ Khoa
            </h3>

            <div className="space-y-2 text-xs">
              {pinnedAnnouncements.length === 0 ? (
                <p className="text-slate-500 py-2">Không có thông báo ghim</p>
              ) : (
                pinnedAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 bg-amber-50/50 rounded-md border border-amber-200/80 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 text-[10px] px-2 py-0.5 bg-amber-100 rounded">
                        {ann.badge}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {ann.date}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{ann.title}</p>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      {ann.desc}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>

          {/* UPCOMING DEADLINES */}
          <Panel className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" /> Nhắc nhở hạn nộp
            </h3>

            <div className="space-y-2 text-xs">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-slate-500 py-2">Không có hạn nộp sắp tới</p>
              ) : (
                upcomingDeadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className="p-3 bg-rose-50/50 rounded-md border border-rose-200/80 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700 text-[10px] px-2 py-0.5 bg-rose-100 rounded">
                        Còn {dl.daysLeft}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {dl.deadlineStr}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{dl.title}</p>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate(dl.tab)}
                        className="w-full mt-1.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>Nộp ngay</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {selectedModalNotif && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-md border border-slate-200 space-y-4 animate-in zoom-in-95 relative">
            <button
              onClick={() => setSelectedModalNotif(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 shrink-0">
                {getCategoryIcon(selectedModalNotif.category)}
              </div>
              <div className="min-w-0 pr-6 space-y-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityBadge(selectedModalNotif.priority)}`}
                >
                  {selectedModalNotif.priority}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedModalNotif.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Đăng bởi: {selectedModalNotif.senderName} (
                  {selectedModalNotif.senderRole})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  Nội dung chi tiết:
                </p>
                <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-md border border-slate-200/80 leading-relaxed">
                  {selectedModalNotif.fullContent}
                </p>
              </div>

              {selectedModalNotif.attachment && (
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Tệp đính kèm:
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {selectedModalNotif.attachment.name}
                    </span>
                    <button
                      onClick={() =>
                        onShowToast(
                          `\u0110ang t\u1EA3i t\u1EC7p ${selectedModalNotif.attachment?.name}...`,
                        )
                      }
                      className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Tải về
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedModalNotif(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
              >
                Đóng
              </button>

              {selectedModalNotif.relatedTab && (
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate(selectedModalNotif.relatedTab);
                    setSelectedModalNotif(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5"
                >
                  <span>Chuyển tới trang liên quan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { NotificationsView as StudentNotificationsView };
