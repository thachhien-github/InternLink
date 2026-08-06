import { ReactNode } from 'react';
import { Sidebar as AdminSidebar } from '../features/admin/components/Sidebar';
import { Header as AdminHeader } from '../features/admin/components/Header';
import { Toast } from '../components/common/Toast';
import { useToast } from '../hooks/useToast';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onSwitchPortal: (role: string) => void;
  onLogout: () => void;
}

export default function AdminLayout({
  children,
  activeTab,
  onNavigate,
  onSwitchPortal,
  onLogout
}: AdminLayoutProps) {
  const { message, clearToast, showToast } = useToast();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex antialiased">
      <AdminSidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        onSwitchPortal={onSwitchPortal}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          activeTab={activeTab}
          onNavigate={onNavigate}
          onSwitchPortal={onSwitchPortal}
          onLogout={onLogout}
          onShowToast={showToast}
        />
        <Toast message={message} onClose={clearToast} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
