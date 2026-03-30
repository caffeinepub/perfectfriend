import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import TopBar from "./components/TopBar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Reels from "./pages/Reels";
import SettingsPage from "./pages/Settings";

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "oklch(var(--background))" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{ background: "oklch(var(--primary))" }}
        >
          <Heart size={40} className="text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1
            className="text-4xl font-bold font-display"
            style={{ color: "oklch(var(--primary))" }}
          >
            PerfectFriend
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium tracking-wide">
            Dosti ka perfect platform
          </p>
        </div>
        <motion.div
          className="flex gap-1 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "oklch(var(--primary))" }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.2,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Layout() {
  const { identity, isInitializing } = useInternetIdentity();
  const [showSplash, setShowSplash] = useState(true);
  const routerState = useRouterState();
  const isReels =
    routerState.location.pathname === "/reels" ||
    routerState.location.pathname === "/explore";

  if (showSplash) {
    return (
      <AnimatePresence>
        <SplashScreen onDone={() => setShowSplash(false)} />
      </AnimatePresence>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
          style={{ borderColor: "oklch(var(--primary))" }}
        />
      </div>
    );
  }

  if (!identity) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000" }}>
      {/* Top bar — hidden on reels/explore (full-screen) */}
      {!isReels && <TopBar />}

      {/* Main content */}
      <main
        className="flex-1"
        style={{
          paddingTop: isReels ? "0" : "52px",
          paddingBottom: isReels ? "0" : "60px",
        }}
      >
        <Outlet />
      </main>

      {/* Bottom navigation — always visible */}
      <BottomNav />

      {/* Footer attribution — only outside reels */}
      {!isReels && (
        <div
          className="fixed bottom-[60px] left-0 right-0 z-30 flex justify-center py-0.5"
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <p className="text-[9px] text-white/20">
            © {new Date().getFullYear()}. Built with{" "}
            <Heart
              size={8}
              className="inline text-red-400/40"
              fill="currentColor"
            />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ pointerEvents: "auto" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const reelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reels",
  component: Reels,
});
const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: Explore,
});
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: Notifications,
});
const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: Messages,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  reelsRoute,
  exploreRoute,
  notificationsRoute,
  messagesRoute,
  profileRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
