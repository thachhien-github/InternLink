import type { Student } from "../types/student";
import { INITIAL_STUDENTS } from "../data/mockData";
import { USE_MOCK } from "../config/env";
import { adminStudentsService } from "./adminStudents.service";
import { mapStudentDtoToStudent } from "../lib/adminMappers";

let studentsData: Student[] = [...INITIAL_STUDENTS];

export const studentService = {
  async getStudents(lecturerFilter?: string): Promise<Student[]> {
    if (!USE_MOCK) {
      try {
        const rows = await adminStudentsService.getAll();
        if (rows.length > 0) {
          const mapped = rows.map(mapStudentDtoToStudent);
          if (!lecturerFilter || lecturerFilter === "Tất cả") {
            return mapped;
          }
          return mapped.filter((s) => s.lecturer === lecturerFilter);
        }
      } catch (err) {
        console.warn("studentService.getStudents API fallback:", err);
      }
    }
    if (!lecturerFilter || lecturerFilter === "Tất cả") {
      return [...studentsData];
    }
    return studentsData.filter((s) => s.lecturer === lecturerFilter);
  },

  async getStudentById(id: string): Promise<Student | undefined> {
    if (!USE_MOCK) {
      try {
        const row = await adminStudentsService.getById(id);
        if (row) return mapStudentDtoToStudent(row);
      } catch (err) {
        console.warn("studentService.getStudentById API fallback:", err);
      }
    }
    return studentsData.find((s) => s.id === id || s.mssv === id);
  },

  async addStudent(newStudent: Student): Promise<Student> {
    studentsData = [newStudent, ...studentsData];
    return newStudent;
  },

  async updateStudent(
    id: string,
    updates: Partial<Student>,
  ): Promise<Student | null> {
    const idx = studentsData.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    studentsData[idx] = { ...studentsData[idx], ...updates };
    return studentsData[idx];
  },
};

