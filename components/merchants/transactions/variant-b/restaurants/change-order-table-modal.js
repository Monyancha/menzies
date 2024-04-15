import { Button, Modal, Select } from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { IconArrowBarToRight } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import store from "../../../../../store/store";
import { fetchTransactionTables } from "../../../../../store/merchants/transactions/transaction-slice";
import StatelessLoadingSpinner from "../../../../ui/utils/stateless-loading-spinner";
import { showNotification } from "@mantine/notifications";
import { updateOrderTable } from "../../../../../store/merchants/transactions/transaction-list-slice";
import { useRouter } from "next/router";

function ChangeOrderTableModal({ tableId, orderId }) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [opened, setOpened] = useState(false);
  const [selectedTable, setSelectedTable] = useState();
  const [isSubmitting, setIsSubmitting] = useState();

  const transactionTableList = useSelector(
    (state) => state.posTransaction.transactionTableList ?? []
  );

  const router = useRouter();

  const validTableList = transactionTableList?.filter(
    (item) => item.id != tableId
  );

  const tableList =
    validTableList?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const transactionTableStatus = useSelector(
    (state) => state.posTransaction.transactionTableStatus
  );
  const isLoading = transactionTableStatus === "loading";

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;

    if (transactionTableStatus === "idle") {
      store.dispatch(fetchTransactionTables(params));
    }
  }, [accessToken, status, transactionTableStatus]);

  async function submitDetails() {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {
      orderId,
      toTableId: selectedTable,
      accessToken,
    };

    try {
      setIsSubmitting(true);

      await store.dispatch(updateOrderTable(params)).unwrap();
      router.replace(`/merchants/transactions/tables/${selectedTable}`);

      setOpened("false");

      showNotification({
        title: "Success",
        message: "Table changed successfully",
        color: "green",
      });
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Change Table"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {isLoading && (
          <div className="flex justify-center ">
            <section className="space-y-2 px-3 rounded-lg">
              <StatelessLoadingSpinner />
            </section>
          </div>
        )}

        {!isLoading && (
          <section className="flex flex-col space-y-2 px-3 rounded-lg">
            <span className="text-sm font-bold">Tables</span>

            <Select
              placeholder="Table"
              label="Table"
              value={selectedTable}
              onChange={setSelectedTable}
              data={tableList}
              searchable
              clearable
            />
          </section>
        )}

        {!isLoading && (
          <section className="flex justify-end space-y-2 px-3 rounded-lg my-3">
            <Button
              onClick={submitDetails}
              loading={isSubmitting}
              disabled={!selectedTable}
            >
              Move
            </Button>
          </section>
        )}
      </Modal>
      <Button
        leftIcon={<IconArrowBarToRight size={14} />}
        variant="dark"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Change Table
      </Button>
    </>
  );
}

export default ChangeOrderTableModal;
