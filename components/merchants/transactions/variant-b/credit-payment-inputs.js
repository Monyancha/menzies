import { useContext, useState } from "react";
import PaymentsContext from "../../../../store/merchants/transactions/payments-context";

function CreditPaymentInputs({ index, amount }) {
  const [value, setValue] = useState(amount);
  const paymentsCtx = useContext(PaymentsContext);

  function setAmount(event) {
    paymentsCtx.actions.setCreditPaymentAmount(index, event.target.value);

    setValue(event.target.value);
  }

  return (
    <div className="w-full">
      <input
        type="number"
        placeholder="Enter an amount"
        className="input input-primary w-full"
        onChange={setAmount}
        value={value}
      />
    </div>
  );
}

export default CreditPaymentInputs;
