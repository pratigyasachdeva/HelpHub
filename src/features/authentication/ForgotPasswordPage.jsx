
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { resetUserPassword } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetUserPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-indigo-950/5 p-7 sm:p-9">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-indigo-950/15">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 mb-2">
                Account recovery
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Reset your password
              </h1>
              <p className="text-sm leading-6 text-slate-500 mt-2">
                Forgot your password? No worries. Enter your registered email
                and we'll send you a secure password reset link.
              </p>
            </div>

            {sent && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold">Reset email sent!</p>
                  <p className="text-xs mt-1 leading-5">
                    Check your inbox for the password reset link.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm leading-5">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Registered email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-950 text-white text-sm font-bold shadow-lg shadow-indigo-950/15 hover:bg-indigo-900 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all"
              >
                {loading ? 'Sending reset link...' : 'Send Reset Link'}
                {!loading && <ArrowLeft className="w-4 h-4 rotate-180" />}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-slate-100">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-indigo-950 hover:text-indigo-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Secure account recovery powered by Firebase
          </div>
        </div>
      </main>
    </div>
  );
}
