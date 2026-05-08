import { createFileRoute } from "@tanstack/react-router";
import { Gavel, MessageSquare, FileText, Clock } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/disputes")({
  head: () => ({ meta: [{ title: "Disputes — Nexora" }] }),
  component: DisputesPage,
});

const disputes = [
  { id: "D-1187", title: "Service not completed",       parties: "Alex G. ↔ Marcus T.", amount: 220, sla: "2h 12m", priority: "High",   status: "Open"          },
  { id: "D-1186", title: "Damaged item during move",    parties: "Iris Co. ↔ Stratus",   amount: 480, sla: "5h 04m", priority: "High",   status: "Investigating" },
  { id: "D-1185", title: "Incorrect billing",            parties: "Noah B. ↔ Helena N.",  amount: 89,  sla: "12h",    priority: "Medium", status: "Awaiting"      },
  { id: "D-1184", title: "Refund requested",             parties: "Sofia L. ↔ Northwind", amount: 156, sla: "1d",     priority: "Low",    status: "Open"          },
  { id: "D-1183", title: "Worker no-show",               parties: "Liam O. ↔ Carlos R.",  amount: 110, sla: "—",      priority: "High",   status: "Resolved"      },
];

const priColor: Record<string, string> = {
  High:   "text-[var(--color-danger)]  bg-[oklch(0.65_0.23_27_/_0.12)]",
  Medium: "text-[var(--color-warning)] bg-[oklch(0.82_0.17_85_/_0.12)]",
  Low:    "text-[var(--color-cyan)]    bg-[oklch(0.74_0.15_210_/_0.12)]",
};

function DisputesPage() {
  return (
    <PageShell eyebrow="Resolution" title="Dispute Management" description="Mediate complaints between customers, workers, and businesses.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Open" value="42" accent="var(--color-danger)" />
        <StatTile label="Investigating" value="18" accent="var(--color-warning)" />
        <StatTile label="Resolved · 7d" value="124" accent="var(--color-success)" />
        <StatTile label="Avg resolution" value="14h 22m" accent="var(--color-cyan)" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 rounded-2xl glass gradient-border overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Gavel className="h-4 w-4 text-[var(--color-warning)]" />
            <h3 className="text-sm font-semibold text-white">Active disputes</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-white/40">
                <th className="text-left font-medium px-5 py-3">Case</th>
                <th className="text-left font-medium px-5 py-3">Parties</th>
                <th className="text-left font-medium px-5 py-3">Priority</th>
                <th className="text-left font-medium px-5 py-3">SLA</th>
                <th className="text-right font-medium px-5 py-3">Amount</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d.id} className="border-t border-white/5 hover:bg-white/[0.025] cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="text-white font-medium">{d.title}</div>
                    <div className="text-[11px] text-white/40 font-mono">{d.id}</div>
                  </td>
                  <td className="px-5 py-3 text-white/70 text-xs">{d.parties}</td>
                  <td className="px-5 py-3"><span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-md ${priColor[d.priority]}`}>{d.priority}</span></td>
                  <td className="px-5 py-3 text-white/60 text-xs"><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{d.sla}</span></td>
                  <td className="px-5 py-3 text-right text-white tabular-nums">${d.amount}</td>
                  <td className="px-5 py-3 text-white/70">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-12 xl:col-span-4 rounded-2xl glass gradient-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-semibold text-white">Case #D-1187</h3>
          </div>
          <div className="text-xs text-white/55">Service not completed · $220 · Brooklyn, NY</div>

          <div className="mt-4 space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
            {[
              { who: "Alex G.",   side: "left",  msg: "The worker left after 30 min without finishing the job.", t: "2h ago" },
              { who: "Marcus T.", side: "right", msg: "I needed a part not on site. Returning tomorrow.",         t: "1h ago" },
              { who: "Admin",     side: "right", msg: "Refund $80 for partial completion?",                       t: "10m ago" },
            ].map((m, i) => (
              <div key={i} className={`flex ${m.side === "right" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl p-2.5 text-xs ${m.side === "right" ? "bg-[var(--color-primary)]/20 text-white" : "bg-white/5 text-white/80"}`}>
                  <div className="text-[10px] text-white/45 mb-0.5">{m.who} · {m.t}</div>
                  {m.msg}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="h-9 text-xs rounded-lg text-white" style={{ background: "var(--gradient-primary)" }}>Resolve</button>
            <button className="h-9 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5">Escalate</button>
            <button className="h-9 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5">Refund</button>
            <button className="h-9 text-xs rounded-lg text-[var(--color-danger)] border border-[oklch(0.65_0.23_27_/_0.4)]">Suspend</button>
          </div>
          <div className="mt-3 text-[11px] text-white/40 inline-flex items-center gap-1"><FileText className="h-3 w-3" />3 evidence files attached</div>
        </div>
      </div>
    </PageShell>
  );
}
