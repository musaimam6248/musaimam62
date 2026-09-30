import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { ShieldCheck, UserCheck, Bell, Award, LogOut, Lock, LayoutDashboard, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { currentUser, logout, notifications, markNotificationRead, institution, isSubmissionWindowOpen } = usePortal();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !currentUser || !n.readBy.includes(currentUser.id)
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <img
                src={institution.badgeUrl}
                alt="FNSTM Seal"
                className="w-10 h-10 rounded-full object-cover border border-amber-500/30 shadow-xs group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-amber-800 transition-colors">
                  FNSTM Excellence
                </span>
                <span className="block text-[11px] font-medium text-slate-500 -mt-1 tracking-tight">
                  Hospital & Institute Portal
                </span>
              </div>
            </button>

            {/* Quiet status dot */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <span className={`w-2 h-2 rounded-full ${isSubmissionWindowOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
              <span className="font-mono text-[11px]">
                {isSubmissionWindowOpen ? 'Nominations Active' : 'Window Closed'}
              </span>
            </div>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('home')}
              className={`hover:text-slate-900 transition-colors pb-0.5 ${
                currentTab === 'home' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectTab('winners')}
              className={`hover:text-slate-900 transition-colors pb-0.5 ${
                currentTab === 'winners' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Hall of Winners
            </button>
            <button
              onClick={() => onSelectTab('committee')}
              className={`hover:text-slate-900 transition-colors pb-0.5 ${
                currentTab === 'committee' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Committee
            </button>
            <button
              onClick={() => onSelectTab('gallery')}
              className={`hover:text-slate-900 transition-colors pb-0.5 ${
                currentTab === 'gallery' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Gallery & Media
            </button>
            <button
              onClick={() => onSelectTab('lectures')}
              className={`hover:text-slate-900 transition-colors pb-0.5 ${
                currentTab === 'lectures' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Lecture Notes
            </button>
          </nav>

          {/* Zone 3: Primary actions & Auth State */}
          <div className="flex items-center gap-3">
            {/* Notification trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Institutional Bulletins ({notifications.length})
                    </span>
                    <button
                      onClick={() => setShowNotifs(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Close
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className="py-2.5 px-1 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">
                            {notif.title}
                          </p>
                          <span className="font-mono text-[10px] text-slate-600 whitespace-nowrap">
                            {new Date(notif.sentAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-amber-700 font-medium mt-1 block">
                          From: {notif.sender}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role / User Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="max-w-[130px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{currentUser.role} Account</p>
                      {currentUser.departmentName && (
                        <p className="text-[10px] text-amber-700 font-medium mt-0.5 truncate">
                          {currentUser.departmentName}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSelectTab(currentUser.role === 'admin' ? 'admin' : 'department');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      Open Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                        onSelectTab('home');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Portal Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
