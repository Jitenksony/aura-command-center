import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  Settings as SettingsIcon, Shield, CreditCard, MessageSquare, Mail,
  ShieldCheck, Percent, Globe, LayoutGrid, Lock,
} from "lucide-react";
import { FormSkeleton } from "@/components/admin/PageSkeletons";
import { PageShell } from "@/components/admin/PageShell";
import {
  AdminAccessProvider, PersonaSwitcher, SECTION_PERMS, useAdminAccess,
} from "@/lib/admin-access";

export const Route = createFileRoute("/settings")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<FormSkeleton {...{ eyebrow: "Configuration" }} />),
  head: () => ({ meta: [{ title: "Settings — Nexora" }] }),
  component: SettingsLayout,
});

type NavItem = { to: string; label: string; icon: typeof SettingsIcon; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/settings",              label: "Overview",     icon: LayoutGrid,    exact: true },
  { to: "/settings/platform",     label: "Platform",     icon: SettingsIcon },
  { to: "/settings/security",     label: "Security",     icon: Shield },
  { to: "/settings/payments",     label: "Payments",     icon: CreditCard },
  { to: "/settings/sms",          label: "SMS",          icon: MessageSquare },
  { to: "/settings/email",        label: "Email",        icon: Mail },
  { to: "/settings/verification", label: "Verification", icon: ShieldCheck },
  { to: "/settings/commission",   label: "Commission",   icon: Percent },
  { to: "/settings/geo",          label: "Geo",          icon: Globe },
];

function SettingsLayout() {
  return (
    <AdminAccessProvider>
      <PageShell
        eyebrow="Configuration"
        title="Settings"
        description="Tune the Nexora platform — security, payments, providers, commissions, and reach."
      >
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
            <div className="sticky top-4 space-y-2">
              <PersonaSwitcher />
              <SettingsNav />
            </div>
          </aside>
          <section className="col-span-12 lg:col-span-9 xl:col-span-10 space-y-4">
            <Outlet />
          </section>
        </div>
      </PageShell>
    </AdminAccessProvider>
  );
}

function SettingsNav() {
  const { can } = useAdminAccess();
  return (
    <nav className="rounded-2xl glass gradient-border p-2">
      {NAV.map((n) => {
        const required = SECTION_PERMS[n.to];
        const locked = required ? !can(required) : false;
        return (
          <Link
            key={n.to}
            to={n.to as "/settings"}
            activeOptions={{ exact: n.exact ?? false }}
            className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/65 hover:text-white hover:bg-white/5 transition data-[status=active]:text-white data-[status=active]:bg-[oklch(0.62_0.21_275_/_0.15)]"
            title={locked ? `Read-only · needs ${required?.join(" + ")}` : undefined}
          >
            <n.icon className="h-3.5 w-3.5" />
            <span className="flex-1">{n.label}</span>
            {locked && <Lock className="h-3 w-3 text-white/40" />}
          </Link>
        );
      })}
    </nav>
  );
}
