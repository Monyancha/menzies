import { Button, Modal,ActionIcon } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "@mantine/notifications";

export default function ApprovePayrollModal({ staff }) {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [opened, setOpened] = useState(false);

  const dispatch = useDispatch();

  async function deleteRecord() {
    if (!session || status !== "authenticated" || !status) {
      return;
    }
    const params = {};
    // params["accessToken"] = session.user.accessToken;
    // params["staffId"] = staff.id;

    try {
      setIsSubmitting(true);

    //   await dispatch(deleteStaff(params)).unwrap();

      setOpened(false);

      showNotification({
        title: "Success",
        message: "Payroll approved successfully",
        color: "green",
      });

    //   dispatch(fetchAllStaffIncome(params));
    } catch (e) {
      showNotification({
        title: "Warning",
        message: "Could not approved payroll",
        color: "orange",
      });
    } finally {
      setIsSubmitting(false);
    }

    return;
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Approve Staff?"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
           Are You Sure You Want To Approve This Payroll?
          </span>
        </section>

        <section className="flex justify-end space-x-2 items-center bg-light p-3 rounded-lg my-3">
          <Button onClick={() => setOpened(false)} variant="outline">
            No
          </Button>

          <Button onClick={deleteRecord} loading={isSubmitting} color="red">
            Yes
          </Button>
        </section>

      </Modal>
      <Button
        color="blue"
        onClick={() => setOpened(true)}
        size="sm"
      >
        APPROVE
      </Button>
    </>
  );
}
