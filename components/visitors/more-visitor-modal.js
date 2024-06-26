import { Modal, Select, Menu, Button, Text, TextInput, Image } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconEdit, IconCheckupList
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../src/store/Store";
import Link from "next/link";
import {
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";

function MoreVisitorModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [fname, setFName] = useState(item?.first_name ?? "");
  const [lname, setLName] = useState(item?.last_name ?? "");
  const [email, setEmail] = useState(item?.email ?? "");
  const [phone, setPhone] = useState(item?.phone_number ?? "");
  const [nid, setNId] = useState(item?.id_no ?? "");
  const [idImage, setIdImage] = useState(item?.id_image ?? "");
  const [userImage, setUserImage] = useState(item?.user_image ?? "");
  const [visitsNo, setVisitsNo] = useState(item?.visits.length ?? "");

  function clearForm() {
    setFName("");
    setLName("");
    setNId("");
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


    const data = {
      first_name: fname,
      last_name: lname,
      email: email,
      phone_number: phone,
      id_no: nid,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/edit-visitor/${item?.id}`;

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
        message: "Visitor successfully!",
        color: "green",
      });
      clearForm();
      setLoading(false);
      setOpened(false);
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
        title="Visitor Details"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
          <Typography color="textSecondary" mb={3}>
            FULL NAME: <Typography component="span" fontWeight={700}>{fname} {lname}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            {email} 
          </Typography>

          <Typography color="textSecondary" mb={3}>
            PHONE NUMBER: <Typography component="span" fontWeight={700}>{phone}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            NATIONAL ID NUMBER: <Typography component="span" fontWeight={700}>{nid}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            NO. OF VISITS: <Typography component="span" fontWeight={700}>{visitsNo}</Typography>
          </Typography>

         <Typography color="textSecondary" mb={1} align="center">
            <Typography component="span" fontWeight={700}>NATIONAL ID IMAGE</Typography>
          </Typography>
          <Image
            src={`${API_URL}/id_documents/${idImage}`}
            alt="National ID image"
            title="NATIONAL ID IMAGE"
          />

          <Typography color="textSecondary" mb={1} align="center">
            <Typography component="span" fontWeight={700}>USER IMAGE</Typography>
          </Typography>
          <Image
            src={`${API_URL}/user_images/${userImage}`}
            alt="User image"
            title="USER IMAGE"
          />


        {/*<section className="flex justify-end space-y-2 p-3 rounded-lg my-3">
          <Button variant="outline" onClick={handleSubmit} loading={loading}>
            Edit Visitor
          </Button>
        </section>*/}
      </Modal>

      <Button
        leftIcon={<IconCheckupList size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        color="green"
      >
        More
      </Button>

    </>
  );
}

export default MoreVisitorModal;
