import {
  fetchTransactionTables,
  setTable,
  showViewPos,
} from "@/store/merchants/transactions/transaction-slice";
import store from "@/store/store";
import { useSelector } from "react-redux";
import { useContext, useEffect, useMemo } from "react";
import { Button, Card, Text, Badge } from "@mantine/core";
import MerchantUiContext from "@/store/shared/merchant-ui";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import Link from "next/link";

function TablesView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const uiCtx = useContext(MerchantUiContext);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const transactionTableList = useSelector(
    (state) => state.posTransaction.transactionTableList ?? []
  );

  const transactionTableStatus = useSelector(
    (state) => state.posTransaction.transactionTableStatus
  );

  const tableId = useSelector((state) => state.posTransaction.table_id);

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(fetchTransactionTables(params));
  }, [branch_id, accessToken, status]);

  function selectTable(table_id) {
    if (table_id !== tableId) {
      store.dispatch(setTable({ table_id }));
    }

    store.dispatch(showViewPos());
    uiCtx.pos.actions.showItemCards();

    const selectedTable = transactionTableList.find(
      (table) => table.id === table_id
    );

    showNotification({
      title: "Selected Table",
      message: `${selectedTable.name}`,
      color: "blue",
    });
  }

  return (
    <main className="w-full px-4 py-2 pt-6 mt-32 md:mt-16">
      <div className="mb-4">
        <div className="flex justify-between items-end mb-3">
          <h1 className="text-xl">Tables</h1>
          <button
            className="btn btn-sm btn-primary btn-outline gap-2"
            onClick={() => store.dispatch(showViewPos())}
          >
            <i className="fa-solid fa-angle-left"></i>
            Back
          </button>
        </div>

        <div className="flex w-full justify-center">
          {transactionTableStatus === "loading" && <StatelessLoadingSpinner />}
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {transactionTableList.map((item) => (
            <Card key={item.id}>
              <div className="flex justify-between items-center">
                <Text size="md" color={item.id === tableId ? "green" : "black"}>
                  {item.name}
                </Text>

                {item.restaurant_transactions_count ? (
                  <Badge color="green" variant="light">
                    Orders: {item.restaurant_transactions_count ?? "0"}
                  </Badge>
                ) : (
                  ""
                )}
              </div>

              <div className="flex flex-col space-y-2 mt-2">
                <Button
                  variant="light"
                  color={item.id === tableId ? "green" : "blue"}
                  radius="md"
                  mt="md"
                  onClick={() => selectTable(item.id)}
                  fullWidth
                >
                  {item.id === tableId ? "Selected" : "Select"}
                </Button>

                <Link href={`/merchants/transactions/tables/${item.id}`}>
                  <Button
                    variant="subtle"
                    color="blue"
                    mt="md"
                    radius="md"
                    // onClick={() => selectTable(item.id)}
                    fullWidth
                  >
                    View
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

export default TablesView;
