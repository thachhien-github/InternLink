import { ReactNode } from 'react';
import { Sidebar as LecturerSidebar } from '../features/lecturer/components/Sidebar';
import { Header as LecturerHeader } from '../features/lecturer/components/Header';
import { Toast } from '../components/common/Toast';
import { FloatingAiAssistant } from '../components/common/FloatingAiAssistant';
import { useToast } from '../hooks/useToast';

interface LecturerLayoutProps {
  children: ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onSwitchPortal: (role: string) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentLecturer: string;
  assignedStudentsCount: number;
}

export default function LecturerLayout({
  children,
  activeTab,
  onNavigate,
  onSwitchPortal,
  onLogout,
  searchQuery,
  onSearchChange,
  currentLecturer,
  assignedStudentsCount
}: LecturerLayoutProps) {
  const { message, clearToast, showToast } = useToast();

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800 font-sans flex antialiased">
      <LecturerSidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        currentLecturer={currentLecturer}
        onSwitchPortal={onSwitchPortal}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <LecturerHeader
          activeTab={activeTab}
          onNavigate={onNavigate}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          currentLecturer={currentLecturer}
          assignedStudentsCount={assignedStudentsCount}
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
        onOpenAction={(act) => showToast(`Kích hoạt tính năng AI: ${act}`)}
      />
    </div>
  );
}
