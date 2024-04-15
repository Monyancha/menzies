import { Button, Modal, Select, TextInput, Tooltip } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitDepartment,
  fetchDepartments
} from "../../../../store/merchants/settings/branches-slice";

import store from "../../../../store/store";
import Link from "next/link";
import { IconLocation } from "@tabler/icons";


function NewDepartmentModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState();


  const dataStatus = useSelector((state) => state.branches.submitDepartmentStatus);





  //   const isCarWashAc = isCarWash(session?.user);

  function clearForm() {
    setName("");

  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = "All";
    // store.dispatch(fetchDepartments(params));

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


    try {
      await dispatch(submitDepartment(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message:
          "New Department Succesffully Added",
        color: "green"
      });
      clearForm();
      setOpened(false);
      const pars = {};
      pars["accessToken"] = session.user.accessToken;
      pars["branch_id"] = "All";

      store.dispatch(fetchDepartments(pars));
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
        title="New Department"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Department Information
          </span>
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />







        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconLocation size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        New
      </Button>
    </>
  );
}

export default NewDepartmentModal;
