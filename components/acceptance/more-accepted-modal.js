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

function MoreAcceptedModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [shipper, setShipper] = useState(item?.shipper_name ?? "");
  const [typeId, setTypeId] = useState(item?.type_id ?? "");
  const [fname, setFName] = useState(item?.created_by?.first_name ?? "");
  const [lname, setLName] = useState(item?.created_by?.last_name ?? "");
  const [acceptedOn, setDate] = useState(item?.created_at.toLocaleString() ?? "");
  const [csdFile, setCsd] = useState(item?.acceptances?.[0]?.csd_file ?? "");
  const [kraFile, setKra] = useState(item?.acceptances?.[0]?.kra_file ?? "");


  function clearForm() {
    setFName("");
    setLName("");
    setNId("");
    setEmail("");
    setPhone("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/cargo-acceptance/${item?.id}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
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

    console.log("chuom",result);

    // if (response.status === 201) {
    //   showNotification({
    //     title: "Success",
    //     message: "Visitor successfully!",
    //     color: "green",
    //   });
    //   clearForm();
    //   setLoading(false);
    //   setOpened(false);
    // } else {
    //   showNotification({
    //     title: "Error",
    //     message: "Sorry! " + result.message,
    //     color: "red",
    //   });
    //   setLoading(false);
    // }
    setLoading(false);
  };


  return (
    <>
      <Modal
        opened={opened}
        title="Acceptance Details"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
          <Typography color="textSecondary" mb={3}>
            CARGO TYPE:
             <Typography component="span" fontWeight={700}> 
              {typeId === 0 && "Known"}
              {typeId === 1 && "Unknown"}
              {typeId === 2 && "General"}
              </Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            SHIPPER NAME: <Typography component="span" fontWeight={700}>{shipper}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            ACCEPTED BY: <Typography component="span" fontWeight={700}>{fname} {lname}</Typography>
          </Typography>

          <Typography color="textSecondary" mb={3}>
            ACCEPTED ON: <Typography component="span" fontWeight={700}>{acceptedOn}</Typography>
          </Typography>

         <Typography color="textSecondary" mb={1} align="center">
            <Typography component="span" fontWeight={700}>CSD DOCUMENT</Typography>
          </Typography>
          <Image
            src={`http://localhost:8000/csd_files/${csdFile}`}
            alt="CSD Document"
            title="CSD DOCUMENT"
          />

          <Typography color="textSecondary" mb={1} align="center">
            <Typography component="span" fontWeight={700}>KRA AGENT FORM</Typography>
          </Typography>
          <iframe
            src={`http://localhost:8000/kra_files/${kraFile}`}
            title="KRA File"
            style={{ width: '100%', height: '500px' }}
            type="application/pdf" // Specify the content type
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

export default MoreAcceptedModal;
