import { useCallback, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";

export default function SearchInputDark({
  debounceMs = 750,
  placeholder = "",
  label = "",

  onChange = () => {},
} = {}) {
  const [val, setVal] = useState();

  const debouncedOnChangeDefinition = useMemo(
    () => debounce((inputValue) => onChange(inputValue), debounceMs),
    [debounceMs, onChange]
  );
  const onChangeDebounced = useCallback(
    (inputValue) => debouncedOnChangeDefinition(inputValue),
    [debouncedOnChangeDefinition]
  );

  const ref = useRef(null);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between text-base-content">
        <span className="text-xs">{label}</span>
      </div>
      <input
        ref={ref}
        type="text"
        className="bg-base-200 border-none px-3 py-2.5 rounded focus:border-base-300 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-sm"
        placeholder={placeholder}
        value={val}
        onClick={() => ref?.current?.select()}
        onChange={(e) => {
          setVal(e.target.value);
          onChangeDebounced(e.target.value);
        }}
      />
    </div>
  );
}
