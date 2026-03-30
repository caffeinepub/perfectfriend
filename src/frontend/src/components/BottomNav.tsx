import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Compass, Home, Plus, User } from "lucide-react";
import { useState } from "react";
import { MOCK_NOTIFICATIONS } from "../data/mockData";
import CameraReelRecorder from "./CameraReelRecorder";

export default function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [cameraOpen, setCameraOpen] = useState(false);

  const unreadNotifications = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const isActive = (path: string) => currentPath === path;
  const iconColor = (path: string) => (isActive(path) ? "#ff0050" : "#8a8a8a");

  return (
    <>
      {cameraOpen && (
        <CameraReelRecorder onClose={() => setCameraOpen(false)} />
      )}

      {/* Bottom Nav Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{
          background: "#000000",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          height: "60px",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        data-ocid="bottom.nav.panel"
      >
        {/* Home */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] py-1"
          data-ocid="nav.home.link"
        >
          <Home
            size={24}
            style={{ color: iconColor("/") }}
            strokeWidth={isActive("/") ? 2.5 : 1.8}
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: iconColor("/") }}
          >
            Home
          </span>
        </Link>

        {/* Explore */}
        <Link
          to="/explore"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] py-1"
          data-ocid="nav.explore.link"
        >
          <Compass
            size={24}
            style={{ color: iconColor("/explore") }}
            strokeWidth={isActive("/explore") ? 2.5 : 1.8}
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: iconColor("/explore") }}
          >
            Explore
          </span>
        </Link>

        {/* Center "+" TikTok Button — opens camera recorder */}
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="relative flex items-center justify-center"
            style={{ width: "54px", height: "36px" }}
            data-ocid="upload.open_modal_button"
            aria-label="Create Reel"
          >
            {/* Cyan layer (left offset) */}
            <span
              className="absolute rounded-[8px]"
              style={{
                background: "#00f2ea",
                width: "44px",
                height: "30px",
                left: "0px",
                top: "3px",
                borderRadius: "8px",
              }}
            />
            {/* Pink layer (right offset) */}
            <span
              className="absolute rounded-[8px]"
              style={{
                background: "#ff0050",
                width: "44px",
                height: "30px",
                right: "0px",
                top: "3px",
                borderRadius: "8px",
              }}
            />
            {/* White center pill */}
            <span
              className="absolute flex items-center justify-center rounded-[8px]"
              style={{
                background: "#ffffff",
                width: "44px",
                height: "30px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "8px",
                zIndex: 1,
              }}
            >
              <Plus size={18} color="#000" strokeWidth={2.5} />
            </span>
          </button>
        </div>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] py-1 relative"
          data-ocid="nav.notifications.link"
        >
          <div className="relative">
            <Bell
              size={24}
              style={{ color: iconColor("/notifications") }}
              strokeWidth={isActive("/notifications") ? 2.5 : 1.8}
            />
            {unreadNotifications > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{ background: "#ff0050" }}
                data-ocid="nav.notifications.badge"
              >
                {unreadNotifications}
              </span>
            )}
          </div>
          <span
            className="text-[10px] font-medium"
            style={{ color: iconColor("/notifications") }}
          >
            Inbox
          </span>
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] py-1"
          data-ocid="nav.profile.link"
        >
          <User
            size={24}
            style={{ color: iconColor("/profile") }}
            strokeWidth={isActive("/profile") ? 2.5 : 1.8}
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: iconColor("/profile") }}
          >
            Profile
          </span>
        </Link>
      </nav>
    </>
  );
}
