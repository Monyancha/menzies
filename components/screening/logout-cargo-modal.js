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

function LogoutCargoModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fname, setFName] = useState(item?.first_name ?? "");
  const [lname, setLName] = useState(item?.last_name ?? "");
  const [email, setEmail] = useState(item?.email ?? "");
  const [phone, setPhone] = useState(item?.phone_number ?? "");
  const [nid, setNId] = useState(item?.nid ?? "");

  function clearForm() {
    setFName("");
    setLName("");
    setNId("");
    setEmail("");
    setPhone("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();


    const data = {
      first_name: fname,
      last_name: lname,
      email: email,
      phone_number: phone,
      id_no: nid,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/screening/logout/${item?.cargo_id}`;

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
        message: "Logout successful!",
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
        title="Logout Screened Cargo"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >

        <Text
          size="xs"
          fw={900}
          variant="outline"
        >
      Do you want to logout {item?.awb} ?
    </Text>

        <section className="flex justify-end space-y-2 p-3 rounded-lg my-3">
          <Button variant="outline" onClick={handleSubmit} loading={loading}>
            Yes, Logout
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
        Logout
      </Button>

    </>
  );
}

export default LogoutCargoModal;
