import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../store/store";
import { getInventoryCategories } from "../../../store/merchants/inventory/products-slice";
import InStoreCategoriesForm from "./instore-categories";

function CategoriesForm() {
  const { data: session, status } = useSession();
  const [psCategoryId, setPsCategoryId] = useState("");
  const [psSubcategoryId, setPsSubcategoryId] = useState("");

  const platformCategories = useSelector(
    (state) => state.products.getInventoryCategories
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getInventoryCategories(params));
  }, [session, status]);

  const platformCategoryData =
    platformCategories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const selectedPlatformCategory = platformCategories?.find(
    (item) => item.id === psCategoryId
  );

  const platformSubcategoryData =
    selectedPlatformCategory?.product_sub_categories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  return (
    <>
      <div className="w-full flex flex-wrap mt-2 w-100">
        <div className="bg-white w-full rounded-xl px-6 py-4">
          <div className="font-bold">Marketplace Settings</div>
          <div className=" w-full grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            <div className="">
              <div className="flex">
                <div className="grow">
                  <Select
                    placeholder="Product Category"
                    label="Product Category"
                    value={psCategoryId}
                    onChange={setPsCategoryId}
                    data={platformCategoryData}
                    searchable
                    clearable
                    size="md"
                  />
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex">
                <div className="grow">
                  <Select
                    placeholder="Product Sub Category"
                    label="Product Sub Category"
                    value={psSubcategoryId}
                    onChange={setPsSubcategoryId}
                    data={platformSubcategoryData}
                    searchable
                    clearable
                    size="md"
                  />
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  model="show_on_marketplace"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Show on marketplace</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <InStoreCategoriesForm />
    </>
  );
}

export default CategoriesForm;
