import { Modal, Select, Menu, Button, Text, TextInput, UnstyledButton,
 Checkbox, Textarea , Group, FileInput, SimpleGrid } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconEdit,IconPlus, IconUpload
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../src/store/Store";
import Link from "next/link";
import classes from './CheckboxCard.module.css';
import { getAcceptance } from "../../src/store/cargo/cargo-slice";

function AcceptCargoModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  const [kraDone, setKra] = useState(null);
  const [csdDone, setCsd] = useState(null);
  const [remarks, setRemarks] = useState(null);

//setNIdImage
const [kraImage, setKraImage] = useState(null);
const [csdImage, setCsdImage] = useState(null);

  const handleKraChange = (e) => {
    setKra(e.currentTarget.value); // Set the value of KRA based on event value
  };

  const handleCsdChange = (e) => {
    setCsd(e.currentTarget.value); // Set the value of KRA based on event value
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.currentTarget.value); // Set the value of Remarks based on event value
  };


  function clearForm() {
    setKra("");
    setCsd("");
    setRemarks("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!remarks) {
      showNotification({
        title: "Error",
        message: "Remarks is required!",
        color: "red",
      });
      return;
    }

    const cargoId = item.id;
  //   const data = {
  //     kra_done: kraDone,
  //     csd_done: csdDone,
  //     remarks: remarks,
  //     cargo_id: cargoId,
  //   };

  //   const JSONdata = JSON.stringify(data);

  //   const API_URL = process.env.NEXT_PUBLIC_API_URL;
  //   const endpoint = `${API_URL}/store-acceptance`;

  //   const accessToken = session.user.accessToken;

  //   // Form the request for sending data to the server.
  //   const options = {
  //     // The method is POST because we are sending data.
  //     method: "POST",
  //     // Tell the server we're sending JSON.
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //     // Body of the request is the JSON data we created above.
  //     body: JSONdata,
  //   };

  //   setLoading(true);

  //   const response = await fetch(endpoint, options);
  //   const result = await response.json();

  //   console.log(result);

  //   if (response.status === 200) {
  //     showNotification({
  //       title: "Success",
  //       message: "Cargo Acceptance successful!",
  //       color: "green",
  //     });
  //     clearForm();
  //     setLoading(false);
  //     setOpened(false);
  //     const params = {};
  //     params["accessToken"] = accessToken;
  //     store.dispatch(getAcceptance(params));
  //   } else {
  //     showNotification({
  //       title: "Error",
  //       message: "Sorry! " + result.message,
  //       color: "red",
  //     });
  //     setLoading(false);
  //   }
  //   setLoading(false);
  // };

    const formData = new FormData();
    formData.append("cargo_id", cargoId);
    if (kraDone) formData.append("kra_done", kraDone);
    if (csdDone) formData.append("csd_done", csdDone);
    if (remarks) formData.append("remarks", remarks);
    if (kraImage) formData.append("kra_file", kraImage);
    if (csdImage) formData.append("csd_file", csdImage);


    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/store-acceptance`;

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
          message: "Acceptance storage successful!",
          color: "green",
        });
      clearForm();
      setLoading(false);
      setOpened(false);
      const params = {};
      params["accessToken"] = accessToken;
      store.dispatch(getAcceptance(params));
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
        title="Accept Cargo"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
       <UnstyledButton
        onClick={(e) => setKra(e.currentTarget.value)}
        className={classes.button}
        >
        <Checkbox
          value="1"
          onChange={handleKraChange} // Pass the handleChange function to the onChange event of Checkbox
          tabIndex={-1}
          size="md"
          mr="xl"
          styles={{ input: { cursor: 'pointer' } }}
          aria-hidden
        />

        <div>
          <Text fw={500} mb={7} lh={1}>
            KRA Agent Form
          </Text>
          <Text fz="sm" c="dimmed">
            Check box if provided, leave empty otherwise.
          </Text>
        </div>
      </UnstyledButton>

     <UnstyledButton
        onClick={(e) => setCsd(e.currentTarget.value)}
        className={classes.button}
        >
        <Checkbox
          value="2"
          onChange={handleCsdChange} // Pass the handleChange function to the onChange event of Checkbox
          tabIndex={-1}
          size="md"
          mr="xl"
          styles={{ input: { cursor: 'pointer' } }}
          aria-hidden
        />

        <div>
          <Text fw={500} mb={7} lh={1}>
            CSD Document
          </Text>
          <Text fz="sm" c="dimmed">
            Check box if provided, leave empty otherwise.
          </Text>
        </div>
      </UnstyledButton>

      <SimpleGrid cols={2} >
        <FileInput
        label="Upload KRA Agent Form"
        placeholder="KRA Agent Form"
        onChange={setKraImage}
        icon={<IconUpload size={14} />}
        />

        <FileInput
        label="Upload CSD Document"
        placeholder="CSD Document"
        onChange={setCsdImage}
        icon={<IconUpload size={14} />}
        />

      </SimpleGrid>


      <Textarea
        placeholder="Remarks"
        label="Remarks"
        value={remarks}
        onChange={handleRemarksChange}
        withAsterisk
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
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        color="green"
      >
        Accept
      </Button>

    </>
  );
}

export default AcceptCargoModal;
