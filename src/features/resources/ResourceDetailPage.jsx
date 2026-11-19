import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import {
  Download,
  FileText,
  BookCopy,
  ThumbsUp,
  Flag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { db } from '../../firebase/config';
import { useAuth } from '../authentication/AuthContext';
import {
  recordUniqueResourceView,
  recordPdfDownload,
  hasUserDownloadedResource,
  submitVerifiedReview,
} from '../../services/resourceService';
import { submitRentalRequest } from '../../services/rentalService';
import { submitReport } from '../../services/adminService';
import { getResourcePdfUrl } from '../../services/fileStorageService';
import { calculateRentalDays, formatTimestamp } from '../../utils/pricingAndDates';
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
  const [rentalFeedback, setRentalFeedback] = useState({ type: '', text: '' });

  // Verified review form
  const [rating, setRating] = useState(5);
  const [helpful, setHelpful] = useState(true);
  const [comment, setComment] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState({ type: '', text: '' });

  // Report modal/box
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const unsubRes = onSnapshot(doc(db, 'resources', id), (snap) => {
      if (snap.exists()) setResource({ id: snap.id, ...snap.data() });
    });

    const revQ = query(collection(db, 'reviews'), where('resourceId', '==', id));
    const unsubRev = onSnapshot(revQ, (snap) => {
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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

  useEffect(() => {
    let active = true;
    if (resource?.filePath) {
      getResourcePdfUrl(resource.filePath).then((url) => {
        if (active) setPdfPreviewUrl(url);
      }).catch(() => {
        if (active) setPdfPreviewUrl('');
      });
    } else {
      setPdfPreviewUrl(resource?.fileUrl || '');
    }
    return () => { active = false; };
  }, [resource?.filePath, resource?.fileUrl]);

  if (!resource) {
    return <p className="text-sm text-slate-500">Loading resource details...</p>;
  }

  const isOwner = resource.ownerId === userProfile?.uid;
  const rentalDays = calculateRentalDays(startDate, endDate);
  const estimatedTotal = rentalDays * (resource.dailyRate || 0);

  const handleDownloadPdf = async () => {
    let downloadTab = null;
    if (resource.filePath) downloadTab = window.open('about:blank', '_blank');
    try {
      const url = resource.filePath
        ? await getResourcePdfUrl(resource.filePath)
        : resource.fileUrl;
      if (!url) throw new Error('PDF link is not ready yet. Please try again in a moment.');
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

  const handleRequestRental = async (e) => {
    e.preventDefault();
    setRentalFeedback({ type: '', text: '' });
    try {
      await submitRentalRequest({
        resource,
        renter: userProfile,
        startDate,
        endDate,
        message: rentalMessage,
      });
      setRentalFeedback({ type: 'success', text: 'Rental request sent to owner! Track status under Rentals.' });
      setRentalMessage('');
    } catch (err) {
      setRentalFeedback({ type: 'error', text: err.message });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewFeedback({ type: '', text: '' });
    try {
      await submitVerifiedReview({
        targetType: 'resource',
        targetId: resource.id,
        reviewerId: userProfile.uid,
        reviewerName: userProfile.name,
        rating,
        helpful,
        comment,
        resourceIdForAggregate: resource.id,
      });
      setReviewFeedback({ type: 'success', text: 'Thank you! Your verified review has been published.' });
      setComment('');
    } catch (err) {
      setReviewFeedback({ type: 'error', text: err.message });
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    await submitReport({
      targetType: 'resource',
      targetId: resource.id,
      targetTitle: resource.title,
      reason: reportReason,
      reporter: userProfile,
    });
    setShowReport(false);
    setReportReason('');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metadata & PDF Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-950 text-xs font-semibold">
                  {resource.category}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-2">{resource.title}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Subject: <strong className="text-slate-700">{resource.subject}</strong> • {resource.pageCount} pages • Shared by {resource.ownerName}
                </p>
              </div>
              <button
                onClick={() => setShowReport(!showReport)}
                className="text-xs text-slate-500 hover:text-rose-600 inline-flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" /> Report
              </button>
            </div>

            {showReport && (
              <form onSubmit={handleReport} className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <p className="text-xs font-semibold text-rose-900">Report inappropriate or copyrighted listing</p>
                <input
                  type="text"
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full px-3 py-1.5 rounded-lg border border-rose-300 text-xs bg-white"
                />
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold">
                  Submit Report to Admins
                </button>
              </form>
            )}

            <p className="text-sm text-slate-700 leading-relaxed">{resource.description}</p>

            {/* Popularity Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Rating</p>
                <p className="font-bold text-slate-900">{resource.avgRating ? `${resource.avgRating} ★` : 'No ratings'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Helpful</p>
                <p className="font-bold text-emerald-700">{resource.helpfulPercentage || 0}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Downloads (Unique)</p>
                <p className="font-bold text-slate-900">
                  {resource.totalDownloads || 0} ({resource.uniqueDownloadersCount || 0})
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Views / Rentals</p>
                <p className="font-bold text-slate-900">
                  {resource.viewsCount || 0} / {resource.completedRentalsCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Soft Copy PDF Preview & Download */}
          {resource.hasSoftCopy && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h2 className="font-bold text-slate-900">Digital PDF Soft Copy</h2>
                    <p className="text-xs text-slate-500">{resource.fileName || 'Document.pdf'}</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>

              {pdfPreviewUrl && (
                <iframe
                  src={`${pdfPreviewUrl}#toolbar=0`}
                  title="PDF Preview"
                  className="w-full h-80 rounded-xl border border-slate-200"
                />
              )}
            </div>
          )}

          {/* Verified Reviews Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">
              Verified Reviews ({reviews.length})
            </h2>

            {canRatePdf && !isOwner && (
              <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase">
                  Rate this PDF (Verified Downloader)
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <StarRating rating={rating} size={20} interactive onChange={setRating} />
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setHelpful(true)}
                      className={`px-3 py-1 rounded-lg font-medium border ${
                        helpful ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3 inline mr-1" /> Helpful
                    </button>
                    <button
                      type="button"
                      onClick={() => setHelpful(false)}
                      className={`px-3 py-1 rounded-lg font-medium border ${
                        !helpful ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700'
                      }`}
                    >
                      Not Helpful
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Optional written review on clarity, completeness, and handwriting..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                />
                {reviewFeedback.text && (
                  <p className={`text-xs ${reviewFeedback.type === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {reviewFeedback.text}
                  </p>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-950 text-white text-xs font-semibold"
                >
                  Submit Rating
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">No reviews yet. Download the PDF or complete a rental to review.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-900">{rev.reviewerName}</span>
                      <StarRating rating={rev.rating} size={14} />
                    </div>
                    {rev.comment && <p className="text-sm text-slate-600 mt-1.5">{rev.comment}</p>}
                    <p className="text-xs text-slate-400 mt-1">
                      {rev.helpful ? 'Marked Helpful' : 'Marked Not Helpful'} • {formatTimestamp(rev.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Hard Copy Rental Booking Card */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-4">
            <div className="flex items-center gap-2 text-indigo-950">
              <BookCopy className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-lg">Physical Copy Rental</h2>
            </div>

            {!resource.hasHardCopy ? (
              <p className="text-sm text-slate-500">
                This resource is shared as a digital PDF only. No physical copy is listed for rental.
              </p>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-slate-900">₹{resource.dailyRate}</span>
                    <span className="text-xs font-semibold text-slate-600">per day</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Condition: {resource.condition || 'Good'}</p>
                  <p className="text-xs font-semibold mt-1 text-emerald-700">
                    {resource.isAvailableForRent ? '● Available for Pickup' : '● Currently Checked Out'}
                  </p>
                </div>

                {!isOwner && resource.isAvailableForRent && (
                  <form onSubmit={handleRequestRental} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Return Date</label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Note (Optional)</label>
                      <textarea
                        rows={2}
                        value={rentalMessage}
                        onChange={(e) => setRentalMessage(e.target.value)}
                        placeholder="Suggest campus library or hostel gate meetup..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    {rentalDays > 0 && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          {rentalDays} days × ₹{resource.dailyRate}/day
                        </span>
                        <span className="font-bold text-slate-900">₹{estimatedTotal}</span>
                      </div>
                    )}

                    {rentalFeedback.text && (
                      <div
                        className={`p-2.5 rounded-xl text-xs flex items-start gap-1.5 ${
                          rentalFeedback.type === 'error'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {rentalFeedback.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        )}
                        <span>{rentalFeedback.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900"
                    >
                      Request Physical Rental
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      Offline/cash settlement upon physical handover confirmation.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
