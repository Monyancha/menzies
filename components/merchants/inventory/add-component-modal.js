import {
  Button,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  TextInput,
  Switch,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconList } from "@tabler/icons";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import {
  submitProductComponent,
  fetchExistingComponent,
  fetchExistingRecipes,
  getProducts,
  fetchSelectProducts,
} from "@/store/merchants/inventory/products-slice";
import { debounce } from "lodash";
import { parseValidFloat } from "@/lib/shared/data-formatters";
import { Table } from "@/components/ui/layouts/scrolling-table";

function AddComponent({
  ProductId,
  menus,
  product_status,
  bill_name,
  recipe_id,
}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [selected_product, setProduct] = useState();
  const [max_product_quantity, setMaxQty] = useState(null);
  const [product_components, setProductComponents] = useState([]);
  const [other_expenses, setOtherExpenses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipe_name, setRecipeName] = useState(bill_name);
  const [searchValue, onSearchChange] = useState("");

  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);
  const products = useSelector((state) => state.products.getProducts);

  const product = useSelector((state) => state.products.existingProduct);

  const select_products = useSelector(
    (state) => state.products.selected_products
  );
  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !ProductId) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["search_string"] = searchValue[searchValue?.length - 1];

    if (ProductId) {
      store.dispatch(fetchSelectProducts(params));
    }
  }, [accessToken, status, ProductId, searchValue]);

  const productsData =
    select_products
      ?.filter((val) => val.id != ProductId)
      .map((item) => ({
        value: item?.sellable?.id,
        label: item?.name,
      })) ?? [];
  const loadedId = product?.id ?? null;

  const addComponents = (e) => {
    let data = [...product_components];
    if(data.some((item)=>item.id===e[e?.length - 1]))
    {
      setProduct(e);
   
      return;
      
    }
    setProduct(e);
    data.push({
      id: e[e?.length - 1],
      quantity: "",
      wastage: "",
      estimated_quantity: "",
      total_remaining:
        select_products?.find((y) => y.sellable.id === e[e?.length - 1])
          ?.total_remaining ?? 0,
      cost:
        select_products?.find((y) => y.sellable.id === e[e?.length - 1])
          ?.buying_price ?? 0,
      unit_deduct: select_products?.find(
        (y) => y?.sellable?.id === e[e?.length - 1]
      )?.unit?.id,
      unit_wastage_deduct: select_products?.find(
        (y) => y?.sellable?.id === e[e?.length - 1]
      )?.unit?.id,
      item_stage: "",
    });

    setProductComponents(data);
  };

  const removeComponent = (index) => {
    let data = [...product_components];
    data.splice(index, 1);
    setProductComponents(data);
  };

  useEffect(() => {
    if (selected_product?.length < 1) {
      setProductComponents([]);
    }
  }, [selected_product]);

  const handleItemStage = (e, index) => {
    let data = [...product_components];
    data[index]["item_stage"] = e;
    setProductComponents(data);
  };

  const handleQuantityChange = (e, index) => {
    let data = [...product_components];
    data[index]["quantity"] = e;
    const unit_name =
      select_products?.find((y) => y?.sellable?.id === data[index]["id"])?.unit
        ?.name ?? "";
    const selected_unit_name = data[index]["unit_deduct"]
      ? unitList?.data?.find((y) => y?.id === data[index]["unit_deduct"])
          ?.name ?? ""
      : "";

    // console.log("Selected Unit is " +  selected_unit_name);
    // console.log("Default Unit is " + unit_name);
    let total_rem = parseValidFloat(data[index]["total_remaining"]);
    let wastage = parseValidFloat(data[index]["wastage"]);
    let quantity = parseValidFloat(e);

    if (unit_name != selected_unit_name) {
      if (unit_name === "kgs" && selected_unit_name === "grams") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "grams" && selected_unit_name === "kgs") {
        total_rem = total_rem / 1000;
      }

      if (unit_name === "Litres" && selected_unit_name === "ml") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "ml" && selected_unit_name === "Litres") {
        total_rem = total_rem / 1000;
      }
      if (unit_name === "meters" && selected_unit_name === "cm") {
        total_rem = total_rem * 100;
      }

      if (unit_name === "cm" && selected_unit_name === "meters") {
        total_rem = total_rem / 100;
      }
    }
    let w_q = wastage + quantity;
    console.log(w_q);
    let e_w_q = parseValidFloat(total_rem / w_q);
    data[index]["estimated_quantity"] = parseInt(e_w_q.toFixed(5)) ?? 0;
    setProductComponents(data);

    let max_qty =
      product_components?.reduce((prev, curr) =>
        curr?.estimated_quantity > prev?.estimated_quantity ? prev : curr
      ).estimated_quantity ?? null;
    max_qty > 0 ? max_qty : 0;
    setMaxQty(max_qty);
  };

  const handleWastageChange = (e, index) => {
    let data = [...product_components];
    data[index]["wastage"] = e;

    const unit_name = select_products?.find(
      (y) => y?.sellable?.id === data[index]["id"]
    )?.unit?.name;
    const selected_unit_name = data[index]["unit_deduct"]
      ? unitList?.data?.find(
          (y) => y?.id === data[index]["unit_deduct"]
        )?.name ?? ""
      : "";

    let total_rem = parseValidFloat(data[index]["total_remaining"]);
    let quantity = parseValidFloat(data[index]["quantity"]);
    let wastage = parseValidFloat(e);

    if (unit_name != selected_unit_name) {
      if (unit_name === "kgs" && selected_unit_name === "grams") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "grams" && selected_unit_name === "kgs") {
        total_rem = total_rem / 1000;
      }

      if (unit_name === "Litres" && selected_unit_name === "ml") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "ml" && selected_unit_name === "Litres") {
        total_rem = total_rem / 1000;
      }
      if (unit_name === "meters" && selected_unit_name === "cm") {
        total_rem = total_rem * 100;
      }

      if (unit_name === "cm" && selected_unit_name === "meters") {
        total_rem = total_rem / 100;
      }
    }
    let w_q = wastage + quantity;
    let e_w_q = parseValidFloat(total_rem / w_q);
    data[index]["estimated_quantity"] = parseInt(e_w_q.toFixed(5)) ?? 0;
    setProductComponents(data);
    let max_qty =
      product_components?.reduce((prev, curr) =>
        curr?.estimated_quantity > prev?.estimated_quantity ? prev : curr
      ).estimated_quantity ?? null;
    max_qty > 0 ? max_qty : 0;
    setMaxQty(max_qty);
  };
  const addStage = () => {
    let data = [...stages];
    data.push(stage_name);
    setStage(data);
    showNotification({
      position: "top-right",
      zIndex: 2077,
      title: "SUCCESS",
      message: "New Stage Added",
      color: "green",
      autoClose: true,
    });
    setStageName("");
  };

  const handleUnitChange = (e, index) => {
    let data = [...product_components];
    data[index]["unit_deduct"] = e;
    const unit_name = select_products?.find(
      (y) => y?.sellable?.id === data[index]["id"]
    )?.unit?.name;
    const selected_unit_name = data[index]["unit_deduct"]
      ? unitList?.data?.find((y) => y?.id === e).name ?? ""
      : "";

    let total_rem = parseValidFloat(data[index]["total_remaining"]);
    let quantity = parseValidFloat(data[index]["quantity"]);
    let wastage = parseValidFloat(data[index]["wastage"]);

    if (unit_name != selected_unit_name) {
      if (unit_name === "kgs" && selected_unit_name === "grams") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "grams" && selected_unit_name === "kgs") {
        total_rem = total_rem / 1000;
      }

      if (unit_name === "Litres" && selected_unit_name === "ml") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "ml" && selected_unit_name === "Litres") {
        total_rem = total_rem / 1000;
      }
      if (unit_name === "meters" && selected_unit_name === "cm") {
        total_rem = total_rem * 100;
      }

      if (unit_name === "cm" && selected_unit_name === "meters") {
        total_rem = total_rem / 100;
      }
    }
    let w_q = wastage + quantity;
    let e_w_q = parseValidFloat(total_rem / w_q);
    data[index]["estimated_quantity"] = parseInt(e_w_q.toFixed(5));
    setProductComponents(data);
    let max_qty =
      product_components?.reduce((prev, curr) =>
        curr?.estimated_quantity > prev?.estimated_quantity ? prev : curr
      ).estimated_quantity ?? null;
    max_qty > 0 ? max_qty : 0;
    setMaxQty(max_qty);
  };
  const handleUnitWastageChange = (e, index) => {
    let data = [...product_components];
    data[index]["unit_wastage_deduct"] = e;
    const unit_name =
      select_products?.find((y) => y?.sellable?.id === data[index]["id"])?.unit
        ?.name ?? "";
    const selected_unit_name = data[index]["unit_wastage_deduct"]
      ? unitList?.data?.find((y) => y?.id === e).name ?? ""
      : "";

    let total_rem = parseValidFloat(data[index]["total_remaining"]);
    let quantity = parseValidFloat(data[index]["quantity"]);
    let wastage = parseValidFloat(data[index]["wastage"]);

    if (unit_name != selected_unit_name) {
      if (unit_name === "kgs" && selected_unit_name === "grams") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "grams" && selected_unit_name === "kgs") {
        total_rem = total_rem / 1000;
      }

      if (unit_name === "Litres" && selected_unit_name === "ml") {
        total_rem = total_rem * 1000;
      }

      if (unit_name === "ml" && selected_unit_name === "Litres") {
        total_rem = total_rem / 1000;
      }
      if (unit_name === "meters" && selected_unit_name === "cm") {
        total_rem = total_rem * 100;
      }

      if (unit_name === "cm" && selected_unit_name === "meters") {
        total_rem = total_rem / 100;
      }
    }
    let w_q = wastage + quantity;
    let e_w_q = parseValidFloat(total_rem / w_q);
    data[index]["estimated_quantity"] = parseInt(e_w_q.toFixed(5));
    setProductComponents(data);
    let max_qty =
      product_components?.reduce((prev, curr) =>
        curr?.estimated_quantity > prev?.estimated_quantity ? prev : curr
      ).estimated_quantity ?? null;
    max_qty > 0 ? max_qty : 0;
    setMaxQty(max_qty);
  };

  const handleRecipeNameChange = (e) => {
    setRecipeName(e);
  };

  // const onInputHandler = debounce((value) => {
  //   if (!session || status !== "authenticated" || !value) {
  //     return;
  //   }
  //   const params = {};
  //   params["accessToken"] = session.user.accessToken;
  //   params["search_string"] = value;
  //    console.log("Product SELECTOR:: Received Input: ", value);

  //   store.dispatch(fetchSelectProducts(params));
  // }, 1000);

  async function submitDetails() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["recipe_name"] = recipe_name ?? bill_name;
    params["product_components"] = product_components;
    params["other_expenses"] = other_expenses;
    params["productId"] =
      product_status == "menus"
        ? menus?.menu_item?.sellable?.sellable_id
        : ProductId;
    params["product_status"] = product_status;
    params["max_product_quantity"] = max_product_quantity;
    params["recipe_id"] = recipe_id;
    params["stages"] = stages;

    setIsSubmitting(true);
    try {
      await store.dispatch(submitProductComponent(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message: "New Components/Ingredients Created",
        color: "green",
        autoClose: true,
      });

      setProductComponents([]);
      store.dispatch(fetchExistingComponent(params));
      store.dispatch(fetchExistingRecipes(params));
      setIsSubmitting(false);
      setOpened(false);
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
      setIsSubmitting(false);
    }
  }
  const unitList = useSelector((state) => state.units.unitList);

  const unitsData =
    unitList?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];
  const [checked, setChecked] = useState(false);
  const [stages, setStage] = useState([]);
  const [stage_name, setStageName] = useState("");

  const stagesData = stages?.map((stage) => ({
    value: stage,
    label: stage,
  }));

  return (
    <>
      <Modal
        opened={opened}
        title={`Add Raw Materials For ${
          product_status != "menus" ? product?.name : menus?.menu_item?.name
        }`}
        onClose={() => setOpened(false)}
        size="100%"
      >
        <section className="">
          <div className="grid grid-cols-3 p-4">
            <Switch
              label="Add Stage"
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
              size="md"
            />
          </div>
          {checked && (
            <div className="grid grid-cols-3 space-y-3 gap-4">
              <TextInput
                placeholder="Stage Name"
                value={stage_name}
                onChange={(e) => setStageName(e.currentTarget.value)}
              />
              <div className="flex items-center mt-2">
                <Button
                  onClick={() => {
                    addStage();
                  }}
                  size="xs"
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          <Table>
            <tr>
              <td>
                <TextInput
                  placeholder={
                    product_status == "menus"
                      ? "Recipe Name"
                      : "Bill Of Material Name"
                  }
                  label={
                    product_status == "menus"
                      ? "Recipe Name"
                      : "Bill Of Material Name"
                  }
                  onChange={(e) =>
                    handleRecipeNameChange(e.currentTarget.value)
                  }
                  defaultValue={bill_name}
                  readOnly={bill_name ? true : false}
                />
              </td>

              <td>
                <MultiSelect
                  placeholder="Select Ingredients"
                  label="Select Ingredients"
                  value={selected_product}
                  data={productsData}
                  onChange={(e) => addComponents(e)}
                  searchable
                  clearable
                  onSearchChange={onSearchChange}
                  searchValue={searchValue}
                />
              </td>
            </tr>
          </Table>

          {selected_product && selected_product?.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    Ingredients/Components
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    Quantity To Deduct
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    Unit Of Measure
                  </td>
                  {/* <td className="py-3 px-6 text-sm whitespace-nowrap">
                    Wastage To Deduct
                  </td> */}

                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    Unit Of Measure
                  </td>

                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    Estimated Final Quantiy
                  </td>
                </tr>
              </thead>

              <tbody>
                {product_components?.map((it, index) => (
                  <tr className="border-b" key={index}>
                    <td className="text-sm whitespace-nowrap">
                      <div
                        className={`grid grid-cols-${
                          stages.length > 0 ? 2 : 1
                        } gap-1`}
                      >
                        <TextInput
                          className="w-full sm:w-auto mb-1"
                          placeholder="Ingredient"
                          defaultValue={
                            select_products?.find(
                              (y) => y?.sellable?.id === it?.id
                            )?.name
                          }
                          readOnly
                        />
                        {stages.length > 0 && (
                          <div className="flex justify-end">
                            <Select
                              placeholder="Select Stage"
                              data={stagesData}
                              onChange={(e) => handleItemStage(e, index)}
                              searchable
                              className=""
                              size="xs"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-sm whitespace-nowrap">
                      <NumberInput
                        className="w-full text-xs sm:w-auto sm:text-xs"
                        placeholder="Quantity"
                        precision={3}
                        step={0.5}
                        onChange={(e) => handleQuantityChange(e, index)}
                      />
                      <table>
                        <tr></tr>
                      </table>
                    </td>
                    <td>
                      {select_products?.find((y) => y?.sellable?.id === it?.id)
                        ?.unit?.id && (
                        <Select
                          placeholder="Measure"
                          data={unitsData}
                          searchable
                          name="unit_id"
                          onChange={(e) => handleUnitChange(e, index)}
                          size="xs"
                          defaultValue={it?.unit_deduct}
                        />
                      )}
                    </td>
                    <td className="text-sm whitespace-nowrap">
                      <NumberInput
                        className="w-full text-xs sm:w-auto sm:text-xs"
                        precision={3}
                        step={0.5}
                        onChange={(e) => handleWastageChange(e, index)}
                        placeholder="Wastage"
                      />
                    </td>
                    {/* <td>
                      {select_products?.find((y) => y?.sellable?.id === it?.id)
                        ?.unit?.id && (
                        <Select
                          placeholder="Measure"
                          data={unitsData}
                          searchable
                          name="unit_id"
                          onChange={(e) => handleUnitWastageChange(e, index)}
                          size="xs"
                          defaultValue={it?.unit_deduct}
                        />
                      )}
                    </td> */}

                    <td className="text-sm whitespace-nowrap">
                      <div
                        className={`grid grid-flow-col md:grid-flow-row grid-cols-2  overflow-x-auto`}
                      >
                        <TextInput
                          className="w-full sm:w-auto mt-2 sm:text-xs"
                          placeholder="Estimated Quantiy"
                          defaultValue={it.estimated_quantity}
                          readOnly
                        />
                        <i
                          onClick={() => removeComponent(index)}
                          className="text-red-800 font-bold px-2 cursor-pointer mt-4"
                        >
                          X
                        </i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* {selected_product?.length > 0 && (
  <div className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}>
  <div className="">
  <TextInput
      className="w-full sm:w-auto mt-2"
      label={`${product?.name} Quantity To Manufacture`}
      placeholder={`Enter  ${product?.name} Quantity To Manufacture`}
      onChange={(e) => handleMaxQtyChange(e.currentTarget.value)}
      defaultValue={max_product_quantity}
    />
  </div>
  </div>
)} */}

          <div
            className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}
          >
            <div className=""></div>
            {selected_product?.length > 0 && (
              <div className="">
                <Button
                  disabled={isSubmitting ? true : false}
                  type="submit"
                  size="md"
                  onClick={submitDetails}
                >
                  {!isSubmitting && <b>SAVE </b>}
                  {isSubmitting && <b>SAVING......</b>}
                </Button>
              </div>
            )}
          </div>
        </section>
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        className="px-1 py-1 mr-1"
      >
        {product_status !== "menus" && (
          <b>{bill_name ? "Add New" : "Bill Of Material"}</b>
        )}
        {product_status == "menus" && (
          <b> {bill_name ? "Add New" : "RECIPE"}</b>
        )}
      </Button>
    </>
  );
}

export default AddComponent;
