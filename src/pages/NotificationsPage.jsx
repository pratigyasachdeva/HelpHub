
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ArrowUpRight,
  Inbox,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

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

    return subscribeUserNotifications(
      userProfile.uid,
      setNotifications
    );
  }, [userProfile?.uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111C46] via-[#192B61] to-[#30458C] p-7 sm:p-9 shadow-lg shadow-indigo-950/10">

        <div className="absolute -top-24 -right-10 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 right-1/4 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-bold tracking-widest mb-5">
              <Sparkles size={13} />
              STAY IN THE LOOP
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Notifications
            </h1>

            <p className="text-sm text-blue-100/70 mt-3 max-w-lg leading-relaxed">
              Real-time updates on rentals, handovers, returns,
              and help offers. Never miss an important update.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl p-4 sm:min-w-[155px]">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-blue-200">
              <Bell size={22} />
            </div>

            <div>
              <p className="text-2xl font-bold text-white">
                {unreadCount}
              </p>
              <p className="text-[10px] text-blue-200 font-medium">
                Unread updates
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Notification Controls */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Your Activity
            </h2>

            {notifications.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                {notifications.length} TOTAL
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            All your important updates in one place.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead(notifications)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm"
          >
            <CheckCheck size={16} className="text-emerald-600" />
            Mark All as Read
          </button>
        )}

      </section>

      {/* Notifications List */}
      {notifications.length === 0 ? (

        /* Empty State */
        <div className="bg-white rounded-[28px] border border-slate-200 p-12 sm:p-16 text-center shadow-sm">

          <div className="relative w-20 h-20 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Inbox size={36} strokeWidth={1.5} />

            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center">
              <CheckCircle2 size={14} className="text-emerald-600" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-7">
            You're all caught up!
          </h3>

          <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
            No notifications yet. When you receive rental requests,
            handover updates, or community help offers, they'll
            appear right here.
          </p>

          <Link
            to="/dashboard/browse"
            className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-800 transition-all"
          >
            Explore Library
            <ArrowUpRight size={16} />
          </Link>

        </div>

      ) : (

        <div className="space-y-3">

          {notifications.map((n) => (

            <div
              key={n.id}
              onClick={() => !n.read && markNotificationRead(n.id)}
              className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-200 cursor-pointer ${
                n.read
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                  : 'bg-white border-indigo-200 shadow-sm shadow-indigo-950/[0.03] hover:shadow-md hover:border-indigo-300'
              }`}
            >

              {/* Unread Indicator */}
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
              )}

              <div className="flex items-start gap-4">

                {/* Icon */}
                <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${
                  n.read
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-indigo-50 text-indigo-700'
                }`}>
                  <Bell size={20} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {n.title}
                    </h3>

                    {!n.read && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-bold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4">

                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Clock size={13} />
                      {formatTimestamp(n.createdAt)}
                    </span>

                    {n.read && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <CheckCircle2 size={13} />
                        Read
                      </span>
                    )}

                  </div>
                </div>

                {/* Action */}
                {n.link && (
                  <Link
                    to={n.link}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!n.read) markNotificationRead(n.id);
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-950 transition-colors"
                  >
                    <span className="hidden sm:inline">View</span>
                    <ArrowUpRight size={17} />
                  </Link>
                )}

              </div>
            </div>

          ))}

        </div>

      )}

      {/* Footer Note */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
          <CheckCircle2 size={14} className="text-emerald-500" />
          You're viewing your HelpHub notification activity.
        </div>
      )}

    </div>
  );
}
