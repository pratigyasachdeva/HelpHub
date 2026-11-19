import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, BookCopy, AlertCircle } from 'lucide-react';
import { useAuth } from '../authentication/AuthContext';
import { createResource } from '../../services/resourceService';
import { RESOURCE_CATEGORIES, RENTAL_PRICE_SLABS, getRecommendedDailyRate } from '../../utils/pricingAndDates';

export default function UploadResourcePage() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [pageCount, setPageCount] = useState(60);

  const [hasSoftCopy, setHasSoftCopy] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);

  const [hasHardCopy, setHasHardCopy] = useState(false);
  const [condition, setCondition] = useState('Like New — Spiral Bound');
  const [dailyRate, setDailyRate] = useState(4);
  const [isAvailableForRent, setIsAvailableForRent] = useState(true);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const recommendedRate = getRecommendedDailyRate(pageCount);

  const handlePageCountChange = (val) => {
    const num = Number(val);
    setPageCount(num);
    setDailyRate(getRecommendedDailyRate(num));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!hasSoftCopy && !hasHardCopy) {
      setError('Select at least one format: Soft Copy (PDF) or Hard Copy (Physical Rental).');
      return;
    }
    if (hasSoftCopy && !pdfFile) {
      setError('Please upload a PDF document for Soft Copy sharing.');
      return;
    }
    setSubmitting(true);
    try {
      const id = await createResource(
        {
          title,
          subject,
          category,
          description,
          keywords,
          pageCount,
          hasSoftCopy,
          hasHardCopy,
          condition,
          dailyRate,
          isAvailableForRent,
        },
        pdfFile,
        userProfile
      );
      navigate(`/dashboard/resources/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to publish resource.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Share Educational Resource</h1>
        <p className="text-sm text-slate-600">
          Upload digital PDF notes, list physical notes for ₹3–₹10/day rental, or offer both.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Resource Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Operating Systems Complete Unit 1–5 Handwritten Notes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject / Course Code</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Operating Systems (CS-302)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
            >
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Total Page Count</label>
            <input
              type="number"
              min={1}
              max={2000}
              required
              value={pageCount}
              onChange={(e) => handlePageCountChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Keywords (comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="deadlocks, scheduling, memory, exam"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summarize covered chapters, diagrams, solved PYQs, etc."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>

        {/* Soft Copy Section */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <FileText className="w-4 h-4 text-emerald-600" /> Offer Soft Copy (Digital PDF Download)
            </span>
            <input
              type="checkbox"
              checked={hasSoftCopy}
              onChange={(e) => setHasSoftCopy(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-950"
            />
          </label>

          {hasSoftCopy && (
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-950 file:text-white hover:file:bg-indigo-900"
              />
              <p className="text-xs text-slate-500 mt-1">PDF only, maximum size 25 MB.</p>
            </div>
          )}
        </div>

        {/* Hard Copy Rental Section */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <BookCopy className="w-4 h-4 text-amber-600" /> Offer Hard Copy (Physical Notes Rental)
            </span>
            <input
              type="checkbox"
              checked={hasHardCopy}
              onChange={(e) => setHasHardCopy(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-950"
            />
          </label>

          {hasHardCopy && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Daily Rental Price (₹3 to ₹10/day)
                  </label>
                  <select
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((rate) => (
                      <option key={rate} value={rate}>
                        ₹{rate} / day {rate === recommendedRate ? '(Recommended for page count)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Condition</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="Spiral bound, clean pages, highlighted"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-800 mb-1">Recommended Page-Count Pricing Slabs:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {RENTAL_PRICE_SLABS.map((s) => (
                    <span
                      key={s.label}
                      className={`px-2 py-1 rounded ${
                        s.rate === recommendedRate ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'bg-slate-50'
                      }`}
                    >
                      {s.label}: ₹{s.rate}
                    </span>
                  ))}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isAvailableForRent}
                  onChange={(e) => setIsAvailableForRent(e.target.checked)}
                />
                Mark physical copy as immediately available for rental requests
              </label>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900 disabled:opacity-60"
        >
          <UploadCloud className="w-4 h-4" />
          {submitting ? 'Publishing Resource...' : 'Publish Resource'}
        </button>
      </form>
    </div>
  );
}
