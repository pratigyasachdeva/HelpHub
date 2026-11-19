import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../features/authentication/AuthContext';
import {
  subscribeUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationService';
import { formatTimestamp } from '../utils/pricingAndDates';

export default function NotificationsPage() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userProfile?.uid) return;
    return subscribeUserNotifications(userProfile.uid, setNotifications);
  }, [userProfile?.uid]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-600">Real-time updates on rentals, handovers, returns, and help offers.</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={() => markAllNotificationsRead(notifications)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                n.read
                  ? 'bg-white border-slate-200'
                  : 'bg-indigo-50/60 border-indigo-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Bell className={`w-4 h-4 mt-1 ${n.read ? 'text-slate-400' : 'text-indigo-950'}`} />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{n.title}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTimestamp(n.createdAt)}</p>
                  </div>
                </div>
                {n.link && (
                  <Link to={n.link} className="text-xs font-semibold text-indigo-950 hover:underline shrink-0">
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
