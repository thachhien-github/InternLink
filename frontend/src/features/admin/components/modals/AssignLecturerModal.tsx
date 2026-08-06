import { useState, useMemo } from 'react';
import {
  UserPlus,
  X,
  Sparkles,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';
export const AssignLecturerModal = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [students] = useState([
    { id: "st-101", studentId: "20110201", fullName: "Nguy\u1EC5n V\u0103n Minh", classCode: "20CNTT1", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "FPT Software HCM" },
    { id: "st-102", studentId: "20110202", fullName: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o", classCode: "20CNTT1", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "VNG Corporation" },
    { id: "st-103", studentId: "20110205", fullName: "L\xEA Ho\xE0ng Nam", classCode: "20KTPM1", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "Viettel Telecom" },
    { id: "st-104", studentId: "20110208", fullName: "Ph\u1EA1m \u0110\u0103ng Khoa", classCode: "20KTPM2", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "MGM Technology" },
    { id: "st-105", studentId: "20110212", fullName: "V\u0169 Ng\u1ECDc B\u1EA3o Tr\xE2m", classCode: "20MMT1", major: "M\u1EA1ng m\xE1y t\xEDnh & TTTT", companyName: "TMA Solutions" },
    { id: "st-106", studentId: "20110215", fullName: "\u0110\u1EB7ng Qu\u1ED1c Huy", classCode: "20HTTT1", major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin", companyName: "Shopee Vietnam" },
    { id: "st-107", studentId: "20110219", fullName: "B\xF9i Anh Tu\u1EA5n", classCode: "20CNTT2", major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin", companyName: "KMS Technology" },
    { id: "st-108", studentId: "20110222", fullName: "Ho\xE0ng Th\u1ECB M\u1EF9 Duy\xEAn", classCode: "20KTPM1", major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", companyName: "Ch\u1EE3 T\u1ED1t (Carousell)" }
  ]);
  const [selectedStudentIds, setSelectedStudentIds] = useState(["st-101"]);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState("TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc (BM C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m - Capaciy 28/40)");
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) => s.fullName.toLowerCase().includes(searchStudent.toLowerCase()) || s.studentId.toLowerCase().includes(searchStudent.toLowerCase()) || s.classCode.toLowerCase().includes(searchStudent.toLowerCase())
    );
  }, [students, searchStudent]);
  if (!isOpen) return null;
  const handleToggleStudent = (id) => {
    setSelectedStudentIds(
      (prev) => prev.includes(id) ? prev.filter((stId) => stId !== id) : [...prev, id]
    );
  };
  const handleSelectAllFiltered = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      onShowToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 sinh vi\xEAn!");
      return;
    }
    const names = students.filter((s) => selectedStudentIds.includes(s.id)).map((s) => s.fullName).join(", ");
    onShowToast(`\u0110\xE3 ph\xE2n c\xF4ng ${selectedStudentIds.length} sinh vi\xEAn (${names}) cho ${selectedLecturer}!`);
    onClose();
  };
  return <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
        
        {
    /* Header */
  }
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Phân công Từng Sinh viên</h3>
              <p className="text-xs text-slate-500 font-medium">Lựa chọn từng sinh viên cụ thể để ghép nối với Giảng viên hướng dẫn</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Content */
  }
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {
    /* STEP 1: INDIVIDUAL STUDENT SELECTION */
  }
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-extrabold text-slate-800">
                1. Chọn từng sinh viên cụ thể ({selectedStudentIds.length} đã chọn) *
              </label>

              <button
    type="button"
    onClick={handleSelectAllFiltered}
    className="text-[11px] font-bold text-emerald-600 hover:underline"
  >
                {selectedStudentIds.length === filteredStudents.length ? "B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3" : "Ch\u1ECDn t\u1EA5t c\u1EA3"}
              </button>
            </div>

            {
    /* Search Student Input */
  }
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
    type="text"
    value={searchStudent}
    onChange={(e) => setSearchStudent(e.target.value)}
    placeholder="Tìm kiếm theo Tên sinh viên, MSSV hoặc Lớp..."
    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-emerald-500"
  />
            </div>

            {
    /* List of Individual Students */
  }
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50 p-1 space-y-1">
              {filteredStudents.length === 0 ? <p className="p-4 text-center text-slate-400 font-medium italic">Không tìm thấy sinh viên nào khớp với từ khóa.</p> : filteredStudents.map((st) => {
    const isChecked = selectedStudentIds.includes(st.id);
    return <div
      key={st.id}
      onClick={() => handleToggleStudent(st.id)}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isChecked ? "bg-emerald-50/80 border border-emerald-200" : "hover:bg-slate-100 bg-white border border-transparent"}`}
    >
                      <div className="flex items-center gap-2.5">
                        <button type="button" onClick={(e) => {
      e.stopPropagation();
      handleToggleStudent(st.id);
    }}>
                          {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">{st.fullName}</span>
                            <span className="font-mono text-[10px] font-bold text-slate-500">({st.studentId})</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {st.classCode} • {st.major} {st.companyName ? `\u2022 ${st.companyName}` : ""}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isChecked ? "bg-emerald-200 text-emerald-900" : "bg-slate-100 text-slate-500"}`}>
                        {isChecked ? "\u0110\xE3 ch\u1ECDn" : "Ch\u01B0a ch\u1ECDn"}
                      </span>
                    </div>;
  })}
            </div>
          </div>

          {
    /* STEP 2: LECTURER SELECTION */
  }
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-800">2. Chọn Giảng viên tiếp nhận *</label>
            <select
    value={selectedLecturer}
    onChange={(e) => setSelectedLecturer(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
  >
              <option value="TS. Nguyễn Văn Phước (BM Công nghệ Phần mềm - Capacity 28/40)">TS. Nguyễn Văn Phước (Tải: 28/40 SV)</option>
              <option value="ThS. Trần Thị Mai Anh (BM Công nghệ Phần mềm - Capacity 38/40)">ThS. Trần Thị Mai Anh (Tải: 38/40 SV)</option>
              <option value="PGS.TS. Lê Hoàng Thái (BM Mạng máy tính & TTTT - Capacity 15/35)">PGS.TS. Lê Hoàng Thái (Tải: 15/35 SV)</option>
              <option value="TS. Đặng Minh Châu (BM Hệ thống Thông tin - Capacity 32/40)">TS. Đặng Minh Châu (Tải: 32/40 SV)</option>
              <option value="ThS. Phạm Quốc Bảo (BM Công nghệ Phần mềm - Capacity 10/30)">ThS. Phạm Quốc Bảo (Tải: 10/30 SV)</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-emerald-800 font-medium">
              Sau khi xác nhận, {selectedStudentIds.length} sinh viên cá nhân đã chọn sẽ được chuyển sang danh sách hướng dẫn của Giảng viên.
            </p>
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
    disabled={selectedStudentIds.length === 0}
    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
              <UserPlus className="w-4 h-4" />
              <span>Phân công {selectedStudentIds.length} sinh viên</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
