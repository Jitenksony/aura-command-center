import { useEffect, useRef, useState } from "react";
import { X, Check, CheckCheck, Bell, ShieldAlert, CreditCard, Briefcase, ShieldCheck, Gavel, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "info" | "success" | "warning" | "danger";
type Category = "fraud" | "payment" | "job" | "verify" | "dispute" | "system";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: Category;
  severity: Severity;
  ts: number;
  read: boolean;
}

const meta: Record<Category, { icon: any; label: string }> = {
  fraud:   { icon: ShieldAlert, label: "Fraud" },
  payment: { icon: CreditCard,  label: "Payment" },
  job:     { icon: Briefcase,   label: "Job" },
  verify:  { icon: ShieldCheck, label: "Verification" },
  dispute: { icon: Gavel,       label: "Dispute" },
  system:  { icon: Sparkles,    label: "System" },
};

const sevColor: Record<Severity, { fg: string; bg: string }> = {
  info:    { fg: "var(--color-cyan)",    bg: "oklch(0.74 0.15 210 / 0.12)" },
  success: { fg: "var(--color-success)", bg: "oklch(0.72 0.18 150 / 0.12)" },
  warning: { fg: "var(--color-warning)", bg: "oklch(0.82 0.17 85 / 0.12)" },
  danger:  { fg: "var(--color-danger)",  bg: "oklch(0.65 0.23 27 / 0.14)" },
};

const SEED: AppNotification[] = [
  { id: "n1", title: "High-risk login flagged",     body: "Account #88241 · Lagos, NG · VPN detected",       category: "fraud",   severity: "danger",  ts: Date.now() - 1000 * 60,    read: false },
  { id: "n2", title: "Escrow released $480",         body: "TaskMate Inc. → Sofia Lin",                        category: "payment", severity: "success", ts: Date.now() - 1000 * 60 * 4, read: false },
  { id: "n3", title: "24 KYC submissions pending",   body: "Average wait time 4m 18s",                         category: "verify",  severity: "warning", ts: Date.now() - 1000 * 60 * 12, read: false },
  { id: "n4", title: "Dispute opened #D-1184",       body: "Refund requested · $89 · Brooklyn",                category: "dispute", severity: "warning", ts: Date.now() - 1000 * 60 * 26, read: true  },
  { id: "n5", title: "API latency normalized",       body: "p95 settled at 38ms across regions",               category: "system",  severity: "info",    ts: Date.now() - 1000 * 60 * 55, read: true  },
  { id: "n6", title: "Surge in jobs · Austin",       body: "+62% vs. 1h baseline",                             category: "job",     severity: "info",    ts: Date.now() - 1000 * 60 * 90, read: true  },
];

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>(SEED);

  useEffect(() => {
    const samples: Omit<AppNotification, "id" | "ts" | "read">[] = [
      { title: "Worker accepted job #A-2914", body: "Marcus T. · 4.9 ★ · 1.2 km away", category: "job",     severity: "info" },
      { title: "Payout processed",            body: "$312 → Sofia Lin via Stripe",       category: "payment", severity: "success" },
      { title: "Suspicious payout pattern",   body: "Acct #41209 · Berlin, DE",           category: "fraud",   severity: "danger" },
      { title: "New KYC submitted",           body: "Jordan Reyes · ID + Selfie",         category: "verify",  severity: "warning" },
      { title: "Dispute escalated",           body: "#D-1187 · Priority high",            category: "dispute", severity: "warning" },
    ];
    const t = setInterval(() => {
      const s = samples[Math.floor(Math.random() * samples.length)];
      setItems((prev) =>
        [{ ...s, id: `n-${Date.now()}`, ts: Date.now(), read: false }, ...prev].slice(0, 30),
      );
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const unread = items.filter((i) => !i.read).length;
  const markAllRead = () => setItems((p) => p.map((i) => ({ ...i, read: true })));
  const markRead = (id: string) => setItems((p) => p.map((i) => (i.id === id ? { ...i, read: true } : i)));
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  return { items, unread, markAllRead, markRead, remove };
}

export function NotificationsDrawer({
  open, onClose, items, unread, markAllRead, markRead, remove,
}: {
  open: boolean;
  onClose: () => void;
} & ReturnType<typeof useNotifications>) {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [, force] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // re-render every 20s so timeAgo stays fresh
  useEffect(() => {
    const t = setInterval(() => force((v) => v + 1), 20000);
    return () => clearInterval(t);
  }, []);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const list = tab === "unread" ? items.filter((i) => !i.read) : items;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      {/* Drawer */}
      <aside
        ref={ref}
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-full max-w-[420px] flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{
          background: "linear-gradient(180deg, oklch(0.20 0.04 265 / 0.96), oklch(0.16 0.035 264 / 0.96))",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid oklch(1 0 0 / 0.08)",
          boxShadow: "-30px 0 60px -20px oklch(0 0 0 / 0.7)",
        }}
        role="dialog"
        aria-label="Notifications"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid place-items-center h-9 w-9 rounded-xl"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white tracking-tight">Notifications</div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <span className="pulse-dot" />
                  <span>Live · {unread} unread</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="grid place-items-center h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="inline-flex items-center p-1 rounded-lg bg-white/5 border border-white/8">
              {(["all", "unread"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-md transition capitalize",
                    tab === t ? "text-white" : "text-white/55 hover:text-white",
                  )}
                  style={tab === t ? { background: "oklch(1 0 0 / 0.08)", boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.08)" } : undefined}
                >
                  {t}{t === "unread" && unread > 0 ? ` · ${unread}` : ""}
                </button>
              ))}
            </div>
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="inline-flex items-center gap-1.5 text-[11px] text-white/60 hover:text-white disabled:opacity-40 disabled:hover:text-white/60 transition"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
          {list.length === 0 ? (
            <div className="h-full grid place-items-center text-center px-8">
              <div>
                <div className="mx-auto h-12 w-12 rounded-2xl grid place-items-center bg-white/5 mb-3">
                  <CheckCheck className="h-5 w-5 text-white/50" />
                </div>
                <div className="text-sm text-white">You're all caught up</div>
                <div className="text-[11px] text-white/45 mt-1">No {tab === "unread" ? "unread " : ""}notifications right now.</div>
              </div>
            </div>
          ) : (
            <ul className="space-y-1">
              {list.map((n, idx) => {
                const M = meta[n.category]; const Icon = M.icon;
                const sev = sevColor[n.severity];
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "group relative flex gap-3 rounded-xl p-3 cursor-pointer transition",
                      n.read ? "hover:bg-white/[0.03]" : "bg-white/[0.025] hover:bg-white/[0.05]",
                      idx === 0 && !n.read && "animate-float-up",
                    )}
                    onClick={() => markRead(n.id)}
                  >
                    {!n.read && (
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
                        style={{ background: sev.fg, boxShadow: `0 0 8px ${sev.fg}` }} />
                    )}
                    <div className="grid place-items-center h-9 w-9 rounded-lg shrink-0"
                      style={{ background: sev.bg }}>
                      <Icon className="h-4 w-4" style={{ color: sev.fg }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm truncate", n.read ? "text-white/75 font-normal" : "text-white font-medium")}>
                          {n.title}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: sev.bg, color: sev.fg }}>{M.label}</span>
                      </div>
                      <div className="text-[11px] text-white/50 mt-0.5 line-clamp-2">{n.body}</div>
                      <div className="text-[10px] text-white/35 mt-1 tabular-nums" suppressHydrationWarning>{timeAgo(n.ts)}</div>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                          className="grid place-items-center h-6 w-6 rounded-md text-white/60 hover:text-white hover:bg-white/10"
                          aria-label="Mark as read"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                        className="grid place-items-center h-6 w-6 rounded-md text-white/60 hover:text-[var(--color-danger)] hover:bg-white/10"
                        aria-label="Dismiss"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-white/45">{items.length} total</span>
          <button className="text-xs text-white/70 hover:text-white">Notification settings</button>
        </div>
      </aside>
    </>
  );
}
