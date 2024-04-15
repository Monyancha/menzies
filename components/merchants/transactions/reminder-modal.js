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
import { useState, useEffect, useMemo } from "react";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import store from "@/store/store";
import { IconPlus, IconCash } from "@tabler/icons";
import { getReminders } from "@/store/merchants/transactions/transaction-slice";

function TransactionReminderModal() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reminderType, setReminderType] = useState("");
  const [reminderValue, setReminderValue] = useState("");
  const [message, setMessage] = useState("");

  function clearForm() {
    setReminderType("");
    setMessage("");
    setReminderValue("");
  }

  async function handleSubmit() {
    setLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/transaction/reminder`;

    const data = {
      reminder_type: reminderType,
      reminder_value: reminderValue,
      message: message,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create.");
      }

      showNotification({
        title: "Success!",
        message: "Reminder created successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = accessToken;
      store.dispatch(getReminders(params));

      clearForm();
      setOpened(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="New Transaction Reminder"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <Select
            label="Reminder Type"
            placeholder="Reminder Type"
            searchable
            required
            value={reminderType}
            data={[
              { value: "no_transactions", label: "No of Transactions" },
              { value: "reminder_days", label: "Reminder Days" },
            ]}
            clearable
            onChange={(value) => setReminderType(value)}
          />
          <TextInput
            placeholder="Reminder Value"
            label="Reminder Value"
            value={reminderValue}
            onChange={(e) => setReminderValue(e.currentTarget.value)}
          />
          <Textarea
            placeholder="Message"
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Save Reminder
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
      >
        New Reminder
      </Button>
    </>
  );
}

export default TransactionReminderModal;
