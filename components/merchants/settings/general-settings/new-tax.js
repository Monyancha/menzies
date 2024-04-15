import { Modal, Button, TextInput, Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../../../src/store/Store";
import { IconPlus } from "@tabler/icons-react";
import { getAllTaxesList } from "../../../../src/store/merchants/settings/access-control-slice";

function NewTaxModal() {
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");

  function clearForm() {
    setName("");
    setRate("");
  }

  async function handleSubmit() {
    setLoading(true);

    const accessToken = session.user.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/tax/store`;

    const data = {
      name: name,
      rate: rate,
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
        message: "Tax created successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getAllTaxesList(params));

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
          <Select
            placeholder="Tax Type"
            label="Tax Type"
            value={name}
            onChange={(e) => setName(e)}
            data={[
              { value: "VAT", label: "VAT" },
              { value: "LEVY", label: "LEVY" },
              { value: "SERVICE_CHARGE", label: "SERVICE CHARGE" },
            ]}
            searchable
            withAsterisk
            clearable
          />
          {/* <TextInput
            placeholder="Tax Name"
            label="Tax Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          /> */}
          <TextInput
            placeholder="Rate %"
            label="Rate %"
            value={rate}
            onChange={(e) => setRate(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Save Tax
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
      >
        New Tax
      </Button>
    </>
  );
}

export default NewTaxModal;
