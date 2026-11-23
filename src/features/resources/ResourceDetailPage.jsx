
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where
} from 'firebase/firestore';

import {
  Download,
  FileText,
  BookCopy,
  ThumbsUp,
  Flag,
  CheckCircle2,
  AlertCircle,
  Star,
  Eye,
  Users,
  ArrowUpRight,
  Clock,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  BookOpen,
  MessageSquare,
  Inbox,
  FileWarning
} from 'lucide-react';

import { db } from '../../firebase/config';
import { useAuth } from '../authentication/AuthContext';

import {
  recordUniqueResourceView,
  recordPdfDownload,
  hasUserDownloadedResource,
  submitVerifiedReview
} from '../../services/resourceService';

import { submitRentalRequest } from '../../services/rentalService';
import { submitReport } from '../../services/adminService';
import { getResourcePdfUrl } from '../../services/fileStorageService';

import {
  calculateRentalDays,
  formatTimestamp
} from '../../utils/pricingAndDates';

import StarRating from '../../components/common/StarRating';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { userProfile } = useAuth();

  const [resource, setResource] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [reviews, setReviews] = useState([]);
  const [canRatePdf, setCanRatePdf] = useState(false);

  // Rental request form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalMessage, setRentalMessage] = useState('');
  const [rentalFeedback, setRentalFeedback] = useState({
    type: '',
    text: ''
  });

  // Verified review form
  const [rating, setRating] = useState(5);
  const [helpful, setHelpful] = useState(true);
  const [comment, setComment] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState({
    type: '',
    text: ''
  });

  // Report modal/box
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Resource subscription
  useEffect(() => {
    const unsubRes = onSnapshot(doc(db, 'resources', id), (snap) => {
      if (snap.exists()) {
        setResource({
          id: snap.id,
          ...snap.data()
        });
      }
    });

    const revQ = query(
      collection(db, 'reviews'),
      where('resourceId', '==', id)
    );

    const unsubRev = onSnapshot(revQ, (snap) => {
      setReviews(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    if (userProfile?.uid) {
      recordUniqueResourceView(id, userProfile.uid);
      hasUserDownloadedResource(id, userProfile.uid).then(setCanRatePdf);
    }

    return () => {
      unsubRes();
      unsubRev();
    };
  }, [id, userProfile?.uid]);

  // PDF URL
  useEffect(() => {
    let active = true;

    if (resource?.filePath) {
      getResourcePdfUrl(resource.filePath)
        .then((url) => {
          if (active) setPdfPreviewUrl(url);
        })
        .catch(() => {
          if (active) setPdfPreviewUrl('');
        });
    } else {
      setPdfPreviewUrl(resource?.fileUrl || '');
    }

    return () => {
      active = false;
    };
  }, [resource?.filePath, resource?.fileUrl]);

  if (!resource) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>

        <h2 className="font-bold text-slate-900">
          Loading Resource
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Preparing your study material...
        </p>
      </div>
    );
  }

  const isOwner = resource.ownerId === userProfile?.uid;
  const rentalDays = calculateRentalDays(startDate, endDate);
  const estimatedTotal = rentalDays * (resource.dailyRate || 0);

  // Download PDF
  const handleDownloadPdf = async () => {
    let downloadTab = null;

    if (resource.filePath) {
      downloadTab = window.open('about:blank', '_blank');
    }

    try {
      const url = resource.filePath
        ? await getResourcePdfUrl(resource.filePath)
        : resource.fileUrl;

      if (!url) {
        throw new Error(
          'PDF link is not ready yet. Please try again in a moment.'
        );
      }

      await recordPdfDownload(resource, userProfile.uid);
      setCanRatePdf(true);

      if (downloadTab) {
        downloadTab.opener = null;
        downloadTab.location = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }

    } catch (error) {
      downloadTab?.close();
      window.alert(error.message || 'Unable to open this PDF.');
    }
  };

  // Rental Request
  const handleRequestRental = async (e) => {
    e.preventDefault();

    setRentalFeedback({
      type: '',
      text: ''
    });

    try {
      await submitRentalRequest({
        resource,
        renter: userProfile,
        startDate,
        endDate,
        message: rentalMessage
      });

      setRentalFeedback({
        type: 'success',
        text: 'Rental request sent to owner! Track status under Rentals.'
      });

      setRentalMessage('');

    } catch (err) {
      setRentalFeedback({
        type: 'error',
        text: err.message
      });
    }
  };

  // Verified Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setReviewFeedback({
      type: '',
      text: ''
    });

    try {
      await submitVerifiedReview({
        targetType: 'resource',
        targetId: resource.id,
        reviewerId: userProfile.uid,
        reviewerName: userProfile.name,
        rating,
        helpful,
        comment,
        resourceIdForAggregate: resource.id
      });

      setReviewFeedback({
        type: 'success',
        text: 'Thank you! Your verified review has been published.'
      });

      setComment('');

    } catch (err) {
      setReviewFeedback({
        type: 'error',
        text: err.message
      });
    }
  };

  // Report Resource
  const handleReport = async (e) => {
    e.preventDefault();

    await submitReport({
      targetType: 'resource',
      targetId: resource.id,
      targetTitle: resource.title,
      reason: reportReason,
      reporter: userProfile
    });

    setShowReport(false);
    setReportReason('');
  };

  const statistics = [
    {
      label: 'Average Rating',
      value: resource.avgRating
        ? `${resource.avgRating} / 5`
        : 'New',
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Helpful Score',
      value: `${resource.helpfulPercentage || 0}%`,
      icon: ThumbsUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'PDF Downloads',
      value: resource.totalDownloads || 0,
      icon: Download,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Resource Views',
      value: resource.viewsCount || 0,
      icon: Eye,
      color: 'text-violet-600',
      bg: 'bg-violet-50'
    }
  ];

  return (
    <div className="space-y-7 pb-10">

      {/* ================= RESOURCE HEADER ================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#192B61] to-[#30458C] p-7 sm:p-9 shadow-lg shadow-indigo-950/10">

        <div className="absolute -top-24 -right-10 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative">

          <div className="flex flex-wrap items-center gap-2 mb-5">

            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-wide">
              {resource.category}
            </span>

            {resource.hasSoftCopy && (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-400/15 border border-emerald-300/20 text-emerald-200 text-[10px] font-bold">
                PDF AVAILABLE
              </span>
            )}

            {resource.hasHardCopy && (
              <span className="px-3 py-1.5 rounded-lg bg-amber-400/15 border border-amber-300/20 text-amber-200 text-[10px] font-bold">
                PHYSICAL COPY
              </span>
            )}

          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-5">

            <div className="max-w-3xl">

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {resource.title}
              </h1>

              <p className="text-sm text-blue-100/75 mt-4 leading-relaxed">
                {resource.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 text-xs text-blue-100/80">

                <span className="flex items-center gap-1.5">
                  <BookOpen size={15} />
                  {resource.subject}
                </span>

                <span className="flex items-center gap-1.5">
                  <FileText size={15} />
                  {resource.pageCount} Pages
                </span>

                <span className="flex items-center gap-1.5">
                  <Users size={15} />
                  Shared by {resource.ownerName}
                </span>

              </div>

            </div>

            <button
              onClick={() => setShowReport(!showReport)}
              className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold hover:bg-rose-500/20 hover:border-rose-300/30 transition-colors shrink-0"
            >
              <Flag size={15} />
              Report Resource
            </button>

          </div>

        </div>
      </section>

      {/* ================= REPORT FORM ================= */}
      {showReport && (
        <form
          onSubmit={handleReport}
          className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-2 text-rose-800">
            <FileWarning size={18} />

            <h3 className="text-sm font-bold">
              Report Inappropriate or Copyrighted Listing
            </h3>
          </div>

          <input
            type="text"
            required
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full px-4 py-3 rounded-xl border border-rose-200 text-sm bg-white outline-none focus:ring-2 focus:ring-rose-200"
          />

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 transition-colors"
          >
            Submit Report to Admins
          </button>
        </form>
      )}

      {/* ================= STATISTICS ================= */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-lg hover:shadow-indigo-950/[0.04] transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>

              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4">
                {stat.value}
              </p>

              <p className="text-[11px] font-medium text-slate-500 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}

      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">

          {/* PDF SECTION */}
          {resource.hasSoftCopy && (
            <section className="bg-white rounded-[24px] border border-slate-200/80 overflow-hidden">

              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Digital PDF Soft Copy
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      {resource.fileName || 'Document.pdf'}
                    </p>
                  </div>

                </div>

                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
                >
                  <Download size={16} />
                  Download PDF
                  <ArrowUpRight size={14} />
                </button>

              </div>

              <div className="p-4 sm:p-6">

                {pdfPreviewUrl ? (
                  <iframe
                    src={`${pdfPreviewUrl}#toolbar=0`}
                    title="PDF Preview"
                    className="w-full h-[450px] sm:h-[600px] rounded-2xl border border-slate-200 bg-slate-50"
                  />
                ) : (
                  <div className="h-72 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-6">

                    <FileText size={35} className="text-slate-300" />

                    <p className="text-sm font-semibold text-slate-700 mt-4">
                      PDF Preview Unavailable
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      You can still try downloading the document.
                    </p>

                  </div>
                )}

              </div>

            </section>
          )}

          {/* VERIFIED REVIEWS */}
          <section className="bg-white rounded-[24px] border border-slate-200/80 p-5 sm:p-6 space-y-6">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 text-lg">
                    Community Reviews
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified feedback from resource users
                  </p>
                </div>

              </div>

              <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                {reviews.length} Reviews
              </span>

            </div>

            {/* REVIEW FORM */}
            {canRatePdf && !isOwner && (
              <form
                onSubmit={handleSubmitReview}
                className="p-5 rounded-2xl bg-[#F8F9FF] border border-indigo-100 space-y-4"
              >

                <div>
                  <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                    Verified Downloader
                  </span>

                  <h3 className="font-bold text-slate-900 mt-1">
                    Share Your Experience
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-5">

                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      Your Rating
                    </p>

                    <StarRating
                      rating={rating}
                      size={23}
                      interactive
                      onChange={setRating}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      Was this resource helpful?
                    </p>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() => setHelpful(true)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                          helpful
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        <ThumbsUp size={13} className="inline mr-1" />
                        Helpful
                      </button>

                      <button
                        type="button"
                        onClick={() => setHelpful(false)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                          !helpful
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        Not Helpful
                      </button>

                    </div>
                  </div>

                </div>

                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts on clarity, completeness and handwriting..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-y"
                />

                {reviewFeedback.text && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    reviewFeedback.type === 'error'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {reviewFeedback.type === 'error'
                      ? <AlertCircle size={15} />
                      : <CheckCircle2 size={15} />
                    }

                    {reviewFeedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-950 text-white text-xs font-bold hover:bg-indigo-800 transition-colors"
                >
                  <Star size={15} />
                  Publish Review
                </button>

              </form>
            )}

            {/* REVIEW LIST */}
            {reviews.length === 0 ? (

              <div className="py-10 text-center">

                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox size={26} />
                </div>

                <p className="font-semibold text-slate-800 mt-4">
                  No Reviews Yet
                </p>

                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Download the PDF or complete a rental to share your verified feedback.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {reviews.map((rev) => (

                  <div
                    key={rev.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          {rev.reviewerName}
                        </p>

                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatTimestamp(rev.createdAt)}
                        </p>
                      </div>

                      <StarRating
                        rating={rev.rating}
                        size={15}
                      />

                    </div>

                    {rev.comment && (
                      <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                        {rev.comment}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                      <ThumbsUp size={12} />
                      {rev.helpful
                        ? 'Marked Helpful'
                        : 'Marked Not Helpful'}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

        {/* ================= RIGHT COLUMN: RENTAL ================= */}
        <aside className="xl:sticky xl:top-24">

          <section className="bg-white rounded-[24px] border border-slate-200/80 overflow-hidden shadow-sm">

            <div className="bg-gradient-to-br from-[#111C46] to-[#30458C] p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-white/10 text-blue-200 flex items-center justify-center">
                  <BookCopy size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-white text-lg">
                    Physical Copy
                  </h2>

                  <p className="text-[11px] text-blue-200 mt-0.5">
                    Rental & Booking
                  </p>
                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6 space-y-5">

              {!resource.hasHardCopy ? (

                <div className="py-7 text-center">

                  <BookCopy size={35} className="text-slate-300 mx-auto" />

                  <p className="font-bold text-slate-800 mt-4">
                    Digital Copy Only
                  </p>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    This resource is shared as a digital PDF only.
                    No physical copy is listed for rental.
                  </p>

                </div>

              ) : (

                <>

                  {/* Rental Pricing */}
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">

                    <p className="text-[10px] font-bold tracking-widest text-amber-800 uppercase">
                      Rental Price
                    </p>

                    <div className="flex items-baseline gap-2 mt-2">

                      <span className="text-3xl font-extrabold text-slate-900">
                        ₹{resource.dailyRate}
                      </span>

                      <span className="text-xs font-semibold text-slate-500">
                        / day
                      </span>

                    </div>

                    <div className="border-t border-amber-200 mt-4 pt-4 space-y-2">

                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">
                          Copy Condition
                        </span>

                        <span className="font-semibold text-slate-800">
                          {resource.condition || 'Good'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold mt-3">

                        <span className={`w-2 h-2 rounded-full ${
                          resource.isAvailableForRent
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                        }`} />

                        <span className={
                          resource.isAvailableForRent
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }>
                          {resource.isAvailableForRent
                            ? 'Available for Pickup'
                            : 'Currently Checked Out'}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Rental Booking Form */}
                  {!isOwner && resource.isAvailableForRent && (

                    <form
                      onSubmit={handleRequestRental}
                      className="space-y-4"
                    >

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          Request a Rental
                        </h3>

                        <p className="text-[11px] text-slate-400 mt-1">
                          Select your preferred rental dates.
                        </p>
                      </div>

                      <div>

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                          <CalendarDays size={14} className="text-indigo-500" />
                          Start Date
                        </label>

                        <input
                          type="date"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAFBFF] text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />

                      </div>

                      <div>

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                          <CalendarDays size={14} className="text-indigo-500" />
                          Return Date
                        </label>

                        <input
                          type="date"
                          required
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAFBFF] text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />

                      </div>

                      <div>

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                          <MessageSquare size={14} className="text-indigo-500" />
                          Pickup Note
                          <span className="text-slate-400 font-normal">
                            (Optional)
                          </span>
                        </label>

                        <textarea
                          rows={3}
                          value={rentalMessage}
                          onChange={(e) => setRentalMessage(e.target.value)}
                          placeholder="Suggest campus library or hostel gate meetup..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAFBFF] text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-y"
                        />

                      </div>

                      {/* Estimated Total */}
                      {rentalDays > 0 && (
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">

                          <div className="flex justify-between items-center text-xs text-slate-600">
                            <span>
                              {rentalDays} days × ₹{resource.dailyRate}/day
                            </span>

                            <span className="font-extrabold text-xl text-indigo-950">
                              ₹{estimatedTotal}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 mt-2">
                            Estimated rental amount
                          </p>

                        </div>
                      )}

                      {/* Feedback */}
                      {rentalFeedback.text && (
                        <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                          rentalFeedback.type === 'error'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>

                          {rentalFeedback.type === 'error'
                            ? <AlertCircle size={15} className="shrink-0" />
                            : <CheckCircle2 size={15} className="shrink-0" />
                          }

                          <span>{rentalFeedback.text}</span>

                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#111C46] text-white text-sm font-bold hover:bg-indigo-800 shadow-md shadow-indigo-950/10 transition-all"
                      >
                        <BookCopy size={17} />
                        Request Physical Rental
                        <ArrowUpRight size={15} />
                      </button>

                      <div className="flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed">
                        <ShieldCheck size={14} className="shrink-0 text-emerald-500" />

                        Offline/cash settlement upon physical handover confirmation.
                      </div>

                    </form>

                  )}

                  {isOwner && (
                    <div className="p-4 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-medium">
                      This is your resource. You cannot request a rental from your own listing.
                    </div>
                  )}

                  {!isOwner && !resource.isAvailableForRent && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      This physical copy is currently unavailable for rental.
                    </div>
                  )}

                </>

              )}

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}
