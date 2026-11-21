import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/dateUtils';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="py-8 bg-offwhite dark:bg-darkbg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-forest-600 dark:text-mint-400" />
              Notifications Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Operational updates, matches, and courier handover confirmations
            </p>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-darkborder text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-forest-600" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder shadow-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <div>No notifications logged yet.</div>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 flex items-start justify-between gap-4 ${
                  !n.read ? 'bg-forest-50/40 dark:bg-forest-950/20' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-forest-600"></span>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(n.timestamp)}
                  </div>
                </div>

                <div className="self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
