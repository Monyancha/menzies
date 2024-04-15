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
import store from "../../src/store/Store";
import { useRouter } from "next/router";
import { IconCircleX } from "@tabler/icons-react";
import { getAllExpenses } from "../../src/store/accounts/accounts-slice";

function VoidExpenseModal({ item }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const itemId = item?.id;

  const [referenceCode, setReferenceCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDetails = async (event) => {
    event.preventDefault();

    const formdata = new FormData();
    formdata.append("voiding_code", referenceCode);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/expenses/void-expense/${itemId}`;

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

      if (response.status !== 422 && response.status === 200) {
        showNotification({
          title: "Success",
          message: "Expense Void Successful",
          color: "green",
        });
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getAllExpenses(params));
        //Reset Values
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
        title={`Confirm Void Expense #${item?.expense_number}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Expense Information
          </span>

          <TextInput
            placeholder="Item Name"
            label="Item Name"
            disabled
            defaultValue={
              JSON.parse(item?.items).map((name) => name?.name) ?? "-"
            }
          />

          <TextInput
            placeholder="Voiding Code	"
            label="Voiding Code"
            withAsterisk
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Void Expense
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconCircleX size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        color="red"
        size="xs"
      >
        Void
      </Button>
    </>
  );
}

export default VoidExpenseModal;
