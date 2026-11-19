import React, { useState } from 'react';
import { CheckCircle2, User, MapPin, Mail, Shield } from 'lucide-react';
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

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile & Account Settings</h1>
        <p className="text-sm text-slate-600">Manage your public identity and review your contribution metrics.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Uploaded Resources</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{userProfile?.uploadedCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">PDF Downloads</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{userProfile?.downloadsCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Completed Rentals</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{userProfile?.completedRentalsCount || 0}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt={userProfile.name} className="w-16 h-16 rounded-2xl object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-emerald-400 flex items-center justify-center text-xl font-bold">
              {(userProfile?.name || 'U')[0]}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Update Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="text-xs text-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" /> {userProfile?.email}
          </div>
          <div className="flex items-center gap-2 capitalize">
            <Shield className="w-4 h-4 text-emerald-600" /> Role: {userProfile?.role?.replace('_', ' ')}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location / Campus</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900"
        >
          {saving ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
