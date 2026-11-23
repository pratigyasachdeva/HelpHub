
import React from 'react';

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Accepted: 'bg-sky-50 text-sky-700 border-sky-200',
  'Active Rental': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Returned: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  deactivated: 'bg-rose-50 text-rose-700 border-rose-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  removed: 'bg-rose-50 text-rose-700 border-rose-200',
  Open: 'bg-amber-50 text-amber-700 border-amber-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_DOTS = {
  Pending: 'bg-amber-500',
  Accepted: 'bg-sky-500',
  'Active Rental': 'bg-indigo-500',
  Returned: 'bg-emerald-500',
  Completed: 'bg-emerald-500',
  Rejected: 'bg-rose-500',
  Cancelled: 'bg-slate-400',
  active: 'bg-emerald-500',
  deactivated: 'bg-rose-500',
  approved: 'bg-emerald-500',
  removed: 'bg-rose-500',
  Open: 'bg-amber-500',
  Resolved: 'bg-emerald-500',
};

export default function StatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] ||
    'bg-slate-100 text-slate-700 border-slate-200';

  const dot = STATUS_DOTS[status] || 'bg-slate-400';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1
        rounded-full
        text-[11px] font-bold tracking-wide
        border
        whitespace-nowrap
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        transition-all duration-200
        ${style}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {status}
    </span>
  );
}
