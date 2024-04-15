import { Modal, Menu, Button, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconChevronDown,
  IconUsers,
  IconUser,
  IconPlus,
  IconGift,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientFormData,
  fetchClients,
  submitClient,
} from "../../src/store/partners/clients-slice";
import store from "../../src/store/Store";
import Link from "next/link";
import EnterCustomerModal from "./enter-customer-modal";


function EnterClientModal({ mt }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function clearForm() {
    setName("");
    setEmail("");
    setPhone("");
  }

  const isSubmitting = useSelector(
    (state) => state.clients.submissionStatus == "loading"
  );

  const dispatch = useDispatch();

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["email"] = email;
    params["phone"] = phone;

    try {
      const newClient = await dispatch(submitClient(params)).unwrap();
      console.log("Monyancha Console", newClient); // log the response object
      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
      const params1 = {};
      params1["accessToken"] = session.user.accessToken;
      store.dispatch(fetchClients(params1));
      clearForm();
      setOpened(false);
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Enter Customer Details"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Customer Information
          </span>
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
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
            type="telephone"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button variant="outline" onClick={submitDetails} loading={isSubmitting}>
            Save Customer
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconUser size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        mt={mt}
      >
        New Client
      </Button>

      {/* <Menu shadow="md" width={200} position="bottom-end" variant="outline">
        <Menu.Target>
          <Button
          variant="outline"
            leftIcon={<IconUser size={14} />}
            rightIcon={<IconChevronDown size={14} />}
            mt={mt}
          >
            New Client
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Select an option</Menu.Label>

          <>
            <Menu.Item
              icon={<IconUser size={15} color="lime" />}
              onClick={() => setOpened(true)}
            >
              <Text color="lime">Individual</Text>
            </Menu.Item>
            <EnterCustomerModal />
          </>
        </Menu.Dropdown>
      </Menu> */}
    </>
  );
}

export default EnterClientModal;
