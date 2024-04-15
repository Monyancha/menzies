import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../store/store";
import {
  getStorageCategories,
  submitMarketplaceCategory,
} from "../../../store/merchants/inventory/products-slice";

function InStoreCategoriesForm() {
  const { data: session, status } = useSession();
  const [psCategoryId, setPsCategoryId] = useState("");
  const [psSubcategoryId, setPsSubcategoryId] = useState("");

  const platformCategories = useSelector(
    (state) => state.products.getStorageCategories
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    // console.log(session.user.accessToken);

    store.dispatch(getStorageCategories(params));
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
    selectedPlatformCategory?.storage_sub_categories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  function clearForm() {
    setPsCategoryId(null);
    setPsSubcategoryId(null);
  }

  const isSubmitting = useSelector(
    (state) => state.categories.mcSubmissionStatus == "loading"
  );

  return (
    <>
      <div className="w-full flex flex-wrap mt-2 w-100">
        <div className="bg-white w-full rounded-xl px-6 py-4">
          <div className="font-bold">In-Store Settings</div>
          <div className=" w-full grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            <div className="">
              <div className="flex">
                <div className="grow">
                  <Select
                    placeholder="Category"
                    label="Category"
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
                    placeholder="Sub Category"
                    label="Sub Category"
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
            {/* <div className="form-control">
              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  model="show_on_marketplace"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Expires</span>
              </label>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default InStoreCategoriesForm;
