import FormCard from "../components/forms/FormCard";
import Field from "../components/forms/Field";

export default function ForgotPage({ error, success }) {
  return (
    <FormCard
      title="Reset Account"
      subtitle="Security question: What is your pet name?"
      submitLabel="Reset credentials"
      error={error}
      success={success}
    >
      <Field label="Security Answer" name="answer" />
      <Field label="New Username" name="new_username" />
      <Field label="New Password" name="new_password" type="password" />
      <a className="block text-center text-sm font-semibold text-brand-200 transition hover:text-brand-100 light:text-brand-700 light:hover:text-brand-600" href="/">Back to login</a>
    </FormCard>
  );
}
