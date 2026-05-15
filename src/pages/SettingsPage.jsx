import FormCard from "../components/forms/FormCard";
import Field from "../components/forms/Field";

export default function SettingsPage({ mode, error, success }) {
  if (mode === "username") {
    return (
      <FormCard title="Profile" subtitle="Change the admin username." submitLabel="Update Username" error={error} success={success}>
        <Field label="New Username" name="new_username" />
        <Field label="Current Password" name="password" type="password" />
      </FormCard>
    );
  }

  if (mode === "security") {
    return (
      <FormCard title="Admin Panel" subtitle="Update the account recovery security answer." submitLabel="Update Security Answer" error={error} success={success}>
        <Field label="Old Security Answer" name="old_answer" type="password" />
        <Field label="New Security Answer" name="new_answer" type="password" />
        <Field label="Confirm New Security Answer" name="confirm_answer" type="password" />
      </FormCard>
    );
  }

  return (
    <FormCard title="Settings" subtitle="Change the admin password." submitLabel="Update Password" error={error} success={success}>
      <Field label="Old Password" name="old_password" type="password" />
      <Field label="New Password" name="new_password" type="password" />
      <Field label="Confirm New Password" name="confirm_password" type="password" />
    </FormCard>
  );
}
