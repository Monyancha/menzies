import {
  Button,
  useMantineTheme,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil, IconUpload } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../src/store/Store";
import { fetchClients } from "../../../src/store/partners/clients-slice";
import Link from "next/link";

function UploadClientsModal({ comboId }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState(null);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const saveData = async (event) => {
    event.preventDefault();

    if (!file) {
      showNotification({
        title: "Error",
        message: "File is required!",
        color: "red",
      });
      return;
    }

    const data = new FormData();
    data.append("upload_file", file);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let endpoint = `${API_URL}/partners/clients/upload-clients?`;
    const accessToken = session.user.accessToken;
    const params = {};
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    endpoint += new URLSearchParams(params);

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: data,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log(result);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Clients Bulk Upload Successfully",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["branch_id"] = branch_id;
      store.dispatch(fetchClients(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
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
        title={`Bulk Client Upload Form`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form onSubmit={saveData}>
          <section className="flex flex-col">
            <div className="">
              <input
                type="file"
                name="upload_file"
                accept=".xlsx"
                className="input-primary text-sm"
                required=""
                placeholder="Selling Price"
                onChange={handleFileChange}
              />
            </div>
          </section>

          <section className="flex justify-end space-y-2 bg-light rounded-lg my-3">
            <section className=" bg-light  py-3 text-sm whitespace-nowrap text-right">
              <Link href="/templates/clients.xlsx">
              <Button type="submit" variant="outline" color="cyan" mr={2}>Download Template</Button>
              </Link>
              <Button type="submit" variant="outline">Upload File</Button>
            </section>
          </section>
        </form>
      </Modal>

      <Button
        variant="outline"
        className="ml-2 mr-2 mb-2"
        onClick={() => setOpened(true)}
        leftIcon={<IconUpload size={14} />}
      >
        Upload
      </Button>
    </>
  );
}

export default UploadClientsModal;
