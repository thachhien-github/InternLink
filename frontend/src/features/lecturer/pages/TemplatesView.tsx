import { useState, useMemo, useEffect } from "react";
import { Toast } from "../../../components/common/Toast";
import { PageHeader } from "../../../components/common/PageHeader";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import {
  FileText,
  Download,
  Eye,
  Search,
  FileCheck,
  FolderOpen,
  Edit,
  Trash2,
  BookOpen,
  CloudUpload,
  LayoutGrid,
  List,
} from "lucide-react";
import { UploadDocumentWorkspace } from "../components/UploadDocumentWorkspace";
import { StudentDocumentLibrary } from "../components/StudentDocumentLibrary";
import { DocumentDetailWorkspace } from "../components/DocumentDetailWorkspace";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapDocumentListItemToUi } from "../../../lib/documentMappers";
import { documentService } from "../../../services/document.service";
import { lecturerInternshipsService } from "../../../services/lecturerInternships.service";
const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    title:
      "M\u1EABu B\xE1o c\xE1o Th\u1EF1c t\u1EADp Gi\u1EEFa k\u1EF3 & Cu\u1ED1i k\u1EF3 (Chu\u1EA9n 2026)",
    category: "B\xE1o c\xE1o",
    fileType: "DOCX",
    fileSize: "1.4 MB",
    version: "v2.1",
    isLatest: true,
    updatedAt: "20/10/2026",
    uploader: "TS. Nguy\u1EC5n V\u0103n H\xF9ng",
    uploaderRole: "Tr\u01B0\u1EDFng BM C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
    downloads: 1420,
    semester: "HK I - 2026",
    major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
    status: "\u0110ang \xE1p d\u1EE5ng",
    description:
      "Quy chu\u1EA9n tr\xECnh b\xE0y b\xE1o c\xE1o th\u1EF1c t\u1EADp t\u1ED1t nghi\u1EC7p n\u0103m h\u1ECDc 2025-2026 d\xE0nh cho sinh vi\xEAn Khoa CNTT.",
    versionHistory: [
      {
        version: "v2.1",
        date: "20/10/2026",
        author: "TS. Nguy\u1EC5n V\u0103n H\xF9ng",
        note: "C\u1EADp nh\u1EADt ti\xEAu chu\u1EA9n ch\u1EA5m \u0111i\u1EC3m v\xE0 ph\u1EE5 l\u1EE5c nh\u1EADn x\xE9t",
      },
      {
        version: "v2.0",
        date: "15/08/2026",
        author: "ThS. Tr\u1EA7n Minh Tu\u1EA5n",
        note: "B\u1ED5 sung ph\u1EA7n \u0111\xE1nh gi\xE1 k\u1EF9 n\u0103ng m\u1EC1m",
      },
      {
        version: "v1.0",
        date: "10/01/2025",
        author: "TS. Nguy\u1EC5n V\u0103n H\xF9ng",
        note: "Phi\xEAn b\u1EA3n ban \u0111\u1EA7u",
      },
    ],
  },
  {
    id: "doc-2",
    title:
      "Phi\u1EBFu Nh\u1EADn x\xE9t & \u0110\xE1nh gi\xE1 Sinh vi\xEAn t\u1EEB Doanh nghi\u1EC7p (Mentor)",
    category: "Bi\u1EC3u m\u1EABu",
    fileType: "PDF",
    fileSize: "320 KB",
    version: "v2.0",
    isLatest: true,
    updatedAt: "18/10/2026",
    uploader: "ThS. Ph\u1EA1m Th\u1ECB Mai",
    uploaderRole: "Ph\u1EE5 tr\xE1ch Quan h\u1EC7 Doanh nghi\u1EC7p",
    downloads: 1150,
    semester: "HK I - 2026",
    major: "T\u1EA5t c\u1EA3 ng\xE0nh",
    status: "\u0110ang \xE1p d\u1EE5ng",
    description:
      "M\u1EABu \u0111\xE1nh gi\xE1 d\xE0nh cho Mentor doanh nghi\u1EC7p x\xE1c nh\u1EADn th\u1EDDi gian l\xE0m vi\u1EC7c, th\xE1i \u0111\u1ED9 v\xE0 n\u0103ng l\u1EF1c sinh vi\xEAn.",
    versionHistory: [
      {
        version: "v2.0",
        date: "18/10/2026",
        author: "ThS. Ph\u1EA1m Th\u1ECB Mai",
        note: "C\u1EADp nh\u1EADt thang \u0111i\u1EC3m 100 v\xE0 ma tr\u1EADn k\u1EF9 n\u0103ng",
      },
      {
        version: "v1.0",
        date: "05/02/2025",
        author: "ThS. Ph\u1EA1m Th\u1ECB Mai",
        note: "Phi\xEAn b\u1EA3n kh\u1EDFi t\u1EA1o",
      },
    ],
  },
  {
    id: "doc-3",
    title:
      "Nh\u1EADt k\xFD Th\u1EF1c t\u1EADp H\xE0ng tu\u1EA7n (Weekly Work Log)",
    category: "Nh\u1EADt k\xFD",
    fileType: "DOCX",
    fileSize: "450 KB",
    version: "v1.5",
    isLatest: true,
    updatedAt: "15/10/2026",
    uploader: "TS. L\xEA Ho\xE0ng Nam",
    uploaderRole: "Gi\u1EA3ng vi\xEAn H\u01B0\u1EDBng d\u1EABn",
    downloads: 980,
    semester: "HK I - 2026",
    major: "Khoa h\u1ECDc D\u1EEF li\u1EC7u",
    status: "\u0110ang \xE1p d\u1EE5ng",
    description:
      "M\u1EABu ghi nh\u1EADn c\xF4ng vi\u1EC7c h\xE0ng tu\u1EA7n sinh vi\xEAn c\u1EA7n g\u1EEDi GVHD \u0111\u1ECBnh k\u1EF3 qua h\u1EC7 th\u1ED1ng.",
    versionHistory: [
      {
        version: "v1.5",
        date: "15/10/2026",
        author: "TS. L\xEA Ho\xE0ng Nam",
        note: "Chu\u1EA9n h\xF3a \u0111\u1ECBnh d\u1EA1ng b\u1EA3ng m\xE3 h\xF3a",
      },
    ],
  },
  {
    id: "doc-4",
    title:
      "K\u1EBF ho\u1EA1ch T\u1ED5 ch\u1EE9c B\u1EA3o v\u1EC7 B\xE1o c\xE1o Th\u1EF1c t\u1EADp HK I - 2026",
    category: "K\u1EBF ho\u1EA1ch",
    fileType: "PDF",
    fileSize: "890 KB",
    version: "v1.0",
    isLatest: true,
    updatedAt: "10/10/2026",
    uploader: "PGS. TS. Tr\u1EA7n Qu\u1ED1c B\u1EA3o",
    uploaderRole: "Tr\u01B0\u1EDFng Khoa CNTT",
    downloads: 850,
    semester: "HK I - 2026",
    major: "T\u1EA5t c\u1EA3 ng\xE0nh",
    status: "\u0110ang \xE1p d\u1EE5ng",
    description:
      "Th\xF4ng b\xE1o m\u1ED1c th\u1EDDi gian n\u1ED9p b\xE1o c\xE1o, danh s\xE1ch h\u1ED9i \u0111\u1ED3ng b\u1EA3o v\u1EC7 v\xE0 \u0111\u1ECBa \u0111i\u1EC3m ch\u1EA5m.",
    versionHistory: [
      {
        version: "v1.0",
        date: "10/10/2026",
        author: "PGS. TS. Tr\u1EA7n Qu\u1ED1c B\u1EA3o",
        note: "Ban h\xE0nh ch\xEDnh th\u1EE9c",
      },
    ],
  },
  {
    id: "doc-5",
    title:
      "H\u01B0\u1EDBng d\u1EABn Tr\xECnh b\xE0y Slide B\u1EA3o v\u1EC7 Th\u1EF1c t\u1EADp Tr\u01B0\u1EDBc H\u1ED9i \u0111\u1ED3ng",
    category: "H\u01B0\u1EDBng d\u1EABn",
    fileType: "PPTX",
    fileSize: "3.2 MB",
    version: "v1.2",
    isLatest: true,
    updatedAt: "08/10/2026",
    uploader: "ThS. \u0110\u1ED7 Anh D\u0169ng",
    uploaderRole: "Gi\u1EA3ng vi\xEAn H\u01B0\u1EDBng d\u1EABn",
    downloads: 740,
    semester: "HK I - 2026",
    major: "T\u1EA5t c\u1EA3 ng\xE0nh",
    status: "\u0110ang \xE1p d\u1EE5ng",
    description:
      "Template slide m\u1EABu chu\u1EA9n nh\u1EADn di\u1EC7n Khoa CNTT k\xE8m h\u01B0\u1EDBng d\u1EABn thuy\u1EBFt tr\xECnh 10 ph\xFAt.",
    versionHistory: [
      {
        version: "v1.2",
        date: "08/10/2026",
        author: "ThS. \u0110\u1ED7 Anh D\u0169ng",
        note: "C\u1EADp nh\u1EADt m\xE0u chu\u1EA9n nh\u1EADn di\u1EC7n 2026",
      },
    ],
  },
  {
    id: "doc-6",
    title:
      "Quy\u1EBFt \u0111\u1ECBnh Ph\xE2n c\xF4ng Gi\u1EA3ng vi\xEAn H\u01B0\u1EDBng d\u1EABn Th\u1EF1c t\u1EADp 2026",
    category: "V\u0103n b\u1EA3n khoa",
    fileType: "PDF",
    fileSize: "1.1 MB",
    version: "v1.0",
    isLatest: true,
    updatedAt: "01/10/2026",
    uploader: "VP Khoa CNTT",
    uploaderRole: "V\u0103n ph\xF2ng Khoa",
    downloads: 620,
    semester: "HK I - 2026",
    major: "T\u1EA5t c\u1EA3 ng\xE0nh",
    status: "\u0110ang \xE1p d\u1EE5ng",
    description:
      "V\u0103n b\u1EA3n ch\xEDnh th\u1EE9c ban h\xE0nh danh s\xE1ch sinh vi\xEAn v\xE0 GVHD t\u01B0\u01A1ng \u1EE9ng.",
    versionHistory: [
      {
        version: "v1.0",
        date: "01/10/2026",
        author: "VP Khoa CNTT",
        note: "Ban h\xE0nh l\u1EA7n \u0111\u1EA7u",
      },
    ],
  },
  {
    id: "doc-7",
    title:
      "M\u1EABu Gi\u1EA5y Gi\u1EDBi thi\u1EC7u Th\u1EF1c t\u1EADp Doanh nghi\u1EC7p (Phi\u1EBFu \u0110\u0103ng k\xFD)",
    category: "Bi\u1EC3u m\u1EABu",
    fileType: "DOCX",
    fileSize: "210 KB",
    version: "v1.0",
    isLatest: false,
    updatedAt: "12/03/2024",
    uploader: "ThS. Tr\u1EA7n V\u0103n B",
    uploaderRole: "C\u1EF1u Tr\u1EE3 l\xFD \u0110\xE0o t\u1EA1o",
    downloads: 410,
    semester: "HK II - 2024",
    major: "T\u1EA5t c\u1EA3 ng\xE0nh",
    status: "C\u1EA7n c\u1EADp nh\u1EADt",
    description:
      "M\u1EABu gi\u1EA5y xin th\u1EF1c t\u1EADp t\u1EF1 t\xFAc ch\u01B0a c\u1EADp nh\u1EADt nh\u1EADn di\u1EC7n m\u1EDBi.",
    versionHistory: [
      {
        version: "v1.0",
        date: "12/03/2024",
        author: "ThS. Tr\u1EA7n V\u0103n B",
        note: "Phi\xEAn b\u1EA3n c\u0169",
      },
    ],
  },
  {
    id: "doc-8",
    title:
      "Quy ch\u1EBF An to\xE0n Th\xF4ng tin & B\u1EA3o m\u1EADt D\u1EEF li\u1EC7u Doanh nghi\u1EC7p khi Th\u1EF1c t\u1EADp",
    category: "Kh\xE1c",
    fileType: "PDF",
    fileSize: "650 KB",
    version: "v1.1",
    isLatest: true,
    updatedAt: "05/09/2026",
    uploader: "TS. V\u0169 Minh Khoa",
    uploaderRole: "Tr\u01B0\u1EDFng BM An to\xE0n Th\xF4ng tin",
    downloads: 510,
    semester: "HK I - 2026",
    major: "An to\xE0n Th\xF4ng tin",
    status: "\u0110ang \xE1p d\u1EE5ng",
    description:
      "Cam k\u1EBFt NDA v\xE0 quy \u0111\u1ECBnh tu\xE2n th\u1EE7 b\u1EA3o m\u1EADt ngu\u1ED3n m\xE3 cho sinh vi\xEAn th\u1EF1c t\u1EADp t\u1EA1i doanh nghi\u1EC7p.",
    versionHistory: [
      {
        version: "v1.1",
        date: "05/09/2026",
        author: "TS. V\u0169 Minh Khoa",
        note: "Th\xEAm \u0111i\u1EC1u kho\u1EA3n AI NDA",
      },
    ],
  },
];
export const TemplatesView = () => {
  const [documents, setDocuments] = useState(
    USE_MOCK ? INITIAL_DOCUMENTS : [],
  );
  const [defaultInternshipId, setDefaultInternshipId] = useState<string | null>(
    null,
  );
  const [isLoadingDocs, setIsLoadingDocs] = useState(!USE_MOCK);
  const [subView, setSubView] = useState("list");
  const [selectedCategory, setSelectedCategory] = useState("T\u1EA5t c\u1EA3");
  const [semesterFilter, setSemesterFilter] = useState("HK I - 2026");
  const [majorFilter, setMajorFilter] = useState("T\u1EA5t c\u1EA3");
  const [fileTypeFilter, setFileTypeFilter] = useState("T\u1EA5t c\u1EA3");
  const [statusFilter, setStatusFilter] = useState("T\u1EA5t c\u1EA3");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };

  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      setIsLoadingDocs(true);
      try {
        const [internships, docs] = await Promise.all([
          lecturerInternshipsService.getAll(),
          documentService.getAll(),
        ]);
        if (cancelled) return;
        if (internships[0]?.id) setDefaultInternshipId(internships[0].id);
        setDocuments(docs.map(mapDocumentListItemToUi));
      } catch (err) {
        showToast(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoadingDocs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description &&
          doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat =
        selectedCategory === "T\u1EA5t c\u1EA3" ||
        doc.category === selectedCategory;
      const matchesSem =
        semesterFilter === "T\u1EA5t c\u1EA3" ||
        doc.semester === semesterFilter;
      const matchesMajor =
        majorFilter === "T\u1EA5t c\u1EA3" ||
        doc.major === "T\u1EA5t c\u1EA3 ng\xE0nh" ||
        doc.major === majorFilter;
      const matchesType =
        fileTypeFilter === "T\u1EA5t c\u1EA3" ||
        doc.fileType === fileTypeFilter;
      const matchesStatus =
        statusFilter === "T\u1EA5t c\u1EA3" || doc.status === statusFilter;
      return (
        matchesSearch &&
        matchesCat &&
        matchesSem &&
        matchesMajor &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    documents,
    searchQuery,
    selectedCategory,
    semesterFilter,
    majorFilter,
    fileTypeFilter,
    statusFilter,
  ]);
  const totalDocs = documents.length;
  const formCount = documents.filter(
    (d) => d.category === "Bi\u1EC3u m\u1EABu",
  ).length;
  const guideCount = documents.filter(
    (d) =>
      d.category === "H\u01B0\u1EDBng d\u1EABn" ||
      d.category === "K\u1EBF ho\u1EA1ch",
  ).length;
  const totalDownloadsThisWeek = documents.reduce(
    (acc, curr) => acc + curr.downloads,
    0,
  );
  const handleDownload = async (doc) => {
    if (USE_MOCK) {
      setDocuments((prev) =>
        prev.map((item) =>
          item.id === doc.id ? { ...item, downloads: item.downloads + 1 } : item,
        ),
      );
      showToast(
        `Đã tải xuống phiên bản ${doc.version} của: ${doc.title}`,
      );
      return;
    }
    try {
      const { blob, filename } = await documentService.download(
        doc.id,
        doc.fileName || `${doc.title}.bin`,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Đã tải xuống: ${doc.title}`);
    } catch (err) {
      showToast(getApiErrorMessage(err));
    }
  };
  const handleDelete = async (id, title) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa tài liệu "${title}"?`,
      )
    ) {
      return;
    }
    if (USE_MOCK) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast(`Đã xóa tài liệu "${title}" khỏi hệ thống.`);
      return;
    }
    try {
      await documentService.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast(`Đã xóa tài liệu "${title}" khỏi hệ thống.`);
    } catch (err) {
      showToast(getApiErrorMessage(err));
    }
  };
  const handleSaveDocument = async (payload, isDraft = false) => {
    if (USE_MOCK) {
      if (editingDoc) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === editingDoc.id ? { ...d, ...payload } : d)),
        );
        showToast(
          isDraft
            ? "Đã lưu bản nháp cập nhật"
            : `Đã cập nhật thành công tài liệu "${payload.title}"`,
        );
      } else {
        const newDoc = {
          id: payload.id || `doc-${Date.now()}`,
          title: payload.title || "Tài liệu mới",
          category: payload.category || "Biểu mẫu",
          fileType: payload.fileType || "DOCX",
          fileSize: payload.fileSize || "1.2 MB",
          version: payload.version || "v1.0",
          isLatest: true,
          updatedAt: "Hôm nay",
          uploader: "TS. Giảng viên",
          uploaderRole: "Giảng viên Hướng dẫn",
          downloads: 0,
          semester: payload.semester || "HK I - 2026",
          major: payload.major || "Tất cả ngành",
          status: isDraft ? "Cần cập nhật" : "Đang áp dụng",
          description: payload.description,
          versionHistory: payload.versionHistory || [
            {
              version: payload.version || "v1.0",
              date: "Hôm nay",
              author: "TS. Giảng viên",
              note: "Khởi tạo tài liệu",
            },
          ],
        };
        setDocuments([newDoc, ...documents]);
        showToast(
          isDraft
            ? "Đã lưu bản nháp tài liệu"
            : `Đã phát hành thành công: ${newDoc.title}`,
        );
      }
      setEditingDoc(null);
      setSubView("list");
      return;
    }

    try {
      if (editingDoc) {
        const updated = await documentService.update(editingDoc.id, {
          title: payload.title,
          description: payload.description,
          category: payload.category,
        });
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === editingDoc.id ? mapDocumentListItemToUi(updated) : d,
          ),
        );
        showToast(`Đã cập nhật tài liệu "${payload.title}"`);
      } else {
        if (!payload.rawFile) {
          showToast("Vui lòng chọn file trước khi tải lên");
          return;
        }
        if (!defaultInternshipId) {
          showToast("Không tìm thấy đợt thực tập để gắn tài liệu");
          return;
        }
        const created = await documentService.upload({
          internshipId: defaultInternshipId,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          isRequired: false,
          file: payload.rawFile,
        });
        setDocuments((prev) => [mapDocumentListItemToUi(created), ...prev]);
        showToast(`Đã tải lên: ${created.title}`);
      }
      setEditingDoc(null);
      setSubView("list");
    } catch (err) {
      showToast(getApiErrorMessage(err));
    }
  };
  if (subView === "upload") {
    return (
      <UploadDocumentWorkspace
        initialData={editingDoc}
        onBack={() => {
          setEditingDoc(null);
          setSubView("list");
        }}
        onSave={handleSaveDocument}
      />
    );
  }
  if (subView === "student_library") {
    return (
      <StudentDocumentLibrary
        documents={documents}
        onSelectDoc={(doc) => {
          setSelectedDoc(doc);
          setSubView("detail");
        }}
        onDownloadDoc={handleDownload}
        onSwitchToLecturerView={() => setSubView("list")}
      />
    );
  }
  if (subView === "detail" && selectedDoc) {
    return (
      <DocumentDetailWorkspace
        document={selectedDoc}
        onBack={() => setSubView("list")}
        onDownload={handleDownload}
      />
    );
  }
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto animate-in fade-in duration-200 pb-16 font-sans">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <PageHeader
        icon={FolderOpen}
        title="Kho biểu mẫu & Tài liệu thực tập"
        subtitle="Quản lý, phân quyền và phát hành biểu mẫu chuẩn hóa cho sinh viên Khoa CNTT."
        actions={[
          {
            label: "+ Đăng tài liệu mới",
            icon: CloudUpload,
            onClick: () => {
              setEditingDoc(null);
              setSubView("upload");
            },
            variant: "primary",
          },
        ]}
      />

      <KpiGrid>
        <KpiCard
          tone="blue"
          title="Tổng biểu mẫu & tài liệu"
          value={totalDocs}
          unit="tài liệu"
          icon={FolderOpen}
          footer="Phát hành công khai toàn khoa"
          onClick={() => {
            setSelectedCategory("T\u1EA5t c\u1EA3");
            setStatusFilter("T\u1EA5t c\u1EA3");
            setSemesterFilter("T\u1EA5t c\u1EA3");
          }}
        />
        <KpiCard
          tone="emerald"
          title="Biểu mẫu chuẩn"
          value={formCount}
          unit="biểu mẫu"
          icon={FileText}
          footer="Báo cáo, Giấy giới thiệu, Nhật ký"
          onClick={() => {
            setSelectedCategory("Bi\u1EC3u m\u1EABu");
            setStatusFilter("T\u1EA5t c\u1EA3");
          }}
        />
        <KpiCard
          tone="sky"
          title="Hướng dẫn & Kế hoạch"
          value={guideCount}
          unit="văn bản"
          icon={FileCheck}
          footer="Cập nhật định kỳ theo học kỳ"
          onClick={() => {
            setSelectedCategory("H\u01B0\u1EDBng d\u1EABn");
            setStatusFilter("T\u1EA5t c\u1EA3");
          }}
        />
        <KpiCard
          tone="amber"
          title="Tổng lượt tải về"
          value={totalDownloadsThisWeek.toLocaleString()}
          unit="lượt"
          icon={Download}
          footer="Sử dụng bởi SV & Doanh nghiệp"
          onClick={() => {
            setSelectedCategory("T\u1EA5t c\u1EA3");
            setSemesterFilter("HK I - 2026");
            setMajorFilter("T\u1EA5t c\u1EA3");
            setFileTypeFilter("T\u1EA5t c\u1EA3");
            setStatusFilter("T\u1EA5t c\u1EA3");
            setSearchQuery("");
          }}
        />
      </KpiGrid>

      {/* SEARCH AND SYNCHRONIZED FILTERS BAR */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        {/* Header Section Label */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
              Kho tài liệu &amp; Biểu mẫu thực tập
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-200/60">
              {semesterFilter}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {(selectedCategory !== "T\u1EA5t c\u1EA3" ||
              semesterFilter !== "HK I - 2026" ||
              majorFilter !== "T\u1EA5t c\u1EA3" ||
              fileTypeFilter !== "T\u1EA5t c\u1EA3" ||
              statusFilter !== "T\u1EA5t c\u1EA3" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("T\u1EA5t c\u1EA3");
                  setSemesterFilter("HK I - 2026");
                  setMajorFilter("T\u1EA5t c\u1EA3");
                  setFileTypeFilter("T\u1EA5t c\u1EA3");
                  setStatusFilter("T\u1EA5t c\u1EA3");
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                Xóa bộ lọc
              </button>
            )}

            {/* Toggle View Mode */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                title="Chế độ Bảng"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "cards" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                title="Chế độ Thẻ"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter inputs in 1 neat row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          {/* Search input */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên tài liệu, người đăng, nội dung..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Tất cả Danh mục</option>
              <option value="Biểu mẫu">Biểu mẫu</option>
              <option value="Báo cáo">Báo cáo</option>
              <option value="Nhật ký">Nhật ký</option>
              <option value="Kế hoạch">Kế hoạch</option>
              <option value="Hướng dẫn">Hướng dẫn</option>
              <option value="Văn bản khoa">Văn bản khoa</option>
            </select>
          </div>

          <div>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Tất cả Học kỳ</option>
              <option value="HK I - 2026">HK I - 2026</option>
              <option value="HK II - 2025">HK II - 2025</option>
            </select>
          </div>

          <div>
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Tất cả Định dạng</option>
              <option value="DOCX">Mẫu DOCX (Word)</option>
              <option value="PDF">Văn bản PDF</option>
              <option value="XLSX">Bảng tính XLSX</option>
              <option value="PPTX">Slide PPTX</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Tất cả Trạng thái</option>
              <option value="Đang áp dụng">Đang áp dụng</option>
              <option value="Cần cập nhật">Cần cập nhật</option>
              <option value="Lưu trữ">Lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENT LIST / TABLE */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên tài liệu</th>
                  <th className="py-3.5 px-3">Danh mục</th>
                  <th className="py-3.5 px-3">Định dạng</th>
                  <th className="py-3.5 px-3">Phiên bản</th>
                  <th className="py-3.5 px-3">Người đăng</th>
                  <th className="py-3.5 px-3 text-center">Lượt tải</th>
                  <th className="py-3.5 px-3">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Title */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span
                          onClick={() => {
                            setSelectedDoc(doc);
                            setSubView("detail");
                          }}
                          className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer block line-clamp-1"
                        >
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Cập nhật: {doc.updatedAt} • {doc.semester}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded border border-slate-200">
                        {doc.category}
                      </span>
                    </td>

                    {/* File Type */}
                    <td className="py-3.5 px-3 font-bold text-slate-600">
                      {doc.fileType} ({doc.fileSize})
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-200">
                        {doc.version}
                      </span>
                    </td>

                    {/* Uploader */}
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800 line-clamp-1">
                        {doc.uploader}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {doc.uploaderRole}
                      </p>
                    </td>

                    {/* Downloads */}
                    <td className="py-3.5 px-3 text-center font-bold text-blue-600">
                      {doc.downloads.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 font-bold text-[10px] rounded-md border ${doc.status === "\u0110ang \xE1p d\u1EE5ng" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setSubView("detail");
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-emerald-600"
                          title="Tải xuống"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingDoc(doc);
                            setSubView("upload");
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-amber-600"
                          title="Chỉnh sửa phiên bản"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {doc.version}
                  </span>
                </div>

                <h3
                  onClick={() => {
                    setSelectedDoc(doc);
                    setSubView("detail");
                  }}
                  className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer line-clamp-2"
                >
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 font-medium line-clamp-2">
                  {doc.description ||
                    "Bi\u1EC3u m\u1EABu chu\u1EA9n ban h\xE0nh theo quy \u0111\u1ECBnh c\u1EE7a Khoa CNTT."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>
                    {doc.fileType} • {doc.fileSize}
                  </span>
                  <span>{doc.downloads.toLocaleString()} lượt tải</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setSubView("detail");
                    }}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chi tiết</span>
                  </button>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
