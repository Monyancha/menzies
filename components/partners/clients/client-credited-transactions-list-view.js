import { Fragment, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchTransactionList } from "../../../../store/merchants/transactions/transaction-list-slice";
import store from "../../../../store/store";
import TransactionsTable from "../../transactions/transactions-table";
import { useRouter } from "next/router";
import TransactionsTableDark from "../../transactions/transactions-table-dark";

function ClientCreditedTransactionsListView({ clientId }) {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );
  const transactionList = useSelector(
    (state) => state.transactions.transactionList
  );
  const isLoadingList = transactionListStatus === "loading";

  const branch_id = useSelector((state) => state.branches.branch_id);

  const [br_id, setBranch] = useState(branch_id);

  const transactions = transactionList?.data;
  const raw_transactions = transactionList;

  useEffect(() => {
    if (
      !router.isReady ||
      !clientId ||
      !session ||
      status !== "authenticated"
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["clientId"] = clientId;
    params["is_credited"] = true;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchTransactionList(params));
  }, [startDate, endDate, session, status, clientId, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["clientId"] = clientId;
    params["is_credited"] = true;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchTransactionList(params));
  }

  const filterWithBranch = useCallback((branch_id) => {
    setBranch(branch_id);
  }, []);

  const filterWithDates = useCallback((startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const filter = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  return (
    <Fragment>
      <div className="w-full flex flex-wrap">
        <TransactionsTableDark
          transactions={transactions}
          rawTransactions={raw_transactions}
          onPaginationLinkClicked={onPaginationLinkClicked}
          isLoading={isLoadingList}
          filterWithDates={filterWithDates}
          filterWithBranch={filterWithBranch}
          hideActions={true}
          filter={filter}
        />
      </div>
    </Fragment>
  );
}

export default ClientCreditedTransactionsListView;
