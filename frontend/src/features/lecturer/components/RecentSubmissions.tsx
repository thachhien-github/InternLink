import { useState } from 'react';
import { ExternalLink, Check, Clock, X, FileText, ChevronRight } from 'lucide-react';
import type { Submission } from '../../../types/submission';

interface RecentSubmissionsProps {
  submissions: Submission[];
  onViewAll?: () => void;
  onReviewSubmission?: (submission: Submission) => void;
}

export const RecentSubmissions = ({
  submissions,
  onViewAll,
  onReviewSubmission
}: RecentSubmissionsProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
          Bài nộp mới nhất
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Tất cả</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-3.5">SINH VIÊN</th>
              <th className="py-3 px-3.5">DOANH NGHIỆP</th>
              <th className="py-3 px-3.5">LOẠI BÀI</th>
              <th className="py-3 px-3.5">THỜI GIAN</th>
              <th className="py-3 px-3.5 text-right">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium bg-white">
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Student Info */}
                <td className="py-3 px-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sub.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={sub.studentName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {sub.studentName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {sub.mssv}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td className="py-3 px-3.5 text-slate-700 font-semibold">
                  {sub.company}
                </td>

                {/* Report Type */}
                <td className="py-3 px-3.5 text-slate-600">
                  {sub.reportType}
                </td>

                {/* Time */}
                <td className="py-3 px-3.5 text-slate-500 text-[11px]">
                  <div>{sub.time}</div>
                  <div className="text-[10px] text-slate-400">{sub.date}</div>
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3.5 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      sub.status === 'Đã duyệt'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : sub.status === 'Chờ duyệt'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {sub.status === 'Đã duyệt' && <Check className="w-3 h-3" />}
                    {sub.status === 'Chờ duyệt' && <Clock className="w-3 h-3" />}
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Modal Preview */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">Chi tiết bài nộp</h4>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>Sinh viên:</strong> {selectedSubmission.studentName} ({selectedSubmission.mssv})</p>
              <p><strong>Doanh nghiệp:</strong> {selectedSubmission.company}</p>
              <p><strong>Loại báo cáo:</strong> {selectedSubmission.reportType}</p>
              <p><strong>Tóm tắt:</strong> {selectedSubmission.summary}</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  if (onReviewSubmission) onReviewSubmission(selectedSubmission);
                  setSelectedSubmission(null);
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <span>Duyệt bài nộp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
