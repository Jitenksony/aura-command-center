import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Settings as SettingsIcon, Shield, CreditCard, MessageSquare, Mail,
  ShieldCheck, Percent, Globe, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/settings/")({
  head: () => ({ meta: [{ title: "Settings Overview — Nexora" }] }),
  component: SettingsOverview,
});

const sections = [
  { to: "/settings/platform",     icon: SettingsIcon,  title: "Platform",     desc: "App identity, default locale, and feature flags.",        items: ["Nexora", "en-US", "12 flags"] },
  { to: "/settings/security",     icon: Shield,        title: "Security",     desc: "2FA enforcement, sessions, IP allowlists, audit log.",   items: ["2FA required", "8h sessions", "Audit ON"] },
  { to: "/settings/payments",     icon: CreditCard,    title: "Payments",     desc: "Stripe, PayPal, Wise, ACH — escrow and payouts.",         items: ["Stripe", "PayPal", "Wise"] },
  { to: "/settings/sms",          icon: MessageSquare, title: "SMS",          desc: "OTP, job alerts, and worker dispatch via SMS.",           items: ["Twilio", "MessageBird"] },
  { to: "/settings/email",        icon: Mail,          title: "Email",        desc: "Transactional and marketing senders.",                    items: ["Postmark", "SendGrid"] },
  { to: "/settings/verification", icon: ShieldCheck,   title: "Verification", desc: "KYC, document, and liveness providers for workers.",      items: ["Onfido", "Persona", "Veriff"] },
  { to: "/settings/commission",   icon: Percent,       title: "Commission",   desc: "Per-category cuts, referral bonuses, payout cadence.",   items: ["Cleaning 18%", "Moving 14%", "Plumbing 16%"] },
  { to: "/settings/geo",          icon: Globe,         title: "Geo",          desc: "Country, region, and city availability for jobs.",        items: ["186 countries", "32 restricted"] },
] as const;

function SettingsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sections.map((s) => (
        <Link
          key={s.to}
          to={s.to}
          className="group rounded-2xl glass gradient-border p-5 hover-lift block"
        >
          <div className="flex items-start gap-3">
            <div
              className="grid place-items-center h-10 w-10 rounded-xl shrink-0"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.15))",
                border: "1px solid oklch(1 0 0 / 0.08)",
              }}
            >
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white">{s.title}</div>
                <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition" />
              </div>
              <div className="text-[11px] text-white/50 mt-0.5">{s.desc}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {s.items.map((i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md text-white/70" style={{ background: "oklch(1 0 0 / 0.05)" }}>{i}</span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
