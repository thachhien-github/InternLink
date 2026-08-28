import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiClient";
import {
  buildAssignmentMaps,
  mapStudentDtoToRow,
} from "../lib/adminMappers";
import { adminAssignmentsService } from "../services/adminAssignments.service";
import { adminLecturersService } from "../services/adminLecturers.service";
import { adminStudentsService } from "../services/adminStudents.service";
import { adminUsersService } from "../services/adminUsers.service";

export type AdminStudentRow = ReturnType<typeof mapStudentDtoToRow>;

export function useAdminStudentsPage(
  semesterId?: string | null,
  onError?: (msg: string) => void,
) {
  const [students, setStudents] = useState<AdminStudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentRows, lecturerRows, usersPage] = await Promise.all([
        adminStudentsService.getAll(),
        adminLecturersService.getAll(),
        adminUsersService.getAll({ take: 500, role: "Student" }),
      ]);

      const assignmentGroups = await Promise.all(
        lecturerRows.map((l) =>
          adminAssignmentsService
            .getByLecturer(l.id, semesterId ?? undefined)
            .catch(() => []),
        ),
      );

      const { studentAssignment } = buildAssignmentMaps(
        lecturerRows,
        assignmentGroups,
      );

      const usersById = new Map(
        usersPage.items.map((u) => [u.id, u]),
      );

      setStudents(
        studentRows.map((s) => {
          const assignment = studentAssignment.get(s.id);
          const user = s.userId ? usersById.get(s.userId) ?? null : null;
          return mapStudentDtoToRow(s, {
            assignment: assignment
              ? {
                  lecturerName: assignment.lecturerName,
                  companyName: assignment.companyName,
                  status: assignment.status,
                }
              : undefined,
            user,
          });
        }),
      );
    } catch (err) {
      onError?.(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [semesterId, onError]);

  useEffect(() => {
    void load();
  }, [load]);

  return { students, setStudents, isLoading, reload: load };
}
