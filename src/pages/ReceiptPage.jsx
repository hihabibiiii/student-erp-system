import { Printer } from "lucide-react";
import { currency } from "../utils/formatters";

export default function ReceiptPage({ type = "full", student, payment }) {
  const isMonthly = type === "monthly";
  const data = isMonthly ? payment : student;

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-slate-300 bg-white p-6 text-slate-950 shadow-xl">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Habibi Public School</p>
        <h1 className="mt-2 text-2xl font-extrabold">{isMonthly ? "Monthly Fee Receipt" : "Fee Receipt"}</h1>
      </div>
      <hr className="my-5" />
      <div className="space-y-2 text-sm">
        <Line label="Name" value={data?.name} />
        <Line label="Class" value={data?.class_name} />
        <Line label="Roll" value={data?.roll} />
        {!isMonthly ? <Line label="Phone" value={data?.phone} /> : null}
      </div>
      <hr className="my-5" />
      <div className="space-y-2 text-sm">
        {isMonthly ? (
          <>
            <Line label="Month" value={payment?.month} />
            <Line label="Amount Paid" value={currency(payment?.amount)} />
            <Line label="Date" value={payment?.pay_date} />
          </>
        ) : (
          <>
            <Line label="Total Fee" value={currency(student?.total_fee)} />
            <Line label="Paid" value={currency(student?.paid_fee)} />
            <Line label="Due" value={currency(Number(student?.total_fee || 0) - Number(student?.paid_fee || 0))} />
            <Line label="Status" value={Number(student?.paid_fee || 0) >= Number(student?.total_fee || 0) ? "PAID" : "DUE"} />
          </>
        )}
      </div>
      <button className="btn-primary no-print mt-6 w-full" type="button" onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
        Print / Save PDF
      </button>
    </section>
  );
}

function Line({ label, value }) {
  return (
    <p className="flex justify-between gap-4">
      <strong>{label}</strong>
      <span>{value}</span>
    </p>
  );
}
