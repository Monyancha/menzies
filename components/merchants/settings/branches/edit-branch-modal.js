import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import {
  submitEditBranch,
  fetchCategoriesList,
  fetchBranchesList,
  fetchBranchesData
} from "../../../../store/merchants/settings/branches-slice";

function EditBranch({ branch }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState(branch.name);
  const [email, setEmail] = useState(branch.email);
  const [phone, setPhone] = useState(branch.phone);
  const [location, setLocation] = useState(branch.location);
  const [category_id, setCategoryId] = useState(branch?.categories?.id);
  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    store.dispatch(fetchCategoriesList(params));
  }, [session, status]);

  const categoriesList = useSelector((state) => state.branches.categoriesList);

  let categoriesData =
    categoriesList?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];
  //   const platformCategoryData =
  //     platformCategories?.map((item) => ({
  //       value: item.id,
  //       label: item.name,
  //     })) ?? [];

  //   const selectedPlatformCategory = platformCategories?.find(
  //     (item) =>
  //       item.id === psCategoryId ||
  //       item.sub_categories?.find((subItem) => subItem.id == psSubcategoryId)
  //   );

  //   const platformSubcategoryData =
  //     selectedPlatformCategory?.sub_categories?.map((item) => ({
  //       value: item.id,
  //       label: item.name,
  //     })) ?? [];

  function clearForm() {
    setName("");
    setEmail("");
    setPhone("");
    setLocation(null);
    setCategoryId("");
  }

  const isSubmitting = useSelector(
    (state) => state.branches.EditSubmissionStatus == "loading"
  );

  const dispatch = useDispatch();
  async function submitDetails() {
    // if (!session || status !== "authenticated" || isSubmitting) {
    //   return;
    // }

    const params = {};

    params["accessToken"] = session.user.accessToken;
    params["id"] = branch?.id;
    params["name"] = name;
    params["email"] = email;
    params["phone"] = phone;
    params["location"] = location;
    params["category_id"] = category_id;

    try {
      await dispatch(submitEditBranch(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Record updated successfully",
        color: "green",
      });
      clearForm();
      setOpened(false);
      const pars = {};
      pars["accessToken"] = session.user.accessToken;
      pars["branch_id"] = "All";
      store.dispatch(fetchBranchesData(pars));
      store.dispatch(fetchBranchesList(pars));
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
        title={`Edit Branch #${branch?.name}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Edit Branch Information
          </span>
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Phone"
            label="Phone"
            type="telephone"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Location"
            label="Location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.currentTarget.value)}
          />

          <Select
            placeholder="Categories"
            label="Select Category"
            value={category_id}
            onChange={setCategoryId}
            data={categoriesData}
            searchable
            clearable
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
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

export default EditBranch;
