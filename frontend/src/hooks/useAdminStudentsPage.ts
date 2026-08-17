import { useCallback, useEffect, useState } from "react";
import { USE_MOCK } from "../config/env";
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

export function useAdminStudentsPage(onError?: (msg: string) => void) {
  const [students, setStudents] = useState<AdminStudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK);

  const load = useCallback(async () => {
    if (USE_MOCK) return;

    setIsLoading(true);
    try {
      const [studentRows, lecturerRows, usersPage] = await Promise.all([
        adminStudentsService.getAll(),
        adminLecturersService.getAll(),
        adminUsersService.getAll({ take: 500, role: "Student" }),
      ]);

      const assignmentGroups = await Promise.all(
        lecturerRows.map((l) =>
          adminAssignmentsService.getByLecturer(l.id).catch(() => []),
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
  }, [onError]);

  useEffect(() => {
    void load();
  }, [load]);

  return { students, setStudents, isLoading, reload: load };
}
