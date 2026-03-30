import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AtSign, Heart, MessageCircle, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { MOCK_NOTIFICATIONS, type MockNotification } from "../data/mockData";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_ICONS = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
};

const TYPE_COLORS = {
  like: "oklch(0.55 0.2 25)",
  comment: "oklch(var(--primary))",
  follow: "oklch(0.65 0.18 165)",
  mention: "oklch(0.65 0.16 55)",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold font-display">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {unreadCount} new notifications
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="text-xs"
            data-ocid="notifications.mark_all.button"
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const Icon = TYPE_ICONS[notif.type];
          return (
            <motion.div
              key={notif.id}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                notif.read ? "bg-card" : "bg-card border border-border"
              }`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`notifications.item.${i + 1}`}
            >
              {/* Avatar with type icon */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={notif.user.avatar} />
                  <AvatarFallback>{notif.user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background"
                  style={{ background: TYPE_COLORS[notif.type] }}
                >
                  <Icon size={10} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">
                    {notif.user.displayName}
                  </span>{" "}
                  <span className="text-muted-foreground">{notif.message}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {timeAgo(notif.createdAt)}
                </p>
              </div>

              {/* Post thumbnail */}
              {notif.postThumbnail && (
                <img
                  src={notif.postThumbnail}
                  alt="post"
                  className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                />
              )}

              {/* Unread dot */}
              {!notif.read && (
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "oklch(var(--primary))" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="notifications.empty_state"
        >
          <p className="text-lg font-semibold">All caught up!</p>
          <p className="text-sm mt-1">No new notifications</p>
        </div>
      )}
    </div>
  );
}
