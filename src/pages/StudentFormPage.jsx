import FormCard from "../components/forms/FormCard";
import Field from "../components/forms/Field";
import SelectField from "../components/forms/SelectField";

export default function StudentFormPage({ student, classes = [], error, pageName }) {
  const editing = pageName === "edit-student";

  return (
    <FormCard
      title={editing ? "Edit Student" : "Add Student"}
      subtitle={editing ? "Update the record while preserving the same backend payload." : "Create a new student record."}
      submitLabel={editing ? "Update Student" : "Add Student"}
      error={error}
    >
      <Field label="Student Name" name="name" defaultValue={student?.name} />
      <Field label="Roll Number" name="roll" defaultValue={student?.roll} />
      <SelectField label="Class" name="class_name" options={classes} defaultValue={student?.class_name} placeholder="Select Class" />
      <Field label="Phone Number" name="phone" defaultValue={student?.phone} />
      <Field label="Total Fee" name="total_fee" type="number" defaultValue={student?.total_fee} min="0" />
      <Field label="Paid Fee" name="paid_fee" type="number" defaultValue={student?.paid_fee} min="0" />
    </FormCard>
  );
}
