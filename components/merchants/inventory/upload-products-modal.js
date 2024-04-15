import {
  Button,
  useMantineTheme,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import LinkButton from "../../ui/actions/link-button";

function UploadProductsModal({ comboId }) {
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

    const data = new FormData();
    data.append("upload_file", file);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let endpoint = `${API_URL}/products/bulk-upload?`;
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
        message: "Bulk Upload Successfully",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["branch_id"] = branch_id;
      showNotification({
        title: "Uploading...",
        message: "We're uploading your products...please wait...",
        color: "blue",
      });
      setTimeout(() => {
        store.dispatch(getProducts(params));
      }, 4000);
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
                placeholder="Selling Price"
                onChange={handleFileChange}
              />
            </div>
          </section>

          <section className="flex justify-end space-y-2 bg-light rounded-lg my-3">
            <section className=" bg-light  py-3 text-sm whitespace-nowrap text-right">
              <a
                href="/templates/product-inventory-template.xlsx"
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

      <a
        onClick={() => setOpened(true)}
        className="btn btn-sm btn-primary btn-outline ml-2"
      >
        <i className="fa-solid fa-upload" />
      </a>
    </>
  );
}

export default UploadProductsModal;
