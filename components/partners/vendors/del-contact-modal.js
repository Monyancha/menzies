import { Button, Modal } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import {
  deleteContact,
  fetchContacts,
} from "../../../src/store/merchants/inventory/inventory-slice";
import { useRouter } from "next/router";

export default function DeleteContactModal({ record, opened, setOpened }) {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const vendorId = router?.query?.vendorId ?? "";

  const branch_id = useSelector((state) => state.branches.branch_id);

  const dispatch = useDispatch();

  async function deleteRecord() {
    if (!session || status !== "authenticated" || !status) {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["vendorId"] = vendorId;
    params["contactId"] = record.id;

    try {
      setIsSubmitting(true);

      await dispatch(deleteContact(params)).unwrap();

      setOpened(false);

      showNotification({
        title: "Success",
        message: "Deleted record successfully",
        color: "green",
      });

      dispatch(fetchContacts(params));
    } catch (e) {
      showNotification({
        title: "Warning",
        message: "Could not delete record",
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
        title="Delete Record?"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Delete {record?.name ?? "record"}? This operation is irreversible
          </span>
        </section>

        <section className="flex justify-end space-x-2 items-center bg-light p-3 rounded-lg my-3">
          <Button onClick={() => setOpened(false)} variant="outline">
            Back
          </Button>

          <Button onClick={deleteRecord} loading={isSubmitting} color="red">
            Delete
          </Button>
        </section>
      </Modal>
    </>
  );
}
