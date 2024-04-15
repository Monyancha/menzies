import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../src/store/Store";
import { createStaffAllowance } from "../../../../src/store/partners/staff-slice";


function EditAllowance({ allowance }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState(allowance?.name);
  const [amount, setAmount] = useState(allowance?.amount);
  const [selected_staff, setStaffId] = useState(allowance?.staff_id);

  function clearForm() {
    setName("");
    setAmount("");
    setStaffId("");
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
    params["id"] = allowance?.id;
    params["name"] = name;
    params["amount"] = amount;
    params["staff_id"] = allowance?.staff_id;

    try {
      await dispatch(createStaffAllowance(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Record updated successfully",
        color: "green",
      });
    //   clearForm();
      setOpened(false);
      const pars = {};
      pars["accessToken"] = session.user.accessToken;
      pars["staffId"] = allowance?.staff_id;
      store.dispatch(fetchStaffAllowances(pars));
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
        title={`Edit Allowance #${allowance?.name}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Edit Allowance Information
          </span>
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Amount"
            label="Amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
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

export default EditAllowance;
