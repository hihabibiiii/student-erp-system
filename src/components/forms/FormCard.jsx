import { Save } from "lucide-react";

export default function FormCard({ title, subtitle, action, method = "POST", children, submitLabel = "Save", error, success }) {
  return (
    <section className="panel mx-auto max-w-xl">
      <div className="mb-5">
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </div>
      {error ? <p className="alert-danger mb-4">{error}</p> : null}
      {success ? <p className="alert-success mb-4">{success}</p> : null}
      <form action={action || location.pathname} method={method} className="space-y-4">
        {children}
        <button className="btn-primary w-full" type="submit">
          <Save className="h-4 w-4" />
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
