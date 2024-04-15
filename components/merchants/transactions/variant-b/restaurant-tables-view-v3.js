import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { fetchTransactionTableList } from "../../../../store/merchants/transactions/transaction-list-slice";
import { Button, Card, Text, Badge } from "@mantine/core";
import Link from "next/link";

function RestaurantTablesListViewV3() {
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
    <div className="flex flex-col space-y-2 w-full mt-3 mb-8 p-3">
      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-v3-darkest rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <section className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {transactionTableList.map((item) => (
            <Link
              href={`/merchants/transactions/tables/${item.id}`}
              key={item?.id}
            >
              <div
                className="w-full bg-v3-darkest rounded-lg p-3 flex flex-col space-y-3 pt-20 pb-20"
                key={item.id}
              >
                <span className="text-center text-md">
                  <strong>{item.name ?? "-"}</strong>
                </span>
                <span className="text-center text-xl mt-5">
                  <strong>
                    <h1>{item.restaurant_transactions_count ?? "0"}</h1>
                  </strong>
                </span>
              </div>
            </Link>
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

export default RestaurantTablesListViewV3;
