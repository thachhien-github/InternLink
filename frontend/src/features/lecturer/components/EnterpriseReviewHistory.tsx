import { Star, Building2, Users, Award, ThumbsUp, MessageSquare, CheckCircle2 } from 'lucide-react';

interface EnterpriseReview {
  id: string;
  year: string;
  studentName: string;
  mssv: string;
  rating: number;
  environmentScore: number;
  mentorScore: number;
  stipendStatus: string;
  comment: string;
  hiringOffer: boolean;
}

interface EnterpriseReviewHistoryProps {
  enterpriseName?: string;
  reviews?: EnterpriseReview[];
}

export const EnterpriseReviewHistory = ({
  enterpriseName = 'FPT Software',
  reviews
}: EnterpriseReviewHistoryProps) => {
  const defaultReviews: EnterpriseReview[] = reviews || [
    {
      id: 'rev-1',
      year: 'HK1 - 2026',
      studentName: 'Trần Tuấn Anh',
      mssv: '2421160043',
      rating: 5,
      environmentScore: 4.9,
      mentorScore: 5.0,
      stipendStatus: 'Hỗ trợ 5,000,000 VNĐ / tháng',
      comment: 'Môi trường làm việc rất chuyên nghiệp, anh Mentor Hải hỗ trợ sát sao các bài toán thực tế. Quy trình CI/CD và Code Review nghiêm ngặt giúp em học hỏi rất nhiều.',
      hiringOffer: true
    },
    {
      id: 'rev-2',
      year: 'HK2 - 2025',
      studentName: 'Nguyễn Nhật Minh',
      mssv: '2421160033',
      rating: 4.8,
      environmentScore: 4.7,
      mentorScore: 4.9,
      stipendStatus: 'Hỗ trợ 4,500,000 VNĐ / tháng',
      comment: 'Doanh nghiệp cấp máy tính và tài khoản cloud test đầy đủ. Được trực tiếp tham gia dự án Enterprise của khách hàng Nhật Bản.',
      hiringOffer: true
    },
    {
      id: 'rev-3',
      year: 'HK1 - 2025',
      studentName: 'Lê Anh Tài',
      mssv: '2421160015',
      rating: 4.5,
      environmentScore: 4.5,
      mentorScore: 4.5,
      stipendStatus: 'Có trợ cấp',
      comment: 'Văn phòng hiện đại, team làm việc vui vẻ. Đợt thực tập mang lại nhiều kiến thức thực tế.',
      hiringOffer: false
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Đánh giá môi trường thực tập & Lịch sử hợp tác: <span className="text-blue-600">{enterpriseName}</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Tổng hợp nhận xét thực tế từ Sinh viên các đợt trước</p>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-xs font-black text-amber-700">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>4.9 / 5.0 (38 đánh giá)</span>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {defaultReviews.map((rev) => (
          <div key={rev.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">{rev.studentName}</span>
                <span className="text-[10px] text-slate-400 font-mono">({rev.mssv})</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                  {rev.year}
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{rev.rating}.0</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
              <span className="text-slate-500 font-medium">💰 Mức trợ cấp: <strong className="text-emerald-700">{rev.stipendStatus}</strong></span>
              {rev.hiringOffer && (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Được đề xuất tuyển dụng chính thức
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
