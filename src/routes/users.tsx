import { createFileRoute } from "@tanstack/react-router";
import { Search, UserPlus, Download, MoreHorizontal } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users — Nexora" }] }),
  component: UsersPage,
});

const users = [
  { name: "Sofia Martinez",    email: "sofia@m.com",     role: "Customer", city: "New York, NY", joined: "Mar 12, 2024", spend: 1840, status: "Active" },
  { name: "Kenji Watanabe",    email: "kenji@w.io",      role: "Worker",   city: "Austin, TX",   joined: "Jan 04, 2024", spend: 0,    status: "Active" },
  { name: "Amara Okonkwo",     email: "amara@o.co",      role: "Customer", city: "Lagos, NG",    joined: "Dec 22, 2023", spend: 612,  status: "Suspended" },
  { name: "Liam O'Connor",     email: "liam@oc.com",     role: "Customer", city: "Dublin, IE",   joined: "Aug 18, 2024", spend: 980,  status: "Active" },
  { name: "Priya Raghavan",    email: "priya@r.in",      role: "Worker",   city: "Mumbai, IN",   joined: "Jul 02, 2024", spend: 0,    status: "Active" },
  { name: "Noah Becker",       email: "noah@b.de",       role: "Customer", city: "Berlin, DE",   joined: "May 30, 2024", spend: 2410, status: "Active" },
  { name: "Mei Lin",           email: "mei@lin.tw",      role: "Customer", city: "Taipei, TW",   joined: "Sep 14, 2024", spend: 188,  status: "Pending" },
  { name: "Jordan Reyes",      email: "jordan@r.com",    role: "Worker",   city: "Toronto, CA",  joined: "Feb 11, 2024", spend: 0,    status: "Active" },
];

const statusStyle: Record<string, string> = {
  Active:    "text-[var(--color-success)] bg-[oklch(0.72_0.18_150_/_0.12)]",
  Pending:   "text-[var(--color-warning)] bg-[oklch(0.82_0.17_85_/_0.12)]",
  Suspended: "text-[var(--color-danger)]  bg-[oklch(0.65_0.23_27_/_0.12)]",
};

function UsersPage() {
  return (
    <PageShell
      eyebrow="Identity"
      title="Users"
      description="Browse, search, and manage every customer and worker on the platform."
      actions={
        <>
          <button className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5 inline-flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Export CSV</button>
          <button className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><UserPlus className="h-3.5 w-3.5" /> Invite</button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Users" value="284,921" accent="var(--color-primary)" />
        <StatTile label="New today" value="+1,284" accent="var(--color-success)" />
        <StatTile label="Suspended" value="612" accent="var(--color-danger)" />
        <StatTile label="Avg LTV" value="$486" accent="var(--color-cyan)" />
      </div>

      <div className="rounded-2xl glass gradient-border overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input placeholder="Search users…" className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div className="flex items-center gap-1 text-xs text-white/55">
            {["All", "Customers", "Workers", "Suspended"].map((t, i) => (
              <button key={t} className={`px-3 h-8 rounded-md ${i === 0 ? "bg-white/10 text-white" : "hover:bg-white/5"}`}>{t}</button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-white/40">
              <th className="text-left font-medium px-5 py-3">User</th>
              <th className="text-left font-medium px-5 py-3">Role</th>
              <th className="text-left font-medium px-5 py-3">City</th>
              <th className="text-left font-medium px-5 py-3">Joined</th>
              <th className="text-right font-medium px-5 py-3">Lifetime Spend</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-t border-white/5 hover:bg-white/[0.025]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-[10px] font-bold text-white">{u.name.split(" ").map((s) => s[0]).join("")}</div>
                    <div>
                      <div className="text-white font-medium">{u.name}</div>
                      <div className="text-[11px] text-white/45">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-white/70">{u.role}</td>
                <td className="px-5 py-3 text-white/70">{u.city}</td>
                <td className="px-5 py-3 text-white/55 text-xs">{u.joined}</td>
                <td className="px-5 py-3 text-right text-white tabular-nums">${u.spend.toLocaleString()}</td>
                <td className="px-5 py-3"><span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-md ${statusStyle[u.status]}`}>{u.status}</span></td>
                <td className="px-5 py-3 text-right"><button className="text-white/50 hover:text-white"><MoreHorizontal className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
