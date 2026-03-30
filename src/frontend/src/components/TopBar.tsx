import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Settings } from "lucide-react";

export default function TopBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4"
      style={{
        background: "#000000",
        height: "52px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
      data-ocid="topbar.panel"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "#ff0050" }}
        >
          <Heart size={16} className="text-white" fill="white" />
        </div>
        <span className="font-bold text-base text-white">
          <span className="text-white">Perfect</span>
          <span style={{ color: "#ff0050" }}>Friend</span>
        </span>
      </Link>

      {/* Settings */}
      <Link
        to="/settings"
        data-ocid="nav.settings.link"
        className="p-2 rounded-lg transition-colors"
        style={{
          color: currentPath === "/settings" ? "#ff0050" : "#8a8a8a",
        }}
        aria-label="Settings"
      >
        <Settings size={22} />
      </Link>
    </header>
  );
}
