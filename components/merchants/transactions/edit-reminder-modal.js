//EditTransactionReminderModal
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
import { IconPlus, IconEdit } from "@tabler/icons";
import { getReminders } from "@/store/merchants/transactions/transaction-slice";

function EditTransactionReminderModal({ item }) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reminderType, setReminderType] = useState(item?.reminder_type);
  const [reminderValue, setReminderValue] = useState(item?.reminder_value);
  const [message, setMessage] = useState(item?.message);

  function clearForm() {
    setReminderType("");
    setMessage("");
    setReminderValue("");
  }

  async function handleSubmit() {
    setLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/transaction/reminder/${item?.id}`;

    const data = {
      reminder_type: reminderType,
      reminder_value: reminderValue,
      message: message,
    };

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
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
        message: "Reminder updated successfully.",
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
        title="Edit Transaction Reminder"
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
            Update Reminder
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEdit size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
      >
        Edit
      </Button>
    </>
  );
}

export default EditTransactionReminderModal;
