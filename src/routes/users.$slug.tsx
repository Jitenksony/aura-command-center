import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Briefcase, Clock, CreditCard, Mail, MapPin, ShieldCheck, UserCircle2 } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { initialUsers, slugify, type User } from "./users";

export const Route = createFileRoute("/users/$slug")({
  loader: ({ params }) => {
    const user = initialUsers.find((entry) => slugify(entry.name) === params.slug);
    if (!user) throw notFound();
    return user;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "User"} — Nexora` }] }),
  notFoundComponent: () => (
    <PageShell eyebrow="Identity" title="User not found" description="">
      <Link to="/users" className="text-xs text-[var(--color-cyan)] hover:underline inline-flex items-center gap-1.5">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to users
      </Link>
    </PageShell>
  ),
  component: UserDetailPage,
});

function UserDetailPage() {
  const user = Route.useLoaderData() as User;

  const verificationItems = [
    { label: "Email verified", value: "Confirmed", ok: true },
    { label: "Profile review", value: user.status === "Pending" ? "Pending review" : "Approved", ok: user.status !== "Pending" },
    { label: "Identity match", value: user.role === "Worker" ? "Passport + selfie match" : "Business owner verified", ok: user.status !== "Suspended" },
    { label: "Risk status", value: user.status === "Suspended" ? "Restricted" : "Clear", ok: user.status !== "Suspended" },
  ];

  const payments = [
    { id: `PM-${slugify(user.name).slice(0, 6).toUpperCase()}-001`, date: "May 22, 2026", method: user.role === "Worker" ? "Stripe payout" : "Visa ••1840", amount: user.role === "Worker" ? 420 : user.spend || 1840, status: user.status === "Suspended" ? "Held" : "Settled" },
    { id: `PM-${slugify(user.name).slice(0, 6).toUpperCase()}-002`, date: "Apr 17, 2026", method: user.role === "Worker" ? "Bank transfer" : "ACH debit", amount: user.role === "Worker" ? 260 : Math.max(320, Math.round((user.spend || 840) * 0.42)), status: "Settled" },
  ];

  const activity = [
    { label: "Account created", when: user.joined },
    { label: user.role === "Worker" ? "Accepted dispatch #2481" : "Booked service request #2481", when: "2 days ago" },
    { label: user.role === "Worker" ? "Payout processed" : "Payment authorized", when: "1 day ago" },
    { label: user.status === "Suspended" ? "Account restricted for manual review" : "Profile health check passed", when: "4 hours ago" },
  ];

  return (
    <PageShell
      eyebrow="Identity"
      title={user.name}
      description={`${user.role} · ${user.city} · ${user.email}`}
      actions={
        <Link to="/users" className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5 inline-flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> All users
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Lifetime spend" value={`$${user.spend.toLocaleString()}`} accent="var(--color-success)" />
        <StatTile label="Status" value={user.status} accent={user.status === "Suspended" ? "var(--color-danger)" : user.status === "Pending" ? "var(--color-warning)" : "var(--color-primary)"} />
        <StatTile label="Role" value={user.role} accent="var(--color-cyan)" />
        <StatTile label="Member since" value={user.joined} accent="var(--color-primary)" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Section title="Profile" icon={<UserCircle2 className="h-4 w-4 text-[var(--color-cyan)]" />}>
            <KV icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user.email} />
            <KV icon={<MapPin className="h-3.5 w-3.5" />} label="City" value={user.city} />
            <KV icon={<Clock className="h-3.5 w-3.5" />} label="Joined" value={user.joined} />
            <KV icon={<BadgeCheck className="h-3.5 w-3.5" />} label="Role" value={user.role} />
            <KV icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Status" value={user.status} />
          </Section>

          <Section title="Verification" icon={<ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />}>
            <ul className="space-y-2">
              {verificationItems.map((item) => (
                <li key={item.label} className="flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="text-white">{item.label}</div>
                    <div className="text-[11px] text-white/45">{item.value}</div>
                  </div>
                  <span className={`mt-0.5 inline-flex h-2.5 w-2.5 rounded-full ${item.ok ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]"}`} />
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Section title="Work history" icon={<Briefcase className="h-4 w-4 text-[var(--color-primary)]" />}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-white/40">
                  <th className="text-left font-medium pb-2">Reference</th>
                  <th className="text-left font-medium pb-2">Type</th>
                  <th className="text-left font-medium pb-2">Date</th>
                  <th className="text-right font-medium pb-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((index) => (
                  <tr key={index} className="border-t border-white/5">
                    <td className="py-2.5 text-white font-mono text-xs">WK-{slugify(user.name).slice(0, 4).toUpperCase()}-{2400 + index}</td>
                    <td className="py-2.5 text-white/70 text-xs">{user.role === "Worker" ? "Completed shift" : "Completed booking"}</td>
                    <td className="py-2.5 text-white/55 text-xs">{index === 1 ? "2 days ago" : index === 2 ? "Last week" : "2 weeks ago"}</td>
                    <td className="py-2.5 text-right text-white tabular-nums">${Math.max(120, Math.round((user.spend || 600) / (index + 1))).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Payment history" icon={<CreditCard className="h-4 w-4 text-[var(--color-success)]" />}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-white/40">
                  <th className="text-left font-medium pb-2">Payment ID</th>
                  <th className="text-left font-medium pb-2">Method</th>
                  <th className="text-left font-medium pb-2">Date</th>
                  <th className="text-left font-medium pb-2">Status</th>
                  <th className="text-right font-medium pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-white/5">
                    <td className="py-2.5 text-white font-mono text-xs">{payment.id}</td>
                    <td className="py-2.5 text-white/70 text-xs">{payment.method}</td>
                    <td className="py-2.5 text-white/55 text-xs">{payment.date}</td>
                    <td className={`py-2.5 text-xs ${payment.status === "Held" ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"}`}>{payment.status}</td>
                    <td className="py-2.5 text-right text-white tabular-nums">${payment.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Recent activity" icon={<Clock className="h-4 w-4 text-[var(--color-cyan)]" />}>
            <ol className="space-y-3">
              {activity.map((item) => (
                <li key={`${item.label}-${item.when}`} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 text-xs last:border-b-0 last:pb-0">
                  <span className="text-white">{item.label}</span>
                  <span className="text-white/45">{item.when}</span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl glass gradient-border">
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
        {icon}<h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function KV({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-xs">
      <span className="inline-flex items-center gap-1.5 text-white/50">{icon}{label}</span>
      <span className="text-white/85 text-right">{value}</span>
    </div>
  );
}