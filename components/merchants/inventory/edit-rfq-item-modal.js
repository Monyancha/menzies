import {
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
  Select,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconEdit } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import { getComboSubItems } from "../../../store/merchants/inventory/inventory-slice";
import { getCombosSubItems } from "../../../store/merchants/inventory/products-slice";
import { getRFQSubItems } from "../../../store/merchants/inventory/purchases-slice";
import { getRFQItems } from "../../../store/merchants/inventory/purchases-slice";

function EditRfqItem({ item, rfqId }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rfqSubItemId, setRfqSubItemId] = useState("");
  const [searchValue, onSearchChange] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [tax, setTax] = useState("");
  const [note, setNote] = useState("");

  function clearForm() {
    setRfqSubItemId("");
    onSearchChange("");
    setQuantity("");
    setPrice("");
    setTax("");
    setNote("");
  }

  const itemId = item?.id;

  const rfqSubItemsStatus = useSelector(
    (state) => state.purchases.getRFQSubItemsStatus
  );
  const rfqSubItems = useSelector((state) => state.purchases.getRFQSubItems);
  const isRfqSUbItemsLoading = rfqSubItemsStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["rfqId"] = rfqId;

    store.dispatch(getRFQSubItems(params));
  }, [session, status, rfqId]);

  useEffect(() => {
    if (!item) {
      return;
    }

    setRfqSubItemId(item?.sellable_id ?? "");
    setQuantity(item?.quantity ?? "");
    setPrice(item?.unit_price ?? "");
    setTax(item?.tax_pc ?? "");
    setNote(item?.note ?? "");
  }, [item]);

  //Get RFQ subItems Data
  const rfqSubItemsData =
    rfqSubItems?.products?.data?.map((item) => ({
      value: item.id,
      label: item?.sellable?.name ?? null,
    })) ?? [];

  const handleEditRfq = async (event) => {
    event.preventDefault();

    if (!rfqSubItemId) {
      showNotification({
        title: "Error",
        message: "Product is required! ",
        color: "red",
      });
      return;
    }

    if (!quantity) {
      showNotification({
        title: "Error",
        message: "Quantity is required! ",
        color: "red",
      });
      return;
    }

    if (!price) {
      showNotification({
        title: "Error",
        message: "Unit Price is required! ",
        color: "red",
      });
      return;
    }

    const data = {
      sellable_id: rfqSubItemId,
      quantity: quantity,
      unit_price: price,
      tax_pc: tax,
      note: note,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/inventory/purchases/rfq/${rfqId}/update/${itemId}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    setLoading(true);

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Item Updated Successfully",
        color: "green",
      });
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["rfqId"] = rfqId;
      store.dispatch(getRFQItems(params));
      clearForm();
      setLoading(false);
      setOpened(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        title="Update Item"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <Select
            placeholder="Item"
            label="Item"
            value={rfqSubItemId}
            onChange={setRfqSubItemId}
            data={rfqSubItemsData}
            searchable
            clearable
            required
            //
            onSearchChange={onSearchChange}
            searchValue={searchValue}
            // nothingFound="No options"
          />
          <TextInput
            placeholder="Quantity"
            label="Quantity"
            value={quantity}
            required
            onChange={(e) => setQuantity(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Unit Price"
            label="Unit Price"
            value={price}
            required
            onChange={(e) => setPrice(e.currentTarget.value)}
          />
          <TextInput
            placeholder="Tax PC(Inclusive)"
            label="Tax PC(Inclusive)"
            value={tax}
            onChange={(e) => setTax(e.currentTarget.value)}
          />
          <Textarea
            placeholder="Note"
            label="Note"
            value={note}
            minRows={3}
            autosize
            onChange={(e) => setNote(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleEditRfq} loading={loading}>
            Update Item
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEdit size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
      >
        Edit
      </Button>
    </>
  );
}

export default EditRfqItem;
