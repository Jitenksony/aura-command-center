import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shield, KeyRound, Lock, ScrollText, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsCard, FieldRow, SaveButton, SecondaryButton } from "@/components/admin/SettingsCard";

export const Route = createFileRoute("/settings/security")({
  head: () => ({ meta: [{ title: "Security — Settings — Nexora" }] }),
  component: SecuritySettings,
});

function SecuritySettings() {
  const [twoFA, setTwoFA] = useState<"required" | "optional" | "off">("required");
  const [sessionLen, setSessionLen] = useState("8");
  const [pwMin, setPwMin] = useState("12");
  const [allowlist, setAllowlist] = useState<string[]>(["10.0.0.0/8", "203.0.113.42"]);
  const [newIp, setNewIp] = useState("");
  const [auditOn, setAuditOn] = useState(true);

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";

  return (
    <>
      <SettingsCard
        icon={Shield}
        title="Authentication policy"
        description="2FA enforcement and session controls for admin access."
        footer={<SaveButton onClick={() => toast.success("Auth policy updated")} />}
      >
        <FieldRow label="Two-factor auth" hint="Applies to all admin and finance roles.">
          <Select value={twoFA} onValueChange={(v) => setTwoFA(v as typeof twoFA)}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="required">Required</SelectItem>
              <SelectItem value="optional">Optional</SelectItem>
              <SelectItem value="off">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Session length (hours)">
          <Input className={inputCls} type="number" value={sessionLen} onChange={(e) => setSessionLen(e.target.value)} />
        </FieldRow>
        <FieldRow label="Min password length">
          <Input className={inputCls} type="number" value={pwMin} onChange={(e) => setPwMin(e.target.value)} />
        </FieldRow>
      </SettingsCard>

      <SettingsCard
        icon={Lock}
        title="IP allowlist"
        description="Restrict admin sign-in to trusted IPs and CIDR ranges."
        footer={<SaveButton onClick={() => toast.success(`Allowlist saved (${allowlist.length})`)} />}
      >
        <div className="space-y-2">
          {allowlist.map((ip) => (
            <div key={ip} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <span className="text-xs font-mono text-white/80">{ip}</span>
              <button onClick={() => setAllowlist(allowlist.filter((x) => x !== ip))} className="text-white/40 hover:text-[var(--color-danger)]">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <Input
              className={inputCls + " flex-1"}
              placeholder="e.g. 192.168.1.0/24"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
            />
            <SecondaryButton onClick={() => { if (newIp) { setAllowlist([...allowlist, newIp]); setNewIp(""); } }}>
              <span className="inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add</span>
            </SecondaryButton>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={KeyRound}
        title="API keys"
        description="Server-side keys for the Nexora REST and Webhooks API."
        footer={<SaveButton label="Rotate all" onClick={() => toast.success("Keys rotated. Old keys expire in 24h.")} />}
      >
        <FieldRow label="Live secret key">
          <div className="flex items-center gap-2">
            <Input className={inputCls + " flex-1 font-mono"} readOnly value="sk_live_••••••••••••••••••3Q7n" />
            <SecondaryButton onClick={() => toast.success("Copied")}>Copy</SecondaryButton>
          </div>
        </FieldRow>
        <FieldRow label="Test secret key">
          <div className="flex items-center gap-2">
            <Input className={inputCls + " flex-1 font-mono"} readOnly value="sk_test_••••••••••••••••••aL1k" />
            <SecondaryButton onClick={() => toast.success("Copied")}>Copy</SecondaryButton>
          </div>
        </FieldRow>
      </SettingsCard>

      <SettingsCard
        icon={ScrollText}
        title="Audit log"
        description="Immutable record of every admin action."
        footer={<SaveButton onClick={() => toast.success("Audit settings saved")} />}
      >
        <FieldRow label="Enable audit log">
          <button
            onClick={() => setAuditOn(!auditOn)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${auditOn ? "bg-[var(--color-primary)]" : "bg-white/10"}`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white transition ${auditOn ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </FieldRow>
        <FieldRow label="Retention">
          <Select defaultValue="365">
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {["30","90","180","365","730"].map((d) => <SelectItem key={d} value={d}>{d} days</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldRow>
      </SettingsCard>
    </>
  );
}
