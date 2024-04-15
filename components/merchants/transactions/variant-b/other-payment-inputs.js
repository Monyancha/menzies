import { Select, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { isRestaurant } from "../../../../lib/shared/roles_and_permissions";
import {
  setPaymentAmount,
  setOtherPaymentName,
  setIsComplimentary
} from "../../../../store/merchants/transactions/transaction-slice";
import store from "../../../../store/store";
import KeyboardInput from "../../../ui/forms/keyboard-input";

function OtherPayment({ index, amount, name }) {
  const { data: session } = useSession();

  const [value, setValue] = useState(amount);
  const [type, setType] = useState(name);

  const isRestaurantAc = isRestaurant(session?.user);

  let paymentTypes = [];

  if (isRestaurantAc) {
    const restaurantPaymentTypes = [
      { value: "glovo", label: "Glovo" },
      { value: "jumia", label: "Jumia Food" },
      { value: "bolt", label: "Bolt Food" },
      { value: "uber", label: "Uber Eats" },
      {value:"complimentary",label:"Complimentary"}
    ];

    paymentTypes = [...paymentTypes, ...restaurantPaymentTypes];
  }

  function setAmount(event_value) {
    setValue(event_value);
    const params = {
      itemId: index,
      amount: event_value,
    };
    store.dispatch(setPaymentAmount(params));
  }

  function setPaymentName(type) {
    setType(type);
    const params = {
      itemId: index,
      name: type,
    };
    store.dispatch(setOtherPaymentName(params));
   
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Select
          placeholder="Type"
          label="Type"
          value={type}
          onChange={setPaymentName}
          data={paymentTypes}
          searchable
          clearable
        />

        <KeyboardInput
          label="Amount"
          type="number"
          placeholder="Enter amount"
          value={value}
          onChangeHandler={setAmount}
        />
      </div>
    </div>
  );
}

export default OtherPayment;
