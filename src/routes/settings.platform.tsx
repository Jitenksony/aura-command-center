import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Settings as SettingsIcon, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SettingsCard, FieldRow, SaveButton, SecondaryButton } from "@/components/admin/SettingsCard";
import { RestrictedSection, SECTION_PERMS } from "@/lib/admin-access";

export const Route = createFileRoute("/settings/platform")({
  head: () => ({ meta: [{ title: "Platform — Settings — Nexora" }] }),
  component: PlatformSettings,
});

const FLAGS = [
  { key: "live_dispatch",   label: "Live worker dispatch",       desc: "Real-time matching engine for incoming jobs." },
  { key: "instant_payouts", label: "Instant payouts",            desc: "Allow workers to cash out immediately." },
  { key: "ai_pricing",      label: "AI pricing suggestions",     desc: "Suggest job prices using historical data." },
  { key: "in_app_chat",     label: "In-app chat",                desc: "Customer ↔ worker messaging." },
  { key: "video_evidence",  label: "Video dispute evidence",     desc: "Allow video uploads on disputes." },
  { key: "referral_engine", label: "Referral engine",            desc: "Reward both referrer and new signups." },
];

function PlatformSettings() {
  const [appName, setAppName] = useState("Nexora");
  const [tagline, setTagline] = useState("Hyperlocal micro-jobs in minutes.");
  const [supportEmail, setSupportEmail] = useState("support@nexora.app");
  const [locale, setLocale] = useState("en-US");
  const [timezone, setTimezone] = useState("America/New_York");
  const [currency, setCurrency] = useState("USD");
  const [maintenance, setMaintenance] = useState(false);
  const [flags, setFlags] = useState<Record<string, boolean>>({
    live_dispatch: true, instant_payouts: true, ai_pricing: false,
    in_app_chat: true, video_evidence: true, referral_engine: true,
  });

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";

  return (
    <RestrictedSection perms={SECTION_PERMS["/settings/platform"]} sectionTitle="Platform">
      <SettingsCard
        icon={SettingsIcon}
        title="Platform identity"
        description="Branding and defaults shown across the Nexora marketplace."
        footer={<><SecondaryButton>Reset</SecondaryButton><SaveButton onClick={() => toast.success("Platform identity saved")} /></>}
      >
        <FieldRow label="App name" hint="Shown in headers, emails, and app stores.">
          <Input className={inputCls} value={appName} onChange={(e) => setAppName(e.target.value)} />
        </FieldRow>
        <FieldRow label="Tagline">
          <Input className={inputCls} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </FieldRow>
        <FieldRow label="Support email">
          <Input className={inputCls} value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
        </FieldRow>
        <FieldRow label="Default locale">
          <Select value={locale} onValueChange={setLocale}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {["en-US","en-GB","es-ES","es-MX","pt-BR","fr-FR","de-DE","ja-JP"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Timezone">
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {["America/New_York","America/Los_Angeles","Europe/London","Europe/Berlin","Asia/Tokyo","Asia/Singapore"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Default currency">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {["USD","EUR","GBP","BRL","JPY","SGD"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Marketplace description" hint="Used on landing and OG cards.">
          <Textarea
            className="bg-white/5 border-white/10 text-white text-xs min-h-[72px]"
            defaultValue="Nexora connects customers with vetted local workers for cleaning, moving, plumbing, and more — booked in minutes, paid through escrow."
          />
        </FieldRow>
      </SettingsCard>

      <SettingsCard
        icon={Flag}
        title="Feature flags"
        description="Toggle product capabilities without a deploy."
        footer={<SaveButton onClick={() => toast.success("Feature flags updated")} />}
      >
        {FLAGS.map((f) => (
          <div key={f.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
            <div>
              <div className="text-xs font-medium text-white/85">{f.label}</div>
              <div className="text-[11px] text-white/45 mt-0.5">{f.desc}</div>
            </div>
            <button
              onClick={() => setFlags({ ...flags, [f.key]: !flags[f.key] })}
              aria-pressed={flags[f.key]}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${flags[f.key] ? "bg-[var(--color-primary)]" : "bg-white/10"}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white transition ${flags[f.key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard
        icon={SettingsIcon}
        title="Maintenance mode"
        description="Take the marketplace offline during deploys."
        footer={<SaveButton onClick={() => toast.success(maintenance ? "Maintenance mode ON" : "Marketplace is live")} label={maintenance ? "Confirm offline" : "Save"} />}
      >
        <FieldRow label="Status" hint="When enabled, only admins can sign in.">
          <button
            onClick={() => setMaintenance(!maintenance)}
            className={`h-9 px-4 text-xs rounded-lg border ${maintenance ? "border-[var(--color-danger)] text-[var(--color-danger)]" : "border-white/10 text-white/80 hover:bg-white/5"}`}
          >
            {maintenance ? "Maintenance ON" : "Live"}
          </button>
        </FieldRow>
      </SettingsCard>
    </RestrictedSection>
  );
}
