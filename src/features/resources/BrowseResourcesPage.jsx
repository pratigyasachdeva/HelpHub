
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Sparkles,
  ArrowUpDown,
  Library,
  FileText,
  BookCopy,
  RotateCcw,
  Inbox,
  CheckCircle2,
  Filter
} from 'lucide-react';

import { subscribeApprovedResources } from '../../services/resourceService';
import { RESOURCE_CATEGORIES } from '../../utils/pricingAndDates';
import ResourceCard from './ResourceCard';

export default function BrowseResourcesPage() {
  const [searchParams] = useSearchParams();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [queryText, setQueryText] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [onlyAvailableRent, setOnlyAvailableRent] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const unsub = subscribeApprovedResources((data) => {
      setResources(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return resources
      .filter((r) => {
        if (category !== 'All' && r.category !== category) return false;
        if (formatFilter === 'soft' && !r.hasSoftCopy) return false;
        if (formatFilter === 'hard' && !r.hasHardCopy) return false;
        if (formatFilter === 'both' && !(r.hasSoftCopy && r.hasHardCopy)) return false;

        if (onlyAvailableRent && !(r.hasHardCopy && r.isAvailableForRent)) {
          return false;
        }

        if (queryText.trim()) {
          const q = queryText.toLowerCase();

          const inTitle = r.title?.toLowerCase().includes(q);
          const inSubject = r.subject?.toLowerCase().includes(q);
          const inCat = r.category?.toLowerCase().includes(q);
          const inKeys = (r.keywords || []).some((k) => k.includes(q));

          return inTitle || inSubject || inCat || inKeys;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.avgRating || 0) - (a.avgRating || 0);
        }

        if (sortBy === 'downloads') {
          return (b.totalDownloads || 0) - (a.totalDownloads || 0);
        }

        if (sortBy === 'priceLow') {
          return (a.dailyRate || 999) - (b.dailyRate || 999);
        }

        return 0;
      });
  }, [
    resources,
    category,
    formatFilter,
    onlyAvailableRent,
    queryText,
    sortBy
  ]);

  const formatOptions = [
    { id: 'All', label: 'All Formats', icon: Library },
    { id: 'soft', label: 'PDF / Soft Copy', icon: FileText },
    { id: 'hard', label: 'Physical Copy', icon: BookCopy },
    { id: 'both', label: 'Both Available', icon: CheckCircle2 }
  ];

  const hasActiveFilters =
    queryText.trim() !== '' ||
    category !== 'All' ||
    formatFilter !== 'All' ||
    onlyAvailableRent ||
    sortBy !== 'newest';

  const clearFilters = () => {
    setQueryText('');
    setCategory('All');
    setFormatFilter('All');
    setOnlyAvailableRent(false);
    setSortBy('newest');
  };

  return (
    <div className="space-y-8 pb-10">

      {/* ================= PAGE HEADER ================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#192B61] to-[#30458C] p-7 sm:p-9 shadow-lg shadow-indigo-950/10">

        <div className="absolute -top-24 -right-10 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-widest mb-5">
            <Sparkles size={13} />
            EXPLORE THE COMMUNITY LIBRARY
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Discover Resources.
                <br />
                <span className="text-blue-300">
                  Learn Together.
                </span>
              </h1>

              <p className="text-sm text-blue-100/75 mt-4 max-w-xl leading-relaxed">
                Search verified PDF downloads or request affordable
                physical study notes from ₹3–₹10/day.
                Your next learning resource is just a search away.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm shrink-0">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-blue-200">
                <Library size={23} />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {resources.length}
                </p>
                <p className="text-[10px] text-blue-200 font-medium">
                  Available Resources
                </p>
              </div>
            </div>

          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-3xl">

            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-xl shadow-black/10">

              <div className="relative flex-1">

                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Search by title, subject, category or keyword..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />

              </div>

              <div className="hidden sm:flex items-center px-4 text-[10px] text-slate-400 border-l border-slate-100">
                <span className="whitespace-nowrap">
                  Search the library
                </span>
              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-4 mt-5 text-[11px] text-blue-100/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Verified resources
            </span>

            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-blue-300" />
              Free PDF access
            </span>

            <span className="flex items-center gap-1.5">
              <BookCopy size={14} className="text-violet-300" />
              Affordable rentals
            </span>
          </div>

        </div>
      </section>

      {/* ================= FILTER SECTION ================= */}
      <section className="bg-white rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden">

        {/* Filter Header */}
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <SlidersHorizontal size={19} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Refine Your Search
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Find exactly what you're looking for
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-900 transition-colors"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          )}

        </div>

        <div className="p-5 sm:p-6 space-y-6">

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2.5">
                <Library size={14} className="text-indigo-500" />
                Subject Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAFBFF] text-sm text-slate-700 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
              >
                <option value="All">All Categories</option>

                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2.5">
                <ArrowUpDown size={14} className="text-indigo-500" />
                Sort Resources
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAFBFF] text-sm text-slate-700 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="downloads">Most Downloaded</option>
                <option value="priceLow">Lowest Daily Rent</option>
              </select>
            </div>

          </div>

          {/* Format Filters */}
          <div className="pt-5 border-t border-slate-100">

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3">
              <Filter size={14} className="text-indigo-500" />
              Resource Format
            </label>

            <div className="flex flex-wrap gap-2">

              {formatOptions.map((item) => {
                const Icon = item.icon;
                const active = formatFilter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormatFilter(item.id)}
                    className={`
                      inline-flex items-center gap-2
                      px-4 py-2.5 rounded-xl
                      text-xs font-semibold
                      border transition-all duration-200
                      ${
                        active
                          ? 'bg-indigo-950 text-white border-indigo-950 shadow-md shadow-indigo-950/10'
                          : 'bg-[#FAFBFF] text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                      }
                    `}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}

            </div>

          </div>

          {/* Availability Toggle */}
          <div className="pt-5 border-t border-slate-100">

            <label className="flex items-center justify-between gap-4 cursor-pointer">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <BookCopy size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Available for Physical Rent
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Show only resources currently available for rental
                  </p>
                </div>

              </div>

              <input
                type="checkbox"
                checked={onlyAvailableRent}
                onChange={(e) => setOnlyAvailableRent(e.target.checked)}
                className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 shrink-0"
              />

            </label>

          </div>

        </div>
      </section>

      {/* ================= RESULTS HEADER ================= */}
      <section>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen size={17} />
              </div>

              <span className="text-[10px] font-bold tracking-[0.18em] text-indigo-600 uppercase">
                COMMUNITY COLLECTION
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {queryText.trim()
                ? 'Search Results'
                : 'Explore Study Resources'}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {loading
                ? 'Fetching the latest resources...'
                : `${filtered.length} resource${filtered.length === 1 ? '' : 's'} found`}
            </p>
          </div>

          {!loading && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live community library
            </div>
          )}

        </div>

        {/* Active Filters */}
        {hasActiveFilters && !loading && (
          <div className="flex flex-wrap items-center gap-2 mb-5">

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active filters:
            </span>

            {queryText.trim() && (
              <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                Search: {queryText}
              </span>
            )}

            {category !== 'All' && (
              <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                {category}
              </span>
            )}

            {formatFilter !== 'All' && (
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">
                {formatOptions.find((f) => f.id === formatFilter)?.label}
              </span>
            )}

            {onlyAvailableRent && (
              <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                Available for Rent
              </span>
            )}

          </div>
        )}

        {/* Loading State */}
        {loading ? (

          <div className="bg-white rounded-[24px] border border-slate-200 p-14 text-center">

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
              <div className="w-6 h-6 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>

            <h3 className="font-bold text-slate-900">
              Loading the library
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              Fetching available resources from the community...
            </p>

          </div>

        ) : filtered.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-[24px] border border-slate-200 p-10 sm:p-16 text-center shadow-sm">

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Inbox size={31} strokeWidth={1.6} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-6">
              No matching resources found
            </h3>

            <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              We couldn't find any resources matching your current
              search and filters. Try adjusting your preferences
              or explore a different subject.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-800 transition-all"
            >
              <RotateCcw size={16} />
              Clear All Filters
            </button>

          </div>

        ) : (

          /* Resource Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">

            {filtered.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
              />
            ))}

          </div>

        )}

      </section>

    </div>
  );
}
