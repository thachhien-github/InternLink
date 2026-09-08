import { Check } from "lucide-react";

type PasswordStrengthMeterProps = {
  password: string;
  confirmPassword?: string;
};

const criteria = [
  { label: "Ít nhất 8 ký tự", test: (value: string) => value.length >= 8 },
  { label: "Có chữ hoa và chữ thường", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: "Có chữ số", test: (value: string) => /\d/.test(value) },
  { label: "Có ký tự đặc biệt", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export function PasswordStrengthMeter({ password, confirmPassword }: PasswordStrengthMeterProps) {
  const passed = criteria.filter((criterion) => criterion.test(password)).length;
  const isComplete = password.length > 0 && passed === criteria.length;
  const matches = confirmPassword === undefined || !confirmPassword || password === confirmPassword;
  const tone = passed <= 1 ? "bg-rose-500" : passed === 2 ? "bg-amber-500" : passed === 3 ? "bg-blue-500" : "bg-emerald-500";
  const label = passed <= 1 ? "Yếu" : passed === 2 ? "Trung bình" : passed === 3 ? "Khá mạnh" : "Mạnh";
  const labelTone = passed <= 1 ? "text-rose-600" : passed === 2 ? "text-amber-600" : passed === 3 ? "text-blue-600" : "text-emerald-600";

  return (
    <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-600">Mức độ bảo mật</span>
        <span className={password ? labelTone : "text-slate-400"}>{password ? label : "Chưa nhập"}</span>
      </div>
      <div className="flex gap-1" aria-label={`Mật khẩu ${password ? label.toLowerCase() : "chưa nhập"}`}>
        {criteria.map((criterion, index) => (
          <span key={criterion.label} className={`h-1.5 flex-1 rounded-full ${password && index < passed ? tone : "bg-slate-200"}`} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-1 text-[10px] text-slate-500 sm:grid-cols-2">
        {criteria.map((criterion) => {
          const valid = criterion.test(password);
          return (
            <span key={criterion.label} className={`flex items-center gap-1 ${valid ? "text-emerald-700" : ""}`}>
              <Check className={`h-3 w-3 ${valid ? "opacity-100" : "opacity-25"}`} /> {criterion.label}
            </span>
          );
        })}
      </div>
      {confirmPassword && !matches && <p className="text-[10px] font-semibold text-rose-600">Mật khẩu xác nhận chưa khớp.</p>}
      {isComplete && matches && <p className="text-[10px] font-semibold text-emerald-700">Mật khẩu đạt yêu cầu bảo mật.</p>}
    </div>
  );
}
