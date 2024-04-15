import {
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
  Select,
  Alert,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus, IconAlertCircle } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import { getRFQItems } from "../../../store/merchants/inventory/purchases-slice";
import { DatePicker } from "@mantine/dates";
import { getBillPayments } from "@/store/merchants/inventory/inventory-slice";

function AddPaymentModal({ bill, billId, balance }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  //
  const [date, setPaymentDate] = useState("");
  const [company, setCompany] = useState(bill?.company?.name);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [narration, setNarration] = useState("");

  function clearForm() {
    setPaymentDate("");
    setCompany("");
    setAmount("");
    setPaymentMethod("");
    setPhone("");
    setReferenceCode("");
    setNarration("");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!date) {
      showNotification({
        title: "Error",
        message: "Date is required! ",
        color: "red",
      });
      return;
    }

    if (!amount) {
      showNotification({
        title: "Error",
        message: "Amount is required! ",
        color: "red",
      });
      return;
    }

    if (amount > balance) {
      showNotification({
        title: "Error",
        message: "Your amount exceeds the required bill amount of Ksh. " + balance + "!",
        color: "red",
      });
      return;
    }

    const data = {
      phone_number: phone,
      transaction_code: referenceCode,
      payment_date: date,
      company_id: bill?.company_id,
      amount: amount,
      payment_id: paymentMethod,
      narration: narration,
      referenceable_id: bill?.id,
      payment_type: paymentMethod,
      referenceable_type: bill?.referenceable_type,
      type: "debit",
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/bill/pay/${billId}`;

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

    setLoading(true);

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log(result);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Your payment was successfull!",
        color: "green",
      });
      clearForm();
      setLoading(false);
      setOpened(false);
      const params = {};
      params["accessToken"] = accessToken;
      params["billId"] = billId;
      store.dispatch(getBillPayments(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        title="Add Payment"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
        <Alert
            icon={<IconAlertCircle size={16} />}
            title="Bill Balance"
            radius="md"
            color="red"
            withCloseButton
          >
            Your Bill Balance is 
            <b> Ksh. {balance ?? 0}. </b> <br/>
            <small>You can now be able make partial payments!</small>
          </Alert>

          <TextInput
            placeholder="Company"
            label="Company"
            value={company}
            readOnly
            onChange={(e) => setCompany(e.currentTarget.value)}
          />

          <DatePicker
            placeholder="Payment Date"
            label="Payment Date"
            value={date}
            required
            onChange={setPaymentDate}
          />

          <TextInput
            placeholder="Payment Amount"
            label="Payment Amount"
            withAsterisk
            value={amount}
            required
            onChange={(e) => setAmount(e.currentTarget.value)}
          />

          <Select
            placeholder="Payment Method"
            label="Payment Method"
            value={paymentMethod}
            onChange={setPaymentMethod}
            data={[
              { value: "2", label: "M-Pesa" },
              { value: "1", label: "Cash" },
              { value: "3", label: "Visa/Mastercard" },
              { value: "6", label: "Credit" },
              { value: "4", label: "Cheque" },
              { value: "5", label: "Bank Transfer" },
            ]}
            searchable
            clearable
          />

          <TextInput
            placeholder="Phone Number"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Payment Reference code eg. AASYHF3526R"
            label="Payment Ref"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.currentTarget.value)}
          />

          <Textarea
            placeholder="Narration"
            label="Narration"
            value={narration}
            minRows={3}
            autosize
            onChange={(e) => setNarration(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Add Payment
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
      >
        Add Payment
      </Button>
    </>
  );
}

export default AddPaymentModal;
