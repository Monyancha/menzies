import {
  Button,
  Modal,
  TextInput,
  Select,
  useMantineTheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../src/store/Store";
import { DatePicker } from "@mantine/dates";
import { fetchAllStaffIncome } from "../../../src/store/partners/staff-slice";

function MakePaymentModal({ staff, opened, setOpened }) {
  const staffId = staff?.id;

  const { data: session, status } = useSession();
  const [date, setDate] = useState();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [paymentReason, setPaymentReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const [paymentReasonData, setPaymentReasonData] = useState([
    { value: "advance", label: "advance" },
    { value: "commission", label: "commission" },
    { value: "salary", label: "salary" },
  ]);

  const submitData = async (event) => {
    event.preventDefault();

    const data = {
      payment_date: date?.toISOString().split("T")[0],
      payment_amount: amount,
      payment_method: method,
      payment_reason: paymentReason,
      branch_id: branch_id,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/partners/staff/${staffId}/make_payment`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(endpoint, options);
      const result = await response.json();

      console.log(result);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Payment Successfull!",
          color: "green",
        });
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["branch_id"] = branch_id;
        store.dispatch(fetchAllStaffIncome(params));
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result.message,
          color: "red",
        });
      }
    } catch (e) {
      showNotification({
        title: "Error",
        message: "Coud not save record",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        title={`Record New ${staff?.name} Payment`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <DatePicker
            label="Payment Date"
            placeholder="Payment Date*"
            onChange={setDate}
            value={date}
            required
          />

          <TextInput
            placeholder="Amount"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Select
            placeholder="Payment Method"
            label="Payment Method"
            value={method}
            onChange={setMethod}
            data={[
              { value: "mpesa", label: "M-Pesa" },
              { value: "cash", label: "Cash" },
              { value: "visa", label: "Visa/Mastercard" },
              { value: "credit", label: "Credit" },
              { value: "cheque", label: "Cheque" },
              { value: "bank_transfer", label: "Bank Transfer" },
            ]}
            searchable
            clearable
            size="md"
          />

          <Select
            label="Payment Reason"
            data={paymentReasonData}
            value={paymentReason}
            onChange={setPaymentReason}
            placeholder="Payment Reason"
            nothingFound="Nothing Found"
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query} payment reason`}
            onCreate={(query) => {
              const item = {
                value: query.toLowerCase(),
                label: query.toLowerCase(),
              };
              setPaymentReasonData((current) => [...current, item]);
              return item;
            }}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitData} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>
    </>
  );
}

export default MakePaymentModal;
