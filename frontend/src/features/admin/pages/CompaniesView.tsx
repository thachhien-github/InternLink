import { useMemo, useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  FileUp,
  Pencil,
  Trash2,
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  Check,
  Download,
  Upload,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Panel } from "../../../components/common/Panel";
import { Toolbar } from "../../../components/common/Toolbar";
import { useAdminCompanies } from "../../../hooks/useAdminCompanies";
import type { Enterprise } from "../../../types/enterprise";
import { INITIAL_ENTERPRISES } from "../../../data/mockData";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapCompanyDtoToEnterprise } from "../../../lib/adminMappers";
import { adminCompaniesService } from "../../../services/adminCompanies.service";

const emptyForm = {
  name: "",
  field: "",
  location: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  capacity: 10,
  status: "Đang hợp tác",
};

export const CompaniesView = ({
  onShowToast,
}: {
  onShowToast: (msg: string) => void;
}) => {
  const { companies: initialCompanies, loading: companiesLoading, error: companiesError } = useAdminCompanies();
  const [companies, setCompanies] = useState<Enterprise[]>(USE_MOCK ? INITIAL_ENTERPRISES : []);
  const [isLoadingApi, setIsLoadingApi] = useState(USE_MOCK ? false : companiesLoading);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Enterprise | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Enterprise | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const reloadCompanies = async () => {
    const rows = await adminCompaniesService.getAll();
    setCompanies(rows.map(mapCompanyDtoToEnterprise));
  };

  // Update companies when hook data changes
  useEffect(() => {
    if (initialCompanies && initialCompanies.length > 0) {
      setCompanies(initialCompanies as unknown as Enterprise[]);
      setIsLoadingApi(false);
    }
  }, [initialCompanies]);

  // Handle errors from hook
  useEffect(() => {
    if (!USE_MOCK && companiesError) {
      onShowToast(getApiErrorMessage(companiesError));
    }
  }, [companiesError, onShowToast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies.filter((c) => {
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.shortCode.toLowerCase().includes(q) ||
        c.field.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" || c.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [companies, search, statusFilter]);

  const statuses = useMemo(
    () => Array.from(new Set(companies.map((c) => c.status))),
    [companies],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (c: Enterprise) => {
    setEditing(c);
    setForm({
      name: c.name,
      field: c.field,
      location: c.location,
      contactPerson: c.contactPerson,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      website: c.website,
      capacity: c.capacity,
      status: c.status,
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      onShowToast("Vui lòng nhập tên doanh nghiệp");
      return;
    }

    const isActive = form.status === "Đang hợp tác";
    const body = {
      companyName: form.name.trim(),
      address: form.location || undefined,
      website: form.website || undefined,
      industry: form.field || undefined,
      contactPerson: form.contactPerson || undefined,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
      capacity: Number(form.capacity) || 0,
    };

    if (USE_MOCK) {
      if (editing) {
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? {
                  ...c,
                  ...form,
                  updatedAt: new Date().toLocaleDateString("vi-VN"),
                }
              : c,
          ),
        );
        onShowToast(`Đã cập nhật doanh nghiệp ${form.name}`);
      } else {
        const created: Enterprise = {
          id: `dn-${Date.now()}`,
          name: form.name.trim(),
          shortCode: form.name.trim().slice(0, 3).toUpperCase(),
          badge: "MỚI",
          badgeType: "gray",
          studentCount: 0,
          activeThisWeek: false,
          contactEmail: form.contactEmail,
          location: form.location,
          status: form.status,
          field: form.field,
          contactPerson: form.contactPerson,
          contactPhone: form.contactPhone,
          website: form.website,
          capacity: Number(form.capacity) || 0,
          rating: 0,
          hasStipend: false,
          isHiring: true,
          isPriority: false,
          updatedAt: new Date().toLocaleDateString("vi-VN"),
        };
        setCompanies((prev) => [created, ...prev]);
        onShowToast(`Đã thêm doanh nghiệp ${created.name}`);
      }
      setIsFormOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      if (editing) {
        await adminCompaniesService.update(editing.id, {
          ...body,
          isActive,
        });
        await reloadCompanies();
        onShowToast(`Đã cập nhật doanh nghiệp ${form.name}`);
      } else {
        await adminCompaniesService.create(body);
        await reloadCompanies();
        onShowToast(`Đã thêm doanh nghiệp ${form.name.trim()}`);
      }
      setIsFormOpen(false);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c: Enterprise) => {
    if (USE_MOCK) {
      setCompanies((prev) => prev.filter((x) => x.id !== c.id));
      onShowToast(`Đã xóa ${c.name} (mock)`);
      return;
    }
    try {
      await adminCompaniesService.delete(c.id);
      await reloadCompanies();
      onShowToast(`Đã xóa ${c.name}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await handleDelete(deleteTarget);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmImport = async () => {
    if (USE_MOCK) {
      onShowToast("Đã import thành công danh sách doanh nghiệp từ Excel");
      setIsImportModalOpen(false);
      return;
    }
    if (!importFile) {
      onShowToast("Vui lòng chọn file Excel trước khi import");
      return;
    }
    setIsImporting(true);
    try {
      const result = await adminCompaniesService.importExcel(importFile);
      await reloadCompanies();
      onShowToast(
        `Import xong: ${result.successCount}/${result.totalRows} doanh nghiệp`,
      );
      setIsImportModalOpen(false);
      setImportFile(null);
      setImportFileName(null);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      await adminCompaniesService.downloadExport();
      onShowToast("Đã tải xuống danh sách doanh nghiệp (.xlsx)");
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <PageHeader
        icon={Building2}
        title="Doanh nghiệp"
        subtitle="Danh mục đối tác thực tập — đồng bộ API"
        actions={[
          {
            label: "Xuất Excel",
            icon: Download,
            onClick: () => void handleExport(),
            variant: "secondary",
          },
          {
            label: "Import Excel",
            icon: FileUp,
            onClick: () => setIsImportModalOpen(true),
            variant: "secondary",
          },
          {
            label: "Thêm doanh nghiệp",
            icon: Plus,
            onClick: openCreate,
            variant: "primary",
          },
        ]}
      />

      <Toolbar
        left={
          <p className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{companies.length}</span>{" "}
            doanh nghiệp ·{" "}
            <span className="font-bold text-slate-800">{filtered.length}</span>{" "}
            đang lọc
            {isLoadingApi && (
              <span className="ml-2 text-blue-600 font-semibold">
                · Đang tải API…
              </span>
            )}
          </p>
        }
      />

      <Panel className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Danh sách Doanh nghiệp
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Quản lý đối tác, liên hệ và sức chứa thực tập
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên, mã, lĩnh vực…"
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-56"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 font-medium outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-2.5 pr-3">Doanh nghiệp</th>
                <th className="py-2.5 pr-3">Lĩnh vực</th>
                <th className="py-2.5 pr-3">Liên hệ</th>
                <th className="py-2.5 pr-3">SV / Sức chứa</th>
                <th className="py-2.5 pr-3">Trạng thái</th>
                <th className="py-2.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="py-3 pr-3">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {c.shortCode}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-slate-600 max-w-[180px]">
                    {c.field}
                  </td>
                  <td className="py-3 pr-3 text-slate-600">
                    <div>{c.contactPerson}</div>
                    <div className="text-[10px] text-slate-400">{c.contactEmail}</div>
                  </td>
                  <td className="py-3 pr-3 font-semibold text-slate-800">
                    {c.studentCount} / {c.capacity}
                  </td>
                  <td className="py-3 pr-3">
                    <span className="inline-flex px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-md text-slate-500 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                        title="Sửa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-400 font-medium"
                  >
                    Không có doanh nghiệp khớp bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editing ? "Sửa doanh nghiệp" : "Thêm doanh nghiệp"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {(
                [
                  ["name", "Tên doanh nghiệp", "text"],
                  ["field", "Lĩnh vực", "text"],
                  ["location", "Địa chỉ", "text"],
                  ["contactPerson", "Người liên hệ", "text"],
                  ["contactEmail", "Email liên hệ", "email"],
                  ["contactPhone", "Điện thoại", "text"],
                  ["website", "Website", "text"],
                  ["capacity", "Sức chứa thực tập", "number"],
                ] as const
              ).map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    {key === "location" && (
                      <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    )}
                    {key === "contactEmail" && (
                      <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    )}
                    {key === "contactPhone" && (
                      <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    )}
                    {key === "website" && (
                      <Globe className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    )}
                    <input
                      type={type}
                      value={String(form[key] ?? "")}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          [key]:
                            type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-blue-500 outline-none ${
                        ["location", "contactEmail", "contactPhone", "website"].includes(
                          key,
                        )
                          ? "pl-8"
                          : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Trạng thái
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 outline-none cursor-pointer"
                >
                  <option>Đang hợp tác</option>
                  <option>Đối tác ưu tiên</option>
                  <option>Tạm ngưng</option>
                  <option>Chờ duyệt</option>
                </select>
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-bold rounded-md bg-[#1d4ed8] text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? "Đang lưu…" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Import Doanh nghiệp</h3>
              <button type="button" onClick={() => setIsImportModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => void adminCompaniesService.downloadImportTemplate().then(() => onShowToast("Đã tải file mẫu import doanh nghiệp"))}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Tải file Excel mẫu
            </button>
            <label className="block border-2 border-dashed border-blue-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-700">
                {importFileName ?? "Chọn file .xlsx"}
              </span>
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImportFile(file);
                    setImportFileName(file.name);
                  }
                }}
              />
            </label>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-md">Hủy</button>
              <button type="button" disabled={isImporting} onClick={() => void handleConfirmImport()} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-md">
                {isImporting ? "Đang import…" : "Xác nhận Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa doanh nghiệp"
        description={
          deleteTarget ? (
            <>
              Xóa doanh nghiệp{" "}
              <strong className="text-slate-900">{deleteTarget.name}</strong>?
              Hành động không thể hoàn tác.
            </>
          ) : null
        }
        confirmLabel="Xóa doanh nghiệp"
        variant="danger"
        loading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export { CompaniesView as AdminCompaniesView };
