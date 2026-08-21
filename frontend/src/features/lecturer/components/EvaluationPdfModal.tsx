import React, { useRef } from "react";
import { Printer, Download, X, Award, CheckCircle2, Building, User, Calendar } from "lucide-react";

export interface StudentEvaluationItem {
  id: string;
  name: string;
  mssv: string;
  class: string;
  major: string;
  company: string;
  supervisor: string;
  weeklyReportCount?: string;
  enterpriseScore: number | null;
  lecturerScore: number | null;
  presentationScore: number | null;
  totalScore: number | null;
  status: string;
  gradeClassification?: string;
  lecturerComments?: string;
}

interface EvaluationPdfModalProps {
  student: StudentEvaluationItem;
  onClose: () => void;
}

export const EvaluationPdfModal: React.FC<EvaluationPdfModalProps> = ({
  student,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const calculateFinal = () => {
    const ent = student.enterpriseScore ?? 8.5;
    const lec = student.lecturerScore ?? 8.5;
    const pre = student.presentationScore ?? 8.5;
    const total = parseFloat((ent * 0.4 + lec * 0.4 + pre * 0.2).toFixed(1));
    return { ent, lec, pre, total };
  };

  const scores = calculateFinal();
  const classification =
    student.gradeClassification ||
    (scores.total >= 9
      ? "Xuất sắc"
      : scores.total >= 8
        ? "Giỏi"
        : scores.total >= 6.5
          ? "Khá"
          : scores.total >= 5
            ? "Trung bình"
            : "Không đạt");

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-w-none print:w-full">
        {/* Modal Top Bar (hidden on print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Phiếu Đánh Giá Thực Tập Tốt Nghiệp (Chuẩn PDF)
              </h3>
              <p className="text-[11px] text-slate-300">
                {student.name} • {student.mssv} • {student.class}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Lưu PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          ref={printRef}
          className="p-8 sm:p-12 text-slate-900 font-serif space-y-6 text-sm bg-white print:p-6 print:text-black"
          style={{ minHeight: "800px" }}
        >
          {/* Header 2 cột chuẩn văn bản hành chính Việt Nam */}
          <div className="grid grid-cols-2 gap-4 text-center border-b border-slate-200 pb-4">
            <div>
              <p className="text-[11px] font-medium uppercase text-slate-700">
                BỘ GIÁO DỤC VÀ ĐÀO TẠO
              </p>
              <p className="text-xs font-bold uppercase text-slate-900">
                TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT
              </p>
              <p className="text-[11px] font-bold text-blue-700">
                KHOA CÔNG NGHỆ THÔNG TIN
              </p>
              <div className="w-20 h-0.5 bg-slate-300 mx-auto mt-1" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-900">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="text-xs font-bold text-slate-800">
                Độc lập – Tự do – Hạnh phúc
              </p>
              <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1" />
              <p className="text-[11px] italic text-slate-500 mt-1">
                TP. Hồ Chí Minh, ngày {new Date().getDate()} tháng{" "}
                {new Date().getMonth() + 1} năm {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Tiêu đề chính */}
          <div className="text-center space-y-1">
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-slate-900">
              PHIẾU ĐÁNH GIÁ KẾT QUẢ THỰC TẬP TỐT NGHIỆP
            </h1>
            <p className="text-xs italic text-slate-600 font-sans">
              (Áp dụng cho sinh viên bậc Đại học chính quy – Học kỳ I, Năm học
              2025 - 2026)
            </p>
          </div>

          {/* Phần I: Thông tin sinh viên & Đơn vị thực tập */}
          <div className="space-y-2 text-xs font-sans">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] bg-slate-100 p-1.5 rounded-sm">
              I. THÔNG TIN SINH VIÊN VÀ ĐƠN VỊ THỰC TẬP
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-2">
              <p>
                <span className="font-semibold text-slate-700">Họ và tên sinh viên:</span>{" "}
                <strong className="text-slate-950">{student.name}</strong>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Mã số sinh viên:</span>{" "}
                <strong className="font-mono">{student.mssv}</strong>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Lớp sinh hoạt:</span>{" "}
                <span>{student.class}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Chuyên ngành:</span>{" "}
                <span>{student.major}</span>
              </p>
              <p className="col-span-2">
                <span className="font-semibold text-slate-700">Đơn vị tiếp nhận thực tập:</span>{" "}
                <strong className="text-slate-900">{student.company}</strong>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Cán bộ hướng dẫn tại DN:</span>{" "}
                <span>{student.supervisor}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Giảng viên hướng dẫn trường:</span>{" "}
                <span>Thầy Nguyễn Văn Phước</span>
              </p>
            </div>
          </div>

          {/* Phần II: Ma trận chấm điểm theo Rubric quy định */}
          <div className="space-y-2 text-xs font-sans">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] bg-slate-100 p-1.5 rounded-sm">
              II. KẾT QUẢ ĐÁNH GIÁ CHI TIẾT THEO TIÊU CHÍ (RUBRIC)
            </h2>

            <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
              <thead>
                <tr className="bg-slate-50 font-bold text-slate-900 border-b border-slate-300">
                  <th className="border border-slate-300 p-2 w-10 text-center">STT</th>
                  <th className="border border-slate-300 p-2">Nội dung đánh giá</th>
                  <th className="border border-slate-300 p-2 w-20 text-center">Trọng số</th>
                  <th className="border border-slate-300 p-2 w-24 text-center">Thang điểm</th>
                  <th className="border border-slate-300 p-2 w-24 text-center font-bold text-blue-900">
                    Điểm đạt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                  <td className="border border-slate-300 p-2">
                    <p className="font-bold text-slate-900">Đánh giá từ Đơn vị Thực tập (Doanh nghiệp)</p>
                    <p className="text-[10px] text-slate-500">
                      - Ý thức kỷ luật, chấp hành nội quy doanh nghiệp (10đ)<br/>
                      - Năng lực chuyên môn, giải quyết công việc được giao (10đ)<br/>
                      - Tinh thần làm việc nhóm và giao tiếp chuyên nghiệp (10đ)
                    </p>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold">40%</td>
                  <td className="border border-slate-300 p-2 text-center">10.0</td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-blue-700 bg-blue-50/40">
                    {student.enterpriseScore ?? scores.ent}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 text-center font-bold">2</td>
                  <td className="border border-slate-300 p-2">
                    <p className="font-bold text-slate-900">Đánh giá Báo cáo từ Giảng viên hướng dẫn</p>
                    <p className="text-[10px] text-slate-500">
                      - Nhật ký thực tập & nộp báo cáo tuần đúng hạn ({student.weeklyReportCount || "12/12"} tuần)<br/>
                      - Chất lượng báo cáo thực tập tốt nghiệp & sản phẩm thực tế
                    </p>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold">40%</td>
                  <td className="border border-slate-300 p-2 text-center">10.0</td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-purple-700 bg-purple-50/40">
                    {student.lecturerScore ?? scores.lec}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 text-center font-bold">3</td>
                  <td className="border border-slate-300 p-2">
                    <p className="font-bold text-slate-900">Đánh giá Bảo vệ trước Hội đồng / Phản biện</p>
                    <p className="text-[10px] text-slate-500">
                      - Kỹ năng thuyết trình & bảo vệ kết quả thực tập<br/>
                      - Trả lời câu hỏi phản biện của hội đồng chấm điểm
                    </p>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold">20%</td>
                  <td className="border border-slate-300 p-2 text-center">10.0</td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700 bg-emerald-50/40">
                    {student.presentationScore ?? scores.pre}
                  </td>
                </tr>
                <tr className="bg-slate-100/80 font-bold text-slate-900 text-xs">
                  <td colSpan={4} className="border border-slate-300 p-2.5 text-right uppercase">
                    ĐIỂM TỔNG KẾT HỌC PHẦN (Thang 10):
                  </td>
                  <td className="border border-slate-300 p-2.5 text-center text-sm font-bold text-blue-900 bg-blue-100/60">
                    {student.totalScore ?? scores.total}
                  </td>
                </tr>
                <tr className="bg-white font-bold text-slate-800 text-xs">
                  <td colSpan={4} className="border border-slate-300 p-2 text-right uppercase">
                    XẾP LOẠI KẾT QUẢ:
                  </td>
                  <td className="border border-slate-300 p-2 text-center text-emerald-800 font-bold">
                    {classification}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Phần III: Nhận xét chung của GVHD */}
          <div className="space-y-1.5 text-xs font-sans">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] bg-slate-100 p-1.5 rounded-sm">
              III. NHẬN XÉT VÀ KẾT LUẬN CỦA GIẢNG VIÊN HƯỚNG DẪN
            </h2>
            <div className="border border-slate-300 rounded-sm p-3 min-h-[60px] text-slate-800 italic leading-relaxed">
              {student.lecturerComments ||
                "Sinh viên có tinh thần tự giác, chấp hành tốt các nội quy thực tập của Khoa và Doanh nghiệp. Hoàn thành đầy đủ các nội dung chuyên môn đề ra theo đúng tiến độ và chất lượng yêu cầu."}
            </div>
          </div>

          {/* Chữ ký xác nhận 3 bên */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs font-sans">
            <div>
              <p className="font-bold uppercase text-slate-900">SINH VIÊN THỰC TẬP</p>
              <p className="text-[10px] italic text-slate-500">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
              <p className="font-bold text-slate-900">{student.name}</p>
            </div>

            <div>
              <p className="font-bold uppercase text-slate-900">ĐƠN VỊ THỰC TẬP</p>
              <p className="text-[10px] italic text-slate-500">(Ký tên và đóng dấu)</p>
              <div className="h-16" />
              <p className="font-bold text-slate-900">{student.supervisor}</p>
            </div>

            <div>
              <p className="font-bold uppercase text-slate-900">GIẢNG VIÊN HƯỚNG DẪN</p>
              <p className="text-[10px] italic text-slate-500">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
              <p className="font-bold text-slate-900">ThS. Nguyễn Văn Phước</p>
            </div>
          </div>
        </div>

        {/* Footer (hidden on print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Đã đồng bộ điểm số và nhận xét chính thức
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu Đánh Giá</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
