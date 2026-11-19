import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 text-white mb-3">
            <BookOpenCheck className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-xl">HelpHub</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Share Resources. Exchange Knowledge. Help Each Other. A centralized student and neighborhood platform for verified PDF study notes, affordable ₹3–₹10/day physical copy rentals, and peer-to-peer assistance.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/dashboard/browse" className="hover:text-white">Browse Resources</Link></li>
            <li><Link to="/dashboard/upload" className="hover:text-white">Share Notes</Link></li>
            <li><Link to="/dashboard/help" className="hover:text-white">Community Help Board</Link></li>
            <li><Link to="/about" className="hover:text-white">About HelpHub</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
            <li><Link to="/signup" className="hover:text-white">Create Student Account</Link></li>
            <li><Link to="/forgot-password" className="hover:text-white">Reset Password</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} HelpHub Community Commons. Powered by React & Firebase.
      </div>
    </footer>
  );
}
