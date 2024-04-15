import { ActionIcon, TextInput } from "@mantine/core";
import { IconCalculator, IconX, IconEqual } from "@tabler/icons";
import { create, all } from "mathjs";
import { useState } from "react";

const config = {
  matrix: "Array", // Choose 'Matrix' (default) or 'Array'
};
const math = create(all, config);

function CalculatedInput({
  placeholder = null,
  label = null,
  value = "",
  onChangeHandler,
} = {}) {
  const [enteredValue, setEnteredValue] = useState(value);
  const [calculatorMode, setCalculatorMode] = useState(false);

  function onValueChanged(event) {
    setEnteredValue(event.target.value);
    if (calculatorMode) {
      return;
    }

    onChangeHandler(event.target.value);
  }

  function toggleCalculatorMode() {
    if (calculatorMode) {
      setCalculatorMode(false);
      calculateValue();
      return;
    }

    setCalculatorMode(true);
  }

  function calculateValue() {
    let parsedString = `${enteredValue}`;
    parsedString = parsedString.replace(/x/g, "*");

    let result = 1;

    try {
      result = math.evaluate(parsedString);
    } catch (e) {
      console.warn(`MATH CACULATION ERROR::${label}`, e);
    }

    setEnteredValue(result);
    onChangeHandler(result);

    setCalculatorMode(false);
  }

  return (
    <>
      <div className="w-full flex items-end gap-2">
        <div className="grow">
          <TextInput
            type={calculatorMode ? "text" : "number"}
            placeholder={placeholder}
            label={label}
            value={enteredValue}
            onChange={onValueChanged}
          />
        </div>
        <div className="flex items-end gap-1 pb-[0.7px]">
          {calculatorMode && (
            <ActionIcon
              variant="outline"
              size="lg"
              color="green"
              onClick={calculateValue}
            >
              <IconEqual size={16} />
            </ActionIcon>
          )}

          <ActionIcon
            variant="outline"
            size="lg"
            color={calculatorMode ? "red" : "blue"}
            onClick={toggleCalculatorMode}
          >
            {calculatorMode ? (
              <IconX size={16} />
            ) : (
              <IconCalculator size={16} />
            )}
          </ActionIcon>
        </div>
      </div>
    </>
  );
}

export default CalculatedInput;
