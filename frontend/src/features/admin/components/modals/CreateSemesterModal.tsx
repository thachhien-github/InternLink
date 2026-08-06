import { useState } from 'react';
import { CalendarPlus, X, Save } from 'lucide-react';
export const CreateSemesterModal = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [semesterName, setSemesterName] = useState("Th\u1EF1c t\u1EADp T\u1ED1t nghi\u1EC7p K21 (2026 - 2027)");
  const [term, setTerm] = useState("H\u1ECDc k\u1EF3 I");
  const [academicYear, setAcademicYear] = useState("2026 - 2027");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-12-15");
  const [targetStudents, setTargetStudents] = useState("1350");
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onShowToast(`\u0110\xE3 t\u1EA1o th\xE0nh c\xF4ng \u0111\u1EE3t th\u1EF1c t\u1EADp: "${semesterName}"!`);
    onClose();
  };
  return <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
        
        {
    /* Modal Header */
  }
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Tạo mới Kỳ thực tập</h3>
              <p className="text-xs text-slate-500 font-medium">Thiết lập thông tin học kỳ và mốc thời gian thực tập</p>
            </div>
          </div>
          <button
    onClick={onClose}
    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Modal Form */
  }
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tên đợt thực tập *</label>
            <input
    type="text"
    value={semesterName}
    onChange={(e) => setSemesterName(e.target.value)}
    required
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Học kỳ *</label>
              <select
    value={term}
    onChange={(e) => setTerm(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  >
                <option value="Học kỳ I">Học kỳ I</option>
                <option value="Học kỳ II">Học kỳ II</option>
                <option value="Học kỳ Hè">Học kỳ Hè</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Niên khóa *</label>
              <input
    type="text"
    value={academicYear}
    onChange={(e) => setAcademicYear(e.target.value)}
    required
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu *</label>
              <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    required
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc *</label>
              <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    required
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chỉ tiêu Sinh viên dự kiến</label>
            <input
    type="number"
    value={targetStudents}
    onChange={(e) => setTargetStudents(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  />
          </div>

          {
    /* Action Buttons */
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
    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
              <Save className="w-4 h-4" />
              <span>Tạo đợt thực tập</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
