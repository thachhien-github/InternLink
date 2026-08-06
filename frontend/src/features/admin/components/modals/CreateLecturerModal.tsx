import { useState } from 'react';
import { UserPlus, X, Save, Sparkles } from 'lucide-react';
export const CreateLecturerModal = ({
  isOpen,
  onClose,
  onShowToast,
  onAddLecturer
}) => {
  const [formData, setFormData] = useState({
    employeeId: "GV" + Math.floor(100 + Math.random() * 900),
    fullName: "",
    academicDegree: "TS",
    faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
    department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
    email: "",
    phone: "",
    maxCapacity: 40,
    createAccountImmediately: true
  });
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp h\u1ECD v\xE0 t\xEAn gi\u1EA3ng vi\xEAn!");
      return;
    }
    if (!formData.email.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp email c\xF4ng v\u1EE5!");
      return;
    }
    const newLecturer = {
      id: "lec-" + Date.now(),
      employeeId: formData.employeeId,
      fullName: `${formData.academicDegree}. ${formData.fullName}`,
      academicDegree: formData.academicDegree,
      faculty: formData.faculty,
      department: formData.department,
      email: formData.email,
      phone: formData.phone || "0901 234 567",
      currentCount: 0,
      maxCapacity: formData.maxCapacity,
      accountStatus: formData.createAccountImmediately ? "active" : "pending",
      guidanceStatus: "available",
      lastLogin: formData.createAccountImmediately ? "Ch\u01B0a t\u1EEBng \u0111\u0103ng nh\u1EADp" : "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n"
    };
    if (onAddLecturer) {
      onAddLecturer(newLecturer);
    }
    onShowToast(`Th\xEAm th\xE0nh c\xF4ng gi\u1EA3ng vi\xEAn ${newLecturer.fullName} (${newLecturer.employeeId})`);
    onClose();
  };
  return <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
        
        {
    /* Header */
  }
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Thêm Giảng viên Mới</h3>
              <p className="text-xs text-slate-500 font-medium">Nhập thông tin hồ sơ giảng viên hướng dẫn thực tập</p>
            </div>
          </div>
          <button
    onClick={onClose}
    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            {
    /* Employee ID */
  }
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã số giảng viên (MSGV) *</label>
              <input
    type="text"
    required
    value={formData.employeeId}
    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
  />
            </div>

            {
    /* Academic Degree */
  }
            <div>
              <label className="block font-bold text-slate-700 mb-1">Học hàm / Học vị</label>
              <select
    value={formData.academicDegree}
    onChange={(e) => setFormData({ ...formData, academicDegree: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
  >
                <option value="ThS">Thạc sĩ (ThS)</option>
                <option value="TS">Tiến sĩ (TS)</option>
                <option value="PGS.TS">Phó Giáo sư, Tiến sĩ (PGS.TS)</option>
                <option value="GS.TS">Giáo sư, Tiến sĩ (GS.TS)</option>
              </select>
            </div>
          </div>

          {
    /* Full Name */
  }
          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ và tên giảng viên *</label>
            <input
    type="text"
    required
    placeholder="Ví dụ: Nguyễn Văn Phước"
    value={formData.fullName}
    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
  />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {
    /* Faculty */
  }
            <div>
              <label className="block font-bold text-slate-700 mb-1">Khoa / Trường *</label>
              <select
    value={formData.faculty}
    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
  >
                <option value="Công nghệ Thông tin">Khoa Công nghệ Thông tin</option>
                <option value="Điện - Điện tử">Khoa Điện - Điện tử</option>
                <option value="Cơ khí">Khoa Cơ khí</option>
              </select>
            </div>

            {
    /* Department */
  }
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bộ môn trực thuộc *</label>
              <select
    value={formData.department}
    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
  >
                <option value="Công nghệ Phần mềm">Bộ môn Công nghệ Phần mềm</option>
                <option value="Mạng máy tính & TTTT">Bộ môn Mạng máy tính & TTTT</option>
                <option value="Hệ thống Thông tin">Bộ môn Hệ thống Thông tin</option>
                <option value="Khoa học Máy tính">Bộ môn Khoa học Máy tính</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {
    /* Email */
  }
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email công vụ (@fit.edu.vn) *</label>
              <input
    type="email"
    required
    placeholder="ten.nguyenvan@fit.edu.vn"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
  />
            </div>

            {
    /* Phone */
  }
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
              <input
    type="text"
    placeholder="0908 123 456"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
  />
            </div>
          </div>

          {
    /* Max Capacity */
  }
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Chỉ tiêu hướng dẫn tối đa (Sức chứa SV)
            </label>
            <input
    type="number"
    min={10}
    max={60}
    value={formData.maxCapacity}
    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 40 })}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
  />
          </div>

          {
    /* Immediate Account Generation */
  }
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Cấp tài khoản đăng nhập ngay
              </p>
              <p className="text-[10px] text-slate-500">
                Tài khoản MSGV sẽ được kích hoạt với mật khẩu mặc định (Fit@2026!)
              </p>
            </div>
            <input
    type="checkbox"
    checked={formData.createAccountImmediately}
    onChange={(e) => setFormData({ ...formData, createAccountImmediately: e.target.checked })}
    className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
  />
          </div>

          {
    /* Buttons */
  }
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors"
  >
              Hủy
            </button>

            <button
    type="submit"
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
              <Save className="w-4 h-4" />
              <span>Lưu hồ sơ giảng viên</span>
            </button>
          </div>

        </form>
      </div>
    </div>;
};
