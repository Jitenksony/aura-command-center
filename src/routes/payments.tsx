import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsSkeleton } from "@/components/admin/PageSkeletons";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TransactionsTable } from "@/components/admin/TransactionsTable";

export const Route = createFileRoute("/payments")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<AnalyticsSkeleton />),
  head: () => ({ meta: [{ title: "Payments — Nexora" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <PageShell eyebrow="Finance" title="Payments & Transactions" description="Escrow, payouts, refunds, and platform commissions in real-time.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Today's Revenue" value="$184,290" accent="var(--color-primary)" />
        <StatTile label="Escrow Balance" value="$1.24M" accent="var(--color-cyan)" />
        <StatTile label="Pending Payouts" value="$84,120" accent="var(--color-warning)" />
        <StatTile label="Refund Rate" value="1.8%" accent="var(--color-success)" />
      </div>
      <RevenueChart />
      <TransactionsTable />
    </PageShell>
  );
}
