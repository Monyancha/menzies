import { Modal, Select, Menu, Button, Text, TextInput } from "@mantine/core";
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

function ScreenCargoModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [awbNo, setAwb] = useState("");
  const [nature, setNature] = useState("");
  const [pieces, setPieces] = useState("");

  const handleChange = (e) => {
    // Remove non-numeric characters using a regular expression
    const value = e.currentTarget.value.replace(/\D/g, '');
    setPieces(value);
  };

  function clearForm() {
    setAwb("");
    setNature("");
    setPieces("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!awbNo) {
      showNotification({
        title: "Error",
        message: "AWB Number is required!",
        color: "red",
      });
      return;
    }

    if (!nature) {
      showNotification({
        title: "Error",
        message: "Nature of Goods is required!",
        color: "red",
      });
      return;
    }

    if (!pieces) {
      showNotification({
        title: "Error",
        message: "No. of Pieces is required!",
        color: "red",
      });
      return;
    }

    const cargoId = item.id;

    const data = {
      awb: awbNo,
      nature_of_goods: nature,
      no_of_pieces: pieces,
      cargo_id: cargoId
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/screening/${item?.id}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PUT",
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
        message: "Cargo Screening successful!",
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
        title="Screen Cargo"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
        <TextInput
            placeholder="AWB Number"
            label="AWB Number"
            withAsterisk
            value={awbNo}
            onChange={(e) => setAwb(e.currentTarget.value)}
          />

        <TextInput
            placeholder="Nature of Goods"
            label="Nature of Goods"
            withAsterisk
            value={nature}
            onChange={(e) => setNature(e.currentTarget.value)}
          />

          <TextInput
            placeholder="No. of Pieces"
            label="No. of Pieces"
            type="pieces"
            withAsterisk
            inputMode="numeric"
            value={pieces}
            onChange={handleChange}
          />


        <section className="flex justify-between p-3 rounded-lg my-3"> {/* Change justify-end to justify-between */}
          <Button variant="outline" color="green" onClick={() => setOpened(false)}>{/* Add Cancel button */}
            Cancel
          </Button>
          <Button variant="outline" color="purple" onClick={handleSubmit} loading={loading}>
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
        Screen
      </Button>

    </>
  );
}

export default ScreenCargoModal;
