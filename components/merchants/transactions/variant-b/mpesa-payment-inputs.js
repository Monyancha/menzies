import { Button, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  setMpesaPaymentCode,
  setMpesaPaymentPhone,
  setPaymentAmount,
  sendStkPush,
} from "../../../../store/merchants/transactions/transaction-slice";
import store from "../../../../store/store";
import KeyboardInput from "../../../ui/forms/keyboard-input";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { showNotification } from "@mantine/notifications";

function MpesaPaymentInputs({
  index,
  amount,
  phone,
  transactionCode,
  checkout_id,
}) {
  const [enteredAmount, setEnteredAmount] = useState(amount ?? "");
  const [phoneNumber, setPhoneNumber] = useState(phone ?? "");
  const [checkout, setCheckoutid] = useState(checkout_id ?? "");
  const [code, setCode] = useState(transactionCode ?? "");
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);
  const userId = useMemo(() => {
    return session?.user?.id;
  }, [session]);

  const isSendingStkPush = useSelector(
    (state) => state.posTransaction.stkPushStatus === "loading"
  );

  const currentCheckoutId = useSelector(
    (state) => state.posTransaction.mpesaCheckoutId
  );

  const currentAmount = useSelector(
    (state) => state.posTransaction.mpesaAmount
  );

  function setAmount(event_value) {
    setEnteredAmount(event_value);

    const params = {
      itemId: index,
      amount: event_value,
    };
    store.dispatch(setPaymentAmount(params));
  }

  function setPhone(event) {
    setPhoneNumber(event.target.value);

    const params = {
      itemId: index,
      phone: event.target.value,
    };
    store.dispatch(setMpesaPaymentPhone(params));
  }

  function setTransactionCode(event) {
    setCode(event.target.value);

    const params = {
      itemId: index,
      code: event.target.value,
    };
    store.dispatch(setMpesaPaymentCode(params));
  }

  function sendStkPushHandler() {
    if (!phoneNumber || !enteredAmount) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["phone"] = phoneNumber;
    params["amount"] = enteredAmount;

    store.dispatch(sendStkPush(params));
  }

  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !userId) {
      return;
    }

    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      encrypted: true,
      forceTLS: true,
    });

    echo
      .channel(`transactions.${userId}`)
      .subscribed(() => {
        console.log("ECHO:: Subscribed to transactions channel");
      })
      .listen(".stk-safaricom-response", (data) => {
        data = JSON.parse(data);
        console.log(
          "ECHO::Received:: ",
          data?.check_out_id,
          currentCheckoutId,
          currentAmount,
          data?.transaction_code,
          data?.amount
        );

        setCode(data?.transaction_code);
        setEnteredAmount(data?.amount);

        const params = {
          itemId: index,
          code: data?.transaction_code,
        };
        console.log("DISPATCHING:: ", params);
        store.dispatch(setMpesaPaymentCode(params));

        showNotification({
          title: "Success",
          message: "Received payment",
          color: "green",
        });
      })
      .error((e) => {
        console.log("Could not connect ", e);
      });
  }, [accessToken, userId, status, index, currentCheckoutId, currentAmount]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex flex-wrap space-y-1 w-full">
        <KeyboardInput
          label="Amount"
          type="number"
          placeholder="Enter amount"
          value={enteredAmount}
          onChangeHandler={setAmount}
        />
      </div>

      <div className="flex flex-wrap space-y-1 w-full">
        <div className="flex w-full items-end gap-2">
          <div className="grow">
            <TextInput
              type="text"
              placeholder="Phone Number"
              label="Phone Number"
              value={phoneNumber}
              onChange={setPhone}
            />
          </div>

          <Button
            variant="outline"
            onClick={sendStkPushHandler}
            loading={isSendingStkPush}
          >
            Send
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap space-y-1 w-full">
        <div className="w-full">
          <TextInput
            type="text"
            placeholder="Transaction Code"
            label="Transaction Code"
            value={code}
            onChange={setTransactionCode}
          />
        </div>
      </div>
    </div>
  );
}

export default MpesaPaymentInputs;
