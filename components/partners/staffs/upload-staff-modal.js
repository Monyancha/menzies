import {
  Button,
  useMantineTheme,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil, IconUpload } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import LinkButton from "../../../ui/actions/link-button";
import { fetchClients } from "../../../../store/merchants/partners/clients-slice";
import { fetchStaff } from "@/store/merchants/partners/staff-slice";
import { fetchAllStaffIncome } from "@/store/merchants/partners/staff-slice";

function UploadStaffModal() {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const branch_id = useSelector((state) => state.branches.branch_id);


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
    data.append("file", file);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/staff/bulk-upload?`;
    const accessToken = session.user.accessToken;

    const params = {};
    params["branch_id"] = branch_id;

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
        message: "Staff Bulk Upload Successfull",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(fetchAllStaffIncome(params));
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
        title={`Bulk Upload Form`}
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
                onChange={handleFileChange}
              />
            </div>
          </section>

          <section className="flex justify-end space-y-2 bg-light rounded-lg my-3">
            <section className=" bg-light  py-3 text-sm whitespace-nowrap text-right">
              <a
                href="/templates/bulkstaff.xlsx"
                className="btn btn-sm btn-dark btn-outline ml-2"
              >
                <i className="fa-solid fa-download mr-2" />
                Download Template
              </a>
              <button type="submit" className="btn btn-sm btn-primary ml-2">
                <i className="fa-solid fa-upload mr-2" />
                Upload File
              </button>
            </section>
          </section>
        </form>
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        leftIcon={<IconUpload size={14} />}
        size="xs"
      >
        Upload
      </Button>
    </>
  );
}

export default UploadStaffModal;
