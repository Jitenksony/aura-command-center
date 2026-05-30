import { ArrowUpRight, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

const tx = [
  { id: "TX-09281", user: "Sofia Martinez",   amount: 480,  status: "Released", method: "Stripe", time: "2m ago" },
  { id: "TX-09280", user: "TaskMate Inc.",     amount: 1280, status: "Escrow",   method: "ACH",    time: "6m ago" },
  { id: "TX-09279", user: "Kenji Watanabe",   amount: 312,  status: "Payout",   method: "Wise",   time: "11m ago" },
  { id: "TX-09278", user: "Northwind Co.",     amount: 89,   status: "Refunded", method: "Card",   time: "18m ago" },
  { id: "TX-09277", user: "Amara Okonkwo",    amount: 156,  status: "Failed",   method: "Card",   time: "22m ago" },
  { id: "TX-09276", user: "Iris Holdings",     amount: 2480, status: "Released", method: "Wire",   time: "31m ago" },
];

const statusStyle: Record<string, string> = {
  Released: "text-[var(--color-success)] bg-[oklch(0.72_0.18_150_/_0.12)]",
  Escrow:   "text-[var(--color-cyan)]    bg-[oklch(0.74_0.15_210_/_0.12)]",
  Payout:   "text-[var(--color-primary)] bg-[oklch(0.62_0.21_275_/_0.14)]",
  Refunded: "text-[var(--color-warning)] bg-[oklch(0.82_0.17_85_/_0.12)]",
  Failed:   "text-[var(--color-danger)]  bg-[oklch(0.65_0.23_27_/_0.12)]",
};

export function TransactionsTable() {
  const handleExport = () => {
    const headers = ["id", "user", "amount", "status", "method", "time"];
    const rows = tx.map((t) => [t.id, t.user, t.amount, t.status, t.method, t.time].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transactions exported");
  };

  return (
    <div className="rounded-2xl glass gradient-border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Recent Transactions</h3>
          <p className="text-[11px] text-white/45 mt-0.5">Escrow · Payouts · Refunds</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 h-8 rounded-lg border border-white/10 hover:bg-white/5"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <Link
            to="/payments"
            className="inline-flex items-center gap-1.5 text-xs text-white px-3 h-8 rounded-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-white/40">
              <th className="text-left font-medium px-5 py-3">Transaction</th>
              <th className="text-left font-medium px-5 py-3">Counterparty</th>
              <th className="text-left font-medium px-5 py-3">Method</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="text-right font-medium px-5 py-3">Amount</th>
              <th className="text-right font-medium px-5 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {tx.map((t) => (
              <tr
                key={t.id}
                onClick={() => toast(`Transaction ${t.id}`, { description: `${t.user} · ${t.method} · $${t.amount.toLocaleString()}` })}
                className="border-t border-white/5 hover:bg-white/[0.025] transition cursor-pointer"
              >
                <td className="px-5 py-3 text-white/80 font-mono text-[12px]">{t.id}</td>
                <td className="px-5 py-3 text-white">{t.user}</td>
                <td className="px-5 py-3 text-white/60">{t.method}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md ${statusStyle[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-white font-semibold tabular-nums">${t.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-white/45 text-xs tabular-nums">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
