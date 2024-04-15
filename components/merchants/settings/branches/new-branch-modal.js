import { Button, Modal, Select, TextInput, Tooltip } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitBranch,
  fetchBranchesData,
  fetchCategoriesList,
  fetchBranchesList,
} from "../../../../store/merchants/settings/branches-slice";

import { fetchStaffList } from "../../../../store/merchants/partners/staffs-slice";
import store from "../../../../store/store";
import Link from "next/link";
import { IconPlus } from "@tabler/icons";
import NewStaffModal from "./new-staff-modal";

function NewBranchModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [location, setLocation] = useState();
  const [category_id, setCategoryId] = useState();
  const [staff_id, setStaffId] = useState();

  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  const categoriesList = useSelector((state) => state.branches.categoriesList);

  const staffsList = useSelector((state) => state.staffs.fetchStaffList);

  const params = {};
  params["accessToken"] = session?.user?.accessToken;

  console.log("The Array is " + staffsList);
  let options = staffsList?.data?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));

  let categoriesData =
    categoriesList?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  //   const isCarWashAc = isCarWash(session?.user);

  function clearForm() {
    setName("");
    setEmail("");
    setPhone("");
    setLocation(null);
    setCategoryId("");
    setStaffId("");
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = "All";
    store.dispatch(fetchCategoriesList(params));
    store.dispatch(fetchStaffList(params));

    if (dataStatus === "fulfilled") {
      store.dispatch(fetchBranchesData(params));
    }
  }, [dataStatus, session, status]);

  //   const carTypes =
  //     carFormData?.car_types?.map((item) => ({
  //       value: item.name,
  //       label: item.name,
  //     })) ?? [];

  //   const carMakes =
  //     carFormData?.car_makes?.map((item) => ({
  //       value: item.name,
  //       label: item.name,
  //     })) ?? [];

  //   const selectedCarMake = carFormData?.car_makes?.find(
  //     (item) => item.name === carMake
  //   );

  //   const carModels =
  //     selectedCarMake?.models?.map((item) => ({
  //       value: item.name,
  //       label: item.name,
  //     })) ?? [];

  const isSubmitting = useSelector(
    (state) => state.branches.submissionStatus == "loading"
  );

  const dispatch = useDispatch();
  const branch_id = useSelector((state) => state.branches.branch_id);

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["email"] = email;
    params["phone"] = phone;
    params["location"] = location;
    params["category_id"] = category_id;
    params["staff_id"] = staff_id;

    try {
      await dispatch(submitBranch(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "New Branch Successfully Created",
        message:
          "To Add or View Records About This Branch,Please Select The Branch Name From Top Left Of Your Screen",
        color: "green",
        autoClose: false,
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
        title="New Branch"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Branch Information
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
            placeholder="Staff"
            label="Assign Staff To Login To This Branch"
            value={staff_id}
            onChange={setStaffId}
            data={options}
            searchable
            clearable
          />
          <NewStaffModal />

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
        leftIcon={<IconUser size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        New
      </Button>
    </>
  );
}

export default NewBranchModal;
