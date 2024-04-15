import { Modal, Select, Menu, Button, Text, TextInput, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconUser,
  IconPlus,
  IconGift,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../src/store/Store";
import Link from "next/link";
import { getLists, getStaff } from "../../src/store/cargo/cargo-slice";


function AddUldModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fnumber, setFNumber] = useState("");
  const [uldnumber, setUldNumber] = useState("");
  const [net, setNet] = useState("");
  const [tractor, setTractor] = useState("");
  const [driver, setDriver] = useState("");
  const [passnumber, setPass] = useState("");
  const [remarks, setRemarks] = useState("");

  function clearForm() {
    setFNumber("");
    setUldNumber("");
    setNet("");
    setTractor("");
    setDriver("");
    setPass("");
    setRemarks("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!fnumber) {
      showNotification({
        title: "Error",
        message: "Flight Number is required!",
        color: "red",
      });
      return;
    }

    if (!uldnumber) {
      showNotification({
        title: "Error",
        message: "ULD Number is required!",
        color: "red",
      });
      return;
    }

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
      flight_number: fnumber,
      uld_number: uldnumber,
      net: net,
      tractor_regn: tractor,
      driver_name: driver,
      kaa_pass_number: passnumber,
      remarks: remarks
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/receiveuld`;

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
        message: "ULD created successfully!",
        color: "green",
      });
      clearForm();
      setLoading(false);
      setOpened(false);
      const params = {};
      params["accessToken"] = accessToken;
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

  // Get Roles
  const items = useSelector((state) => state.cargo.getLists);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getLists(params));
  }, [session, status]);  

  const roles = items?.lists?.roles;

  const rolesList = roles?.map((item) => ({
    value: item.id,
    label: item.role_name,
  })) ?? []


  return (
    <>
      <Modal
        opened={opened}
        title="Create New Uld"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
        <TextInput
            placeholder="Flight Number"
            label="Flight Number"
            withAsterisk
            value={fnumber}
            onChange={(e) => setFNumber(e.currentTarget.value)}
          />

        <TextInput
            placeholder="ULD Number"
            label="ULD Number"
            withAsterisk
            value={uldnumber}
            onChange={(e) => setUldNumber(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Net"
            label="Net"
            value={net}
            onChange={(e) => setNet(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Tractor Registration"
            label="Tractor Registration"
            value={tractor}
            onChange={(e) => setTractor(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Driver's Name"
            label="Driver's Name"
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
            placeholder="Enter your remarks here"
            label="Remarks"
            value={remarks}
            rows={4} // specify the number of rows
            cols={50} // specify the number of columns
            onChange={(e) => setRemarks(e.currentTarget.value)}            
          />



        <section className="flex justify-end space-y-2 p-3 rounded-lg my-3">
          <Button variant="outline" onClick={handleSubmit} loading={loading}>
            Save ULD
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        New ULD
      </Button>

    </>
  );
}

export default AddUldModal;
