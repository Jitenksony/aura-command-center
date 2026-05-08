import { createFileRoute } from "@tanstack/react-router";
import { Send, MessageSquare, Mail, Bell, Plus } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Nexora" }] }),
  component: NotificationsPage,
});

const campaigns = [
  { name: "Holiday surge alert",   channel: "Push",  audience: "All workers · NYC", sent: 18420, open: 64, status: "Delivered" },
  { name: "Verification reminder", channel: "Email", audience: "Pending KYC",       sent: 324,   open: 81, status: "Delivered" },
  { name: "Q2 commission update",  channel: "SMS",   audience: "Active workers",    sent: 12480, open: 92, status: "Delivered" },
  { name: "App v4.2 release",      channel: "Push",  audience: "All users",         sent: 0,     open: 0,  status: "Scheduled" },
];

function NotificationsPage() {
  return (
    <PageShell
      eyebrow="Communication"
      title="Notification Control Center"
      description="Push, SMS, and email campaigns with audience segmentation and delivery analytics."
      actions={<button className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><Plus className="h-3.5 w-3.5" /> New Campaign</button>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Sent · 24h" value="128,420" accent="var(--color-primary)" />
        <StatTile label="Open rate" value="68.4%" accent="var(--color-success)" />
        <StatTile label="Click rate" value="22.1%" accent="var(--color-cyan)" />
        <StatTile label="Failed" value="0.3%" accent="var(--color-danger)" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 rounded-2xl glass gradient-border p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Compose broadcast</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {[
                { icon: Bell, label: "Push", on: true },
                { icon: MessageSquare, label: "SMS", on: false },
                { icon: Mail, label: "Email", on: false },
              ].map((c) => (
                <button key={c.label} className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs transition ${c.on ? "text-white" : "text-white/60 hover:bg-white/5 border border-white/10"}`}
                  style={c.on ? { background: "var(--gradient-primary)" } : undefined}>
                  <c.icon className="h-3.5 w-3.5" />{c.label}
                </button>
              ))}
            </div>
            <input placeholder="Audience segment (e.g. workers in NYC, last 7d)" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--color-primary)]" />
            <input placeholder="Title" defaultValue="Surge pricing in your area" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--color-primary)]" />
            <textarea rows={4} defaultValue="High demand right now in Brooklyn — accept jobs to earn 1.4× normal rates for the next hour." className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--color-primary)] resize-none" />
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-white/45">Estimated reach: <span className="text-white">~12,400 workers</span></div>
              <button className="h-9 px-4 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><Send className="h-3.5 w-3.5" /> Send broadcast</button>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 rounded-2xl glass gradient-border overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Recent campaigns</h3>
          </div>
          <ul className="divide-y divide-white/5">
            {campaigns.map((c) => (
              <li key={c.name} className="px-5 py-3 hover:bg-white/[0.03]">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{c.name}</div>
                    <div className="text-[11px] text-white/45">{c.channel} · {c.audience}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white tabular-nums">{c.sent.toLocaleString()}</div>
                    <div className="text-[10px] text-white/45">{c.status === "Scheduled" ? "Scheduled" : `${c.open}% open`}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
