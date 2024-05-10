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

function MoreCargoModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const driverName = item?.first_name + " " + item?.last_name;

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(item?.updated_at ?? "");
  const [shipper, setShipper] = useState(item?.shipper_name ?? "N/A");
  const [driver, setDriver] = useState(driverName ?? "N/A");
  const [origin, setOrigin] = useState(item?.origin ?? "N/A");
  const [destination, setDestination] = useState(item?.destination ?? "N/A");
  const [idImage, setIdImage] = useState(item?.id_image ?? "");
  const [userImage, setUserImage] = useState(item?.user_image ?? "");
  const [awb, setAwb] = useState(item?.number ?? "");

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
        title="Cargo Details"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
          <Typography color="textSecondary" mb={3}>
            DATE: <Typography component="span" fontWeight={700}>{date}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            SHIPPER NAME: <Typography component="span" fontWeight={700}>{shipper}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            DRIVER NAME: <Typography component="span" fontWeight={700}>{driver}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            AWB NUMBER: <Typography component="span" fontWeight={700}>{awb}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            ORIGIN: <Typography component="span" fontWeight={700}>{origin}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            DESTINATION: <Typography component="span" fontWeight={700}>{destination}</Typography>
          </Typography>          



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

export default MoreCargoModal;
