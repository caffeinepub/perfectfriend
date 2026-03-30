import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Flag,
  Globe,
  HelpCircle,
  List,
  Lock,
  Share2,
  Smartphone,
  Star,
  ThumbsUp,
  Trophy,
  Video,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

type LucideIcon = React.ComponentType<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}>;

type SettingItem = {
  icon: LucideIcon;
  label: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  action?: () => void;
  ocid: string;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function Settings() {
  const sections: SettingSection[] = [
    {
      title: "Account",
      items: [
        {
          icon: Smartphone,
          label: "Mobile Verification",
          badge: "Verify",
          badgeVariant: "default",
          action: () => toast.info("Opening Mobile Verification..."),
          ocid: "settings.mobile_verification.button",
        },
        {
          icon: Lock,
          label: "Privacy",
          action: () => toast.info("Opening Privacy settings..."),
          ocid: "settings.privacy.button",
        },
      ],
    },
    {
      title: "Profile",
      items: [
        {
          icon: Share2,
          label: "Share Profile",
          action: () => {
            navigator.clipboard
              .writeText(`${window.location.origin}/profile`)
              .catch(() => {});
            toast.success("Profile link copied!");
          },
          ocid: "settings.share_profile.button",
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          icon: Wallet,
          label: "Wallet",
          action: () => toast.info("Opening Wallet..."),
          ocid: "settings.wallet.button",
        },
        {
          icon: CreditCard,
          label: "Manage Payment",
          action: () => toast.info("Opening Manage Payment..."),
          ocid: "settings.manage_payment.button",
        },
      ],
    },
    {
      title: "Content Preferences",
      items: [
        {
          icon: Globe,
          label: "Content Language",
          action: () => toast.info("Opening Content Language..."),
          ocid: "settings.content_language.button",
        },
        {
          icon: List,
          label: "Primary Content",
          action: () => toast.info("Opening Primary Content..."),
          ocid: "settings.primary_content.button",
        },
      ],
    },
    {
      title: "PF Live",
      items: [
        {
          icon: Video,
          label: "Apply for PF Live",
          badge: "Apply",
          badgeVariant: "default",
          action: () => toast.info("Opening Apply for PF Live..."),
          ocid: "settings.pf_live_apply.button",
        },
        {
          icon: Trophy,
          label: "Live Leaderboard",
          action: () => toast.info("Opening Live Leaderboard..."),
          ocid: "settings.live_leaderboard.button",
        },
        {
          icon: Star,
          label: "VIP Score",
          badge: "VIP",
          badgeVariant: "secondary",
          action: () => toast.info("Opening VIP Score..."),
          ocid: "settings.vip_score.button",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          action: () => toast.info("Opening Help & Support..."),
          ocid: "settings.help_support.button",
        },
        {
          icon: Flag,
          label: "Report",
          action: () => toast.info("Opening Report..."),
          ocid: "settings.report.button",
        },
        {
          icon: ThumbsUp,
          label: "Rate Your Experience",
          action: () => toast.info("Opening Rate Your Experience..."),
          ocid: "settings.rate_experience.button",
        },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/profile"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            data-ocid="settings.back.button"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold font-display">Settings</h1>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, sectionIdx) => (
            <motion.div
              key={section.title}
              className="bg-card rounded-2xl border border-border overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.05 }}
            >
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h2>
              </div>
              <div>
                {section.items.map((item, itemIdx) => (
                  <div key={item.label}>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary transition-colors text-left"
                      onClick={item.action}
                      data-ocid={item.ocid}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "oklch(var(--chip-bg))" }}
                      >
                        <item.icon
                          size={16}
                          style={{ color: "oklch(var(--primary))" }}
                        />
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "default"}
                          className="text-xs mr-1"
                          style={
                            item.badgeVariant !== "secondary"
                              ? { background: "oklch(var(--primary))" }
                              : {
                                  background: "oklch(var(--chip-bg))",
                                  color: "oklch(var(--primary))",
                                }
                          }
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight
                        size={16}
                        className="text-muted-foreground flex-shrink-0"
                      />
                    </button>
                    {itemIdx < section.items.length - 1 && (
                      <Separator className="ml-[3.75rem]" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-6">
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
