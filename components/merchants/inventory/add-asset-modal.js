import {
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
  Select,
  Alert,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus, IconAlertCircle } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import { getAssets } from "@/store/merchants/inventory/inventory-slice";

function AddAssetModal({ bill, billId, balance }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  //
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  function clearForm() {
    setName("");
    setAmount("");
    setDescription("");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      showNotification({
        title: "Error",
        message: "Title is required! ",
        color: "red",
      });
      return;
    }

    if (!amount) {
      showNotification({
        title: "Error",
        message: "Value is required! ",
        color: "red",
      });
      return;
    }

    const data = {
      name,
      amount,
      description,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/store-asset`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    setLoading(true);

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log(result);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Asset created successfully!",
        color: "green",
      });
      clearForm();
      setLoading(false);
      setOpened(false);
      const params = {};
      params["accessToken"] = accessToken;
      store.dispatch(getAssets(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        title="Add Asset"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <TextInput
            placeholder="Asset Title"
            label="Asset Title"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Value (KSH)"
            label="Value (KSH)"
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />

          <Textarea
            placeholder="Description"
            label="Description"
            value={description}
            minRows={3}
            autosize
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Add Asset
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
      >
        Add Asset
      </Button>
    </>
  );
}

export default AddAssetModal;
