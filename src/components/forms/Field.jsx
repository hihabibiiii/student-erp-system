export default function Field({ label, name, type = "text", defaultValue, placeholder, required = true, min, max }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-soft">{label}</span>
      <input
        className="field"
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder || label}
        required={required}
        min={min}
        max={max}
      />
    </label>
  );
}
