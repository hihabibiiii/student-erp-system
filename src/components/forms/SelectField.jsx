export default function SelectField({ label, name, options, defaultValue, placeholder = "Select option" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-soft">{label}</span>
      <select className="field" name={name} defaultValue={defaultValue || ""} required>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
