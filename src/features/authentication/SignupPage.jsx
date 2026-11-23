
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  AlertCircle,
  User,
  Mail,
  LockKeyhole,
  MapPin,
  BookOpen,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { registerUser } from '../../services/authService';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    location: '',
    bio: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      await registerUser(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-10 sm:py-14">
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
                <UserPlus className="w-7 h-7 text-emerald-300" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
                Join the community
              </p>

              <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                Learn together.
                <br />
                Share knowledge.
                <br />
                <span className="text-emerald-300">Grow together.</span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-indigo-100/80 max-w-sm">
                Create your HelpHub account and become part of a community
                where students share resources, exchange knowledge and
                support one another.
              </p>
            </div>

            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Discover resources</p>
                  <p className="text-xs text-indigo-200">Find notes and academic material</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Connect with others</p>
                  <p className="text-xs text-indigo-200">Help and learn from your community</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-5 border-t border-white/15 text-xs text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Your academic community starts here
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-9 lg:p-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-emerald-400 flex items-center justify-center mb-5 shadow-lg shadow-indigo-950/15">
              <UserPlus className="w-5 h-5" />
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 mb-2">
                Get started
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Create your account
              </h1>
              <p className="text-sm text-slate-500 mt-2 leading-6">
                Join HelpHub as a Student or Community Member.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm leading-5">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Aarav Sharma"
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Account Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => updateField('role', e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="student">Student</option>
                    <option value="community_member">Community Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Campus / Locality
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="North Campus, Delhi"
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Subjects you study or topics you can help others with..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm leading-6 outline-none resize-y transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-950 text-white text-sm font-bold shadow-lg shadow-indigo-950/15 hover:bg-indigo-900 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all"
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-indigo-950 hover:text-indigo-700 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
