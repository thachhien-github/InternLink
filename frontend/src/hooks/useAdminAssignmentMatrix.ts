import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiClient";
import {
  buildAssignmentMaps,
  mapLecturerDtoToAssignmentRow,
  mapStudentDtoToAssignmentRow,
} from "../lib/adminMappers";
import { adminAssignmentsService } from "../services/adminAssignments.service";
import { adminLecturersService } from "../services/adminLecturers.service";
import { adminStudentsService } from "../services/adminStudents.service";

export type AssignmentLecturerRow = ReturnType<
  typeof mapLecturerDtoToAssignmentRow
>;
export type AssignmentStudentRow = ReturnType<
  typeof mapStudentDtoToAssignmentRow
>;

export function useAdminAssignmentMatrix(
  enabled: boolean,
  semesterId?: string | null,
  onError?: (msg: string) => void,
) {
  const [lecturers, setLecturers] = useState<AssignmentLecturerRow[]>([]);
  const [students, setStudents] = useState<AssignmentStudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [selectedLecturerId, setSelectedLecturerId] = useState<string | null>(
    null,
  );

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const [lecturerDtos, studentDtos] = await Promise.all([
        adminLecturersService.getAll(),
        adminStudentsService.getAll(),
      ]);

      const assignmentGroups = await Promise.all(
        lecturerDtos.map((l) =>
          adminAssignmentsService
            .getByLecturer(l.id, semesterId ?? undefined)
            .catch(() => []),
        ),
      );

      const { studentAssignment, lecturerCounts } = buildAssignmentMaps(
        lecturerDtos,
        assignmentGroups,
      );

      const lecturerRows = lecturerDtos.map((l) =>
        mapLecturerDtoToAssignmentRow(l, lecturerCounts.get(l.id) ?? 0),
      );

      const studentRows = studentDtos.map((s) =>
        mapStudentDtoToAssignmentRow(s, studentAssignment.get(s.id)),
      );

      setLecturers(lecturerRows);
      setStudents(studentRows);
      setSelectedLecturerId((prev) => {
        if (prev && lecturerRows.some((l) => l.id === prev)) return prev;
        return lecturerRows[0]?.id ?? null;
      });
    } catch (err) {
      onError?.(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, semesterId, onError]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    lecturers,
    students,
    setLecturers,
    setStudents,
    isLoading,
    selectedLecturerId,
    setSelectedLecturerId,
    reload: load,
  };
}
