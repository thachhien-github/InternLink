import { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  UserCheck,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  X,
  History,
  Check,
  Download,
  BarChart3,
  TrendingUp,
  Clock,
  FileSpreadsheet,
  UserX,
  ChevronDown,
  ChevronUp,
  UserMinus,
  ArrowLeftRight,
  Plus,
  Mail
} from 'lucide-react';
export const AssignmentsView = ({
  onShowToast
}) => {
  const [selectedSemester, setSelectedSemester] = useState("sem-1");
  const semesters = [
    {
      id: "sem-1",
      name: "Th\u1EF1c t\u1EADp T\u1ED1t nghi\u1EC7p K20 (2025 - 2026)",
      term: "H\u1ECDc k\u1EF3 I",
      year: "2025-2026",
      totalCount: 1280,
      lecturerCount: 42,
      status: "\u0110ang di\u1EC5n ra"
    },
    {
      id: "sem-2",
      name: "Th\u1EF1c t\u1EADp Doanh nghi\u1EC7p K20 (2025 - 2026)",
      term: "H\u1ECDc k\u1EF3 II",
      year: "2025-2026",
      totalCount: 1150,
      lecturerCount: 40,
      status: "S\u1EAFp b\u1EAFt \u0111\u1EA7u"
    },
    {
      id: "sem-3",
      name: "Th\u1EF1c t\u1EADp T\u1ED1t nghi\u1EC7p K19 (2024 - 2025)",
      term: "H\u1ECDc k\u1EF3 I",
      year: "2024-2025",
      totalCount: 1210,
      lecturerCount: 38,
      status: "Ho\xE0n th\xE0nh"
    }
  ];
  const currentSemesterObj = semesters.find((s) => s.id === selectedSemester) || semesters[0];
  const [activeTab, setActiveTab] = useState("by-lecturer");
  const [lecturers, setLecturers] = useState([
    { id: "lec-1", employeeId: "GV001", fullName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc", title: "Tr\u01B0\u1EDFng b\u1ED9 m\xF4n", department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m", currentCount: 4, maxCapacity: 40, email: "phuoc.nv@fit.edu.vn", phone: "0903123456" },
    { id: "lec-2", employeeId: "GV002", fullName: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh", title: "Gi\u1EA3ng vi\xEAn ch\xEDnh", department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m", currentCount: 3, maxCapacity: 40, email: "maianh.tt@fit.edu.vn", phone: "0903234567" },
    { id: "lec-3", employeeId: "GV003", fullName: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i", title: "Ph\xF3 Khoa", department: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", currentCount: 3, maxCapacity: 35, email: "thai.lh@fit.edu.vn", phone: "0903345678" },
    { id: "lec-4", employeeId: "GV004", fullName: "TS. \u0110\u1EB7ng Minh Ch\xE2u", title: "Gi\u1EA3ng vi\xEAn", department: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", currentCount: 3, maxCapacity: 40, email: "chaudm@fit.edu.vn", phone: "0903456789" },
    { id: "lec-5", employeeId: "GV005", fullName: "ThS. Ph\u1EA1m Qu\u1ED1c B\u1EA3o", title: "Gi\u1EA3ng vi\xEAn", department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m", currentCount: 2, maxCapacity: 30, email: "baopq@fit.edu.vn", phone: "0903567890" },
    { id: "lec-6", employeeId: "GV006", fullName: "TS. V\u0169 \u0110\xECnh Khoa", title: "Gi\u1EA3ng vi\xEAn", department: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", currentCount: 2, maxCapacity: 40, email: "khoavd@fit.edu.vn", phone: "0903678901" },
    { id: "lec-7", employeeId: "GV007", fullName: "TS. Nguy\u1EC5n Th\u1ECB H\u1ED3ng", title: "Gi\u1EA3ng vi\xEAn", department: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", currentCount: 2, maxCapacity: 35, email: "hongnt@fit.edu.vn", phone: "0903789012" },
    { id: "lec-8", employeeId: "GV008", fullName: "ThS. \u0110\u1ED7 Ho\xE0ng Y\u1EBFn", title: "Gi\u1EA3ng vi\xEAn", department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m", currentCount: 1, maxCapacity: 35, email: "yendh@fit.edu.vn", phone: "0903890123" }
  ]);
  const [selectedLecturerId, setSelectedLecturerId] = useState("lec-1");
  const [students, setStudents] = useState([
    // Assigned to TS. Nguyễn Văn Phước (lec-1)
    { id: "st-001", studentId: "20110101", fullName: "Nguy\u1EC5n B\xEDch Ng\u1ECDc", classCode: "20CNTT1", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "FPT Software HCM", assignmentStatus: "assigned", assignedLecturerId: "lec-1", assignedLecturerName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc", assignedDate: "10/01/2025", gpa: 3.75 },
    { id: "st-002", studentId: "20110102", fullName: "L\xEA Minh Th\xE0nh", classCode: "20CNTT1", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "VNG Corporation", assignmentStatus: "assigned", assignedLecturerId: "lec-1", assignedLecturerName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc", assignedDate: "10/01/2025", gpa: 3.6 },
    { id: "st-003", studentId: "20110103", fullName: "Ph\u1EA1m \u0110\u1EE9c Anh", classCode: "20KTPM1", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "NashTech Vietnam", assignmentStatus: "assigned", assignedLecturerId: "lec-1", assignedLecturerName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc", assignedDate: "12/01/2025", gpa: 3.42 },
    { id: "st-004", studentId: "20110104", fullName: "Tr\u1EA7n Th\u1ECB Kh\xE1nh V\xE2n", classCode: "20KTPM2", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "KMS Technology", assignmentStatus: "assigned", assignedLecturerId: "lec-1", assignedLecturerName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc", assignedDate: "15/01/2025", gpa: 3.88 },
    // Assigned to ThS. Trần Thị Mai Anh (lec-2)
    { id: "st-005", studentId: "20110105", fullName: "V\u0169 Qu\u1ED1c Huy", classCode: "20KTPM1", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "Viettel Telecom", assignmentStatus: "assigned", assignedLecturerId: "lec-2", assignedLecturerName: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh", assignedDate: "11/01/2025", gpa: 3.52 },
    { id: "st-006", studentId: "20110106", fullName: "Ho\xE0ng Kim Dung", classCode: "20CNTT2", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "Shopee Vietnam", assignmentStatus: "assigned", assignedLecturerId: "lec-2", assignedLecturerName: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh", assignedDate: "11/01/2025", gpa: 3.65 },
    { id: "st-007", studentId: "20110107", fullName: "B\xF9i Gia B\u1EA3o", classCode: "20KTPM1", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "TMA Solutions", assignmentStatus: "assigned", assignedLecturerId: "lec-2", assignedLecturerName: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh", assignedDate: "14/01/2025", gpa: 3.3 },
    // Assigned to PGS.TS. Lê Hoàng Thái (lec-3)
    { id: "st-008", studentId: "20110108", fullName: "\u0110\u1EB7ng Tu\u1EA5n Ki\u1EC7t", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "Cisco Systems", assignmentStatus: "assigned", assignedLecturerId: "lec-3", assignedLecturerName: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i", assignedDate: "09/01/2025", gpa: 3.8 },
    { id: "st-009", studentId: "20110109", fullName: "Tr\u1ECBnh Ho\xE0i Nam", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "VNPT Technology", assignmentStatus: "assigned", assignedLecturerId: "lec-3", assignedLecturerName: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i", assignedDate: "09/01/2025", gpa: 3.45 },
    { id: "st-010", studentId: "20110110", fullName: "Ng\xF4 Thu Trang", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "FPT Telecom", assignmentStatus: "assigned", assignedLecturerId: "lec-3", assignedLecturerName: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i", assignedDate: "13/01/2025", gpa: 3.58 },
    // Assigned to TS. Đặng Minh Châu (lec-4)
    { id: "st-011", studentId: "20110111", fullName: "\u0110\u1ED7 Ti\u1EBFn D\u0169ng", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "MoMo Wallet", assignmentStatus: "assigned", assignedLecturerId: "lec-4", assignedLecturerName: "TS. \u0110\u1EB7ng Minh Ch\xE2u", assignedDate: "10/01/2025", gpa: 3.4 },
    { id: "st-012", studentId: "20110112", fullName: "D\u01B0\u01A1ng Th\u1ECB Y\u1EBFn", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "LogiGear Vietnam", assignmentStatus: "assigned", assignedLecturerId: "lec-4", assignedLecturerName: "TS. \u0110\u1EB7ng Minh Ch\xE2u", assignedDate: "10/01/2025", gpa: 3.32 },
    { id: "st-013", studentId: "20110113", fullName: "Hu\u1EF3nh T\u1EA5n H\u1EA3i", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "Ch\u1EE3 T\u1ED1t", assignmentStatus: "assigned", assignedLecturerId: "lec-4", assignedLecturerName: "TS. \u0110\u1EB7ng Minh Ch\xE2u", assignedDate: "15/01/2025", gpa: 3.25 },
    // Assigned to ThS. Phạm Quốc Bảo (lec-5)
    { id: "st-014", studentId: "20110114", fullName: "Phan Nh\u1EADt Minh", classCode: "20KTPM2", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "Got It Vietnam", assignmentStatus: "assigned", assignedLecturerId: "lec-5", assignedLecturerName: "ThS. Ph\u1EA1m Qu\u1ED1c B\u1EA3o", assignedDate: "12/01/2025", gpa: 3.7 },
    { id: "st-015", studentId: "20110115", fullName: "V\xF5 Minh Qu\xE2n", classCode: "20CNTT1", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "Robert Bosch Vietnam", assignmentStatus: "assigned", assignedLecturerId: "lec-5", assignedLecturerName: "ThS. Ph\u1EA1m Qu\u1ED1c B\u1EA3o", assignedDate: "12/01/2025", gpa: 3.5 },
    // Assigned to TS. Vũ Đình Khoa (lec-6)
    { id: "st-016", studentId: "20110116", fullName: "Mai Thanh T\xE2m", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "CMC Telecom", assignmentStatus: "assigned", assignedLecturerId: "lec-6", assignedLecturerName: "TS. V\u0169 \u0110\xECnh Khoa", assignedDate: "11/01/2025", gpa: 3.48 },
    { id: "st-017", studentId: "20110117", fullName: "H\u1ED3 Ho\xE0ng Ph\u01B0\u01A1ng", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "Viettel Telecom", assignmentStatus: "assigned", assignedLecturerId: "lec-6", assignedLecturerName: "TS. V\u0169 \u0110\xECnh Khoa", assignedDate: "14/01/2025", gpa: 3.61 },
    // Assigned to TS. Nguyễn Thị Hồng (lec-7)
    { id: "st-018", studentId: "20110118", fullName: "T\u1EA1 Minh Nh\u1EADt", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "Sendo Farm", assignmentStatus: "assigned", assignedLecturerId: "lec-7", assignedLecturerName: "TS. Nguy\u1EC5n Th\u1ECB H\u1ED3ng", assignedDate: "10/01/2025", gpa: 3.35 },
    { id: "st-019", studentId: "20110119", fullName: "L\xFD Qu\u1ED1c \u0110\u1EA1t", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "MGM Technology", assignmentStatus: "assigned", assignedLecturerId: "lec-7", assignedLecturerName: "TS. Nguy\u1EC5n Th\u1ECB H\u1ED3ng", assignedDate: "13/01/2025", gpa: 3.2 },
    // Assigned to ThS. Đỗ Hoàng Yến (lec-8)
    { id: "st-020", studentId: "20110120", fullName: "L\u01B0\u01A1ng M\u1EF9 Linh", classCode: "20CNTT2", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "FPT Software HCM", assignmentStatus: "assigned", assignedLecturerId: "lec-8", assignedLecturerName: "ThS. \u0110\u1ED7 Ho\xE0ng Y\u1EBFn", assignedDate: "15/01/2025", gpa: 3.68 },
    // Unassigned Students Queue
    { id: "st-101", studentId: "20110201", fullName: "Nguy\u1EC5n V\u0103n Minh", classCode: "20CNTT1", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "FPT Software HCM", assignmentStatus: "unassigned", gpa: 3.45 },
    { id: "st-102", studentId: "20110202", fullName: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o", classCode: "20CNTT1", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "VNG Corporation", assignmentStatus: "unassigned", gpa: 3.62 },
    { id: "st-103", studentId: "20110205", fullName: "L\xEA Ho\xE0ng Nam", classCode: "20KTPM1", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "Viettel Telecom", assignmentStatus: "unassigned", gpa: 3.12 },
    { id: "st-104", studentId: "20110208", fullName: "Ph\u1EA1m \u0110\u0103ng Khoa", classCode: "20KTPM2", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "MGM Technology", assignmentStatus: "unassigned", gpa: 3.28 },
    { id: "st-105", studentId: "20110212", fullName: "V\u0169 Ng\u1ECDc B\u1EA3o Tr\xE2m", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "TMA Solutions", assignmentStatus: "unassigned", gpa: 3.55 },
    { id: "st-106", studentId: "20110215", fullName: "\u0110\u1EB7ng Qu\u1ED1c Huy", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "Shopee Vietnam", assignmentStatus: "unassigned", gpa: 3.01 },
    { id: "st-107", studentId: "20110219", fullName: "B\xF9i Anh Tu\u1EA5n", classCode: "20CNTT2", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "KMS Technology", assignmentStatus: "unassigned", gpa: 3.4 },
    { id: "st-108", studentId: "20110222", fullName: "Ho\xE0ng Th\u1ECB M\u1EF9 Duy\xEAn", classCode: "20KTPM1", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "Ch\u1EE3 T\u1ED1t (Carousell)", assignmentStatus: "unassigned", gpa: 3.78 },
    { id: "st-109", studentId: "20110225", fullName: "\u0110\u1ED7 Ti\u1EBFn \u0110\u1EA1t", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "VNPT Technology", assignmentStatus: "unassigned", gpa: 3.15 },
    { id: "st-110", studentId: "20110230", fullName: "Ng\xF4 Thanh H\xE0", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "Sendo Farm", assignmentStatus: "unassigned", gpa: 3.2 },
    { id: "st-111", studentId: "20110234", fullName: "D\u01B0\u01A1ng V\u0103n Kh\xE1nh", classCode: "20CNTT2", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "Robert Bosch Vietnam", assignmentStatus: "unassigned", gpa: 3.68 },
    { id: "st-112", studentId: "20110240", fullName: "Hu\u1EF3nh T\u1EA5n Ph\xE1t", classCode: "20KTPM2", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "LogiGear Vietnam", assignmentStatus: "unassigned", gpa: 3.32 }
  ]);
  const [lecturerSearch, setLecturerSearch] = useState("");
  const [lecturerDeptFilter, setLecturerDeptFilter] = useState("all");
  const [assignedStudentSearch, setAssignedStudentSearch] = useState("");
  const [assignedClassFilter, setAssignedClassFilter] = useState("all");
  const [groupViewMode, setGroupViewMode] = useState("single");
  const [selectedAssignedStudentIds, setSelectedAssignedStudentIds] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [selectedUnassignedIds, setSelectedUnassignedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [recentAssignments, setRecentAssignments] = useState([
    { id: "log-1", lecturerName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc", studentCount: 4, timestamp: "10 ph\xFAt tr\u01B0\u1EDBc", classGroups: ["20CNTT1", "20KTPM1"], assignedBy: "V\u0103n ph\xF2ng Khoa" },
    { id: "log-2", lecturerName: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh", studentCount: 3, timestamp: "35 ph\xFAt tr\u01B0\u1EDBc", classGroups: ["20KTPM1"], assignedBy: "V\u0103n ph\xF2ng Khoa" },
    { id: "log-3", lecturerName: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i", studentCount: 3, timestamp: "1 gi\u1EDD tr\u01B0\u1EDBc", classGroups: ["20MMT1"], assignedBy: "T\u1EF1 \u0111\u1ED9ng (Smart)" },
    { id: "log-4", lecturerName: "TS. \u0110\u1EB7ng Minh Ch\xE2u", studentCount: 3, timestamp: "2 gi\u1EDD tr\u01B0\u1EDBc", classGroups: ["20HTTT1"], assignedBy: "V\u0103n ph\xF2ng Khoa" }
  ]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [targetReassignLecturerId, setTargetReassignLecturerId] = useState("lec-2");
  const [batchStrategy, setBatchStrategy] = useState("department");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedLecturerIds, setExpandedLecturerIds] = useState(["lec-1", "lec-2"]);
  const unassignedStudents = useMemo(() => {
    return students.filter((s) => s.assignmentStatus === "unassigned");
  }, [students]);
  const assignedStudents = useMemo(() => {
    return students.filter((s) => s.assignmentStatus === "assigned");
  }, [students]);
  const activeLecturerObj = useMemo(() => {
    return lecturers.find((l) => l.id === selectedLecturerId) || lecturers[0];
  }, [lecturers, selectedLecturerId]);
  const activeLecturerStudents = useMemo(() => {
    if (!activeLecturerObj) return [];
    return students.filter((s) => s.assignmentStatus === "assigned" && s.assignedLecturerId === activeLecturerObj.id);
  }, [students, activeLecturerObj]);
  const filteredActiveLecturerStudents = useMemo(() => {
    return activeLecturerStudents.filter((s) => {
      const matchSearch = s.fullName.toLowerCase().includes(assignedStudentSearch.toLowerCase()) || s.studentId.toLowerCase().includes(assignedStudentSearch.toLowerCase());
      const matchClass = assignedClassFilter === "all" || s.classCode === assignedClassFilter;
      return matchSearch && matchClass;
    });
  }, [activeLecturerStudents, assignedStudentSearch, assignedClassFilter]);
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((l) => {
      const matchSearch = l.fullName.toLowerCase().includes(lecturerSearch.toLowerCase()) || l.employeeId.toLowerCase().includes(lecturerSearch.toLowerCase());
      const matchDept = lecturerDeptFilter === "all" || l.department === lecturerDeptFilter;
      return matchSearch && matchDept;
    });
  }, [lecturers, lecturerSearch, lecturerDeptFilter]);
  const filteredUnassignedStudents = useMemo(() => {
    return unassignedStudents.filter((s) => {
      const matchSearch = s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) || s.fullName.toLowerCase().includes(studentSearch.toLowerCase());
      const matchClass = classFilter === "all" || s.classCode === classFilter;
      const matchMajor = majorFilter === "all" || s.major === majorFilter;
      const matchCompany = companyFilter === "all" || s.companyName && s.companyName.toLowerCase().includes(companyFilter.toLowerCase());
      return matchSearch && matchClass && matchMajor && matchCompany;
    });
  }, [unassignedStudents, studentSearch, classFilter, majorFilter, companyFilter]);
  const totalPages = Math.ceil(filteredUnassignedStudents.length / pageSize) || 1;
  const paginatedUnassignedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUnassignedStudents.slice(start, start + pageSize);
  }, [filteredUnassignedStudents, currentPage, pageSize]);
  const totalStudentsSemester = currentSemesterObj.totalCount;
  const totalAssignedCount = assignedStudents.length;
  const totalUnassignedCount = unassignedStudents.length;
  const assignmentRate = Math.round(totalAssignedCount / totalStudentsSemester * 100);
  const totalLecturersCount = lecturers.length;
  const totalRemainingCapacity = useMemo(() => {
    return lecturers.reduce((acc, l) => acc + Math.max(0, l.maxCapacity - l.currentCount), 0);
  }, [lecturers]);
  const getWorkloadColor = (current, max) => {
    const ratio = current / max;
    if (ratio < 0.75) return {
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "C\xF2n slot"
    };
    if (ratio <= 0.9) return {
      bar: "bg-amber-500",
      text: "text-amber-700",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      label: "G\u1EA7n \u0111\u1EA7y"
    };
    return {
      bar: "bg-rose-500",
      text: "text-rose-700",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      label: "Qu\xE1 t\u1EA3i / \u0110\u1EA7y"
    };
  };
  const sortedByWorkload = useMemo(() => {
    return [...lecturers].sort((a, b) => b.currentCount / b.maxCapacity - a.currentCount / a.maxCapacity);
  }, [lecturers]);
  const topHighestWorkload = sortedByWorkload.slice(0, 5);
  const topLowestWorkload = [...sortedByWorkload].reverse().slice(0, 5);
  const handleUnassignStudent = (studentId, studentName) => {
    if (!activeLecturerObj) return;
    setStudents((prev) => prev.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          assignmentStatus: "unassigned",
          assignedLecturerId: void 0,
          assignedLecturerName: void 0,
          assignedDate: void 0
        };
      }
      return s;
    }));
    setLecturers((prev) => prev.map((l) => {
      if (l.id === activeLecturerObj.id) {
        return { ...l, currentCount: Math.max(0, l.currentCount - 1) };
      }
      return l;
    }));
    onShowToast(`\u0110\xE3 h\u1EE7y ph\xE2n c\xF4ng h\u01B0\u1EDBng d\u1EABn c\u1EE7a sinh vi\xEAn ${studentName}`);
    setSelectedAssignedStudentIds((prev) => prev.filter((id) => id !== studentId));
  };
  const handleBulkUnassign = () => {
    if (selectedAssignedStudentIds.length === 0) {
      onShowToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 sinh vi\xEAn \u0111\u1EC3 h\u1EE7y ph\xE2n c\xF4ng!");
      return;
    }
    const count = selectedAssignedStudentIds.length;
    setStudents((prev) => prev.map((s) => {
      if (selectedAssignedStudentIds.includes(s.id)) {
        return {
          ...s,
          assignmentStatus: "unassigned",
          assignedLecturerId: void 0,
          assignedLecturerName: void 0,
          assignedDate: void 0
        };
      }
      return s;
    }));
    setLecturers((prev) => prev.map((l) => {
      if (l.id === activeLecturerObj.id) {
        return { ...l, currentCount: Math.max(0, l.currentCount - count) };
      }
      return l;
    }));
    onShowToast(`\u0110\xE3 h\u1EE7y ph\xE2n c\xF4ng ${count} sinh vi\xEAn kh\u1ECFi ${activeLecturerObj.fullName}!`);
    setSelectedAssignedStudentIds([]);
  };
  const handleExecuteReassign = () => {
    if (selectedAssignedStudentIds.length === 0) {
      onShowToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 sinh vi\xEAn \u0111\u1EC3 chuy\u1EC3n gi\u1EA3ng vi\xEAn!");
      return;
    }
    const targetLecturer = lecturers.find((l) => l.id === targetReassignLecturerId);
    if (!targetLecturer) return;
    if (targetLecturer.currentCount + selectedAssignedStudentIds.length > targetLecturer.maxCapacity) {
      onShowToast(`C\u1EA3nh b\xE1o: S\u1EE9c ch\u1EE9a c\u1EE7a ${targetLecturer.fullName} kh\xF4ng \u0111\u1EE7 \u0111\u1EC3 nh\u1EADn th\xEAm ${selectedAssignedStudentIds.length} sinh vi\xEAn!`);
      return;
    }
    const count = selectedAssignedStudentIds.length;
    setStudents((prev) => prev.map((s) => {
      if (selectedAssignedStudentIds.includes(s.id)) {
        return {
          ...s,
          assignedLecturerId: targetLecturer.id,
          assignedLecturerName: targetLecturer.fullName,
          assignedDate: (/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")
        };
      }
      return s;
    }));
    setLecturers((prev) => prev.map((l) => {
      if (l.id === activeLecturerObj.id) {
        return { ...l, currentCount: Math.max(0, l.currentCount - count) };
      }
      if (l.id === targetLecturer.id) {
        return { ...l, currentCount: l.currentCount + count };
      }
      return l;
    }));
    setRecentAssignments((prev) => [{
      id: `log-${Date.now()}`,
      lecturerName: targetLecturer.fullName,
      studentCount: count,
      timestamp: "V\u1EEBa xong",
      classGroups: ["Chuy\u1EC3n t\u1EEB " + activeLecturerObj.fullName],
      assignedBy: "V\u0103n ph\xF2ng Khoa"
    }, ...prev]);
    onShowToast(`\u0110\xE3 chuy\u1EC3n th\xE0nh c\xF4ng ${count} sinh vi\xEAn sang gi\u1EA3ng vi\xEAn ${targetLecturer.fullName}!`);
    setSelectedAssignedStudentIds([]);
    setShowReassignModal(false);
  };
  const handleAddStudentsToCurrentLecturer = (studentIdsToAdd) => {
    if (!activeLecturerObj) return;
    if (activeLecturerObj.currentCount + studentIdsToAdd.length > activeLecturerObj.maxCapacity) {
      onShowToast(`Kh\xF4ng th\u1EC3 th\xEAm! V\u01B0\u1EE3t qu\xE1 s\u1EE9c ch\u1EE9a t\u1ED1i \u0111a (${activeLecturerObj.maxCapacity} SV) c\u1EE7a ${activeLecturerObj.fullName}!`);
      return;
    }
    const count = studentIdsToAdd.length;
    setStudents((prev) => prev.map((s) => {
      if (studentIdsToAdd.includes(s.id)) {
        return {
          ...s,
          assignmentStatus: "assigned",
          assignedLecturerId: activeLecturerObj.id,
          assignedLecturerName: activeLecturerObj.fullName,
          assignedDate: (/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")
        };
      }
      return s;
    }));
    setLecturers((prev) => prev.map((l) => {
      if (l.id === activeLecturerObj.id) {
        return { ...l, currentCount: l.currentCount + count };
      }
      return l;
    }));
    setRecentAssignments((prev) => [{
      id: `log-${Date.now()}`,
      lecturerName: activeLecturerObj.fullName,
      studentCount: count,
      timestamp: "V\u1EEBa xong",
      classGroups: ["Th\xEAm tr\u1EF1c ti\u1EBFp"],
      assignedBy: "V\u0103n ph\xF2ng Khoa"
    }, ...prev]);
    onShowToast(`\u0110\xE3 ph\xE2n c\xF4ng th\xE0nh c\xF4ng ${count} sinh vi\xEAn cho ${activeLecturerObj.fullName}!`);
    setShowAddStudentModal(false);
  };
  const handleConfirmMatrixAssignment = () => {
    if (selectedUnassignedIds.length === 0) {
      onShowToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 sinh vi\xEAn!");
      return;
    }
    const targetLecturer = activeLecturerObj;
    if (!targetLecturer) return;
    if (targetLecturer.currentCount + selectedUnassignedIds.length > targetLecturer.maxCapacity) {
      onShowToast(`C\u1EA3nh b\xE1o: Ph\xE2n c\xF4ng ${selectedUnassignedIds.length} sinh vi\xEAn v\u01B0\u1EE3t qu\xE1 ch\u1EC9 ti\xEAu c\xF2n l\u1EA1i c\u1EE7a ${targetLecturer.fullName}!`);
      return;
    }
    const count = selectedUnassignedIds.length;
    setStudents((prev) => prev.map((s) => {
      if (selectedUnassignedIds.includes(s.id)) {
        return {
          ...s,
          assignmentStatus: "assigned",
          assignedLecturerId: targetLecturer.id,
          assignedLecturerName: targetLecturer.fullName,
          assignedDate: (/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")
        };
      }
      return s;
    }));
    setLecturers((prev) => prev.map((l) => {
      if (l.id === targetLecturer.id) {
        return { ...l, currentCount: l.currentCount + count };
      }
      return l;
    }));
    setRecentAssignments((prev) => [{
      id: `log-${Date.now()}`,
      lecturerName: targetLecturer.fullName,
      studentCount: count,
      timestamp: "V\u1EEBa xong",
      classGroups: ["Ma tr\u1EADn ph\xE2n c\xF4ng"],
      assignedBy: "V\u0103n ph\xF2ng Khoa"
    }, ...prev]);
    onShowToast(`\u0110\xE3 ph\xE2n c\xF4ng ${count} sinh vi\xEAn cho ${targetLecturer.fullName}!`);
    setSelectedUnassignedIds([]);
  };
  const handleRunBatchAssignment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowBatchModal(false);
      if (unassignedStudents.length === 0) {
        onShowToast("T\u1EA5t c\u1EA3 sinh vi\xEAn \u0111\xE3 \u0111\u01B0\u1EE3c ph\xE2n c\xF4ng!");
        return;
      }
      const countToAssign = Math.min(unassignedStudents.length, 10);
      const studentIdsToAssign = unassignedStudents.slice(0, countToAssign).map((s) => s.id);
      const targetLecturer = [...lecturers].sort((a, b) => b.maxCapacity - b.currentCount - (a.maxCapacity - a.currentCount))[0];
      if (!targetLecturer) return;
      setStudents((prev) => prev.map((s) => {
        if (studentIdsToAssign.includes(s.id)) {
          return {
            ...s,
            assignmentStatus: "assigned",
            assignedLecturerId: targetLecturer.id,
            assignedLecturerName: targetLecturer.fullName,
            assignedDate: (/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")
          };
        }
        return s;
      }));
      setLecturers((prev) => prev.map((l) => {
        if (l.id === targetLecturer.id) {
          return { ...l, currentCount: l.currentCount + countToAssign };
        }
        return l;
      }));
      setRecentAssignments((prev) => [{
        id: `log-${Date.now()}`,
        lecturerName: targetLecturer.fullName,
        studentCount: countToAssign,
        timestamp: "V\u1EEBa xong",
        classGroups: ["T\u1EF1 \u0111\u1ED9ng ph\xE2n b\u1ED5"],
        assignedBy: "H\u1EC7 th\u1ED1ng Smart Balance"
      }, ...prev]);
      onShowToast(`\u0110\xE3 t\u1EF1 \u0111\u1ED9ng ph\xE2n c\xF4ng ${countToAssign} sinh vi\xEAn cho ${targetLecturer.fullName}!`);
    }, 600);
  };
  const handleExportExcel = () => {
    onShowToast(`\u0110\xE3 xu\u1EA5t B\xE1o c\xE1o Ph\xE2n c\xF4ng H\u01B0\u1EDBng d\u1EABn (${activeLecturerObj.fullName}) .xlsx th\xE0nh c\xF4ng!`);
  };
  const toggleAccordionLecturer = (id) => {
    setExpandedLecturerIds(
      (prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  return <div className="p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      
      {
    /* PAGE HEADER & TOP NAVIGATION BAR */
  }
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Phân công Hướng dẫn Thực tập</h1>
        </div>

        {
    /* TOP QUICK ACTIONS */
  }
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
    onClick={() => setShowBatchModal(true)}
    className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
  >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Tự động phân công</span>
          </button>

          <button
    onClick={handleExportExcel}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
  >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          <button
    onClick={() => setShowHistoryModal(true)}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
  >
            <History className="w-4 h-4 text-slate-600" />
            <span>Lịch sử phân công</span>
          </button>
        </div>
      </div>

      {
    /* HERO KPI STATS - UNIFIED 4 CORE CARDS */
  }
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {
    /* KPI 1: Semester Total */
  }
        <div className="p-4 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 rounded-2xl border border-blue-200/80 border-l-4 border-l-blue-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tổng sinh viên</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/60 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalStudentsSemester.toLocaleString("vi-VN")}</span>
            <span className="text-xs font-bold text-slate-400">sinh viên</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Toàn học kỳ hiện tại</p>
        </div>

        {
    /* KPI 2: Assigned */
  }
        <div className="p-4 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Đã phân công</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{totalAssignedCount}</span>
            <span className="text-xs font-bold text-emerald-600/70">sinh viên</span>
          </div>
          <span className="inline-block px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-md border border-emerald-200">
            Đã có Giảng viên
          </span>
        </div>

        {
    /* KPI 3: Unassigned */
  }
        <div className="p-4 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Chưa phân công</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600">{totalUnassignedCount}</span>
            <span className="text-xs font-bold text-amber-600/70">sinh viên</span>
          </div>
          <span className="inline-block px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md border border-amber-200">
            Đang chờ ghép nối
          </span>
        </div>

        {
    /* KPI 4: Completion Rate */
  }
        <div className="p-4 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 rounded-2xl border border-teal-200/80 border-l-4 border-l-teal-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tỷ lệ hoàn thành</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-teal-600 border border-teal-200/60 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-teal-900">{assignmentRate}%</span>
            <span className="text-xs font-bold text-teal-600">tiến độ</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200 overflow-hidden mt-1">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${assignmentRate}%` }} />
          </div>
        </div>

      </div>

      {
    /* SEMESTER SELECTOR & MAIN TAB SWITCHER BAR */
  }
      <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 max-w-full overflow-hidden">
        
        {
    /* Semester Selector */
  }
        <div className="flex items-center gap-3 min-w-0 max-w-full">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div className="min-w-0 max-w-full">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Kỳ thực tập hiện tại
            </label>
            <select
    value={selectedSemester}
    onChange={(e) => setSelectedSemester(e.target.value)}
    className="mt-0.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-xs outline-none focus:bg-white focus:border-blue-500 cursor-pointer max-w-full truncate"
  >
              {semesters.map((sem) => <option key={sem.id} value={sem.id}>
                  {sem.name} — [{sem.status}]
                </option>)}
            </select>
          </div>
        </div>

        {
    /* View Mode Navigation Tabs */
  }
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-extrabold max-w-full overflow-x-auto shrink-0">
          <button
    onClick={() => setActiveTab("by-lecturer")}
    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === "by-lecturer" ? "bg-white text-blue-700 shadow-2xs font-black" : "text-slate-600 hover:text-slate-900"}`}
  >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Danh sách theo Giảng viên</span>
            <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] rounded-full">
              Chính
            </span>
          </button>

          <button
    onClick={() => setActiveTab("matrix")}
    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === "matrix" ? "bg-white text-blue-700 shadow-2xs font-black" : "text-slate-600 hover:text-slate-900"}`}
  >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Ghép nối &amp; Phân công mới</span>
            {unassignedStudents.length > 0 && <span className="px-1.5 py-0.2 bg-orange-100 text-orange-800 text-[10px] rounded-full">
                {unassignedStudents.length}
              </span>}
          </button>

          <button
    onClick={() => setActiveTab("stats")}
    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === "stats" ? "bg-white text-blue-700 shadow-2xs font-black" : "text-slate-600 hover:text-slate-900"}`}
  >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Thống kê &amp; Cân bằng tải</span>
          </button>
        </div>

      </section>

      {
    /* TAB 1: DANH SÁCH SINH VIÊN THEO GIẢNG VIÊN (MAIN FEATURE REQUIRED BY USER) */
  }
      {activeTab === "by-lecturer" && <div className="space-y-6">
          
          {
    /* View Mode Toggle: Single Lecturer Workspace vs Accordion All Cards */
  }
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Chế độ hiển thị danh sách:</span>
              <button
    onClick={() => setGroupViewMode("single")}
    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${groupViewMode === "single" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}
  >
                Xem theo từng Giảng viên
              </button>
              <button
    onClick={() => setGroupViewMode("accordion")}
    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${groupViewMode === "accordion" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}
  >
                Xem toàn bộ Danh sách Accordion
              </button>
            </div>

            <span className="text-xs font-medium text-slate-500">
              Đang chọn: <strong className="text-slate-900">{activeLecturerObj.fullName}</strong> ({activeLecturerStudents.length} sinh viên)
            </span>
          </div>

          {
    /* MODE 1: SINGLE LECTURER SPLIT WORKSPACE */
  }
          {groupViewMode === "single" && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {
    /* LEFT SIDEBAR: LECTURER DIRECTORY (4 COLUMNS) */
  }
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 tracking-tight">
                      Danh sách Giảng viên ({filteredLecturers.length})
                    </h2>
                    <p className="text-[11px] text-slate-500">Chọn giảng viên để xem sinh viên hướng dẫn</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black rounded-md">
                    Học kỳ I
                  </span>
                </div>

                {
    /* Filters */
  }
                <div className="space-y-2 text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
    type="text"
    value={lecturerSearch}
    onChange={(e) => setLecturerSearch(e.target.value)}
    placeholder="Tìm tên hoặc Mã GV..."
    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-blue-500"
  />
                  </div>

                  <select
    value={lecturerDeptFilter}
    onChange={(e) => setLecturerDeptFilter(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer text-xs"
  >
                    <option value="all">Tất cả Bộ môn</option>
                    <option value="Công nghệ Phần mềm">BM CNPM</option>
                    <option value="Mạng máy tính & TTTT">BM MMT</option>
                    <option value="Hệ thống Thông tin">BM HTTT</option>
                  </select>
                </div>

                {
    /* Lecturer List Item Cards */
  }
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {filteredLecturers.map((lec) => {
    const isSelected = selectedLecturerId === lec.id;
    const count = students.filter((s) => s.assignmentStatus === "assigned" && s.assignedLecturerId === lec.id).length;
    const styleColor = getWorkloadColor(count, lec.maxCapacity);
    const percentage = Math.round(count / lec.maxCapacity * 100);
    return <div
      key={lec.id}
      onClick={() => {
        setSelectedLecturerId(lec.id);
        setSelectedAssignedStudentIds([]);
      }}
      className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${isSelected ? "bg-blue-50/90 border-blue-600 shadow-sm ring-2 ring-blue-500/20" : "bg-white hover:bg-slate-50 border-slate-200/80"}`}
    >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-700 to-blue-800 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {lec.fullName.split(" ").slice(-1)[0][0]}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-xs">{lec.fullName}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{lec.department}</p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${styleColor.badge} shrink-0`}>
                            {count} / {lec.maxCapacity} SV
                          </span>
                        </div>

                        {
      /* Capacity Progress */
    }
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
      className={`h-full rounded-full transition-all duration-300 ${styleColor.bar}`}
      style={{ width: `${Math.min(percentage, 100)}%` }}
    />
                        </div>
                      </div>;
  })}
                </div>

              </div>

              {
    /* RIGHT MAIN AREA: ASSIGNED STUDENTS TABLE UNDER ACTIVE LECTURER (8 COLUMNS) */
  }
              <div className="lg:col-span-8 space-y-5">
                
                {
    /* LECTURER BANNER CARD */
  }
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg border border-white/20 shrink-0">
                        {activeLecturerObj.fullName.split(" ").slice(-1)[0][0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black text-white">{activeLecturerObj.fullName}</h2>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black rounded-md">
                            {activeLecturerObj.employeeId}
                          </span>
                        </div>
                        <p className="text-xs text-blue-200 font-medium mt-0.5">
                          {activeLecturerObj.title} • Bộ môn {activeLecturerObj.department}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-2">
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> {activeLecturerObj.email}</span>
                        </div>
                      </div>
                    </div>

                    {
    /* Workload Progress Badge */
  }
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-right space-y-1 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">Khối lượng hướng dẫn</span>
                      <p className="text-2xl font-black text-white">
                        {activeLecturerStudents.length} <span className="text-xs font-normal text-slate-300">/ {activeLecturerObj.maxCapacity} SV</span>
                      </p>
                      <p className="text-[10px] text-emerald-300 font-bold">
                        Còn nhận được {Math.max(0, activeLecturerObj.maxCapacity - activeLecturerStudents.length)} sinh viên nữa
                      </p>
                    </div>
                  </div>

                  {
    /* LECTURER WORKSPACE TOOLBAR */
  }
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    
                    {
    /* Search & Class Filter */
  }
                    <div className="flex items-center gap-2">
                      <div className="relative w-48">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
    type="text"
    value={assignedStudentSearch}
    onChange={(e) => setAssignedStudentSearch(e.target.value)}
    placeholder="Lọc sinh viên của GV..."
    className="w-full pl-7 pr-3 py-1.5 bg-white/10 border border-white/10 rounded-xl font-medium text-white placeholder-slate-400 outline-none focus:bg-white/20"
  />
                      </div>

                      <select
    value={assignedClassFilter}
    onChange={(e) => setAssignedClassFilter(e.target.value)}
    className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-xl font-bold text-white outline-none cursor-pointer"
  >
                        <option value="all" className="text-slate-900">Tất cả Lớp</option>
                        <option value="20CNTT1" className="text-slate-900">20CNTT1</option>
                        <option value="20CNTT2" className="text-slate-900">20CNTT2</option>
                        <option value="20KTPM1" className="text-slate-900">20KTPM1</option>
                        <option value="20KTPM2" className="text-slate-900">20KTPM2</option>
                        <option value="20MMT1" className="text-slate-900">20MMT1</option>
                        <option value="20HTTT1" className="text-slate-900">20HTTT1</option>
                      </select>
                    </div>

                    {
    /* Action Buttons for Lecturer's Students */
  }
                    <div className="flex items-center gap-2">
                      <button
    onClick={() => setShowAddStudentModal(true)}
    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
                        <Plus className="w-4 h-4" />
                        <span>Thêm SV hướng dẫn</span>
                      </button>

                      {selectedAssignedStudentIds.length > 0 && <>
                          <button
    onClick={() => setShowReassignModal(true)}
    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl transition-colors flex items-center gap-1.5"
  >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            <span>Chuyển GV ({selectedAssignedStudentIds.length})</span>
                          </button>

                          <button
    onClick={handleBulkUnassign}
    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl transition-colors flex items-center gap-1.5"
  >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Hủy phân công ({selectedAssignedStudentIds.length})</span>
                          </button>
                        </>}
                    </div>

                  </div>
                </div>

                {
    /* TABLE OF ASSIGNED STUDENTS UNDER SELECTED LECTURER */
  }
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        Danh sách sinh viên trực tiếp hướng dẫn ({filteredActiveLecturerStudents.length})
                      </h3>
                    </div>

                    <span className="text-xs font-bold text-slate-500">
                      Học kỳ I (2025 - 2026)
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3 text-center w-10">
                            <input
    type="checkbox"
    checked={filteredActiveLecturerStudents.length > 0 && filteredActiveLecturerStudents.every((s) => selectedAssignedStudentIds.includes(s.id))}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedAssignedStudentIds(filteredActiveLecturerStudents.map((s) => s.id));
      } else {
        setSelectedAssignedStudentIds([]);
      }
    }}
    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
  />
                          </th>
                          <th className="py-2.5 px-3">MSSV</th>
                          <th className="py-2.5 px-3">Họ và tên</th>
                          <th className="py-2.5 px-3">Lớp / Chuyên ngành</th>
                          <th className="py-2.5 px-3">Doanh nghiệp thực tập</th>
                          <th className="py-2.5 px-3">Ngày phân công</th>
                          <th className="py-2.5 px-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredActiveLecturerStudents.length === 0 ? <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                              <UserX className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="font-bold text-slate-700">Chưa có sinh viên nào được phân công cho giảng viên này!</p>
                              <p className="text-xs text-slate-400 mt-0.5">Nhấn "Thêm SV hướng dẫn" để gán sinh viên cho giảng viên.</p>
                            </td>
                          </tr> : filteredActiveLecturerStudents.map((st) => {
    const isSelected = selectedAssignedStudentIds.includes(st.id);
    return <tr
      key={st.id}
      className={`transition-colors hover:bg-slate-50/80 ${isSelected ? "bg-blue-50/70" : ""}`}
    >
                                <td className="py-3 px-3 text-center">
                                  <input
      type="checkbox"
      checked={isSelected}
      onChange={() => {
        setSelectedAssignedStudentIds(
          (prev) => prev.includes(st.id) ? prev.filter((id) => id !== st.id) : [...prev, st.id]
        );
      }}
      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
                                </td>

                                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                                  {st.studentId}
                                </td>

                                <td className="py-3 px-3">
                                  <p className="font-extrabold text-slate-900 text-xs">{st.fullName}</p>
                                  {st.gpa && <p className="text-[10px] text-slate-400 font-medium">GPA: {st.gpa}</p>}
                                </td>

                                <td className="py-3 px-3">
                                  <span className="font-bold text-slate-800 block">{st.classCode}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{st.major}</span>
                                </td>

                                <td className="py-3 px-3 font-medium text-slate-800">
                                  {st.companyName ? <span className="flex items-center gap-1 font-bold text-slate-800">
                                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      {st.companyName}
                                    </span> : <span className="text-slate-400 italic">Chưa đăng ký</span>}
                                </td>

                                <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">
                                  {st.assignedDate || "10/01/2025"}
                                </td>

                                <td className="py-3 px-3 text-right space-x-1">
                                  <button
      onClick={() => handleUnassignStudent(st.id, st.fullName)}
      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200 transition-colors"
      title="Hủy phân công sinh viên khỏi giảng viên này"
    >
                                    Hủy phân công
                                  </button>
                                </td>
                              </tr>;
  })}
                      </tbody>
                    </table>
                  </div>

                  {
    /* Summary Bar */
  }
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                    <span>
                      Đang hiển thị <strong>{filteredActiveLecturerStudents.length}</strong> / <strong>{activeLecturerStudents.length}</strong> sinh viên hướng dẫn
                    </span>
                    <button
    onClick={handleExportExcel}
    className="text-blue-600 hover:underline font-bold flex items-center gap-1"
  >
                      <Download className="w-3.5 h-3.5" /> Export danh sách (.xlsx)
                    </button>
                  </div>

                </div>

              </div>

            </div>}

          {
    /* MODE 2: ACCORDION GRID FOR ALL LECTURERS AND THEIR ASSIGNED STUDENTS */
  }
          {groupViewMode === "accordion" && <div className="space-y-4">
              {filteredLecturers.map((lec) => {
    const lecStudents = students.filter((s) => s.assignmentStatus === "assigned" && s.assignedLecturerId === lec.id);
    const isExpanded = expandedLecturerIds.includes(lec.id);
    const styleColor = getWorkloadColor(lecStudents.length, lec.maxCapacity);
    return <div key={lec.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    
                    {
      /* ACCORDION HEADER */
    }
                    <div
      onClick={() => toggleAccordionLecturer(lec.id)}
      className="p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60"
    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-blue-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {lec.fullName.split(" ").slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 text-sm">{lec.fullName}</h3>
                            <span className="text-xs font-mono font-bold text-slate-400">({lec.employeeId})</span>
                            <span className="text-xs text-slate-500">• {lec.department}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{lec.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${styleColor.badge}`}>
                          {lecStudents.length} / {lec.maxCapacity} Sinh viên hướng dẫn
                        </span>

                        <div className="p-1 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {
      /* ACCORDION BODY: STUDENT LIST */
    }
                    {isExpanded && <div className="p-4 space-y-3 animate-in fade-in">
                        {lecStudents.length === 0 ? <div className="p-6 text-center text-slate-400 text-xs font-medium">
                            Chưa có sinh viên nào được gán cho giảng viên này.
                          </div> : <div className="overflow-x-auto border border-slate-200 rounded-xl">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                                  <th className="py-2 px-3">MSSV</th>
                                  <th className="py-2 px-3">Họ tên</th>
                                  <th className="py-2 px-3">Lớp</th>
                                  <th className="py-2 px-3">Chuyên ngành</th>
                                  <th className="py-2 px-3">Doanh nghiệp</th>
                                  <th className="py-2 px-3">Ngày PC</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {lecStudents.map((st) => <tr key={st.id} className="hover:bg-slate-50">
                                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{st.studentId}</td>
                                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{st.fullName}</td>
                                    <td className="py-2.5 px-3 font-bold text-slate-800">{st.classCode}</td>
                                    <td className="py-2.5 px-3 text-slate-600">{st.major}</td>
                                    <td className="py-2.5 px-3 font-medium text-slate-800">{st.companyName || "Ch\u01B0a \u0111\u0103ng k\xFD"}</td>
                                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{st.assignedDate || "10/01/2025"}</td>
                                  </tr>)}
                              </tbody>
                            </table>
                          </div>}
                      </div>}

                  </div>;
  })}
            </div>}

        </div>}

      {
    /* TAB 2: GHÉP NỐI & PHÂN CÔNG MỚI (PAIRING MATRIX WORKSPACE) */
  }
      {activeTab === "matrix" && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {
    /* MAIN UNASSIGNED QUEUE (8 COLUMNS) */
  }
          <div className="lg:col-span-8 space-y-6">
            
            <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Hàng chờ sinh viên chưa phân công ({unassignedStudents.length})
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Tích chọn sinh viên bên dưới để ghép nối với giảng viên hướng dẫn.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
    onClick={() => setSelectedUnassignedIds(filteredUnassignedStudents.map((s) => s.id))}
    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
  >
                    Chọn tất cả ({filteredUnassignedStudents.length})
                  </button>

                  {selectedUnassignedIds.length > 0 && <button
    onClick={() => setSelectedUnassignedIds([])}
    className="text-xs font-bold text-rose-600 hover:underline px-2"
  >
                      Bỏ chọn ({selectedUnassignedIds.length})
                    </button>}
                </div>
              </div>

              {
    /* Filters Bar */
  }
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
    type="text"
    value={studentSearch}
    onChange={(e) => {
      setStudentSearch(e.target.value);
      setCurrentPage(1);
    }}
    placeholder="MSSV hoặc Họ tên..."
    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-blue-500"
  />
                </div>

                <select
    value={classFilter}
    onChange={(e) => {
      setClassFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                  <option value="all">Tất cả Lớp học</option>
                  <option value="20CNTT1">20CNTT1</option>
                  <option value="20CNTT2">20CNTT2</option>
                  <option value="20KTPM1">20KTPM1</option>
                  <option value="20KTPM2">20KTPM2</option>
                  <option value="20MMT1">20MMT1</option>
                  <option value="20HTTT1">20HTTT1</option>
                </select>

                <select
    value={majorFilter}
    onChange={(e) => {
      setMajorFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                  <option value="all">Tất cả Chuyên ngành</option>
                  <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
                  <option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm</option>
                  <option value="Mạng máy tính & TTTT">Mạng máy tính & TTTT</option>
                  <option value="Hệ thống Thông tin">Hệ thống Thông tin</option>
                </select>

                <select
    value={companyFilter}
    onChange={(e) => {
      setCompanyFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                  <option value="all">Tất cả Doanh nghiệp</option>
                  <option value="FPT">FPT Software</option>
                  <option value="VNG">VNG Corporation</option>
                  <option value="Viettel">Viettel Telecom</option>
                  <option value="TMA">TMA Solutions</option>
                </select>
              </div>

              {
    /* Table */
  }
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                      <th className="py-2.5 px-3 text-center w-10">Chọn</th>
                      <th className="py-2.5 px-3">MSSV</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Lớp / Ngành</th>
                      <th className="py-2.5 px-3">Doanh nghiệp thực tập</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedUnassignedStudents.length === 0 ? <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                          <UserX className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-600">Không còn sinh viên chưa phân công nào khớp bộ lọc!</p>
                        </td>
                      </tr> : paginatedUnassignedStudents.map((st) => {
    const isSelected = selectedUnassignedIds.includes(st.id);
    return <tr
      key={st.id}
      onClick={() => {
        setSelectedUnassignedIds(
          (prev) => prev.includes(st.id) ? prev.filter((id) => id !== st.id) : [...prev, st.id]
        );
      }}
      className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50/80 hover:bg-blue-100/80" : "hover:bg-slate-50"}`}
    >
                            <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
      type="checkbox"
      checked={isSelected}
      onChange={() => {
        setSelectedUnassignedIds(
          (prev) => prev.includes(st.id) ? prev.filter((id) => id !== st.id) : [...prev, st.id]
        );
      }}
      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
                            </td>

                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{st.studentId}</td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900">{st.fullName}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-slate-800 block">{st.classCode}</span>
                              <span className="text-[10px] text-slate-400">{st.major}</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 font-medium">
                              {st.companyName ? <span className="flex items-center gap-1 font-bold text-slate-800">
                                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" /> {st.companyName}
                                </span> : <span className="text-slate-400 italic">Chưa đăng ký</span>}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black rounded-md inline-block">
                                Chưa phân công
                              </span>
                            </td>
                          </tr>;
  })}
                  </tbody>
                </table>
              </div>

              {
    /* Pagination Controls */
  }
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100 font-medium text-slate-600">
                <span>Hiển thị {paginatedUnassignedStudents.length} / {filteredUnassignedStudents.length} sinh viên</span>
                <div className="flex items-center gap-1.5 font-extrabold">
                  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40"
  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-slate-800">
                    {currentPage} / {totalPages}
                  </span>
                  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40"
  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </section>

            {
    /* CONFIRMATION PREVIEW CARD */
  }
            <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h2 className="text-base font-black text-white">Xác nhận Ghép nối Phân công</h2>
                </div>
                <span className="text-xs text-blue-200 font-bold">
                  {selectedUnassignedIds.length} sinh viên được chọn
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-300">Giảng viên nhận hướng dẫn</span>
                  <p className="text-base font-black text-white">{activeLecturerObj.fullName}</p>
                  <p className="text-blue-200">{activeLecturerObj.title} • {activeLecturerObj.department}</p>
                </div>

                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-300">Sức chứa sau phân công</span>
                  <p className="text-base font-black text-emerald-400">
                    {activeLecturerStudents.length + selectedUnassignedIds.length} / {activeLecturerObj.maxCapacity} SV
                  </p>
                  <p className="text-slate-300">Chỉ tiêu an toàn theo quy định Khoa</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
    onClick={() => setSelectedUnassignedIds([])}
    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl"
  >
                  Hủy lựa chọn
                </button>
                <button
    onClick={handleConfirmMatrixAssignment}
    disabled={selectedUnassignedIds.length === 0}
    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
  >
                  <Check className="w-4 h-4" />
                  <span>Xác nhận phân công ngay</span>
                </button>
              </div>
            </section>

          </div>

          {
    /* RIGHT SIDEBAR: SELECT LECTURER TARGET FOR PAIRING (4 COLUMNS) */
  }
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs inline-flex items-center justify-center mr-1.5">
                  2
                </span>
                <span className="text-sm font-black text-slate-900">Chọn Giảng viên tiếp nhận</span>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredLecturers.map((lec) => {
    const isSelected = selectedLecturerId === lec.id;
    const count = students.filter((s) => s.assignmentStatus === "assigned" && s.assignedLecturerId === lec.id).length;
    const styleColor = getWorkloadColor(count, lec.maxCapacity);
    return <div
      key={lec.id}
      onClick={() => setSelectedLecturerId(lec.id)}
      className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${isSelected ? "bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-500/20" : "bg-white hover:bg-slate-50 border-slate-200"}`}
    >
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-slate-900 text-xs">{lec.fullName}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${styleColor.badge}`}>
                        {count} / {lec.maxCapacity} SV
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{lec.title} • {lec.department}</p>
                  </div>;
  })}
            </div>
          </div>

        </div>}

      {
    /* TAB 3: THỐNG KÊ & CÂN BẰNG TẢI */
  }
      {activeTab === "stats" && <div className="space-y-6">
          
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-black text-slate-900 tracking-tight">Cân bằng Khối lượng Hướng dẫn (Workload Analytics)</h2>
              </div>
              <span className="text-xs font-bold text-slate-500">Học kỳ I (2025 - 2026)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {
    /* Top Highest Workload */
  }
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-rose-700 tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Top Giảng viên tải cao nhất (Gần đầy slot)
                </h3>
                <div className="space-y-2">
                  {topHighestWorkload.map((lec) => {
    const count = students.filter((s) => s.assignmentStatus === "assigned" && s.assignedLecturerId === lec.id).length;
    const ratio = Math.round(count / lec.maxCapacity * 100);
    return <div key={lec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-extrabold text-slate-900">{lec.fullName}</p>
                          <p className="text-[10px] text-slate-500">{lec.department}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-slate-900">{count}/{lec.maxCapacity} SV</span>
                          <span className="block text-[10px] font-bold text-rose-600">{ratio}% tải</span>
                        </div>
                      </div>;
  })}
                </div>
              </div>

              {
    /* Top Lowest Workload */
  }
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Top Giảng viên còn nhiều chỉ tiêu nhất
                </h3>
                <div className="space-y-2">
                  {topLowestWorkload.map((lec) => {
    const count = students.filter((s) => s.assignmentStatus === "assigned" && s.assignedLecturerId === lec.id).length;
    const remaining = lec.maxCapacity - count;
    return <div key={lec.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-extrabold text-slate-900">{lec.fullName}</p>
                          <p className="text-[10px] text-slate-500">{lec.department}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-emerald-800">Còn nhận {remaining} SV</span>
                          <span className="block text-[10px] font-bold text-emerald-600">{count}/{lec.maxCapacity} SV</span>
                        </div>
                      </div>;
  })}
                </div>
              </div>

            </div>
          </section>

          {
    /* RECENT LOG FEED */
  }
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-black text-slate-900 tracking-tight">Nhật ký Phân công gần đây</h2>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {recentAssignments.map((log) => <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-slate-900">
                      Phân công <span className="text-blue-700">{log.studentCount} sinh viên</span> cho <span className="text-indigo-900">{log.lecturerName}</span>
                    </p>
                    <p className="text-[10px] text-slate-500">Lớp: {log.classGroups.join(", ")} • Thực hiện bởi: {log.assignedBy}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{log.timestamp}</span>
                </div>)}
            </div>
          </section>

        </div>}

      {
    /* MODAL 1: ADD UNASSIGNED STUDENTS DIRECTLY TO ACTIVE LECTURER */
  }
      {showAddStudentModal && <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Thêm sinh viên cho {activeLecturerObj.fullName}</h3>
                <p className="text-xs text-slate-500">Chọn sinh viên chưa có giảng viên hướng dẫn</p>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {unassignedStudents.length === 0 ? <p className="text-center text-slate-400 py-8 font-medium">Tất cả sinh viên đã được phân công!</p> : unassignedStudents.map((st) => <div
    key={st.id}
    onClick={() => handleAddStudentsToCurrentLecturer([st.id])}
    className="p-3 bg-slate-50 hover:bg-blue-50/80 rounded-xl border border-slate-200 cursor-pointer transition-colors flex items-center justify-between"
  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{st.studentId}</span>
                        <span className="font-extrabold text-slate-900">{st.fullName}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{st.classCode} • {st.major}</p>
                    </div>

                    <button className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-lg">
                      + Phân công ngay
                    </button>
                  </div>)}
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                Đóng
              </button>
            </div>
          </div>
        </div>}

      {
    /* MODAL 2: REASSIGN LECTURER */
  }
      {showReassignModal && <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Chuyển Giảng viên Hướng dẫn</h3>
                <p className="text-xs text-slate-500">Đang chọn {selectedAssignedStudentIds.length} sinh viên để điều chuyển</p>
              </div>
              <button onClick={() => setShowReassignModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-800">Chọn Giảng viên tiếp nhận mới *</label>
              <select
    value={targetReassignLecturerId}
    onChange={(e) => setTargetReassignLecturerId(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  >
                {lecturers.filter((l) => l.id !== activeLecturerObj.id).map((l) => <option key={l.id} value={l.id}>
                    {l.fullName} — [{l.currentCount}/{l.maxCapacity} SV]
                  </option>)}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowReassignModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                Hủy
              </button>
              <button onClick={handleExecuteReassign} className="px-4 py-2 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-xs">
                Xác nhận chuyển
              </button>
            </div>
          </div>
        </div>}

      {
    /* MODAL 3: BATCH AUTO ASSIGNMENT */
  }
      {showBatchModal && <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-base">Phân công Tự động Thông minh</h3>
              </div>
              <button onClick={() => setShowBatchModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div
    onClick={() => setBatchStrategy("department")}
    className={`p-3.5 rounded-xl border cursor-pointer ${batchStrategy === "department" ? "bg-indigo-50 border-indigo-600" : "bg-slate-50 border-slate-200"}`}
  >
                <p className="font-black text-slate-900">Ghép nối theo Chuyên ngành &amp; Bộ môn</p>
                <p className="text-slate-500 text-[11px]">Ưu tiên xếp sinh viên chuyên ngành phù hợp với bộ môn của giảng viên.</p>
              </div>

              <div
    onClick={() => setBatchStrategy("even")}
    className={`p-3.5 rounded-xl border cursor-pointer ${batchStrategy === "even" ? "bg-indigo-50 border-indigo-600" : "bg-slate-50 border-slate-200"}`}
  >
                <p className="font-black text-slate-900">Phân bổ đều theo Chỉ tiêu trống</p>
                <p className="text-slate-500 text-[11px]">Chia đều số sinh viên chưa phân công cho các giảng viên còn slot.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowBatchModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                Hủy
              </button>
              <button onClick={handleRunBatchAssignment} disabled={isLoading} className="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-xs">
                {isLoading ? "\u0110ang ph\xE2n b\u1ED5..." : "Ch\u1EA1y ph\xE2n c\xF4ng t\u1EF1 \u0111\u1ED9ng"}
              </button>
            </div>
          </div>
        </div>}

      {
    /* MODAL 4: HISTORY LOG */
  }
      {showHistoryModal && <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">Lịch sử Phân công Hướng dẫn</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
              {recentAssignments.map((log) => <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-black text-slate-900">
                    <span>{log.lecturerName}</span>
                    <span className="text-blue-700">{log.studentCount} Sinh viên</span>
                  </div>
                  <p className="text-slate-600">Phân nhóm: {log.classGroups.join(", ")}</p>
                  <p className="text-[10px] text-slate-400">Thực hiện: {log.assignedBy} • {log.timestamp}</p>
                </div>)}
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button onClick={() => setShowHistoryModal(false)} className="px-4 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl">
                Đóng
              </button>
            </div>
          </div>
        </div>}

    </div>;
};

export { AssignmentsView as AdminAssignmentsView };
