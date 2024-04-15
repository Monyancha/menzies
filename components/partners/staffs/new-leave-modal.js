import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitNewLeave,fetchLeaveList } from "../../../src/store/merchants/hr/hr-slice";
import store from "../../../src/store/Store";
import Link from "next/link";

function NewLeaveModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState();
  

  const dataStatus = useSelector((state) => state.units.allowanceSubmissionStatus);

  

  const staffsList = useSelector((state) => state.staffs.fetchStaffList);

  const params = {};
  params["accessToken"] = session?.user?.accessToken;

  console.log("The Array is " + staffsList);
  let options = staffsList?.data?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));
  
  //   const isCarWashAc = isCarWash(session?.user);

  function clearForm() {
    setName("");
  }

 
 
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
      await dispatch(submitNewLeave(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "Success",
        message: "New Leave Successfully Created",
        color: "green",
      });
      clearForm();
      setOpened(false);
      const pars = {};
      pars["accessToken"] = session.user.accessToken;
      pars["branch_id"] = "All";
      store.dispatch(fetchLeaveList(pars));
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
        title="New Leave Type"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
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
        variant="outline"
        onClick={() => setOpened(true)}
        className="space-x-2"
        size="xs"
      >
        Add New
      </Button>
    </>
  );
}

export default NewLeaveModal;
