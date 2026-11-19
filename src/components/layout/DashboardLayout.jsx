import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpenCheck,
  LayoutDashboard,
  Search,
  UploadCloud,
  HandHelping,
  FolderKanban,
  Download,
  BookCopy,
  Bell,
  UserCircle,
  ShieldAlert,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../features/authentication/AuthContext';
import { logoutUser } from '../../services/authService';
import { subscribeUserNotifications } from '../../services/notificationService';

export default function DashboardLayout() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userProfile?.uid) return;
    const unsub = subscribeUserNotifications(userProfile.uid, (list) => {
      setUnreadCount(list.filter((n) => !n.read).length);
    });
    return () => unsub();
  }, [userProfile?.uid]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/browse', label: 'Browse Resources', icon: Search },
    { to: '/dashboard/upload', label: 'Upload Resource', icon: UploadCloud },
    { to: '/dashboard/help', label: 'Community Help', icon: HandHelping },
    { to: '/dashboard/listings', label: 'My Listings', icon: FolderKanban },
    { to: '/dashboard/downloads', label: 'My Downloads', icon: Download },
    { to: '/dashboard/rentals', label: 'Rentals & Requests', icon: BookCopy },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/dashboard/profile', label: 'Profile & Settings', icon: UserCircle },
  ];

  if (userProfile?.role === 'admin') {
    navItems.push({ to: '/dashboard/admin', label: 'Admin Console', icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-950 text-slate-200 flex flex-col transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-indigo-900">
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <BookOpenCheck className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg tracking-tight">HelpHub</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-indigo-900/80">
          <p className="text-sm font-semibold text-white truncate">{userProfile?.name}</p>
          <p className="text-xs text-indigo-300 capitalize mt-0.5">
            {userProfile?.role?.replace('_', ' ')}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-indigo-900/60 hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-xs font-medium text-slate-500">
            Share Resources. Exchange Knowledge. Help Each Other.
          </div>
          <Link
            to="/dashboard/notifications"
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
