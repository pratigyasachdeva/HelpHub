import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
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
        if (onlyAvailableRent && !(r.hasHardCopy && r.isAvailableForRent)) return false;

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
        if (sortBy === 'rating') return (b.avgRating || 0) - (a.avgRating || 0);
        if (sortBy === 'downloads') return (b.totalDownloads || 0) - (a.totalDownloads || 0);
        if (sortBy === 'priceLow') return (a.dailyRate || 999) - (b.dailyRate || 999);
        return 0;
      });
  }, [resources, category, formatFilter, onlyAvailableRent, queryText, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Browse Study Notes & Physical Copies</h1>
        <p className="text-sm text-slate-600">
          Search verified PDF downloads or request hard-copy notes for ₹3–₹10/day.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search by title, subject, category, or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
          >
            <option value="All">All Categories</option>
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="downloads">Sort: Most Downloaded</option>
            <option value="priceLow">Sort: Lowest Daily Rent</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {[
              { id: 'All', label: 'All Formats' },
              { id: 'soft', label: 'Soft Copy (PDF)' },
              { id: 'hard', label: 'Hard Copy (Rent)' },
              { id: 'both', label: 'Both Available' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFormatFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  formatFilter === item.id
                    ? 'bg-indigo-950 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailableRent}
              onChange={(e) => setOnlyAvailableRent(e.target.checked)}
              className="rounded border-slate-300 text-indigo-950"
            />
            Available for Physical Rent Now
          </label>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading resources from Firestore...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="font-semibold text-slate-900">No matching resources found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or upload the first note in this subject.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
}
