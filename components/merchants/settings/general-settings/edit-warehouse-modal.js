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
import { IconEdit, IconCash } from "@tabler/icons";
import { getAllWarehouses } from "../../../../store/merchants/settings/access-control-slice";

function EditWareHouseModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item?.name);
  const [phone, setPhone] = useState(item?.phone_number);
  const [email, setEmail] = useState(item?.email);
  const [address, setAddress] = useState(item?.address);

  const itemId = item?.id;

  function clearForm() {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
  }

  async function handleSubmit() {
    setLoading(true);

    const accessToken = session.user.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/warehouses/update/${itemId}`;

    const data = {
      name: name,
      phone_number: phone,
      email: email,
      address: address,
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
        message: "Warehouse update successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getAllWarehouses(params));

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
        title="Update Warehouse"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Phone Number"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Email Address"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Address"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Update Warehouse
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

export default EditWareHouseModal;
