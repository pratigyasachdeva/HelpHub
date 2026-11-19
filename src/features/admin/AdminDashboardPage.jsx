import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, FileText, BookCopy, HandHelping, Flag } from 'lucide-react';
import {
  subscribeAllCollection,
  setUserAccountStatus,
  removeResourceAsAdmin,
  resolveReport,
} from '../../services/adminService';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [helpReqs, setHelpReqs] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const u1 = subscribeAllCollection('users', setUsers);
    const u2 = subscribeAllCollection('resources', setResources);
    const u3 = subscribeAllCollection('rentalRequests', setRentals);
    const u4 = subscribeAllCollection('helpRequests', setHelpReqs);
    const u5 = subscribeAllCollection('reports', setReports);
    return () => {
      u1(); u2(); u3(); u4(); u5();
    };
  }, []);

  const totalDownloads = resources.reduce((sum, r) => sum + (r.totalDownloads || 0), 0);
  const completedRentals = rentals.filter((r) => r.status === 'Returned').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-950 text-emerald-400 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Moderation & Platform Analytics</h1>
          <p className="text-sm text-slate-600">Live Firestore metrics, user access controls, and report resolution.</p>
        </div>
      </div>

      {/* Live Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users },
          { label: 'Resources', value: resources.length, icon: FileText },
          { label: 'PDF Downloads', value: totalDownloads, icon: FileText },
          { label: 'Rental Requests', value: rentals.length, icon: BookCopy },
          { label: 'Completed Rentals', value: completedRentals, icon: BookCopy },
          { label: 'Help Requests', value: helpReqs.length, icon: HandHelping },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Reports Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Flag className="w-4 h-4 text-rose-600" /> User Reports ({reports.length})
        </h2>
        {reports.length === 0 ? (
          <p className="text-sm text-slate-500">No reports submitted.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{rep.targetTitle}</p>
                  <p className="text-xs text-slate-600">Reason: {rep.reason} • Reported by {rep.reporterName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={rep.status} />
                  {rep.status === 'Open' && (
                    <button
                      onClick={() => resolveReport(rep.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 overflow-x-auto">
        <h2 className="font-bold text-slate-900">User Management</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-3 font-medium text-slate-900">{u.name}</td>
                <td className="py-3 text-slate-600">{u.email}</td>
                <td className="py-3 capitalize">{u.role?.replace('_', ' ')}</td>
                <td className="py-3"><StatusBadge status={u.status || 'active'} /></td>
                <td className="py-3 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() =>
                        setUserAccountStatus(u.id, u.status === 'deactivated' ? 'active' : 'deactivated')
                      }
                      className="px-3 py-1 rounded-lg text-xs font-semibold border border-slate-300 hover:bg-slate-100"
                    >
                      {u.status === 'deactivated' ? 'Reactivate' : 'Deactivate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resource Moderation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-bold text-slate-900">Resource Listings Moderation</h2>
        <div className="space-y-2">
          {resources.map((res) => (
            <div key={res.id} className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm text-slate-900">{res.title}</p>
                <p className="text-xs text-slate-500">Owner: {res.ownerName} • Category: {res.category}</p>
              </div>
              <button
                onClick={() => removeResourceAsAdmin(res.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
              >
                Remove Listing
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
