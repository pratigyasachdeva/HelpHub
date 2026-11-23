
import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenCheck,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
  Heart
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#0D1738] text-slate-300 overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/[0.07] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* Brand Section */}
          <div className="lg:col-span-2">

            <Link to="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BookOpenCheck size={26} className="text-white" />
              </div>

              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Help<span className="text-blue-300">Hub</span>
                </span>
                <p className="text-[9px] tracking-[0.2em] font-semibold text-slate-400 mt-0.5">
                  LEARN • SHARE • GROW
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-md leading-7">
              Share Resources. Exchange Knowledge. Help Each Other.
              A centralized student and neighborhood platform for
              verified PDF study notes, affordable ₹3–₹10/day physical
              copy rentals, and peer-to-peer assistance.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <GraduationCap size={17} className="text-blue-300" />
              <span className="text-xs font-medium text-blue-100">
                Built for students, powered by sharing.
              </span>
            </div>

          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-blue-400" />
              Platform
            </h4>

            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  to="/dashboard/browse"
                  className="inline-flex items-center gap-1 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Browse Resources
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100" />
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/upload"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Share Notes
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/help"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Community Help Board
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  About HelpHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-400" />
              Account
            </h4>

            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  to="/login"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Sign In
                </Link>
              </li>

              <li>
                <Link
                  to="/signup"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Create Student Account
                </Link>
              </li>

              <li>
                <Link
                  to="/forgot-password"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.09] mt-16 pt-7">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} HelpHub Community Commons.
              All rights reserved.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              Made for a community that learns
              <Heart size={13} className="text-rose-400 fill-rose-400" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={13} className="text-blue-400" />
              Powered by React & Firebase
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
