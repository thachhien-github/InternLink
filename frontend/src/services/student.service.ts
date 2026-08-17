import type { Student } from "../types/student";
import { INITIAL_STUDENTS } from "../data/mockData";

let studentsData: Student[] = [...INITIAL_STUDENTS];

export const studentService = {
  async getStudents(lecturerFilter?: string): Promise<Student[]> {
    if (!lecturerFilter || lecturerFilter === "Tất cả") {
      return [...studentsData];
    }
    return studentsData.filter((s) => s.lecturer === lecturerFilter);
  },

  async getStudentById(id: string): Promise<Student | undefined> {
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
