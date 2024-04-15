import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
  FileInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../../../src/store/Store";
import { IconPlus, IconCloudUpload } from "@tabler/icons-react";
import { getAllTaxesList } from "../../../../src/store/merchants/settings/access-control-slice";

function UploadTaxModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  function clearForm() {
    setFile(null);
  }

  async function handleSubmit() {
    setLoading(true);

    const accessToken = session.user.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/tax/upload-tax`;

    const data = new FormData();
    data.append("upload_file", file);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
        body: data,
      });

      const result = await response.json();

      console.log(result);

      if (!response.ok) {
        throw new Error("Failed to create.");
      }

      showNotification({
        title: "Success!",
        message: "Tax Bulk Upload successful.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getAllTaxesList(params));

      // clearForm();
      setOpened(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Bulk Upload"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <FileInput
            accept=".xlsx"
            label="Upload Excel File"
            placeholder="Select an Excel file"
            onChange={handleFileChange}
            icon={<IconCloudUpload size={14} />}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button
            onClick={handleSubmit}
            loading={loading}
            leftIcon={<IconCloudUpload size={16} />}
          >
            Bulk Upload
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconCloudUpload size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
      >
        Upload
      </Button>
    </>
  );
}

export default UploadTaxModal;
