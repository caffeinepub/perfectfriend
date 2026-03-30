import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Auth() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "oklch(var(--background))" }}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          {/* Logo */}
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-bold font-display text-white"
            style={{ background: "oklch(var(--primary))" }}
          >
            PF
          </div>
          <h1 className="text-2xl font-bold font-display mb-1">
            <span className="text-foreground">Perfect</span>
            <span style={{ color: "oklch(var(--primary))" }}>Friend</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Dosti ka perfect platform 💙
          </p>

          <div className="space-y-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-11 text-sm font-semibold"
              style={{ background: "oklch(var(--primary))" }}
              data-ocid="auth.login.button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to PerfectFriend"
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Secure, privacy-first login powered by{" "}
              <span className="text-foreground font-medium">
                Internet Identity
              </span>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Connect", desc: "with real friends" },
                { label: "Share", desc: "your moments" },
                { label: "Discover", desc: "new people" },
              ].map(({ label, desc }) => (
                <div key={label}>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "oklch(var(--primary))" }}
                  >
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
