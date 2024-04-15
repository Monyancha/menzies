import {
  Button,
  useMantineTheme,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconDownload, IconUpload } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { fetchClients } from "@/store/merchants/partners/clients-slice";
import { fetchTransactionList } from "@/store/merchants/transactions/transaction-list-slice";

function UploadTransactionsModal({ comboId }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState(null);

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
    const endpoint = `${API_URL}/transactions/upload-bulk`;
    const accessToken = session.user.accessToken;

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

    if (response.status === 200 && result?.statusCode !== 201) {
      showNotification({
        title: "Success",
        message: result?.message,
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(fetchTransactionList(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result?.message,
        color: "red",
      });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        title={`Bulk Upload Form`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form onSubmit={saveData}>
          <section className="flex flex-col">
            <TextInput
              type="file"
              name="upload_file"
              accept=".xlsx"
              required=""
              placeholder="Upload File"
              onChange={handleFileChange}
            />
          </section>

          <section className="flex justify-end space-x-2 my-3">
            <a href="/templates/bulktransactions.xlsx">
              <Button
                type="button"
                variant="outline"
                size="xs"
                leftIcon={<IconDownload size={14} />}
              >
                Download Template
              </Button>
            </a>
            <Button
              type="submit"
              variant="filled"
              size="xs"
              leftIcon={<IconUpload size={14} />}
            >
              Upload File
            </Button>
          </section>
        </form>
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        leftIcon={<IconUpload size={14} />}
      >
        Upload
      </Button>
    </>
  );
}

export default UploadTransactionsModal;
