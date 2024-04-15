import { Modal, Select, Menu, Button, Text, TextInput, Textarea, SimpleGrid } from "@mantine/core";
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
import { useRouter } from "next/router";

function CheckinMenziesModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
 
  const  router = useRouter();

  const [loading, setLoading] = useState(false);
  const [carNo, setCar] = useState("");


  function clearForm() {
    setCar("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    const id = item.id;
    const passNo = item.visits[0].pass_number;

    const formData = new FormData();
    formData.append("car_number", carNo);
    formData.append("pass_number", passNo);
    formData.append("visitor_id", id);
    formData.append("company", 1);
    formData.append("visit_type", 2);


    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/checkin-staff`;

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
          message: "Checkin successful!",
          color: "green",
        });
        // clearForm();
        setLoading(false);
        setOpened(false);
        router.push('/visitors/menziesin')
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
        title={`Checkin ${item.first_name} ${item.last_name}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
      <TextInput
        placeholder="Car Number Plate (optional)"
        label="Car Number Plate"
        value={carNo}
        onChange={(e) => setCar(e.currentTarget.value)}
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
        Checkin
      </Button>

    </>
  );
}

export default CheckinMenziesModal;
