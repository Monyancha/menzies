import { Modal, Select, Menu, Button, Text, TextInput } from "@mantine/core";
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


function AddStaffModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nid, setNId] = useState("");
  const [role_id, setRoleId] = useState("");

  function clearForm() {
    setFName("");
    setLName("");
    setNId("");
    setRoleId("");
    setEmail("");
    setPhone("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!fname) {
      showNotification({
        title: "Error",
        message: "First Name is required!",
        color: "red",
      });
      return;
    }

    if (!lname) {
      showNotification({
        title: "Error",
        message: "Last Name is required!",
        color: "red",
      });
      return;
    }

    if (!email) {
      showNotification({
        title: "Error",
        message: "Email is required!",
        color: "red",
      });
      return;
    }

    if (!phone) {
      showNotification({
        title: "Error",
        message: "Phone Number is required!",
        color: "red",
      });
      return;
    }

    if (!nid) {
      showNotification({
        title: "Error",
        message: "National ID is required!",
        color: "red",
      });
      return;
    }

    if (!role_id) {
      showNotification({
        title: "Error",
        message: "Role is required!",
        color: "red",
      });
      return;
    }


    const data = {
      first_name: fname,
      last_name: lname,
      email: email,
      phone_number: phone,
      role_id: role_id,
      id_no: nid,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/store-staff`;

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

    if (response.status === 201) {
      showNotification({
        title: "Success",
        message: "Staff created successfully!",
        color: "green",
      });
      clearForm();
      setLoading(false);
      setOpened(false);
      const params = {};
      params["accessToken"] = accessToken;
      store.dispatch(getStaff(params));
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
        title="Create New Staff"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
        <TextInput
            placeholder="First Name"
            label="First Name"
            withAsterisk
            value={fname}
            onChange={(e) => setFName(e.currentTarget.value)}
          />

        <TextInput
            placeholder="Last Name"
            label="Last Name"
            withAsterisk
            value={lname}
            onChange={(e) => setLName(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Phone"
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />

        <TextInput
            placeholder="National ID"
            label="National ID"
            value={nid}
            onChange={(e) => setNId(e.currentTarget.value)}
          />

        {/* Select */}
        <Select
            label="Role"
            placeholder="Role"
            data={rolesList}
            onChange={setRoleId}
            value={role_id}
            searchable
            clearable
        />


        <section className="flex justify-end space-y-2 p-3 rounded-lg my-3">
          <Button variant="outline" onClick={handleSubmit} loading={loading}>
            Save Staff
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconUser size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        New Staff
      </Button>

    </>
  );
}

export default AddStaffModal;
