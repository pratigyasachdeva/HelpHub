
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../features/authentication/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#F7F8FC]">

        {/* Background Decorations */}
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-indigo-100/60 blur-[100px]" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-blue-100/60 blur-[100px]" />

        <div className="relative text-center px-6">

          {/* Logo */}
          <div className="relative w-20 h-20 mx-auto mb-7">
            <div className="absolute inset-0 rounded-[26px] bg-indigo-200/50 animate-ping opacity-30" />

            <div className="relative w-20 h-20 rounded-[26px] bg-gradient-to-br from-[#111C46] to-[#30458C] shadow-xl shadow-indigo-950/20 flex items-center justify-center">
              <BookOpen size={34} className="text-white" strokeWidth={1.7} />
            </div>

            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-400 border-4 border-[#F7F8FC] flex items-center justify-center">
              <Sparkles size={12} className="text-slate-900" />
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Help<span className="text-indigo-600">Hub</span>
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Preparing your learning space...
          </p>

          {/* Loading Indicator */}
          <div className="mt-8 w-48 h-1.5 rounded-full bg-slate-200 overflow-hidden mx-auto">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>

          <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 mt-5 uppercase">
            A little patience, a lot of knowledge
          </p>

        </div>

        <style>
          {`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(100%); }
              100% { transform: translateX(200%); }
            }
          `}
        </style>

      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
