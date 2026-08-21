import { useState, useEffect, useMemo } from "react";
import {
  Package,
  FileCode,
  Database,
  FileText,
  Video,
  Presentation,
  Github,
  ExternalLink,
  Upload,
  Download,
  RefreshCw,
  Trash2,
  Copy,
  Send,
  Plus,
  GitBranch,
  ShieldAlert,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useStudentPortal } from "../../../contexts/StudentPortalContext";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { Toolbar } from "../../../components/common/Toolbar";
import { EmptyState } from "../../../components/common/EmptyState";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapStudentSubmissionToUpload, mapUiProductCategoryToSubmissionType } from "../../../lib/portalMappers";
import { submissionApiService } from "../../../services/submissionApi.service";
import type { SubmissionDto } from "../../../types/api";

const CHECKLIST_TEMPLATE = [
  { key: "Source Code", label: "Mã nguồn (Source Code ZIP / GitHub)", required: true },
  { key: "User Manual", label: "Báo cáo tổng kết (Final Report PDF)", required: true },
  { key: "Slide", label: "Slide thuyết trình (Presentation PPTX)", required: true },
  { key: "Video Demo", label: "Video Demo sản phẩm (MP4)", required: true },
  { key: "Database Backup", label: "Kịch bản CSDL (Database Script SQL)", required: false },
];

type UploadItem = {
  id: string;
  title: string;
  category: string;
  fileType: string;
  size: string;
  version: string;
  uploadDate: string;
  status: string;
  notes: string;
  fileUrl?: string;
};

export const SubmissionsView = ({ onShowToast }) => {
  const { profile, internshipId } = useStudentPortal();
  const [hasSubmissions, setHasSubmissions] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [rawSubmissions, setRawSubmissions] = useState<SubmissionDto[]>([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("main");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await submissionApiService.getMine();
        if (!cancelled) {
          setRawSubmissions(rows);
          setUploads(rows.map(mapStudentSubmissionToUpload));
          setHasSubmissions(rows.length > 0);
        }
      } catch (err) {
        if (!cancelled) onShowToast?.(getApiErrorMessage(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onShowToast]);

  const checklist = useMemo(
    () =>
      CHECKLIST_TEMPLATE.map((item, i) => ({
        id: `ck-${i}`,
        label: item.label,
        required: item.required,
        completed: uploads.some(
          (u) =>
            u.category === item.key &&
            u.status !== "Từ chối" &&
            u.status !== "Yêu cầu sửa",
        ),
      })),
    [uploads],
  );

  const requirements = useMemo(
    () =>
      rawSubmissions
        .filter((s) => s.status === "RevisionRequested")
        .map((s) => {
          const fb = (s.feedbacks ?? []).filter((f) => f.isPublic).at(-1);
          return {
            id: s.id,
            title: s.title ?? "Yêu cầu chỉnh sửa sản phẩm",
            detail: fb?.comment ?? s.description ?? "Giảng viên yêu cầu chỉnh sửa bản nộp.",
            deadline: "—",
            priority: "Cao",
            status: "Chưa xong",
          };
        }),
    [rawSubmissions],
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpdateRepoModal, setShowUpdateRepoModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState<UploadItem | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Source Code");
  const [uploadVersion, setUploadVersion] = useState("v1.0");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [newRepoBranch, setNewRepoBranch] = useState("main");
  const [contactMsg, setContactMsg] = useState("");
  const completedChecklistCount = checklist.filter((c) => c.completed).length;
  const toggleChecklist = (_id: string) => {
    onShowToast("Checklist tự động cập nhật theo sản phẩm đã nộp.");
  };
  const handleCopyGit = () => {
    if (!repoUrl) {
      onShowToast("Chưa có liên kết GitHub.");
      return;
    }
    navigator.clipboard.writeText(repoUrl);
    onShowToast("Đã sao chép liên kết GitHub Repository!");
  };
  const handleAddUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      onShowToast("Vui lòng nhập tên tệp sản phẩm!");
      return;
    }

    if (!internshipId) {
      onShowToast("Chưa có kỳ thực tập được gán. Vui lòng liên hệ phòng đào tạo.");
      return;
    }

    if (!uploadFile) {
      onShowToast("Vui lòng chọn tệp đính kèm!");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submissionApiService.upload({
        internshipId,
        type: mapUiProductCategoryToSubmissionType(uploadCategory),
        title: uploadTitle.trim(),
        description: uploadNotes.trim() || undefined,
        file: uploadFile,
      });
      const mapped = mapStudentSubmissionToUpload(created);
      setUploads((prev) => [mapped, ...prev]);
      setRawSubmissions((prev) => [created, ...prev]);
      setHasSubmissions(true);
      setShowUploadModal(false);
      onShowToast(`Đã nộp sản phẩm: ${uploadTitle}`);
      setUploadTitle("");
      setUploadNotes("");
      setUploadFile(null);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReplaceFile = async (e) => {
    e.preventDefault();
    if (!replaceTarget) return;

    if (!replaceFile) {
      onShowToast("Vui lòng chọn tệp thay thế!");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await submissionApiService.resubmitUpload(replaceTarget.id, {
        description: uploadNotes.trim() || replaceTarget.notes || undefined,
        file: replaceFile,
      });
      const mapped = mapStudentSubmissionToUpload(updated);
      setUploads((prev) =>
        prev.map((item) => (item.id === replaceTarget.id ? mapped : item)),
      );
      setRawSubmissions((prev) =>
        prev.map((item) => (item.id === replaceTarget.id ? updated : item)),
      );
      onShowToast(`Đã nộp lại tệp: ${replaceTarget.title}`);
      setReplaceTarget(null);
      setUploadNotes("");
      setReplaceFile(null);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDownloadUpload = async (item: UploadItem) => {
    try {
      const { blob, filename } = await submissionApiService.download(
        item.id,
        item.title,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };
  const handleDeleteUpload = (_id: string, _title: string) => {
    onShowToast("Chức năng xóa sản phẩm chưa được hỗ trợ trên hệ thống.");
  };
  const handleUpdateRepo = (e) => {
    e.preventDefault();
    setRepoUrl(newRepoUrl.trim());
    setRepoBranch(newRepoBranch.trim() || "main");
    setShowUpdateRepoModal(false);
    onShowToast("Đã lưu liên kết GitHub (chỉ hiển thị trên trình duyệt).");
  };
  const handleSendContact = (e) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setShowContactModal(false);
    setContactMsg("");
    onShowToast(
      "\u0110\xE3 g\u1EEDi tin nh\u1EAFn \u0111\u1EBFn Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn!",
    );
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Source Code":
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case "Slide":
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case "Video Demo":
        return <Video className="w-4 h-4 text-rose-600" />;
      case "User Manual":
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case "Database Backup":
        return <Database className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };
  if (!hasSubmissions) {
    return (
      <div className="space-y-5 animate-in fade-in duration-200 max-w-3xl mx-auto py-8">
        <PageHeader
          icon={Package}
          title="Sản phẩm thực tập"
          subtitle="Quản lý mã nguồn, slide thuyết trình, video demo và các tài liệu đợt thực tập."
          badge="Chưa có sản phẩm"
          badgeColor="bg-slate-100 text-slate-700 border-slate-200"
          actions={[
            {
              label: "Bắt đầu tải lên",
              icon: Plus,
              onClick: () => {
                setHasSubmissions(true);
                setShowUploadModal(true);
              },
              variant: "primary",
            },
          ]}
        />
        <div className="flex items-center justify-between bg-slate-100 p-3 rounded-md border border-slate-200">
          <span className="text-xs font-bold text-slate-600">
            Thử nghiệm giao diện:
          </span>
          <button
            onClick={() => setHasSubmissions(true)}
            className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem state: Đã có sản phẩm bàn giao
          </button>
        </div>

        <Panel className="p-8 text-center space-y-4" padding="none">
          <div className="w-16 h-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">
              Chưa có sản phẩm thực tập nào được bàn giao
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Bạn chưa tải lên mã nguồn, báo cáo cuối kỳ hay slide thuyết trình
              đợt thực tập này.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setHasSubmissions(true);
                setShowUploadModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Bắt đầu tải lên
            </button>
          </div>
        </Panel>
      </div>
    );
  }
  return (
    <div className="space-y-5 animate-in fade-in duration-200 max-w-7xl mx-auto">
      <PageHeader
        icon={Package}
        title="Sản phẩm thực tập"
        subtitle="Quản lý mã nguồn, slide thuyết trình, video demo và các tài liệu đợt thực tập."
        badge={`Đã nộp ${uploads.length} sản phẩm`}
        badgeColor="bg-blue-100 text-blue-800 border-blue-200"
        actions={[
          {
            label: "Thêm sản phẩm",
            icon: Plus,
            onClick: () => setShowUploadModal(true),
            variant: "primary",
          },
          {
            label: "Git Repo",
            icon: Github,
            onClick: () => setShowUpdateRepoModal(true),
            variant: "secondary",
          },
        ]}
      >
        <span className="px-2 py-0.5 font-semibold text-[10px] rounded-md border bg-emerald-100 text-emerald-800 border-emerald-200">
          Checklist {completedChecklistCount}/{checklist.length}
        </span>
      </PageHeader>

      <Toolbar
        left={
          <span className="text-xs font-semibold text-slate-600">
            Checklist{" "}
            <span className="text-emerald-700 font-bold">
              {completedChecklistCount}/{checklist.length}
            </span>{" "}
            · {uploads.length} tệp đã nộp
          </span>
        }
        right={
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="il-btn il-btn-primary text-xs py-1.5 px-3"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm sản phẩm
          </button>
        }
      />

      <Panel className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-md text-white font-bold text-base flex items-center justify-center shrink-0">
              {profile.company.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Hệ thống Quản lý Thực tập Doanh nghiệp InternLink
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Vị trí: Full-Stack Developer Intern • Doanh nghiệp:{" "}
                {profile.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {repoUrl ? (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 border border-slate-200"
              >
                <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub Repo{" "}
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNewRepoUrl("");
                  setNewRepoBranch("main");
                  setShowUpdateRepoModal(true);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md border border-slate-200"
              >
                <Github className="w-3.5 h-3.5 inline mr-1" /> Thêm GitHub
              </button>
            )}
            <button
              onClick={handleCopyGit}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors border border-slate-200"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Project Meta Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-md border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Giảng viên hướng dẫn
            </span>
            <p className="font-bold text-slate-800 mt-0.5">
              {profile.lecturerName}
            </p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-md border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Mentor Doanh nghiệp
            </span>
            <p className="font-bold text-slate-800 mt-0.5">
              {profile.supervisorName}
            </p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-md border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Git Branch
            </span>
            <p className="font-mono font-bold text-blue-700 mt-0.5 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-blue-600" /> {repoBranch || "main"}
            </p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-md border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Công nghệ chính
            </span>
            <p className="font-bold text-slate-800 mt-0.5 truncate">
              React, TypeScript, Express, SQL
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Panel className="space-y-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-0">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" /> Sản phẩm bàn giao
              </h2>
            </div>

            <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
              <table className="w-full text-left border-collapse text-xs mt-3">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2 pr-3">Sản phẩm</th>
                    <th className="py-2 pr-3 w-24">Loại</th>
                    <th className="py-2 pr-3 w-20">Trạng thái</th>
                    <th className="py-2 text-right w-36">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uploads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4">
                        <EmptyState
                          title="Chưa có sản phẩm nào được nộp"
                          description="Nhấp vào nút 'Nộp sản phẩm' phía trên để tải lên báo cáo cuối kỳ, slide, mã nguồn hoặc video demo."
                          actionLabel="Nộp sản phẩm ngay"
                          onAction={() => setShowUploadModal(true)}
                        />
                      </td>
                    </tr>
                  ) : (
                    uploads.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 pr-3">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 shrink-0">
                            {getCategoryIcon(item.category)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {item.version} · {item.fileType} · {item.size} ·{" "}
                              {item.uploadDate}
                            </p>
                            {item.notes && (
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-slate-600 font-medium">
                        {item.category}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${item.status === "Đã hoàn thành" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : item.status === "Cần chỉnh sửa" ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => void handleDownloadUpload(item)}
                            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
                            title="Tải về"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplaceTarget(item);
                              setUploadNotes(item.notes || "");
                              setReplaceFile(null);
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-md text-amber-600"
                            title="Thay thế"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteUpload(item.id, item.title)
                            }
                            className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-1 space-y-5">
          {/* DELIVERABLE CHECKLIST CARD */}
          <Panel className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Checklist
                bàn giao
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {completedChecklistCount}/{checklist.length}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-md border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${item.completed ? "bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300"}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${item.completed ? "bg-emerald-600 text-white font-bold" : "border border-slate-300 bg-white"}`}
                    >
                      {item.completed && "\u2713"}
                    </div>
                    <span className="truncate font-bold">{item.label}</span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.required ? "bg-rose-100 text-rose-800" : "bg-slate-200 text-slate-700"}`}
                  >
                    {item.required ? "B\u1EAFt bu\u1ED9c" : "T\xF9y ch\u1ECDn"}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* LECTURER FEEDBACK & REQUIREMENTS */}
          <Panel className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Góp ý từ Giảng
              viên
            </h3>

            <div className="space-y-2.5 text-xs">
              {requirements.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">
                  Không có yêu cầu chỉnh sửa từ giảng viên
                </p>
              ) : (
                requirements.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {req.title}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${req.status === "\u0110\xE3 c\u1EADp nh\u1EADt" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {req.detail}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Hạn chót: {req.deadline}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>

          {/* QUICK ACTIONS */}
          <Panel className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Thao tác nhanh
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Tải lên sản phẩm mới
                </span>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" /> Liên hệ
                  Giảng viên
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddUpload}
            className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-md border border-slate-200 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /> Tải lên sản phẩm
                thực tập mới
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên tệp sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Mã nguồn hệ thống (ZIP), Slide thuyết trình..."
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loại sản phẩm
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium"
                  >
                    <option value="Source Code">Mã nguồn (.zip)</option>
                    <option value="Slide">
                      Slide thuyết trình (.pptx / .pdf)
                    </option>
                    <option value="Video Demo">Video Demo (.mp4)</option>
                    <option value="User Manual">
                      Tài liệu / Báo cáo (.pdf)
                    </option>
                    <option value="Database Backup">
                      Kịch bản CSDL (.sql)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phiên bản
                  </label>
                  <input
                    type="text"
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chọn tệp đính kèm
                </label>
                <label className="border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center rounded-md hover:border-blue-400 transition-colors cursor-pointer space-y-1 block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setUploadFile(e.target.files?.[0] ?? null)
                    }
                  />
                  <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                  <p className="font-bold text-slate-800 text-xs">
                    {uploadFile?.name || "Bấm để chọn tệp từ máy tính"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    ZIP, PDF, PPTX, MP4, SQL (tối đa theo cấu hình hệ thống)
                  </p>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ghi chú kèm theo
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Ghi chú tóm tắt nội dung tệp..."
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Đang nộp..." : "Tải lên"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REPLACE FILE MODAL */}
      {replaceTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleReplaceFile}
            className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-md border border-slate-200 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" /> Thay thế tệp
                sản phẩm
              </h3>
              <button
                type="button"
                onClick={() => setReplaceTarget(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-md font-bold border border-blue-100">
                Đang thay thế: {replaceTarget.title} ({replaceTarget.version})
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chọn tệp mới
                </label>
                <label className="border-2 border-dashed border-amber-200 bg-amber-50/40 p-4 text-center rounded-md hover:bg-amber-50 transition-colors cursor-pointer space-y-1 block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setReplaceFile(e.target.files?.[0] ?? null)
                    }
                  />
                  <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                  <p className="font-bold text-amber-900 text-xs">
                    {replaceFile?.name || "Bấm để chọn tệp thay thế"}
                  </p>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ghi chú chỉnh sửa
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Mô tả điểm chỉnh sửa..."
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReplaceTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-md shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Đang nộp lại..." : "Lưu thay thế"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE REPOSITORY MODAL */}
      {showUpdateRepoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateRepo}
            className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-md border border-slate-200 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-800" /> Cập nhật GitHub
                Repository
              </h3>
              <button
                type="button"
                onClick={() => setShowUpdateRepoModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Branch chính
                </label>
                <input
                  type="text"
                  required
                  value={newRepoBranch}
                  onChange={(e) => setNewRepoBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowUpdateRepoModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONTACT LECTURER MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSendContact}
            className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-md border border-slate-200 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" /> Trao đổi với
                Giảng viên
              </h3>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800">
                Người nhận: {profile.lecturerName} (Giảng viên hướng
                dẫn)
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung tin nhắn *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Nhập nội dung thắc mắc về sản phẩm thực tập..."
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Gửi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export { SubmissionsView as StudentSubmissionsView };
