import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsCard, FieldRow, SaveButton, ProviderRow } from "@/components/admin/SettingsCard";
import { RestrictedSection, SECTION_PERMS } from "@/lib/admin-access";

export const Route = createFileRoute("/settings/sms")({
  head: () => ({ meta: [{ title: "SMS — Settings — Nexora" }] }),
  component: SmsSettings,
});

function SmsSettings() {
  const [providers, setProviders] = useState({ Twilio: true, MessageBird: false, Vonage: false } as Record<string, boolean>);
  const [primary, setPrimary] = useState("Twilio");
  const [otpLen, setOtpLen] = useState("6");
  const [otpExpiry, setOtpExpiry] = useState("10");
  const [senderId, setSenderId] = useState("NEXORA");

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";
  const toggle = (k: string) => setProviders({ ...providers, [k]: !providers[k] });

  return (
    <RestrictedSection perms={SECTION_PERMS["/settings/sms"]} sectionTitle="SMS">
      <SettingsCard
        icon={MessageSquare}
        title="SMS providers"
        description="OTP, job alerts, and worker dispatch over SMS."
        footer={<SaveButton onClick={() => toast.success("SMS providers saved")} />}
      >
        <ProviderRow name="Twilio"      status={providers.Twilio ? "Connected" : "Off"}      region="Global"  enabled={providers.Twilio}      onToggle={() => toggle("Twilio")} />
        <ProviderRow name="MessageBird" status={providers.MessageBird ? "Connected" : "Off"} region="EU/APAC" enabled={providers.MessageBird} onToggle={() => toggle("MessageBird")} />
        <ProviderRow name="Vonage"      status={providers.Vonage ? "Connected" : "Off"}      region="Global"  enabled={providers.Vonage}      onToggle={() => toggle("Vonage")} />
      </SettingsCard>

      <SettingsCard
        icon={MessageSquare}
        title="OTP & sender"
        description="One-time codes for sign-in and phone verification."
        footer={<SaveButton onClick={() => toast.success("OTP settings saved")} />}
      >
        <FieldRow label="Primary provider">
          <Select value={primary} onValueChange={setPrimary}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Twilio","MessageBird","Vonage"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="OTP length">
          <Input className={inputCls} type="number" value={otpLen} onChange={(e) => setOtpLen(e.target.value)} />
        </FieldRow>
        <FieldRow label="OTP expiry (minutes)">
          <Input className={inputCls} type="number" value={otpExpiry} onChange={(e) => setOtpExpiry(e.target.value)} />
        </FieldRow>
        <FieldRow label="Alpha sender ID" hint="Branded sender shown on supported carriers.">
          <Input className={inputCls} value={senderId} onChange={(e) => setSenderId(e.target.value)} />
        </FieldRow>
        <FieldRow label="OTP template">
          <Textarea className="bg-white/5 border-white/10 text-white text-xs min-h-[64px]" defaultValue="Your Nexora code is {{code}}. It expires in {{minutes}} minutes." />
        </FieldRow>
        <FieldRow label="Job alert template">
          <Textarea className="bg-white/5 border-white/10 text-white text-xs min-h-[64px]" defaultValue="New {{category}} job near you · ${{amount}} · Reply YES to accept." />
        </FieldRow>
      </SettingsCard>
    </RestrictedSection>
  );
}
