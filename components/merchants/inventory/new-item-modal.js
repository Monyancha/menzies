import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import store from "../../../store/store";
import { IconPlus, IconCash } from "@tabler/icons";
import { getLoyaltyTemplates } from "../../../store/merchants/settings/access-control-slice";
import { fetchDiscounts } from "../../../store/merchants/marketing/marketing-slice";
import { getRFQSubItems } from "@/store/merchants/inventory/purchases-slice";
import { getRFQItems } from "@/store/merchants/inventory/purchases-slice";
import { useSelector } from "react-redux";

function NewItemModal({ rfqId }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rfqSubItemId, setRfqSubItemId] = useState("");
  const [searchValue, onSearchChange] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [tax, setTax] = useState("");
  const [note, setNote] = useState("");
  const [expires, setExpires] = useState(0);
  const [life_time, setLifeTime] = useState();
  const [use_time, setUseTime] = useState();
  const [removal_time, setRemovalTime] = useState();
  const [alert_time, setAlertTime] = useState();
  const [removal_strategy, setRemovalStrategy] = useState();

  function clearForm() {
    setRfqSubItemId("");
    onSearchChange("");
    setQuantity("");
    setPrice("");
    setTax("");
    setNote("");
  }

  const branch_id = useSelector((state) => state.branches.branch_id);

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
    params["filter"] = searchValue;
    params["branch_id"] = branch_id;

    store.dispatch(getRFQSubItems(params));
  }, [session, status, rfqId, searchValue, branch_id]);

  //Get RFQ subItems Data
  const rfqSubItemsData =
    rfqSubItems?.products?.data?.map((item) => ({
      value: item.id,
      label: item?.sellable?.name ?? "-",
    })) ?? [];
  let strategiesData = [
    { label: "First In First Out", value: "fifo" },
    { label: "Last In First Out", value: "lifo" },
    { label: "First Expire First Out", value: "fefo" },
  ];

  function handleIsExpires(event) {
    setExpires(event.target.checked ? 1 : 0);
  }

  const handleAddItem = async (event) => {
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
      life_time: life_time,
      use_time: use_time,
      removal_time: removal_time,
      removal_strategy: removal_strategy,
      branch_id: branch_id,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/inventory/purchases/rfq/${rfqId}/store`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
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
        message: "Item Added Successfully",
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
        message: "Sorry! " + result,
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
        title="New Item"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <Select
            placeholder="Item"
            label="Item"
            value={rfqSubItemId}
            onChange={(v) => {
              setRfqSubItemId(v);
              const sellable =
                rfqSubItems?.products?.data?.find((item) => item.id == v) ??
                null;
              setPrice(sellable?.sellable?.buying_price ?? "");
            }}
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
          <Button onClick={handleAddItem} loading={loading}>
            Add Item
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
      >
        New Item
      </Button>
    </>
  );
}

export default NewItemModal;
