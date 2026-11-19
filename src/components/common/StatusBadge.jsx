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

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {status}
    </span>
  );
}
