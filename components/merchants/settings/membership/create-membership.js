import { parseValidFloat, parseValidInt } from "@/lib/shared/data-formatters";
import {
  Button,
  MultiSelect,
  Checkbox,
  Select,
  TextInput,
  Tab,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getProducts } from "@/store/merchants/inventory/products-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "@/components/ui/layouts/scrolling-table";
import { getServices } from "@/store/merchants/inventory/inventory-slice";
import { submitMembership } from "@/store/merchants/settings/membership-slice";
import { useRouter } from "next/router";
function CreateMemberShip() {
  const [name, setName] = useState("");
  const [validity_days, setValidity] = useState("");
  const [value_cost, setValueCost] = useState("");
  const [validity_in, setValidityIn] = useState("");
  const [inventory_type, setInventory] = useState("");
  const [membership_type, SetMembershipType] = useState("");
  const [calculate_commission, setCalculateCommission] = useState();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product_components, setProductComponents] = useState([]);
  const [new_products, setNewProducts] = useState([]);
  const [new_services, setNewServices] = useState([]);
  const [percent_discount, setDisc] = useState();
  const [select_all,setCheckAll] = useState();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const creditSettings = useSelector(
    (state) => state.transactions.creditReminderSettingData
  );

  const select_products = useSelector(
    (state) => state.products.selected_products
  );
  const products = useSelector((state) => state.products.getProducts);
  const services = useSelector((state) => state.inventory.getServices);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const router = useRouter();


  useEffect(() => {
    if (!products) {
      return;
    }

    let data = [];
    products?.data.map((item) => {
      data.push({
        name: item.name,
        id: item.id,
        cost: item?.cost ?? 0,
        percentage_discount: "",
        membership_price: "",
        discount: "",
        sellable_id: item?.sellable?.id,
        checked:select_all
      });
    });

    setNewProducts(data);
  }, [products,select_all]);

  useEffect(() => {
    if (!services) {
      return;
    }

    let data = [];
    services?.data.map((item) => {
      data.push({
        name: item.name,
        id: item.id,
        cost: item?.cost ?? 0,
        percentage_discount: "",
        membership_price: "",
        discount: "",
        sellable_id: item?.sellable?.id,
        checked: select_all,
      });
    });

    setNewServices(data);
  }, [services,select_all]);

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(getProducts(params));
    store.dispatch(getServices(params));
  }, [accessToken, status, branch_id]);
  const productsData =
    select_products?.map((item) => ({
      value: item?.sellable?.id,
      label: item?.name,
    })) ?? [];

  async function submitDetails() {
    showNotification({
      position: "top-right",
      zIndex: 2077,
      title: "SUCCESS",
      message: "New Membership Card Created",
      color: "green",
      autoClose: true,
    });
  }

  const validities = [
    { label: "Days", value: "Days" }
  ];

  const inventories = [
    { label: "Services", value: "services" },
    { label: "Products", value: "products" },
  ];

  const membership_types = [
    { label: "Access", value: "Access" },
    { label: "Discount", value: "Discount" },
  ];

  useEffect(()=>{
    if(!select_all)
    {
      console.log(select_all);
      return;
    }
    if (inventory_type === "services") {
      console.log(select_all);
      let n_services = [...new_services];
      n_services?.map((item, index) => {
        n_services[index]["checked"] = select_all;
      });
      setNewServices(n_services);
    }
    if(inventory_type === "products") {
      let n_products = [...new_products];
      n_products?.map((item, index) => {
        n_products[index]["checked"] = select_all;
      });
      setNewProducts(n_products);
    }

  },[select_all,inventory_type,new_services,new_products])

  const accessAll = (status) => {
    if (inventory_type === "services") {
      let n_services = [...new_services];
      n_services?.map((item, index) => {
        n_services[index]["checked"] = status;
      });
      setNewServices(n_services);
      console.log(new_services);
    }
    if(inventory_type === "products") {
      let n_products = [...new_products];
      n_products?.map((item, index) => {
        n_products[index]["checked"] = status;
      });
      setNewProducts(n_products);
      console.log(n_products);
    }
  };

  const addDiscount = (discount) => {
    if (inventory_type === "services") {
      let n_services = [...new_services];
      n_services?.map((item, index) => {
        const disc =
         ( (parseValidFloat(discount) / 100) *
          parseValidFloat(n_services[index]["cost"])).toFixed(2);
        const membership_price =
          parseValidFloat(n_services[index]["cost"]) - parseValidFloat(disc);

        n_services[index]["membership_price"] = membership_price;
        n_services[index]["discount"] = disc;
        n_services[index]["checked"] =  true
      });
      setNewServices(n_services);
     
    }

    if (inventory_type === "products") {
      let n_products = [...new_products];
      n_products?.map((item, index) => {
        const disc =
          ((parseValidFloat(discount) / 100) *
          parseValidFloat(n_products[index]["cost"])).toFixed(2);
        const membership_price =
          parseValidFloat(n_products[index]["cost"]) - parseValidFloat(disc);

        n_products[index]["membership_price"] = membership_price;
        n_products[index]["discount"] = disc;
        n_services[index]["checked"] = true;
      });
      setNewProducts(n_products);
      // console.log(n_products);
    }
  };

  async function submitDetails() {
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["name"] = name;
    params["cost"] = value_cost;
    params["validity"] = validity_days;
    params["validity_in"] = validity_in;
    params["discount"] = percent_discount;
    params["new_services"] = new_services;
    params["new_products"] = new_products;
    params["membership_type"] = membership_type;
    params["calculate_commission"] = calculate_commission ? 1 : 0;

    try {
      setIsSubmitting(true);

      await store.dispatch(submitMembership(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });

      setIsSubmitting(false);
      router.push("/merchants/settings/membership");

    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }

      showNotification({
        title: "Warning",
        message,
        color: "orange",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end">
          <TextInput
            label="Membership Name"
            type="text"
            placeholder="Name"
            name="name"
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />

          <TextInput
            label="Value/Cost"
            type="text"
            placeholder="Value/Cost"
            value={value_cost}
            onChange={(e) => setValueCost(e.currentTarget.value)}
            required
          />

          <TextInput
            label="Validity"
            placeholder="Validity"
            defaultValue={validity_days}
            onChange={(e) => setValidity(e.currentTarget.value)}
            required
          />

          <Select
            label="Validity In"
            placeholder="Validiy In"
            data={validities}
            searchable
            onChange={setValidityIn}
            size="xs"
            required
          />
          <Select
            label="Membership Type"
            data={membership_types}
            searchable
            onChange={SetMembershipType}
            size="xs"
            required
          />
       {membership_type==="Discount" && (
        <div className="grid grid-flow-row gap-2">
        <label className="text-sm">Calculate Commission From Membership Price</label>
       <Checkbox
      size="md"
      onChange={(e) => setCalculateCommission(e.currentTarget.checked)}

    />

       </div>

       )}
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end"></div>

       {membership_type==="Discount" && (
         <div className="w-full grid grid-cols-3 md:grid-cols-3 gap-3  p-6 text-lg">

         <Select
           label="Inventory Type"
           data={inventories}
           searchable
           onChange={setInventory}
           size="xs"
         />


           <TextInput
             className="w-full text-xs sm:w-auto sm:text-xs"
             label="Percentage Discount"
             placeholder="% Discount"
             onChange={(e) => setDisc(e.currentTarget.value)}
           />

         <div>
           <div className="p-2"></div>

             <Button onClick={() => addDiscount(percent_discount)}>
               APPLY ALL
             </Button>

         </div>
       </div>
       )}
      {membership_type === "Discount" && (
        <Table>
          <thead>
            <tr>

              <td className="py-3 px-6 text-sm whitespace-nowrap">
                Product/Service
              </td>
              <td className="py-3 px-6 text-sm whitespace-nowrap">Price</td>

                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  Discount
                </td>

                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  Mermbership Price
                </td>

            </tr>
          </thead>

          <tbody>
            {inventory_type === "products" &&
              new_products?.map((it, index) => (
                <tr className="border-b" key={index}>
                  {/* <td>
                    <td>
                      <Checkbox
                        key={it.id}
                        defaultChecked={select_all}

                      />
                    </td>
                  </td> */}
                  <td className="text-sm whitespace-nowrap">{it?.name}</td>
                  <td className="text-sm whitespace-nowrap">{it?.cost}</td>

                    <td className="text-sm whitespace-nowrap">
                      <TextInput
                        className="w-full text-xs sm:w-auto sm:text-xs"
                        defaultValue={it?.discount}
                        readOnly
                      />
                    </td>

                    <td className="text-sm whitespace-nowrap">
                      <div
                        className={`grid grid-flow-col md:grid-flow-row grid-cols-2  overflow-x-auto`}
                      >
                        <TextInput
                          className="w-full sm:w-auto mt-2 sm:text-xs"
                          placeholder=""
                          readOnly
                          defaultValue={it?.membership_price}
                        />
                      </div>
                    </td>

                </tr>
              ))}
            {inventory_type === "services" &&
              new_services?.map((it, index) => (
                <tr className="border-b" key={index}>
                  {/* <td>
                    <td>
                      <Checkbox
                        key={it.id}
                        defaultChecked={it.checked}
                      />
                    </td>
                  </td> */}
                  <td className="text-sm whitespace-nowrap">{it?.name}</td>
                  <td className="text-sm whitespace-nowrap">{it?.cost}</td>

                    <td className="text-sm whitespace-nowrap">
                      <TextInput
                        className="w-full text-xs sm:w-auto sm:text-xs"
                        readOnly
                        defaultValue={it?.discount}
                      />
                    </td>


                    <td className="text-sm whitespace-nowrap">
                      <div
                        className={`grid grid-flow-col md:grid-flow-row grid-cols-2  overflow-x-auto`}
                      >
                        <TextInput
                          className="w-full sm:w-auto mt-2 sm:text-xs"
                          placeholder=""
                          readOnly
                          defaultValue={it?.membership_price}
                        />
                      </div>
                    </td>

                </tr>
              ))}
          </tbody>
        </Table>
        )}

        <div className="mt-5">
          <Button loading={isSubmitting} onClick={submitDetails}>
            Save
          </Button>
        </div>
      </Card>
    </>
  );
}

export default CreateMemberShip;
