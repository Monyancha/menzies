import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../src/store/Store";
import { IconEdit } from "@tabler/icons-react";
import { getFooterNote } from "../../src/store/accounts/accounts-slice";

function EditFooterModal({ footer }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [footerNote, setFooterNote] = useState(footer?.footer);

  const submitDetails = async (event) => {
    event.preventDefault();

    const formdata = new FormData();
    formdata.append("footer", footerNote);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/invoices/edit-default-footer`;

    const accessToken = session.user.accessToken;

    setIsSubmitting(true);

    const response = fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
      body: formdata,
    }).then(async (response) => {
      const data = await response.json();
      console.log("Response Data", data);
      console.log(response);

      if (data.statusCode !== 201 && response.status === 200) {
        showNotification({
          title: "Success",
          message: "Default Footer Updated Successful",
          color: "green",
        });
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getFooterNote(params));
        //Reset Values
        setIsSubmitting(false);
      } else {
        showNotification({
          title: "Error",
          message: "Error ): " + data.error,
          color: "red",
        });
        setIsSubmitting(false);
      }
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        title={`Update Footer Notes`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 p-3 rounded-lg">

          <Textarea
            placeholder="Default Footer Note"
            label="Default Footer Note"
            withAsterisk
            value={footerNote}
            onChange={(e) => setFooterNote(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 p-3 rounded-lg ">
          <Button variant="outline" onClick={submitDetails} loading={isSubmitting}>
            Update Default Footer
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEdit size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        className="mt-2 mr-2"
      >
        Default Footer
      </Button>
    </>
  );
}

export default EditFooterModal;
