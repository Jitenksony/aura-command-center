import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsCard, FieldRow, SaveButton, ProviderRow } from "@/components/admin/SettingsCard";
import { RestrictedSection, SECTION_PERMS } from "@/lib/admin-access";

export const Route = createFileRoute("/settings/payments")({
  head: () => ({ meta: [{ title: "Payments — Settings — Nexora" }] }),
  component: PaymentsSettings,
});

function PaymentsSettings() {
  const [providers, setProviders] = useState({
    Stripe: true, PayPal: true, Wise: true, ACH: false, ApplePay: true, GooglePay: true,
  } as Record<string, boolean>);
  const [escrowDays, setEscrowDays] = useState("3");
  const [payoutCadence, setPayoutCadence] = useState("daily");
  const [minPayout, setMinPayout] = useState("25");
  const [refundWindow, setRefundWindow] = useState("14");

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";
  const toggle = (k: string) => setProviders({ ...providers, [k]: !providers[k] });

  return (
    <RestrictedSection perms={SECTION_PERMS["/settings/payments"]} sectionTitle="Payments">
      <SettingsCard
        icon={CreditCard}
        title="Payment providers"
        description="Process customer payments through one or more gateways."
        footer={<SaveButton onClick={() => toast.success("Payment providers saved")} />}
      >
        <ProviderRow name="Stripe"     status={providers.Stripe ? "Connected · Live" : "Disabled"}     region="Global"      enabled={providers.Stripe}    onToggle={() => toggle("Stripe")} />
        <ProviderRow name="PayPal"     status={providers.PayPal ? "Connected" : "Disabled"}            region="Global"      enabled={providers.PayPal}    onToggle={() => toggle("PayPal")} />
        <ProviderRow name="Wise"       status={providers.Wise ? "Connected · Payouts only" : "Off"}    region="EU/UK"        enabled={providers.Wise}      onToggle={() => toggle("Wise")} />
        <ProviderRow name="ACH"        status={providers.ACH ? "Connected" : "Disabled"}               region="US"           enabled={providers.ACH}       onToggle={() => toggle("ACH")} />
        <ProviderRow name="Apple Pay"  status={providers.ApplePay ? "On" : "Off"}                       region="iOS web"      enabled={providers.ApplePay}  onToggle={() => toggle("ApplePay")} />
        <ProviderRow name="Google Pay" status={providers.GooglePay ? "On" : "Off"}                      region="Android web"  enabled={providers.GooglePay} onToggle={() => toggle("GooglePay")} />
      </SettingsCard>

      <SettingsCard
        icon={Wallet}
        title="Escrow & payouts"
        description="Hold funds until a job is completed, then release on schedule."
        footer={<SaveButton onClick={() => toast.success("Escrow rules updated")} />}
      >
        <FieldRow label="Escrow hold (days)" hint="Window between job completion and payout release.">
          <Input className={inputCls} type="number" value={escrowDays} onChange={(e) => setEscrowDays(e.target.value)} />
        </FieldRow>
        <FieldRow label="Payout cadence">
          <Select value={payoutCadence} onValueChange={setPayoutCadence}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Minimum payout (USD)">
          <Input className={inputCls} type="number" value={minPayout} onChange={(e) => setMinPayout(e.target.value)} />
        </FieldRow>
        <FieldRow label="Refund window (days)">
          <Input className={inputCls} type="number" value={refundWindow} onChange={(e) => setRefundWindow(e.target.value)} />
        </FieldRow>
      </SettingsCard>
    </RestrictedSection>
  );
}
