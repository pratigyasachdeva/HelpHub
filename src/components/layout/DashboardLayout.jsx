import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

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
  ChevronRight,
  Sparkles,
  GraduationCap,
  PanelLeftClose,
} from "lucide-react";

import { useAuth } from "../../features/authentication/AuthContext";
import { logoutUser } from "../../services/authService";
import { subscribeUserNotifications } from "../../services/notificationService";

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
    navigate("/");
  };

  const navItems = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/dashboard/browse",
      label: "Browse Resources",
      icon: Search,
    },
    {
      to: "/dashboard/upload",
      label: "Upload Resource",
      icon: UploadCloud,
    },
    {
      to: "/dashboard/help",
      label: "Community Help",
      icon: HandHelping,
    },
    {
      to: "/dashboard/listings",
      label: "My Listings",
      icon: FolderKanban,
    },
    {
      to: "/dashboard/downloads",
      label: "My Downloads",
      icon: Download,
    },
    {
      to: "/dashboard/rentals",
      label: "Rentals & Requests",
      icon: BookCopy,
    },
    {
      to: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount,
    },
    {
      to: "/dashboard/profile",
      label: "Profile & Settings",
      icon: UserCircle,
    },
  ];

  if (userProfile?.role === "admin") {
    navItems.push({
      to: "/dashboard/admin",
      label: "Admin Console",
      icon: ShieldAlert,
    });
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[270px]
          bg-[#101A40]
          text-slate-200
          flex flex-col
          shadow-2xl shadow-indigo-950/20
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="h-[76px] px-6 flex items-center justify-between border-b border-white/[0.08]">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BookOpenCheck size={22} className="text-white" />
            </div>

            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Help<span className="text-blue-300">Hub</span>
              </span>
              <p className="text-[9px] text-slate-400 tracking-[0.18em] font-semibold">
                LEARN • SHARE • GROW
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-5 py-5 border-b border-white/[0.08]">
          <Link
            to="/dashboard/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.06] border border-white/[0.07] hover:bg-white/[0.10] hover:border-white/[0.12] transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">
                {userProfile?.name || "Student"}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-[10px] text-blue-200 capitalize font-medium">
                  {userProfile?.role?.replace("_", " ") || "Member"}
                </p>
              </div>
            </div>

            <ChevronRight size={15} className="text-slate-500" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-4 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase">
            Workspace
          </p>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    group relative flex items-center justify-between
                    px-3.5 py-3 rounded-xl
                    text-[15px] font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/25 to-blue-500/10 text-white border border-indigo-400/20 shadow-sm"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-blue-400" />
                      )}

                      <span className="flex items-center gap-3">
                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.2 : 1.8}
                          className={`
                            transition-colors
                            ${
                              isActive
                                ? "text-blue-300"
                                : "text-slate-500 group-hover:text-blue-300"
                            }
                          `}
                        />

                        {item.label}
                      </span>

                      {item.badge > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-blue-500/20">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}

                      {isActive && !item.badge && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Bottom */}
        <div className="p-4 border-t border-white/[0.08]">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-white/[0.08] p-4 mb-4">
            <div className="flex items-center gap-2 text-blue-200 mb-2">
              <GraduationCap size={17} />
              <span className="text-xs font-bold">Keep Growing!</span>
            </div>

            <p className="text-[10px] leading-relaxed text-slate-400">
              Share your knowledge and help someone learn something new today.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all duration-200"
          >
            <LogOut size={17} />
            Sign Out
          </button>

          <p className="text-center text-[10px] text-slate-600 mt-4 tracking-wider">
            HELP HUB • YOUR LEARNING COMMUNITY
          </p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[76px] bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-7 lg:px-9 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-xl text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 items-center justify-center">
                  <Sparkles size={15} />
                </span>

                <p className="text-sm font-bold text-slate-800">
                  Your Learning Workspace
                </p>
              </div>

              <p className="hidden sm:block text-[12px] text-slate-400 mt-1">
                Share Resources. Exchange Knowledge. Help Each Other.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Button */}
            <Link
              to="/dashboard/notifications"
              className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 transition-all"
              aria-label="Notifications"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                </>
              )}
            </Link>

            {/* User Avatar */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-800 max-w-[130px] truncate">
                  {userProfile?.name || "Student"}
                </p>
                <p className="text-[10px] text-slate-400">HelpHub Member</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-9">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-5 sm:px-8 py-4 border-t border-slate-200/70 bg-white/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
            <span>
              © {new Date().getFullYear()} HelpHub. Learn, share and grow
              together.
            </span>

            <span className="flex items-center gap-1.5">
              Made for a community that learns
              <Sparkles size={11} className="text-indigo-400" />
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
