import { useState } from 'react';
import { Toast } from '../../../components/common/Toast';
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Mail,
  Users,
  Award,
  Star,
  Download,
  UserPlus,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Layers,
  Calendar,
  Check,
  ShieldCheck
} from 'lucide-react';
export const CompanyDetailWorkspace = ({
  company = {
    id: "dn-1",
    name: "T\u1EADp \u0111o\xE0n FPT Software (FPT Software Co., Ltd.)",
    shortCode: "FPT",
    field: "C\xF4ng ngh\u1EC7 Th\xF4ng tin / Xu\u1EA5t kh\u1EA9u Ph\u1EA7n m\u1EC1m",
    contactPerson: "Tr\u1EA7n Th\u1ECB Thu H\xE0 (Senior HR Manager)",
    contactPhone: "024 7300 7300",
    contactEmail: "hr@fpt-software.com",
    website: "https://fpt-software.com",
    location: "Khu C\xF4ng ngh\u1EC7 cao H\xF2a L\u1EA1c, H\xE0 N\u1ED9i & F-Town 3, Qu\u1EADn 9, TP.HCM",
    badge: "\u0110\u1ED0I T\xC1C \u01AFU TI\xCAN",
    badgeType: "primary",
    studentCount: 38,
    capacity: 50,
    rating: 4.9,
    hasStipend: true,
    isHiring: true,
    isPriority: true,
    activeThisWeek: true,
    status: "\u0110\u1ED1i t\xE1c \u01B0u ti\xEAn",
    updatedAt: "30/10/2026"
  },
  onBack,
  onAssignStudents
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const positionsList = [
    {
      title: "Fullstack React / Node.js Developer Intern",
      tech: ["React.js", "Node.js", "TypeScript", "PostgreSQL"],
      quantity: 15,
      allowance: "6.000.000 - 8.000.000 VN\u0110 / th\xE1ng",
      status: "\u0110ang tuy\u1EC3n",
      description: "Tham gia x\xE2y d\u1EF1ng h\u1EC7 th\u1ED1ng Enterprise Web Apps cho kh\xE1ch h\xE0ng Nh\u1EADt B\u1EA3n & Ch\xE2u \xC2u."
    },
    {
      title: "AI & Data Engineering Intern",
      tech: ["Python", "PyTorch", "FastAPI", "Vector DB"],
      quantity: 10,
      allowance: "7.000.000 - 10.000.000 VN\u0110 / th\xE1ng",
      status: "\u0110ang tuy\u1EC3n",
      description: "Nghi\xEAn c\u1EE9u \xE1p d\u1EE5ng Generative AI & RAG cho quy tr\xECnh t\u1EF1 \u0111\u1ED9ng h\xF3a t\xE0i li\u1EC7u."
    },
    {
      title: "DevOps & Cloud Systems Intern",
      tech: ["Docker", "Kubernetes", "AWS", "Terraform"],
      quantity: 8,
      allowance: "5.500.000 - 7.500.000 VN\u0110 / th\xE1ng",
      status: "\u0110ang tuy\u1EC3n",
      description: "H\u1ED7 tr\u1EE3 thi\u1EBFt l\u1EADp CI/CD pipelines & qu\u1EA3n tr\u1ECB c\u1EE5m Kubernetes Staging."
    },
    {
      title: "Embedded Systems & Automotive Intern",
      tech: ["C/C++", "AUTOSAR", "CAN Bus", "RTOS"],
      quantity: 12,
      allowance: "6.500.000 - 8.500.000 VN\u0110 / th\xE1ng",
      status: "\u0110\xE3 \u0111\u1EE7 ch\u1EC9 ti\xEAu",
      description: "Ph\xE1t tri\u1EC3n ph\u1EA7n m\u1EC1m nh\xFAng cho c\xE1c d\xF2ng \xF4 t\xF4 \u0111i\u1EC7n th\xF4ng minh th\u1EBF h\u1EC7 m\u1EDBi."
    }
  ];
  const semesterHistory = [
    {
      semester: "H\u1ECDc k\u1EF3 I - 2026",
      totalStudents: 38,
      completed: 37,
      failed: 1,
      avgScore: 8.9,
      status: "\u0110ang di\u1EC5n ra"
    },
    {
      semester: "H\u1ECDc k\u1EF3 II - 2025",
      totalStudents: 42,
      completed: 42,
      failed: 0,
      avgScore: 9.1,
      status: "\u0110\xE3 ho\xE0n th\xE0nh"
    },
    {
      semester: "H\u1ECDc k\u1EF3 I - 2025",
      totalStudents: 30,
      completed: 29,
      failed: 1,
      avgScore: 8.7,
      status: "\u0110\xE3 ho\xE0n th\xE0nh"
    }
  ];
  const pastInterns = [
    {
      id: "st-1",
      name: "Nguy\u1EC5n V\u0103n A",
      mssv: "20210001",
      class: "CNTT-K15A",
      major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
      gpa: 3.6,
      lecturer: "TS. Nguy\u1EC5n V\u0103n H\xF9ng",
      company: company.name,
      supervisor: "Nguy\u1EC5n V\u0103n H\u1EA3i (Mentor)",
      progress: 88,
      status: "\u0110\xFAng ti\u1EBFn \u0111\u1ED9",
      score: 9.2,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      activeThisWeek: true,
      contactEmail: "nguyenvana@st.university.edu.vn",
      location: "H\xE0 N\u1ED9i"
    },
    {
      id: "st-2",
      name: "Tr\u1EA7n Th\u1ECB B",
      mssv: "20210002",
      class: "CNTT-K15B",
      major: "Khoa h\u1ECDc D\u1EEF li\u1EC7u",
      gpa: 3.8,
      lecturer: "ThS. Tr\u1EA7n Minh Tu\u1EA5n",
      company: company.name,
      supervisor: "\u0110\u1EB7ng Minh Kh\xF4i (Tech Lead)",
      progress: 95,
      status: "\u0110\xFAng ti\u1EBFn \u0111\u1ED9",
      score: 9.5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      activeThisWeek: true,
      contactEmail: "tranthib@st.university.edu.vn",
      location: "H\xE0 N\u1ED9i"
    },
    {
      id: "st-3",
      name: "L\xEA Ho\xE0ng C",
      mssv: "20210003",
      class: "HTTT-K15",
      major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin",
      gpa: 3.4,
      lecturer: "TS. L\xEA Ho\xE0ng Nam",
      company: company.name,
      supervisor: "Ph\u1EA1m Tu\u1EA5n Anh (DevOps Lead)",
      progress: 80,
      status: "\u0110\xFAng ti\u1EBFn \u0111\u1ED9",
      score: 8.5,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      activeThisWeek: false,
      contactEmail: "lehoangc@st.university.edu.vn",
      location: "TP.HCM"
    }
  ];
  const reviewsList = [
    {
      id: 1,
      author: "TS. Ph\u1EA1m Minh Anh (Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn)",
      role: "Gi\u1EA3ng vi\xEAn",
      time: "15/10/2026",
      rating: 5,
      comment: "Doanh nghi\u1EC7p c\xF3 quy tr\xECnh \u0111\xE0o t\u1EA1o b\xE0i b\u1EA3n, ph\xE2n c\xF4ng Mentor 1-on-1 s\xE1t sao. M\xF4i tr\u01B0\u1EDDng th\u1EF1c t\u1EBF gi\xFAp sinh vi\xEAn n\xE2ng cao k\u1EF9 n\u0103ng m\u1EC1m v\xE0 l\xE0m vi\u1EC7c nh\xF3m c\u1EF1c k\u1EF3 nhanh ch\xF3ng."
    },
    {
      id: 2,
      author: "Nguy\u1EC5n V\u0103n A (Sinh vi\xEAn th\u1EF1c t\u1EADp kh\xF3a 2021)",
      role: "Sinh vi\xEAn",
      time: "02/10/2026",
      rating: 5,
      comment: "Tr\u1EE3 c\u1EA5p h\xE0ng th\xE1ng \u0111\xFAng h\u1EA1n, \u0111\u01B0\u1EE3c tr\u1EF1c ti\u1EBFp vi\u1EBFt code cho d\u1EF1 \xE1n l\u1EDBn c\u1EE7a kh\xE1ch h\xE0ng Nh\u1EADt B\u1EA3n. C\u0103ng tin c\xF3 \u0111\u1EA7y \u0111\u1EE7 \u0111\u1ED3 \u0103n th\u1EE9c u\u1ED1ng mi\u1EC5n ph\xED, xe bus \u0111\u01B0a \u0111\xF3n t\u1EADn n\u01A1i."
    },
    {
      id: 3,
      author: "L\xEA Ho\xE0ng C (Sinh vi\xEAn th\u1EF1c t\u1EADp kh\xF3a 2021)",
      role: "Sinh vi\xEAn",
      time: "28/09/2026",
      rating: 4.8,
      comment: "Kh\u1ED1i l\u01B0\u1EE3ng c\xF4ng vi\u1EC7c kh\xE1 nhi\u1EC1u nh\u01B0ng h\u1ECDc h\u1ECFi \u0111\u01B0\u1EE3c r\u1EA5t nhi\u1EC1u c\xF4ng ngh\u1EC7 m\u1EDBi nh\u01B0 Docker, K8s v\xE0 Microservices."
    }
  ];
  return <div className="space-y-6 animate-in fade-in duration-200 pb-12 font-sans">
      {
    /* Toast Alert */
  }
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {
    /* TOP BREADCRUMB & BACK NAVIGATION */
  }
      <div className="flex items-center justify-between">
        <button
    onClick={onBack}
    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
  >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>← Quay lại danh sách doanh nghiệp</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Doanh nghiệp</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">{company.shortCode}</span>
        </div>
      </div>

      {
    /* COMPANY PROFILE HERO CARD Header */
  }
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {
    /* Company Brand Logo & Info */
  }
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              {company.shortCode}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{company.name}</h1>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  {company.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {company.field || "C\xF4ng ngh\u1EC7 Th\xF4ng tin / Ph\u1EA7n m\u1EC1m"}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  {company.location}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                    {company.website}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {
    /* Quick Action Buttons */
  }
          <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end flex-wrap">
            <button
    onClick={() => {
      triggerToast(`\u0110\xE3 g\u1EEDi email \u0111\u1EC1 xu\u1EA5t h\u1EE3p t\xE1c \u0111\u1EBFn ${company.contactEmail}`);
    }}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
  >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Liên hệ doanh nghiệp</span>
            </button>

            <button
    onClick={() => triggerToast(`\u0110\xE3 xu\u1EA5t h\u1ED3 s\u01A1 h\u1EE3p t\xE1c & ch\u1EC9 ti\xEAu th\u1EF1c t\u1EADp c\u1EE7a ${company.shortCode}`)}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
  >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Xuất báo cáo</span>
            </button>

            <button
    onClick={() => {
      onAssignStudents?.(company);
      triggerToast(`M\u1EDF giao di\u1EC7n ph\xE2n c\xF4ng sinh vi\xEAn th\u1EF1c t\u1EADp cho ${company.shortCode}`);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
  >
              <UserPlus className="w-4 h-4" />
              <span>Phân công sinh viên</span>
            </button>
          </div>
        </div>

        {
    /* Quick Attributes Row */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Người liên hệ trực tiếp</span>
            <p className="font-extrabold text-slate-900 truncate">{company.contactPerson}</p>
            <p className="text-[11px] text-slate-500 font-mono">{company.contactPhone}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Số lượng tiếp nhận đợt này</span>
            <p className="font-black text-blue-600 text-sm">
              {company.studentCount} / {company.capacity || 50} <span className="text-xs font-normal text-slate-500">Sinh viên</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Chính sách trợ cấp</span>
            <p className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Có trợ cấp hàng tháng
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Đánh giá chất lượng</span>
            <div className="flex items-center gap-1 font-black text-slate-900">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{company.rating || 4.9} / 5.0</span>
              <span className="text-[10px] font-normal text-slate-400 ml-1">(28 đánh giá)</span>
            </div>
          </div>
        </div>

        {
    /* WORKSPACE NAVIGATION TABS */
  }
        <div className="flex items-center gap-1 border-b border-slate-200 pt-2 overflow-x-auto no-scrollbar">
          {[
    { id: "overview", label: "T\u1ED5ng quan", icon: Layers },
    { id: "positions", label: "V\u1ECB tr\xED tuy\u1EC3n (4)", icon: Briefcase },
    { id: "interns", label: "Sinh vi\xEAn \u0111\xE3 th\u1EF1c t\u1EADp (38)", icon: Users },
    { id: "evaluations", label: "\u0110\xE1nh gi\xE1 & Ph\u1EA3n h\u1ED3i", icon: Star },
    { id: "history", label: "L\u1ECBch s\u1EED h\u1EE3p t\xE1c", icon: Calendar }
  ].map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-4 py-2.5 font-bold text-xs transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${isActive ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
    >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>;
  })}
        </div>
      </div>

      {
    /* MAIN TAB CONTENT AREA */
  }
      <div className="w-full space-y-6">
          {
    /* TAB 1: TỔNG QUAN */
  }
          {activeTab === "overview" && <div className="space-y-6">
              {
    /* Company Description */
  }
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Giới thiệu Doanh nghiệp
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  FPT Software là công ty con thuộc Tập đoàn FPT, hiện là doanh nghiệp xuất khẩu phần mềm và cung cấp dịch vụ công nghệ thông tin lớn nhất Việt Nam với hơn 30.000 nhân sự toàn cầu. Với vai trò đối tác chiến lược hàng đầu của trường, FPT Software tiếp nhận sinh viên thực tập liên tục trong cả 3 học kỳ hàng năm cho các mảng Web, Mobile, AI, Cloud và Automotive.
                </p>
              </div>

              {
    /* Requirements & Skills */
  }
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Yêu cầu tuyển dụng sinh viên
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Sinh viên năm 3 hoặc năm 4 các ngành CNTT, KhMT, HTTT.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Đã hoàn thành các môn học cơ sở ngành (DSA, OOP, CSDL).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Có khả năng cam kết thực tập tối thiểu 3 - 4 tháng (40h/tuần).</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Kỹ năng ưu tiên
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["JavaScript / TypeScript", "React / Angular", "Node.js / Express", "Python / AI Frameworks", "Docker & Git", "Ti\u1EBFng Anh giao ti\u1EBFp TOEIC 600+"].map((skill, idx) => <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-[11px] rounded-xl border border-slate-200">
                        {skill}
                      </span>)}
                  </div>
                </div>
              </div>

              {
    /* Benefits & Working Hours */
  }
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  Quyền lợi &amp; Thời gian làm việc
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900">🎁 Quyền lợi sinh viên:</p>
                    <p>• Được hướng dẫn trực tiếp 1-on-1 bởi Mentor có kinh nghiệm chuyên môn sâu.</p>
                    <p>• Cơ hội chuyển chính thức ngay sau đợt thực tập đạt kết quả Tốt.</p>
                    <p>• Xe bus đưa đón nhân viên tại các điểm trung tâm Hà Nội &amp; TP.HCM.</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900">⏰ Thời gian làm việc:</p>
                    <p>• Thứ Hai - Thứ Sáu: 08:30 - 17:30 (Nghỉ trưa 12:00 - 13:00).</p>
                    <p>• Hình thức: Onsite tại Campus FPT Hòa Lạc hoặc F-Town 3.</p>
                  </div>
                </div>
              </div>
            </div>}

          {
    /* TAB 2: VỊ TRÍ TUYỂN */
  }
          {activeTab === "positions" && <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  DANH SÁCH VỊ TRÍ TUYỂN THỰC TẬP (4 VỊ TRÍ)
                </h3>
                <span className="text-xs text-slate-500 font-medium">Tổng chỉ tiêu: 45 SV</span>
              </div>

              <div className="space-y-3">
                {positionsList.map((pos, idx) => <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{pos.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{pos.description}</p>
                      </div>
                      <span
    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full shrink-0 ${pos.status === "\u0110ang tuy\u1EC3n" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-100 text-slate-600 border border-slate-300"}`}
  >
                        {pos.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400">Công nghệ:</span>
                        {pos.tech.map((t, tIdx) => <span key={tIdx} className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-100">
                            {t}
                          </span>)}
                      </div>

                      <div className="flex items-center gap-4 text-slate-700 font-semibold text-[11px]">
                        <span>Chỉ tiêu: <strong className="text-blue-600">{pos.quantity} SV</strong></span>
                        <span className="text-emerald-600 font-bold">{pos.allowance}</span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}

          {
    /* TAB 3: SINH VIÊN ĐÃ THỰC TẬP */
  }
          {activeTab === "interns" && <div className="space-y-6">
              {
    /* Semester Internship Timeline */
  }
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  THỐNG KÊ QUA CÁC HỌC KỲ THỰC TẬP
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {semesterHistory.map((sem, sIdx) => <div key={sIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-extrabold text-xs text-slate-900 block">{sem.semester}</span>
                      <div className="flex items-baseline justify-between text-xs pt-1">
                        <span className="text-slate-500">Tiếp nhận:</span>
                        <span className="font-black text-blue-600">{sem.totalStudents} SV</span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500">Hoàn thành:</span>
                        <span className="font-bold text-emerald-600">{sem.completed} SV ({sem.failed > 0 ? `Tr\u01B0\u1EE3t ${sem.failed}` : "100% Pass"})</span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">Điểm TB:</span>
                        <span className="font-black text-amber-600">{sem.avgScore} / 10</span>
                      </div>
                    </div>)}
                </div>
              </div>

              {
    /* Student List */
  }
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  DANH SÁCH SINH VIÊN TIẾP NHẬN ĐỢT NÀY (38 SINH VIÊN)
                </h3>

                <div className="divide-y divide-slate-100">
                  {pastInterns.map((st) => <div key={st.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">{st.name} ({st.mssv})</span>
                          <span className="text-[10px] text-slate-500">{st.class} • {st.major}</span>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="font-bold text-slate-700 block">Mentor: {st.supervisor}</span>
                        <span className="text-[11px] font-black text-emerald-600">Điểm: {st.score} / 10</span>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>}

          {
    /* TAB 4: ĐÁNH GIÁ */
  }
          {activeTab === "evaluations" && <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  ĐÁNH GIÁ VỀ DOANH NGHIỆP
                </h3>

                <div className="space-y-3">
                  {reviewsList.map((rev) => <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{rev.author}</span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">"{rev.comment}"</p>
                      <span className="text-[10px] text-slate-400 block text-right">{rev.time}</span>
                    </div>)}
                </div>
              </div>
            </div>}

          {
    /* TAB 5: LỊCH SỬ HỢP TÁC */
  }
          {activeTab === "history" && <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                MỐC LỊCH SỬ KÝ KẾT &amp; HỢP TÁC MOUs
              </h3>

              <div className="space-y-3 text-xs border-l-2 border-blue-600 pl-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-900">01/01/2026 - Ký kết thỏa thuận hợp tác đào tạo (MOU 2026-2028)</span>
                  <p className="text-slate-600">Tăng chỉ tiêu tiếp nhận từ 30 SV lên 50 SV/học kỳ và tài trợ học bổng thực tập sinh tài năng.</p>
                </div>
                <div className="space-y-1 pt-2">
                  <span className="font-extrabold text-slate-900">15/08/2025 - Tổ chức Ngày hội tuyển dụng InternDay 2025 tại Trường</span>
                  <p className="text-slate-600">Tuyển trực tiếp 42 sinh viên thực tập các ngành Kỹ thuật Phần mềm và Khoa học Dữ liệu.</p>
                </div>
              </div>
            </div>}
        </div>
    </div>;
};
