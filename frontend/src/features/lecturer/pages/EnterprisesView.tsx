import { useState, useMemo } from 'react';
import { Toast } from '../../../components/common/Toast';
import { CompanyDetailWorkspace } from '../components/CompanyDetailWorkspace';
import { CompanyFormWorkspace } from '../components/CompanyFormWorkspace';
import {
  Building2,
  Plus,
  FileSpreadsheet,
  Download,
  Search,
  Star,
  MapPin,
  Eye,
  Edit,
  BarChart2,
  CheckCircle2,
  Award,
  X,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
export const EnterprisesView = ({
  enterprises = [],
  onApproveEnterprise,
  onAddEnterprise
}) => {
  const [search, setSearch] = useState("");
  const [fieldFilter, setFieldFilter] = useState("T\u1EA5t c\u1EA3");
  const [locationFilter, setLocationFilter] = useState("T\u1EA5t c\u1EA3");
  const [statusFilter, setStatusFilter] = useState("T\u1EA5t c\u1EA3");
  const [isHiringOnly, setIsHiringOnly] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [isFormWorkspaceOpen, setIsFormWorkspaceOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState(null);
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [statsModalItem, setStatsModalItem] = useState(null);
  const [editModalItem, setEditModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    shortCode: "",
    field: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    location: "",
    capacity: 20,
    isHiring: true,
    isPriority: false
  });
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.contactPerson && item.contactPerson.toLowerCase().includes(search.toLowerCase()) || item.field && item.field.toLowerCase().includes(search.toLowerCase()) || item.shortCode.toLowerCase().includes(search.toLowerCase());
      const matchField = fieldFilter === "T\u1EA5t c\u1EA3" || item.field && item.field.includes(fieldFilter);
      const matchLocation = locationFilter === "T\u1EA5t c\u1EA3" || item.location.includes(locationFilter);
      const matchStatus = statusFilter === "T\u1EA5t c\u1EA3" || item.status === statusFilter;
      const matchHiring = !isHiringOnly || item.isHiring;
      return matchSearch && matchField && matchLocation && matchStatus && matchHiring;
    });
  }, [enterprises, search, fieldFilter, locationFilter, statusFilter, isHiringOnly]);
  const totalPages = Math.ceil(filteredEnterprises.length / pageSize) || 1;
  const paginatedEnterprises = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEnterprises.slice(start, start + pageSize);
  }, [filteredEnterprises, currentPage, pageSize]);
  const totalCount = enterprises.length;
  const cooperatingCount = enterprises.filter((e) => e.status === "\u0110ang h\u1EE3p t\xE1c" || e.status === "\u0110\u1ED1i t\xE1c \u01B0u ti\xEAn" || e.status === "\u0110\xE3 duy\u1EC7t").length;
  const hiringCount = enterprises.filter((e) => e.isHiring).length;
  const priorityCount = enterprises.filter((e) => e.isPriority || e.status === "\u0110\u1ED1i t\xE1c \u01B0u ti\xEAn" || e.badge === "\u0110\u1ED0I T\xC1C \u01AFU TI\xCAN").length;
  const newCount = enterprises.filter((e) => e.status === "Ch\u1EDD duy\u1EC7t").length;
  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < fullStars ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
        />
      );
    }
    return <div className="flex items-center gap-0.5">
        {stars}
        <span className="text-xs font-bold text-slate-700 ml-1">{rating.toFixed(1)}</span>
      </div>;
  };
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCompany.name.trim()) {
      triggerToast("Vui l\xF2ng nh\u1EADp t\xEAn doanh nghi\u1EC7p!");
      return;
    }
    const created = {
      id: `dn-${Date.now()}`,
      name: newCompany.name,
      shortCode: newCompany.shortCode || newCompany.name.substring(0, 3).toUpperCase(),
      field: newCompany.field,
      contactPerson: newCompany.contactPerson || "Ch\u01B0a c\u1EADp nh\u1EADt",
      contactPhone: newCompany.contactPhone || "0900 000 000",
      contactEmail: newCompany.contactEmail || "hr@company.com",
      website: newCompany.website || "https://company.com",
      location: newCompany.location || "H\xE0 N\u1ED9i / TP.HCM",
      badge: newCompany.isPriority ? "\u0110\u1ED0I T\xC1C \u01AFU TI\xCAN" : "CH\xCDNH TH\u1EE8C",
      badgeType: newCompany.isPriority ? "primary" : "gray",
      studentCount: 0,
      capacity: newCompany.capacity,
      rating: 5,
      isHiring: newCompany.isHiring,
      isPriority: newCompany.isPriority,
      activeThisWeek: true,
      status: "Ch\u1EDD duy\u1EC7t",
      updatedAt: "H\xF4m nay"
    };
    onAddEnterprise?.(created);
    setShowAddModal(false);
    triggerToast(`\u0110\xE3 th\xEAm th\xE0nh c\xF4ng doanh nghi\u1EC7p ${created.name}`);
    setNewCompany({
      name: "",
      shortCode: "",
      field: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      website: "",
      location: "",
      capacity: 20,
      isHiring: true,
      isPriority: false
    });
  };
  if (isFormWorkspaceOpen || companyToEdit) {
    return <CompanyFormWorkspace
      initialData={companyToEdit}
      onBack={() => {
        setIsFormWorkspaceOpen(false);
        setCompanyToEdit(null);
      }}
      onSave={(data, isDraft) => {
        onAddEnterprise?.(data);
        setIsFormWorkspaceOpen(false);
        setCompanyToEdit(null);
        triggerToast(
          isDraft ? `\u0110\xE3 l\u01B0u nh\xE1p doanh nghi\u1EC7p ${data.name}` : `\u0110\xE3 l\u01B0u th\xF4ng tin doanh nghi\u1EC7p ${data.name}`
        );
      }}
    />;
  }
  if (selectedCompanyDetail) {
    return <CompanyDetailWorkspace
      company={selectedCompanyDetail}
      onBack={() => setSelectedCompanyDetail(null)}
      onAssignStudents={(comp) => triggerToast(`\u0110\xE3 m\u1EDF giao di\u1EC7n ph\xE2n c\xF4ng sinh vi\xEAn cho ${comp.shortCode}`)}
    />;
  }
  return <div className="space-y-6 animate-in fade-in duration-200 pb-10">
      {
    /* Toast Alert */
  }
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {
    /* PAGE HEADER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Doanh nghiệp</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Quản lý danh sách doanh nghiệp hợp tác và lịch sử tiếp nhận sinh viên.
          </p>
        </div>

        {
    /* Action Buttons */
  }
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <button
    onClick={() => triggerToast("\u0110\xE3 nh\u1EADp danh s\xE1ch 15 doanh nghi\u1EC7p t\u1EEB file Excel")}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
  >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import Excel</span>
          </button>

          <button
    onClick={() => triggerToast("\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o \u0111\u1ED1i t\xE1c doanh nghi\u1EC7p (.xlsx)")}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
  >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Xuất Excel</span>
          </button>

          <button
    onClick={() => {
      setCompanyToEdit(null);
      setIsFormWorkspaceOpen(true);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/10 ml-auto md:ml-0"
  >
            <Plus className="w-4 h-4" />
            <span>+ Thêm doanh nghiệp</span>
          </button>
        </div>
      </div>

      {
    /* 4 SYNCHRONIZED TOP METRIC CARDS */
  }
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {
    /* 1. TỔNG DOANH NGHIỆP */
  }
        <div
    onClick={() => {
      setStatusFilter("T\u1EA5t c\u1EA3");
      setFieldFilter("T\u1EA5t c\u1EA3");
    }}
    className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">
              Doanh nghiệp hợp tác
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
            <span className="text-xs font-bold text-slate-400">doanh nghiệp</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">Toàn bộ kho dữ liệu đối tác</span>
        </div>

        {
    /* 2. ĐANG HỢP TÁC */
  }
        <div
    onClick={() => setStatusFilter("\u0110ang h\u1EE3p t\xE1c")}
    className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
              Đang hợp tác
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-800">{cooperatingCount}</span>
            <span className="text-xs font-bold text-emerald-600">đối tác</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">Sẵn sàng tiếp nhận sinh viên</span>
        </div>

        {
    /* 3. ĐANG TUYỂN THỰC TẬP */
  }
        <div
    onClick={() => setIsHiringOnly(!isHiringOnly)}
    className="bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/40 p-4 rounded-2xl border border-sky-200/80 border-l-4 border-l-sky-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-[10px] font-extrabold uppercase text-sky-800 tracking-wider">
              Đang tuyển thực tập
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-100/80 text-sky-600 border border-sky-200/60 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-sky-800">{hiringCount}</span>
            <span className="text-xs font-bold text-sky-600">doanh nghiệp</span>
          </div>
          <span className="text-[11px] text-sky-600 font-bold block">Đang mở đợt tuyển vị trí</span>
        </div>

        {
    /* 4. ĐỐI TÁC ƯU TIÊN */
  }
        <div
    onClick={() => setStatusFilter("\u0110\u1ED1i t\xE1c \u01B0u ti\xEAn")}
    className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
              Đối tác ưu tiên
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-800">{priorityCount}</span>
            <span className="text-xs font-bold text-amber-600">đối tác</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">Cam kết chỉ tiêu cao</span>
        </div>
      </section>

      {
    /* SEARCH AND FILTERS BAR */
  }
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {
    /* Header Section Label */
  }
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
              Bộ lọc tìm kiếm doanh nghiệp
            </h2>
          </div>

          {(fieldFilter !== "T\u1EA5t c\u1EA3" || locationFilter !== "T\u1EA5t c\u1EA3" || statusFilter !== "T\u1EA5t c\u1EA3" || isHiringOnly || search) && <button
    onClick={() => {
      setSearch("");
      setFieldFilter("T\u1EA5t c\u1EA3");
      setLocationFilter("T\u1EA5t c\u1EA3");
      setStatusFilter("T\u1EA5t c\u1EA3");
      setIsHiringOnly(false);
    }}
    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
  >
              Xóa bộ lọc
            </button>}
        </div>

        {
    /* Filter inputs row */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {
    /* Search Box */
  }
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Tìm tên doanh nghiệp, người liên hệ, lĩnh vực..."
    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
  />
          </div>

          <div>
            <select
    value={fieldFilter}
    onChange={(e) => setFieldFilter(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả">Tất cả Lĩnh vực</option>
              <option value="Công nghệ">Công nghệ / Phần mềm</option>
              <option value="Viễn thông">Viễn thông &amp; Số</option>
              <option value="Ngân hàng">Ngân hàng / Fintech</option>
              <option value="Internet">Internet / Cloud</option>
              <option value="Ô tô">Công nghệ Ô tô / AI</option>
            </select>
          </div>

          <div>
            <select
    value={locationFilter}
    onChange={(e) => setLocationFilter(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả">Tất cả Khu vực</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP.HCM">TP. Hồ Chí Minh</option>
              <option value="Hải Phòng">Hải Phòng</option>
            </select>
          </div>

          <div>
            <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả">Tất cả Trạng thái</option>
              <option value="Đang hợp tác">Đang hợp tác</option>
              <option value="Đối tác ưu tiên">Đối tác ưu tiên</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Ngưng hợp tác">Ngưng hợp tác</option>
            </select>
          </div>
        </div>
      </div>

      {
    /* FULL WIDTH ENTERPRISE TABLE */
  }
      <div className="w-full space-y-4">
        {filteredEnterprises.length === 0 ? (
    /* EMPTY STATE */
    <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Chưa có doanh nghiệp</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Hãy thêm doanh nghiệp đầu tiên hoặc điều chỉnh bộ lọc tìm kiếm để bắt đầu quản lý.
              </p>
            </div>
            <button
      onClick={() => setShowAddModal(true)}
      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
    >
              <Plus className="w-4 h-4" />
              <span>Thêm doanh nghiệp đầu tiên</span>
            </button>
          </div>
  ) : (
    /* TABLE DISPLAY */
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="p-3.5 pl-4">Doanh nghiệp</th>
                    <th className="p-3.5">Lĩnh vực</th>
                    <th className="p-3.5">Người liên hệ</th>
                    <th className="p-3.5">Vị trí tuyển</th>
                    <th className="p-3.5 text-center">Sức chứa</th>
                    <th className="p-3.5 text-center">Đã nhận</th>
                    <th className="p-3.5">Đánh giá</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 pr-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedEnterprises.map((item) => <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                      {
      /* Logo & Name */
    }
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-100 shrink-0">
                            {item.shortCode}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs block hover:text-blue-600 cursor-pointer" onClick={() => setSelectedCompanyDetail(item)}>
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" /> {item.location.split("/")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {
      /* Lĩnh vực */
    }
                      <td className="p-3.5">
                        <span className="text-[11px] font-semibold text-slate-700 block max-w-[140px] truncate">
                          {item.field || "C\xF4ng ngh\u1EC7 Th\xF4ng tin"}
                        </span>
                      </td>

                      {
      /* Người liên hệ & Hotline */
    }
                      <td className="p-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                            {item.contactPerson || "Tr\u1EA7n Th\u1ECB Thu H\xE0"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {item.contactPhone || "024 7300 7300"}
                          </span>
                        </div>
                      </td>

                      {
      /* Vị trí tuyển */
    }
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {item.openPositions && item.openPositions.length > 0 ? item.openPositions.slice(0, 2).map((pos, pIdx) => <span
      key={pIdx}
      className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded"
    >
                                {pos}
                              </span>) : <span className="text-[10px] text-slate-400 italic">Nhiều vị trí</span>}
                          {item.openPositions && item.openPositions.length > 2 && <span className="text-[9px] text-blue-600 font-bold">
                              +{item.openPositions.length - 2}
                            </span>}
                        </div>
                      </td>

                      {
      /* Sức chứa */
    }
                      <td className="p-3.5 text-center font-bold font-mono text-slate-800">
                        {item.capacity || 30}
                      </td>

                      {
      /* Đã tiếp nhận */
    }
                      <td className="p-3.5 text-center">
                        <span className="font-black text-blue-600 font-mono text-xs px-2 py-0.5 bg-blue-50 rounded-lg border border-blue-100">
                          {item.studentCount} SV
                        </span>
                      </td>

                      {
      /* Đánh giá (★★★★★) */
    }
                      <td className="p-3.5">
                        {renderStars(item.rating || 4.7)}
                      </td>

                      {
      /* Trạng thái */
    }
                      <td className="p-3.5">
                        <span
      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full inline-flex items-center gap-1 ${item.status === "\u0110\u1ED1i t\xE1c \u01B0u ti\xEAn" || item.isPriority ? "bg-amber-100 text-amber-900 border border-amber-300" : item.status === "\u0110ang h\u1EE3p t\xE1c" || item.status === "\u0110\xE3 duy\u1EC7t" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : item.status === "Ch\u1EDD duy\u1EC7t" ? "bg-purple-100 text-purple-800 border border-purple-300" : "bg-rose-100 text-rose-800 border border-rose-300"}`}
    >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {item.status}
                        </span>
                      </td>

                      {
      /* Thao tác (4 buttons) */
    }
                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {
      /* 👁 Chi tiết */
    }
                          <button
      onClick={() => setSelectedCompanyDetail(item)}
      className="p-1.5 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
      title="Chi tiết hồ sơ doanh nghiệp"
    >
                            <Eye className="w-4 h-4" />
                          </button>

                          {
      /* ✏ Chỉnh sửa */
    }
                          <button
      onClick={() => setCompanyToEdit(item)}
      className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
      title="Chỉnh sửa thông tin"
    >
                            <Edit className="w-4 h-4" />
                          </button>

                          {
      /* 📊 Thống kê */
    }
                          <button
      onClick={() => setStatsModalItem(item)}
      className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
      title="Thống kê tiếp nhận"
    >
                            <BarChart2 className="w-4 h-4" />
                          </button>

                          {
      /* Approve if pending */
    }
                          {item.status === "Ch\u1EDD duy\u1EC7t" && <button
      onClick={() => {
        onApproveEnterprise?.(item.id);
        triggerToast(`\u0110\xE3 ph\xEA duy\u1EC7t \u0111\u1ED1i t\xE1c ${item.name}`);
      }}
      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition-colors ml-1"
      title="Phê duyệt đối tác"
    >
                              Duyệt
                            </button>}
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>

            {
      /* PAGINATION FOOTER */
    }
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
                  (Hiển thị {Math.min((currentPage - 1) * pageSize + 1, filteredEnterprises.length)} - {Math.min(currentPage * pageSize, filteredEnterprises.length)} / tổng {filteredEnterprises.length} doanh nghiệp)
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => <button
      key={pg}
      onClick={() => setCurrentPage(pg)}
      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentPage === pg ? "bg-blue-600 text-white shadow-2xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
    >
                    {pg}
                  </button>)}

                <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors text-slate-700"
    >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
  )}
      </div>

        {
    /* SECTION: TOP STRATEGIC PARTNERS (Full width compact card) */
  }
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              DOANH NGHIỆP ĐỐI TÁC TIÊU BIỂU (ĐÁNH GIÁ CAO NHẤT)
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Cập nhật đợt HK I - 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {enterprises.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3).map((comp, idx) => <div
    key={idx}
    onClick={() => setSelectedCompanyDetail(comp)}
    className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
  >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-extrabold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-md text-xs">#{idx + 1}</span>
                    <div className="truncate">
                      <span className="font-extrabold text-slate-900 text-xs block truncate">{comp.name}</span>
                      <span className="text-[10px] text-slate-500">{comp.studentCount} SV đang thực tập</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-black text-xs text-slate-800">{comp.rating || 4.9}</span>
                  </div>
                </div>)}
          </div>
        </div>

      {
    /* ================================================================= */
  }
      {
    /* MODAL 1: ADD NEW ENTERPRISE (+ Thêm doanh nghiệp) */
  }
      {
    /* ================================================================= */
  }
      {showAddModal && <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Thêm doanh nghiệp đối tác mới</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên doanh nghiệp *</label>
                <input
    type="text"
    required
    value={newCompany.name}
    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
    placeholder="VD: Tập đoàn FPT, Viettel, VNG..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã viết tắt</label>
                  <input
    type="text"
    value={newCompany.shortCode}
    onChange={(e) => setNewCompany({ ...newCompany, shortCode: e.target.value })}
    placeholder="VD: FPT"
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lĩnh vực hoạt động</label>
                  <input
    type="text"
    value={newCompany.field}
    onChange={(e) => setNewCompany({ ...newCompany, field: e.target.value })}
    placeholder="VD: Công nghệ Thông tin"
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Người liên hệ HR</label>
                  <input
    type="text"
    value={newCompany.contactPerson}
    onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
    placeholder="VD: Nguyễn Văn A (HR Lead)"
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                  <input
    type="text"
    value={newCompany.contactPhone}
    onChange={(e) => setNewCompany({ ...newCompany, contactPhone: e.target.value })}
    placeholder="VD: 024 7300 7300"
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email tuyển dụng</label>
                  <input
    type="email"
    value={newCompany.contactEmail}
    onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
    placeholder="hr@company.com"
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chỉ tiêu nhận (SV)</label>
                  <input
    type="number"
    value={newCompany.capacity}
    onChange={(e) => setNewCompany({ ...newCompany, capacity: Number(e.target.value) })}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
    type="checkbox"
    checked={newCompany.isPriority}
    onChange={(e) => setNewCompany({ ...newCompany, isPriority: e.target.checked })}
    className="w-4 h-4 accent-amber-600 rounded"
  />
                  <span>Chỉ định Đối tác ưu tiên</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
    type="button"
    onClick={() => setShowAddModal(false)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
  >
                  Hủy
                </button>
                <button
    type="submit"
    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md"
  >
                  Lưu &amp; Thêm đối tác
                </button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* ================================================================= */
  }
      {
    /* MODAL 2: ENTERPRISE DETAILS VIEW (👁 Chi tiết) */
  }
      {
    /* ================================================================= */
  }
      {detailModalItem && <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-md">
                  {detailModalItem.shortCode}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{detailModalItem.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{detailModalItem.field || "C\xF4ng ngh\u1EC7 Th\xF4ng tin"}</p>
                </div>
              </div>
              <button onClick={() => setDetailModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Người liên hệ chính</span>
                <p className="font-bold text-slate-900">{detailModalItem.contactPerson || "Tr\u1EA7n Th\u1ECB Thu H\xE0"}</p>
                <p className="text-slate-500 font-mono">{detailModalItem.contactPhone || "024 7300 7300"}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Email &amp; Website</span>
                <p className="font-bold text-blue-600">{detailModalItem.contactEmail}</p>
                <p className="text-slate-500">{detailModalItem.website || "https://fpt-software.com"}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Địa điểm làm việc</span>
                <p className="font-semibold text-slate-800">{detailModalItem.location}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sức chứa &amp; Tiếp nhận</span>
                <p className="font-bold text-slate-900">Đã nhận: <span className="text-blue-600 font-black">{detailModalItem.studentCount} SV</span> / Tối đa {detailModalItem.capacity || 50} SV</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase">Vị trí tuyển thực tập sinh mở rộng</span>
              <div className="flex flex-wrap gap-2">
                {detailModalItem.openPositions?.map((pos, pIdx) => <span key={pIdx} className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold text-xs rounded-xl border border-blue-200">
                    {pos}
                  </span>) || <span className="text-xs text-slate-500">Mở toàn bộ vị trí Software Engineering</span>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
    onClick={() => setDetailModalItem(null)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
  >
                Đóng
              </button>
            </div>
          </div>
        </div>}

      {
    /* ================================================================= */
  }
      {
    /* MODAL 3: ENTERPRISE STATISTICS (📊 Thống kê) */
  }
      {
    /* ================================================================= */
  }
      {statsModalItem && <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Thống kê tiếp nhận {statsModalItem.shortCode}</h3>
              </div>
              <button onClick={() => setStatsModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <span className="text-[10px] font-bold uppercase">Đánh giá trung bình từ Sinh viên &amp; Giảng viên</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">{statsModalItem.rating || 4.8} / 5.0</span>
                  {renderStars(statsModalItem.rating || 4.8)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>HK I - 2026:</span>
                  <span className="text-blue-600">{statsModalItem.studentCount} Sinh viên</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>HK II - 2025:</span>
                  <span className="text-slate-600">24 Sinh viên</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>HK I - 2025:</span>
                  <span className="text-slate-600">18 Sinh viên</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
    onClick={() => setStatsModalItem(null)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
  >
                Đóng
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
