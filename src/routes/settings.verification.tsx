import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, FileCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsCard, FieldRow, SaveButton, ProviderRow } from "@/components/admin/SettingsCard";

export const Route = createFileRoute("/settings/verification")({
  head: () => ({ meta: [{ title: "Verification — Settings — Nexora" }] }),
  component: VerificationSettings,
});

const CHECKS = [
  { key: "id_doc",    label: "Government ID document" },
  { key: "selfie",    label: "Selfie + liveness" },
  { key: "address",   label: "Proof of address" },
  { key: "background",label: "Background check" },
  { key: "trade",     label: "Trade license (skilled categories)" },
  { key: "insurance", label: "Liability insurance" },
];

function VerificationSettings() {
  const [providers, setProviders] = useState({ Onfido: true, Persona: false, Veriff: false } as Record<string, boolean>);
  const [primary, setPrimary] = useState("Onfido");
  const [reverify, setReverify] = useState("365");
  const [checks, setChecks] = useState<Record<string, boolean>>({
    id_doc: true, selfie: true, address: true, background: true, trade: false, insurance: false,
  });

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";
  const toggle = (k: string) => setProviders({ ...providers, [k]: !providers[k] });

  return (
    <>
      <SettingsCard
        icon={ShieldCheck}
        title="Verification providers"
        description="KYC and identity verification vendors for Nexora workers."
        footer={<SaveButton onClick={() => toast.success("Verification providers saved")} />}
      >
        <ProviderRow name="Onfido"  status={providers.Onfido ? "Connected · Default" : "Off"} enabled={providers.Onfido}  onToggle={() => toggle("Onfido")} />
        <ProviderRow name="Persona" status={providers.Persona ? "Connected" : "Off"}          enabled={providers.Persona} onToggle={() => toggle("Persona")} />
        <ProviderRow name="Veriff"  status={providers.Veriff ? "Connected" : "Off"}           enabled={providers.Veriff}  onToggle={() => toggle("Veriff")} />
      </SettingsCard>

      <SettingsCard
        icon={FileCheck}
        title="Required checks"
        description="Workers must clear every enabled check before accepting jobs."
        footer={<SaveButton onClick={() => toast.success(`Required checks: ${Object.values(checks).filter(Boolean).length}`)} />}
      >
        {CHECKS.map((c) => (
          <div key={c.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
            <div className="text-xs text-white/85">{c.label}</div>
            <button
              onClick={() => setChecks({ ...checks, [c.key]: !checks[c.key] })}
              aria-pressed={checks[c.key]}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checks[c.key] ? "bg-[var(--color-primary)]" : "bg-white/10"}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white transition ${checks[c.key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard
        icon={ShieldCheck}
        title="Re-verification cadence"
        footer={<SaveButton onClick={() => toast.success("Cadence saved")} />}
      >
        <FieldRow label="Primary provider">
          <Select value={primary} onValueChange={setPrimary}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(providers).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Re-verify every" hint="Workers are prompted to re-submit ID after this period.">
          <Select value={reverify} onValueChange={setReverify}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {["180","365","730","1095"].map((d) => <SelectItem key={d} value={d}>{d} days</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
      </SettingsCard>
    </>
  );
}
