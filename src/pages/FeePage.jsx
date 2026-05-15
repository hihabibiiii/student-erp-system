import FormCard from "../components/forms/FormCard";
import Field from "../components/forms/Field";
import { currency } from "../utils/formatters";

export default function FeePage({ student, remaining = 0, error }) {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <section className="panel">
        <h2 className="section-title">{student?.name}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Metric label="Total Fee" value={currency(student?.total_fee)} />
          <Metric label="Paid" value={currency(student?.paid_fee)} />
          <Metric label="Due" value={currency(remaining)} />
        </div>
      </section>
      <FormCard title="Pay Fee" subtitle="Record a due payment." submitLabel="Pay Now" error={error}>
        <Field label="Amount" name="amount" type="number" max={remaining} min="1" placeholder="Enter amount to pay" />
      </FormCard>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="surface-soft rounded-2xl p-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-title">{value}</p>
    </div>
  );
}
