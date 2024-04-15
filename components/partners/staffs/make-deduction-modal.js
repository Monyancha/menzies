import { Button, Modal, TextInput, Textarea } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../src/store/Store";
import { DatePicker } from "@mantine/dates";
import { fetchAllStaffIncome } from "../../../src/store/partners/staff-slice";

function MakeDeductionModal({ opened, setOpened, staff }) {
  const staffId = staff?.id;

  const { data: session, status } = useSession();
  const [date, setDate] = useState();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearForm() {
    setDate("");
    setAmount("");
    setReason("");
  }

  const branch_id = useSelector((state) => state.branches.branch_id);

  const submitData = async (event) => {
    event.preventDefault();

    const data = {
      date: date?.toISOString().split("T")[0],
      amount,
      reason,
      branch_id: branch_id,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/partners/staff/${staffId}/deduct_staff`;

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

      clearForm();

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Records saved successfully!",
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
        title={`Deduct from ${staff?.name}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
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

          <Textarea
            placeholder="Reason"
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
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

export default MakeDeductionModal;
