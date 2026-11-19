import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../features/authentication/AuthContext';

export default function PublicNavbar() {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-950 text-white flex items-center justify-center shadow-sm">
            <BookOpenCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900">HelpHub</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Community Commons
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-indigo-950 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-indigo-950 transition-colors">About & How It Works</Link>
          <Link to="/dashboard/browse" className="hover:text-indigo-950 transition-colors">Explore Notes</Link>
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900 transition-colors"
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900 transition-colors shadow-sm"
              >
                Join Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
