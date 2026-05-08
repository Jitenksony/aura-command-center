import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsCard, FieldRow, SaveButton, SecondaryButton, ProviderRow } from "@/components/admin/SettingsCard";

export const Route = createFileRoute("/settings/email")({
  head: () => ({ meta: [{ title: "Email — Settings — Nexora" }] }),
  component: EmailSettings,
});

const TEMPLATES = [
  { key: "welcome",          label: "Welcome / signup confirmation" },
  { key: "job_booked",       label: "Job booked — customer" },
  { key: "job_assigned",     label: "Job assigned — worker" },
  { key: "payout_paid",      label: "Payout paid — worker" },
  { key: "dispute_opened",   label: "Dispute opened" },
  { key: "kyc_approved",     label: "KYC approved" },
  { key: "weekly_digest",    label: "Weekly business digest" },
];

function EmailSettings() {
  const [providers, setProviders] = useState({ Postmark: true, SendGrid: false, Resend: false } as Record<string, boolean>);
  const [primary, setPrimary] = useState("Postmark");
  const [fromName, setFromName] = useState("Nexora");
  const [fromAddr, setFromAddr] = useState("hello@nexora.app");
  const [replyTo, setReplyTo] = useState("support@nexora.app");
  const [test, setTest] = useState("");

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";
  const toggle = (k: string) => setProviders({ ...providers, [k]: !providers[k] });

  return (
    <>
      <SettingsCard
        icon={Mail}
        title="Email providers"
        description="Senders for transactional and marketing email."
        footer={<SaveButton onClick={() => toast.success("Email providers saved")} />}
      >
        <ProviderRow name="Postmark" status={providers.Postmark ? "Connected · Transactional" : "Off"} enabled={providers.Postmark} onToggle={() => toggle("Postmark")} />
        <ProviderRow name="SendGrid" status={providers.SendGrid ? "Connected · Marketing"     : "Off"} enabled={providers.SendGrid} onToggle={() => toggle("SendGrid")} />
        <ProviderRow name="Resend"   status={providers.Resend ? "Connected"                   : "Off"} enabled={providers.Resend}   onToggle={() => toggle("Resend")} />
      </SettingsCard>

      <SettingsCard
        icon={Send}
        title="Sender identity"
        footer={<><SecondaryButton onClick={() => test && toast.success(`Test email sent to ${test}`)}>Send test</SecondaryButton><SaveButton onClick={() => toast.success("Sender identity saved")} /></>}
      >
        <FieldRow label="Primary provider">
          <Select value={primary} onValueChange={setPrimary}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(providers).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="From name"><Input className={inputCls} value={fromName} onChange={(e) => setFromName(e.target.value)} /></FieldRow>
        <FieldRow label="From address"><Input className={inputCls} value={fromAddr} onChange={(e) => setFromAddr(e.target.value)} /></FieldRow>
        <FieldRow label="Reply-to"><Input className={inputCls} value={replyTo} onChange={(e) => setReplyTo(e.target.value)} /></FieldRow>
        <FieldRow label="Send test email" hint="Sends a sample transactional email to this address.">
          <Input className={inputCls} placeholder="you@example.com" value={test} onChange={(e) => setTest(e.target.value)} />
        </FieldRow>
      </SettingsCard>

      <SettingsCard
        icon={Mail}
        title="Templates"
        description="Edit the copy for each automated email Nexora sends."
        footer={<SaveButton onClick={() => toast.success("Templates saved")} />}
      >
        {TEMPLATES.map((t) => (
          <FieldRow key={t.key} label={t.label}>
            <Textarea className="bg-white/5 border-white/10 text-white text-xs min-h-[56px]" defaultValue={`Hi {{first_name}}, ${t.label.toLowerCase()} — open Nexora to see details.`} />
          </FieldRow>
        ))}
      </SettingsCard>
    </>
  );
}
