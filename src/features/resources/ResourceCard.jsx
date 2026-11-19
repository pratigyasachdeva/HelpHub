import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookCopy, Download, Star, Eye } from 'lucide-react';

export default function ResourceCard({ resource }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-950 text-xs font-semibold">
            {resource.category}
          </span>
          <div className="flex items-center gap-1.5">
            {resource.hasSoftCopy && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                <FileText className="w-3 h-3" /> PDF
              </span>
            )}
            {resource.hasHardCopy && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-medium">
                <BookCopy className="w-3 h-3" /> ₹{resource.dailyRate}/day
              </span>
            )}
          </div>
        </div>

        <Link
          to={`/dashboard/resources/${resource.id}`}
          className="font-bold text-slate-900 text-base hover:text-indigo-900 line-clamp-2"
        >
          {resource.title}
        </Link>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Subject: {resource.subject} • {resource.pageCount} pages
        </p>
        <p className="text-sm text-slate-600 mt-2.5 line-clamp-2">{resource.description}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {resource.avgRating > 0 ? resource.avgRating.toFixed(1) : 'New'} ({resource.reviewCount || 0})
          </span>
          <span className="inline-flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> {resource.totalDownloads || 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {resource.viewsCount || 0}
          </span>
        </div>

        <Link
          to={`/dashboard/resources/${resource.id}`}
          className="font-semibold text-indigo-950 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
