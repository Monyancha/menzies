import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../../store/store";
import { getBookingsList } from "../../../store/merchants/bookings/bookings-slice";
import { useRouter } from "next/router";

function AddDiscountModal({ item }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const itemId = item?.id;

  const [date, setDate] = useState();
  const [amount, setAmount] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [referenceCode, setReferenceCode] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDetails = async (event) => {
    event.preventDefault();

    console.log("Clicked");
  };

  return (
    <>
      <Modal
        opened={opened}
        title="Add Discount"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Discount Information
          </span>

          <TextInput
            placeholder="Discount Amount"
            label="Discount Amount"
            withAsterisk
            value={amount}
            onChange={setAmount}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save Discount
          </Button>
        </section>
      </Modal>

      <Button onClick={() => setOpened(true)} variant="outline">
        Add Discount
      </Button>
    </>
  );
}

export default AddDiscountModal;
