import { useState, useMemo, useEffect, useCallback } from "react";
import { Toast } from "../../../components/common/Toast";
import { PageHeader } from "../../../components/common/PageHeader";
import { Toolbar } from "../../../components/common/Toolbar";
import { Panel } from "../../../components/common/Panel";
import { EvaluationWorkspace } from "./EvaluationWorkspace";
import { RubricEvaluation } from "./RubricEvaluation";
import { EvaluationDetail } from "./EvaluationDetail";
import { EvaluationPdfModal } from "./EvaluationPdfModal";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapEvaluationListItemToUi } from "../../../lib/portalMappers";
import { evaluationService } from "../../../services/evaluation.service";
import {
  Award,
  Search,
  Download,
  CheckCircle2,
  Clock,
  FileText,
  Edit3,
  Eye,
  Sparkles,
  BarChart2,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  GraduationCap,
  PieChart,
  Save,
  Sliders,
} from "lucide-react";
const INITIAL_EVALUATIONS = [
  {
    id: "eval-1",
    name: "Nguy\u1EC5n V\u0103n An",
    mssv: "20210001",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    class: "CNTT-K15A",
    major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
    company: "FPT Software",
    supervisor: "Nguy\u1EC5n V\u0103n H\u1EA3i (Mentor)",
    progress: 100,
    enterpriseScore: 9.2,
    lecturerScore: 9,
    presentationScore: 9.5,
    totalScore: 9.2,
    status: "Hoàn thành",
    weeklyReportCount: "6/6",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments:
      "Sinh viên hoàn thành xuất sắc đề tài, thái độ làm việc tại FPT rất chuyên nghiệp.",
    gradeClassification: "Xuất sắc",
  },
  {
    id: "eval-2",
    name: "Trần Thị Bình",
    mssv: "20210002",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    class: "CNTT-K15B",
    major: "Khoa học Dữ liệu",
    company: "Viettel Telecom",
    supervisor: "Đặng Minh Khôi (Tech Lead)",
    progress: 100,
    enterpriseScore: 9.5,
    lecturerScore: 9.3,
    presentationScore: 9,
    totalScore: 9.3,
    status: "Hoàn thành",
    weeklyReportCount: "6/6",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments:
      "Báo cáo Data Pipeline xuất sắc, được DN đánh giá cao và giữ lại làm chính thức.",
    gradeClassification: "Xuất sắc",
  },
  {
    id: "eval-3",
    name: "Lê Hoàng Cường",
    mssv: "20210003",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    class: "HTTT-K15",
    major: "Hệ thống Thông tin",
    company: "VNG Corporation",
    supervisor: "Phạm Tuấn Anh (DevOps Lead)",
    progress: 92,
    enterpriseScore: 8.5,
    lecturerScore: 8,
    presentationScore: 8.5,
    totalScore: 8.3,
    status: "Đang chấm",
    weeklyReportCount: "5/6",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments:
      "Đang rà soát lại phần trình bày kiến trúc Cloud Infrastructure.",
    gradeClassification: "Giỏi",
  },
  {
    id: "eval-4",
    name: "Phạm Minh Đức",
    mssv: "20210004",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    class: "CNTT-K15A",
    major: "Kỹ thuật Phần mềm",
    company: "MISA Joint Stock Co.",
    supervisor: "Lê Thu Trang (HR Manager)",
    progress: 100,
    enterpriseScore: 8.8,
    lecturerScore: 8.5,
    presentationScore: 8.8,
    totalScore: 8.7,
    status: "Hoàn thành",
    weeklyReportCount: "6/6",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments:
      "Đáp ứng tốt các chuẩn kỹ năng cơ bản, báo cáo trình bày mạch lạc.",
    gradeClassification: "Giỏi",
  },
  {
    id: "eval-5",
    name: "Đỗ Thị Giang",
    mssv: "20210005",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    class: "CNTT-K15B",
    major: "An toàn Thông tin",
    company: "VNPT IT",
    supervisor: "Hoàng Văn Nam (SecOps)",
    progress: 80,
    enterpriseScore: 8,
    lecturerScore: null,
    presentationScore: null,
    totalScore: null,
    status: "Chưa chấm",
    weeklyReportCount: "6/6",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments: "",
    gradeClassification: void 0,
  },
  {
    id: "eval-6",
    name: "Vũ Quốc Huy",
    mssv: "20210006",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    class: "HTTT-K15",
    major: "Hệ thống Thông tin",
    company: "Techcombank",
    supervisor: "Ngô Thanh Sơn (Solution Arch)",
    progress: 75,
    enterpriseScore: null,
    lecturerScore: null,
    presentationScore: null,
    totalScore: null,
    status: "Chưa chấm",
    weeklyReportCount: "4/6",
    finalReportSubmitted: false,
    enterpriseFeedbackSubmitted: false,
    lecturerComments: "",
    gradeClassification: void 0,
  },
  {
    id: "eval-7",
    name: "Hoàng Thị Khánh",
    mssv: "20210007",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    class: "CNTT-K15A",
    major: "Kỹ thuật Phần mềm",
    company: "CMC Global",
    supervisor: "Bùi Đức Anh (PM)",
    progress: 100,
    enterpriseScore: 9,
    lecturerScore: 9.2,
    presentationScore: 9,
    totalScore: 9.1,
    status: "Hoàn thành",
    weeklyReportCount: "6/6",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments:
      "Đề tài tích hợp AI vào quy trình thử nghiệm tự động rất ấn tượng.",
    gradeClassification: "Xuất sắc",
  },
  {
    id: "eval-8",
    name: "Bùi Anh Long",
    mssv: "20210008",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    class: "CNTT-K15B",
    major: "Khoa học Dữ liệu",
    company: "MB Bank",
    supervisor: "Vũ Thị Hồng (Senior Analyst)",
    progress: 60,
    enterpriseScore: 5.5,
    lecturerScore: 4.5,
    presentationScore: 5,
    totalScore: 5,
    status: "Hoàn thành",
    weeklyReportCount: "2/6",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments:
      "Nghỉ quá số buổi qui định, báo cáo sơ sài không đủ tiêu chuẩn.",
    gradeClassification: "Không đạt",
  },
];
export const EvaluationDashboard = () => {
  const [evaluations, setEvaluations] = useState(INITIAL_EVALUATIONS);
  const [isLoadingApi, setIsLoadingApi] = useState(!USE_MOCK);
  const [isAiWidgetExpanded, setIsAiWidgetExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("HK I - 2026");
  const [classFilter, setClassFilter] = useState("T\u1EA5t c\u1EA3");
  const [enterpriseFilter, setEnterpriseFilter] = useState("T\u1EA5t c\u1EA3");
  const [statusFilter, setStatusFilter] = useState("T\u1EA5t c\u1EA3");
  const [rubricStudent, setRubricStudent] = useState(null);
  const [workspaceStudent, setWorkspaceStudent] = useState(null);
  const [activeGradingStudent, setActiveGradingStudent] = useState(null);
  const [activeSheetStudent, setActiveSheetStudent] = useState(null);
  const [activeDetailStudent, setActiveDetailStudent] = useState(null);
  const [activePdfStudent, setActivePdfStudent] = useState<any>(null);
  const [gradeInput, setGradeInput] = useState({
    enterprise: 8.5,
    lecturer: 8.5,
    presentation: 8.5,
    comments: "",
  });
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };

  const refreshEvaluations = useCallback(async () => {
    const rows = await evaluationService.list();
    setEvaluations(rows.map(mapEvaluationListItemToUi));
  }, []);

  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      setIsLoadingApi(true);
      try {
        const rows = await evaluationService.list();
        if (!cancelled) {
          setEvaluations(rows.map(mapEvaluationListItemToUi));
        }
      } catch (err) {
        if (!cancelled) showToast(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoadingApi(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mssv.includes(searchQuery);
      const matchesClass =
        classFilter === "T\u1EA5t c\u1EA3" || item.class === classFilter;
      const matchesEnterprise =
        enterpriseFilter === "T\u1EA5t c\u1EA3" ||
        item.company === enterpriseFilter;
      let matchesStatus = true;
      if (statusFilter === "\u0110\xE3 ch\u1EA5m") {
        matchesStatus = item.status === "Ho\xE0n th\xE0nh";
      } else if (statusFilter === "Ch\u01B0a ch\u1EA5m") {
        matchesStatus =
          item.status === "Ch\u01B0a ch\u1EA5m" ||
          item.status === "\u0110ang ch\u1EA5m";
      }
      return (
        matchesSearch && matchesClass && matchesEnterprise && matchesStatus
      );
    });
  }, [evaluations, searchQuery, classFilter, enterpriseFilter, statusFilter]);
  const totalPages = Math.ceil(filteredEvaluations.length / pageSize) || 1;
  const paginatedEvaluations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvaluations.slice(start, start + pageSize);
  }, [filteredEvaluations, currentPage, pageSize]);
  const totalStudents = evaluations.length;
  const gradedCount = evaluations.filter(
    (e) => e.status === "Ho\xE0n th\xE0nh",
  ).length;
  const ungradedCount = evaluations.filter(
    (e) =>
      e.status === "Ch\u01B0a ch\u1EA5m" || e.status === "\u0110ang ch\u1EA5m",
  ).length;
  const gradedStudentsList = evaluations.filter((e) => e.totalScore !== null);
  const avgScore =
    gradedStudentsList.length > 0
      ? (
          gradedStudentsList.reduce(
            (acc, curr) => acc + (curr.totalScore || 0),
            0,
          ) / gradedStudentsList.length
        ).toFixed(1)
      : "0.0";
  const excellentCount = evaluations.filter(
    (e) => e.gradeClassification === "Xu\u1EA5t s\u1EAFc",
  ).length;
  const failedCount = evaluations.filter(
    (e) => e.gradeClassification === "Kh\xF4ng \u0111\u1EA1t",
  ).length;
  const distribution = {
    excellent: evaluations.filter((e) => e.totalScore && e.totalScore >= 9)
      .length,
    good: evaluations.filter(
      (e) => e.totalScore && e.totalScore >= 8 && e.totalScore < 9,
    ).length,
    fair: evaluations.filter(
      (e) => e.totalScore && e.totalScore >= 6.5 && e.totalScore < 8,
    ).length,
    average: evaluations.filter(
      (e) => e.totalScore && e.totalScore >= 5 && e.totalScore < 6.5,
    ).length,
    failed: evaluations.filter((e) => e.totalScore && e.totalScore < 5).length,
  };
  const topScorers = useMemo(() => {
    return [...evaluations]
      .filter((e) => e.totalScore !== null)
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
      .slice(0, 5);
  }, [evaluations]);
  const ungradedList = useMemo(() => {
    return evaluations.filter((e) => e.status !== "Ho\xE0n th\xE0nh");
  }, [evaluations]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportScope, setExportScope] = useState("all");
  const executeExportExcel = (targetList) => {
    const headers = [
      "STT",
      "M\xE3 s\u1ED1 SV",
      "H\u1ECD v\xE0 t\xEAn",
      "L\u1EDBp",
      "Ng\xE0nh h\u1ECDc",
      "Doanh nghi\u1EC7p th\u1EF1c t\u1EADp",
      "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      "S\u1ED1 b\xE1o c\xE1o tu\u1EA7n",
      "\u0110i\u1EC3m DN (40%)",
      "\u0110i\u1EC3m GV (40%)",
      "\u0110i\u1EC3m B\u1EA3o v\u1EC7 (20%)",
      "\u0110i\u1EC3m T\u1ED5ng k\u1EBFt",
      "X\u1EBFp lo\u1EA1i",
      "Tr\u1EA1ng th\xE1i",
      "Nh\u1EADn x\xE9t / Ghi ch\xFA",
    ];
    const rows = targetList.map((item, idx) => [
      idx + 1,
      `"${item.mssv}"`,
      `"${item.name}"`,
      `"${item.class}"`,
      `"${item.major}"`,
      `"${item.company}"`,
      `"${item.supervisor}"`,
      `"${item.weeklyReportCount}"`,
      item.enterpriseScore !== null ? item.enterpriseScore : "",
      item.lecturerScore !== null ? item.lecturerScore : "",
      item.presentationScore !== null ? item.presentationScore : "",
      item.totalScore !== null ? item.totalScore : "",
      `"${item.gradeClassification || "Ch\u01B0a x\u1EBFp lo\u1EA1i"}"`,
      `"${item.status}"`,
      `"${(item.lecturerComments || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [
      "\uFEFF" + headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bang_Diem_Tong_Hop_Thuc_Tap_HK1_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleExportTranscript = () => {
    setShowExportModal(true);
  };
  const handleConfirmDownloadExcel = () => {
    let targetList = evaluations;
    if (exportScope === "filtered") {
      targetList = filteredEvaluations;
    } else if (exportScope === "graded") {
      targetList = evaluations.filter((e) => e.status === "Ho\xE0n th\xE0nh");
    }
    executeExportExcel(targetList);
    setShowExportModal(false);
    showToast(
      `\u0110\xE3 t\u1EA3i xu\u1ED1ng file Excel B\u1EA3ng \u0111i\u1EC3m t\u1ED5ng h\u1EE3p (${targetList.length} sinh vi\xEAn)!`,
    );
  };
  const handleOpenGrading = (student) => {
    setWorkspaceStudent(student);
  };
  const handleSaveGrade = async () => {
    if (!activeGradingStudent) return;
    const total = parseFloat(
      (
        gradeInput.enterprise * 0.4 +
        gradeInput.lecturer * 0.4 +
        gradeInput.presentation * 0.2
      ).toFixed(1),
    );
    let classification = "Khá";
    if (total >= 9) classification = "Xuất sắc";
    else if (total >= 8) classification = "Giỏi";
    else if (total >= 6.5) classification = "Khá";
    else if (total >= 5) classification = "Trung bình";
    else classification = "Không đạt";

    if (!USE_MOCK) {
      try {
        await evaluationService.persistFromUi(
          {
            id: activeGradingStudent.id,
            internshipId: activeGradingStudent.internshipId,
            enterpriseScore: gradeInput.enterprise,
            lecturerScore: gradeInput.lecturer,
            presentationScore: gradeInput.presentation,
            lecturerComments: gradeInput.comments,
          },
          true,
        );
        await refreshEvaluations();
        showToast(
          `Đã lưu & chốt điểm cho ${activeGradingStudent.name} (${total} điểm)`,
        );
        setActiveGradingStudent(null);
        return;
      } catch (err) {
        showToast(getApiErrorMessage(err));
        return;
      }
    }

    setEvaluations((prev) =>
      prev.map((item) =>
        item.id === activeGradingStudent.id
          ? {
              ...item,
              enterpriseScore: gradeInput.enterprise,
              lecturerScore: gradeInput.lecturer,
              presentationScore: gradeInput.presentation,
              totalScore: total,
              status: "Hoàn thành",
              lecturerComments: gradeInput.comments,
              gradeClassification: classification,
            }
          : item,
      ),
    );
    showToast(
      `Đã lưu điểm thành công cho sinh viên ${activeGradingStudent.name} (${total} điểm)`,
    );
    setActiveGradingStudent(null);
  };
  if (rubricStudent) {
    return (
      <RubricEvaluation
        student={rubricStudent}
        onBack={() => setRubricStudent(null)}
        onSave={async (data) => {
          if (!USE_MOCK) {
            try {
              await evaluationService.persistFromUi(
                {
                  id: data.studentId,
                  internshipId: rubricStudent.internshipId,
                  lecturerScore: data.finalScore,
                  enterpriseScore: data.finalScore,
                  presentationScore: data.finalScore,
                },
                true,
              );
              await refreshEvaluations();
            } catch (err) {
              showToast(getApiErrorMessage(err));
              return;
            }
          } else {
            setEvaluations((prev) =>
              prev.map((item) =>
                item.id === data.studentId
                  ? {
                      ...item,
                      lecturerScore: data.finalScore,
                      totalScore: data.finalScore,
                      status: "Hoàn thành",
                      gradeClassification: data.classification,
                    }
                  : item,
              ),
            );
          }
          setRubricStudent(null);
        }}
      />
    );
  }
  if (activeDetailStudent) {
    return (
      <EvaluationDetail
        student={activeDetailStudent}
        onBack={() => setActiveDetailStudent(null)}
        onEdit={(studentToEdit) => {
          setActiveDetailStudent(null);
          setWorkspaceStudent(studentToEdit);
        }}
      />
    );
  }
  if (workspaceStudent) {
    return (
      <EvaluationWorkspace
        student={workspaceStudent}
        onBack={() => setWorkspaceStudent(null)}
        onSave={async (updated) => {
          if (!USE_MOCK) {
            try {
              const finalize = updated.status === "Hoàn thành";
              await evaluationService.persistFromUi(
                {
                  id: updated.id,
                  internshipId: updated.internshipId,
                  enterpriseScore: updated.enterpriseScore,
                  lecturerScore: updated.lecturerScore,
                  presentationScore: updated.presentationScore,
                  lecturerComments: updated.lecturerComments,
                },
                finalize,
              );
              await refreshEvaluations();
            } catch (err) {
              showToast(getApiErrorMessage(err));
              return;
            }
          } else {
            setEvaluations((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item)),
            );
          }
          setWorkspaceStudent(null);
        }}
      />
    );
  }
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto animate-in fade-in duration-200 pb-16 font-sans">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <PageHeader
        icon={Award}
        title="Đánh giá & Chấm điểm Thực tập"
        subtitle="Tổng hợp kết quả, quản lý điểm số và chấm điểm theo tiêu chí thực tập sinh viên Khoa CNTT."
        badge="HK I - 2026"
        badgeColor="bg-blue-100 text-blue-800 border-blue-200"
        actions={[
          {
            label: "Tiêu chí đánh giá",
            icon: Sliders,
            onClick: () => setRubricStudent(evaluations[0]),
            variant: "secondary",
          },
          {
            label: "Xuất bảng điểm",
            icon: Download,
            onClick: handleExportTranscript,
            variant: "primary",
          },
        ]}
      />

      <Toolbar
        left={
          <p className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{totalStudents}</span> SV
            ·{" "}
            <span className="font-bold text-emerald-700">{gradedCount}</span> đã
            chấm ·{" "}
            <span className="font-bold text-amber-700">{ungradedCount}</span>{" "}
            chờ · TB{" "}
            <span className="font-bold text-sky-700">{avgScore}</span>/10
          </p>
        }
      />

      <Panel className="space-y-4">
        <div className="space-y-3">
        {/* Header Section Label */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
              Bộ lọc tìm kiếm &amp; Chấm điểm sinh viên
            </h2>
          </div>

          {(searchQuery ||
            classFilter !== "T\u1EA5t c\u1EA3" ||
            enterpriseFilter !== "T\u1EA5t c\u1EA3" ||
            statusFilter !== "T\u1EA5t c\u1EA3" ||
            semesterFilter !== "HK I - 2026") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSemesterFilter("HK I - 2026");
                setClassFilter("T\u1EA5t c\u1EA3");
                setEnterpriseFilter("T\u1EA5t c\u1EA3");
                setStatusFilter("T\u1EA5t c\u1EA3");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Filter inputs in 1 neat row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên sinh viên, MSSV..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
            />
          </div>

          <div>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="HK I - 2026">HK I - 2026 (Hiện tại)</option>
              <option value="HK II - 2025">HK II - 2025</option>
            </select>
          </div>

          <div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Tất cả Lớp</option>
              <option value="CNTT-K15A">CNTT-K15A</option>
              <option value="CNTT-K15B">CNTT-K15B</option>
              <option value="HTTT-K15">HTTT-K15</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Tất cả Trạng thái</option>
              <option value="Đã chấm">✅ Đã chấm hoàn tất</option>
              <option value="Chưa chấm">⏳ Chưa chấm / Đang chấm</option>
            </select>
          </div>
        </div>
        </div>

        {/* Evaluation table */}
        <div className="border border-slate-200/80 rounded-md overflow-hidden w-full">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Bảng kết quả chấm điểm thực tập</span>
              <span className="text-xs font-normal text-slate-400">
                ({filteredEvaluations.length} sinh viên)
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Sinh viên</th>
                  <th className="py-3.5 px-4">Doanh nghiệp &amp; Mentor</th>
                  <th className="py-3.5 px-3 text-center">Báo cáo tuần (20%)</th>
                  <th className="py-3.5 px-3 text-center">Đ. Doanh nghiệp (30%)</th>
                  <th className="py-3.5 px-3 text-center">Báo cáo &amp; SP (30%)</th>
                  <th className="py-3.5 px-3 text-center">Đ. Tổng</th>
                  <th className="py-3.5 px-3">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {paginatedEvaluations.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    {/* Avatar & Student info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            item.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          }
                          alt={item.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {item.mssv} • {item.class}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company & Mentor */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 line-clamp-1">
                        {item.company}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {item.supervisor}
                      </p>
                    </td>

                    {/* Báo cáo tuần (20%) */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-800 text-[11px]">
                          {item.weeklyReportCount || "12/12"} tuần
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${item.progress === 100 ? "bg-emerald-500" : item.progress >= 80 ? "bg-blue-600" : "bg-amber-500"}`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Điểm Doanh nghiệp (30%) */}
                    <td className="py-3.5 px-3 text-center font-bold">
                      {item.enterpriseScore !== null ? (
                        <span className="text-blue-700 font-mono font-bold text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {item.enterpriseScore}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic text-[10px]">
                          Chưa có
                        </span>
                      )}
                    </td>

                    {/* Điểm Báo cáo & SP (30%) */}
                    <td className="py-3.5 px-3 text-center font-bold">
                      {item.lecturerScore !== null ? (
                        <span className="text-purple-700 font-mono font-bold text-xs bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          {item.lecturerScore}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic text-[10px]">
                          Chưa chấm
                        </span>
                      )}
                    </td>

                    {/* Điểm Tổng */}
                    <td className="py-3.5 px-3 text-center">
                      {item.totalScore !== null ? (
                        <span
                          className={`font-bold text-xs px-2.5 py-1 rounded-lg font-mono ${item.totalScore >= 9 ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : item.totalScore >= 8 ? "bg-blue-100 text-blue-900 border border-blue-200" : item.totalScore >= 5 ? "bg-sky-100 text-sky-900 border border-sky-200" : "bg-rose-100 text-rose-900 border border-rose-200"}`}
                        >
                          {item.totalScore}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px]">--</span>
                      )}
                    </td>

                    {/* Status Chip */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-1 font-bold text-[10px] rounded-full inline-flex items-center gap-1 border ${item.status === "Ho\xE0n th\xE0nh" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : item.status === "\u0110ang ch\u1EA5m" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveDetailStudent(item)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"
                          title="Chi tiết sinh viên & điểm số"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenGrading(item)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors border border-blue-200"
                          title="Chấm điểm trực tiếp"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setRubricStudent(item)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-md transition-colors border border-slate-200"
                          title="Khung 4 trụ cột chuẩn hóa"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setActiveSheetStudent(item)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                          title="Phiếu đánh giá chi tiết"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setActivePdfStudent(item)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors border border-blue-200"
                          title="In / Xuất phiếu đánh giá chuẩn PDF"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-600">
              <span>Hiển thị tối đa:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
              >
                <option value={10}>10 dòng/trang</option>
                <option value={20}>20 dòng/trang</option>
                <option value={50}>50 dòng/trang</option>
              </select>
              <span className="text-slate-400 font-normal">
                (Hiển thị{" "}
                {Math.min(
                  (currentPage - 1) * pageSize + 1,
                  filteredEvaluations.length,
                )}{" "}
                - {Math.min(currentPage * pageSize, filteredEvaluations.length)}{" "}
                / tổng {filteredEvaluations.length} sinh viên)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentPage === pg ? "bg-blue-600 text-white shadow-2xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ANALYTICS ROW (Grade distribution, Top Scorers, Ungraded list in 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* STATISTICS & GRADE DISTRIBUTION CARD */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-blue-600" />
                Phân bố điểm
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                ĐTB: <strong className="text-blue-700">{avgScore}/10</strong>
              </span>
            </h3>

            {/* Distribution Breakdown Bars */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                  <span>Xuất sắc (&gt;= 9.0)</span>
                  <span className="text-sky-700">
                    {distribution.excellent} SV
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(distribution.excellent / totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                  <span>Giỏi (8.0 - 8.9)</span>
                  <span className="text-blue-700">{distribution.good} SV</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(distribution.good / totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                  <span>Khá (6.5 - 7.9)</span>
                  <span className="text-emerald-700">
                    {distribution.fair} SV
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${(distribution.fair / totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                  <span>Trung bình (5.0 - 6.4)</span>
                  <span className="text-amber-700">
                    {distribution.average} SV
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${(distribution.average / totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                  <span>Không đạt (&lt; 5.0)</span>
                  <span className="text-rose-700">
                    {distribution.failed} SV
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full"
                    style={{
                      width: `${(distribution.failed / totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TOP 5 SCORERS CARD */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Top 5 sinh viên xuất sắc</span>
            </h3>

            <div className="space-y-2">
              {topScorers.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate max-w-[120px]">
                      <p className="font-bold text-slate-900 text-xs truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.company}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-xs px-2 py-0.5 bg-blue-100 text-blue-900 font-mono rounded-md border border-blue-200">
                    {item.totalScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* UNGRADED STUDENTS QUICK LIST */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Cần chấm điểm ngay ({ungradedList.length})</span>
            </h3>

            {ungradedList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Đã hoàn thành chấm điểm toàn bộ sinh viên!
              </p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {ungradedList.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-amber-50/50 rounded-md border border-amber-200/60 flex items-center justify-between"
                  >
                    <div className="truncate max-w-[120px]">
                      <p className="font-bold text-slate-900 text-xs truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-amber-700 truncate">
                        {item.mssv} • {item.company}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenGrading(item)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg transition-colors shrink-0"
                    >
                      Chấm ngay
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Panel>

      {/* MODAL 1: 📝 CHẤM ĐIỂM MODAL */}
      {activeGradingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-sm">
                    Chấm điểm kết quả thực tập
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    {activeGradingStudent.name} • {activeGradingStudent.mssv}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveGradingStudent(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200 space-y-1">
                <p className="font-bold text-blue-900 text-xs">
                  Doanh nghiệp thực tập: {activeGradingStudent.company}
                </p>
                <p className="text-[11px] text-blue-700">
                  Người hướng dẫn (Mentor): {activeGradingStudent.supervisor}
                </p>
                <p className="text-[11px] text-blue-700">
                  Số bài báo cáo hàng tuần:{" "}
                  <strong>{activeGradingStudent.weeklyReportCount}</strong> bài
                </p>
              </div>

              {/* Enterprise Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    1. Điểm đánh giá từ Doanh nghiệp (Thang 10 - Trọng số 40%):
                  </label>
                  <span className="font-bold text-blue-700 text-sm">
                    {gradeInput.enterprise}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={gradeInput.enterprise}
                  onChange={(e) =>
                    setGradeInput({
                      ...gradeInput,
                      enterprise: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Lecturer Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    2. Điểm Báo cáo Giảng viên chấm (Thang 10 - Trọng số 40%):
                  </label>
                  <span className="font-bold text-blue-700 text-sm">
                    {gradeInput.lecturer}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={gradeInput.lecturer}
                  onChange={(e) =>
                    setGradeInput({
                      ...gradeInput,
                      lecturer: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Presentation Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    3. Điểm Bảo vệ Trước Hội đồng (Thang 10 - Trọng số 20%):
                  </label>
                  <span className="font-bold text-blue-700 text-sm">
                    {gradeInput.presentation}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={gradeInput.presentation}
                  onChange={(e) =>
                    setGradeInput({
                      ...gradeInput,
                      presentation: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Calculated Total */}
              <div className="bg-slate-100 p-3 rounded-md border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Điểm tổng kết ước tính:
                </span>
                <span className="font-bold text-base text-blue-700">
                  {(
                    gradeInput.enterprise * 0.4 +
                    gradeInput.lecturer * 0.4 +
                    gradeInput.presentation * 0.2
                  ).toFixed(1)}{" "}
                  / 10
                </span>
              </div>

              {/* Lecturer Comments */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nhận xét của Giảng viên:
                </label>
                <textarea
                  rows={3}
                  value={gradeInput.comments}
                  onChange={(e) =>
                    setGradeInput({ ...gradeInput, comments: e.target.value })
                  }
                  placeholder="Nhập ghi chú nhận xét kết quả thực tập..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveGradingStudent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-md"
              >
                Hủy
              </button>

              <button
                onClick={handleSaveGrade}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Lưu bảng điểm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 📄 PHIẾU ĐÁNH GIÁ DETAILED VIEW MODAL */}
      {activeSheetStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  Phiếu đánh giá chi tiết từ Doanh nghiệp
                </h3>
              </div>
              <button
                onClick={() => setActiveSheetStudent(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="border-b pb-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  {activeSheetStudent.name}
                </h4>
                <p className="text-slate-500">
                  MSSV: {activeSheetStudent.mssv} • {activeSheetStudent.major}
                </p>
                <p className="text-slate-500">
                  Doanh nghiệp: {activeSheetStudent.company} (
                  {activeSheetStudent.supervisor})
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 uppercase text-[11px] text-blue-700">
                  Chi tiết ma trận tiêu chí đánh giá:
                </h5>

                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">
                      1. Ý thức kỷ luật &amp; Giờ giấc:
                    </span>
                    <strong className="text-emerald-600">10 / 10</strong>
                  </div>

                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">
                      2. Năng lực chuyên môn &amp; Code Quality:
                    </span>
                    <strong className="text-emerald-600">9.0 / 10</strong>
                  </div>

                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">
                      3. Kỹ năng giao tiếp &amp; Làm việc nhóm:
                    </span>
                    <strong className="text-emerald-600">9.5 / 10</strong>
                  </div>

                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">
                      4. Mức độ hoàn thiện dự án giao:
                    </span>
                    <strong className="text-emerald-600">9.0 / 10</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200">
                  <p className="font-bold text-emerald-900 mb-1">
                    Nhận xét từ Mentor doanh nghiệp:
                  </p>
                  <p className="text-emerald-800 italic">
                    "Sinh viên có tư duy lập trình rất tốt, hoàn thành đúng hạn
                    các Module API. Sẵn sàng tiếp nhận sinh viên làm nhân viên
                    chính thức sau khi tốt nghiệp."
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveSheetStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 👁 CHI TIẾT MODAL */}
      {activeDetailStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">
                  Hồ sơ tổng hợp kết quả sinh viên
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailStudent(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="flex items-center gap-3 border-b pb-3">
                <img
                  src={
                    activeDetailStudent.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={activeDetailStudent.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {activeDetailStudent.name}
                  </h4>
                  <p className="text-slate-500">
                    MSSV: {activeDetailStudent.mssv} • Lớp:{" "}
                    {activeDetailStudent.class}
                  </p>
                  <p className="text-blue-600 font-bold">
                    {activeDetailStudent.major}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Doanh nghiệp:</span>
                  <strong className="text-slate-900">
                    {activeDetailStudent.company}
                  </strong>
                </div>

                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Giám sát doanh nghiệp:</span>
                  <strong className="text-slate-900">
                    {activeDetailStudent.supervisor}
                  </strong>
                </div>

                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">
                    Số bài nhật ký tuần đã nộp:
                  </span>
                  <strong className="text-blue-600">
                    {activeDetailStudent.weeklyReportCount}
                  </strong>
                </div>

                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">
                    Báo cáo thực tập cuối kỳ:
                  </span>
                  <strong
                    className={
                      activeDetailStudent.finalReportSubmitted
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }
                  >
                    {activeDetailStudent.finalReportSubmitted
                      ? "\u0110\xE3 n\u1ED9p"
                      : "Ch\u01B0a n\u1ED9p"}
                  </strong>
                </div>

                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">
                    Phiếu đánh giá từ Doanh nghiệp:
                  </span>
                  <strong
                    className={
                      activeDetailStudent.enterpriseFeedbackSubmitted
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }
                  >
                    {activeDetailStudent.enterpriseFeedbackSubmitted
                      ? "\u0110\xE3 nh\u1EADn"
                      : "Ch\u01B0a c\xF3"}
                  </strong>
                </div>

                {activeDetailStudent.lecturerComments && (
                  <div className="p-3 bg-blue-50/80 rounded-md border border-blue-200 mt-2">
                    <p className="font-bold text-blue-900 mb-0.5">
                      Ghi chú của Giảng viên:
                    </p>
                    <p className="text-blue-800">
                      {activeDetailStudent.lecturerComments}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveDetailStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 📊 XUẤT EXCEL BẢNG ĐIỂM TỔNG HỢP MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-white border-b border-emerald-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 tracking-tight">
                    Xuất Bảng Điểm Tổng Hợp (Excel)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Học kỳ I - Năm học 2025-2026 • Đợt thực tập tốt nghiệp Khoa
                    CNTT
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs font-sans">
              {/* Scope Selection Cards */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs block uppercase tracking-wider">
                  1. Chọn phạm vi danh sách sinh viên xuất Excel:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportScope("all")}
                    className={`p-3.5 rounded-md border text-left transition-all relative ${exportScope === "all" ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">
                        Toàn bộ danh sách
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                        {evaluations.length} SV
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Xuất tất cả sinh viên trong học kỳ hiện tại
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope("filtered")}
                    className={`p-3.5 rounded-md border text-left transition-all relative ${exportScope === "filtered" ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">
                        Danh sách đang lọc
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-full">
                        {filteredEvaluations.length} SV
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Theo bộ lọc tìm kiếm &amp; lớp hiện tại
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope("graded")}
                    className={`p-3.5 rounded-md border text-left transition-all relative ${exportScope === "graded" ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">
                        Chỉ sinh viên đã chấm
                      </span>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-bold text-[10px] rounded-full">
                        {
                          evaluations.filter(
                            (e) => e.status === "Ho\xE0n th\xE0nh",
                          ).length
                        }{" "}
                        SV
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Chỉ gồm sinh viên đã có điểm tổng kết
                    </p>
                  </button>
                </div>
              </div>

              {/* Preview Table Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs block uppercase tracking-wider">
                    2. Xem trước định dạng mẫu bảng điểm Excel:
                  </label>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Định dạng chuẩn
                    Office Excel (UTF-8 BOM)
                  </span>
                </div>

                <div className="border border-slate-200 rounded-md overflow-hidden shadow-xs bg-slate-50 max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold sticky top-0">
                      <tr>
                        <th className="p-2 border-r border-slate-200 w-8 text-center">
                          STT
                        </th>
                        <th className="p-2 border-r border-slate-200">MSSV</th>
                        <th className="p-2 border-r border-slate-200">
                          Họ và tên
                        </th>
                        <th className="p-2 border-r border-slate-200">Lớp</th>
                        <th className="p-2 border-r border-slate-200">
                          Doanh nghiệp
                        </th>
                        <th className="p-2 border-r border-slate-200 text-center">
                          Điểm DN
                        </th>
                        <th className="p-2 border-r border-slate-200 text-center">
                          Điểm GV
                        </th>
                        <th className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800">
                          Điểm Tổng
                        </th>
                        <th className="p-2">Xếp loại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 bg-white">
                      {(exportScope === "filtered"
                        ? filteredEvaluations
                        : exportScope === "graded"
                          ? evaluations.filter(
                              (e) => e.status === "Ho\xE0n th\xE0nh",
                            )
                          : evaluations
                      )
                        .slice(0, 4)
                        .map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-2 border-r border-slate-100 text-center text-slate-500 font-medium">
                              {idx + 1}
                            </td>
                            <td className="p-2 border-r border-slate-100 font-bold text-slate-900">
                              {item.mssv}
                            </td>
                            <td className="p-2 border-r border-slate-100 font-bold text-slate-800">
                              {item.name}
                            </td>
                            <td className="p-2 border-r border-slate-100 text-slate-600">
                              {item.class}
                            </td>
                            <td className="p-2 border-r border-slate-100 text-slate-600 truncate max-w-[120px]">
                              {item.company}
                            </td>
                            <td className="p-2 border-r border-slate-100 text-center font-bold text-slate-700">
                              {item.enterpriseScore ?? "-"}
                            </td>
                            <td className="p-2 border-r border-slate-100 text-center font-bold text-slate-700">
                              {item.lecturerScore ?? "-"}
                            </td>
                            <td className="p-2 border-r border-slate-100 text-center font-bold text-emerald-700 bg-emerald-50/50">
                              {item.totalScore ?? "-"}
                            </td>
                            <td className="p-2 font-bold text-slate-700">
                              {item.gradeClassification ??
                                "Ch\u01B0a ch\u1EA5m"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Information / File Summary */}
              <div className="p-3.5 bg-emerald-50/70 rounded-md border border-emerald-200/80 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-900 space-y-0.5">
                  <p className="font-bold">
                    Tệp Excel bao gồm đầy đủ 15 cột thông tin:
                  </p>
                  <p className="text-emerald-800">
                    STT, MSSV, Họ tên, Lớp, Ngành, Doanh nghiệp, GVHD, Số báo
                    cáo tuần, Điểm Doanh nghiệp (40%), Điểm Giảng viên (40%),
                    Điểm Bảo vệ (20%), Điểm Tổng kết, Xếp loại, Trạng thái &amp;
                    Nhận xét chi tiết.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-md transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmDownloadExcel}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Tải File Excel Ngay (.csv)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: 🎓 PHIẾU ĐÁNH GIÁ CHUẨN PDF TRƯỜNG */}
      {activePdfStudent && (
        <EvaluationPdfModal
          student={activePdfStudent}
          onClose={() => setActivePdfStudent(null)}
        />
      )}
    </div>
  );
};
