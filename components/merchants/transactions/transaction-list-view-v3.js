import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { fetchTransactionList } from "@/store/merchants/transactions/transaction-list-slice";
import store from "@/store/store";

import TransactionReceiptSettingsModal from "../settings/transactions/transaction-receipt-settings-modal";
import TransactionPrinterDownloads from "../settings/transactions/transaction-printer-downloads";
import UploadTransactionsModal from "./upload-transactions-modal";
import BreadCrumbsHeaderDark from "@/components/ui/layouts/breadcrumbs-header-dark";
import MutedCrumbDark from "@/components/ui/actions/muted-crumb-dark";
import LinkCrumbDark from "@/components/ui/actions/link-crumb-dark";
import TransactionsTableDark from "./transactions-table-dark";
import Link from "next/link";
import { Button } from "@mantine/core";

function TransactionListViewV3() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  //entriesPerPage
  const [entriesPerPage, setEntriesPerPage] = useState(10);

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
    if (entriesPerPage) {
      params["entries"] = entriesPerPage;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (!startDate && !endDate) {
      store.dispatch(fetchTransactionList(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(fetchTransactionList(params));
  }, [
    startDate,
    endDate,
    branch_id,
    accessToken,
    status,
    entriesPerPage,
    searchTerm,
  ]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;
    if (entriesPerPage) {
      params["entries"] = entriesPerPage;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchTransactionList(params));
  }

  const filterWithBranch = useCallback((br_id) => {
    setBranch(br_id);
  }, []);

  const filterWithDates = useCallback((startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const filter = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  const entries = useCallback((entriesPerPage) => {
    setEntriesPerPage(entriesPerPage);
  }, []);

  const [showReceiptSettings, setShowReceiptSettings] = useState(false);
  const [showPrintingDownloads, setShowPrintingDownloads] = useState(false);

  const breadCrumbActions = <UploadTransactionsModal />;

  return (
    <>
      <BreadCrumbsHeaderDark title={"Transactions"} actions={breadCrumbActions}>
        <LinkCrumbDark title="Home" href="/" />
        <MutedCrumbDark title="Transactions" />
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
          entries={entries}
        />
      </div>

      <TransactionReceiptSettingsModal
        opened={showReceiptSettings}
        setOpened={setShowReceiptSettings}
      />

      <TransactionPrinterDownloads
        opened={showPrintingDownloads}
        setOpened={setShowPrintingDownloads}
      />
    </>
  );
}

export default TransactionListViewV3;
