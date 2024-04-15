import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import {
  fetchMarketplaceCategories,
  fetchPlatformCategories,
  submitMarketplaceCategory,
} from "@/store/merchants/inventory/categories-slice";
import { useEffect } from "react";
import { getInventoryCategories } from "@/store/merchants/inventory/products-slice";

function NewMarketplaceCategoryModal({
  isLean = false,
  onSuccess = (categoryId) => {},
} = {}) {
  const { data: session, status } = useSession();

  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [psCategoryId, setPsCategoryId] = useState("");
  const [psSubcategoryId, setPsSubcategoryId] = useState("");

  const platformCategoriesLoading = useSelector(
    (state) => state.categories.platformCategoryStatus === "loading"
  );

  const platformCategories = useSelector(
    (state) => state.categories.platformCategoryList
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(fetchPlatformCategories(params));
  }, [session, status, branch_id]);

  const platformCategoryData =
    platformCategories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const selectedPlatformCategory = platformCategories?.find(
    (item) => item.id === psCategoryId
  );

  const platformSubcategoryData =
    selectedPlatformCategory?.sub_categories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  function clearForm() {
    setName("");
    setDescription("");
    setPsCategoryId(null);
    setPsSubcategoryId(null);
  }

  const isSubmitting = useSelector(
    (state) => state.categories.mcSubmissionStatus == "loading"
  );

  const categoriesLoading = useSelector(
    (state) => state.categories.marketplaceCategoryStatus === "loading"
  );

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["description"] = description;
    params["ps_category_id"] = psCategoryId;
    params["ps_sub_category_id"] = psSubcategoryId;
    params["branch_id"] = branch_id;

    try {
      const submitResult = await store
        .dispatch(submitMarketplaceCategory(params))
        .unwrap();

      onSuccess(submitResult?.id);

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
      clearForm();
      setOpened(false);
      const params2 = {};
      params2["accessToken"] = session.user.accessToken;
      params2["branch_id"]  = branch_id;
      store.dispatch(getInventoryCategories(params2));
      store.dispatch(fetchMarketplaceCategories(params2));
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
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="New Category"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">Category Details</span>

          {!isLean && (
            <>
              <Select
                placeholder="Platform Category"
                label="Platform Category"
                value={psCategoryId}
                onChange={setPsCategoryId}
                data={platformCategoryData}
                searchable
                clearable
              />

              <Select
                placeholder="Platform Sub Category"
                label="Platform Sub Category"
                value={psSubcategoryId}
                onChange={setPsSubcategoryId}
                data={platformSubcategoryData}
                searchable
                clearable
              />
            </>
          )}

          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          {!isLean && (
            <>
              <Textarea
                placeholder="Description"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
              />
            </>
          )}
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button
            onClick={submitDetails}
            loading={isSubmitting || platformCategoriesLoading}
          >
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        loading={categoriesLoading}
        size="xs"
      >
        New
      </Button>
    </>
  );
}

export default NewMarketplaceCategoryModal;
