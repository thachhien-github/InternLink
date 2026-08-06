import { useState } from 'react';
import {
  Download,
  Search,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Eye,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
export const TemplatesView = ({
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState("T\u1EA5t c\u1EA3");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("T\u1EA5t c\u1EA3");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [templates, setTemplates] = useState([
    {
      id: "tpl-101",
      code: "BM-01/TUAN-2026",
      name: "M\u1EABu B\xE1o C\xE1o Tu\u1EA7n Th\u1EF1c T\u1EADp (.docx)",
      category: "M\u1EABu b\xE1o c\xE1o tu\u1EA7n",
      fileType: "DOCX",
      fileSize: "1.2 MB",
      version: "v2.1",
      uploadDate: "01/08/2026",
      uploaderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      uploaderRole: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      isRequired: true,
      description: "M\u1EABu bi\u1EC3u b\xE1o c\xE1o c\xF4ng vi\u1EC7c h\xE0ng tu\u1EA7n chu\u1EA9n c\u1EE7a Khoa CNTT. \u0110\xE3 c\u0103n ch\u1EC9nh l\u1EC1, trang b\xECa, khung nh\u1EADt k\xFD c\xF4ng vi\u1EC7c v\xE0 \xF4 k\xFD x\xE1c nh\u1EADn c\u1EE7a Mentor Doanh nghi\u1EC7p.",
      usageInstructions: 'T\u1EA3i file .docx v\u1EC1 m\xE1y -> \u0110i\u1EC1n th\xF4ng tin c\xF4ng vi\u1EC7c h\xE0ng tu\u1EA7n -> Xu\u1EA5t ra file .pdf -> N\u1ED9p b\xE0i t\u1EA1i trang "B\xE1o c\xE1o tu\u1EA7n".',
      downloadCount: 1420
    },
    {
      id: "tpl-102",
      code: "QC-01/THUCTAP-2026",
      name: "Quy \u0110\u1ECBnh & Quy Ch\u1EBF Th\u1EF1c T\u1EADp Doanh Nghi\u1EC7p 2026 (.pdf)",
      category: "Quy \u0111\u1ECBnh & H\u01B0\u1EDBng d\u1EABn",
      fileType: "PDF",
      fileSize: "2.5 MB",
      version: "v1.0",
      uploadDate: "15/07/2026",
      uploaderName: "Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      uploaderRole: "Ban Qu\u1EA3n l\xFD Th\u1EF1c t\u1EADp",
      isRequired: true,
      description: "T\xE0i li\u1EC7u quy \u0111\u1ECBnh ngh\u0129a v\u1EE5, quy\u1EC1n l\u1EE3i c\u1EE7a sinh vi\xEAn th\u1EF1c t\u1EADp, th\u1EDDi gian l\xE0m vi\u1EC7c t\u1ED1i thi\u1EC3u (360 gi\u1EDD), ti\xEAu ch\xED ch\u1EA5m \u0111i\u1EC3m v\xE0 quy ch\u1EBF k\u1EF7 lu\u1EADt.",
      usageInstructions: "Sinh vi\xEAn \u0111\u1ECDc k\u1EF9 tr\u01B0\u1EDBc khi b\u1EAFt \u0111\u1EA7u th\u1EF1c t\u1EADp \u0111\u1EC3 n\u1EAFm r\xF5 th\u1EDDi h\u1EA1n n\u1ED9p b\xE0i v\xE0 ti\xEAu ch\xED \u0111\xE1nh gi\xE1.",
      downloadCount: 1850
    },
    {
      id: "tpl-103",
      code: "BM-02/CUOIKY-2026",
      name: "M\u1EABu B\xE1o C\xE1o T\u1ED5ng K\u1EBFt Cu\u1ED1i K\u1EF3 (.docx)",
      category: "M\u1EABu b\xE1o c\xE1o cu\u1ED1i k\u1EF3",
      fileType: "DOCX",
      fileSize: "1.8 MB",
      version: "v1.3",
      uploadDate: "01/08/2026",
      uploaderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      uploaderRole: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      isRequired: true,
      description: "M\u1EABu b\xE1o c\xE1o t\u1ED5ng k\u1EBFt \u0111\u1EE3t th\u1EF1c t\u1EADp 3 th\xE1ng. \u0110\u1ECBnh d\u1EA1ng chu\u1EA9n Times New Roman 13pt, gi\xE3n d\xF2ng 1.5, l\u1EC1 chu\u1EA9n, m\u1EE5c l\u1EE5c t\u1EF1 \u0111\u1ED9ng v\xE0 danh m\u1EE5c s\u01A1 \u0111\u1ED3.",
      usageInstructions: 'So\u1EA1n th\u1EA3o 4 ch\u01B0\u01A1ng theo c\u1EA5u tr\xFAc h\u01B0\u1EDBng d\u1EABn. Xu\u1EA5t PDF v\xE0 n\u1ED9p k\xE8m m\xE3 ngu\u1ED3n t\u1EA1i trang "S\u1EA3n ph\u1EA9m th\u1EF1c t\u1EADp".',
      downloadCount: 1120
    },
    {
      id: "tpl-104",
      code: "SL-01/BAOVE-2026",
      name: "M\u1EABu Slide Thuy\u1EBFt Tr\xECnh B\u1EA3o V\u1EC7 Th\u1EF1c T\u1EADp (.pptx)",
      category: "Slide b\u1EA3o v\u1EC7",
      fileType: "PPTX",
      fileSize: "4.5 MB",
      version: "v2.0",
      uploadDate: "05/08/2026",
      uploaderName: "Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      uploaderRole: "Ban Qu\u1EA3n l\xFD Th\u1EF1c t\u1EADp",
      isRequired: false,
      description: "M\u1EABu Slide 15-20 trang thi\u1EBFt k\u1EBF s\u1EB5n nh\u1EADn di\u1EC7n Tr\u01B0\u1EDDng/Khoa. T\xEDch h\u1EE3p s\u1EB5n khung s\u01A1 \u0111\u1ED3 ki\u1EBFn tr\xFAc, bi\u1EC3u \u0111\u1ED3 ti\u1EBFn \u0111\u1ED9 v\xE0 m\xE0n h\xECnh demo s\u1EA3n ph\u1EA9m.",
      usageInstructions: "Ch\u1EC9nh s\u1EEDa tr\xEAn Microsoft PowerPoint. Th\u1EDDi gian tr\xECnh b\xE0y t\u1ED1i \u0111a 15 ph\xFAt tr\u01B0\u1EDBc H\u1ED9i \u0111\u1ED3ng.",
      downloadCount: 940
    },
    {
      id: "tpl-105",
      code: "HD-01/TRINHBAY-2026",
      name: "H\u01B0\u1EDBng D\u1EABn Tr\xECnh B\xE0y B\xE1o C\xE1o & Tr\xEDch D\u1EABn Chu\u1EA9n Academic (.pdf)",
      category: "Quy \u0111\u1ECBnh & H\u01B0\u1EDBng d\u1EABn",
      fileType: "PDF",
      fileSize: "1.1 MB",
      version: "v1.1",
      uploadDate: "20/07/2026",
      uploaderName: "B\u1ED9 m\xF4n C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
      uploaderRole: "Gi\u1EA3ng vi\xEAn chuy\xEAn m\xF4n",
      isRequired: false,
      description: "H\u01B0\u1EDBng d\u1EABn chi ti\u1EBFt c\xE1ch \u0111\xE1nh s\u1ED1 trang, t\u1EA1o danh m\u1EE5c b\u1EA3ng bi\u1EC3u, v\u1EBD s\u01A1 \u0111\u1ED3 UML \u0111\xFAng k\xFD hi\u1EC7u v\xE0 c\xE1ch tr\xEDch d\u1EABn t\xE0i li\u1EC7u tham kh\u1EA3o tr\xE1nh vi ph\u1EA1m \u0111\u1EA1o v\u0103n.",
      usageInstructions: "\u0110\u1ECDc tham kh\u1EA3o khi vi\u1EBFt Ch\u01B0\u01A1ng 2 v\xE0 Ch\u01B0\u01A1ng 3 c\u1EE7a b\xE1o c\xE1o t\u1ED5ng k\u1EBFt.",
      downloadCount: 760
    },
    {
      id: "tpl-106",
      code: "TL-01/MAU-RESOURCE",
      name: "B\u1ED9 M\u1EABu S\u01A1 \u0110\u1ED3 UML & K\u1ECBch B\u1EA3n CSDL Tham Kh\u1EA3o (.zip)",
      category: "T\xE0i li\u1EC7u tham kh\u1EA3o",
      fileType: "ZIP",
      fileSize: "12.4 MB",
      version: "v1.0",
      uploadDate: "25/07/2026",
      uploaderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      uploaderRole: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      isRequired: false,
      description: "B\u1ED9 s\u01B0u t\u1EADp c\xE1c s\u01A1 \u0111\u1ED3 Use Case, Sequence Diagram, ERD m\u1EABu v\xE0 file k\u1ECBch b\u1EA3n SQL minh h\u1ECDa cho d\u1EF1 \xE1n Web/App.",
      usageInstructions: "Gi\u1EA3i n\xE9n b\u1EB1ng WinRAR ho\u1EB7c 7-Zip \u0111\u1EC3 l\xE0m t\xE0i li\u1EC7u tham kh\u1EA3o cho d\u1EF1 \xE1n c\u1EE7a b\u1EA1n.",
      downloadCount: 1300
    }
  ]);
  const categoriesList = [
    "T\u1EA5t c\u1EA3",
    "M\u1EABu b\xE1o c\xE1o tu\u1EA7n",
    "M\u1EABu b\xE1o c\xE1o cu\u1ED1i k\u1EF3",
    "Slide b\u1EA3o v\u1EC7",
    "Quy \u0111\u1ECBnh & H\u01B0\u1EDBng d\u1EABn",
    "T\xE0i li\u1EC7u tham kh\u1EA3o"
  ];
  const handleDownload = (doc) => {
    setTemplates((prev) => prev.map((t) => {
      if (t.id === doc.id) {
        return { ...t, downloadCount: t.downloadCount + 1 };
      }
      return t;
    }));
    onShowToast(`\u0110ang t\u1EA3i xu\u1ED1ng: ${doc.name}`);
  };
  const filteredTemplates = templates.filter((doc) => {
    const matchCat = selectedCategory === "T\u1EA5t c\u1EA3" || doc.category === selectedCategory;
    const matchFileType = selectedFileType === "T\u1EA5t c\u1EA3" || doc.fileType === selectedFileType;
    const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.code.toLowerCase().includes(searchQuery.toLowerCase()) || doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchFileType && matchSearch;
  });
  const totalPages = Math.ceil(filteredTemplates.length / pageSize) || 1;
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const getFileTypeBadge = (type) => {
    switch (type) {
      case "DOCX":
        return "bg-blue-600 text-white";
      case "PDF":
        return "bg-rose-600 text-white";
      case "PPTX":
        return "bg-amber-600 text-white";
      case "ZIP":
        return "bg-indigo-600 text-white";
      default:
        return "bg-slate-700 text-white";
    }
  };
  return <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {
    /* 1. COMPACT HEADER BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Biểu mẫu & Tài liệu
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              {templates.length} biểu mẫu chính thức
            </span>
            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 font-extrabold text-[11px] rounded-full border border-rose-200">
              {templates.filter((t) => t.isRequired).length} bắt buộc
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Kho biểu mẫu Word, Slide PowerPoint và Quy định do Giảng viên & Khoa đăng tải. Tải về để làm theo.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
    onClick={() => onShowToast("\u0110ang \u0111\xF3ng g\xF3i v\xE0 t\u1EA3i t\u1EA5t c\u1EA3 bi\u1EC3u m\u1EABu (.ZIP)...")}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
            <Download className="w-3.5 h-3.5" />
            <span>Tải tất cả mẫu (.ZIP)</span>
          </button>
        </div>
      </div>

      {
    /* 2. MAIN CONTENT GRID */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {
    /* LEFT 2 COLS: TEMPLATE FILE LIST */
  }
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            
            {
    /* Header & Controls */
  }
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Biểu mẫu từ Giảng viên ({filteredTemplates.length})
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative w-40 sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
    type="text"
    placeholder="Tìm tên file, mã..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none font-medium"
  />
                </div>

                <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                  {["T\u1EA5t c\u1EA3", "DOCX", "PDF", "PPTX", "ZIP"].map((ft) => <button
    key={ft}
    onClick={() => setSelectedFileType(ft)}
    className={`px-2 py-0.5 rounded-lg transition-all ${selectedFileType === ft ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600"}`}
  >
                      {ft}
                    </button>)}
                </div>
              </div>
            </div>

            {
    /* Category Filter Pills */
  }
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1">
              {categoriesList.map((cat) => <button
    key={cat}
    onClick={() => {
      setSelectedCategory(cat);
      setCurrentPage(1);
    }}
    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
                  {cat}
                </button>)}
            </div>

            {
    /* Template Items List */
  }
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
              {filteredTemplates.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 font-medium">
                  Không tìm thấy biểu mẫu nào phù hợp.
                </div> : paginatedTemplates.map((doc) => <div
    key={doc.id}
    className="p-4 hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getFileTypeBadge(doc.fileType)}`}>
                          {doc.fileType}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {doc.code}
                        </span>
                        {doc.isRequired && <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                            Bắt buộc
                          </span>}
                        <span className="text-[10px] text-slate-400 font-medium">Phiên bản {doc.version}</span>
                      </div>

                      <h3
    onClick={() => setSelectedDoc(doc)}
    className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug"
  >
                        {doc.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 font-medium">{doc.description}</p>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                        <span>Đăng bởi: <strong className="text-slate-700">{doc.uploaderName}</strong></span>
                        <span>•</span>
                        <span>Dung lượng: <strong className="text-slate-700">{doc.fileSize}</strong></span>
                        <span>•</span>
                        <span>Lượt tải: <strong className="text-slate-700">{doc.downloadCount}</strong></span>
                      </div>
                    </div>

                    {
    /* Action Buttons */
  }
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
    onClick={() => setSelectedDoc(doc)}
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
  >
                        <Eye className="w-3.5 h-3.5 text-slate-500" /> Xem chi tiết
                      </button>

                      <button
    onClick={() => handleDownload(doc)}
    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
                        <Download className="w-3.5 h-3.5" /> Tải mẫu về
                      </button>
                    </div>
                  </div>)}
            </div>

            {
    /* Pagination */
  }
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">
                Hiển thị {paginatedTemplates.length} / {filteredTemplates.length} mẫu
              </span>

              <div className="flex items-center gap-1.5 font-bold">
                <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
  >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
  >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {
    /* RIGHT 1 COL: REQUIRED TEMPLATES & USAGE STEPS */
  }
        <div className="lg:col-span-1 space-y-6">

          {
    /* REQUIRED TEMPLATES BOX */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" /> Biểu mẫu bắt buộc phải nộp
            </h3>

            <div className="space-y-2 text-xs">
              {templates.filter((t) => t.isRequired).map((reqDoc) => <div key={reqDoc.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-900 text-[11px]">{reqDoc.code}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                      {reqDoc.fileType}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">{reqDoc.name}</p>
                  <button
    onClick={() => handleDownload(reqDoc)}
    className="w-full mt-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
  >
                    <Download className="w-3.5 h-3.5" /> Tải tệp này ({reqDoc.fileSize})
                  </button>
                </div>)}
            </div>
          </div>

          {
    /* USAGE GUIDE BOX */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hướng dẫn làm theo mẫu
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <span>Tải mẫu Word (.docx) hoặc PPTX tương ứng về máy tính.</span>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <span>Điền thông tin và thực hiện đúng cấu trúc do Khoa yêu cầu.</span>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <span>Xuất file thành dạng <strong>PDF (.pdf)</strong> trước khi nộp lên hệ thống.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {
    /* MODAL: VIEW TEMPLATE DETAILS */
  }
      {selectedDoc && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 relative">
            <button
    onClick={() => setSelectedDoc(null)}
    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
  >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
              <div className={`p-2.5 rounded-xl text-white font-bold text-xs shrink-0 ${getFileTypeBadge(selectedDoc.fileType)}`}>
                {selectedDoc.fileType}
              </div>
              <div className="min-w-0 pr-6 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {selectedDoc.code}
                  </span>
                  {selectedDoc.isRequired && <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                      Bắt buộc
                    </span>}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedDoc.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Đăng bởi: {selectedDoc.uploaderName} ({selectedDoc.uploaderRole})</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Mô tả chi tiết:</p>
                <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                  {selectedDoc.description}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Hướng dẫn làm theo mẫu:</p>
                <p className="text-blue-900 font-medium bg-blue-50/80 p-3 rounded-xl border border-blue-200/80 leading-relaxed">
                  {selectedDoc.usageInstructions}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Phiên bản:</p>
                  <p className="font-bold text-slate-900 text-xs">{selectedDoc.version}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Dung lượng tệp:</p>
                  <p className="font-bold text-slate-900 text-xs">{selectedDoc.fileSize}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
    onClick={() => setSelectedDoc(null)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
  >
                Đóng
              </button>

              <button
    onClick={() => {
      handleDownload(selectedDoc);
      setSelectedDoc(null);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
  >
                <Download className="w-4 h-4" /> Tải mẫu về
              </button>
            </div>
          </div>
        </div>}

    </div>;
};

export { TemplatesView as StudentTemplatesView };
