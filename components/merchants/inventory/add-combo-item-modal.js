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
import { getComboSubItems } from "../../../store/merchants/inventory/inventory-slice";
import { getCombosSubItems } from "../../../store/merchants/inventory/products-slice";

function AddComboItem({ comboId }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [sellable_id, setSellable] = useState("");
  const [selling_price, setSellingPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [subItemId, setSubItemId] = useState("");

  //Get Combo
  const subItems = useSelector((state) => state?.inventory?.getComboSubItems);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["comboId"] = comboId;

    store.dispatch(getComboSubItems(params));
  }, [session, status, comboId]);

  // console.log(subItems);

  const submitData = async (event) => {
    event.preventDefault();

    const data = {
      sellable_id: sellable_id,
      unit_selling_price: selling_price,
      amount: amount,
      combo_sellable_id: comboId,
      merchant_id: session.user.sub,
    };

    console.log(sellable_id);

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/combo/${comboId}/sub-item/store`;

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
        message: "Combo Item added Successfully",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["comboId"] = comboId;
      store.dispatch(getCombosSubItems(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  const totalSellingPrice = selling_price * amount;

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
        title={`Add Combo Item`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <section className="flex flex-col">
          <span className="text-dark text-sm font-bold">
            Combo Item Details
          </span>
          <div className="">
            <div className="text-dark text-sm mb-1">
              <span>Item</span>
            </div>
            <input
              list="sellables"
              name="sellable_id"
              className="input-primary h-12 text-sm"
              required=""
              placeholder="Search then click desired result"
              onChange={(e) => setSellable(e.currentTarget.value)}
            />
            <datalist id="sellables">
              {subItems &&
                subItems.map((item) => (
                  <option value={item?.id} key={item?.id}>
                    {item?.sellable?.name}
                  </option>
                ))}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Selling price per unit*</span>
              </div>
              <input
                type="number"
                name="unit_selling_price"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Selling Price"
                onChange={(e) => setSellingPrice(e.currentTarget.value)}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Amount/Count in combo</span>
              </div>
              <input
                type="number"
                name="amount"
                className="input-primary h-12 text-sm"
                step=".01"
                placeholder="Amount"
                onChange={(e) => setAmount(e.currentTarget.value)}
              />
            </div>
          </div>
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          Total Selling Price: Ksh. {totalSellingPrice}
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitData}>Save</Button>
        </section>
      </Modal>

      <a
        className="btn btn-primary btn-outline btn-sm-alt gap-2 w-fit"
        onClick={() => setOpened(true)}
      >
        <i className="fa-solid fa-plus" />
        Add
      </a>
    </>
  );
}

export default AddComboItem;
