import React, { useEffect, useState } from 'react';
import { HandHelping, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../authentication/AuthContext';
import {
  subscribeHelpRequests,
  subscribeHelpOffers,
  createHelpRequest,
  submitHelpOffer,
  respondToHelpOffer,
  markHelpRequestCompleted,
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
    await createHelpRequest({ title, subject, category, description }, userProfile);
    setTitle('');
    setSubject('');
    setDescription('');
  };

  const handleOfferHelp = async (req) => {
    const msg = offerDrafts[req.id];
    if (!msg?.trim()) return;
    await submitHelpOffer({ request: req, helper: userProfile, message: msg });
    setOfferDrafts({ ...offerDrafts, [req.id]: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Community Help & Peer Assistance</h1>
        <p className="text-sm text-slate-600">
          Post study doubts, project blockers, or resource requests and connect with peers ready to help.
        </p>
      </div>

      {/* Post Request Form */}
      <form onSubmit={handleCreateRequest} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <HandHelping className="w-5 h-5 text-emerald-600" /> Post a Help Request
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need help with?"
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject / Topic"
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
          >
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <textarea
          rows={2}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add context, deadline, or preferred format (online call, notes, lab walkthrough)..."
          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900"
        >
          Publish Help Request
        </button>
      </form>

      {/* Active Board */}
      <div className="space-y-4">
        {requests.map((req) => {
          const reqOffers = offers.filter((o) => o.requestId === req.id);
          const isAuthor = req.authorId === userProfile?.uid;

          return (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {req.category} • {req.subject}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-2">{req.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{req.description}</p>
                  <p className="text-xs text-slate-400 mt-2">Requested by {req.authorName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} />
                  {isAuthor && req.status === 'Accepted' && (
                    <button
                      onClick={() => markHelpRequestCompleted(req)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}
                </div>
              </div>

              {/* Offers List */}
              {reqOffers.length > 0 && (
                <div className="pl-4 border-l-2 border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Offers ({reqOffers.length})</p>
                  {reqOffers.map((offer) => (
                    <div key={offer.id} className="p-3 rounded-xl bg-slate-50 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{offer.helperName}</p>
                        <p className="text-sm text-slate-600">{offer.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={offer.status} />
                        {isAuthor && offer.status === 'Pending' && req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => respondToHelpOffer({ request: req, offer, decision: 'Accepted' })}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => respondToHelpOffer({ request: req, offer, decision: 'Rejected' })}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Offer Assistance Input */}
              {!isAuthor && req.status === 'Pending' && (
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={offerDrafts[req.id] || ''}
                    onChange={(e) => setOfferDrafts({ ...offerDrafts, [req.id]: e.target.value })}
                    placeholder="Write how you can assist..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <button
                    onClick={() => handleOfferHelp(req)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                  >
                    <Send className="w-3.5 h-3.5" /> Offer Help
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
