import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../src/store/Store";
import { useRouter } from "next/router";
import { IconPlus } from "@tabler/icons-react";
import {
  getAllRequirements,
  getFooterNote,
} from "../../src/store/accounts/accounts-slice";

function AddProductModal() {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [type, setType] = useState("product");
  const [name, setName] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [openingQuantity, setOpeningQuantity] = useState("0");
  const [duration, setDuration] = useState("");

  const submitDetails = async (event) => {
    event.preventDefault();

    if (!type) {
      showNotification({
        title: "Error",
        message: "Type is required!",
        color: "red",
      });
      return;
    }

    if (!name) {
      showNotification({
        title: "Error",
        message: "Name is required!",
        color: "red",
      });
      return;
    }

    if (type === "product") {
      if (!buyingPrice) {
        showNotification({
          title: "Error",
          message: "Buying Price is required!",
          color: "red",
        });
        return;
      }
      if (!sellingPrice) {
        showNotification({
          title: "Error",
          message: "Selling Price is required!",
          color: "red",
        });
        return;
      }
      if (!openingQuantity) {
        showNotification({
          title: "Error",
          message: "Opening Quantity is required!",
          color: "red",
        });
        return;
      }
    }

    if (type === "service") {
      if (!duration) {
        showNotification({
          title: "Error",
          message: "Duration is required!",
          color: "red",
        });
        return;
      }
    }

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("cost", sellingPrice);
    if (type === "product") {
      formdata.append("buying_price", buyingPrice);
      formdata.append("opening_quantity", openingQuantity);
      formdata.append("product_type", "Single");
    }
    if (type === "service") {
      formdata.append("duration", duration);
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint =
      type === "product"
        ? `${API_URL}/products`
        : `${API_URL}/inventory/products/store`;

    console.log("Sending to URL...", endpoint);

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

      if (data.statusCode !== 201 && response.status === 200 && !data.error) {
        showNotification({
          title: "Success",
          message: "Item Created Successfully",
          color: "green",
        });
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getAllRequirements(params));
        //Reset Values
        setName("");
        setBuyingPrice("");
        setSellingPrice("");
        setOpeningQuantity("");
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
        title="Create New Product/Service"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <Select
            placeholder="Choose Type"
            label="Choose Type"
            value={type}
            onChange={setType}
            data={[
              { value: "product", label: "Product" },
              { value: "service", label: "Service" },
            ]}
            clearable
          />

          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          {type === "product" && (
            <TextInput
              placeholder="Buying Price"
              label="Buying Price"
              withAsterisk
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.currentTarget.value)}
            />
          )}
          {/* {type === "product" || type === "service" && ( */}
          <TextInput
            placeholder="Selling Price"
            label="Selling Price"
            withAsterisk
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.currentTarget.value)}
          />
          {/* )} */}
          {type === "product" && (
            <TextInput
              placeholder="Opening Quantity"
              label="Opening Quantity"
              withAsterisk
              value={openingQuantity}
              onChange={(e) => setOpeningQuantity(e.currentTarget.value)}
            />
          )}

          {type === "service" && (
            <TextInput
              placeholder="Service Duration"
              label="Service Duration"
              withAsterisk
              value={duration}
              onChange={(e) => setDuration(e.currentTarget.value)}
            />
          )}
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button variant="outline" onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        className="mr-2"
      >
        Add Product/Service
      </Button>
    </>
  );
}

export default AddProductModal;
