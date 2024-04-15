import { Modal, Select, Menu, Button, Text, TextInput, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconEdit,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../src/store/Store";
import Link from "next/link";
import { getLists, getDashboard } from "../../src/store/cargo/cargo-slice";

function ReturnCargoModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [reason, setReason] = useState(null);

  // Handler function to update destination state when an option is selected
  const handleDriverChange = (selectedDriver) => {
    setDriverId(selectedDriver);
  };

  const handleReasonsChange = (e) => {
    setReason(e.currentTarget.value); // Set the value of Remarks based on event value
  };

  function clearForm() {
    setDriverId("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    const id = item.id;
    const destination = "Storage";

    const data = {
      id: id,
      destination: destination,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/destination`;

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
        message: "Return successful!",
        color: "green",
      });
      clearForm();
      setLoading(false);
      setOpened(false);
      const params = {};
      params["accessToken"] = accessToken;
      store.dispatch(getDashboard(params));
      store.dispatch(getLists(params));
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
        title="Return Cargo"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >

        <Select
          label="Driver"
          placeholder="Pick driver"
          data={['Driver 1', 'Driver 2', 'Driver 3']}
          searchable
          value={driverId} // Pass the selected value to the Select component
          onChange={handleDriverChange}
        />

        <Textarea
          placeholder="Reason"
          label="Reason"
          value={reason}
          onChange={handleReasonsChange}
          withAsterisk
        />

        <section className="flex justify-end space-y-2 p-3 rounded-lg my-3">
          <Button variant="outline" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEdit size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        color="green"
      >
        Return
      </Button>

    </>
  );
}

export default ReturnCargoModal;
