import { useEffect, useState } from "react";
import { Briefcase, CheckCircle2, CreditCard, ShieldCheck, ShieldAlert, Gavel } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const routeFor: Record<"job" | "accept" | "payment" | "verify" | "fraud" | "dispute", string> = {
  job: "/live-jobs",
  accept: "/live-jobs",
  payment: "/payments",
  verify: "/verification",
  fraud: "/fraud",
  dispute: "/disputes",
};

type Kind = "job" | "accept" | "payment" | "verify" | "fraud" | "dispute";
interface Item { id: number; kind: Kind; title: string; sub: string; ago: string; }

const seed: Item[] = [
  { id: 1, kind: "job",     title: "Plumbing repair posted",       sub: "Brooklyn, NY · $120 · Urgent",       ago: "just now" },
  { id: 2, kind: "accept",  title: "Worker accepted job #A-2914",  sub: "Marcus T. · 4.9 ★ · 1.2 km away",     ago: "12s ago" },
  { id: 3, kind: "payment", title: "Escrow released $480",         sub: "TaskMate Inc. → Sofia Lin",           ago: "38s ago" },
  { id: 4, kind: "verify",  title: "KYC submitted",                sub: "Jordan Reyes · ID + Selfie",          ago: "1m ago" },
  { id: 5, kind: "fraud",   title: "High risk login detected",     sub: "Acct #88241 · Lagos, NG · VPN",       ago: "2m ago" },
  { id: 6, kind: "dispute", title: "Dispute opened #D-1184",       sub: "Refund requested · $89",              ago: "3m ago" },
  { id: 7, kind: "job",     title: "Furniture moving posted",      sub: "Austin, TX · $260",                   ago: "4m ago" },
  { id: 8, kind: "payment", title: "Payout to worker $312",        sub: "Stripe · processed",                  ago: "5m ago" },
];

const meta: Record<Kind, { icon: any; color: string; bg: string; label: string }> = {
  job:     { icon: Briefcase,    color: "var(--color-cyan)",     bg: "oklch(0.74 0.15 210 / 0.12)", label: "New Job" },
  accept:  { icon: CheckCircle2, color: "var(--color-success)",  bg: "oklch(0.72 0.18 150 / 0.12)", label: "Accepted" },
  payment: { icon: CreditCard,   color: "var(--color-primary)",  bg: "oklch(0.62 0.21 275 / 0.14)", label: "Payment" },
  verify:  { icon: ShieldCheck,  color: "var(--color-warning)",  bg: "oklch(0.82 0.17 85 / 0.12)",  label: "Verify" },
  fraud:   { icon: ShieldAlert,  color: "var(--color-danger)",   bg: "oklch(0.65 0.23 27 / 0.12)",  label: "Fraud" },
  dispute: { icon: Gavel,        color: "var(--color-danger)",   bg: "oklch(0.65 0.23 27 / 0.10)",  label: "Dispute" },
};

export function LiveActivity() {
  const [items, setItems] = useState(seed);
  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) => {
        const kinds: Kind[] = ["job", "accept", "payment", "verify", "fraud", "dispute"];
        const k = kinds[Math.floor(Math.random() * kinds.length)];
        const next: Item = {
          id: Date.now(),
          kind: k,
          title: ({
            job: "New job posted nearby",
            accept: "Worker accepted job",
            payment: "Payment processed",
            verify: "KYC submitted",
            fraud: "Suspicious activity flagged",
            dispute: "New dispute opened",
          } as Record<Kind, string>)[k],
          sub: "Live event from operations stream",
          ago: "just now",
        };
        return [next, ...prev].slice(0, 9);
      });
    }, 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl glass gradient-border h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot" />
          <h3 className="text-sm font-semibold text-white tracking-tight">Live Activity</h3>
          <span className="text-[10px] text-white/40 px-1.5 py-0.5 rounded-md bg-white/5">REAL-TIME</span>
        </div>
        <Link to="/notifications" className="text-xs text-white/50 hover:text-white">View all</Link>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
        <ul className="space-y-1">
          {items.map((it, idx) => {
            const m = meta[it.kind]; const Icon = m.icon;
            return (
              <li key={it.id} className={cn(idx === 0 && "animate-float-up")}>
                <Link
                  to={routeFor[it.kind]}
                  className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-white/[0.04] transition"
                >
                  <div className="grid place-items-center h-9 w-9 rounded-lg shrink-0" style={{ background: m.bg }}>
                    <Icon className="h-4 w-4" style={{ color: m.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{it.title}</span>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: m.bg, color: m.color }}>{m.label}</span>
                    </div>
                    <div className="text-[11px] text-white/45 truncate mt-0.5">{it.sub}</div>
                  </div>
                  <div className="text-[10px] text-white/40 tabular-nums shrink-0">{it.ago}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
