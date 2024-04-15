import {
  Button,
  Modal,
  Textarea,
  TextInput,
  Select,
  useMantineTheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import { getComboSubItems } from "../../../store/merchants/inventory/inventory-slice";
import { getCombosSubItems } from "../../../store/merchants/inventory/products-slice";
import {
  getRFQSubItems,
  updateSellablePrice,
} from "../../../store/merchants/inventory/purchases-slice";
import { getRFQItems } from "../../../store/merchants/inventory/purchases-slice";
import { parseValidFloat } from "@/lib/shared/data-formatters";
import { fetchMerchantFlags } from "@/store/merchants/settings/security-slice";

function PriceChangesModal({ item, rfqId, receivalId }) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [sellable_id, setSellable] = useState("");
  const [amount, setAmount] = useState("");
  const [subItemId, setSubItemId] = useState("");

  const itemId = item?.id;

  const rfqSubItemsStatus = useSelector(
    (state) => state.purchases.getRFQSubItemsStatus
  );
  const rfqSubItems = useSelector((state) => state.purchases.getRFQSubItems);
  const isRfqSUbItemsLoading = rfqSubItemsStatus === "loading";

  const rfqItemsStatus = useSelector(
    (state) => state.purchases.getRFQItemsStatus
  );
  const rfqItems = useSelector((state) => state.purchases.getRFQItems);
  const isRfqItemsLoading = rfqItemsStatus === "loading";
  let strategiesData = [
    { label: "First In First Out", value: "fifo" },
    { label: "Last In First Out", value: "lifo" },
    { label: "First Expire First Out", value: "fefo" },
  ];

  let life_time = item?.sellable?.metadata?.life_time;
  let use_time = item?.sellable?.metadata?.use_time;
  let removal_time = item?.sellable?.metadata?.removal_time;
  let alert_time = item?.sellable?.metadata?.alert_time;
  let added_on = new Date(item?.created_at);

  const [expiry_date, setExpiry] = useState(
    new Date(
      added_on?.setDate(added_on?.getDate() + parseInt(life_time))
    )?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) ?? null
  );
  const [best_before, setBestBefore] = useState(
    new Date(
      added_on?.setDate(added_on?.getDate() + parseInt(use_time))
    )?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) ?? null
  );
  const [removal_date, setRemoval] = useState(
    new Date(
      added_on?.setDate(added_on?.getDate() + parseInt(removal_time))
    )?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) ?? null
  );
  const [alert_date, setAlert] = useState(
    new Date(
      added_on?.setDate(added_on?.getDate() + parseInt(alert_time))
    )?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) ?? null
  );
  const [removal_strategy, setRemovalStrategy] = useState(
    item?.sellable?.metadata?.removal_strategy
  );

  console.log("onyambu", item);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["rfqId"] = rfqId;

    store.dispatch(getRFQSubItems(params));
  }, [session, status, rfqId]);

  console.log("RFQ Sub Items", rfqSubItems);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["rfqId"] = rfqId;

    store.dispatch(getRFQItems(params));
  }, [session, status, rfqId]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleEditRfq = async (event) => {
    event.preventDefault();

    const data = {
      selling_price: event.target.selling_price.value,
      expiry_date: expiry_date,
      best_before: best_before,
      removal_date: removal_date,
      alert_date: alert_date,
      removal_strategy: removal_strategy,
    };

    try {
      setIsSubmitting(true);
      const params = {
        accessToken: session?.user?.accessToken,
        receivalId,
        itemId,
        body: data,
      };
      await store.dispatch(updateSellablePrice(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Price Updated Successfully",
        color: "green",
      });
      setOpened(false);
    } catch (e) {
      showNotification({
        title: "Error",
        message: error?.message ?? "Could not update price",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================================
  // Profit Margin Logic
  // ==========================================================================
  const [buyingPrice, setBuyingPrice] = useState(
    parseValidFloat(item?.unit_price)
  );
  const [sellingPrice, setSellingPrice] = useState(
    parseValidFloat(item?.sellable?.sellable?.cost)
  );

  const taxPc = useMemo(
    () => parseValidFloat(item?.sellable?.sellable?.tax?.rate ?? 0),
    [item]
  );

  const [margin, setMargin] = useState();
  const [marginPc, setMarginPc] = useState("");

  useEffect(() => {
    const spGross = parseValidFloat(sellingPrice);
    const taxAmt = (spGross * (taxPc / 100)) / ((taxPc + 100) / 100);
    const spNet = spGross - taxAmt;

    const bpGross = parseValidFloat(buyingPrice);

    const marginNew = spNet - bpGross;
    const marginPcNew = bpGross > 0 ? (marginNew / bpGross) * 100 : 0;

    setMargin(marginNew.toFixed(2));
    setMarginPc(marginPcNew.toFixed(2));
  }, [sellingPrice, buyingPrice, taxPc]);

  function setSPFromMarginPc() {
    if (!marginPc) {
      return;
    }

    let marginPcParsed = parseValidFloat(marginPc);
    let bp = parseValidFloat(buyingPrice);
    let spNew = (bp * (100 + marginPcParsed)) / 100;
    spNew = (spNew * (100 + taxPc)) / 100;

    setSellingPrice(spNew.toFixed(2));
  }
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // ================================================================
  // Default Margin PC Logic
  // ================================================================
  const [defaultMarginPc, setDefaultMarginPc] = useState("");

  const merchantFlagsStatus = useSelector(
    (state) => state.security.merchantFlagsStatus
  );

  const merchantFlags = useSelector((state) => state.security.merchantFlags);

  useEffect(() => {
    if (!accessToken || merchantFlagsStatus !== "idle") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;

    store.dispatch(fetchMerchantFlags(params));
  }, [accessToken, merchantFlagsStatus]);

  useEffect(() => {
    const defaultFlag =
      merchantFlags?.find((item) => item.name === "default-profit-markup")
        ?.details?.value ?? "";

    setDefaultMarginPc(defaultFlag);
  }, [merchantFlags]);

  function setSPFromDefaultMarginPc() {
    if (!defaultMarginPc) {
      return;
    }

    let marginPcParsed = parseValidFloat(defaultMarginPc);
    let bp = parseValidFloat(buyingPrice);
    let spNew = (bp * (100 + marginPcParsed)) / 100;
    spNew = (spNew * (100 + taxPc)) / 100;

    setSellingPrice(spNew.toFixed(2));
  }
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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
        title={`Price Changes`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form onSubmit={handleEditRfq}>
          <section className="flex flex-col">
            <span className="text-dark text-sm font-bold">Price Changes</span>
            <div className="py-2">
              <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
                Item Name: {item?.sellable?.sellable?.name} <br></br>
                Price: {item?.sellable?.sellable?.cost}
              </section>

              {/* <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Buying Price*</span>
                </div>
                <input
                  type="number"
                  name="buying_price"
                  className="input-primary h-12 text-sm"
                  required=""
                  placeholder="Buying Price"
                />
              </div> */}
              <TextInput
                label="Buying Price"
                placeholder="Buying Price"
                type="number"
                value={buyingPrice}
                onChange={() => {}}
                disabled={true}
              />

              <TextInput
                label="Profit Margin"
                placeholder="Profit Margin"
                value={margin ?? 0}
                onChange={() => {}}
                // disabled
              />

              <div className="w-full flex items-end gap-1">
                <div className="grow">
                  <TextInput
                    label="Margin (%)"
                    placeholder="Margin (%)"
                    value={marginPc ?? 0}
                    onChange={(e) => setMarginPc(e.target.value)}
                    rightSection={
                      <Button
                        onClick={setSPFromMarginPc}
                        variant="outline"
                        size="xs"
                      >
                        Apply
                      </Button>
                    }
                    rightSectionWidth={"4.3rem"}
                  />
                </div>
                {defaultMarginPc && (
                  <Button onClick={setSPFromDefaultMarginPc} variant="outline">
                    Set at {defaultMarginPc}%
                  </Button>
                )}
              </div>

              <TextInput
                label="Selling Price"
                placeholder="Selling Price"
                type="number"
                name="selling_price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                required
              />
            </div>
          </section>

          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </section>
        </form>
      </Modal>

      <a
        className="btn btn-sm btn-outline-primary"
        onClick={() => setOpened(true)}
      >
        Price Changes
      </a>
    </>
  );
}

export default PriceChangesModal;
