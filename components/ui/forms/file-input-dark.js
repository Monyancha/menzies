export default function FileInputDark({
  placeholder = "",
  label = "",
  type = "text",
  className = "",
  error = null,

  onChange = (file) => {},
} = {}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-base-content">
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <input
        type={type}
        className={`bg-base-100
        border ${!error ? "border-base-content/25" : "border-error"}
        ${!error ? "text-base-content" : "text-error"}
        px-3 py-1.5 rounded
        focus:border-base-300 focus:outline-none focus:ring-1 focus:ring-primary
        placeholder:text-sm
        file:bg-base-300 file:text-base-content
        file:text-sm file:rounded file:cursor-pointer
        file:border file:border-base-300
        hover:file:border-primary hover:file:text-primary
        ${className}`}
        placeholder={placeholder}
        onChange={(e) => {
          let file = null;
          const input = e.target;
          if (input?.files?.length > 0) {
            file = input.files[0];
          }

          onChange(file);
        }}
      />
      {error && (
        <div className="flex justify-between text-base-content">
          <span className="text-xs text-error">{error}</span>
        </div>
      )}
    </div>
  );
}
