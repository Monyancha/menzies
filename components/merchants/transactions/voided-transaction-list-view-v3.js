import Link from "next/link";
import { Fragment, useCallback, useState } from "react";
import TopHr from "../../ui/layouts/top-hr";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import LinkButton from "../../ui/actions/link-button";
import TransactionsTable from "./transactions-table";
import { fetchTransactionList } from "../../../store/merchants/transactions/transaction-list-slice";
import store from "../../../store/store";
import BreadCrumbsHeaderDark from "@/components/ui/layouts/breadcrumbs-header-dark";
import MutedCrumbDark from "@/components/ui/actions/muted-crumb-dark";
import LinkCrumbDark from "@/components/ui/actions/link-crumb-dark";
import TransactionsTableDark from "./transactions-table-dark";

export default function VoidedTransactionListViewV3() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [voided, setVoided] = useState(true);

  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );
  const branch_id = useSelector((state) => state.branches.branch_id);
  const [br_id, setBranch] = useState(branch_id);
  const transactionList = useSelector(
    (state) => state.transactions.transactionList
  );
  const isLoadingList = transactionListStatus === "loading";

  const transactions = transactionList?.data;
  const raw_transactions = transactionList;

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    params["voided"] = true;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchTransactionList(params));
  }, [startDate, endDate, branch_id, accessToken, status, searchTerm]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["page"] = page;
    params["voided"] = true;
    params["branch_id"] = branch_id;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchTransactionList(params));
  }

  const filterWithBranch = useCallback((branch_id, voided) => {
    setBranch(branch_id);
    setVoided(voided);
  }, []);

  const filterWithDates = useCallback((startDate, endDate, branch_id) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setBranch(branch_id);
  }, []);

  const filter = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  const breadCrumbActions = (
    <div className="w-full md:w-6/12 pt-3 md:pt-0 flex justify-start md:justify-end">
      <LinkButton
        title="Back"
        href="/merchants/transactions/v3"
        icon="fa-solid fa-angle-left"
        responsive={false}
      />
    </div>
  );

  return (
    <Fragment>
      <BreadCrumbsHeaderDark title="Voided" actions={breadCrumbActions}>
        <LinkCrumbDark title="Home" href="/" />
        <LinkCrumbDark title="Transactions" href="/merchants/transactions/v3" />
        <MutedCrumbDark title="Voided" />
      </BreadCrumbsHeaderDark>

      <div className="w-full flex flex-wrap mt-2 px-3">
        <TransactionsTableDark
          transactions={transactions}
          rawTransactions={raw_transactions}
          onPaginationLinkClicked={onPaginationLinkClicked}
          isLoading={isLoadingList}
          filterWithDates={filterWithDates}
          filterWithBranch={filterWithBranch}
          filter={filter}
        />
      </div>
    </Fragment>
  );
}
