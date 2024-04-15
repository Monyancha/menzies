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
import { getBookingsList } from "../../../../store/merchants/bookings/bookings-slice";
import { useRouter } from "next/router";
import store from "../../../../store/store";
import { IconPlus, IconCash } from "@tabler/icons";
import { getAllSettingUnits } from "../../../../store/merchants/settings/access-control-slice";

function NewUnitModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unitCode, setUnitCode] = useState("");
  const [name, setName] = useState("");
  const [baseUnit, setBaseUnit] = useState("");
  const [operator, setOperator] = useState("");
  const [opValue, setOpValue] = useState("");

  function clearForm() {
    setUnitCode("");
    setName("");
    setBaseUnit("");
    setOperator("");
    setOpValue("");
  }

  async function handleSubmit() {
    setLoading(true);

    const accessToken = session.user.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/units/store`;

    const data = {
      unit_code: unitCode,
      unit_name: name,
      base_unit: baseUnit,
      operator: operator,
      operation_value: opValue,
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
        message: "Unit created successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getAllSettingUnits(params));

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
        title="New Unit"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <TextInput
            placeholder="Unit Code"
            label="Unit Code"
            withAsterisk
            value={unitCode}
            onChange={(e) => setUnitCode(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Unit Name"
            label="Unit Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Base Unit"
            label="Base Unit"
            value={baseUnit}
            onChange={(e) => setBaseUnit(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Operator"
            label="Operator"
            value={operator}
            onChange={(e) => setOperator(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Operation Value"
            label="Operation Value"
            value={opValue}
            onChange={(e) => setOpValue(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Save Unit
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
      >
        New Unit
      </Button>
    </>
  );
}

export default NewUnitModal;
