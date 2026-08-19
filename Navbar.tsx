import React, { useState } from 'react';
import { Sparkles, Bell, User as UserIcon, LogOut, ShieldCheck, Mail, CheckCircle2, Palette, Key, Type } from 'lucide-react';
import { User, NotificationItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  user: User | null;
  notifications: NotificationItem[];
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  onLogout,
  onNavigate,
  currentPage,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((n) => !n.readStatus).length;
  const { setIsModalOpen, colorTheme, setActiveModalTab, fontColor } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Brand Title */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onNavigate(user ? (user.role === 'TEACHER' ? 'teacher-dashboard' : user.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard') : 'landing')}
      >
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs font-bold font-mono">
          TS
        </div>
        <div>
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            TALENT SPHERE ELEVATE
          </h1>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono uppercase tracking-wider font-semibold">
            Discover. Develop. Elevate.
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Font, Letter & Word Color Customizer Button */}
        <button
          onClick={() => {
            setActiveModalTab('font');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="Customize Font Colors, Word Highlighting & Typography"
        >
          <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="hidden sm:inline">Font & Words Color</span>
        </button>

        {/* Multi-Color Theme Switcher Button */}
        <button
          onClick={() => {
            setActiveModalTab('theme');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="Change Page & Button Theme Colors"
        >
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden md:inline capitalize">{colorTheme} Theme</span>
        </button>


        {user ? (
          <>
            {/* Day Unlock Status Pill */}
            {user.role === 'STUDENT' && (
              <div
                onClick={() => onNavigate('courses')}
                className="hidden md:flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 px-3 py-1.5 rounded-lg border border-indigo-200 text-xs font-mono font-bold cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Day {user.currentUnlockedDay} Unlocked</span>
              </div>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all border border-slate-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 text-xs font-bold text-slate-900">
                    <span>Notifications ({notifications.length})</span>
                    <button
                      onClick={() => onNavigate('notifications')}
                      className="text-indigo-600 hover:underline text-[11px]"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 4).map((n) => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between text-slate-900 font-bold mb-1">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pl-3 rounded-xl border border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{user.name}</span>
                <span className="text-[10px] text-amber-600 font-mono uppercase font-bold">{user.role}</span>
              </div>

              <button
                onClick={() => onNavigate('portfolio')}
                className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs hover:bg-indigo-700 transition-all shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="text-xs text-slate-700 font-semibold hover:text-indigo-600 transition-all px-3 py-1.5"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-all"
            >
              Start Your Ascent
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
