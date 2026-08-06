import { useState } from 'react';
import { Toast } from '../../../components/common/Toast';
import {
  ArrowLeft,
  Building2,
  Save,
  X,
  Plus,
  Clock
} from 'lucide-react';
export const CompanyFormWorkspace = ({
  initialData,
  onBack,
  onSave
}) => {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name || "");
  const [shortCode, setShortCode] = useState(initialData?.shortCode || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [field, setField] = useState(initialData?.field || "C\xF4ng ngh\u1EC7 Th\xF4ng tin / Ph\u1EA7n m\u1EC1m");
  const [logoUrl, setLogoUrl] = useState(initialData?.logo || "");
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || "");
  const [contactPosition, setContactPosition] = useState("Senior HR Manager");
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || "");
  const [positions, setPositions] = useState(
    initialData?.openPositions && initialData.openPositions.length > 0 ? initialData.openPositions : ["Fullstack Developer", "Data Engineer", "DevOps Specialist"]
  );
  const [newPositionInput, setNewPositionInput] = useState("");
  const [suitableMajors, setSuitableMajors] = useState(["K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m", "Khoa h\u1ECDc D\u1EEF li\u1EC7u", "H\u1EC7 th\u1ED1ng Th\xF4ng tin"]);
  const [requiredSkills, setRequiredSkills] = useState("JavaScript, React, Node.js, SQL, Git, Ti\u1EBFng Anh giao ti\u1EBFp");
  const [capacity, setCapacity] = useState(initialData?.capacity || 25);
  const [hasStipend, setHasStipend] = useState(initialData?.hasStipend ?? true);
  const [stipendAmount, setStipendAmount] = useState("6.000.000 - 9.000.000 VN\u0110 / th\xE1ng");
  const [internDuration, setInternDuration] = useState("3 - 4 th\xE1ng (40h / tu\u1EA7n)");
  const [internalNotes, setInternalNotes] = useState(
    "Doanh nghi\u1EC7p uy t\xEDn, h\u1ED7 tr\u1EE3 Mentor 1-on-1 s\xE1t sao. Khuy\u1EBFn kh\xEDch gi\u1EDBi thi\u1EC7u sinh vi\xEAn c\xF3 GPA > 3.0."
  );
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Vui l\xF2ng nh\u1EADp t\xEAn doanh nghi\u1EC7p!";
    if (!website.trim()) {
      errs.website = "Vui l\xF2ng nh\u1EADp website!";
    } else if (!website.startsWith("http://") && !website.startsWith("https://")) {
      errs.website = "Website ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng http:// ho\u1EB7c https://";
    }
    if (!location.trim()) errs.location = "Vui l\xF2ng nh\u1EADp \u0111\u1ECBa ch\u1EC9 tr\u1EE5 s\u1EDF!";
    if (!contactPerson.trim()) errs.contactPerson = "Vui l\xF2ng nh\u1EADp t\xEAn ng\u01B0\u1EDDi li\xEAn h\u1EC7!";
    if (!contactEmail.trim()) {
      errs.contactEmail = "Vui l\xF2ng nh\u1EADp email li\xEAn h\u1EC7!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      errs.contactEmail = "Email kh\xF4ng h\u1EE3p l\u1EC7!";
    }
    if (!contactPhone.trim()) errs.contactPhone = "Vui l\xF2ng nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i li\xEAn h\u1EC7!";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleAddPosition = () => {
    if (newPositionInput.trim() && !positions.includes(newPositionInput.trim())) {
      setPositions([...positions, newPositionInput.trim()]);
      setNewPositionInput("");
    }
  };
  const handleRemovePosition = (index) => {
    setPositions(positions.filter((_, i) => i !== index));
  };
  const handleSubmit = (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      triggerToast("Vui l\xF2ng ki\u1EC3m tra l\u1EA1i c\xE1c th\xF4ng tin c\xF2n thi\u1EBFu!");
      return;
    }
    const payload = {
      id: initialData?.id || `dn-${Date.now()}`,
      name,
      shortCode: shortCode || name.substring(0, 3).toUpperCase(),
      website,
      location,
      field,
      contactPerson,
      contactEmail,
      contactPhone,
      openPositions: positions,
      capacity,
      badge: "CH\xCDNH TH\u1EE8C",
      badgeType: "gray",
      status: isDraft ? "Ch\u1EDD duy\u1EC7t" : isEditing ? initialData?.status || "\u0110ang h\u1EE3p t\xE1c" : "\u0110ang h\u1EE3p t\xE1c",
      updatedAt: "H\xF4m nay"
    };
    onSave(payload, isDraft);
  };
  return <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {
    /* Toast alert */
  }
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {
    /* PAGE HEADER & BACK NAVIGATION */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
    onClick={onBack}
    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
    title="Quay lại"
  >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isEditing ? `Ch\u1EC9nh s\u1EEDa th\xF4ng tin: ${initialData.name}` : "Th\xEAm doanh nghi\u1EC7p m\u1EDBi"}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Nhập đầy đủ hồ sơ đối tác doanh nghiệp để quản lý và phân công sinh viên thực tập.
            </p>
          </div>
        </div>

        {
    /* Action Buttons */
  }
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
    type="button"
    onClick={onBack}
    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200"
  >
            Hủy
          </button>

          <button
    type="button"
    onClick={() => handleSubmit(true)}
    className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 font-extrabold text-xs rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5"
  >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Lưu nháp</span>
          </button>

          <button
    type="button"
    onClick={() => handleSubmit(false)}
    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
  >
            <Save className="w-4 h-4" />
            <span>Lưu doanh nghiệp</span>
          </button>
        </div>
      </div>

      {
    /* MULTI-SECTION FORM BODY */
  }
      <div className="space-y-6">
        {
    /* SECTION 1: THÔNG TIN CƠ BẢN */
  }
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Thông tin cơ bản
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {
    /* Tên doanh nghiệp */
  }
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Tên doanh nghiệp <span className="text-rose-500">*</span>
              </label>
              <input
    type="text"
    value={name}
    onChange={(e) => {
      setName(e.target.value);
      if (errors.name) setErrors({ ...errors, name: "" });
    }}
    placeholder="VD: Tập đoàn FPT Software, Công ty Cổ phần VNG..."
    className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none font-semibold text-slate-900 transition-colors ${errors.name ? "border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-blue-500 focus:bg-white"}`}
  />
              {errors.name && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.name}</p>}
            </div>

            {
    /* Mã viết tắt & Logo */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">Mã viết tắt / Badge</label>
              <input
    type="text"
    value={shortCode}
    onChange={(e) => setShortCode(e.target.value)}
    placeholder="VD: FPT, VNG, VF..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
  />
            </div>

            {
    /* Lĩnh vực hoạt động */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">Lĩnh vực hoạt động</label>
              <select
    value={field}
    onChange={(e) => setField(e.target.value)}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
  >
                <option value="Công nghệ Thông tin / Phần mềm">Công nghệ Thông tin / Phần mềm</option>
                <option value="Viễn thông & Giải pháp Số">Viễn thông &amp; Giải pháp Số</option>
                <option value="Ngân hàng / Fintech">Ngân hàng / Fintech</option>
                <option value="Internet / Trò chơi / Cloud">Internet / Trò chơi / Cloud</option>
                <option value="Công nghệ Ô tô / AI Mobility">Công nghệ Ô tô / AI Mobility</option>
                <option value="Thương mại Điện tử">Thương mại Điện tử</option>
              </select>
            </div>

            {
    /* Website */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Website <span className="text-rose-500">*</span>
              </label>
              <input
    type="url"
    value={website}
    onChange={(e) => {
      setWebsite(e.target.value);
      if (errors.website) setErrors({ ...errors, website: "" });
    }}
    placeholder="https://company.com"
    className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none font-semibold text-slate-900 transition-colors ${errors.website ? "border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-blue-500 focus:bg-white"}`}
  />
              {errors.website && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.website}</p>}
            </div>

            {
    /* Địa chỉ trụ sở */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Địa chỉ trụ sở / Chi nhánh thực tập <span className="text-rose-500">*</span>
              </label>
              <input
    type="text"
    value={location}
    onChange={(e) => {
      setLocation(e.target.value);
      if (errors.location) setErrors({ ...errors, location: "" });
    }}
    placeholder="VD: Khu Công nghệ cao Hòa Lạc, Hà Nội..."
    className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none font-semibold text-slate-900 transition-colors ${errors.location ? "border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-blue-500 focus:bg-white"}`}
  />
              {errors.location && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.location}</p>}
            </div>
          </div>
        </div>

        {
    /* SECTION 2: NGƯỜI LIÊN HỆ */
  }
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Người liên hệ (HR / Mentor Lead)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {
    /* Họ tên người liên hệ */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Họ và tên người liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
    type="text"
    value={contactPerson}
    onChange={(e) => {
      setContactPerson(e.target.value);
      if (errors.contactPerson) setErrors({ ...errors, contactPerson: "" });
    }}
    placeholder="VD: Trần Thị Thu Hà"
    className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none font-semibold text-slate-900 transition-colors ${errors.contactPerson ? "border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-blue-500 focus:bg-white"}`}
  />
              {errors.contactPerson && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.contactPerson}</p>}
            </div>

            {
    /* Chức vụ */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">Chức vụ</label>
              <input
    type="text"
    value={contactPosition}
    onChange={(e) => setContactPosition(e.target.value)}
    placeholder="VD: Senior HR Manager, Tech Recruiter..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
  />
            </div>

            {
    /* Email */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Email liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
    type="email"
    value={contactEmail}
    onChange={(e) => {
      setContactEmail(e.target.value);
      if (errors.contactEmail) setErrors({ ...errors, contactEmail: "" });
    }}
    placeholder="hr@company.com"
    className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none font-semibold text-slate-900 transition-colors ${errors.contactEmail ? "border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-blue-500 focus:bg-white"}`}
  />
              {errors.contactEmail && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.contactEmail}</p>}
            </div>

            {
    /* Điện thoại */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Số điện thoại liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
    type="text"
    value={contactPhone}
    onChange={(e) => {
      setContactPhone(e.target.value);
      if (errors.contactPhone) setErrors({ ...errors, contactPhone: "" });
    }}
    placeholder="VD: 024 7300 7300 / 0988 123 456"
    className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none font-semibold text-slate-900 transition-colors ${errors.contactPhone ? "border-rose-500 bg-rose-50/50" : "border-slate-200 focus:border-blue-500 focus:bg-white"}`}
  />
              {errors.contactPhone && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.contactPhone}</p>}
            </div>
          </div>
        </div>

        {
    /* SECTION 3: TUYỂN THỰC TẬP */
  }
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Chỉ tiêu &amp; Vị trí tuyển thực tập
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {
    /* Dynamic Position Tagging */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">Vị trí tuyển dụng</label>
              <div className="flex items-center gap-2 mb-2">
                <input
    type="text"
    value={newPositionInput}
    onChange={(e) => setNewPositionInput(e.target.value)}
    placeholder="Thêm vị trí mới (VD: AI Engineer, React Dev)..."
    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-medium"
  />
                <button
    type="button"
    onClick={handleAddPosition}
    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
  >
                  <Plus className="w-3.5 h-3.5" /> Thêm
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {positions.map((pos, pIdx) => <span
    key={pIdx}
    className="px-3 py-1 bg-blue-50 text-blue-800 font-bold rounded-xl border border-blue-200 flex items-center gap-1.5"
  >
                    <span>{pos}</span>
                    <button
    type="button"
    onClick={() => handleRemovePosition(pIdx)}
    className="p-0.5 hover:bg-blue-200 rounded-full text-blue-600"
  >
                      <X className="w-3 h-3" />
                    </button>
                  </span>)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {
    /* Ngành phù hợp */
  }
              <div>
                <label className="block font-bold text-slate-800 mb-1">Ngành đào tạo phù hợp</label>
                <input
    type="text"
    value={suitableMajors.join(", ")}
    onChange={(e) => setSuitableMajors(e.target.value.split(",").map((s) => s.trim()))}
    placeholder="Kỹ thuật Phần mềm, Khoa học Dữ liệu, HTTT..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900"
  />
              </div>

              {
    /* Số lượng tiếp nhận */
  }
              <div>
                <label className="block font-bold text-slate-800 mb-1">Chỉ tiêu tiếp nhận tối đa (Sinh viên)</label>
                <input
    type="number"
    min="1"
    max="200"
    value={capacity}
    onChange={(e) => setCapacity(Number(e.target.value))}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900"
  />
              </div>
            </div>

            {
    /* Kỹ năng yêu cầu */
  }
            <div>
              <label className="block font-bold text-slate-800 mb-1">Kỹ năng chuyên môn yêu cầu</label>
              <input
    type="text"
    value={requiredSkills}
    onChange={(e) => setRequiredSkills(e.target.value)}
    placeholder="VD: JavaScript, React, Node.js, SQL, Git, Tiếng Anh..."
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900"
  />
            </div>

            <div>
              {
    /* Thời gian thực tập */
  }
              <div>
                <label className="block font-bold text-slate-800 mb-1">Thời gian thực tập dự kiến</label>
                <input
    type="text"
    value={internDuration}
    onChange={(e) => setInternDuration(e.target.value)}
    placeholder="VD: 3 - 4 tháng (Thứ 2 - Thứ 6)"
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900"
  />
              </div>
            </div>
          </div>
        </div>

        {
    /* SECTION 4: GHI CHÚ NỘI BỘ DÀNH CHO GIẢNG VIÊN */
  }
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Ghi chú nội bộ dành cho Giảng viên (Internal Notes)
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-500 italic">
              * Ghi chú này chỉ hiển thị cho Giảng viên hướng dẫn &amp; Ban quản lý thực tập Khoa, sinh viên không xem được.
            </p>
            <textarea
    rows={3}
    value={internalNotes}
    onChange={(e) => setInternalNotes(e.target.value)}
    placeholder="Nhập ghi chú đặc thù, yêu cầu riêng hoặc lưu ý khi giới thiệu sinh viên cho doanh nghiệp này..."
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800 focus:border-blue-500 focus:bg-white"
  />
          </div>
        </div>
      </div>
    </div>;
};
