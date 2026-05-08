import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Shield, CreditCard, MessageSquare, Mail, ShieldCheck, Percent, Globe } from "lucide-react";
import { PageShell } from "@/components/admin/PageShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Nexora" }] }),
  component: SettingsPage,
});

const sections = [
  { icon: SettingsIcon,  title: "Platform Settings",     desc: "General configuration, branding, and feature flags.",   items: ["App name", "Default locale", "Feature flags"] },
  { icon: Shield,        title: "Security",              desc: "Authentication policies, IP allowlists, and audit logs.", items: ["2FA enforcement", "Session length", "IP allowlist"] },
  { icon: CreditCard,    title: "Payment Gateways",      desc: "Stripe, PayPal, Wise, and ACH provider configuration.",  items: ["Stripe", "PayPal", "Wise"] },
  { icon: MessageSquare, title: "SMS Providers",         desc: "Twilio, MessageBird, and regional SMS carriers.",         items: ["Twilio", "MessageBird"] },
  { icon: Mail,          title: "Email Providers",       desc: "Transactional and marketing email senders.",              items: ["Postmark", "SendGrid"] },
  { icon: ShieldCheck,   title: "Verification Providers", desc: "KYC, document, and liveness vendors.",                    items: ["Onfido", "Persona", "Veriff"] },
  { icon: Percent,       title: "Commission Settings",   desc: "Per-category commission, referral bonuses, and payouts.",  items: ["Cleaning 18%", "Moving 14%", "Plumbing 16%"] },
  { icon: Globe,         title: "Geo Restrictions",      desc: "Country, region, and city-level availability.",           items: ["186 countries", "32 restricted regions"] },
];

function SettingsPage() {
  return (
    <PageShell eyebrow="Configuration" title="Settings" description="Tune the platform — security, payments, providers, and more.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div key={s.title} className="rounded-2xl glass gradient-border p-5 hover-lift cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.15))", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{s.title}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{s.desc}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {s.items.map((i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md text-white/70" style={{ background: "oklch(1 0 0 / 0.05)" }}>{i}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
