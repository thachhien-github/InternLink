import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
export const FilterBar = ({
  filters,
  onFilterChange,
  onReset
}) => {
  return <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 mb-5">
      {
    /* Search Input */
  }
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
    type="text"
    placeholder="Tìm kiếm sinh viên, MSSV, lớp, doanh nghiệp..."
    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
  />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
    onClick={onReset}
    className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
    title="Xóa bộ lọc"
  >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đặt lại</span>
          </button>
          <button
    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
    title="Tùy chỉnh cột"
  >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {
    /* Smart Filters Grid */
  }
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Học kỳ</label>
          <select
    value={filters.term}
    onChange={(e) => onFilterChange("term", e.target.value)}
    className="w-full p-1.5 bg-blue-50/80 border border-blue-200 rounded-lg outline-none font-bold text-blue-900 text-[11px]"
  >
            <option value="Học kỳ I - 2026">HK I - 2026</option>
            <option value="Học kỳ II - 2026">HK II - 2026</option>
            <option value="Hè 2026">Hè 2026</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Lớp</label>
          <select
    value={filters.classGroup}
    onChange={(e) => onFilterChange("classGroup", e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 text-[11px]"
  >
            <option value="Tất cả">Tất cả lớp</option>
            <option value="CNTT-K15A">CNTT-K15A</option>
            <option value="CNTT-K15B">CNTT-K15B</option>
            <option value="CNTT-02">CNTT-02</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doanh nghiệp</label>
          <select
    value={filters.enterprise}
    onChange={(e) => onFilterChange("enterprise", e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 text-[11px]"
  >
            <option value="Tất cả">Tất cả DN</option>
            <option value="FPT Software">FPT Software</option>
            <option value="VNG Corporation">VNG Corp</option>
            <option value="Viettel Group">Viettel Group</option>
            <option value="VinFast">VinFast</option>
            <option value="MB Bank">MB Bank</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trạng thái</label>
          <select
    value={filters.status}
    onChange={(e) => onFilterChange("status", e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 text-[11px]"
  >
            <option value="Tất cả">Tất cả TT</option>
            <option value="Đúng hạn">Đúng hạn</option>
            <option value="Chậm">Chậm tiến độ</option>
            <option value="Quá hạn">Quá hạn</option>
            <option value="Xong">Đã xong</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">GPA</label>
          <select
    value={filters.gpaRange}
    onChange={(e) => onFilterChange("gpaRange", e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 text-[11px]"
  >
            <option value="Tất cả">Tất cả GPA</option>
            <option value=">3.6">GPA &gt; 3.6 (Xuất sắc)</option>
            <option value="3.2-3.6">GPA 3.2 - 3.6 (Giỏi)</option>
            <option value="<3.0">GPA &lt; 3.0 (Cần chú ý)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Chuyên ngành</label>
          <select
    value={filters.major}
    onChange={(e) => onFilterChange("major", e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 text-[11px]"
  >
            <option value="Tất cả">Tất cả ngành</option>
            <option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm</option>
            <option value="Khoa học Máy tính">Khoa học Máy tính</option>
            <option value="Mạng máy tính">Mạng máy tính</option>
            <option value="An toàn Thông tin">An toàn Thông tin</option>
          </select>
        </div>
      </div>
    </div>;
};
