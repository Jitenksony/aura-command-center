import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users, HardHat, Briefcase, DollarSign, ShieldCheck, Building2, ShieldAlert, LifeBuoy,
} from "lucide-react";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { TopBar } from "@/components/admin/TopBar";
import { StatCard } from "@/components/admin/StatCard";
import { LiveActivity } from "@/components/admin/LiveActivity";
import { MapPanel } from "@/components/admin/MapPanel";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { VerificationPanel } from "@/components/admin/VerificationPanel";
import { FraudPanel } from "@/components/admin/FraudPanel";
import { TransactionsTable } from "@/components/admin/TransactionsTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora — Super Admin Control Center" },
      { name: "description", content: "Real-time operations, verification, fraud, and payments for the hyperlocal micro-job marketplace." },
    ],
  }),
  component: Dashboard,
});

const spark = (seed: number) =>
  Array.from({ length: 20 }, (_, i) => 30 + Math.sin(i / 2 + seed) * 14 + Math.cos(i / 3 + seed) * 8 + i);

function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex min-h-screen w-full text-white">
      <AppSidebar active={active} onSelect={setActive} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />

        <main className="flex-1 p-6 space-y-6">
          {/* Heading */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Operations Overview</div>
              <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-white">
                Welcome back, <span className="text-gradient">Alex</span>
              </h1>
              <p className="text-sm text-white/50 mt-1">Here's a real-time pulse of the Nexora marketplace.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition">Today</button>
              <button className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition">7d</button>
              <button className="h-9 px-3 text-xs rounded-lg text-white"
                style={{ background: "var(--gradient-primary)", boxShadow: "0 8px 24px -10px oklch(0.62 0.21 275 / 0.6)" }}>30d</button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
            <StatCard label="Total Users"          value={284921} delta={12.4} icon={Users}        tone="primary" data={spark(1)} />
            <StatCard label="Active Workers"       value={18420}  delta={8.1}  icon={HardHat}      tone="cyan"    data={spark(2)} />
            <StatCard label="Live Jobs"            value={1284}   delta={24.6} icon={Briefcase}    tone="success" data={spark(3)} />
            <StatCard label="Platform Revenue"     value={184290} prefix="$"   delta={18.4} icon={DollarSign}  tone="primary" data={spark(4)} />
            <StatCard label="Pending Verifications" value={324}   delta={-3.2} icon={ShieldCheck}  tone="warning" data={spark(5)} />
            <StatCard label="Active Businesses"    value={5612}   delta={5.7}  icon={Building2}    tone="cyan"    data={spark(6)} />
            <StatCard label="Fraud Alerts"         value={37}     delta={-14.2} icon={ShieldAlert} tone="danger"  data={spark(7)} />
            <StatCard label="Support Tickets"      value={142}    delta={2.4}  icon={LifeBuoy}     tone="success" data={spark(8)} />
          </div>

          {/* Map + Activity */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-8"><MapPanel /></div>
            <div className="col-span-12 xl:col-span-4 h-[460px]"><LiveActivity /></div>
          </div>

          {/* Revenue + Fraud */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-8"><RevenueChart /></div>
            <div className="col-span-12 xl:col-span-4"><FraudPanel /></div>
          </div>

          {/* Verification */}
          <VerificationPanel />

          {/* Transactions */}
          <TransactionsTable />

          <footer className="pt-2 pb-6 text-center text-[11px] text-white/35">
            Nexora Operations Console · v4.2 · Region: Global · Latency 38ms
          </footer>
        </main>
      </div>
    </div>
  );
}
