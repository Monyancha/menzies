import Link from "next/link";
import { Fragment, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { fetchTransactionList } from "../../../store/merchants/transactions/transaction-list-slice";
import store from "../../../store/store";
import { IconChevronLeft } from "@tabler/icons";
import { Button } from "@mantine/core";
import BreadCrumbsHeaderDark from "@/components/ui/layouts/breadcrumbs-header-dark";
import MutedCrumbDark from "@/components/ui/actions/muted-crumb-dark";
import LinkCrumbDark from "@/components/ui/actions/link-crumb-dark";
import TransactionsTableDark from "./transactions-table-dark";

export default function CreditedTransactionListViewV3() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [is_credited, setCredited] = useState(true);

  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );
  const transactionList = useSelector(
    (state) => state.transactions.transactionList
  );

  const branch_id = useSelector((state) => state.branches.branch_id);
  const [br_id, setBranch] = useState(branch_id);
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
    params["is_credited"] = true;
    if (!startDate && !endDate) {
      store.dispatch(fetchTransactionList(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

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
    params["is_credited"] = true;
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

    if (is_credited) {
      params["is_credited"] = true;
    }

    store.dispatch(fetchTransactionList(params));
  }

  const filterWithBranch = useCallback((branch_id, is_credited) => {
    setBranch(branch_id);
    setCredited(is_credited);
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
    <div className="flex gap-1">
      <Link href="/merchants/transactions/v3">
        <Button
          size="xs"
          variant="outline"
          leftIcon={<IconChevronLeft size={16} />}
        >
          Back
        </Button>
      </Link>
    </div>
  );

  return (
    <Fragment>
      <BreadCrumbsHeaderDark title="Credit Sales" actions={breadCrumbActions}>
        <LinkCrumbDark title="Home" href="/" />
        <LinkCrumbDark title="Transactions" href="/merchants/transactions/v3" />
        <MutedCrumbDark title="Credited" />
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
