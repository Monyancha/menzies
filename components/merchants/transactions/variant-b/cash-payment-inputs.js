import { useState } from "react";
import { setPaymentAmount } from "../../../../store/merchants/transactions/transaction-slice";
import store from "../../../../store/store";
import KeyboardInput from "../../../ui/forms/keyboard-input";

function CashPaymentInputs({ index, amount }) {
  const [value, setValue] = useState(amount);

  function setAmount(event_value) {
    setValue(event_value);
    const params = {
      itemId: index,
      amount: event_value,
    };
    store.dispatch(setPaymentAmount(params));
  }

  return (
    <div className="w-full">
      <KeyboardInput
        label="Cash"
        type="number"
        placeholder="Enter amount"
        value={value}
        onChangeHandler={setAmount}
      />
    </div>
  );
}

export default CashPaymentInputs;
