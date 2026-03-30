import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Compass,
  Home,
  MessageCircle,
  Play,
  Settings,
} from "lucide-react";
import {
  CURRENT_USER,
  MOCK_CONVERSATIONS,
  MOCK_NOTIFICATIONS,
} from "../data/mockData";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/reels", label: "Reels", icon: Play },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/messages", label: "Messages", icon: MessageCircle },
];

export default function Navbar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const unreadNotifications = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  const unreadMessages = MOCK_CONVERSATIONS.reduce(
    (acc, c) => acc + c.unread,
    0,
  );

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{ background: "oklch(var(--header-bg))" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display"
            style={{ background: "oklch(var(--primary))" }}
          >
            PF
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">
            <span className="text-foreground">Perfect</span>
            <span style={{ color: "oklch(var(--primary))" }}>Friend</span>
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath === to;
            const badge =
              to === "/notifications"
                ? unreadNotifications
                : to === "/messages"
                  ? unreadMessages
                  : 0;
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.${label.toLowerCase()}.link`}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {badge > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                      style={{ background: "oklch(var(--badge-red))" }}
                      data-ocid={`nav.${label.toLowerCase()}.badge`}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium hidden md:block ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background: "oklch(var(--primary))" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Profile + Settings */}
        <div className="flex items-center gap-2">
          <Link
            to="/settings"
            data-ocid="nav.settings.link"
            className={`p-2 rounded-lg transition-colors ${
              currentPath === "/settings"
                ? "text-foreground bg-secondary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            title="Settings"
          >
            <Settings size={20} />
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            data-ocid="nav.profile.link"
          >
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.displayName}
                />
                <AvatarFallback>{CURRENT_USER.displayName[0]}</AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background"
                style={{ background: "oklch(var(--online-green))" }}
              />
            </div>
            <span className="text-sm font-medium hidden lg:block">
              {CURRENT_USER.username}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
