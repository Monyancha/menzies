import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { fetchTransactionTableList } from "../../../../store/merchants/transactions/transaction-list-slice";
import { Button, Card, Text, Badge } from "@mantine/core";
import Link from "next/link";
import CardDark from "@/components/ui/layouts/card-dark";
import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";

function RestaurantTablesListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const rawData = useSelector(
    (state) => state?.transactions?.transactionTableList
  );
  const transactionTableList = useSelector(
    (state) => state?.transactions?.transactionTableList?.data ?? []
  );
  const transactionTableListStatus = useSelector(
    (state) => state?.transactions?.transactionTableStatus
  );
  const isLoading = transactionTableListStatus === "loading";

  const branch_id = useSelector((state) => state?.branches?.branch_id);

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(fetchTransactionTableList(params));
  }, [branch_id, accessToken, status]);

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["page"] = page;
    params["branch_id"] = branch_id;

    store.dispatch(fetchTransactionTableList(params));
  }

  return (
    <div className="flex flex-col space-y-2 w-full mb-8">
      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-base-300 rounded-lg">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      {!isLoading && (
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {transactionTableList.map((item) => (
            <CardDark key={item.id}>
              <div className="flex justify-between items-center">
                <span className="text-base-content text-sm">{item.name}</span>

                {item.restaurant_transactions_count ? (
                  <Badge color="green" variant="filled">
                    Orders: {item.restaurant_transactions_count ?? "0"}
                  </Badge>
                ) : (
                  ""
                )}
              </div>

              <Link href={`/merchants/transactions/tables/${item.id}`}>
                <Button
                  variant="light"
                  color="blue"
                  mt="md"
                  // onClick={() => selectTable(item.id)}
                  fullWidth
                >
                  View
                </Button>
              </Link>
            </CardDark>
          ))}
        </section>
      )}

      <PaginationLinks
        paginatedData={rawData}
        onLinkClicked={onPaginationLinkClicked}
      />
    </div>
  );
}

export default RestaurantTablesListView;
