import { useState, useEffect, useRef } from 'react';
import {
  Lock, User, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle,
  X, Info, KeyRound, Shield, Send, Loader2, GraduationCap, UserCheck, School
} from 'lucide-react';

interface LoginUser {
  username: string;
  role: string;
  name: string;
}

interface LoginPortalProps {
  onLoginSuccess: (user: LoginUser) => void;
}

export function LoginPortal({ onLoginSuccess }: LoginPortalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotId, setForgotId] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotReason, setForgotReason] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {};
    updateTime();
    const timer = setInterval(updateTime, 1000);
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
    const savedUser = localStorage.getItem('internlink_remembered_username');
    if (savedUser) {
      setUsername(savedUser);
    }
    return () => clearInterval(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const determineRole = (inputName: string): string => {
    const clean = inputName.trim().toLowerCase();
    if (clean === 'admin' || clean === 'superadmin' || clean.includes('admin@') || clean === 'admin123') {
      return 'admin';
    }
    if (clean.startsWith('gv') || clean.startsWith('msgv') || clean.includes('phuoc') || clean.includes('giangvien') || clean.includes('lecturer')) {
      return 'lecturer';
    }
    return 'student';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập Tên đăng nhập / MSGV / MSSV.');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu truy cập.');
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const trimmedUser = username.trim();
      if (password === 'wrong') {
        setErrorMessage('Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
        return;
      }
      if (password === 'locked') {
        setErrorMessage('Tài khoản đã bị tạm khóa. Vui lòng liên hệ Văn phòng Khoa.');
        return;
      }
      if (password === 'inactive') {
        setErrorMessage('Tài khoản chưa được kích hoạt trong đợt thực tập này.');
        return;
      }
      if (rememberMe) {
        localStorage.setItem('internlink_remembered_username', trimmedUser);
      } else {
        localStorage.removeItem('internlink_remembered_username');
      }
      const role = determineRole(trimmedUser);
      let displayName = 'Người dùng InternLink';
      if (role === 'admin') {
        displayName = 'Quản trị viên Hệ thống (Super Admin)';
      } else if (role === 'lecturer') {
        displayName = 'ThS. Nguyễn Văn Phước (Giảng viên)';
      } else {
        displayName = 'Trần Thị Thu Thảo (Sinh viên)';
      }
      onLoginSuccess({ username: trimmedUser, role, name: displayName });
    }, 900);
  };

  const handleAutoFill = (demoType: string) => {
    setErrorMessage(null);
    if (demoType === 'student') {
      setUsername('SV2026001');
      setPassword('123456');
    } else if (demoType === 'lecturer') {
      setUsername('GV001');
      setPassword('123456');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotId || !forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setShowForgotModal(false);
      setForgotId('');
      setForgotEmail('');
      setForgotReason('');
    }, 2000);
  };

  return (
    <div
      className="min-h-screen text-slate-800 font-sans flex flex-col justify-between items-center py-6 px-4 relative selection:bg-blue-100 selection:text-blue-900 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="flex flex-col w-full max-w-[440px] mx-auto z-10 my-auto items-center">
        {/* Floating Header Branding */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="flex items-center justify-center p-3 bg-white/95 rounded-2xl shadow-xl backdrop-blur-md border border-white/40 max-w-[280px]">
            <img
              src="/logo/logo_internlink-01.png"
              alt="InternLink Logo"
              className="h-12 object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 mt-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold backdrop-blur-md shadow-xs">
            <span>HK1 • 2026 - 2027</span>
          </div>
        </div>

        {/* SYSTEM NOTICE ANNOUNCEMENT BANNER */}
        {noticeVisible && (
          <div className="w-full mb-5 animate-in fade-in slide-in-from-top-2">
            <div className="bg-orange-50/95 border border-orange-200/90 text-orange-900 p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 shadow-md relative backdrop-blur-sm">
              <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <p className="pr-6 text-[13px] leading-relaxed text-orange-900">
                <strong className="font-semibold">Thông báo từ Ban Điều hành:</strong> Tiếp nhận Báo cáo thực tập định kỳ từ 01/09 đến 15/09.
              </p>
              <button onClick={() => setNoticeVisible(false)} className="absolute top-2.5 right-2.5 text-orange-400 hover:text-orange-600 transition-colors cursor-pointer" title="Đóng thông báo">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CENTERED LOGIN CARD */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-black/20 border border-slate-100 p-8 space-y-6 text-left relative overflow-hidden">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng nhập hệ thống</h1>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1"><span>{errorMessage}</span></div>
              <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-800"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Tên đăng nhập</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  ref={usernameInputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập MSGV hoặc MSSV"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer" title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {capsLockOn && (
                <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Chế độ viết hoa (Caps Lock) đang bật</span>
                </div>
              )}
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-xs text-slate-600 font-medium">Ghi nhớ tài khoản</span>
              </label>
              <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-950 active:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group mt-2">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin text-white" /><span>Đang kiểm tra...</span></>
              ) : (
                <><Lock className="w-4 h-4" /><span>Đăng nhập</span></>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 font-medium">Nhấn Enter để đăng nhập</p>
          </form>

          {/* QUICK PRESETS FOR DEMO TESTING */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">Mẫu tài khoản thử nghiệm nhanh:</span>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handleAutoFill('student')} className="px-2 py-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-slate-700 hover:text-blue-900 rounded-xl text-[11px] font-semibold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5" title="Tài khoản Sinh viên">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" /><span>Sinh viên</span>
              </button>
              <button type="button" onClick={() => handleAutoFill('lecturer')} className="px-2 py-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-slate-700 hover:text-blue-900 rounded-xl text-[11px] font-semibold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5" title="Tài khoản Giảng viên">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" /><span>Giảng viên</span>
              </button>
              <button type="button" onClick={() => handleAutoFill('admin')} className="px-2 py-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-slate-700 hover:text-blue-900 rounded-xl text-[11px] font-semibold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5" title="Tài khoản Quản trị viên">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span>Quản trị</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Indicators below card */}
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-200/50 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span>Hệ thống hoạt động bình thường</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/90 text-[12px] font-medium drop-shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kết nối được mã hóa và bảo vệ</span>
          </div>
        </div>
      </div>

      {/* FLOATING FOOTER */}
      <footer className="mt-8 pb-4 flex flex-col items-center gap-2 text-[12px] text-white/80 w-full max-w-lg mx-auto drop-shadow-sm z-10">
        <div className="flex items-center gap-2 flex-wrap justify-center font-medium">
          <span>InternLink v1.0.0</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>Build 2026.08</span>
          <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:block" />
          <span className="hidden sm:block">© 2026 InternLink. All rights reserved.</span>
        </div>
        <div className="sm:hidden text-center mb-1">© 2026 InternLink. All rights reserved.</div>
        <div className="flex items-center gap-4 flex-wrap justify-center mt-1">
          <a href="#support" onClick={(e) => { e.preventDefault(); alert('Vui lòng gửi mail đến hotro@fit.edu.vn hoặc gọi (028) 3725 2002.'); }} className="hover:text-white transition-colors hover:underline">Hỗ trợ</a>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Quy định bảo mật thông tin đào tạo InternLink.'); }} className="hover:text-white transition-colors hover:underline">Privacy Policy</a>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Điều khoản sử dụng Cổng Thực tập.'); }} className="hover:text-white transition-colors hover:underline">Điều khoản sử dụng</a>
        </div>
      </footer>

      {/* FORGOT PASSWORD MODAL DIALOG */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-5 text-left relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Yêu cầu khôi phục mật khẩu</h3>
                  <p className="text-[11px] text-slate-500">Gửi thông tin xác minh tới Văn phòng Khoa</p>
                </div>
              </div>
              <button onClick={() => setShowForgotModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">Yêu cầu đã được gửi thành công!</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Thông tin khôi phục cho MSGV/MSSV <strong>{forgotId}</strong> đã được ghi nhận. Quản trị viên Khoa sẽ xác minh và phản hồi tới email <strong>{forgotEmail}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mã số (MSGV / MSSV) <span className="text-rose-500">*</span></label>
                  <input type="text" required value={forgotId} onChange={(e) => setForgotId(e.target.value)} placeholder="Ví dụ: GV001 hoặc SV2026001" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email nhận phản hồi <span className="text-rose-500">*</span></label>
                  <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="Nhập email sinh viên/giảng viên" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Lý do / Ghi chú bổ sung (Tùy chọn)</label>
                  <textarea rows={2} value={forgotReason} onChange={(e) => setForgotReason(e.target.value)} placeholder="Mô tả lý do không thể đăng nhập..." className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white resize-none transition-all" />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button type="button" onClick={() => setShowForgotModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors">Hủy bỏ</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs shadow-blue-600/30 transition-all">
                    <Send className="w-3.5 h-3.5" /><span>Gửi yêu cầu</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
