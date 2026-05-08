import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Clock, MessageSquare } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — Nexora" }] }),
  component: SupportPage,
});

const tickets = [
  { id: "T-9921", subject: "Can't withdraw earnings",        user: "Marcus T.", priority: "High",   sla: "1h 12m", agent: "Maya S.",  status: "Open" },
  { id: "T-9920", subject: "Account locked unexpectedly",    user: "Sofia M.",  priority: "High",   sla: "2h 04m", agent: "Tomás P.", status: "In Progress" },
  { id: "T-9919", subject: "Where's my refund?",             user: "Liam O.",   priority: "Medium", sla: "5h",     agent: "Diego F.", status: "Awaiting" },
  { id: "T-9918", subject: "How do I add a payout method?",  user: "Aisha K.",  priority: "Low",    sla: "1d",     agent: "Maya S.",  status: "Open" },
  { id: "T-9917", subject: "Worker rated me unfairly",       user: "Noah B.",   priority: "Medium", sla: "8h",     agent: "—",        status: "Unassigned" },
];

const priColor: Record<string, string> = {
  High:   "text-[var(--color-danger)]  bg-[oklch(0.65_0.23_27_/_0.12)]",
  Medium: "text-[var(--color-warning)] bg-[oklch(0.82_0.17_85_/_0.12)]",
  Low:    "text-[var(--color-cyan)]    bg-[oklch(0.74_0.15_210_/_0.12)]",
};

function SupportPage() {
  return (
    <PageShell eyebrow="Customer Care" title="Support Tickets" description="Live support queue with SLA timers and agent assignments.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Open" value="142" accent="var(--color-danger)" />
        <StatTile label="In Progress" value="86" accent="var(--color-cyan)" />
        <StatTile label="Avg first response" value="4m 12s" accent="var(--color-success)" />
        <StatTile label="CSAT" value="4.7 / 5" accent="var(--color-warning)" />
      </div>

      <div className="rounded-2xl glass gradient-border overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-[var(--color-cyan)]" />
          <h3 className="text-sm font-semibold text-white">Active tickets</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-white/40">
              <th className="text-left font-medium px-5 py-3">Ticket</th>
              <th className="text-left font-medium px-5 py-3">User</th>
              <th className="text-left font-medium px-5 py-3">Priority</th>
              <th className="text-left font-medium px-5 py-3">SLA</th>
              <th className="text-left font-medium px-5 py-3">Agent</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t border-white/5 hover:bg-white/[0.025] cursor-pointer">
                <td className="px-5 py-3">
                  <div className="text-white font-medium">{t.subject}</div>
                  <div className="text-[11px] text-white/40 font-mono">{t.id}</div>
                </td>
                <td className="px-5 py-3 text-white/70">{t.user}</td>
                <td className="px-5 py-3"><span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-md ${priColor[t.priority]}`}>{t.priority}</span></td>
                <td className="px-5 py-3 text-xs text-white/60"><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{t.sla}</span></td>
                <td className="px-5 py-3 text-white/70 text-xs">{t.agent}</td>
                <td className="px-5 py-3 text-white/70 text-xs">{t.status}</td>
                <td className="px-5 py-3 text-right"><button className="text-white/60 hover:text-white"><MessageSquare className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
