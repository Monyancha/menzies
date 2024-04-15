import { useState } from "react";

function TextAreaControl(props) {
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
      <textarea
        className={`textarea textarea-bordered  w-full ${
          errorText && "textarea-error"
        }`}
        rows={5}
        onChange={onInputChanged}
        onFocus={(event) => event.target.select()}
        placeholder={placeholder}
      ></textarea>
      {errorText && (
        <label className="label">
          <span className="label-text-alt text-error">{errorText}</span>
        </label>
      )}
    </div>
  );
}

export default TextAreaControl;
