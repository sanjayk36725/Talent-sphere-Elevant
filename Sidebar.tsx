import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Award,
  Compass,
  Bot,
  FileText,
  Briefcase,
  Bell,
  Shield,
  Users,
  Settings,
  Sparkles,
  Mail,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, onNavigate }) => {
  if (!user) return null;

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ascent-roadmap', label: 'Ascent Path Roadmap', icon: Compass },
    { id: 'courses', label: 'Course Catalog & Syllabus', icon: BookOpen },
    { id: 'assessments', label: 'Exam Portal & Results', icon: CheckSquare },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: Sparkles },
    { id: 'skills', label: 'Skills & Competency', icon: Award },
    { id: 'career', label: 'Career Guidance', icon: Compass },
    { id: 'chatbot', label: 'TalentSphere AI', icon: Bot },
    { id: 'portfolio', label: 'Digital Portfolio', icon: Briefcase },
    { id: 'documents', label: 'Knowledge Documents', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & 2FA', icon: Shield },
  ];

  const teacherNav = [
    { id: 'teacher-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ascent-roadmap', label: 'Ascent Path Curriculum', icon: Compass },
    { id: 'exam-creator', label: 'Exam Creation', icon: CheckSquare },
    { id: 'send-exam-email', label: 'Send Exam Emails', icon: Mail },
    { id: 'teacher-results', label: 'Results Hub', icon: Award },
    { id: 'documents', label: 'Document RAG Base', icon: FileText },
    { id: 'chatbot', label: 'TalentSphere AI', icon: Bot },
    { id: 'notifications', label: 'Announcements', icon: Bell },
    { id: 'security', label: 'Security & 2FA', icon: Shield },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'courses', label: 'Course Catalog', icon: BookOpen },
    { id: 'documents', label: 'Vector Store & RAG', icon: FileText },
    { id: 'admin-logs', label: 'SMTP & Audit Logs', icon: Settings },
    { id: 'security', label: 'Security & 2FA', icon: Shield },
  ];

  const navItems =
    user.role === 'ADMIN'
      ? adminNav
      : user.role === 'TEACHER'
      ? teacherNav
      : studentNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-3.5 sticky top-16 h-[calc(100vh-4rem)] z-30 shrink-0 shadow-xs">
      <div className="space-y-5">
        {/* Role Badge Banner */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {user.role[0]}
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-slate-900 block truncate">{user.name}</span>
            <span className="text-[10px] text-amber-600 font-mono uppercase font-semibold">{user.role} PANEL</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all touch-sensor-btn sensor-glow ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
