
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BookOpenCheck,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

import { useAuth } from '../../features/authentication/AuthContext';

export default function PublicNavbar() {
  const { currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About Us' },
    { to: '/dashboard/browse', label: 'Explore Notes' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-[76px] flex items-center justify-between">

          {/* Brand */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#111C46] to-[#30458C] flex items-center justify-center shadow-md shadow-indigo-950/15 group-hover:scale-105 transition-transform duration-200">
              <BookOpenCheck
                size={23}
                className="text-blue-200"
                strokeWidth={2}
              />
            </div>

            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Help<span className="text-indigo-600">Hub</span>
              </span>

              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles size={10} className="text-indigo-500" />
                <span className="text-[9px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                  Community Commons
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  relative px-4 py-2.5 rounded-xl
                  text-[16px] font-semibold
                  transition-all duration-200
                  ${
                    isActive
                      ? 'text-indigo-700 bg-indigo-50'
                      : 'text-slate-500 hover:text-indigo-700 hover:bg-slate-50'
                  }
                `}
              >
                {item.label}
              </NavLink>
            ))}

          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">

            {currentUser ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111C46] text-white text-sm font-bold hover:bg-indigo-800 shadow-md shadow-indigo-950/10 transition-all duration-200"
              >
                Open Dashboard
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-700 hover:bg-slate-50 transition-all"
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111C46] text-white text-sm font-bold hover:bg-indigo-800 shadow-md shadow-indigo-950/10 transition-all duration-200"
                >
                  Join Free
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-xl shadow-slate-900/[0.04]">

            <div className="max-w-7xl mx-auto px-5 py-5">

              <nav className="space-y-1">

                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                      flex items-center justify-between
                      px-4 py-3.5 rounded-xl
                      text-sm font-semibold transition-all
                      ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-700'
                      }
                    `}
                  >
                    {item.label}
                    <ChevronRight size={17} className="opacity-50" />
                  </NavLink>
                ))}

              </nav>

              <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col gap-3">

                {currentUser ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#111C46] text-white text-sm font-bold"
                  >
                    Open Dashboard
                    <ArrowRight size={17} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold"
                    >
                      Log in
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#111C46] text-white text-sm font-bold"
                    >
                      Join Free
                      <ArrowRight size={16} />
                    </Link>
                  </>
                )}

              </div>

              <p className="text-center text-[10px] text-slate-400 mt-5 tracking-wide">
                LEARN • SHARE • GROW
              </p>

            </div>
          </div>
        )}

      </header>
    </>
  );
}
