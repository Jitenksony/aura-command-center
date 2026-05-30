import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardSkeleton } from "@/components/admin/PageSkeletons";
import {
  Users, HardHat, Briefcase, DollarSign, ShieldCheck, Building2, ShieldAlert, LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/admin/PageShell";
import { StatCard } from "@/components/admin/StatCard";
import { LiveActivity } from "@/components/admin/LiveActivity";
import { MapPanel } from "@/components/admin/MapPanel";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { VerificationPanel } from "@/components/admin/VerificationPanel";
import { FraudPanel } from "@/components/admin/FraudPanel";
import { TransactionsTable } from "@/components/admin/TransactionsTable";

export const Route = createFileRoute("/")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<DashboardSkeleton />),
  head: () => ({ meta: [{ title: "Dashboard — Nexora" }] }),
  component: Dashboard,
});

type Range = "today" | "7d" | "30d";

const spark = (seed: number, mult = 1) =>
  Array.from({ length: 20 }, (_, i) => (30 + Math.sin(i / 2 + seed) * 14 + Math.cos(i / 3 + seed) * 8 + i) * mult);

function Dashboard() {
  const [range, setRange] = useState<Range>("30d");
  const mult = range === "today" ? 0.35 : range === "7d" ? 0.7 : 1;

  return (
    <PageShell
      eyebrow="Operations Overview"
      title={<>Welcome back, <span className="text-gradient">Alex</span></>}
      description="Here's a real-time pulse of the Nexora marketplace."
      actions={
        <>
          {(["today", "7d", "30d"] as const).map((r) => {
            const active = range === r;
            return (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "h-9 px-3 text-xs rounded-lg transition",
                  active
                    ? "text-white"
                    : "border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                )}
                style={
                  active
                    ? { background: "var(--gradient-primary)", boxShadow: "0 8px 24px -10px oklch(0.62 0.21 275 / 0.6)" }
                    : undefined
                }
              >
                {r === "today" ? "Today" : r}
              </button>
            );
          })}
        </>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard to="/users" label="Total Users" value={Math.round(284921 * mult)} delta={12.4} icon={Users} tone="primary" data={spark(1, mult)} />
        <StatCard to="/workers" label="Active Workers" value={Math.round(18420 * mult)} delta={8.1} icon={HardHat} tone="cyan" data={spark(2, mult)} />
        <StatCard to="/live-jobs" label="Live Jobs" value={Math.round(1284 * mult)} delta={24.6} icon={Briefcase} tone="success" data={spark(3, mult)} />
        <StatCard to="/payments" label="Platform Revenue" value={Math.round(184290 * mult)} prefix="$" delta={18.4} icon={DollarSign} tone="primary" data={spark(4, mult)} />
        <StatCard to="/verification" label="Pending Verifications" value={Math.round(324 * mult)} delta={-3.2} icon={ShieldCheck} tone="warning" data={spark(5, mult)} />
        <StatCard to="/businesses" label="Active Businesses" value={Math.round(5612 * mult)} delta={5.7} icon={Building2} tone="cyan" data={spark(6, mult)} />
        <StatCard to="/fraud" label="Fraud Alerts" value={Math.round(37 * mult)} delta={-14.2} icon={ShieldAlert} tone="danger" data={spark(7, mult)} />
        <StatCard to="/support" label="Support Tickets" value={Math.round(142 * mult)} delta={2.4} icon={LifeBuoy} tone="success" data={spark(8, mult)} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8"><MapPanel /></div>
        <div className="col-span-12 xl:col-span-4 h-[460px]"><LiveActivity /></div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8"><RevenueChart /></div>
        <div className="col-span-12 xl:col-span-4"><FraudPanel /></div>
      </div>

      <VerificationPanel />
      <TransactionsTable />

      <footer className="pt-2 pb-6 text-center text-[11px] text-white/35">
        Nexora Operations Console · v4.2 · Region: Global · Latency 38ms
      </footer>
    </PageShell>
  );
}
