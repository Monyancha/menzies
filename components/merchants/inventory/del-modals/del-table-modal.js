import {
  ActionIcon,
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconTrash } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../src/store/Store";

import { fetchClients } from "../../../../src/store/partners/clients-slice";

function DelTable({
  item,
  source,
}) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const itemId = item?.id;

  const deleteItem = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
   


    //Delete Clients
    if (source === "clients") {
      const endpoint = `${API_URL}/partners/clients/delete/${itemId}`;
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
      };
      const response = await fetch(endpoint, options);
      // const result = await response.json()
      console.log(response);
      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Client has been deleted Successfully",
          color: "green",
        });
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(fetchClients(params));
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occurred: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

  };

  return (
    <>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        title={`Confirm Delete #${itemId}: ${item?.name ?? "Item"}`}
        onClose={() => setOpened(false)}
        padding="xs"
      >
        {/* Modal content */}

        <section className="flex flex-col">
          <h4>Are you sure you want to delete this item?</h4>
        </section>

        <section className=" bg-light  py-3 text-sm whitespace-nowrap text-right space-x-2">
          <Button variant="outline" size="xs" onClick={() => setOpened(false)}>
            Go Back
          </Button>
          <Button variant="outline" color="red" size="xs" onClick={deleteItem}>
            Delete
          </Button>
        </section>
      </Modal>

      <ActionIcon
        onClick={() => setOpened(true)}
        variant="outline"
        color="red"
        size="md"
      >
        <IconTrash size={16} />
      </ActionIcon>
    </>
  );
}

export default DelTable;
