import { ReactNode } from 'react';
import { Sidebar as StudentSidebar } from '../features/student/components/Sidebar';
import { Header as StudentHeader } from '../features/student/components/Header';
import { Toast } from '../components/common/Toast';
import { FloatingAiAssistant } from '../components/common/FloatingAiAssistant';
import { useToast } from '../hooks/useToast';

interface StudentLayoutProps {
  children: ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onSwitchPortal: (role: string) => void;
  onLogout: () => void;
}

export default function StudentLayout({
  children,
  activeTab,
  onNavigate,
  onSwitchPortal,
  onLogout
}: StudentLayoutProps) {
  const { message, clearToast, showToast } = useToast();

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800 font-sans flex antialiased">
      <StudentSidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        onSwitchPortal={onSwitchPortal}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StudentHeader
          activeTab={activeTab}
          onNavigate={onNavigate}
          onSwitchPortal={onSwitchPortal}
          onLogout={onLogout}
        />
        <Toast message={message} onClose={clearToast} />
        <main className="p-4 md:p-6 space-y-4 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
      <FloatingAiAssistant
        activeTab={activeTab}
        onNavigateTab={onNavigate}
        onOpenAction={(act) => showToast(`Kích hoạt AI Assistant: ${act}`)}
      />
    </div>
  );
}
