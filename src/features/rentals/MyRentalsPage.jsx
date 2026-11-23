
import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import {
  BookCopy,
  CalendarDays,
  IndianRupee,
  UserRound,
  Clock,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Package,
  Star,
  MessageSquare,
  AlertCircle,
  Inbox,
  ArrowRight,
  ShieldCheck,
  Handshake,
  BookOpen,
  Send,
  RotateCcw,
  Sparkles
} from 'lucide-react';

import { db } from '../../firebase/config';
import { useAuth } from '../authentication/AuthContext';

import {
  subscribeRentalsByRole,
  updateRentalStatus
} from '../../services/rentalService';

import { submitVerifiedReview } from '../../services/resourceService';

import StatusBadge from '../../components/common/StatusBadge';
import StarRating from '../../components/common/StarRating';

export default function MyRentalsPage() {
  const { userProfile } = useAuth();

  const [tab, setTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const [rejectReasons, setRejectReasons] = useState({});
  const [reviewText, setReviewText] = useState({});
  const [reviewStars, setReviewStars] = useState({});

  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!userProfile?.uid) return;

    const handleLoadError = (error) => {
      console.error('Unable to load rental requests:', error);

      setLoadError(
        error.code === 'failed-precondition'
          ? 'Rental records are still unavailable because a Firestore index is missing or building. Deploy the latest Firestore indexes, then refresh.'
          : `Unable to load rental records: ${error.message}`
      );
    };

    const u1 = subscribeRentalsByRole(
      userProfile.uid,
      'ownerId',
      setIncoming,
      handleLoadError
    );

    const u2 = subscribeRentalsByRole(
      userProfile.uid,
      'renterId',
      setOutgoing,
      handleLoadError
    );

    return () => {
      u1();
      u2();
    };
  }, [userProfile?.uid]);

  const handleRateRental = async (req) => {
    const stars = reviewStars[req.id] || 5;

    await submitVerifiedReview({
      targetType: 'rental',
      targetId: req.id,
      reviewerId: userProfile.uid,
      reviewerName: userProfile.name,
      rating: stars,
      helpful: stars >= 4,
      comment: reviewText[req.id] || '',
      resourceIdForAggregate: req.resourceId
    });

    await updateDoc(
      doc(db, 'rentalRequests', req.id),
      { reviewedByRenter: true }
    );
  };

  const list = tab === 'incoming' ? incoming : outgoing;

  const activeCount = list.filter(
    (req) => req.status === 'Active Rental'
  ).length;

  const pendingCount = list.filter(
    (req) => req.status === 'Pending'
  ).length;

  const completedCount = list.filter(
    (req) => req.status === 'Returned'
  ).length;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return Clock;
      case 'Accepted':
        return CheckCircle2;
      case 'Rejected':
        return XCircle;
      case 'Active Rental':
        return Package;
      case 'Returned':
        return PackageCheck;
      case 'Cancelled':
        return XCircle;
      default:
        return BookCopy;
    }
  };

  return (
    <div className="space-y-7 pb-10">

      {/* ================= HEADER ================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#1B2C64] to-[#344B91] p-7 sm:p-9">

        <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute right-20 -bottom-36 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-widest uppercase">
              <Handshake size={13} />
              Rental Management
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-4">
              Physical Notes Rentals
            </h1>

            <p className="text-sm text-blue-100/75 mt-3 leading-relaxed">
              Manage incoming rental requests, track borrowed notes and
              keep everything organized from handover to return.
            </p>

          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <BookCopy size={34} className="text-blue-100" />
          </div>

        </div>

      </section>

      {/* ================= ERROR ================= */}
      {loadError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700"
        >
          <AlertCircle size={19} className="shrink-0 mt-0.5" />

          <div>
            <p className="text-sm font-bold">
              Unable to Load Rental Records
            </p>

            <p className="text-xs mt-1 leading-relaxed">
              {loadError}
            </p>
          </div>
        </div>
      )}

      {/* ================= OVERVIEW STATS ================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {[
          {
            label: 'Incoming Requests',
            value: incoming.length,
            icon: Inbox,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
          },
          {
            label: 'Borrowed Rentals',
            value: outgoing.length,
            icon: BookCopy,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            label: 'Active in Current Tab',
            value: activeCount,
            icon: Package,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
          },
          {
            label: 'Returned in Current Tab',
            value: completedCount,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
          }
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-lg hover:shadow-indigo-950/[0.04] transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>

              <p className="text-2xl font-extrabold text-slate-900 mt-4">
                {stat.value}
              </p>

              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}

      </section>

      {/* ================= TABS ================= */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-2 flex flex-col sm:flex-row gap-2">

        <button
          onClick={() => setTab('incoming')}
          className={`flex-1 flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${
            tab === 'incoming'
              ? 'bg-[#111C46] text-white shadow-md shadow-indigo-950/10'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >

          <div className="flex items-center gap-3">

            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              tab === 'incoming'
                ? 'bg-white/10'
                : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Inbox size={18} />
            </div>

            <div>
              <p className="text-sm font-bold">
                Incoming Requests
              </p>

              <p className={`text-[10px] mt-0.5 ${
                tab === 'incoming' ? 'text-blue-200' : 'text-slate-400'
              }`}>
                Manage as an owner
              </p>
            </div>

          </div>

          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            tab === 'incoming'
              ? 'bg-white/15 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {incoming.length}
          </span>

        </button>

        <button
          onClick={() => setTab('outgoing')}
          className={`flex-1 flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${
            tab === 'outgoing'
              ? 'bg-[#111C46] text-white shadow-md shadow-indigo-950/10'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >

          <div className="flex items-center gap-3">

            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              tab === 'outgoing'
                ? 'bg-white/10'
                : 'bg-blue-50 text-blue-600'
            }`}>
              <BookCopy size={18} />
            </div>

            <div>
              <p className="text-sm font-bold">
                My Borrowed Rentals
              </p>

              <p className={`text-[10px] mt-0.5 ${
                tab === 'outgoing' ? 'text-blue-200' : 'text-slate-400'
              }`}>
                Track your borrowed notes
              </p>
            </div>

          </div>

          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            tab === 'outgoing'
              ? 'bg-white/15 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {outgoing.length}
          </span>

        </button>

      </section>

      {/* ================= REQUEST SUMMARY ================= */}
      {!loadError && list.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">

          <span className="font-semibold text-slate-700">
            {tab === 'incoming' ? 'Owner Overview' : 'Borrower Overview'}
          </span>

          <span className="w-1 h-1 rounded-full bg-slate-300" />

          <span>
            {pendingCount} Pending
          </span>

          <span className="w-1 h-1 rounded-full bg-slate-300" />

          <span>
            {activeCount} Active
          </span>

          <span className="w-1 h-1 rounded-full bg-slate-300" />

          <span>
            {completedCount} Returned
          </span>

        </div>
      )}

      {/* ================= RENTAL LIST ================= */}
      {!loadError && list.length === 0 ? (

        <div className="bg-white rounded-[24px] border border-slate-200/80 p-12 text-center">

          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
            <Inbox size={30} />
          </div>

          <h3 className="font-bold text-slate-900 mt-5">
            No Rental Records Yet
          </h3>

          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            {tab === 'incoming'
              ? 'When students request to rent your physical notes, their requests will appear here.'
              : 'Your borrowed physical notes and their rental progress will appear here.'
            }
          </p>

        </div>

      ) : !loadError ? (

        <div className="space-y-4">

          {list.map((req) => {

            const StatusIcon = getStatusIcon(req.status);

            return (

              <article
                key={req.id}
                className="bg-white rounded-[24px] border border-slate-200/80 overflow-hidden hover:shadow-lg hover:shadow-indigo-950/[0.04] transition-all"
              >

                {/* CARD HEADER */}
                <div className="p-5 sm:p-6">

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                    <div className="flex items-start gap-4 min-w-0">

                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                        <BookOpen size={23} />
                      </div>

                      <div className="min-w-0">

                        <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">
                          {req.resourceTitle}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <UserRound size={13} />

                          {tab === 'incoming'
                            ? `Renter: ${req.renterName}`
                            : `Owner: ${req.ownerName}`
                          }
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <StatusBadge status={req.status} />
                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">

                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <CalendarDays size={14} />

                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          Rental Period
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800">
                        {req.startDate}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 my-1">
                        <ArrowRight size={11} />
                        Return Date
                      </div>

                      <p className="text-xs font-bold text-slate-800">
                        {req.endDate}
                      </p>

                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">

                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Clock size={14} />

                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          Duration
                        </span>
                      </div>

                      <p className="text-xl font-extrabold text-slate-900">
                        {req.days}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        Days of rental
                      </p>

                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">

                      <div className="flex items-center gap-2 text-indigo-500 mb-2">
                        <IndianRupee size={14} />

                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          Rental Amount
                        </span>
                      </div>

                      <p className="text-xl font-extrabold text-indigo-950">
                        ₹{req.totalAmount}
                      </p>

                      <p className="text-[10px] text-indigo-600 mt-1">
                        ₹{req.dailyRate} per day
                      </p>

                    </div>

                  </div>

                  {/* MESSAGE */}
                  {req.message && (
                    <div className="flex items-start gap-2.5 p-3.5 mt-4 rounded-xl bg-blue-50/70 border border-blue-100">

                      <MessageSquare size={15} className="text-blue-600 shrink-0 mt-0.5" />

                      <div>
                        <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                          Pickup Note
                        </p>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {req.message}
                        </p>
                      </div>

                    </div>
                  )}

                  {/* REJECTION REASON */}
                  {req.rejectionReason && (
                    <div className="flex items-start gap-2.5 p-3.5 mt-3 rounded-xl bg-rose-50 border border-rose-100">

                      <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />

                      <div>
                        <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wide">
                          Rejection Reason
                        </p>

                        <p className="text-xs text-rose-700 mt-1">
                          {req.rejectionReason}
                        </p>
                      </div>

                    </div>
                  )}

                </div>

                {/* ================= OWNER ACTIONS ================= */}
                {tab === 'incoming' && (

                  <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/60">

                    <div className="flex items-center gap-2 mb-3">

                      <ShieldCheck size={15} className="text-indigo-600" />

                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Owner Actions
                      </p>

                    </div>

                    {req.status === 'Pending' && (

                      <div className="flex flex-col sm:flex-row flex-wrap gap-3">

                        <button
                          onClick={() => updateRentalStatus(req, 'Accepted')}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle2 size={15} />
                          Accept Request
                        </button>

                        <div className="flex flex-1 flex-col sm:flex-row gap-2 min-w-0">

                          <input
                            type="text"
                            placeholder="Optional rejection reason"
                            value={rejectReasons[req.id] || ''}
                            onChange={(e) =>
                              setRejectReasons({
                                ...rejectReasons,
                                [req.id]: e.target.value
                              })
                            }
                            className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50"
                          />

                          <button
                            onClick={() =>
                              updateRentalStatus(
                                req,
                                'Rejected',
                                rejectReasons[req.id] || ''
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>

                        </div>

                      </div>

                    )}

                    {req.status === 'Accepted' && (

                      <div className="space-y-3">

                        <p className="text-xs text-slate-500">
                          Confirm once the physical notes have been handed over to the renter.
                        </p>

                        <button
                          onClick={() => updateRentalStatus(req, 'Active Rental')}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-950 text-white text-xs font-bold hover:bg-indigo-800 transition-colors"
                        >
                          <Package size={15} />
                          Confirm Physical Handover
                          <ArrowRight size={14} />
                        </button>

                      </div>

                    )}

                    {req.status === 'Active Rental' && (

                      <div className="space-y-3">

                        <p className="text-xs text-slate-500">
                          Confirm once the physical copy has been returned by the renter.
                        </p>

                        <button
                          onClick={() => updateRentalStatus(req, 'Returned')}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                          <PackageCheck size={15} />
                          Confirm Copy Returned
                        </button>

                      </div>

                    )}

                    {!['Pending', 'Accepted', 'Active Rental'].includes(req.status) && (
                      <p className="text-xs text-slate-400">
                        No further owner actions are available for this request.
                      </p>
                    )}

                  </div>

                )}

                {/* ================= RENTER ACTIONS ================= */}
                {tab === 'outgoing' && (

                  <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/60">

                    {req.status === 'Pending' && (

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                        <p className="text-xs text-slate-500">
                          Your request is awaiting approval from the owner.
                        </p>

                        <button
                          onClick={() => updateRentalStatus(req, 'Cancelled')}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
                        >
                          <RotateCcw size={14} />
                          Cancel Request
                        </button>

                      </div>

                    )}

                    {req.status === 'Accepted' && (
                      <div className="flex items-center gap-2 text-xs text-indigo-700">
                        <CheckCircle2 size={15} />
                        Your request is accepted. Awaiting physical handover.
                      </div>
                    )}

                    {req.status === 'Active Rental' && (
                      <div className="flex items-center gap-2 text-xs text-amber-700">
                        <Package size={15} />
                        Your rental is active. Return the physical copy to the owner.
                      </div>
                    )}

                    {req.status === 'Rejected' && (
                      <div className="flex items-center gap-2 text-xs text-rose-700">
                        <XCircle size={15} />
                        This rental request was declined by the owner.
                      </div>
                    )}

                    {req.status === 'Cancelled' && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <RotateCcw size={15} />
                        You cancelled this rental request.
                      </div>
                    )}

                    {/* RENTAL REVIEW */}
                    {req.status === 'Returned' && !req.reviewedByRenter && (

                      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-4">

                        <div className="flex items-start gap-3">

                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Star size={20} />
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">
                              Rate Your Rental Experience
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                              Share feedback about the physical condition and handover.
                            </p>
                          </div>

                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                            Your Rating
                          </p>

                          <StarRating
                            rating={reviewStars[req.id] || 5}
                            interactive
                            onChange={(val) =>
                              setReviewStars({
                                ...reviewStars,
                                [req.id]: val
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                            Your Feedback
                          </label>

                          <input
                            type="text"
                            placeholder="Rate physical condition & handover..."
                            value={reviewText[req.id] || ''}
                            onChange={(e) =>
                              setReviewText({
                                ...reviewText,
                                [req.id]: e.target.value
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                          />
                        </div>

                        <button
                          onClick={() => handleRateRental(req)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-950 text-white text-xs font-bold hover:bg-indigo-800 transition-colors"
                        >
                          <Send size={14} />
                          Submit Rental Review
                        </button>

                      </div>

                    )}

                    {req.status === 'Returned' && req.reviewedByRenter && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 size={15} />
                        You have submitted your review for this rental.
                      </div>
                    )}

                  </div>

                )}

              </article>

            );

          })}

        </div>

      ) : null}

    </div>
  );
}
