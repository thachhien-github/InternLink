import type { Student } from "../types/student";
import { adminStudentsService } from "./adminStudents.service";
import { mapStudentDtoToStudent } from "../lib/adminMappers";

export const studentService = {
  async getStudents(lecturerFilter?: string): Promise<Student[]> {
    const rows = await adminStudentsService.getAll();
    const mapped = rows.map(mapStudentDtoToStudent);
    if (!lecturerFilter || lecturerFilter === "Tất cả") {
      return mapped;
    }
    return mapped.filter((s) => s.lecturer === lecturerFilter);
  },

  async getStudentById(id: string): Promise<Student | undefined> {
    const row = await adminStudentsService.getById(id);
    if (row) return mapStudentDtoToStudent(row);
    return undefined;
  },
};

