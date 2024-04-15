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
import { getAllWarehouses } from "../../../../store/merchants/settings/access-control-slice";
import { getWarehouses } from "@/store/merchants/settings/access-control-slice";
import { useSelector } from "react-redux";

function NewWareHouseModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);


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
    const endpoint = `${API_URL}/settings/warehouses/store`;

    const data = {
      name: name,
      phone_number: phone,
      email: email,
      address: address,
      branch_id:branch_id
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
        message: "Warehouse created successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["branch_id"] = branch_id;
      store.dispatch(getAllWarehouses(params));
      store.dispatch(getWarehouses(params));
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
        title="New Warehouse"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* <section className="flex flex-col space-y-2 bg-dark p-3 rounded-lg"> */}
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
        {/* </section> */}

        <section className="flex justify-end space-y-2 mt-3 rounded-lg">
          <Button onClick={handleSubmit} loading={loading}>
            Save Warehouse
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
      >
        New
      </Button>
    </>
  );
}

export default NewWareHouseModal;
