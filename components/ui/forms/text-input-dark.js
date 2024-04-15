export default function TextInputDark({
  placeholder = "",
  label = "",
  type = "text",
  className = "",

  value = "",
  onChange = (e) => {},
} = {}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between text-base-content">
        <span className="text-xs">{label}</span>
      </div>
      <input
        type={type}
        className={`bg-base-100 border border-base-content/25 px-3 py-1.5 rounded focus:border-base-300 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}
