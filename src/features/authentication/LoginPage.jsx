
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  AlertCircle,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Users,
  FileText,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { loginUser } from '../../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-blue-200/40 blur-3xl" />
        </div>

        <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-indigo-950/5 overflow-hidden">
          <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#111C46] via-[#202F69] to-[#344B91] p-10 text-white">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-white/10" />
            <div className="absolute top-16 -right-12 w-56 h-56 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-8">
                <BookOpen className="w-7 h-7 text-emerald-300" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
                Welcome to HelpHub
              </p>

              <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                Your campus.
                <br />
                Your community.
                <br />
                <span className="text-emerald-300">One platform.</span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-indigo-100/80 max-w-sm">
                Access study resources, discover useful notes, rent academic
                materials and connect with people who can help you grow.
              </p>
            </div>

            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Learning resources</p>
                  <p className="text-xs text-indigo-200">Notes, PDFs and study material</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Student community</p>
                  <p className="text-xs text-indigo-200">Learn and grow together</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-5 border-t border-white/15 text-xs text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                A secure space for your academic journey
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-indigo-950/15">
              <LogIn className="w-5 h-5" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 mb-2">
              Member access
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-6">
              Sign in to continue your HelpHub journey.
            </p>

            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm leading-5">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-950 text-white text-sm font-bold shadow-lg shadow-indigo-950/15 hover:bg-indigo-900 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                New to HelpHub?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-indigo-950 hover:text-indigo-700 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
