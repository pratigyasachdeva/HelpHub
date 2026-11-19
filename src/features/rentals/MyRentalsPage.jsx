import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../authentication/AuthContext';
import { subscribeRentalsByRole, updateRentalStatus } from '../../services/rentalService';
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
    const u1 = subscribeRentalsByRole(userProfile.uid, 'ownerId', setIncoming, handleLoadError);
    const u2 = subscribeRentalsByRole(userProfile.uid, 'renterId', setOutgoing, handleLoadError);
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
      resourceIdForAggregate: req.resourceId,
    });
    await updateDoc(doc(db, 'rentalRequests', req.id), { reviewedByRenter: true });
  };

  const list = tab === 'incoming' ? incoming : outgoing;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Physical Notes Rentals</h1>
        <p className="text-sm text-slate-600">
          Manage incoming requests as an owner or track your borrowed hard copies from request to return.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('incoming')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            tab === 'incoming' ? 'bg-indigo-950 text-white' : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          Incoming Owner Requests ({incoming.length})
        </button>
        <button
          onClick={() => setTab('outgoing')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            tab === 'outgoing' ? 'bg-indigo-950 text-white' : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          My Borrowed Rentals ({outgoing.length})
        </button>
      </div>

      {loadError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </div>
      )}

      {!loadError && list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No rental records in this tab.
        </div>
      ) : !loadError ? (
        <div className="space-y-4">
          {list.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{req.resourceTitle}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {tab === 'incoming' ? `Renter: ${req.renterName}` : `Owner: ${req.ownerName}`} •{' '}
                    {req.startDate} to {req.endDate} ({req.days} days @ ₹{req.dailyRate}/day ={' '}
                    <strong>₹{req.totalAmount}</strong>)
                  </p>
                  {req.message && <p className="text-xs text-slate-500 mt-1">Note: "{req.message}"</p>}
                  {req.rejectionReason && (
                    <p className="text-xs text-rose-600 mt-1">Rejection Reason: {req.rejectionReason}</p>
                  )}
                </div>
                <StatusBadge status={req.status} />
              </div>

              {/* Owner Lifecycle Controls */}
              {tab === 'incoming' && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  {req.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateRentalStatus(req, 'Accepted')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                      >
                        Accept Request
                      </button>
                      <input
                        type="text"
                        placeholder="Optional rejection reason"
                        value={rejectReasons[req.id] || ''}
                        onChange={(e) => setRejectReasons({ ...rejectReasons, [req.id]: e.target.value })}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                      />
                      <button
                        onClick={() => updateRentalStatus(req, 'Rejected', rejectReasons[req.id] || '')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status === 'Accepted' && (
                    <button
                      onClick={() => updateRentalStatus(req, 'Active Rental')}
                      className="px-4 py-1.5 rounded-xl bg-indigo-950 text-white text-xs font-semibold"
                    >
                      Confirm Physical Handover → Start Active Rental
                    </button>
                  )}
                  {req.status === 'Active Rental' && (
                    <button
                      onClick={() => updateRentalStatus(req, 'Returned')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Confirm Copy Returned
                    </button>
                  )}
                </div>
              )}

              {/* Renter Cancel or Rate Completed Rental */}
              {tab === 'outgoing' && req.status === 'Pending' && (
                <div className="pt-2">
                  <button
                    onClick={() => updateRentalStatus(req, 'Cancelled')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Cancel Request
                  </button>
                </div>
              )}

              {tab === 'outgoing' && req.status === 'Returned' && !req.reviewedByRenter && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <StarRating
                    rating={reviewStars[req.id] || 5}
                    interactive
                    onChange={(val) => setReviewStars({ ...reviewStars, [req.id]: val })}
                  />
                  <input
                    type="text"
                    placeholder="Rate physical condition & handover..."
                    value={reviewText[req.id] || ''}
                    onChange={(e) => setReviewText({ ...reviewText, [req.id]: e.target.value })}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs flex-1"
                  />
                  <button
                    onClick={() => handleRateRental(req)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-950 text-white text-xs font-semibold"
                  >
                    Submit Rental Review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
