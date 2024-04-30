import { Modal, Select, Menu, Button, Text, TextInput, Textarea, SimpleGrid } from "@mantine/core";
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

function SetDestinationModal({item, drivers, gates}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

    const awbNumber = item.awb;   
    const cargoId = item.cargo_id;   

  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState("");
  const [driverId, setDriverId] = useState("");
  const [gateId, setGateId] = useState("");

  // Handler function to update destination state when an option is selected
  const handleDestinationChange = (selectedDestination) => {
    setDestination(selectedDestination);
  };

  const handleGateChange = (selectedGate) => {
    setGate(selectedGate);
  };

  function clearForm() {
    setDestination("");
  }

  const gatesList =
    gates?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const driversList =
    drivers?.map((item) => ({
      value: item.id,
      label: item.first_name +" "+ item.last_name,
    })) ?? [];    

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!destination) {
      showNotification({
        title: "Error",
        message: "Destination is required!",
        color: "red",
      });
      return;
    }

    const id = item.id;
    const uld = item.uld_id;

    const formData = new FormData();
    formData.append("destination", destination);
    formData.append("id", id);
    formData.append("uld", uld);
    formData.append("driver_id", driverId);
    formData.append("gate_id", gateId);


    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/builduld`;

      const accessToken = session.user.accessToken;

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: formData,
      };

      console.log("Am here 2");

      setLoading(true);

      const response = await fetch(endpoint, options);

      const result = await response.json();
      console.log("Aiden Kabalake", response);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Destination set successfully!",
          color: "green",
        });
        // clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getDashboard(params));
        store.dispatch(getLists(params));
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result?.message,
          color: "red",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification({
        title: "Error",
        message: "Try uploading files below 100Kbs. " + error,
        color: "red",
      });
      setLoading(false); // Turn off loading indicator in case of error
    }
  };


  return (
    <>
      <Modal
        opened={opened}
        title="Set Destination"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
      <Select
        label="Destination"
        placeholder="Pick destination"
        data={['Aircraft', 'Storage']}
        searchable
        value={destination} // Pass the selected value to the Select component
        onChange={handleDestinationChange}
      />

      <Select
        label="Driver"
        placeholder="Driver"
        data={driversList}
        onChange={setDriverId}
        value={driverId}
        searchable
        clearable
      />


     <Select
        label="Gate"
        placeholder="Gate"
        data={gatesList}
        onChange={setGateId}
        value={gateId}
        searchable
        clearable
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
        View
      </Button>

    </>
  );
}

export default SetDestinationModal;
