
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Plus,
  Trash2,
  BookOpen,
  Download,
  Eye,
  BookCopy,
  ArrowUpRight,
  Sparkles,
  FileText,
  Library,
  CheckCircle2,
  Inbox,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

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

  // Overview statistics
  const totalDownloads = listings.reduce(
    (sum, item) => sum + (item.totalDownloads || 0),
    0
  );

  const totalViews = listings.reduce(
    (sum, item) => sum + (item.viewsCount || 0),
    0
  );

  const totalRentals = listings.reduce(
    (sum, item) => sum + (item.completedRentalsCount || 0),
    0
  );

  const availableListings = listings.filter(
    (item) => item.hasHardCopy && item.isAvailableForRent
  ).length;

  const stats = [
    {
      label: 'Total Downloads',
      value: totalDownloads,
      icon: Download,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Resource downloads'
    },
    {
      label: 'Total Views',
      value: totalViews,
      icon: Eye,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      description: 'Resource visibility'
    },
    {
      label: 'Completed Rentals',
      value: totalRentals,
      icon: BookCopy,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Successful rentals'
    },
    {
      label: 'Available Copies',
      value: availableListings,
      icon: Library,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      description: 'Open for rental'
    }
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#192B61] to-[#30458C] p-7 sm:p-9 shadow-lg shadow-indigo-950/10">

        <div className="absolute -top-24 -right-10 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-7">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-widest mb-5">
              <Sparkles size={13} />
              YOUR CONTRIBUTIONS
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Resources.
              <br />
              <span className="text-blue-300">
                My Impact.
              </span>
            </h1>

            <p className="text-sm text-blue-100/75 mt-4 max-w-lg leading-relaxed">
              Manage your uploaded study materials, track their
              performance and control physical copy availability.
              Every resource you share helps someone learn.
            </p>
          </div>

          <Link
            to="/dashboard/upload"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-indigo-950 text-sm font-bold shadow-lg hover:bg-blue-50 hover:-translate-y-0.5 transition-all shrink-0"
          >
            <Plus size={18} />
            Upload New Resource
            <ArrowUpRight size={16} />
          </Link>

        </div>
      </section>

      {/* ================= STATISTICS ================= */}
      <section>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Your Performance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            An overview of your shared resources and their activity.
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/[0.04] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon size={21} />
                  </div>

                  <TrendingUp
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>

                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-5 tracking-tight">
                  {stat.value}
                </p>

                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {stat.label}
                </p>

                <p className="text-[10px] text-slate-400 mt-2">
                  {stat.description}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* ================= LISTINGS ================= */}
      <section>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Library size={17} />
              </div>

              <span className="text-[10px] font-bold tracking-[0.18em] text-indigo-600 uppercase">
                RESOURCE MANAGEMENT
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Your Uploaded Resources
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {listings.length} published resource{listings.length === 1 ? '' : 's'}
            </p>
          </div>

          <Link
            to="/dashboard/upload"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-950 transition-colors"
          >
            <Plus size={17} />
            Add Another Resource
          </Link>

        </div>

        {listings.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-[26px] border border-slate-200 p-10 sm:p-16 text-center shadow-sm">

            <div className="w-20 h-20 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Inbox size={36} strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-7">
              Your contribution journey starts here!
            </h3>

            <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              You haven't published any notes yet. Share your
              study materials with the community and help other
              students access valuable learning resources.
            </p>

            <Link
              to="/dashboard/upload"
              className="inline-flex items-center gap-2 mt-7 px-6 py-3.5 rounded-xl bg-indigo-950 text-white text-sm font-bold hover:bg-indigo-800 transition-all shadow-md"
            >
              <Plus size={17} />
              Upload Your First Resource
              <ArrowUpRight size={16} />
            </Link>

          </div>

        ) : (

          /* Resource Cards */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {listings.map((item) => (

              <div
                key={item.id}
                className="group bg-white rounded-[24px] border border-slate-200/80 p-5 sm:p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/[0.04] transition-all duration-300"
              >

                {/* Card Header */}
                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <FileText size={23} />
                  </div>

                  <div className="flex-1 min-w-0">

                    <Link
                      to={`/dashboard/resources/${item.id}`}
                      className="text-base font-bold text-slate-900 hover:text-indigo-700 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>

                    <p className="text-xs text-slate-500 mt-1.5">
                      {item.subject || 'Study Resource'}
                    </p>

                  </div>

                  <Link
                    to={`/dashboard/resources/${item.id}`}
                    title="View resource"
                    className="w-9 h-9 shrink-0 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <ArrowUpRight size={17} />
                  </Link>

                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 py-5 border-y border-slate-100">

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Download size={13} />
                      <span className="text-[10px] font-medium">
                        Downloads
                      </span>
                    </div>

                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {item.totalDownloads || 0}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <FileText size={13} />
                      <span className="text-[10px] font-medium">
                        Unique Users
                      </span>
                    </div>

                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {item.uniqueDownloadersCount || 0}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Eye size={13} />
                      <span className="text-[10px] font-medium">
                        Views
                      </span>
                    </div>

                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {item.viewsCount || 0}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <BookCopy size={13} />
                      <span className="text-[10px] font-medium">
                        Rentals
                      </span>
                    </div>

                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {item.completedRentalsCount || 0}
                    </p>
                  </div>

                </div>

                {/* Availability & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">

                  <div className="flex items-center gap-2">

                    {item.hasHardCopy ? (
                      <>
                        <span className={`w-2 h-2 rounded-full ${
                          item.isAvailableForRent
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`} />

                        <span className={`text-[11px] font-bold ${
                          item.isAvailableForRent
                            ? 'text-emerald-700'
                            : 'text-slate-500'
                        }`}>
                          {item.isAvailableForRent
                            ? 'Available for Rent'
                            : 'Currently Unavailable'}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        Digital Resource Only
                      </span>
                    )}

                  </div>

                  <div className="flex items-center gap-2">

                    {item.hasHardCopy && (
                      <button
                        type="button"
                        onClick={() =>
                          toggleHardCopyAvailability(
                            item.id,
                            !item.isAvailableForRent
                          )
                        }
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          item.isAvailableForRent
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {item.isAvailableForRent
                          ? 'Mark Unavailable'
                          : 'Make Available'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteUserResource(item.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors"
                      title="Delete listing"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ================= BOTTOM BANNER ================= */}
      {listings.length > 0 && (
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 sm:p-7">

          <div className="flex items-center gap-4">

            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white shadow-sm text-indigo-600 items-center justify-center">
              <GraduationCap size={25} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Your knowledge makes a difference.
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Keep sharing useful resources and help your community grow.
              </p>
            </div>

          </div>

        </section>
      )}

    </div>
  );
}
