import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { InitialsAvatar } from '../../../components/common/InitialsAvatar';
import type { Student } from '../../../types/student';

type StudentDetailModalProps = {
  student: Student | null;
  onClose: () => void;
  onSendReminder?: (student: Student) => void;
  onAssignCompany?: (companyName: string) => void;
  companyOptions?: Array<{ id: string; name: string }>;
};

const STATUS_OPTIONS = [
  'Đúng tiến độ',
  'Chờ phản hồi',
  'Đang chỉnh sửa',
  'Quá hạn',
  'Hoàn thành',
];

const renderStatusChip = (status: string) => {
  switch (status) {
    case 'Đúng tiến độ':
    case 'Đang tiến hành':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
          <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500" />
          Đúng tiến độ
        </span>
      );
    case 'Chờ phản hồi':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
          <span className="inline-flex w-2 h-2 rounded-full bg-amber-500" />
          Chờ phản hồi
        </span>
      );
    case 'Đang chỉnh sửa':
    case 'Chậm':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
          <span className="inline-flex w-2 h-2 rounded-full bg-blue-500" />
          Đang chỉnh sửa
        </span>
      );
    case 'Quá hạn':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
          <span className="inline-flex w-2 h-2 rounded-full bg-rose-500" />
          Quá hạn
        </span>
      );
    case 'Hoàn thành':
    case 'Đã xong':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
          <span className="inline-flex w-2 h-2 rounded-full bg-blue-500" />
          Hoàn thành
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
          Chưa phân công DN
        </span>
      );
  }
};

export const StudentDetailModal = ({
  student,
  onClose,
  onSendReminder,
  onAssignCompany,
  companyOptions = [],
}: StudentDetailModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (student) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [student, onClose]);

  if (!student) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-white rounded-lg p-5 max-w-2xl w-full shadow-md border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-full bg-blue-500 items-center justify-center text-white text-[10px] font-bold">
              ST
            </span>
            Hồ sơ chi tiết sinh viên thực tập
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar + info */}
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
              />
            ) : (
              <InitialsAvatar name={student.name} size={56} />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-slate-900">{student.name}</h4>
                {renderStatusChip(student.status)}
              </div>
              <p className="text-slate-500 font-mono">
                MSSV: {student.mssv} • Lớp: {student.class}
              </p>
              {student.major && (
                <p className="text-blue-600 font-semibold">Chuyên ngành: {student.major}</p>
              )}
            </div>
          </div>

          {/* Two column info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Doanh nghiệp tiếp nhận</p>
              <p className="font-bold text-slate-900 text-sm">{student.company}</p>
              {student.position && (
                <p className="text-slate-600">
                  Vị trí: <strong>{student.position}</strong>
                </p>
              )}
              {student.supervisor && (
                <p className="text-slate-500 text-[11px]">Mentor: {student.supervisor}</p>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Giảng viên hướng dẫn</p>
              <p className="font-bold text-slate-900 text-sm">{student.lecturer}</p>
              {student.gpa != null && (
                <p className="text-blue-600 font-bold">Điểm GPA tích lũy: {student.gpa} / 4.0</p>
              )}
            </div>
          </div>

          {/* Progress card */}
          {student.progress != null && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-md space-y-1.5">
              <div className="flex justify-between font-bold text-blue-900">
                <span>Tiến độ thực tập: {student.progress}%</span>
                <span>Bài nộp gần nhất: {student.lastReportDate || 'Mới nhất'}</span>
              </div>
              <p className="text-slate-700 font-medium">
                {student.lastReportName || 'Chưa nộp bài'}
              </p>
            </div>
          )}

          {/* Quick actions */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-xs transition-colors"
            >
              Đóng
            </button>
            {onSendReminder && (
              <button
                type="button"
                onClick={() => {
                  onSendReminder(student);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs transition-colors"
              >
                Gửi nhắc nộp bài
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
