import { Button, Modal, Select, TextInput, MultiSelect } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Card from "@/components/ui/layouts/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchVariationList } from "@/store/merchants/inventory/variation-slice";
import store from "@/store/store";
import { Table } from "@/components/ui/layouts/scrolling-table";
import {
  submitLaundryItem,
  fetchLaundryItems,
} from "@/store/merchants/inventory/job-slice";
import { useRouter } from "next/router";
import NewVariationModal from "./variations/new-variation-modal";

function NewLaundryItemModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState();
  // const [cost, setCost] = useState();
  const [selected_variation, setVariation] = useState();
  const [product_values, setProductValues] = useState([]);
  const [variation_values, setVariationValues] = useState(null);
  const [isValues, setIsValues] = useState(false);
  const [array_ids, setArrayIds] = useState([]);
  const [isSingle, setIsSingle] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const variationList = useSelector((state) => state.variation.variationList);

  const params = {};
  params["accessToken"] = session?.user?.accessToken;

  const router = useRouter();

  //   const isCarWashAc = isCarWash(session?.user);

  function clearForm() {
    setName("");
    setProductValues([]);
    setVariationValues([]);
    setArrayIds([]);
    setIsSingle(true);
  }

  const addValues = () => {
    let data = [...product_values];
    let nam = data?.find((y) => y?.name == variation_values)?.name;
    if (nam == null) {
      data.push({
        name: name + "-" + variation_values,
        cost: "",
        size: "",
        color: "",
      });

      setIsValues(true);
      // console.log(filtered_values);
      setProductValues(data);
      console.log(product_values);
      setArrayIds([]);
      setVariationValues(null);
      setVariation([]);
    } else {
      showNotification({
        title: "Error",
        message: nam + " Variation Already Exists",
        color: "red",
      });
    }
  };

  const handleValuesChange = (value, index) => {
    let ids = [...array_ids];

    let new_name = variation_values != null ? variation_values + "-" : "";
    let all_names =
      new_name +
      variationList[index]["variation_values"]?.find(
        (item) => item?.id == value
      ).name;

    ids.push(value);
    setArrayIds(ids);
    setVariationValues(all_names);
    console.log(all_names);
    console.log(ids);
  };

  // const handleCostChange = (index, value) => {
  //     let data = [...product_values];
  //     data[index]["cost"] = value;
  //     setProductValues(data);
  //     console.log(product_values);
  // };

  //Toggle Product Type
  const toggleType = (value) => {
    if (value == "Single") {
      setIsSingle(true);
      // alert("True Value is " +  isSingle);
    } else {
      setIsSingle(false);
      // alert("False Value is " + isSingle)
    }
  };

  const removeVariantProduct = (index) => {
    let data = [...product_values];
    data.splice(index, 1);
    setProductValues(data);
  };

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(fetchVariationList(params));
  }, [session, status]);

  const variationData =
    variationList?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  useEffect(() => {
    if (selected_variation?.length != 0) {
      setIsValues(true);
    }
  }, [selected_variation]);

  const dispatch = useDispatch();
  const branch_id = useSelector((state) => state.branches.branch_id);

  let typesData = [
    { label: "Single", value: "Single" },
    { label: "Variable", value: "Variable" },
  ];

  async function submitDetails() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["product_values"] = product_values;
    params["product_type"] = isSingle;

    setIsSubmitting(true);
    try {
      await store.dispatch(submitLaundryItem(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message: "New Luandry Successfully Created",
        color: "green",
        autoClose: true,
      });

      setProductValues([]);

      setIsSubmitting(false);
      setOpened(false);
      clearForm();
      store.dispatch(fetchLaundryItems(params));
      router.push("/merchants/inventory/jobs/new-job");
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

  return (
    <>
      <Modal
        opened={opened}
        title="New Laundry Item"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="60%"
      >
        <section className="flex flex-row space-y-2 space-x-3 bg-light p-3 rounded-lg">
          <Select
            label="Select Type"
            className="w-full sm:w-auto"
            placeholder="Item Type"
            onChange={(e) => toggleType(e)}
            data={typesData}
            searchable
            clearable
            size="sm"
            sx={{ flex: 1 }}
          />
        </section>

        <section className="flex flex-col space-y-2 p-3">
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </section>
        {!isSingle && (
          <Card>
            <div
              className={`grid grid-flow-col md:grid-flow-row grid-cols-${
                selected_variation?.length < 1
                  ? 2
                  : selected_variation?.length + 1
              } gap-2 overflow-x-auto`}
            >
              <div className="py-2 flex flex-row gap-2 items-end">
                <MultiSelect
                  placeholder="Variation "
                  label="Select Variation"
                  value={selected_variation}
                  onChange={setVariation}
                  data={variationData}
                  searchable
                  clearable
                />

                <NewVariationModal />
              </div>
              {selected_variation?.map((item, index) => (
                <div className="py-2" key={item.id}>
                  <label>
                    {variationList?.find((x) => x.id == item)?.name} Values
                  </label>
                  <Select
                    placeholder="Values "
                    onChange={(e) =>
                      handleValuesChange(
                        e,
                        variationList?.findIndex((y) => y.id == item)
                      )
                    }
                    data={
                      variationList[
                        variationList?.findIndex((y) => y.id == item)
                      ]["variation_values"]?.map((element) => ({
                        value: element.id,
                        label: element.name,
                      })) ?? []
                    }
                    searchable
                    clearable
                  />
                </div>
              ))}

              <div className="py-2">
                {selected_variation?.length > 0 && (
                  <a href="#" onClick={addValues}>
                    Add
                  </a>
                )}
              </div>
            </div>

            <div className="relative overflow-x-auto py-5 px-5">
              <Table>
                <thead>
                  <tr>
                    <th></th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                  </tr>
                </thead>
                {isValues && (
                  <tbody>
                    {product_values?.map((valu, index) => (
                      <tr key={index}>
                        <td>
                          <i
                            onClick={() => removeVariantProduct(index)}
                            className="text-red-800 font-bold px-2 cursor-pointer"
                          >
                            X
                          </i>
                        </td>
                        <td className="px-1 py-1">
                          <TextInput fz="sm" value={valu.name} disabled />
                        </td>

                        {/* <td className="px-1 py-1">
                                                    <TextInput
                                                        fz="sm"
                                                        defaultValue={valu.cost}
                                                        onChange={(e) =>
                                                            handleCostChange(
                                                                index,
                                                                e.currentTarget.value
                                                            )
                                                        }
                                                    />
                                                </td> */}
                      </tr>
                    ))}
                  </tbody>
                )}
              </Table>
            </div>
          </Card>
        )}

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button variant="outline" onClick={() => setOpened(true)} size="xs">
        Laundry Item
      </Button>
    </>
  );
}

export default NewLaundryItemModal;
