import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="w-11 h-11 rounded-xl bg-indigo-950 text-emerald-400 flex items-center justify-center mb-5">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="text-sm text-slate-600 mt-1">
            Enter your registered email and we will send a Firebase password reset link.
          </p>

          {sent && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Password reset email sent. Check your inbox.</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="font-semibold text-indigo-950 hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
