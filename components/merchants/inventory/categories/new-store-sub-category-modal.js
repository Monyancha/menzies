import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import {
  fetchStoreSubCategories,
  submitStoreSubCategory,
} from "../../../../store/merchants/inventory/categories-slice";
import { useRouter } from "next/router";
import { getStorageCategories } from "@/store/merchants/inventory/products-slice";

function NewStoreSubCategoryModal(props) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const storeCategoryId =
    props?.categoryId ?? router?.query?.storeCategoryId ?? "";

  function clearForm() {
    setName("");
    setDescription("");
  }

  const isSubmitting = useSelector(
    (state) => state.categories.scSubSubmissionStatus == "loading"
  );

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["storeCategoryId"] = storeCategoryId;
    params["description"] = description;

    try {
      await store.dispatch(submitStoreSubCategory(params)).unwrap();

      store.dispatch(
        fetchStoreSubCategories({
          accessToken: session?.user?.accessToken,
          storeCategoryId,
        })
      );

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
      setOpened(false);
      clearForm();
      //Refresh the Categories
      const params2 = {};
      params2["accessToken"] = session.user.accessToken;
      store.dispatch(getStorageCategories(params2));
      
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
        title="New Store Sub Category"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Sub Category Details
          </span>

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
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        New
      </Button>
    </>
  );
}

export default NewStoreSubCategoryModal;
