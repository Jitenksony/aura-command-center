import { createFileRoute } from "@tanstack/react-router";
import { UserCog, ShieldCheck, Plus } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Management — Nexora" }] }),
  component: AdminPage,
});

const admins = [
  { name: "Alex Kovac",      role: "Super Admin",     perms: "All",                     last: "Online now", color: "var(--color-success)" },
  { name: "Maya Singh",      role: "Operations Lead", perms: "Jobs, Disputes, Workers", last: "12m ago",    color: "var(--color-cyan)" },
  { name: "Diego Fernández", role: "Trust & Safety",  perms: "KYC, Fraud, Suspensions", last: "1h ago",     color: "var(--color-cyan)" },
  { name: "Ingrid Holm",     role: "Finance",         perms: "Payments, Refunds",       last: "Yesterday",  color: "var(--color-warning)" },
  { name: "Tomás Pereira",   role: "Support Lead",    perms: "Tickets, Users",          last: "3d ago",     color: "var(--color-warning)" },
];

function AdminPage() {
  return (
    <PageShell
      eyebrow="Access Control"
      title="Admin Management"
      description="Internal team, roles, and granular permission scopes."
      actions={<button className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><Plus className="h-3.5 w-3.5" /> Invite admin</button>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Admins" value="24" accent="var(--color-primary)" />
        <StatTile label="Online" value="9" accent="var(--color-success)" />
        <StatTile label="Roles" value="6" accent="var(--color-cyan)" />
        <StatTile label="2FA enabled" value="100%" accent="var(--color-success)" />
      </div>

      <div className="rounded-2xl glass gradient-border overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <UserCog className="h-4 w-4 text-[var(--color-cyan)]" />
          <h3 className="text-sm font-semibold text-white">Team members</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-white/40">
              <th className="text-left font-medium px-5 py-3">Name</th>
              <th className="text-left font-medium px-5 py-3">Role</th>
              <th className="text-left font-medium px-5 py-3">Permissions</th>
              <th className="text-left font-medium px-5 py-3">Last active</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.name} className="border-t border-white/5 hover:bg-white/[0.025]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-[10px] font-bold text-white">{a.name.split(" ").map((s) => s[0]).join("")}</div>
                    <div className="text-white font-medium">{a.name}</div>
                  </div>
                </td>
                <td className="px-5 py-3"><span className="inline-flex items-center gap-1 text-xs text-white/80"><ShieldCheck className="h-3.5 w-3.5 text-[var(--color-cyan)]" />{a.role}</span></td>
                <td className="px-5 py-3 text-white/60 text-xs">{a.perms}</td>
                <td className="px-5 py-3 text-xs" style={{ color: a.color }}>{a.last}</td>
                <td className="px-5 py-3 text-right"><button className="text-xs text-white/70 hover:text-white">Edit role</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
