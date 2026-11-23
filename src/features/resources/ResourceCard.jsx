
import React from 'react';
import { Link } from 'react-router-dom';

import {
  FileText,
  BookCopy,
  Download,
  Star,
  Eye,
  ArrowUpRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export default function ResourceCard({ resource }) {
  return (
    <div className="group relative bg-white rounded-[24px] border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/[0.06]">

      {/* Top Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-300 opacity-70 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 sm:p-6 flex flex-col flex-1">

        {/* Category and Format */}
        <div className="flex items-start justify-between gap-3 mb-5">

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wide">
            <BookOpen size={12} />
            {resource.category}
          </span>

          <div className="flex flex-wrap justify-end gap-1.5">

            {resource.hasSoftCopy && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                <FileText size={12} />
                PDF
              </span>
            )}

            {resource.hasHardCopy && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-bold">
                <BookCopy size={12} />
                ₹{resource.dailyRate}/day
              </span>
            )}

          </div>

        </div>

        {/* Resource Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
          <FileText size={23} />
        </div>

        {/* Resource Information */}
        <div className="flex-1">

          <Link
            to={`/dashboard/resources/${resource.id}`}
            className="block text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors"
          >
            {resource.title}
          </Link>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-medium text-slate-400">

            <span className="text-slate-600">
              {resource.subject}
            </span>

            <span className="w-1 h-1 rounded-full bg-slate-300" />

            <span>
              {resource.pageCount} pages
            </span>

          </div>

          <p className="text-xs text-slate-500 mt-4 leading-relaxed line-clamp-3">
            {resource.description}
          </p>

        </div>

        {/* Availability */}
        <div className="flex flex-wrap items-center gap-2 mt-5">

          {resource.hasSoftCopy && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
              <CheckCircle2 size={13} />
              Digital Copy
            </span>
          )}

          {resource.hasHardCopy && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-700">
              <CheckCircle2 size={13} />
              Physical Copy
            </span>
          )}

        </div>

        {/* Metrics */}
        <div className="mt-5 pt-4 border-t border-slate-100">

          <div className="flex items-center justify-between gap-2">

            <div className="flex items-center gap-3 sm:gap-4">

              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                <Star
                  size={14}
                  className="fill-amber-400 text-amber-400"
                />
                {resource.avgRating > 0
                  ? resource.avgRating.toFixed(1)
                  : 'New'}
                <span className="text-slate-400 font-medium">
                  ({resource.reviewCount || 0})
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <Download size={13} />
                {resource.totalDownloads || 0}
              </span>

              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <Eye size={13} />
                {resource.viewsCount || 0}
              </span>

            </div>

          </div>

        </div>

        {/* CTA */}
        <Link
          to={`/dashboard/resources/${resource.id}`}
          className="mt-5 w-full inline-flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#111C46] text-white text-xs font-bold hover:bg-indigo-800 transition-all duration-200"
        >
          <span>Explore Resource</span>

          <ArrowUpRight
            size={16}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>

      </div>
    </div>
  );
}
