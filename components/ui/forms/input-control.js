import { useState } from "react";

function InputControl(props) {
  const { placeholder, labelText, errorText, onChangeHandler } = props;
  const type = props.type ?? "text";
  const value = props.value ?? "";

  const [inputValue, setInputValue] = useState(value);
  function onInputChanged(event) {
    setInputValue(event.target.value);

    if (onChangeHandler) {
      onChangeHandler(event.target.value);
    }
  }

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{labelText}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input input-bordered w-full ${errorText && "input-error"}`}
        onChange={onInputChanged}
        value={inputValue}
        onFocus={(event) => event.target.select()}
      />
      {errorText && (
        <label className="label">
          <span className="label-text-alt text-error">{errorText}</span>
        </label>
      )}
    </div>
  );
}

export default InputControl;
