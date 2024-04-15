import { useState } from "react";
import { Modal, Button, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { removeAllowance,fetchStaffAllowances } from "../../../../src/store/partners/staff-slice";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";

function RemoveAllowanceModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const dispatch = useDispatch();

  const isDeleting = useSelector(
    (state) => state.branches.removeAllowanceStatus === "loading"
  );

  async function submitDetails() {
    if (!session || status !== "authenticated" || isDeleting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["allowanceId"] = item.id;
    params["staffId"] = item.staff_id;


    try {
      dispatch(removeAllowance(params));

      showNotification({
        title: "Success",
        message: "Record deleted successfully",
        color: "green",
      });

      setOpened(false);
      dispatch(fetchStaffAllowances(params));
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not deleted record";
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
        title="Delete Record?"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <span className="px-2">This operation is irreversible</span>
        <section className="flex justify-end p-2 rounded-lg my-3 gap-2">
          <Button variant="default" onClick={() => setOpened(false)}>
            Back
          </Button>

          <Button color="red" onClick={submitDetails} loading={isDeleting}>
            Delete
          </Button>
        </section>
      </Modal>

      <ActionIcon
        variant="outline"
        color="red"
        onClick={() => setOpened(true)}
        size="lg"
      >
        <IconTrash size={14} />
      </ActionIcon>
    </>
  );
}

export default RemoveAllowanceModal;
