import { ActionIcon, TextInput } from "@mantine/core";
import { IconKeyboard, IconX } from "@tabler/icons";
import { useState } from "react";
import AlphaNumericKeyboard from "../actions/alphanumeric-keyboard";
import NumericKeyboard from "../actions/numeric-keyboard";

function KeyboardInput({
  type = "text",
  placeholder = null,
  label = null,
  value = "",
  ref = null,
  autoFocus = false,
  autoComplete = null,
  onChangeHandler = () => {},
} = {}) {
  const [showKeyboard, setShowKeyboard] = useState(false);

  return (
    <>
      <div className="w-full mt-2 flex items-end gap-2">
        <div className="grow">
          <TextInput
            type={type}
            placeholder={placeholder}
            label={label}
            value={value}
            onChange={(e) => onChangeHandler(e.target.value)}
            ref={ref}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
          />
        </div>
        <div className="pb-[0.7px]">
          <ActionIcon
            variant="outline"
            size="lg"
            color="blue"
            onClick={() => setShowKeyboard(!showKeyboard)}
          >
            {showKeyboard ? <IconX size={16} /> : <IconKeyboard size={16} />}
          </ActionIcon>
        </div>
      </div>

      {showKeyboard && (
        <div className="py-2 w-full">
          {type === "number" ? (
            <NumericKeyboard onChangeHandler={onChangeHandler} />
          ) : (
            <AlphaNumericKeyboard onChangeHandler={onChangeHandler} />
          )}
        </div>
      )}
    </>
  );
}

export default KeyboardInput;
