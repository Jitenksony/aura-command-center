import { createFileRoute } from "@tanstack/react-router";
import { SplitSkeleton } from "@/components/admin/PageSkeletons";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { FraudPanel } from "@/components/admin/FraudPanel";

export const Route = createFileRoute("/fraud")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<SplitSkeleton {...{ eyebrow: "Risk" }} />),
  head: () => ({ meta: [{ title: "Fraud Detection — Nexora" }] }),
  component: FraudPage,
});

const surface = [
  { label: "Account farming",   pct: 38, color: "var(--color-danger)" },
  { label: "Payment fraud",     pct: 26, color: "var(--color-warning)" },
  { label: "Fake listings",     pct: 18, color: "var(--color-cyan)" },
  { label: "Identity spoofing", pct: 12, color: "var(--color-primary)" },
  { label: "Other",             pct: 6,  color: "var(--color-success)" },
];

function FraudPage() {
  return (
    <PageShell eyebrow="Security" title="Fraud Detection" description="AI-driven detection of suspicious accounts, payments, and listings.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Active alerts" value="37" accent="var(--color-danger)" />
        <StatTile label="Blocked · 24h" value="142" accent="var(--color-warning)" />
        <StatTile label="Saved revenue" value="$84K" accent="var(--color-success)" />
        <StatTile label="Model precision" value="97.2%" accent="var(--color-primary)" />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7"><FraudPanel /></div>
        <div className="col-span-12 xl:col-span-5 rounded-2xl glass gradient-border p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Threat surface</h3>
          <ul className="space-y-3">
            {surface.map((t) => (
              <li key={t.label}>
                <div className="flex items-center justify-between text-xs text-white/70"><span>{t.label}</span><span className="text-white tabular-nums">{t.pct}%</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${t.pct * 2.4}%`, background: t.color, boxShadow: `0 0 12px ${t.color}` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
