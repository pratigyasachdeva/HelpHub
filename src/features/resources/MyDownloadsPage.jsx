
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

import {
  Download,
  FileText,
  BookOpen,
  ArrowUpRight,
  Clock,
  Sparkles,
  Library,
  CheckCircle2,
  Inbox,
  GraduationCap
} from 'lucide-react';

import { db } from '../../firebase/config';
import { useAuth } from '../authentication/AuthContext';
import { formatTimestamp } from '../../utils/pricingAndDates';

export default function MyDownloadsPage() {
  const { userProfile } = useAuth();
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    if (!userProfile?.uid) return;

    const q = query(
      collection(db, 'downloads'),
      where('userId', '==', userProfile.uid)
    );

    return onSnapshot(q, (snap) => {
      setDownloads(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });
  }, [userProfile?.uid]);

  const totalDownloads = downloads.reduce(
    (total, item) => total + (item.downloadCount || 0),
    0
  );

  return (
    <div className="space-y-8 pb-10">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#192B61] to-[#30458C] p-7 sm:p-9 shadow-lg shadow-indigo-950/10">

        <div className="absolute -top-24 -right-10 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-7">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-widest mb-5">
              <Sparkles size={13} />
              YOUR PERSONAL LIBRARY
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Downloads.
              <br />
              <span className="text-blue-300">
                My Learning Space.
              </span>
            </h1>

            <p className="text-sm text-blue-100/75 mt-4 max-w-lg leading-relaxed">
              All your downloaded study materials in one place.
              Revisit your notes, explore resources and share
              feedback with the community.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl p-5 sm:min-w-[175px]">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-blue-200">
              <Download size={24} />
            </div>

            <div>
              <p className="text-3xl font-extrabold text-white">
                {downloads.length}
              </p>
              <p className="text-[10px] text-blue-200 font-medium">
                Saved Resources
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= STATISTICS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Library size={22} />
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              {downloads.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Unique Downloaded Resources
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Download size={22} />
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900">
              {totalDownloads}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Total Download Activities
            </p>
          </div>
        </div>

      </section>

      {/* ================= DOWNLOAD COLLECTION ================= */}
      <section>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen size={17} />
              </div>

              <span className="text-[10px] font-bold tracking-[0.18em] text-indigo-600 uppercase">
                YOUR COLLECTION
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Downloaded Study Materials
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Revisit your resources and manage your learning journey.
            </p>
          </div>

          <Link
            to="/dashboard/browse"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-950 transition-colors"
          >
            Explore More Resources
            <ArrowUpRight size={16} />
          </Link>

        </div>

        {downloads.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-[26px] border border-slate-200 p-10 sm:p-16 text-center shadow-sm">

            <div className="relative w-20 h-20 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Inbox size={36} strokeWidth={1.5} />

              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center">
                <FileText size={12} className="text-blue-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-7">
              Your library is waiting!
            </h3>

            <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              You haven't downloaded any PDFs yet.
              Explore the community library and discover useful
              notes, study materials and academic resources.
            </p>

            <Link
              to="/dashboard/browse"
              className="inline-flex items-center gap-2 mt-7 px-6 py-3.5 rounded-xl bg-indigo-950 text-white text-sm font-bold hover:bg-indigo-800 shadow-md shadow-indigo-950/10 transition-all"
            >
              <SearchIcon />
              Explore Study Resources
            </Link>

          </div>

        ) : (

          /* Download Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {downloads.map((dl) => (

              <div
                key={dl.id}
                className="group bg-white rounded-[22px] border border-slate-200/80 p-5 sm:p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/[0.05] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >

                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">

                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <FileText size={23} />
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold tracking-wide">
                    <CheckCircle2 size={12} />
                    DOWNLOADED
                  </span>

                </div>

                {/* Resource Information */}
                <div className="mt-6 flex-1">

                  <Link
                    to={`/dashboard/resources/${dl.resourceId}`}
                    className="text-base font-bold text-slate-900 leading-snug hover:text-indigo-700 transition-colors line-clamp-2"
                  >
                    {dl.resourceTitle}
                  </Link>

                  <p className="text-xs text-slate-500 mt-2">
                    {dl.subject || 'Study Resource'}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-2">
                        <Download size={14} />
                        Download activity
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {dl.downloadCount || 0}x
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-2">
                        <Clock size={14} />
                        Last downloaded
                      </span>

                      <span className="text-[10px] font-medium text-slate-600 text-right">
                        {formatTimestamp(dl.lastDownloadedAt)}
                      </span>
                    </div>

                  </div>

                </div>

                {/* Action */}
                <Link
                  to={`/dashboard/resources/${dl.resourceId}`}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#111C46] text-white text-xs font-bold hover:bg-indigo-800 transition-all duration-200"
                >
                  <BookOpen size={16} />
                  Open Resource / Rate
                  <ArrowUpRight size={15} className="ml-auto" />
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ================= BOTTOM BANNER ================= */}
      {downloads.length > 0 && (
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 sm:p-7">

          <div className="flex items-center gap-4">

            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white shadow-sm text-indigo-600 items-center justify-center">
              <GraduationCap size={25} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Keep building your knowledge!
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Every resource you explore is another step in your learning journey.
              </p>
            </div>

          </div>

        </section>
      )}

    </div>
  );
}

function SearchIcon() {
  return <BookOpen size={17} />;
}
