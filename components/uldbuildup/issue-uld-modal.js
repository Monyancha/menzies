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

function IssueUldModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uldnumber, setUld] = useState(item?.uld_number ?? "");
  const [net, setNet] = useState("");
  const [sideRope, setRope] = useState("");
  const [straps, setStrap] = useState("");
  const [tractor, setTractor] = useState("");
  const [driver, setDriver] = useState("");
  const [passnumber, setPass] = useState("");
  const [remarks, setRemarks] = useState("");
  const [destination, setDestination] = useState("");

   const handleDestinationChange = (selectedDestination) => {
    setDestination(selectedDestination);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.currentTarget.value); // Set the value of Remarks based on event value
  };


  function clearForm() {
    setNet("");
    setRope("");
    setStrap("");
    setDriver("");
    setPass("");
    setRemarks("");
    setDestination("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!net) {
      showNotification({
        title: "Error",
        message: "Net is required!",
        color: "red",
      });
      return;
    }

    if (!tractor) {
      showNotification({
        title: "Error",
        message: "Tractor Registration Number is required!",
        color: "red",
      });
      return;
    }

    if (!driver) {
      showNotification({
        title: "Error",
        message: "Driver Name is required!",
        color: "red",
      });
      return;
    }

    if (!passnumber) {
      showNotification({
        title: "Error",
        message: "KAA Pass Number is required!",
        color: "red",
      });
      return;
    }

    if (!remarks) {
      showNotification({
        title: "Error",
        message: "Remarks is required!",
        color: "red",
      });
      return;
    }


    const data = {
      uld_number: uldnumber,
      net: net,
      tractor_regn: tractor,
      driver_name: driver,
      kaa_pass_number: passnumber,
      side_rope: sideRope,
      straps: straps,
      remarks: remarks
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/issueuld`;

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
        message: "ULD issue successful!",
        color: "green",
      });
      clearForm();
      setLoading(false);
      setOpened(false);
      const params = {};
      params["accessToken"] = accessToken;
      store.dispatch(getLists(params));
      store.dispatch(getDashboard(params));
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
        title="Issue ULD"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >


        <TextInput
            placeholder="ULD Number"
            label="ULD Number"
            withAsterisk
            value={uldnumber}
            onChange={(e) => setUld(e.currentTarget.value)}
          />

        <TextInput
            placeholder="Net"
            label="Net"
            withAsterisk
            value={net}
            onChange={(e) => setNet(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Side Rope"
            label="Side Rope"
            value={sideRope}
            onChange={(e) => setRope(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Straps"
            label="Straps"
            value={straps}
            onChange={(e) => setStrap(e.currentTarget.value)}
          />

           <Select
            label="Destination"
            placeholder="Pick destination"
            data={['Aircraft', 'Client']}
            searchable
            value={destination} // Pass the selected value to the Select component
            onChange={handleDestinationChange}
          />

          <TextInput
            placeholder="Tractor Registration"
            label="Tractor Registration"
            value={tractor}
            onChange={(e) => setTractor(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Driver's Name"
            label="Driver"
            value={driver}
            onChange={(e) => setDriver(e.currentTarget.value)}
          />

          <TextInput
            placeholder="KAA Pass Number"
            label="KAA Pass Number"
            value={passnumber}
            onChange={(e) => setPass(e.currentTarget.value)}
          />

         <Textarea
            placeholder="Remarks"
            label="Remarks"
            value={remarks}
            onChange={handleRemarksChange}
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
        Issue
      </Button>

    </>
  );
}

export default IssueUldModal;
