import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { adminSemestersService, type BackendSemesterDto } from "../services/adminSemesters.service";
import { adminStudentsService } from "../services/adminStudents.service";
import { adminLecturersService } from "../services/adminLecturers.service";
import { adminCompaniesService } from "../services/adminCompanies.service";

export interface Semester {
  id: string;
  name: string;
  term: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  lecturersCount: number;
  studentsCount: number;
  placedStudents: number;
  companiesCount: number;
  status: "active" | "upcoming" | "completed" | "draft";
  progressPercent: number;
  currentPhase: string;
  description: string;
}

const DEFAULT_SEMESTERS: Semester[] = [];

const mapBackendToFrontend = (dto: BackendSemesterDto): Semester => {
  const statusMap: Record<number, Semester["status"]> = {
    0: "upcoming",
    1: "active",
    2: "completed",
    3: "draft",
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return d;
    }
  };

  return {
    id: dto.id,
    name: dto.name,
    term: dto.term,
    academicYear: dto.academicYear,
    startDate: formatDate(dto.startDate),
    endDate: formatDate(dto.endDate),
    lecturersCount: dto.lecturersCount,
    studentsCount: dto.studentsCount,
    placedStudents: dto.placedStudents,
    companiesCount: dto.companiesCount,
    status: statusMap[dto.status] || "upcoming",
    progressPercent: dto.progressPercent,
    currentPhase: dto.currentPhase,
    description: dto.description || "",
  };
};

interface SemesterContextType {
  semesters: Semester[];
  selectedSemesterId: string;
  selectedSemester: Semester;
  selectSemester: (id: string) => void;
  createSemester: (data: Partial<Semester> & { name: string; term: string; academicYear: string }) => Promise<void>;
  closeSemester: (id: string, onShowToast?: (msg: string) => void) => Promise<void>;
  duplicateSemester: (sem: Semester, onShowToast?: (msg: string) => void) => void;
  refreshApiCounts: () => Promise<void>;
}

const SemesterContext = createContext<SemesterContextType | undefined>(undefined);

export const SemesterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [semesters, setSemesters] = useState<Semester[]>(DEFAULT_SEMESTERS);

  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");

  const refreshApiCounts = useCallback(async () => {
    try {
      // 1. Try to fetch from real backend Semesters API
      const backendSemesters = await adminSemestersService.getAll().catch(() => null);
      if (Array.isArray(backendSemesters) && backendSemesters.length > 0) {
        const mapped = backendSemesters.map(mapBackendToFrontend);
        setSemesters(mapped);
        return;
      }

      // 2. Fallback: Aggregate counts from student/lecturer/company APIs
      const [studentsRes, lecturersRes, companiesRes] = await Promise.all([
        adminStudentsService.getAll(0, 500).catch(() => null),
        adminLecturersService.getAll(0, 500).catch(() => null),
        adminCompaniesService.getAll(0, 500).catch(() => null),
      ]);

      const totalStudents = Array.isArray(studentsRes) ? studentsRes.length : 0;
      const totalLecturers = Array.isArray(lecturersRes) ? lecturersRes.length : 0;
      const totalCompanies = Array.isArray(companiesRes) ? companiesRes.length : 0;
      const placed = Array.isArray(studentsRes)
        ? studentsRes.filter((s) => s.lecturerName && s.lecturerName !== "—").length
        : 0;

      setSemesters((prev) =>
        prev.map((s, idx) =>
          idx === 0
            ? {
                ...s,
                studentsCount: totalStudents,
                lecturersCount: totalLecturers,
                companiesCount: totalCompanies,
                placedStudents: placed,
              }
            : s,
        ),
      );
    } catch (err) {
      console.warn("Error refreshing semester API counts:", err);
    }
  }, []);

  useEffect(() => {
    refreshApiCounts();
  }, [refreshApiCounts]);

  useEffect(() => {
    try {
      localStorage.setItem("internlink_admin_semesters", JSON.stringify(semesters));
    } catch {}
  }, [semesters]);

  useEffect(() => {
    try {
      localStorage.setItem("internlink_admin_selected_semester_id", selectedSemesterId);
    } catch {}
  }, [selectedSemesterId]);

  const selectedSemester =
    semesters.find((s) => s.id === selectedSemesterId) ||
    semesters.find((s) => s.status === "active") ||
    semesters[0] ||
    {
      id: "",
      name: "Đang tải…",
      term: "",
      academicYear: "",
      startDate: "",
      endDate: "",
      lecturersCount: 0,
      studentsCount: 0,
      placedStudents: 0,
      companiesCount: 0,
      status: "upcoming" as const,
      progressPercent: 0,
      currentPhase: "",
      description: "",
    };

  const selectSemester = (id: string) => {
    setSelectedSemesterId(id);
  };

  const createSemester = async (data: Partial<Semester> & { name: string; term: string; academicYear: string }) => {
    const statusNumber = data.status === "active" ? 1 : data.status === "completed" ? 2 : data.status === "draft" ? 3 : 0;


    try {
      const res = await adminSemestersService.create({
        name: data.name,
        term: data.term,
        academicYear: data.academicYear,
        status: statusNumber,
        description: data.description,
      });
      const mapped = mapBackendToFrontend(res);
      setSemesters((prev) => [mapped, ...prev]);
      setSelectedSemesterId(mapped.id);
      return;
    } catch (err) {
      console.warn("Backend create semester failed, falling back to local state:", err);
    }


    const newSem: Semester = {
      id: `sem-${Date.now()}`,
      name: data.name,
      term: data.term,
      academicYear: data.academicYear,
      startDate: data.startDate || "01/09/2026",
      endDate: data.endDate || "15/12/2026",
      lecturersCount: data.lecturersCount || 0,
      studentsCount: data.studentsCount || 0,
      placedStudents: 0,
      companiesCount: 0,
      status: data.status || "upcoming",
      progressPercent: 0,
      currentPhase: data.currentPhase || "Chuẩn bị danh sách",
      description: data.description || `Đợt thực tập ${data.term} ${data.academicYear}`,
    };
    setSemesters((prev) => [newSem, ...prev]);
    setSelectedSemesterId(newSem.id);
  };

  const closeSemester = async (id: string, onShowToast?: (msg: string) => void) => {
    let closedName = "";


    try {
      await adminSemestersService.close(id);
    } catch (err) {
      console.warn("Backend close semester call failed, updating local state:", err);
    }


    const updated = semesters.map((s) => {
      if (s.id === id) {
        closedName = s.name;
        return {
          ...s,
          status: "completed" as const,
          progressPercent: 100,
          currentPhase: "Đã hoàn thành & Khóa dữ liệu",
        };
      }
      return s;
    });

    setSemesters(updated);

    // Auto-switch to next active or upcoming semester
    const next =
      updated.find((s) => s.status === "active") ||
      updated.find((s) => s.status === "upcoming");
    if (next) {
      setSelectedSemesterId(next.id);
    }

    if (onShowToast) {
      onShowToast(`Đã đóng kỳ thực tập: "${closedName}". Tài khoản sinh viên đợt này đã chuyển sang chế độ Lưu trữ.`);
    }
  };

  const duplicateSemester = (sem: Semester, onShowToast?: (msg: string) => void) => {
    const duplicated: Semester = {
      ...sem,
      id: `sem-dup-${Date.now()}`,
      name: `${sem.name} (Bản sao)`,
      status: "upcoming",
      progressPercent: 0,
      currentPhase: "Mới sao chép",
    };
    setSemesters((prev) => [duplicated, ...prev]);
    if (onShowToast) {
      onShowToast(`Đã sao chép kỳ thực tập: "${sem.name}"`);
    }
  };

  return (
    <SemesterContext.Provider
      value={{
        semesters,
        selectedSemesterId,
        selectedSemester,
        selectSemester,
        createSemester,
        closeSemester,
        duplicateSemester,
        refreshApiCounts,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};

export const useSemester = (): SemesterContextType => {
  const context = useContext(SemesterContext);
  if (!context) {
    throw new Error("useSemester must be used within a SemesterProvider");
  }
  return context;
};
