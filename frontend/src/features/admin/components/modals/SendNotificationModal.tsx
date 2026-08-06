import { useState } from 'react';
import { Send, X } from 'lucide-react';
export const SendNotificationModal = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [recipientGroup, setRecipientGroup] = useState("toan-khoa");
  const [title, setTitle] = useState("Th\xF4ng b\xE1o N\u1ED9p b\xE1o c\xE1o gi\u1EEFa k\u1EF3 \u0111\u1EE3t th\u1EF1c t\u1EADp HK1 (2025-2026)");
  const [content, setContent] = useState("Y\xEAu c\u1EA7u to\xE0n b\u1ED9 sinh vi\xEAn ho\xE0n th\xE0nh file b\xE1o c\xE1o gi\u1EEFa k\u1EF3 tr\u01B0\u1EDBc ng\xE0y 15/10/2025 v\xE0 g\u1EEDi Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn duy\u1EC7t.");
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onShowToast("\u0110\xE3 ph\xE1t th\xF4ng b\xE1o th\xE0nh c\xF4ng cho h\u1EC7 th\u1ED1ng!");
    onClose();
  };
  return <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95">
        
        {
    /* Header */
  }
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Gửi thông báo Toàn Khoa</h3>
              <p className="text-xs text-slate-500 font-medium">Phát tin tức đến Giảng viên & Sinh viên trong hệ thống</p>
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
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Đối tượng nhận *</label>
            <select
    value={recipientGroup}
    onChange={(e) => setRecipientGroup(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-amber-500"
  >
              <option value="toan-khoa">Toàn Khoa (Tất cả Giảng viên & Sinh viên)</option>
              <option value="sinh-vien">Tất cả Sinh viên thực tập (1,280 SV)</option>
              <option value="giang-vien">Tất cả Giảng viên hướng dẫn (42 GV)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông báo *</label>
            <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-amber-500"
  />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết *</label>
            <textarea
    rows={4}
    value={content}
    onChange={(e) => setContent(e.target.value)}
    required
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-amber-500 resize-none"
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
    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
              <Send className="w-4 h-4" />
              <span>Phát thông báo</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
