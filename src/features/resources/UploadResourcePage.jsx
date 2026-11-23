
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  BookCopy,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Tag,
  File,
  IndianRupee,
  Sparkles,
  Info,
  X,
  ShieldCheck,
  Layers,
  ArrowUpRight
} from 'lucide-react';

import { useAuth } from '../authentication/AuthContext';
import { createResource } from '../../services/resourceService';

import {
  RESOURCE_CATEGORIES,
  RENTAL_PRICE_SLABS,
  getRecommendedDailyRate
} from '../../utils/pricingAndDates';

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
      setError(
        'Select at least one format: Soft Copy (PDF) or Hard Copy (Physical Rental).'
      );
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
          isAvailableForRent
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

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50';

  const labelClass =
    'block text-xs font-bold text-slate-700 mb-2';

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-10">

      {/* ================= PAGE HEADER ================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#1B2C64] to-[#344B91] p-7 sm:p-9">

        <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute right-20 -bottom-36 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles size={13} />
              Community Contribution
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-4">
              Share Your Knowledge
            </h1>

            <p className="text-sm text-blue-100/75 mt-3 leading-relaxed">
              Upload your study materials and help fellow students learn better.
              Share digital PDFs, rent out physical notes, or offer both.
            </p>

          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <UploadCloud size={34} className="text-blue-100" />
          </div>

        </div>

        <div className="relative flex flex-wrap gap-3 mt-7">

          <div className="flex items-center gap-2 text-[11px] text-blue-100/80">
            <ShieldCheck size={14} />
            Student Community
          </div>

          <div className="w-px h-4 bg-white/20" />

          <div className="flex items-center gap-2 text-[11px] text-blue-100/80">
            <FileText size={14} />
            PDF Sharing
          </div>

          <div className="w-px h-4 bg-white/20" />

          <div className="flex items-center gap-2 text-[11px] text-blue-100/80">
            <BookCopy size={14} />
            Physical Rentals
          </div>

        </div>

      </section>

      {/* ================= ERROR MESSAGE ================= */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">

          <AlertCircle size={19} className="shrink-0 mt-0.5" />

          <div className="flex-1">
            <p className="text-sm font-bold">
              Unable to publish resource
            </p>

            <p className="text-xs mt-1 leading-relaxed">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError('')}
            className="text-rose-400 hover:text-rose-700"
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>

        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ================= RESOURCE INFORMATION ================= */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Resource Information
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Tell students what you're sharing.
              </p>
            </div>

          </div>

          <div className="p-6 space-y-5">

            {/* Resource Title */}
            <div>
              <label className={labelClass}>
                Resource Title <span className="text-rose-500">*</span>
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Operating Systems Complete Unit 1–5 Handwritten Notes"
                className={inputClass}
              />
            </div>

            {/* Subject and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>
                  Subject / Course Code <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Operating Systems (CS-302)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Resource Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  {RESOURCE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Page Count and Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>
                  Total Page Count <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={2000}
                    required
                    value={pageCount}
                    onChange={(e) => handlePageCountChange(e.target.value)}
                    className={inputClass}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    Pages
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Keywords
                  <span className="font-normal text-slate-400 ml-1">
                    (Comma-separated)
                  </span>
                </label>

                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="deadlocks, scheduling, memory"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                Description <span className="text-rose-500">*</span>
              </label>

              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize covered chapters, diagrams, solved PYQs, important topics, etc."
                className={`${inputClass} resize-y`}
              />

              <p className="text-[11px] text-slate-400 mt-2">
                A clear description helps other students decide whether this resource is useful.
              </p>
            </div>

          </div>

        </section>

        {/* ================= FORMAT SELECTION ================= */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <Layers size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Choose Sharing Format
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Select how students can access your resource.
              </p>
            </div>

          </div>

          <div className="p-6 space-y-5">

            {/* ================= SOFT COPY ================= */}
            <div className={`rounded-2xl border-2 transition-all ${
              hasSoftCopy
                ? 'border-emerald-200 bg-emerald-50/30'
                : 'border-slate-200 bg-white'
            }`}>

              <label className="flex items-center justify-between gap-4 p-5 cursor-pointer">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Digital PDF Copy
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Allow students to download your PDF.
                    </p>
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={hasSoftCopy}
                  onChange={(e) => setHasSoftCopy(e.target.checked)}
                  className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                />

              </label>

              {hasSoftCopy && (
                <div className="px-5 pb-5">

                  <label className="block cursor-pointer">

                    <div className={`rounded-2xl border-2 border-dashed p-7 text-center transition-all ${
                      pdfFile
                        ? 'border-emerald-300 bg-emerald-50/60'
                        : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                    }`}>

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto ${
                        pdfFile
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {pdfFile
                          ? <CheckCircle2 size={25} />
                          : <UploadCloud size={25} />
                        }
                      </div>

                      {pdfFile ? (
                        <>
                          <p className="text-sm font-bold text-emerald-800 mt-4">
                            PDF Selected
                          </p>

                          <p className="text-xs text-slate-600 mt-1 break-all">
                            {pdfFile.name}
                          </p>

                          <p className="text-[11px] text-emerald-700 mt-2">
                            Click to choose another file
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-slate-800 mt-4">
                            Upload Your PDF Document
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Click here to browse files on your device
                          </p>

                          <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-indigo-950 text-white text-xs font-bold">
                            <UploadCloud size={14} />
                            Choose PDF
                          </span>
                        </>
                      )}

                    </div>

                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="sr-only"
                    />

                  </label>

                  <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
                    <Info size={14} className="text-indigo-500 shrink-0" />
                    PDF only, maximum size 25 MB.
                  </div>

                </div>
              )}

            </div>

            {/* ================= HARD COPY ================= */}
            <div className={`rounded-2xl border-2 transition-all ${
              hasHardCopy
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-slate-200 bg-white'
            }`}>

              <label className="flex items-center justify-between gap-4 p-5 cursor-pointer">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <BookCopy size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Physical Notes Copy
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      List your printed or handwritten notes for rental.
                    </p>
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={hasHardCopy}
                  onChange={(e) => setHasHardCopy(e.target.checked)}
                  className="w-5 h-5 rounded accent-amber-600 cursor-pointer"
                />

              </label>

              {hasHardCopy && (
                <div className="px-5 pb-5 pt-1 space-y-5 border-t border-amber-100">

                  {/* Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">

                    <div>
                      <label className={labelClass}>
                        Daily Rental Price
                      </label>

                      <div className="relative">

                        <IndianRupee
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                          value={dailyRate}
                          onChange={(e) => setDailyRate(Number(e.target.value))}
                          className={`${inputClass} pl-10`}
                        >
                          {[3, 4, 5, 6, 7, 8, 9, 10].map((rate) => (
                            <option key={rate} value={rate}>
                              ₹{rate} / day {rate === recommendedRate
                                ? '(Recommended for page count)'
                                : ''}
                            </option>
                          ))}
                        </select>

                      </div>

                      <p className="text-[10px] text-slate-400 mt-2">
                        Rental range: ₹3–₹10 per day.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Physical Condition
                      </label>

                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        placeholder="Spiral bound, clean pages, highlighted"
                        className={inputClass}
                      />
                    </div>

                  </div>

                  {/* Recommended Pricing */}
                  <div className="rounded-2xl bg-white border border-amber-200 p-5">

                    <div className="flex items-center justify-between gap-3 mb-4">

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Recommended Pricing
                        </p>

                        <p className="text-[11px] text-slate-500 mt-1">
                          Based on the total number of pages.
                        </p>
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                        ₹{recommendedRate}/day
                      </div>

                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                      {RENTAL_PRICE_SLABS.map((s) => (

                        <div
                          key={s.label}
                          className={`p-3 rounded-xl text-center border ${
                            s.rate === recommendedRate
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >

                          <p className="text-[10px] font-semibold">
                            {s.label}
                          </p>

                          <p className="text-sm font-extrabold mt-1">
                            ₹{s.rate}
                          </p>

                          {s.rate === recommendedRate && (
                            <p className="text-[9px] font-bold mt-1">
                              Recommended
                            </p>
                          )}

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* Availability */}
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={isAvailableForRent}
                      onChange={(e) => setIsAvailableForRent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-emerald-600"
                    />

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Available for Rental Requests
                      </p>

                      <p className="text-[11px] text-slate-500 mt-1">
                        Mark this physical copy as immediately available for students.
                      </p>
                    </div>

                  </label>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* ================= PUBLISH SECTION ================= */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Ready to Share?
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Review your details before publishing your resource to HelpHub.
                </p>
              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-950 text-white text-sm font-bold hover:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-950/10 transition-all"
            >
              <UploadCloud size={17} />

              {submitting
                ? 'Publishing Resource...'
                : 'Publish Resource'
              }

              {!submitting && <ArrowUpRight size={16} />}
            </button>

          </div>

          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 text-[10px] text-slate-400">
            <ShieldCheck size={13} className="text-emerald-600" />
            Your contribution helps make learning resources more accessible.
          </div>

        </section>

      </form>

    </div>
  );
}
