import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../authentication/AuthContext';
import {
  subscribeUserResources,
  toggleHardCopyAvailability,
  deleteUserResource,
} from '../../services/resourceService';

export default function MyListingsPage() {
  const { userProfile } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (!userProfile?.uid) return;
    return subscribeUserResources(userProfile.uid, setListings);
  }, [userProfile?.uid]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Uploaded Listings</h1>
          <p className="text-sm text-slate-600">Track downloads, views, and toggle physical copy availability.</p>
        </div>
        <Link
          to="/dashboard/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-950 text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New Resource
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-600">You have not published any notes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <Link to={`/dashboard/resources/${item.id}`} className="font-bold text-slate-900 hover:text-indigo-900">
                  {item.title}
                </Link>
                <p className="text-xs text-slate-500 mt-1">
                  {item.subject} • Downloads: {item.totalDownloads || 0} ({item.uniqueDownloadersCount || 0} unique) • Views: {item.viewsCount || 0} • Completed Rentals: {item.completedRentalsCount || 0}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {item.hasHardCopy && (
                  <button
                    onClick={() => toggleHardCopyAvailability(item.id, !item.isAvailableForRent)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      item.isAvailableForRent
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.isAvailableForRent ? 'Available for Rent' : 'Marked Unavailable'}
                  </button>
                )}
                <button
                  onClick={() => deleteUserResource(item.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
