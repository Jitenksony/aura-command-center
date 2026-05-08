import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Download, Calendar } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Nexora" }] }),
  component: ReportsPage,
});

const reports = [
  { name: "Monthly GMV report",       period: "May 2026",     type: "Financial",  size: "2.4 MB", updated: "2h ago" },
  { name: "Worker performance digest", period: "Q2 2026",      type: "Operations", size: "1.1 MB", updated: "Yesterday" },
  { name: "KYC compliance audit",      period: "Apr 2026",     type: "Compliance", size: "812 KB", updated: "3 days ago" },
  { name: "Fraud incidents summary",   period: "Last 30 days", type: "Security",   size: "640 KB", updated: "Today" },
  { name: "Geo expansion analysis",    period: "H1 2026",      type: "Strategy",   size: "3.2 MB", updated: "1 week ago" },
  { name: "Customer churn cohort",     period: "Q1 2026",      type: "Retention",  size: "1.8 MB", updated: "2 weeks ago" },
];

function ReportsPage() {
  return (
    <PageShell
      eyebrow="Insights"
      title="Reports"
      description="Pre-built financial, operations, compliance, and strategy reports."
      actions={<button className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><Calendar className="h-3.5 w-3.5" /> Schedule</button>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Reports generated" value="1,284" accent="var(--color-primary)" />
        <StatTile label="Scheduled" value="42" accent="var(--color-cyan)" />
        <StatTile label="Storage used" value="184 GB" accent="var(--color-warning)" />
        <StatTile label="Compliance score" value="A+" accent="var(--color-success)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div key={r.name} className="rounded-2xl glass gradient-border p-5 hover-lift">
            <div className="flex items-start justify-between">
              <div className="grid place-items-center h-10 w-10 rounded-xl"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.15))", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                <FileBarChart className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md text-white/70" style={{ background: "oklch(1 0 0 / 0.05)" }}>{r.type}</span>
            </div>
            <div className="mt-3 text-sm font-semibold text-white">{r.name}</div>
            <div className="text-[11px] text-white/50">{r.period}</div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-white/45">
              <span>{r.size} · {r.updated}</span>
              <button className="inline-flex items-center gap-1 text-white/80 hover:text-white"><Download className="h-3.5 w-3.5" />Download</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
