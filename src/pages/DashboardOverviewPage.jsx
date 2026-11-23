
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Search,
  HandHelping,
  BookOpen,
  Download,
  BookCopy,
  Clock,
  ArrowUpRight,
  Sparkles,
  Library,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

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
    const u2 = subscribeRentalsByRole(
      userProfile.uid,
      'ownerId',
      setIncomingRentals
    );

    return () => {
      u1();
      u2();
    };
  }, [userProfile?.uid]);

  const pendingApprovals = incomingRentals.filter(
    (r) => r.status === 'Pending'
  ).length;

  const metrics = [
    {
      label: 'My Shared Resources',
      value: userProfile?.uploadedCount || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Resources contributed'
    },
    {
      label: 'My PDF Downloads',
      value: userProfile?.downloadsCount || 0,
      icon: Download,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      description: 'Digital resources accessed'
    },
    {
      label: 'Completed Rentals',
      value: userProfile?.completedRentalsCount || 0,
      icon: BookCopy,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Successful exchanges'
    },
    {
      label: 'Pending Owner Actions',
      value: pendingApprovals,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      description: 'Requests awaiting action'
    }
  ];

  return (
    <div className="space-y-9 pb-8">

      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#192B61] to-[#30458C] p-7 sm:p-10 shadow-xl shadow-indigo-950/10">

        {/* Background Decorations */}
        <div className="absolute -top-28 -right-16 w-80 h-80 rounded-full border border-white/[0.08]" />
        <div className="absolute -top-12 -right-2 w-60 h-60 rounded-full border border-white/[0.08]" />
        <div className="absolute -bottom-36 right-1/3 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-9">

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-100 text-[11px] font-semibold tracking-wider mb-5">
              <Sparkles size={13} />
              YOUR LEARNING SPACE
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Welcome back,
              <br />
              <span className="text-blue-300">
                {userProfile?.name || 'Student'}!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/75 mt-4 leading-relaxed max-w-md">
              Your knowledge journey continues here.
              Share resources, discover useful notes, and
              make learning easier together.
            </p>

            <div className="flex items-center gap-2 mt-6 text-sm text-blue-100/80">
              <Clock size={15} />
              <span>
                You have{' '}
                <span className="font-bold text-white">
                  {pendingApprovals}
                </span>{' '}
                pending physical rental request
                {pendingApprovals === 1 ? '' : 's'} awaiting action.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-3 lg:min-w-[190px]">
            <Link
              to="/dashboard/upload"
              className="group inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-white text-indigo-950 text-sm font-bold shadow-lg hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <UploadCloud size={18} />
              Share Notes
              <ArrowUpRight size={15} className="ml-auto opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              to="/dashboard/browse"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all duration-200"
            >
              <Search size={18} />
              Browse Library
            </Link>
          </div>

        </div>
      </section>

      {/* Metrics */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Activity
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              A snapshot of your HelpHub contributions
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Live overview
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/[0.04] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center`}>
                    <Icon size={21} strokeWidth={1.9} />
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>

                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-5 tracking-tight">
                  {metric.value}
                </p>

                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                  {metric.label}
                </p>

                <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Resources */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Library size={17} />
              </div>
              <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
                Explore & Discover
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Latest Resources in Community
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Discover study materials shared by fellow students.
            </p>
          </div>

          <Link
            to="/dashboard/help"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
          >
            <HandHelping size={17} />
            Open Help Board
            <ChevronRight size={15} />
          </Link>

        </div>

        {resources.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-dashed border-slate-300 p-10 sm:p-14 text-center">

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <BookOpen size={30} strokeWidth={1.6} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-5">
              Your community library is waiting!
            </h3>

            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              No resources uploaded yet. Be the first to share
              your notes and help someone in their learning journey.
            </p>

            <Link
              to="/dashboard/upload"
              className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-800 transition-all"
            >
              <UploadCloud size={17} />
              Share First Resource
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {resources.slice(0, 6).map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom Community Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white shadow-sm text-indigo-600 items-center justify-center">
              <GraduationCap size={25} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Knowledge is better when shared.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Be part of a community that learns and grows together.
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/browse"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-950 whitespace-nowrap"
          >
            Explore Library
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

    </div>
  );
}
