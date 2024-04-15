import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import {
  fetchMarketplaceCategories,
  submitEditMarketplaceCategory,
} from "../../../../store/merchants/inventory/categories-slice";

function EditMarketplaceCategory({ category }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [psCategoryId, setPsCategoryId] = useState("");
  const [psSubcategoryId, setPsSubcategoryId] = useState(
    category?.ps_sub_category_id ?? ""
  );

  const platformCategories = useSelector(
    (state) => state.categories.platformCategoryList
  );

  const platformCategoryData =
    platformCategories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const selectedPlatformCategory = platformCategories?.find(
    (item) =>
      item.id === psCategoryId ||
      item.sub_categories?.find((subItem) => subItem.id == psSubcategoryId)
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
    (state) => state.categories.mcEditSubmissionStatus == "loading"
  );

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["id"] = category?.id;
    params["name"] = name;
    params["description"] = description;
    params["ps_category_id"] = psCategoryId;
    params["ps_sub_category_id"] = psSubcategoryId;

    try {
      await store.dispatch(submitEditMarketplaceCategory(params)).unwrap();

      store.dispatch(
        fetchMarketplaceCategories({ accessToken: session?.user?.accessToken })
      );

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
      clearForm();
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
        title={`Edit Category #${category?.id}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Marketplace Category Details
          </span>

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

          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <Textarea
            placeholder="Description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            UPDATE
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPencil size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Edit
      </Button>
    </>
  );
}

export default EditMarketplaceCategory;
