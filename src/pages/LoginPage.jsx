import { LogIn } from "lucide-react";
import Field from "../components/forms/Field";

export default function LoginPage({ error }) {
  return (
    <section className="panel shadow-glow">
      <div className="mb-6">
        <p className="eyebrow">Secure Admin Portal</p>
        <h1 className="mt-2 text-3xl font-extrabold text-title">Student ERP Login</h1>
        <p className="mt-2 text-sm text-muted">Access dashboard, students, fees, receipts, and account controls.</p>
      </div>
      {error ? <p className="alert-danger mb-4">{error}</p> : null}
      <form method="POST" className="space-y-4">
        <Field label="Username" name="username" />
        <Field label="Password" name="password" type="password" />
        <button className="btn-primary w-full" type="submit">
          <LogIn className="h-4 w-4" />
          Login
        </button>
      </form>
      <a className="mt-5 block text-center text-sm font-semibold text-brand-200 transition hover:text-brand-100 light:text-brand-700 light:hover:text-brand-600" href="/forgot">
        Forgot username or password?
      </a>
    </section>
  );
}
