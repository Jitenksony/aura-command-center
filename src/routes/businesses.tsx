import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, TrendingUp } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/businesses")({
  head: () => ({ meta: [{ title: "Businesses — Nexora" }] }),
  component: BusinessesPage,
});

const biz = [
  { name: "TaskMate Inc.",      industry: "Logistics",   plan: "Enterprise", spend: 124800, jobs: 1820, city: "New York, NY",  health: 92 },
  { name: "Northwind Catering", industry: "Hospitality", plan: "Pro",        spend: 48200,  jobs: 612,  city: "Chicago, IL",   health: 78 },
  { name: "Iris Holdings",      industry: "Real Estate", plan: "Enterprise", spend: 218400, jobs: 2480, city: "Miami, FL",     health: 96 },
  { name: "Verdant Cleanup",    industry: "Cleaning",    plan: "Growth",     spend: 18400,  jobs: 184,  city: "Portland, OR",  health: 64 },
  { name: "Helix Events",       industry: "Events",      plan: "Pro",        spend: 36400,  jobs: 312,  city: "Austin, TX",    health: 81 },
  { name: "Stratus Movers",     industry: "Moving",      plan: "Growth",     spend: 22800,  jobs: 244,  city: "Denver, CO",    health: 73 },
];

function BusinessesPage() {
  return (
    <PageShell eyebrow="Demand" title="Businesses" description="Enterprise customers and SMB demand across the platform.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Businesses" value="5,612" accent="var(--color-cyan)" />
        <StatTile label="Enterprise" value="148" accent="var(--color-primary)" />
        <StatTile label="Monthly GMV" value="$2.84M" accent="var(--color-success)" />
        <StatTile label="Net retention" value="118%" accent="var(--color-warning)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {biz.map((b) => (
          <div key={b.name} className="rounded-2xl glass gradient-border p-5 hover-lift">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center h-11 w-11 rounded-xl"
                  style={{ background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.15))", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{b.name}</div>
                  <div className="text-[11px] text-white/50">{b.industry}</div>
                  <div className="text-[11px] text-white/45 mt-0.5 inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{b.city}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md text-white/80" style={{ background: "oklch(1 0 0 / 0.06)" }}>{b.plan}</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-white/55"><span>Account health</span><span className="text-white tabular-nums">{b.health}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${b.health}%`, background: b.health > 85 ? "var(--color-success)" : b.health > 70 ? "var(--color-cyan)" : "var(--color-warning)" }} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-white/40">Spend</div>
                <div className="text-sm font-semibold text-white tabular-nums">${b.spend.toLocaleString()}</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-white/40">Jobs</div>
                <div className="text-sm font-semibold text-white tabular-nums inline-flex items-center gap-1"><TrendingUp className="h-3 w-3 text-[var(--color-success)]" />{b.jobs}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
