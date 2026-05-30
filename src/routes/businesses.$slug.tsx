import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { biz, slugify, type Business } from "./businesses";
import {
  ArrowLeft, Mail, Phone, Clock, Shield, Users, FileText, Wallet,
  CheckCircle2, AlertCircle, Briefcase, CreditCard, Activity, Building2, MapPin,
  LifeBuoy, Banknote,
} from "lucide-react";

export const Route = createFileRoute("/businesses/$slug")({
  loader: ({ params }) => {
    const b = biz.find((x) => slugify(x.name) === params.slug);
    if (!b) throw notFound();
    return b;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "Business"} — Nexora` }] }),
  notFoundComponent: () => (
    <PageShell eyebrow="Demand" title="Business not found" description="">
      <Link to="/businesses" className="text-xs text-[var(--color-cyan)] hover:underline inline-flex items-center gap-1.5">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to businesses
      </Link>
    </PageShell>
  ),
  component: BusinessDetailPage,
});

function BusinessDetailPage() {
  const b = Route.useLoaderData() as Business;

  const idChecks = [
    { label: "Business registration", ok: true,  detail: "EIN verified · IRS Pub 78" },
    { label: "Tax W-9 on file",        ok: true,  detail: "Submitted Jan 2024" },
    { label: "Proof of address",       ok: true,  detail: "Utility bill · 2 mo old" },
    { label: "Owner ID (KYC)",         ok: b.health > 70, detail: b.health > 70 ? "Passport · matched" : "Pending review" },
    { label: "Insurance certificate",  ok: b.plan !== "Growth", detail: b.plan !== "Growth" ? "$2M liability · active" : "Not required for Growth plan" },
  ];

  const payments = [
    { id: "INV-9821", date: "2 days ago",  amount: 4200, method: "ACH · Chase ••4421", status: "Paid" },
    { id: "INV-9780", date: "12 days ago", amount: 8800, method: "Wire · Mercury",     status: "Paid" },
    { id: "INV-9714", date: "Apr 18",      amount: 1240, method: "Card · Visa ••8801", status: "Paid" },
    { id: "INV-9655", date: "Apr 02",      amount: 6650, method: "ACH · Chase ••4421", status: "Refunded" },
    { id: "INV-9601", date: "Mar 22",      amount: 3120, method: "ACH · Chase ••4421", status: "Paid" },
  ];

  const works = [
    { id: `J-${2400 + b.jobs}`,     title: "Same-day catering for offsite", status: "Completed", spend: 4200, when: "2h ago" },
    { id: `J-${2400 + b.jobs - 7}`, title: "Office deep clean · 12,000 sqft", status: "Completed", spend: 2880, when: "yesterday" },
    { id: `J-${2400 + b.jobs - 22}`, title: "Moving · 3 trucks · cross-state", status: "In progress", spend: 9600, when: "3 days ago" },
    { id: `J-${2400 + b.jobs - 38}`, title: "Event staffing · 14 servers", status: "Completed", spend: 5460, when: "1 week ago" },
    { id: `J-${2400 + b.jobs - 55}`, title: "HVAC quarterly maintenance", status: "Disputed", spend: 1840, when: "2 weeks ago" },
  ];

  const activity = [
    { icon: <Briefcase className="h-3.5 w-3.5 text-[var(--color-cyan)]" />,    text: `Posted job #${2400 + b.jobs}`,            when: "2h ago" },
    { icon: <CreditCard className="h-3.5 w-3.5 text-[var(--color-success)]" />, text: "Paid invoice INV-9821 for $4,200",        when: "yesterday" },
    { icon: <Users className="h-3.5 w-3.5 text-[var(--color-primary)]" />,     text: "Onboarded 3 new team members",            when: "3 days ago" },
    { icon: <Shield className="h-3.5 w-3.5 text-[var(--color-warning)]" />,    text: "Updated insurance certificate",            when: "5 days ago" },
    { icon: <Wallet className="h-3.5 w-3.5 text-[var(--color-success)]" />,    text: "Auto-recharge enabled · $5,000 threshold", when: "1 week ago" },
    { icon: <AlertCircle className="h-3.5 w-3.5 text-[var(--color-warning)]" />, text: "Dispute opened on INV-9601 (resolved)",   when: "2 weeks ago" },
    { icon: <Briefcase className="h-3.5 w-3.5 text-[var(--color-cyan)]" />,    text: `Posted job #${2400 + b.jobs - 12}`,       when: "3 weeks ago" },
    { icon: <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />, text: "Identity verification completed",        when: "Joined " + (b.joined ?? "") },
  ];

  const statusStyle: Record<string, string> = {
    Completed:   "text-[var(--color-success)]",
    "In progress": "text-[var(--color-cyan)]",
    Disputed:    "text-[var(--color-danger)]",
    Paid:        "text-[var(--color-success)]",
    Refunded:    "text-[var(--color-warning)]",
  };

  return (
    <PageShell
      eyebrow="Business profile"
      title={b.name}
      description={`${b.industry} · ${b.city} · ${b.plan} plan`}
      actions={
        <Link to="/businesses" className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5 inline-flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> All businesses
        </Link>
      }
    >
      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatTile label="Lifetime spend" value={`$${b.spend.toLocaleString()}`} accent="var(--color-success)" />
        <StatTile label="Jobs posted" value={b.jobs.toLocaleString()} accent="var(--color-primary)" />
        <StatTile label="Active contracts" value={String(b.contracts ?? 0)} accent="var(--color-cyan)" />
        <StatTile label="Tickets raised" value={String(Math.max(2, Math.round(b.jobs / 120)))} accent="var(--color-warning)" />
        <StatTile label="Health score" value={`${b.health}/100`} accent={b.health > 80 ? "var(--color-success)" : b.health > 60 ? "var(--color-warning)" : "var(--color-danger)"} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Identity & company */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="Company" icon={<Building2 className="h-4 w-4 text-[var(--color-cyan)]" />}>
            <KV icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={b.email ?? "—"} />
            <KV icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={b.phone ?? "—"} />
            <KV icon={<MapPin className="h-3.5 w-3.5" />} label="HQ" value={b.city} />
            <KV icon={<Clock className="h-3.5 w-3.5" />} label="Joined" value={b.joined ?? "—"} />
            <KV icon={<Users className="h-3.5 w-3.5" />} label="Team contacts" value={String(b.contacts ?? 0)} />
            <KV icon={<FileText className="h-3.5 w-3.5" />} label="Contracts" value={String(b.contracts ?? 0)} />
            <KV icon={<Shield className="h-3.5 w-3.5" />} label="Status" value={b.suspended ? `Suspended · ${b.suspendReason}` : "Active"} />
          </Panel>

          <Panel title="ID verification" icon={<Shield className="h-4 w-4 text-[var(--color-success)]" />}>
            <ul className="space-y-2">
              {idChecks.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-xs">
                  {c.ok
                    ? <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                    : <AlertCircle className="h-4 w-4 text-[var(--color-warning)] shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <div className="text-white">{c.label}</div>
                    <div className="text-white/45 text-[11px]">{c.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Lifetime works + payments */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel title="Lifetime works" icon={<Briefcase className="h-4 w-4 text-[var(--color-primary)]" />}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-white/40">
                  <th className="text-left font-medium pb-2">Job</th>
                  <th className="text-left font-medium pb-2">Status</th>
                  <th className="text-left font-medium pb-2">When</th>
                  <th className="text-right font-medium pb-2">Spend</th>
                </tr>
              </thead>
              <tbody>
                {works.map((w) => (
                  <tr key={w.id} className="border-t border-white/5">
                    <td className="py-2.5">
                      <div className="text-white">{w.title}</div>
                      <div className="text-[11px] text-white/40 font-mono">{w.id}</div>
                    </td>
                    <td className={`py-2.5 text-xs ${statusStyle[w.status] ?? "text-white/70"}`}>{w.status}</td>
                    <td className="py-2.5 text-xs text-white/55">{w.when}</td>
                    <td className="py-2.5 text-right text-white tabular-nums">${w.spend.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Payment history" icon={<CreditCard className="h-4 w-4 text-[var(--color-success)]" />}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-white/40">
                  <th className="text-left font-medium pb-2">Invoice</th>
                  <th className="text-left font-medium pb-2">Method</th>
                  <th className="text-left font-medium pb-2">Date</th>
                  <th className="text-left font-medium pb-2">Status</th>
                  <th className="text-right font-medium pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="py-2.5 text-white font-mono text-xs">{p.id}</td>
                    <td className="py-2.5 text-white/70 text-xs">{p.method}</td>
                    <td className="py-2.5 text-white/55 text-xs">{p.date}</td>
                    <td className={`py-2.5 text-xs ${statusStyle[p.status] ?? "text-white/70"}`}>{p.status}</td>
                    <td className="py-2.5 text-right text-white tabular-nums">${p.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Activity log" icon={<Activity className="h-4 w-4 text-[var(--color-cyan)]" />}>
            <ol className="relative border-l border-white/10 ml-2 space-y-3">
              {activity.map((a, i) => (
                <li key={i} className="pl-4 relative">
                  <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[oklch(0.2_0.04_265)] border border-white/15 grid place-items-center">{a.icon}</span>
                  <div className="text-xs text-white">{a.text}</div>
                  <div className="text-[11px] text-white/40">{a.when}</div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
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
      <span className="text-white/85 truncate">{value}</span>
    </div>
  );
}
