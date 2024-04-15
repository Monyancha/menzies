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
import { getBookingsList } from "../../../../store/merchants/bookings/bookings-slice";
import { useRouter } from "next/router";
import store from "../../../../store/store";
import { IconPlus, IconSettings } from "@tabler/icons";
import { getAllWarehouses } from "../../../../store/merchants/settings/access-control-slice";

function EditCategoryModal({ category, settings }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highSpendingCustomers, setHighSpendingCustomers] = useState(settings?.high_spending_customers ?? "");
  const [frequentCustomers, setFrequentCustomers] = useState(settings?.frequent_customers ?? "");
  const [newCustomers, setNewCustomers] = useState(settings?.new_customers ?? "");
  const [churningCustomers, setChurningCustomers] = useState(settings?.churning_customers ?? "");
  const [message, setMessage] = useState(settings?.message ?? "");
  //setLowSpendingCustomers
  const [lowSpendingCustomers, setLowSpendingCustomers] = useState(settings?.low_spending_customers ?? "");


  async function handleSubmit() {
    if (category === "high_spending_customers" && !highSpendingCustomers) {
      showNotification({
        title: "Error",
        message: "Error ): Amount spent is required!",
        color: "red",
      });
      return;
    }

    if (category === "low_spending" && !lowSpendingCustomers) {
      showNotification({
        title: "Error",
        message: "Error ): Min Avg. Amount spent is required!",
        color: "red",
      });
      return;
    }

    if (category === "frequent_customers" && !frequentCustomers) {
      showNotification({
        title: "Error",
        message: "Error ): Number of Visits is required!",
        color: "red",
      });
      return;
    }

    if (category === "new_customers" && !newCustomers) {
      showNotification({
        title: "Error",
        message: "Error ): Number of Visits is required!",
        color: "red",
      });
      return;
    }

    if (category === "churning_customers" && !churningCustomers) {
      showNotification({
        title: "Error",
        message: "Error ): Number of days is required!",
        color: "red",
      });
      return;
    }

    if (category === "churning_customers" && !message) {
      showNotification({
        title: "Error",
        message: "Error ): Churning message is required!",
        color: "red",
      });
      return;
    }

    setLoading(true);

    const accessToken = session.user.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/customer-category-settings`;

    // Dynamically create the data object with non-empty values only
    const data = {};
    if (category === "high_spending_customers" && highSpendingCustomers) {
      data.high_spending_customers = highSpendingCustomers;
    }

    if (category === "low_spending" && lowSpendingCustomers) {
      data.low_spending_customers = lowSpendingCustomers;
    }


    if (category === "frequent_customers" && frequentCustomers) {
      data.frequent_customers = frequentCustomers;
    }

    if (category === "new_customers" && newCustomers) {
      data.new_customers = newCustomers;
    }

    if (category === "churning_customers" && churningCustomers) {
      data.churning_customers = churningCustomers;
      data.message = message;
    }

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
        throw new Error("Failed to update.");
      }

      showNotification({
        title: "Success!",
        message: "Category updated successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;

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
        title="Category Settings"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          {category === "high_spending_customers" && (
            <TextInput
              placeholder="Avg. Amount Spent e.g 1000"
              label="Avg. Amount Spent"
              withAsterisk
              value={highSpendingCustomers}
              onChange={(event) => setHighSpendingCustomers(event.currentTarget.value)}
            />
          )}
          {category === "low_spending" && (
            <TextInput
              placeholder="Min. Avg. Amount Spent e.g 100"
              label="Min. Avg. Amount Spent"
              withAsterisk
              value={lowSpendingCustomers}
              onChange={(event) => setLowSpendingCustomers(event.currentTarget.value)}
            />
          )}
          {category === "frequent_customers" && (
            <TextInput
              placeholder="Min. Number of Customer Visits Per Month e.g 10"
              label="Min. Number of Visits"
              withAsterisk
              onChange={(event) => setFrequentCustomers(event.currentTarget.value)}
              defaultValue={frequentCustomers}
            />
          )}
          {category === "new_customers" && (
            <TextInput
              placeholder="Min. Number of visits for new customers e.g 10"
              label="Min. Number of visits for new customers"
              withAsterisk
              onChange={(event) => setNewCustomers(event.currentTarget.value)}
              defaultValue={newCustomers}
            />
          )}
          {category === "churning_customers" && (
            <>
              <TextInput
                placeholder="No. of Days"
                label="No. of Days"
                description="No. of days after which a customer can be classified as a churning customer."
                withAsterisk
                onChange={(event) => setChurningCustomers(event.currentTarget.value)}
                defaultValue={churningCustomers}
              />

              <Textarea
                label="Churning Message"
                placeholder="Churning Message"
                description="To send customized message include $name in the message body above. Link to the voucher will be automatically added to the end"
                minRows={3}
                autosize
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
              />
            </>
          )}
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Update
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconSettings size={16} />}
        onClick={() => setOpened(true)}
        variant="filled"
        size="xs"
      >
        Settings
      </Button>
    </>
  );
}

export default EditCategoryModal;
