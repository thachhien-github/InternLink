import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CheckCheck,
  Clock,
  Info,
  MessageSquare,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { getApiErrorMessage } from "../../../lib/apiClient";
import {
  mapNotificationDtoToStudentUi,
  type StudentNotificationItem,
} from "../../../lib/portalMappers";
import { notificationService } from "../../../services/notification.service";

type ViewFilter = "all" | "unread" | "read" | "lecturer" | "company" | "deadline" | "faculty";
type NotificationItem = StudentNotificationItem;

const filterLabels: Record<ViewFilter, string> = {
  all: "Tất cả",
  unread: "Chưa đọc",
  read: "Đã đọc",
  lecturer: "Giảng viên",
  company: "Doanh nghiệp",
  deadline: "Deadline",
  faculty: "Thông báo Khoa",
};

function matchesFilter(item: NotificationItem, filter: ViewFilter) {
  if (filter === "unread") return item.isUnread;
  if (filter === "read") return !item.isUnread;
  if (filter === "lecturer") return item.category === "Giảng viên";
  if (filter === "company") return item.category === "Doanh nghiệp";
  if (filter === "deadline") return item.category === "Deadline";
  if (filter === "faculty") return item.category === "Thông báo Khoa";
  return true;
}

export const NotificationsView = ({
  onShowToast,
  onNavigate,
}: {
  onShowToast?: (msg: string) => void;
  onNavigate?: (tab: string) => void;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    notificationService.getMine()
      .then((rows) => {
        if (cancelled) return;
        const mapped = rows.map(mapNotificationDtoToStudentUi);
        setNotifications(mapped);
        setSelected(mapped[0] ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = notifications.filter((item) => item.isUnread).length;
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notifications
      .filter((item) => matchesFilter(item, filter))
      .filter((item) => !query || [item.title, item.description, item.senderName].some((value) => value.toLowerCase().includes(query)));
  }, [filter, notifications, search]);

  const markRead = async (item: NotificationItem) => {
    if (!item.isUnread) return;
    try {
      await notificationService.markRead(item.id);
      setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, isUnread: false } : entry));
      setSelected((current) => current?.id === item.id ? { ...current, isUnread: false } : current);
    } catch (err) {
      onShowToast?.(getApiErrorMessage(err));
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((current) => current.map((item) => ({ ...item, isUnread: false })));
      setSelected((current) => current ? { ...current, isUnread: false } : current);
      onShowToast?.("Đã đánh dấu tất cả thông báo là đã đọc.");
    } catch (err) {
      onShowToast?.(getApiErrorMessage(err));
    }
  };

  const iconFor = (item: NotificationItem) => {
    if (item.category === "Giảng viên") return <MessageSquare className="h-4 w-4" />;
    if (item.category === "Doanh nghiệp") return <Building2 className="h-4 w-4" />;
    if (item.category === "Deadline") return <Clock className="h-4 w-4" />;
    if (item.category === "Thông báo Khoa") return <ShieldCheck className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 animate-in fade-in duration-200">
      <PageHeader
        icon={Bell}
        title="Thông báo"
        subtitle={`${notifications.length} thông báo · ${unreadCount} chưa đọc`}
        actions={[{
          label: "Đánh dấu đã đọc tất cả",
          icon: CheckCheck,
          onClick: () => void markAllRead(),
          variant: "secondary",
          disabled: unreadCount === 0,
        }]}
      />

      <Panel className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm thông báo..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">{visible.length} kết quả</span>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
          {(Object.keys(filterLabels) as ViewFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${filter === key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {filterLabels[key]}{key === "all" ? ` (${notifications.length})` : ""}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-xs text-slate-500">Đang tải thông báo...</p>
        ) : error ? (
          <p className="rounded-md bg-rose-50 p-4 text-xs text-rose-700">{error}</p>
        ) : visible.length === 0 ? (
          <p className="py-10 text-center text-xs text-slate-500">Không có thông báo phù hợp.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setSelected(item); void markRead(item); }}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${selected?.id === item.id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <div className="flex gap-2.5">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.isUnread ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                      {iconFor(item)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <strong className="line-clamp-1 text-xs text-slate-900">{item.title}</strong>
                        {item.isUnread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[11px] leading-relaxed text-slate-500">{item.description}</span>
                      <span className="mt-1 block text-[10px] text-slate-400">{item.timeAgo} · {item.senderName}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="min-h-[300px] rounded-md border border-slate-200 bg-slate-50 p-4">
              {selected ? (
                <article className="space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-600">{selected.category}</span>
                      <h2 className="mt-1 text-base font-bold text-slate-900">{selected.title}</h2>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-blue-600">{iconFor(selected)}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>Từ: <strong className="text-slate-700">{selected.senderName}</strong></span>
                    <span>{selected.dateStr}</span>
                    <span className={selected.priority === "Khẩn" ? "font-bold text-rose-600" : ""}>{selected.priority}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.fullContent}</p>
                  {selected.relatedTab && onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate(selected.relatedTab)}
                      className="border-t border-slate-200 pt-3 text-xs font-bold text-blue-700 hover:text-blue-800"
                    >
                      Mở nội dung liên quan
                    </button>
                  )}
                </article>
              ) : (
                <p className="py-20 text-center text-xs text-slate-500">Chọn một thông báo để xem chi tiết.</p>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
};

export { NotificationsView as StudentNotificationsView };
