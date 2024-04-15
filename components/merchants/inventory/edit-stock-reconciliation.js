import {
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";

function EditStockReconciliation({ stock }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [actual_quantity, setQuantity] = useState("");
  const [narration, setNarration] = useState("");
  const [variance, setVariance] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);

  const submitStockReconciliation = async (event) => {
    event.preventDefault();

    const data = {
      actual_quantity: actual_quantity,
      narration: narration,
      sellable_id: stock?.sellable?.id,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/product/${stock?.id}/stock-reconciliation`;

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

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log(result);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Stock Reconciliation was Successfully",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["branch_id"] = branch_id;
      store.dispatch(getProducts(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  useEffect(() => {
    const totalStock = stock?.total_remaining;
    const diffStock = actual_quantity - totalStock;
    setVariance(diffStock);
  }, [actual_quantity, stock?.total_remaining]);

  const canReconcile = useSelector(hasBeenGranted("can_reconcile_stock"));
  if (!canReconcile) {
    return null;
  }

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
        title={`#${stock?.id} ${stock?.name} `}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Stock Reconciliation Details
          </span>

          <TextInput
            type="text"
            name="name"
            disabled
            label="Product"
            placeholder="Product"
            withAsterisk
            defaultValue={stock?.name}
          />

          <TextInput
            type="number"
            name="system_quantity"
            disabled
            label="System Quantity"
            placeholder="System Quantity"
            withAsterisk
            defaultValue={stock?.total_remaining ? stock?.total_remaining : 0}
          />

          <TextInput
            type="number"
            name="actual_quantity"
            label="Actual Stock"
            placeholder="Actual Stock Quantity"
            onChange={(e) => setQuantity(e.currentTarget.value)}
          />

          <TextInput
            type="number"
            name="variance"
            label="Variance"
            placeholder="Variance"
            disabled
            value={variance}
          />

          <Textarea
            rows={4}
            name="narration"
            label="Narration"
            placeholder="Narration"
            onChange={(e) => setNarration(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitStockReconciliation}>Save</Button>
        </section>
      </Modal>

      <div
        className="tooltip tooltip-top items-center"
        data-tip="Stock Reconciliation"
      >
        <a
          onClick={() => setOpened(true)}
          className="btn btn-sm btn-primary btn-outline gap-2"
        >
          <i className="fa-solid fa-sliders-h" />
        </a>
      </div>
    </>
  );
}

export default EditStockReconciliation;
