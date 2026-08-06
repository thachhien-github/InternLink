import { useState } from 'react';
import { UserPlus, X, User, Mail, Phone, Building2, GraduationCap, ShieldCheck, Save, Calendar } from 'lucide-react';
export const CreateStudentModal = ({
  isOpen,
  onClose,
  onShowToast,
  onAddStudent
}) => {
  const [formData, setFormData] = useState({
    mssv: "20110" + Math.floor(100 + Math.random() * 900),
    fullName: "",
    gender: "Nam",
    dateOfBirth: "2002-05-15",
    classCode: "20CNTT1",
    major: "C\xF4ng ngh\u1EC7 ph\u1EA7n m\u1EC1m",
    faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
    cohort: "K20 (2020 - 2024)",
    email: "",
    phone: "",
    companyName: "Ch\u01B0a c\xF3 doanh nghi\u1EC7p",
    assignedLecturer: "Ch\u01B0a ph\xE2n c\xF4ng",
    currentSemester: "K\u1EF3 1 - N\u0103m h\u1ECDc 2026-2027",
    createAccountImmediately: true
  });
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp h\u1ECD v\xE0 t\xEAn sinh vi\xEAn!");
      return;
    }
    if (!formData.mssv.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp m\xE3 s\u1ED1 sinh vi\xEAn (MSSV)!");
      return;
    }
    const calculatedEmail = formData.email.trim() || `${formData.mssv}@student.fit.edu.vn`;
    const newStudent = {
      id: "std-" + Date.now(),
      mssv: formData.mssv,
      fullName: formData.fullName,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1e3)}?w=150&auto=format&fit=crop&q=80`,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      classCode: formData.classCode,
      major: formData.major,
      faculty: formData.faculty,
      cohort: formData.cohort,
      email: calculatedEmail,
      phone: formData.phone || "0988 765 432",
      currentSemester: formData.currentSemester,
      assignedLecturer: formData.assignedLecturer,
      companyName: formData.companyName,
      assignmentStatus: formData.assignedLecturer !== "Ch\u01B0a ph\xE2n c\xF4ng" ? "assigned" : "waiting",
      accountStatus: formData.createAccountImmediately ? "active" : "pending",
      internshipStatus: formData.companyName !== "Ch\u01B0a c\xF3 doanh nghi\u1EC7p" ? "interning" : "preparing",
      lastLogin: formData.createAccountImmediately ? "V\u1EEBa t\u1EA1o" : "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n",
      gpa: 3.25
    };
    if (onAddStudent) {
      onAddStudent(newStudent);
    }
    onShowToast(`\u0110\xE3 th\xEAm th\xE0nh c\xF4ng sinh vi\xEAn ${formData.fullName} (${formData.mssv})!`);
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col">
        
        {
    /* Header */
  }
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Thêm sinh viên mới</h2>
              <p className="text-xs text-slate-300 font-medium">Khởi tạo hồ sơ sinh viên tham gia kỳ thực tập doanh nghiệp</p>
            </div>
          </div>
          <button
    onClick={onClose}
    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {
    /* Group 1: Basic Information */
  }
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Thông tin cá nhân sinh viên
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Bắt buộc nhập họ tên & MSSV</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã số sinh viên (MSSV) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
    type="text"
    required
    value={formData.mssv}
    onChange={(e) => setFormData({ ...formData, mssv: e.target.value })}
    placeholder="VD: 20110123"
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên sinh viên <span className="text-rose-500">*</span>
                </label>
                <input
    type="text"
    required
    value={formData.fullName}
    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
    placeholder="VD: Nguyễn Văn Hoàng"
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
                <select
    value={formData.gender}
    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh</label>
                <div className="relative">
                  <input
    type="date"
    value={formData.dateOfBirth}
    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {
    /* Group 2: Academic Details */
  }
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Lớp, Chuyên ngành & Khoa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lớp sinh hoạt</label>
                <select
    value={formData.classCode}
    onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  >
                  <option value="20CNTT1">20CNTT1 - Công nghệ Thông tin 1</option>
                  <option value="20CNTT2">20CNTT2 - Công nghệ Thông tin 2</option>
                  <option value="20KTPM1">20KTPM1 - Kỹ thuật Phần mềm 1</option>
                  <option value="20HTTT1">20HTTT1 - Hệ thống Thông tin 1</option>
                  <option value="20KDL1">20KDL1 - Khoa học Dữ liệu 1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên ngành đào tạo</label>
                <select
    value={formData.major}
    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  >
                  <option value="Công nghệ phần mềm">Công nghệ phần mềm</option>
                  <option value="Khoa học dữ liệu">Khoa học dữ liệu</option>
                  <option value="An toàn thông tin">An toàn thông tin</option>
                  <option value="Hệ thống thông tin">Hệ thống thông tin</option>
                  <option value="Mạng máy tính">Mạng máy tính & Truyền thông</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khoa quản lý</label>
                <input
    type="text"
    value={formData.faculty}
    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khóa học</label>
                <input
    type="text"
    value={formData.cohort}
    onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  />
              </div>
            </div>
          </div>

          {
    /* Group 3: Contact & Internship */
  }
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Liên hệ & Doanh nghiệp
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email sinh viên</label>
                <div className="relative">
                  <input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder={`${formData.mssv || "mssv"}@student.fit.edu.vn`}
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
                <div className="relative">
                  <input
    type="text"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    placeholder="VD: 0988 123 456"
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doanh nghiệp tiếp nhận</label>
                <select
    value={formData.companyName}
    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  >
                  <option value="Chưa có doanh nghiệp">Chưa có doanh nghiệp</option>
                  <option value="FPT Software HCM">FPT Software HCM</option>
                  <option value="VNG Corporation">VNG Corporation</option>
                  <option value="Viettel Telecom">Viettel Telecom</option>
                  <option value="Shopee Việt Nam">Shopee Việt Nam</option>
                  <option value="MISA JSC">MISA JSC</option>
                  <option value="Tiki Corporation">Tiki Corporation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giảng viên hướng dẫn</label>
                <select
    value={formData.assignedLecturer}
    onChange={(e) => setFormData({ ...formData, assignedLecturer: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
  >
                  <option value="Chưa phân công">Chưa phân công</option>
                  <option value="TS. Nguyễn Văn Phước">TS. Nguyễn Văn Phước</option>
                  <option value="ThS. Trần Thu Hà">ThS. Trần Thu Hà</option>
                  <option value="PGS.TS. Lê Hoàng Nam">PGS.TS. Lê Hoàng Nam</option>
                  <option value="TS. Phạm Minh Tuấn">TS. Phạm Minh Tuấn</option>
                  <option value="ThS. Nguyễn Thị Mai">ThS. Nguyễn Thị Mai</option>
                </select>
              </div>
            </div>
          </div>

          {
    /* Account Settings */
  }
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
    type="checkbox"
    checked={formData.createAccountImmediately}
    onChange={(e) => setFormData({ ...formData, createAccountImmediately: e.target.checked })}
    className="mt-1 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
  />
              <div>
                <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Cấp tài khoản đăng nhập ngay sau khi tạo
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  Tên đăng nhập: <strong className="text-indigo-900">{formData.mssv || "MSSV"}</strong> — Mật khẩu mặc định: <strong className="text-indigo-900">Configured by System Settings</strong> (người dùng sẽ đổi khi đăng nhập lần đầu).
                </p>
              </div>
            </label>
          </div>

          {
    /* Footer Actions */
  }
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
  >
              Hủy bỏ
            </button>
            <button
    type="submit"
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center space-x-2 cursor-pointer"
  >
              <Save className="w-4 h-4" />
              <span>Xác nhận thêm sinh viên</span>
            </button>
          </div>

        </form>

      </div>
    </div>;
};
