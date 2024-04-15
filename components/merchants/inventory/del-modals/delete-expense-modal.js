import { useState } from "react";
import { Modal, Button, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { useSession } from "next-auth/react";
import {
   deleteExpense,
   fetchExistingExpenses
 } from "@/store/merchants/inventory/products-slice";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";

function DeleteExpenseModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const dispatch = useDispatch();

  const isDeleting = useSelector(
    (state) => state.branches.deleteBranchStatus === "loading"
  );

  const product = useSelector(
    (state) => state.products.existingProduct
  );

  async function submitDetails() {
    if (!session || status !== "authenticated" || isDeleting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["itemId"] = item.id;
    params["productId"] = product?.id;


    try {
      dispatch(deleteExpense(params));

      

      showNotification({
        title: "Success",
        message: "Record deleted successfully",
        color: "green",
      });

      setOpened(false);
      dispatch(fetchExistingExpenses(params));
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
        <span className="px-2">Are Sure You Want To Remove This Expense From This List? This operation is irreversible </span>
        <section className="flex justify-end p-2 rounded-lg my-3 gap-2">
          <Button variant="default" onClick={() => setOpened(false)}>
            NO
          </Button>

          <Button color="red" onClick={submitDetails} loading={isDeleting}>
            YES
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

export default DeleteExpenseModal;
