import {
    Modal,
    useMantineTheme,
    Button,
    TextInput,
    Select,
    Textarea,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useSession } from "next-auth/react";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "../../../store/store";
  import { getBookingsList } from "../../../store/merchants/bookings/bookings-slice";
  import { useRouter } from "next/router";
  import { IconCurrencyDollar } from "@tabler/icons";
  import { getAllInvoices } from "../../../store/merchants/accounts/acounts-slice";
  
  function CreditNoteModal({ item }) {
    const { data: session, status } = useSession();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const router = useRouter();
  
    const itemId = item?.id;
  
    const [date, setDate] = useState(null);
    const [reason, setReason] = useState("");
    const [amount, setAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const submitDetails = async (event) => {
      event.preventDefault();

      if (!amount) {
        showNotification({
          title: "Error",
          message: "Amount is required!",
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

  
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const day = dateObj.getDate().toString().padStart(2, "0");
      const paymentDate = `${year}-${month}-${day}`;
  
      const formdata = new FormData();
      formdata.append("invoice_id", item?.id);
      formdata.append("date", paymentDate);
      formdata.append("amount", amount);
      formdata.append("reason", reason);
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/accounts/credit-notes/store`;
  
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
            message: "Credit note recorded Successfully",
            color: "green",
          });
          setOpened(false);
        //   router.push('/merchants/credit-notes')
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getAllInvoices(params));
          //Reset Values
          setDate("");
          setAmount("");
          setReason("");
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
          title={`${item?.invoice_number} Credit Note`}
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
            <TextInput
              placeholder="Payment Amount"
              label="Payment Amount"
              withAsterisk
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            />
  
            <DatePicker
              placeholder="Reversal Date"
              label="Reversal Date"
              value={date}
              onChange={setDate}
            />

            <Textarea
              placeholder="Reason displayed on Credit Note"
              label="Reason displayed on Credit Note"
              withAsterisk
              value={reason}
              onChange={(e) => setReason(e.currentTarget.value)}
            />

          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={submitDetails} loading={isSubmitting}>
              Save Credit Note
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconCurrencyDollar size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
          color="pink"
        >
          Credit Note
        </Button>
      </>
    );
  }
  
  export default CreditNoteModal;
  