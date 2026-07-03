"use client";

import { Bell, Package, Tag, FileText, CheckCheck, MessageSquare } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { useT } from "@/hooks/useT";

const typeIcons: Record<string, React.ElementType> = {
  order: Package, product: Tag, promo: Tag,
  blog: FileText, support: MessageSquare, general: Bell,
};
const typeColors: Record<string, string> = {
  order: "text-blue-400 bg-blue-400/10",
  product: "text-green-400 bg-green-400/10",
  promo: "text-accent-gold bg-accent-gold/10",
  blog: "text-purple-400 bg-purple-400/10",
  support: "text-orange-400 bg-orange-400/10",
  general: "text-text-muted bg-bg-panel",
};

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const t = useT();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return t.notifications.now;
    if (mins < 60) return `${mins} ${t.notifications.minutesAgo}`;
    if (hours < 24) return `${hours} ${t.notifications.hoursAgo}`;
    return `${days} ${t.notifications.daysAgo}`;
  };

  return (
    <div className="container-main py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <Bell size={28} className="text-accent-gold" />
            {t.notifications.title}
          </h1>
          {unreadCount > 0 && (
            <p className="text-text-muted text-sm mt-1">
              <span className="text-accent-gold font-medium">{unreadCount} {t.notifications.unread}</span>
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-sm flex items-center gap-1.5">
            <CheckCheck size={16} /> {t.notifications.markAllRead}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-16 text-center">
          <Bell size={48} className="text-text-muted opacity-30 mx-auto mb-4" />
          <p className="text-text-secondary">{t.notifications.empty}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell;
            const colorClass = typeColors[notif.type] || "text-text-muted bg-bg-panel";
            return (
              <div key={notif.id} onClick={() => markRead(notif.id)}
                className={`card p-4 flex items-start gap-4 cursor-pointer hover:border-accent-gold/20 transition-all ${!notif.isRead ? "border-accent-gold/20 bg-accent-gold/[0.02]" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold text-sm ${notif.isRead ? "text-text-secondary" : "text-text-primary"}`}>
                      {notif.title}
                    </p>
                    {!notif.isRead && <div className="w-2 h-2 bg-accent-gold rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-text-muted text-xs mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-text-muted text-xs mt-1.5">{formatTime(notif.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
