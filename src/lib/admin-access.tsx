import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, ShieldAlert, ChevronDown } from "lucide-react";

export const ALL_PERMS = [
  "Jobs", "Disputes", "Workers", "KYC", "Fraud", "Suspensions",
  "Payments", "Refunds", "Tickets", "Users", "Reports", "Settings",
] as const;
export type Perm = (typeof ALL_PERMS)[number];

export const ROLES = [
  "Super Admin", "Operations Lead", "Trust & Safety",
  "Finance", "Support Lead", "Analyst",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_PRESETS: Record<Role, Perm[]> = {
  "Super Admin":     [...ALL_PERMS],
  "Operations Lead": ["Jobs", "Disputes", "Workers", "Reports"],
  "Trust & Safety":  ["KYC", "Fraud", "Suspensions", "Disputes"],
  "Finance":         ["Payments", "Refunds", "Reports"],
  "Support Lead":    ["Tickets", "Users", "Disputes"],
  "Analyst":         ["Reports"],
};

/** Permission required to *edit* each /settings section. */
export const SECTION_PERMS: Record<string, Perm[]> = {
  "/settings/platform":     ["Settings"],
  "/settings/security":     ["Settings"],
  "/settings/payments":     ["Payments"],
  "/settings/sms":          ["Settings"],
  "/settings/email":        ["Settings"],
  "/settings/verification": ["KYC"],
  "/settings/commission":   ["Payments"],
  "/settings/geo":          ["Settings"],
};

type CurrentAdmin = { name: string; role: Role; perms: Perm[] };

const PERSONAS: CurrentAdmin[] = ROLES.map((r) => ({
  name:
    r === "Super Admin" ? "Alex Kovac" :
    r === "Operations Lead" ? "Maya Singh" :
    r === "Trust & Safety" ? "Diego Fernández" :
    r === "Finance" ? "Ingrid Holm" :
    r === "Support Lead" ? "Tomás Pereira" : "Priya Raman",
  role: r,
  perms: ROLE_PRESETS[r],
}));

type Ctx = {
  admin: CurrentAdmin;
  setRole: (r: Role) => void;
  can: (perms: Perm[]) => boolean;
};

const AccessCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "nexora.currentAdminRole";

export function AdminAccessProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("Super Admin");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved && (ROLES as readonly string[]).includes(saved)) setRoleState(saved as Role);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    try { window.localStorage.setItem(STORAGE_KEY, r); } catch {}
  };

  const value = useMemo<Ctx>(() => {
    const admin = PERSONAS.find((p) => p.role === role) ?? PERSONAS[0];
    return {
      admin,
      setRole,
      can: (perms) => perms.every((p) => admin.perms.includes(p)),
    };
  }, [role]);

  return <AccessCtx.Provider value={value}>{children}</AccessCtx.Provider>;
}

export function useAdminAccess(): Ctx {
  const ctx = useContext(AccessCtx);
  if (!ctx) throw new Error("useAdminAccess must be used inside <AdminAccessProvider>");
  return ctx;
}

/** Wrap a settings section. If the current admin lacks the required perms,
 *  shows a denied view instead of the editable form. */
export function RestrictedSection({
  perms, sectionTitle, children,
}: { perms: Perm[]; sectionTitle: string; children: ReactNode }) {
  const { admin, can } = useAdminAccess();
  const allowed = can(perms);

  return (
    <>
      <div
        className="rounded-2xl glass gradient-border px-4 py-3 flex flex-wrap items-center gap-3 text-xs"
        style={{
          borderColor: allowed ? undefined : "oklch(0.65 0.23 27 / 0.35)",
        }}
      >
        <span
          className={`inline-flex items-center gap-1.5 px-2 h-6 rounded-md font-medium ${
            allowed
              ? "text-[var(--color-success)] bg-[oklch(0.72_0.18_150_/_0.12)]"
              : "text-[var(--color-danger)] bg-[oklch(0.65_0.23_27_/_0.12)]"
          }`}
        >
          {allowed ? "Editable" : <><Lock className="h-3 w-3" /> Read-only</>}
        </span>
        <span className="text-white/55">
          Requires{" "}
          {perms.map((p, i) => (
            <span key={p}>
              <span className="text-white/85 font-medium">{p}</span>
              {i < perms.length - 1 ? " + " : ""}
            </span>
          ))}
        </span>
        <span className="text-white/30">·</span>
        <span className="text-white/55">
          Signed in as <span className="text-white/85 font-medium">{admin.name}</span> ({admin.role})
        </span>
      </div>

      {allowed ? (
        children
      ) : (
        <div className="rounded-2xl glass gradient-border p-8 text-center">
          <div
            className="mx-auto grid place-items-center h-12 w-12 rounded-xl mb-3"
            style={{ background: "oklch(0.65 0.23 27 / 0.12)", border: "1px solid oklch(0.65 0.23 27 / 0.25)" }}
          >
            <ShieldAlert className="h-6 w-6 text-[var(--color-danger)]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Access restricted</h3>
          <p className="text-[12px] text-white/55 mt-1 max-w-md mx-auto">
            Your role <span className="text-white/85 font-medium">{admin.role}</span> can't edit{" "}
            <span className="text-white/85 font-medium">{sectionTitle}</span>. Ask a Super Admin
            to grant the {perms.join(" + ")} permission, or switch persona above to preview.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 mt-4 h-8 px-3 text-xs rounded-lg border border-white/10 text-white/85 hover:bg-white/5"
          >
            Manage roles in Admin
          </Link>
        </div>
      )}
    </>
  );
}

/** Compact persona switcher shown in the settings sidebar. */
export function PersonaSwitcher() {
  const { admin, setRole } = useAdminAccess();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs text-white/85 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span
            className="grid place-items-center h-6 w-6 rounded-md text-[10px] font-semibold text-white shrink-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            {admin.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </span>
          <span className="truncate">
            <span className="block text-white truncate">{admin.name}</span>
            <span className="block text-[10px] text-white/55 truncate">{admin.role}</span>
          </span>
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 left-0 right-0 rounded-lg border border-white/10 bg-[oklch(0.18_0.02_270)] shadow-xl overflow-hidden">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 ${admin.role === r ? "text-white bg-white/[0.04]" : "text-white/75"}`}
            >
              <div className="font-medium">{r}</div>
              <div className="text-[10px] text-white/45">{ROLE_PRESETS[r].length} permissions</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
