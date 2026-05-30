import { ShieldAlert, AlertTriangle, UserX, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

const alerts = [
  { id: "FR-9821", title: "Multiple accounts from single device", risk: 92, type: "Account farming", loc: "Mumbai, IN" },
  { id: "FR-9820", title: "Unusual payout pattern detected",     risk: 78, type: "Payment anomaly", loc: "Berlin, DE" },
  { id: "FR-9818", title: "Fake job posting flagged by ML",       risk: 65, type: "Fake listing",    loc: "Toronto, CA" },
];

export function FraudPanel() {
  return (
    <div className="rounded-2xl glass gradient-border p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[var(--color-danger)]" />
          <h3 className="text-sm font-semibold text-white tracking-tight">Fraud Detection</h3>
          <span className="text-[10px] text-[var(--color-danger)] px-1.5 py-0.5 rounded-md"
            style={{ background: "oklch(0.65 0.23 27 / 0.12)" }}>3 ACTIVE</span>
        </div>
        <button className="text-xs text-white/50 hover:text-white">Open</button>
      </div>
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li key={a.id} className="rounded-xl border border-white/8 p-3 hover:bg-white/[0.03] transition">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-9 w-9 rounded-lg shrink-0"
                style={{ background: "oklch(0.65 0.23 27 / 0.12)" }}>
                <AlertTriangle className="h-4 w-4 text-[var(--color-danger)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 tabular-nums">{a.id}</span>
                  <span className="text-[10px] text-white/40">·</span>
                  <span className="text-[10px] text-white/40">{a.loc}</span>
                </div>
                <div className="text-sm text-white font-medium mt-0.5">{a.title}</div>
                <div className="text-[11px] text-white/45 mt-0.5">{a.type}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${a.risk}%`, background: a.risk > 80 ? "var(--color-danger)" : a.risk > 60 ? "var(--color-warning)" : "var(--color-cyan)" }} />
                  </div>
                  <span className="text-[10px] text-white/60 tabular-nums w-10 text-right">{a.risk} risk</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button className="grid place-items-center h-7 w-7 rounded-md text-white/60 hover:text-white hover:bg-white/5"><Eye className="h-3.5 w-3.5" /></button>
                <button className="grid place-items-center h-7 w-7 rounded-md text-[var(--color-danger)] hover:bg-[oklch(0.65_0.23_27_/_0.1)]"><UserX className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
