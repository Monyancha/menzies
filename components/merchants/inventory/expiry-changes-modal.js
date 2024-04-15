import {
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
  Select,
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
import { getRFQSubItems } from "../../../store/merchants/inventory/purchases-slice";
import {
  getRFQItems,
  setExpiries,
} from "../../../store/merchants/inventory/purchases-slice";
//  import {DateTimePicker }from '@mantine/dates'
import { DatePicker } from "@mantine/dates";

function ExpiryChangesModal({ item, rfqId, receivalId }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  let life_time = parseInt(item?.sellable?.metadata?.life_time);
  let use_time = parseInt(item?.sellable?.metadata?.use_time);
  let removal_time = parseInt(item?.sellable?.metadata?.removal_time);
  let added_on = new Date();
  //alert("Life Time is " + item);
  // console.log("The items are" + item.sellable.metadata);

  const [expiry_date, setExpiry] = useState("");
  const [best_before, setBestBefore] = useState("");
  const [removal_date, setRemoval] = useState("");
  const [removal_strategy, setRemovalStrategy] = useState(
    item?.sellable?.metadata?.removal_strategy
  );

  const itemId = item?.id;

  const rfqSubItemsStatus = useSelector(
    (state) => state.purchases.getRFQSubItemsStatus
  );

  const expiries = useSelector((state) => state.purchases.expiries);
  const rfqSubItems = useSelector((state) => state.purchases.getRFQSubItems);
  const isRfqSUbItemsLoading = rfqSubItemsStatus === "loading";

  const rfqItemsStatus = useSelector(
    (state) => state.purchases.getRFQItemsStatus
  );
  const rfqItems = useSelector((state) => state.purchases.getRFQItems);
  const isRfqItemsLoading = rfqItemsStatus === "loading";

  // console.log("onyambu", item);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["rfqId"] = rfqId;

    store.dispatch(getRFQSubItems(params));
  }, [session, status, rfqId]);

  // console.log("RFQ Sub Items", rfqSubItems);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["rfqId"] = rfqId;

    store.dispatch(getRFQItems(params));
  }, [session, status, rfqId]);

  const handleEditRfq = async (event) => {
    event.preventDefault();
    const data = {
      expiry_date: expiry_date,
      best_before: best_before,
      removal_date: removal_date,
      removal_strategy: removal_strategy,
      sellable_id: item?.sellable?.id,
    };

    store.dispatch(setExpiries({ data: data }));

    console.log("The expiries are " + expiries);

    if (data) {
      showNotification({
        title: "Success",
        message: "Expiry Details Successfully Set",
        color: "green",
      });
      setOpened(false);
    }
  };
  let strategiesData = [
    { label: "First In First Out", value: "fifo" },
    { label: "Last In First Out", value: "lifo" },
    { label: "First Expire First Out", value: "fefo" },
  ];

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
        title={`Set Expiry Dates`}
        onClose={() => setOpened(false)}
        size="55%"
        overflow="inside"
      >
        {/* Modal content */}

        <form onSubmit={handleEditRfq}>
          <section className="flex flex-col px-2 py-2 ml-2">
            <div className="py-2">
              <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
                Item Name: {item?.sellable?.sellable?.name} <br></br>
                {/* Price: {item?.sellable?.sellable?.cost} */}
              </section>

              <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Best Before Date*</span>
                </div>

                <DatePicker
                  onChange={(e) => setBestBefore(e)}
                 
                />
              </div>
              <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Expiry Date*</span>
                </div>
                <DatePicker
                  onChange={(e) => setExpiry(e)}
                
                />
              </div>
              <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Removal Date*</span>
                </div>

                <DatePicker
                  onChange={(e) => setRemoval(e)}
                />
              </div>

              <div className="my-2">
                <Select
                  placeholder="Removal Strategy"
                  label="Removal Strategy"
                  data={strategiesData}
                  onChange={setRemovalStrategy}
                  defaultValue={removal_strategy}
                  searchable
                  clearable
                  size="md"
                  className="mb-2"
                />
              </div>
            </div>
          </section>

          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button type="submit">SET</Button>
          </section>
        </form>
      </Modal>

      <a
        className="btn btn-sm btn-outline-info"
        onClick={() => setOpened(true)}
        size="lg"
      >
        Expiry
      </a>
    </>
  );
}

export default ExpiryChangesModal;
