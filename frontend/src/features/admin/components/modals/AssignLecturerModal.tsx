import { useCallback, useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  X,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  Loader2,
} from "lucide-react";
import { getApiErrorMessage } from "../../../../lib/apiClient";
import { adminAssignmentsService } from "../../../../services/adminAssignments.service";
import { adminLecturersService } from "../../../../services/adminLecturers.service";
import { adminStudentsService } from "../../../../services/adminStudents.service";
import type { LecturerDto, StudentDto } from "../../../../types/api";

type LecturerOption = LecturerDto & { assignedCount: number };

interface AssignLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onSuccess?: () => void | Promise<void>;
}

export const AssignLecturerModal = ({
  isOpen,
  onClose,
  onShowToast,
  onSuccess,
}: AssignLecturerModalProps) => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [lecturers, setLecturers] = useState<LecturerOption[]>([]);
  const [assignedStudentIds, setAssignedStudentIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {


    setIsLoading(true);
    try {
      const [studentRows, lecturerRows] = await Promise.all([
        adminStudentsService.getAll(),
        adminLecturersService.getAll(),
      ]);

      const assignmentGroups = await Promise.all(
        lecturerRows.map((l) =>
          adminAssignmentsService.getByLecturer(l.id).catch(() => []),
        ),
      );

      const assignedIds = new Set<string>();
      const lecturerOptions: LecturerOption[] = lecturerRows.map((l, idx) => {
        const group = assignmentGroups[idx] ?? [];
        for (const item of group) assignedIds.add(item.studentId);
        return { ...l, assignedCount: group.length };
      });

      setStudents(studentRows);
      setLecturers(lecturerOptions);
      setAssignedStudentIds(assignedIds);
      setSelectedLecturerId(lecturerOptions[0]?.id ?? "");
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedStudentIds([]);
    setSearchStudent("");
    void loadData();
  }, [isOpen, loadData]);

  const unassignedStudents = useMemo(
    () => students.filter((s) => !assignedStudentIds.has(s.id)),
    [students, assignedStudentIds],
  );

  const filteredStudents = useMemo(() => {
    const q = searchStudent.trim().toLowerCase();
    if (!q) return unassignedStudents;
    return unassignedStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        (s.class ?? "").toLowerCase().includes(q),
    );
  }, [unassignedStudents, searchStudent]);

  if (!isOpen) return null;

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((stId) => stId !== id) : [...prev, id],
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    const allSelected = filteredIds.every((id) =>
      selectedStudentIds.includes(id),
    );
    if (allSelected) {
      setSelectedStudentIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id)),
      );
    } else {
      setSelectedStudentIds((prev) => [
        ...prev.filter((id) => !filteredIds.includes(id)),
        ...filteredIds,
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      onShowToast("Vui lòng chọn ít nhất 1 sinh viên!");
      return;
    }
    if (!selectedLecturerId) {
      onShowToast("Vui lòng chọn giảng viên tiếp nhận!");
      return;
    }

    const lecturer = lecturers.find((l) => l.id === selectedLecturerId);
    if (!lecturer) return;



    setIsSubmitting(true);
    try {
      const result = await adminAssignmentsService.bulkAssign({
        lecturerId: selectedLecturerId,
        studentIds: selectedStudentIds,
      });

      if (result.failedCount > 0) {
        onShowToast(
          `Phân công một phần: ${result.assignedCount} thành công, ${result.failedCount} lỗi`,
        );
      } else {
        onShowToast(
          `Đã phân công ${result.assignedCount} sinh viên cho ${lecturer.fullName}!`,
        );
      }

      onClose();
      await onSuccess?.();
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentIds.includes(s.id));

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Phân công nhanh
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ghép sinh viên chưa có GVHD với giảng viên hướng dẫn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-10 flex flex-col items-center gap-2 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-xs font-medium">Đang tải danh sách…</p>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800">
                  1. Chọn sinh viên chưa phân công ({selectedStudentIds.length}{" "}
                  đã chọn) *
                </label>
                {filteredStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllFiltered}
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    {allFilteredSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Tìm theo tên, MSSV hoặc lớp…"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-md divide-y divide-slate-100 bg-slate-50/50 p-1 space-y-1">
                {filteredStudents.length === 0 ? (
                  <p className="p-4 text-center text-slate-400 font-medium italic">
                    {unassignedStudents.length === 0
                      ? "Tất cả sinh viên đã được phân công GVHD."
                      : "Không tìm thấy sinh viên khớp từ khóa."}
                  </p>
                ) : (
                  filteredStudents.map((st) => {
                    const isChecked = selectedStudentIds.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => handleToggleStudent(st.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isChecked ? "bg-emerald-50/80 border border-emerald-200" : "hover:bg-slate-100 bg-white border border-transparent"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStudent(st.id);
                            }}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">
                                {st.fullName}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-slate-500">
                                ({st.studentCode})
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {st.class ?? "—"} • {st.major ?? "—"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isChecked ? "bg-emerald-200 text-emerald-900" : "bg-slate-100 text-slate-500"}`}
                        >
                          {isChecked ? "Đã chọn" : "Chưa chọn"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-800">
                2. Chọn giảng viên tiếp nhận *
              </label>
              <select
                value={selectedLecturerId}
                onChange={(e) => setSelectedLecturerId(e.target.value)}
                disabled={lecturers.length === 0}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 disabled:opacity-60"
              >
                {lecturers.length === 0 ? (
                  <option value="">Chưa có giảng viên</option>
                ) : (
                  lecturers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} (đang hướng dẫn {l.assignedCount} SV)
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="p-3 bg-emerald-50 rounded-md border border-emerald-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-[11px] text-emerald-800 font-medium">
                Sau khi xác nhận, {selectedStudentIds.length} sinh viên sẽ được
                gán cho giảng viên đã chọn và lưu vào hệ thống.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  selectedStudentIds.length === 0 ||
                  !selectedLecturerId
                }
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting
                    ? "Đang phân công…"
                    : `Phân công ${selectedStudentIds.length} sinh viên`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
