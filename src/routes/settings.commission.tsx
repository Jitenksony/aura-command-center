import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Percent, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SettingsCard, FieldRow, SaveButton } from "@/components/admin/SettingsCard";

export const Route = createFileRoute("/settings/commission")({
  head: () => ({ meta: [{ title: "Commission — Settings — Nexora" }] }),
  component: CommissionSettings,
});

const CATEGORIES = [
  { key: "cleaning",  label: "Cleaning",       def: 18 },
  { key: "moving",    label: "Moving & hauling", def: 14 },
  { key: "plumbing",  label: "Plumbing",       def: 16 },
  { key: "handyman",  label: "Handyman",       def: 15 },
  { key: "delivery",  label: "Delivery",       def: 12 },
  { key: "tutoring",  label: "Tutoring",       def: 10 },
  { key: "petcare",   label: "Pet care",       def: 13 },
  { key: "events",    label: "Event staff",    def: 17 },
];

function CommissionSettings() {
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(CATEGORIES.map((c) => [c.key, c.def])),
  );
  const [referrerBonus, setReferrerBonus] = useState("25");
  const [refereeBonus, setRefereeBonus]   = useState("15");
  const [firstJobDiscount, setFirstJobDiscount] = useState("10");

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";
  const avg = (Object.values(rates).reduce((a, b) => a + b, 0) / CATEGORIES.length).toFixed(1);

  return (
    <>
      <SettingsCard
        icon={Percent}
        title="Per-category commission"
        description={`Take rate Nexora keeps from each completed job. Current average: ${avg}%.`}
        footer={<SaveButton onClick={() => toast.success(`Commissions saved (avg ${avg}%)`)} />}
      >
        {CATEGORIES.map((c) => (
          <FieldRow key={c.key} label={c.label}>
            <div className="flex items-center gap-3">
              <Input
                className={inputCls + " w-24"}
                type="number"
                min={0}
                max={100}
                value={rates[c.key]}
                onChange={(e) => setRates({ ...rates, [c.key]: Number(e.target.value) })}
              />
              <span className="text-xs text-white/45">%</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(rates[c.key], 50) * 2}%`,
                    background: "var(--gradient-primary)",
                  }}
                />
              </div>
            </div>
          </FieldRow>
        ))}
      </SettingsCard>

      <SettingsCard
        icon={Gift}
        title="Referrals & promotions"
        description="Bonuses and discounts to drive marketplace growth."
        footer={<SaveButton onClick={() => toast.success("Promotions saved")} />}
      >
        <FieldRow label="Referrer bonus (USD)" hint="Paid when an invited user completes their first job.">
          <Input className={inputCls} type="number" value={referrerBonus} onChange={(e) => setReferrerBonus(e.target.value)} />
        </FieldRow>
        <FieldRow label="New user bonus (USD)">
          <Input className={inputCls} type="number" value={refereeBonus} onChange={(e) => setRefereeBonus(e.target.value)} />
        </FieldRow>
        <FieldRow label="First job discount (%)">
          <Input className={inputCls} type="number" value={firstJobDiscount} onChange={(e) => setFirstJobDiscount(e.target.value)} />
        </FieldRow>
      </SettingsCard>
    </>
  );
}
