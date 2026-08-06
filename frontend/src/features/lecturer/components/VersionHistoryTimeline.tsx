import { History, FileText, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

interface VersionItem {
  version: number;
  date: string;
  reportName: string;
  summary: string;
  duplicateScore: number;
  fileSize: string;
  status: 'approved' | 'revision_requested' | 'pending';
  lecturerFeedback?: string;
}

interface VersionHistoryTimelineProps {
  versions?: VersionItem[];
  onSelectVersion?: (version: VersionItem) => void;
}

export const VersionHistoryTimeline = ({ versions, onSelectVersion }: VersionHistoryTimelineProps) => {
  const defaultVersions: VersionItem[] = versions || [
    {
      version: 3,
      date: '24/10/2026 14:20',
      reportName: 'Báo cáo tuần 6 (Bản sửa đổi v3 - Cập nhật ERD Diagram)',
      summary: 'Đã bổ sung sơ đồ ERD Payment Module theo đúng yêu cầu nhận xét của Giảng viên ở Lần 2.',
      duplicateScore: 4,
      fileSize: '3.2 MB',
      status: 'approved',
      lecturerFeedback: 'Báo cáo rất chi tiết, bổ sung sơ đồ chuẩn quy chuẩn. Đạt yêu cầu.'
    },
    {
      version: 2,
      date: '20/10/2026 10:15',
      reportName: 'Báo cáo tuần 6 (Bản sửa đổi v2)',
      summary: 'Đã viết lại phần tổng quan kiến trúc microservices.',
      duplicateScore: 12,
      fileSize: '2.8 MB',
      status: 'revision_requested',
      lecturerFeedback: 'Cần bổ sung sơ đồ ERD cho module Payment mới được tính điểm tối đa.'
    },
    {
      version: 1,
      date: '18/10/2026 16:30',
      reportName: 'Báo cáo tuần 6 (Bản nộp đầu tiên v1)',
      summary: 'Hoàn thành tích hợp OAuth2 Google Login.',
      duplicateScore: 15,
      fileSize: '2.1 MB',
      status: 'revision_requested',
      lecturerFeedback: 'Nội dung quá ngắn, chưa thể hiện đủ công việc tuần này.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" />
          Lịch sử các phiên bản bài nộp (Version History & Diffs)
        </h3>
        <span className="text-xs text-slate-500 font-medium">3 phiên bản đã ghi nhận</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {defaultVersions.map((v) => (
          <div key={v.version} className="relative group">
            {/* Timeline node icon */}
            <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center shrink-0 ${
              v.status === 'approved'
                ? 'border-emerald-600 text-emerald-600'
                : v.status === 'revision_requested'
                ? 'border-amber-500 text-amber-500'
                : 'border-blue-600 text-blue-600'
            }`}>
              {v.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
              {v.status === 'revision_requested' && <AlertTriangle className="w-3 h-3" />}
              {v.status === 'pending' && <Clock className="w-3 h-3" />}
            </div>

            {/* Version Content Card */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/40 transition-colors space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md">
                    v{v.version}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">{v.reportName}</h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{v.date}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">{v.summary}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    File: <strong className="text-slate-700">{v.fileSize}</strong>
                  </span>
                  <span className={`text-[11px] font-bold ${v.duplicateScore > 20 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Trùng lặp AI: {v.duplicateScore}%
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  v.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : v.status === 'revision_requested'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {v.status === 'approved' && 'Đã duyệt'}
                  {v.status === 'revision_requested' && 'Yêu cầu sửa'}
                  {v.status === 'pending' && 'Chờ duyệt'}
                </span>
              </div>

              {v.lecturerFeedback && (
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-700">
                  <strong className="text-blue-700 block mb-0.5">💬 Nhận xét Giảng viên:</strong>
                  {v.lecturerFeedback}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
