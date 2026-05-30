import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Search, UserPlus, Download, MoreHorizontal, Mail, Ban, ShieldCheck, Eye } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/users")({
  component: UsersLayout,
});

export type User = {
  name: string;
  email: string;
  role: "Customer" | "Worker";
  city: string;
  joined: string;
  spend: number;
  status: "Active" | "Pending" | "Suspended";
};

export const initialUsers: User[] = [
  { name: "Sofia Martinez",    email: "sofia@m.com",     role: "Customer", city: "New York, NY", joined: "Mar 12, 2024", spend: 1840, status: "Active" },
  { name: "Kenji Watanabe",    email: "kenji@w.io",      role: "Worker",   city: "Austin, TX",   joined: "Jan 04, 2024", spend: 0,    status: "Active" },
  { name: "Amara Okonkwo",     email: "amara@o.co",      role: "Customer", city: "Lagos, NG",    joined: "Dec 22, 2023", spend: 612,  status: "Suspended" },
  { name: "Liam O'Connor",     email: "liam@oc.com",     role: "Customer", city: "Dublin, IE",   joined: "Aug 18, 2024", spend: 980,  status: "Active" },
  { name: "Priya Raghavan",    email: "priya@r.in",      role: "Worker",   city: "Mumbai, IN",   joined: "Jul 02, 2024", spend: 0,    status: "Active" },
  { name: "Noah Becker",       email: "noah@b.de",       role: "Customer", city: "Berlin, DE",   joined: "May 30, 2024", spend: 2410, status: "Active" },
  { name: "Mei Lin",           email: "mei@lin.tw",      role: "Customer", city: "Taipei, TW",   joined: "Sep 14, 2024", spend: 188,  status: "Pending" },
  { name: "Jordan Reyes",      email: "jordan@r.com",    role: "Worker",   city: "Toronto, CA",  joined: "Feb 11, 2024", spend: 0,    status: "Active" },
];

export const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const statusStyle: Record<string, string> = {
  Active:    "text-[var(--color-success)] bg-[oklch(0.72_0.18_150_/_0.12)]",
  Pending:   "text-[var(--color-warning)] bg-[oklch(0.82_0.17_85_/_0.12)]",
  Suspended: "text-[var(--color-danger)]  bg-[oklch(0.65_0.23_27_/_0.12)]",
};

const TABS = ["All", "Customers", "Workers", "Suspended"] as const;
type Tab = typeof TABS[number];

function UsersLayout() {
  return <Outlet />;
}

export function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "", role: "Customer" as "Customer" | "Worker" });

  const filtered = useMemo(() => users.filter((u) => {
    if (tab === "Customers" && u.role !== "Customer") return false;
    if (tab === "Workers" && u.role !== "Worker") return false;
    if (tab === "Suspended" && u.status !== "Suspended") return false;
    if (query && !`${u.name} ${u.email} ${u.city}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [users, tab, query]);

  const handleExport = () => {
    const headers = ["Name", "Email", "Role", "City", "Joined", "Lifetime Spend", "Status"];
    const rows = filtered.map((u) => [u.name, u.email, u.role, u.city, u.joined, String(u.spend), u.status]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} users to CSV`);
  };

  const handleInvite = () => {
    if (!invite.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) {
      toast.error("Enter a valid email address");
      return;
    }
    const name = invite.name || invite.email.split("@")[0];
    setUsers((prev) => [
      {
        name,
        email: invite.email,
        role: invite.role,
        city: "—",
        joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        spend: 0,
        status: "Pending",
      },
      ...prev,
    ]);
    toast.success(`Invitation sent to ${invite.email}`);
    setInvite({ name: "", email: "", role: "Customer" });
    setInviteOpen(false);
  };

  const setStatus = (email: string, status: User["status"]) => {
    setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, status } : u)));
    toast.success(status === "Suspended" ? "User suspended" : "User reinstated");
  };

  return (
    <PageShell
      eyebrow="Identity"
      title="Users"
      description="Browse, search, and manage every customer and worker on the platform."
      actions={
        <>
          <button onClick={handleExport} className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5 inline-flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Export CSV</button>
          <button onClick={() => setInviteOpen(true)} className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><UserPlus className="h-3.5 w-3.5" /> Invite</button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Users" value={users.length.toLocaleString()} accent="var(--color-primary)" />
        <StatTile label="Active" value={users.filter((u) => u.status === "Active").length.toLocaleString()} accent="var(--color-success)" />
        <StatTile label="Suspended" value={users.filter((u) => u.status === "Suspended").length.toLocaleString()} accent="var(--color-danger)" />
        <StatTile label="Pending" value={users.filter((u) => u.status === "Pending").length.toLocaleString()} accent="var(--color-cyan)" />
      </div>

      <div className="rounded-2xl glass gradient-border overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div className="flex items-center gap-1 text-xs text-white/55">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 h-8 rounded-md ${tab === t ? "bg-white/10 text-white" : "hover:bg-white/5"}`}>{t}</button>
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
            {filtered.map((u) => (
              <tr key={u.email} className="border-t border-white/5 hover:bg-white/[0.025]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-[10px] font-bold text-white">{u.name.split(" ").map((s) => s[0]).join("")}</div>
                    <div>
                      <Link to="/users/$slug" params={{ slug: slugify(u.name) }} className="text-white font-medium hover:text-[var(--color-cyan)] transition-colors">
                        {u.name}
                      </Link>
                      <div className="text-[11px] text-white/45">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-white/70">{u.role}</td>
                <td className="px-5 py-3 text-white/70">{u.city}</td>
                <td className="px-5 py-3 text-white/55 text-xs">{u.joined}</td>
                <td className="px-5 py-3 text-right text-white tabular-nums">${u.spend.toLocaleString()}</td>
                <td className="px-5 py-3"><span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-md ${statusStyle[u.status]}`}>{u.status}</span></td>
                <td className="px-5 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-white/50 hover:text-white"><MoreHorizontal className="h-4 w-4" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => navigate({ to: "/users/$slug", params: { slug: slugify(u.name) } })}><Eye className="h-3.5 w-3.5 mr-2" /> View profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { navigator.clipboard?.writeText(u.email); toast.success("Email copied"); }}><Mail className="h-3.5 w-3.5 mr-2" /> Copy email</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {u.status === "Suspended" ? (
                        <DropdownMenuItem onClick={() => setStatus(u.email, "Active")}><ShieldCheck className="h-3.5 w-3.5 mr-2" /> Reinstate</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => setStatus(u.email, "Suspended")} className="text-[var(--color-danger)]"><Ban className="h-3.5 w-3.5 mr-2" /> Suspend</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-xs text-white/40">No users match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a user</DialogTitle>
            <DialogDescription>They'll receive an email to set up their account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="iname">Full name</Label>
              <Input id="iname" value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iemail">Email</Label>
              <Input id="iemail" type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="jane@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="irole">Role</Label>
              <Select value={invite.role} onValueChange={(v) => setInvite({ ...invite, role: v as "Customer" | "Worker" })}>
                <SelectTrigger id="irole"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Worker">Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setInviteOpen(false)} className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5">Cancel</button>
            <button onClick={handleInvite} className="h-9 px-3 text-xs rounded-lg text-white" style={{ background: "var(--gradient-primary)" }}>Send invite</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageShell>
  );
}
