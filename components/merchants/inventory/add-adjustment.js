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
import { getAdjustmentReq } from "../../../store/merchants/inventory/inventory-slice";
import store from "../../../store/store";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import { DatePicker } from "@mantine/dates";
import { parseValidFloat } from "@/lib/shared/data-formatters";

function AddAdjustments({ adjustment, manual }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [adjustment_action, setAdjustment] = useState("");
  const [warehouse_id, setWarehouse] = useState("");
  const [company_id, setCompany] = useState("");
  const [buying_price, setBuyingPrice] = useState("");
  const [selling_price, setSellingPrice] = useState("");
  const [margin, setMargin] = useState("");
  const [marginPc, setMarginPc] = useState("");
  const [batchRecord, setBatchRecord] = useState("");
  const [sellOnPOS, setSellOnPOS] = useState("");
  const [margin_percent, setMarginPercent] = useState("");
  const [expires, setExpires] = useState();

  let life_time = parseInt(adjustment?.sellable?.metadata?.life_time);
  let use_time = parseInt(adjustment?.sellable?.metadata?.use_time);
  let removal_time = parseInt(adjustment?.sellable?.metadata?.removal_time);
  let added_on = new Date();

  const [expiry_date, setExpiry] = useState("");
  const [best_before, setBestBefore] = useState("");
  const [removal_date, setRemoval] = useState("");
  const [removal_strategy, setRemovalStrategy] = useState(
    adjustment?.sellable?.metadata?.removal_strategy
  );

  const manualStatus = useSelector(
    (state) => state.inventory.getAdjustmentReqStatus
  );

  // const manual = useSelector((state) => state.inventory.getAdjustmentReq);

  let strategiesData = [
    { label: "First In First Out", value: "fifo" },
    { label: "Last In First Out", value: "lifo" },
    { label: "First Expire First Out", value: "fefo" },
  ];

  function handleIsExpires(event) {
    setExpires(event.target.checked);
    console.log("The new batch is " + batchRecord);
  }

  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!session || status !== "authenticated" || !opened) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getAdjustmentReq(params));
  }, [session, status, opened]);

  const submitAdjustment = async (event) => {
    event.preventDefault();

    const data = {
      quantity: quantity,
      adjustment_action: adjustment_action,
      warehouse_id: warehouse_id,
      company_id: company_id,
      buying_price: buying_price,
      selling_price: selling_price,
      batch_this_record: batchRecord,
      make_active_batch: sellOnPOS,
      branch_id: branch_id,
      expiry_date:
        expires && batchRecord ? new Date(expiry_date).toISOString() : null,
      best_before:
        expires && batchRecord ? new Date(best_before).toISOString() : null,
      removal_date:
        expires && batchRecord ? new Date(removal_date).toISOString() : null,
      removal_strategy: expires && batchRecord ? removal_strategy : null,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/products/${adjustment?.id}/create-manual-adjustment`;

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
        message: "Adjustment was Successfully",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
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
    const buyingPrice = buying_price;
    const sellingPrice = selling_price;

    let taxPc = adjustment?.tax?.rate ?? 0;
    let taxMethod = adjustment?.tax_method;
    let bpTaxPc = adjustment?.bp_tax?.rate ?? 0;
    let bpTaxMethod = adjustment?.bp_tax_method;

    let spGross = parseValidFloat(sellingPrice);
    const isSpTaxInclusive = taxMethod?.toLowerCase() === "inclusive";
    const isSpTaxExclusive = taxMethod?.toLowerCase() === "exclusive";
    const taxAmt = isSpTaxInclusive
      ? spGross * (taxPc / (taxPc + 100))
      : isSpTaxExclusive
      ? spGross * ((taxPc + 100) / 100)
      : 0;
    spGross = isSpTaxInclusive ? spGross : spGross + taxAmt;

    let bpGross = parseValidFloat(buyingPrice);
    const isBpTaxInclusive = bpTaxMethod?.toLowerCase() === "inclusive";
    const isBpTaxExclusive = bpTaxMethod?.toLowerCase() === "exclusive";
    const bpTaxAmt = isBpTaxInclusive
      ? bpGross * (bpTaxPc / (bpTaxPc + 100))
      : isBpTaxExclusive
      ? bpGross * (bpTaxPc / 100)
      : 0;
    bpGross = isBpTaxInclusive ? bpGross : bpGross + bpTaxAmt;

    const spNet = spGross - (taxAmt - bpTaxAmt);

    let marginNew = spNet - bpGross;
    let marginPcNew = bpGross > 0 ? (marginNew / bpGross) * 100 : "";

    marginNew = Math.round(marginNew * 100) / 100;
    marginPcNew = Math.round(marginPcNew * 100) / 100;

    setMargin(marginNew);
    setMarginPc(marginPcNew);
  }, [buying_price, selling_price, adjustment]);

  console.log("Rasta", adjustment);

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
        title={`#${adjustment?.id} ${adjustment?.name} `}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">Add Adjustment</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Name *</span>
              </div>
              <input
                type="text"
                name="quantity"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Name"
                value={adjustment?.name}
                readOnly
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Adjustment Quantity *</span>
              </div>
              <input
                type="number"
                name="adjustment"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Quantity"
                onChange={(e) => setQuantity(e.currentTarget.value)}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm">
                <span>Store</span>
              </div>
              <select
                className="py-3 select select-bordered h-fit"
                required=""
                name="warehouse_id"
                onChange={(e) => setWarehouse(e.currentTarget.value)}
              >
                <option>Select Store</option>
                {manual?.warehouse.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <div className="text-dark text-sm">
                <span>Action</span>
              </div>
              <select
                className="py-3 select select-bordered h-fit"
                required=""
                name="adjustment_action"
                placeholder="Choose whether you adding or subtracting the product"
                onChange={(e) => setAdjustment(e.currentTarget.value)}
              >
                <option value="">Action</option>
                <option value="addition">Recieving</option>
              </select>
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>New Buying Price*</span>
              </div>
              <input
                type="number"
                name="buying_price"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Selling Price"
                onChange={(e) => setBuyingPrice(e.currentTarget.value)}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>New Selling Price*</span>
              </div>
              <input
                type="number"
                name="selling_price"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Selling Price"
                onChange={(e) => setSellingPrice(e.currentTarget.value)}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Profit Margin</span>
              </div>
              <input
                type="number"
                name="profit_margin"
                className="input-primary h-12 text-sm bg-light"
                placeholder="Margin"
                readOnly
                value={margin}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Profit Margin(%)</span>
              </div>
              <input
                type="number"
                name="profit_margin"
                className="input-primary h-12 text-sm bg-light"
                placeholder="Margin"
                readOnly
                value={marginPc}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Company*</span>
              </div>
              <select
                type="text"
                className="py-3 select select-bordered h-fit"
                name="company_id"
                onChange={(e) => setCompany(e.currentTarget.value)}
              >
                <option value="">-- Select Company</option>
                {manual?.companies.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control pl-1">
              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  name="batch_this_record"
                  className="checkbox checkbox-primary"
                  onChange={() => setBatchRecord(!batchRecord)}
                />
                <span className="label-text">Batch this record</span>
              </label>
            </div>

            {/* {batchRecord && ( */}
            <div className="form-control pl-1">
              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  name="make_active_batch"
                  className="checkbox checkbox-primary"
                  onChange={() => setSellOnPOS(!sellOnPOS)}
                />
                <span className="label-text">Sell On POS</span>
              </label>
            </div>
            {batchRecord && (
              <div className="form-control pl-1">
                <label className="label cursor-pointer justify-start space-x-2">
                  <input
                    type="checkbox"
                    name="expires"
                    className="checkbox checkbox-primary"
                    onChange={handleIsExpires}
                  />
                  <span className="label-text">Expiry Details</span>
                </label>
              </div>
            )}
            {/* )} */}
          </div>
        </section>
        {batchRecord && (
          <section>
            {expires && (
              <div>
                <div className="my-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Best Before Date*</span>
                  </div>

                  <DatePicker
                    onChange={(e) => setBestBefore(e)}
                    defaultValue={best_before}
                  />
                </div>
                <div className="my-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Expiry Date*</span>
                  </div>
                  <DatePicker
                    onChange={(e) => setExpiry(e)}
                    defaultValue={expiry_date}
                  />
                </div>
                <div className="my-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Removal Date*</span>
                  </div>

                  <DatePicker
                    defaultValue={removal_date}
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
            )}
          </section>
        )}

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitAdjustment}>Save</Button>
        </section>
      </Modal>

      <div
        className="tooltip tooltip-top items-center"
        data-tip="Manual Adjustment"
      >
        <a
          onClick={() => setOpened(true)}
          className="btn btn-sm btn-primary btn-outline gap-2"
        >
          <i className="fa-solid fa-plus-minus" />
        </a>
      </div>
    </>
  );
}

export default AddAdjustments;
