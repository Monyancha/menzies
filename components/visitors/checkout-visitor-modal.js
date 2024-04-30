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

function CheckoutVisitorModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fname, setFName] = useState(item?.visitor?.first_name ?? "");
  const [lname, setLName] = useState(item?.visitor?.last_name ?? "");
  const [email, setEmail] = useState(item?.visitor?.email ?? "");
  const [phone, setPhone] = useState(item?.visitor?.phone_number ?? "");
  const [nid, setNId] = useState(item?.visitor?.id_no ?? "");

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
    const endpoint = `${API_URL}/checkout/${item?.id}`;

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
        message: "Checkout successful!",
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
        title="Checkout Visitor"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >

        <Text
          size="xs"
          fz="md"
          variant="outline"
        >
          Do you want to checkout {item?.visitor?.first_name} {item?.visitor?.last_name} ?
        </Text>

        <section className="flex justify-between p-3 rounded-lg my-3"> {/* Change justify-end to justify-between */}
          <Button variant="outline" color="green" onClick={() => setOpened(false)}>{/* Add Cancel button */}
            Cancel
          </Button>
          <Button variant="outline" color="purple" onClick={handleSubmit} loading={loading}>
            Yes, Checkout
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
        Checkout
      </Button>

    </>
  );
}

export default CheckoutVisitorModal;
