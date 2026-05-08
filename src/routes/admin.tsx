import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TableSkeleton } from "@/components/admin/PageSkeletons";
import { UserCog, ShieldCheck, Plus, Check } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<TableSkeleton {...{ eyebrow: "Access", stats: 3, rows: 7, cols: 6 }} />),
  head: () => ({ meta: [{ title: "Admin Management — Nexora" }] }),
  component: AdminPage,
});

type Admin = {
  name: string;
  role: string;
  perms: string[];
  last: string;
  color: string;
};

const ROLES = [
  "Super Admin",
  "Operations Lead",
  "Trust & Safety",
  "Finance",
  "Support Lead",
  "Analyst",
] as const;

const ALL_PERMS = [
  "Jobs",
  "Disputes",
  "Workers",
  "KYC",
  "Fraud",
  "Suspensions",
  "Payments",
  "Refunds",
  "Tickets",
  "Users",
  "Reports",
  "Settings",
] as const;

const ROLE_PRESETS: Record<(typeof ROLES)[number], string[]> = {
  "Super Admin":     [...ALL_PERMS],
  "Operations Lead": ["Jobs", "Disputes", "Workers", "Reports"],
  "Trust & Safety":  ["KYC", "Fraud", "Suspensions", "Disputes"],
  "Finance":         ["Payments", "Refunds", "Reports"],
  "Support Lead":    ["Tickets", "Users", "Disputes"],
  "Analyst":         ["Reports"],
};

const initialAdmins: Admin[] = [
  { name: "Alex Kovac",      role: "Super Admin",     perms: ["Jobs","Disputes","Workers","KYC","Fraud","Suspensions","Payments","Refunds","Tickets","Users","Reports","Settings"], last: "Online now", color: "var(--color-success)" },
  { name: "Maya Singh",      role: "Operations Lead", perms: ["Jobs","Disputes","Workers"],         last: "12m ago",    color: "var(--color-cyan)" },
  { name: "Diego Fernández", role: "Trust & Safety",  perms: ["KYC","Fraud","Suspensions"],         last: "1h ago",     color: "var(--color-cyan)" },
  { name: "Ingrid Holm",     role: "Finance",         perms: ["Payments","Refunds"],                last: "Yesterday",  color: "var(--color-warning)" },
  { name: "Tomás Pereira",   role: "Support Lead",    perms: ["Tickets","Users"],                   last: "3d ago",     color: "var(--color-warning)" },
];

function permsLabel(perms: string[]) {
  if (perms.length >= ALL_PERMS.length) return "All";
  return perms.join(", ");
}

function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [draftRole, setDraftRole] = useState<string>("");
  const [draftPerms, setDraftPerms] = useState<string[]>([]);

  function openEdit(a: Admin) {
    setEditing(a);
    setDraftRole(a.role);
    setDraftPerms(a.perms);
  }

  function togglePerm(p: string) {
    setDraftPerms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  function save() {
    if (!editing) return;
    setAdmins((prev) =>
      prev.map((a) =>
        a.name === editing.name ? { ...a, role: draftRole, perms: draftPerms } : a,
      ),
    );
    toast.success(`Updated ${editing.name}`, {
      description: `Role: ${draftRole} · ${draftPerms.length} permission${draftPerms.length === 1 ? "" : "s"}`,
    });
    setEditing(null);
  }

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
                <td className="px-5 py-3 text-white/60 text-xs max-w-[280px] truncate">{permsLabel(a.perms)}</td>
                <td className="px-5 py-3 text-xs" style={{ color: a.color }}>{a.last}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => openEdit(a)}
                    className="text-xs text-white/70 hover:text-white px-2.5 h-8 rounded-md border border-white/10 hover:bg-white/5 transition"
                  >
                    Edit role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md bg-[oklch(0.18_0.04_265)] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit role · {editing?.name}</DialogTitle>
            <DialogDescription className="text-white/55">
              Update the team member's role and permission scopes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-white/50">Role</Label>
              <Select
                value={draftRole}
                onValueChange={(r) => {
                  setDraftRole(r);
                  const preset = ROLE_PRESETS[r as keyof typeof ROLE_PRESETS];
                  if (preset) setDraftPerms([...preset]);
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-white/40">
                Selecting a role auto-applies its default permission preset.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-white/50">Quick presets</Label>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => {
                  const preset = ROLE_PRESETS[r];
                  const isActive =
                    draftPerms.length === preset.length &&
                    preset.every((p) => draftPerms.includes(p));
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setDraftPerms([...preset])}
                      className={`text-[11px] px-2.5 h-7 rounded-md border transition ${
                        isActive
                          ? "border-[var(--color-cyan)] bg-[oklch(0.74_0.15_210_/_0.15)] text-white"
                          : "border-white/10 text-white/65 hover:bg-white/5 hover:text-white"
                      }`}
                      title={`Apply ${r} preset (${preset.length})`}
                    >
                      {r}
                      <span className="ml-1.5 text-white/40">{preset.length}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-white/50">Permissions</Label>
                <button
                  type="button"
                  onClick={() =>
                    setDraftPerms(draftPerms.length === ALL_PERMS.length ? [] : [...ALL_PERMS])
                  }
                  className="text-[11px] text-[var(--color-cyan)] hover:underline"
                >
                  {draftPerms.length === ALL_PERMS.length ? "Clear all" : "Select all"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                {ALL_PERMS.map((p) => {
                  const active = draftPerms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePerm(p)}
                      className={`flex items-center justify-between text-xs px-3 h-9 rounded-md border transition ${
                        active
                          ? "border-[var(--color-primary)] bg-[oklch(0.62_0.21_275_/_0.15)] text-white"
                          : "border-white/10 text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <span>{p}</span>
                      {active && <Check className="h-3.5 w-3.5 text-[var(--color-primary)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              onClick={() => setEditing(null)}
              className="h-9 px-4 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!draftRole}
              className="h-9 px-4 text-xs rounded-lg text-white disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
