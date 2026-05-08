import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSkeleton } from "@/components/admin/PageSkeletons";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { RevenueChart } from "@/components/admin/RevenueChart";

export const Route = createFileRoute("/analytics")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<AnalyticsSkeleton />),
  head: () => ({ meta: [{ title: "Analytics — Nexora" }] }),
  component: AnalyticsPage,
});

const growth = Array.from({ length: 12 }, (_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  users: 2000 + i * 380 + Math.round(((i * 31) % 600)),
  workers: 800 + i * 220 + Math.round(((i * 17) % 400)),
}));

const split = [
  { name: "Cleaning", value: 32 },
  { name: "Moving",   value: 22 },
  { name: "Handyman", value: 18 },
  { name: "Plumbing", value: 14 },
  { name: "Other",    value: 14 },
];
const pieColors = ["oklch(0.62 0.21 275)", "oklch(0.74 0.15 210)", "oklch(0.72 0.18 150)", "oklch(0.82 0.17 85)", "oklch(0.65 0.23 27)"];

function AnalyticsPage() {
  return (
    <PageShell eyebrow="Insights" title="Analytics" description="Growth, retention, revenue, and category performance.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="MRR" value="$842K" accent="var(--color-primary)" />
        <StatTile label="DAU / MAU" value="42%" accent="var(--color-cyan)" />
        <StatTile label="Job completion" value="96.4%" accent="var(--color-success)" />
        <StatTile label="Worker retention" value="84%" accent="var(--color-warning)" />
      </div>

      <RevenueChart />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 rounded-2xl glass gradient-border p-5">
          <h3 className="text-sm font-semibold text-white mb-1">User & Worker growth</h3>
          <p className="text-[11px] text-white/45 mb-4">Last 12 months</p>
          <div className="h-[280px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: "oklch(1 0 0 / 0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(1 0 0 / 0.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
                  contentStyle={{ background: "oklch(0.20 0.04 265 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12, color: "white" }} />
                <Bar dataKey="users" fill="oklch(0.62 0.21 275)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="workers" fill="oklch(0.74 0.15 210)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 rounded-2xl glass gradient-border p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Revenue by category</h3>
          <p className="text-[11px] text-white/45 mb-4">Share of GMV · last 30d</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                  {split.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.20 0.04 265 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12, color: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-1.5">
            {split.map((s, i) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 text-white/70"><span className="h-2 w-2 rounded-full" style={{ background: pieColors[i] }} />{s.name}</span>
                <span className="text-white tabular-nums">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
