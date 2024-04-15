import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import {
  fetchStoreCategories,
  submitStoreCategory,
} from "@/store/merchants/inventory/categories-slice";
import { getStorageCategories } from "@/store/merchants/inventory/products-slice";

function NewStoreCategoryModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function clearForm() {
    setName("");
    setDescription("");
  }

  const isSubmitting = useSelector(
    (state) => state.categories.scSubmissionStatus == "loading"
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["description"] = description;
    params["branch_id"] = branch_id;

    try {
      await store.dispatch(submitStoreCategory(params)).unwrap();

      store.dispatch(
        fetchStoreCategories({
          accessToken: session?.user?.accessToken,
          branch_id: branch_id,
        })
      );

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
      setOpened(false);
      clearForm();
      store.dispatch(getStorageCategories(params));
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

export default NewStoreCategoryModal;
