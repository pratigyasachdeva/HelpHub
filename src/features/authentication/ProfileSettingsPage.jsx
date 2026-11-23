
import React, { useState } from 'react';
import {
  CheckCircle2,
  User,
  MapPin,
  Mail,
  Shield,
  Camera,
  BookOpen,
  Download,
  Repeat,
  Save,
  Sparkles,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { updateUserProfileData } from '../../services/authService';

export default function ProfileSettingsPage() {
  const { userProfile } = useAuth();

  const [name, setName] = useState(userProfile?.name || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await updateUserProfileData(
        userProfile.uid,
        { name, location, bio, photoURL: userProfile.photoURL },
        avatarFile
      );
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    {
      label: 'Uploaded Resources',
      value: userProfile?.uploadedCount || 0,
      icon: BookOpen,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
    },
    {
      label: 'PDF Downloads',
      value: userProfile?.downloadsCount || 0,
      icon: Download,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    {
      label: 'Completed Rentals',
      value: userProfile?.completedRentalsCount || 0,
      icon: Repeat,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="max-w-5xl space-y-7 pb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111C46] via-[#202F69] to-[#344B91] p-7 sm:p-9 text-white shadow-lg shadow-indigo-950/10">
        <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -right-4 -bottom-32 w-64 h-64 rounded-full bg-blue-300/10 blur-2xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-[0.18em] mb-3">
              <Sparkles className="w-4 h-4" />
              Account centre
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-sm text-indigo-100/80 mt-2 max-w-xl leading-6">
              Manage your personal information and keep track of your
              contributions to the HelpHub community.
            </p>
          </div>

          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 border border-white/15 items-center justify-center">
            <User className="w-8 h-8 text-emerald-300" />
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your contributions</h2>
            <p className="text-sm text-slate-500 mt-1">Your activity on HelpHub so far.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">All time</span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-4">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
      >
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Personal information</h2>
          <p className="text-sm text-slate-500 mt-1">
            Update the information visible on your HelpHub profile.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.name || 'Profile'}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-950 text-emerald-300 flex items-center justify-center text-2xl font-extrabold">
                  {(userProfile?.name || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-700">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">Profile photo</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Choose an image to personalize your account.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-800 file:font-semibold hover:file:bg-indigo-100"
              />
              {avatarFile && (
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  Selected: {avatarFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Mail className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Email address</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 break-all">
                {userProfile?.email || 'Not available'}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Account role</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 capitalize">
                {userProfile?.role?.replace('_', ' ') || 'Member'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                <User className="w-4 h-4 text-indigo-600" />
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Location / Campus
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your campus or locality"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              About you
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about yourself, your subjects or the topics you can help with..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm leading-6 outline-none resize-y transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {saved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Profile updated successfully</p>
                <p className="text-xs mt-0.5">Your changes have been saved.</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Make sure your profile information is up to date.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-950 text-white text-sm font-bold shadow-lg shadow-indigo-950/10 hover:bg-indigo-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
