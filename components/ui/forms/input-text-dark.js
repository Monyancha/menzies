import { useRef } from "react";

export default function InputTextDark({
  label = "",
  placeholder = "",
  type = "text",

  value = null,
  onChange = () => {},
  bordered = false,
  className = "",
} = {}) {
  const ref = useRef(null);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between text-v3-lightest">
        <span className="text-xs">{label}</span>
      </div>
      <input
        type={type}
        ref={ref}
        className={`bg-v3-dark px-3 py-2.5 rounded focus:border-v3-darkest focus:outline-none focus:ring-1 focus:ring-v3-primary placeholder:text-sm input-base tr-eo
${bordered && `border border-v3-darkest focus:border-none`}
        ${className}`}
        placeholder={placeholder}
        value={value}
        onClick={() => ref?.current?.select()}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
