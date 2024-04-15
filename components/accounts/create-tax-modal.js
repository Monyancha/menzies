import {
  Button,
  Modal,
  Select,
  TextInput,
  Group,
  Textarea,
  Badge,
  Paper,
  Text,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { getAllTaxes } from "../../src/store/accounts/accounts-slice";
import store from "../../src/store/Store";

function CreateTaxModal() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [opened, setOpened] = useState(false);

  const [taxType, setTaxType] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [loading, setLoading] = useState(false);

  function clearForm() {
    setTaxType("");
    setTaxAmount("");
  }

  async function handleSubmit() {
    setLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/create-new-tax`;

    const data = {
      tax_type: taxType,
      tax_amount: taxAmount,
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
        throw new Error("Failed to create new tax.");
      }

      showNotification({
        title: "Success!",
        message: "Tax created successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = accessToken;
      store.dispatch(getAllTaxes(params));

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
        title="New Tax"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">Tax Information</span>

          <Select
            placeholder="Tax Type"
            label="Tax Type"
            value={taxType}
            onChange={setTaxType}
            data={[
              { value: "percentage", label: "Percentage %" },
              { value: "fixed", label: "Fixed Value" },
            ]}
            searchable
            withAsterisk
            clearable
          />

          <TextInput
            placeholder="Tax Amount eg. 16"
            label="Tax Amount"
            withAsterisk
            value={taxAmount}
            onChange={(e) => setTaxAmount(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button variant="outline" onClick={handleSubmit} loading={loading}>
            Save Tax
          </Button>
        </section>
      </Modal>

      <Button
        variant="outline"
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
      >
        Create Tax
      </Button>
    </>
  );
}

export default CreateTaxModal;
