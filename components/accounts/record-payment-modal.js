import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../src/store/Store";
import { useRouter } from "next/router";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { getAllInvoices } from "../../src/store/accounts/accounts-slice";

function RecordPaymentModal({ item }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const itemId = item?.id;

  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDetails = async (event) => {
    event.preventDefault();

    if (!paymentMethod) {
      showNotification({
        title: "Error",
        message: "Payment Method is required!",
        color: "red",
      });
      return;
    }

    if (!date) {
      showNotification({
        title: "Error",
        message: "Date is required!",
        color: "red",
      });
      return;
    }

    if (!amount) {
      showNotification({
        title: "Error",
        message: "Amount is required!",
        color: "red",
      });
      return;
    }

    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const paymentDate = `${year}-${month}-${day}`;

    const formdata = new FormData();
    formdata.append("payment_date", paymentDate);
    formdata.append("payment_amount", amount);
    formdata.append("payment_method", paymentMethod);
    formdata.append("payment_reference", referenceCode);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/invoices/pay-for-invoice/${itemId}`;

    const accessToken = session.user.accessToken;

    setIsSubmitting(true);

    const response = fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
      body: formdata,
    }).then(async (response) => {
      const data = await response.json();
      console.log("Response Data", data);
      console.log(response);

      if (data.statusCode !== 201 && response.status === 200 && !data.error) {
        showNotification({
          title: "Success",
          message: "Payment Recorded Successfully",
          color: "green",
        });
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getAllInvoices(params));
        //Reset Values
        setDate("");
        setAmount("");
        setPaymentMethod("");
        setReferenceCode("");
        setIsSubmitting(false);
      } else {
        showNotification({
          title: "Error",
          message: "Error ): " + data.error,
          color: "red",
        });
        setIsSubmitting(false);
      }
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        title="Record New Invoice Payment"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Customer Information
          </span>

          <DatePickerInput
            placeholder="Payment Date"
            label="Payment Date"
            value={date}
            onChange={setDate}
          />

          <TextInput
            placeholder="Payment Amount"
            label="Payment Amount"
            withAsterisk
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />

          <Select
            placeholder="Payment Method"
            label="Payment Method"
            value={paymentMethod}
            onChange={setPaymentMethod}
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
          />

          <TextInput
            placeholder="Payment Reference code eg. AASYHF3526R"
            label="Payment Ref"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button variant="outline" onClick={submitDetails} loading={isSubmitting}>
            Save Payment
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconCurrencyDollar size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
        color="green"
      >
        Record payment
      </Button>
    </>
  );
}

export default RecordPaymentModal;
