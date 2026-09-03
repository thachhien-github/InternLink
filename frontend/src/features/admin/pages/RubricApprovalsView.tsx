import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  RefreshCw,
  Send,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import { Panel } from "../../../components/common/Panel";
import { Toast } from "../../../components/common/Toast";
import { rubricService } from "../../../services/rubric.service";
import type {
  EvaluationRubricDto,
  EvaluationRubricStatus,
} from "../../../types/evaluation";

export const RubricApprovalsView = ({
  onShowToast,
}: {
  onShowToast: (msg: string) => void;
}) => {
  const [rubrics, setRubrics] = useState<EvaluationRubricDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PendingApproval");
  const [selectedRubric, setSelectedRubric] = useState<EvaluationRubricDto | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchRubrics = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all semesters to get their rubrics
      // Since there's no "list all rubrics" endpoint, we load semesters
      // and check each for a rubric. This is a pragmatic approach.
      const semesters = await fetch("/api/Admin/semesters", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((r) => r.json());

      const semesterList = semesters?.data ?? semesters ?? [];
      const allRubrics: EvaluationRubricDto[] = [];

      for (const sem of semesterList) {
        try {
          const rubric = await rubricService.getBySemester(sem.id);
          if (rubric) {
            allRubrics.push(rubric);
          }
        } catch {
          // No rubric for this semester
        }
      }

      setRubrics(allRubrics);
    } catch {
      showToast("Lỗi khi tải danh sách rubric.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRubrics();
  }, [fetchRubrics]);

  // Filtering
  const filteredRubrics = rubrics.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.criteria.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const pendingCount = rubrics.filter((r) => r.status === "PendingApproval").length;
  const approvedCount = rubrics.filter((r) => r.status === "Approved" || r.status === "Locked").length;
  const draftCount = rubrics.filter((r) => r.status === "Draft" || r.status === "Rejected").length;

  // Actions
  const handleApprove = async (rubricId: string) => {
    try {
      const semesterRubric = rubrics.find((r) => r.id === rubricId);
      if (!semesterRubric) return;
      const result = await rubricService.approve(semesterRubric.semesterId);
      setRubrics((prev) => prev.map((r) => (r.id === rubricId ? result : r)));
      showToast("Đã phê duyệt rubric thành công!");
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi phê duyệt.");
    }
  };

  const handleReject = async () => {
    if (!rejectTargetId || !rejectReason.trim()) {
      showToast("Vui lòng nhập lý do từ chối.");
      return;
    }
    try {
      const semesterRubric = rubrics.find((r) => r.id === rejectTargetId);
      if (!semesterRubric) return;
      const result = await rubricService.reject(semesterRubric.semesterId, rejectReason);
      setRubrics((prev) => prev.map((r) => (r.id === rejectTargetId ? result : r)));
      setShowRejectModal(false);
      setRejectReason("");
      setRejectTargetId(null);
      showToast("Đã từ chối rubric.");
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi từ chối.");
    }
  };

  const getStatusBadge = (status: EvaluationRubricStatus) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      Draft: { label: "Nháp", color: "bg-slate-100 text-slate-700 border-slate-200", icon: FileText },
      PendingApproval: { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
      Approved: { label: "Đã duyệt", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
      Rejected: { label: "Bị từ chối", color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
      Locked: { label: "Đã khóa", color: "bg-blue-50 text-blue-700 border-blue-200", icon: AlertTriangle },
    };
    const badge = badges[status] || badges.Draft;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <PageHeader
        icon={Sliders}
        title="Duyệt Tiêu chí Chấm điểm"
        subtitle="Phê duyệt hoặc từ chối rubric đánh giá thực tập do Admin gửi lên."
        actions={[
          {
            label: "Làm mới",
            icon: RefreshCw,
            onClick: fetchRubrics,
            variant: "secondary",
          },
        ]}
      />

      <KpiGrid>
        <KpiCard tone="amber" title="Chờ phê duyệt" value={pendingCount} unit="rubric" icon={Clock} footer="Cần xem xét" />
        <KpiCard tone="emerald" title="Đã phê duyệt" value={approvedCount} unit="rubric" icon={CheckCircle2} footer="Đang áp dụng" />
        <KpiCard tone="slate" title="Nháp / Từ chối" value={draftCount} unit="rubric" icon={FileText} footer="Chưa hoàn thiện" />
        <KpiCard tone="blue" title="Tổng số" value={rubrics.length} unit="rubric" icon={Sliders} footer="Toàn hệ thống" />
      </KpiGrid>

      {/* Filters */}
      <Panel className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Danh sách Rubric ({filteredRubrics.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên rubric, tiêu chí..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 text-xs font-medium"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PendingApproval">⏳ Chờ phê duyệt</option>
            <option value="Approved">✅ Đã phê duyệt</option>
            <option value="Draft">📝 Nháp</option>
            <option value="Rejected">❌ Bị từ chối</option>
            <option value="Locked">🔒 Đã khóa</option>
          </select>

          <div className="flex items-center justify-end">
            {statusFilter !== "PendingApproval" && (
              <button
                onClick={() => setStatusFilter("PendingApproval")}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded-md border border-amber-200 flex items-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                Xem chờ duyệt
              </button>
            )}
          </div>
        </div>
      </Panel>

      {/* Rubric List */}
      {isLoading ? (
        <Panel className="flex flex-col items-center justify-center py-16 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <p className="text-xs text-slate-500">Đang tải danh sách rubric...</p>
        </Panel>
      ) : filteredRubrics.length === 0 ? (
        <Panel className="text-center py-12 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Không có rubric nào</h3>
          <p className="text-xs text-slate-500">Không tìm thấy rubric phù hợp bộ lọc.</p>
        </Panel>
      ) : (
        <div className="space-y-3">
          {filteredRubrics.map((rubric) => (
            <Panel key={rubric.id} className="space-y-3">
              {/* Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === rubric.id ? null : rubric.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{rubric.name}</h3>
                      {getStatusBadge(rubric.status)}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {rubric.criteria.length} tiêu chí · Tổng trọng số: {rubric.criteria.reduce((s, c) => s + c.weight, 0)}%
                      {rubric.submittedByName && ` · Gửi bởi: ${rubric.submittedByName}`}
                      {rubric.submittedAt && ` · ${new Date(rubric.submittedAt).toLocaleString("vi-VN")}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {expandedId === rubric.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded: Criteria + Actions */}
              {expandedId === rubric.id && (
                <div className="border-t border-slate-100 pt-3 space-y-3">
                  {/* Criteria Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-2 px-3">STT</th>
                          <th className="py-2 px-3">Tên tiêu chí</th>
                          <th className="py-2 px-3">Mô tả</th>
                          <th className="py-2 px-3 text-center">Trọng số</th>
                          <th className="py-2 px-3 text-center">Max điểm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rubric.criteria.map((c, idx) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-600">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{c.name}</td>
                            <td className="py-2 px-3 text-slate-500">{c.description || "—"}</td>
                            <td className="py-2 px-3 text-center font-bold text-blue-700">{c.weight}%</td>
                            <td className="py-2 px-3 text-center text-slate-600">{c.maxScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Rejection reason display */}
                  {rubric.status === "Rejected" && rubric.rejectionReason && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800">
                      <span className="font-bold">Lý do từ chối:</span> {rubric.rejectionReason}
                    </div>
                  )}

                  {/* Approval info */}
                  {(rubric.status === "Approved" || rubric.status === "Locked") && rubric.approvedByName && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
                      <span className="font-bold">Phê duyệt bởi:</span> {rubric.approvedByName}
                      {rubric.approvedAt && ` · ${new Date(rubric.approvedAt).toLocaleString("vi-VN")}`}
                    </div>
                  )}

                  {/* Action Buttons for PendingApproval */}
                  {rubric.status === "PendingApproval" && (
                    <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs text-amber-800 font-medium">
                        Rubric đang chờ phê duyệt
                        {rubric.submittedAt && ` · Gửi lúc ${new Date(rubric.submittedAt).toLocaleString("vi-VN")}`}
                      </span>
                      <div className="flex-1" />
                      <button
                        onClick={() => handleApprove(rubric.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => {
                          setRejectTargetId(rubric.id);
                          setShowRejectModal(true);
                        }}
                        className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md border border-rose-200 flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              Từ chối rubric
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              rows={3}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(""); setRejectTargetId(null); }}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-md"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
