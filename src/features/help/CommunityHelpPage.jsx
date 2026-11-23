
import React, { useEffect, useState } from 'react';

import {
  HandHelping,
  Send,
  CheckCircle2,
  BookOpen,
  Users,
  MessageCircle,
  Sparkles,
  Tag,
  Inbox,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  UserRound,
  XCircle,
  HeartHandshake,
  Plus,
  MessageSquare,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

import { useAuth } from '../authentication/AuthContext';

import {
  subscribeHelpRequests,
  subscribeHelpOffers,
  createHelpRequest,
  submitHelpOffer,
  respondToHelpOffer,
  markHelpRequestCompleted
} from '../../services/helpService';

import { RESOURCE_CATEGORIES } from '../../utils/pricingAndDates';
import StatusBadge from '../../components/common/StatusBadge';

export default function CommunityHelpPage() {
  const { userProfile } = useAuth();

  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const [offerDrafts, setOfferDrafts] = useState({});

  useEffect(() => {
    const u1 = subscribeHelpRequests(setRequests);
    const u2 = subscribeHelpOffers(setOffers);

    return () => {
      u1();
      u2();
    };
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    await createHelpRequest(
      { title, subject, category, description },
      userProfile
    );

    setTitle('');
    setSubject('');
    setDescription('');
  };

  const handleOfferHelp = async (req) => {
    const msg = offerDrafts[req.id];

    if (!msg?.trim()) return;

    await submitHelpOffer({
      request: req,
      helper: userProfile,
      message: msg
    });

    setOfferDrafts({
      ...offerDrafts,
      [req.id]: ''
    });
  };

  const activeRequests = requests.filter(
    (req) => req.status === 'Pending'
  ).length;

  const completedRequests = requests.filter(
    (req) => req.status === 'Completed'
  ).length;

  const totalOffers = offers.length;

  return (
    <div className="space-y-7 pb-10">

      {/* ================= HERO HEADER ================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#1B2C64] to-[#344B91] p-7 sm:p-9">

        <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute right-20 -bottom-36 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-widest uppercase">
              <HeartHandshake size={13} />
              Student Community
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-4">
              Community Help & Peer Assistance
            </h1>

            <p className="text-sm text-blue-100/75 mt-3 leading-relaxed">
              Learning is better together. Share your doubts, find help with
              projects and connect with students who are ready to support you.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">

              <div className="flex items-center gap-2 text-xs text-blue-100/80">
                <Users size={15} />
                Peer Learning
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-100/80">
                <MessageCircle size={15} />
                Community Support
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-100/80">
                <GraduationCap size={15} />
                Learn Together
              </div>

            </div>

          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <HandHelping size={36} className="text-blue-100" />
          </div>

        </div>

      </section>

      {/* ================= COMMUNITY STATS ================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {[
          {
            label: 'Total Requests',
            value: requests.length,
            icon: Inbox,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
          },
          {
            label: 'Open Requests',
            value: activeRequests,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
          },
          {
            label: 'Community Offers',
            value: totalOffers,
            icon: HeartHandshake,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            label: 'Completed',
            value: completedRequests,
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

      {/* ================= CREATE REQUEST ================= */}
      <section className="bg-white rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <HandHelping size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Post a Help Request
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Let the community know where you need support.
              </p>
            </div>

          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <Plus size={12} />
            Create Request
          </span>

        </div>

        <form
          onSubmit={handleCreateRequest}
          className="p-6 space-y-5"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="md:col-span-2">

              <label className="block text-xs font-bold text-slate-700 mb-2">
                What do you need help with?
                <span className="text-rose-500 ml-1">*</span>
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Need help understanding Dynamic Programming"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

            {/* Subject */}
            <div>

              <label className="block text-xs font-bold text-slate-700 mb-2">
                Subject / Topic
                <span className="text-rose-500 ml-1">*</span>
              </label>

              <div className="relative">

                <BookOpen
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />

              </div>

            </div>

            {/* Category */}
            <div>

              <label className="block text-xs font-bold text-slate-700 mb-2">
                Category
              </label>

              <div className="relative">

                <Tag
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  {RESOURCE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

              </div>

            </div>

          </div>

          {/* Description */}
          <div>

            <label className="block text-xs font-bold text-slate-700 mb-2">
              Explain What You Need
              <span className="text-rose-500 ml-1">*</span>
            </label>

            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context, deadline, or preferred format (online call, notes, lab walkthrough)..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 resize-y"
            />

            <p className="text-[10px] text-slate-400 mt-2">
              Include enough details so other students can understand how they can help.
            </p>

          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">

            <p className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-600" />
              Your request will be visible to the HelpHub community.
            </p>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-950 text-white text-sm font-bold hover:bg-indigo-800 shadow-md shadow-indigo-950/10 transition-all"
            >
              <Send size={16} />
              Publish Help Request
              <ArrowUpRight size={15} />
            </button>

          </div>

        </form>

      </section>

      {/* ================= ACTIVE COMMUNITY BOARD ================= */}
      <section className="space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Users size={19} />
              </div>

              <h2 className="text-lg font-extrabold text-slate-900">
                Community Help Board
              </h2>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Browse requests and connect with students who need or offer assistance.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {requests.length} Total Requests
          </span>

        </div>

        {/* Empty State */}
        {requests.length === 0 ? (

          <div className="bg-white rounded-[24px] border border-slate-200/80 p-12 text-center">

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
              <Inbox size={30} />
            </div>

            <h3 className="font-bold text-slate-900 mt-5">
              No Help Requests Yet
            </h3>

            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Be the first to start a conversation. Post a question or ask
              for assistance with your studies and projects.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {requests.map((req) => {

              const reqOffers = offers.filter(
                (o) => o.requestId === req.id
              );

              const isAuthor = req.authorId === userProfile?.uid;

              return (

                <article
                  key={req.id}
                  className="bg-white rounded-[24px] border border-slate-200/80 overflow-hidden hover:shadow-lg hover:shadow-indigo-950/[0.04] transition-all"
                >

                  {/* REQUEST DETAILS */}
                  <div className="p-5 sm:p-6 space-y-4">

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-[10px] font-bold">
                            {req.category}
                          </span>

                          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {req.subject}
                          </span>

                        </div>

                        <h3 className="font-bold text-slate-900 text-lg mt-3 break-words">
                          {req.title}
                        </h3>

                        <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                          {req.description}
                        </p>

                        <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">

                          <UserRound size={14} />

                          Requested by
                          <span className="font-semibold text-slate-600">
                            {req.authorName}
                          </span>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 shrink-0">

                        <StatusBadge status={req.status} />

                      </div>

                    </div>

                    {/* REQUEST SUMMARY */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MessageCircle size={15} className="text-indigo-500" />
                        <span>
                          {reqOffers.length} {reqOffers.length === 1 ? 'Offer' : 'Offers'}
                        </span>
                      </div>

                      {req.status === 'Pending' && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Open for assistance
                        </div>
                      )}

                    </div>

                  </div>

                  {/* ================= OFFERS SECTION ================= */}
                  {reqOffers.length > 0 && (

                    <div className="px-5 sm:px-6 py-5 bg-slate-50/70 border-t border-slate-100">

                      <div className="flex items-center gap-2 mb-4">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <HeartHandshake size={17} />
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-800">
                            Community Offers
                          </h4>

                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {reqOffers.length} students responded to this request
                          </p>
                        </div>

                      </div>

                      <div className="space-y-3">

                        {reqOffers.map((offer) => (

                          <div
                            key={offer.id}
                            className="p-4 rounded-2xl bg-white border border-slate-200/80"
                          >

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

                              <div className="flex items-start gap-3 min-w-0">

                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                  <UserRound size={17} />
                                </div>

                                <div className="min-w-0">

                                  <p className="text-xs font-bold text-slate-900">
                                    {offer.helperName}
                                  </p>

                                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                    {offer.message}
                                  </p>

                                </div>

                              </div>

                              <div className="flex flex-wrap items-center gap-2 sm:justify-end">

                                <StatusBadge status={offer.status} />

                                {isAuthor &&
                                  offer.status === 'Pending' &&
                                  req.status === 'Pending' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          respondToHelpOffer({
                                            request: req,
                                            offer,
                                            decision: 'Accepted'
                                          })
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-colors"
                                      >
                                        <CheckCircle2 size={13} />
                                        Accept
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          respondToHelpOffer({
                                            request: req,
                                            offer,
                                            decision: 'Rejected'
                                          })
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold hover:bg-rose-100 transition-colors"
                                      >
                                        <XCircle size={13} />
                                        Reject
                                      </button>
                                    </>
                                  )}

                              </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  )}

                  {/* ================= REQUEST ACTIONS ================= */}
                  <div className="px-5 sm:px-6 py-4 border-t border-slate-100">

                    {isAuthor && req.status === 'Accepted' && (

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                        <div className="flex items-center gap-2 text-xs text-emerald-700">
                          <CheckCircle2 size={16} />
                          A helper has been accepted for this request.
                        </div>

                        <button
                          type="button"
                          onClick={() => markHelpRequestCompleted(req)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle2 size={15} />
                          Mark Completed
                        </button>

                      </div>

                    )}

                    {!isAuthor && req.status === 'Pending' && (

                      <div className="flex flex-col sm:flex-row gap-2">

                        <div className="relative flex-1">

                          <MessageSquare
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="text"
                            value={offerDrafts[req.id] || ''}
                            onChange={(e) =>
                              setOfferDrafts({
                                ...offerDrafts,
                                [req.id]: e.target.value
                              })
                            }
                            placeholder="Write how you can assist..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                        <button
                          type="button"
                          onClick={() => handleOfferHelp(req)}
                          disabled={!offerDrafts[req.id]?.trim()}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send size={15} />
                          Offer Help
                        </button>

                      </div>

                    )}

                    {isAuthor && req.status === 'Pending' && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-2">
                        <Clock size={13} />
                        Waiting for community members to offer assistance.
                      </p>
                    )}

                    {req.status === 'Completed' && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={15} />
                        This help request has been completed.
                      </div>
                    )}

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </section>

      {/* ================= COMMUNITY FOOTER NOTE ================= */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">

        <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shrink-0">
          <Lightbulb size={18} />
        </div>

        <div>
          <p className="text-xs font-bold text-indigo-950">
            The power of peer learning
          </p>

          <p className="text-[11px] text-indigo-800/70 mt-1 leading-relaxed">
            A small explanation, a shared resource or a quick walkthrough
            can make a big difference to another student's learning journey.
          </p>
        </div>

      </div>

    </div>
  );
}
