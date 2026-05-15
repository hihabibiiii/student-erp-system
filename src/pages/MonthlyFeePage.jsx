import FormCard from "../components/forms/FormCard";
import Field from "../components/forms/Field";
import SelectField from "../components/forms/SelectField";
import EmptyState from "../components/ui/EmptyState";
import { currency } from "../utils/formatters";

export default function MonthlyFeePage({ student, payments = [], months = [], error }) {
  const due = Number(student?.total_fee || 0) - Number(student?.paid_fee || 0);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_1fr]">
      <FormCard title="Monthly Fee" subtitle={`${student?.name || "Student"} - Due ${currency(due)}`} submitLabel="Pay Fee" error={error}>
        <SelectField label="Month" name="month" options={months} placeholder="Select Month" />
        <Field label="Amount Paid" name="amount" type="number" min="1" max={due} />
      </FormCard>

      <section className="panel">
        <h2 className="section-title">Payment History</h2>
        <div className="mt-4 space-y-3">
          {payments.length ? payments.map((payment) => (
            <div key={payment.id} className="surface-soft interactive-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-title">{payment.month}</p>
                <p className="text-sm text-muted">{payment.pay_date} | {currency(payment.amount)}</p>
              </div>
              <a className="btn-ghost" href={`/monthly-receipt/${payment.id}`} target="_blank" rel="noreferrer">Receipt</a>
            </div>
          )) : <EmptyState title="No payments yet" description="Monthly receipts will appear here after payment." />}
        </div>
      </section>
    </div>
  );
}
