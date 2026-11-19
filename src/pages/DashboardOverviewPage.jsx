import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Search, HandHelping, BookCopy } from 'lucide-react';
import { useAuth } from '../features/authentication/AuthContext';
import { subscribeApprovedResources } from '../services/resourceService';
import { subscribeRentalsByRole } from '../services/rentalService';
import ResourceCard from '../features/resources/ResourceCard';

export default function DashboardOverviewPage() {
  const { userProfile } = useAuth();
  const [resources, setResources] = useState([]);
  const [incomingRentals, setIncomingRentals] = useState([]);

  useEffect(() => {
    if (!userProfile?.uid) return;
    const u1 = subscribeApprovedResources(setResources);
    const u2 = subscribeRentalsByRole(userProfile.uid, 'ownerId', setIncomingRentals);
    return () => {
      u1();
      u2();
    };
  }, [userProfile?.uid]);

  const pendingApprovals = incomingRentals.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-8">
      <div className="bg-indigo-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userProfile?.name}</h1>
          <p className="text-sm text-indigo-200 mt-1">
            You have {pendingApprovals} pending physical rental request{pendingApprovals === 1 ? '' : 's'} awaiting action.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/dashboard/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold hover:bg-emerald-400"
          >
            <UploadCloud className="w-4 h-4" /> Share Notes
          </Link>
          <Link
            to="/dashboard/browse"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-900 text-white text-sm font-semibold hover:bg-indigo-800"
          >
            <Search className="w-4 h-4" /> Browse Library
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">My Shared Resources</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{userProfile?.uploadedCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">My PDF Downloads</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{userProfile?.downloadsCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Completed Rentals</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{userProfile?.completedRentalsCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Pending Owner Actions</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingApprovals}</p>
        </div>
      </div>

      {/* Latest Community Notes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Latest Resources in Community</h2>
          <Link to="/dashboard/help" className="text-xs font-semibold text-indigo-950 inline-flex items-center gap-1">
            <HandHelping className="w-4 h-4" /> Open Help Board
          </Link>
        </div>
        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            No resources uploaded yet. Click "Share Notes" to publish the first resource!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {resources.slice(0, 6).map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
