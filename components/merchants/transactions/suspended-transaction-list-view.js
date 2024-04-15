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
import BreadCrumbsHeader from "../../ui/layouts/breadcrumbs-header";
import LinkCrumb from "../../ui/actions/link-crumb";
import MutedCrumb from "../../ui/actions/muted-crumb";
import { getRoomRequirements } from "@/store/merchants/inventory/inventory-slice";

function SuspendedTransactionListView({source}) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [searchTerm, setSearchTerm] = useState("");
  //setRoomId
  const [roomId, setRoomId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [suspended, setSuspended] = useState(true);

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
    params["suspended"] = true;
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
    if (source) {
      params["source"] = source;
    }
    //roomId
    if (roomId) {
      params["roomId"] = roomId;
    }
    store.dispatch(fetchTransactionList(params));
  }, [startDate, endDate, roomId, branch_id, accessToken, status, searchTerm, source]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;
    params["suspended"] = true;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (source) {
      params["source"] = source;
    }
    if (roomId) {
      params["roomId"] = roomId;
    }
    store.dispatch(fetchTransactionList(params));
  }
  const filterWithBranch = useCallback((branch_id, suspended) => {
    setBranch(branch_id);
    setSuspended(suspended);
  }, []);

  const filterWithDates = useCallback((startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const filter = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  //setRoomId
  const filterWithRoom = useCallback((roomId) => {
    setRoomId(roomId);
  }, []);

  //Process Requirements
  const requirements = useSelector((state) => state.inventory.getRoomRequirements);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getRoomRequirements(params));
  }, [session, status]);

  //Booking Types
  const bookingTypeList =
  requirements?.booking_types?.map((item) => ({
    value: `${item.id}`,
    label: item.name,
  })) ?? [];

  //Rooms
  const rooms =
  requirements?.rooms?.map((item) => ({
    value: `${item.id}`,
    label: item.name + " - " + item?.type,
  })) ?? [];

  //End Process Requirements

  const breadCrumbActions = (
    <div className="w-full md:w-6/12 pt-3 md:pt-0 flex justify-start md:justify-end">
      <LinkButton
        title="Back"
        href="/merchants/transactions"
        icon="fa-solid fa-angle-left"
        responsive={false}
      />
    </div>
  );

  return (
    <Fragment>
      <BreadCrumbsHeader title={source === "rooms" ? 'Room Orders' : 'Orders'} actions={breadCrumbActions}>
        <LinkCrumb title="Home" href="/" />
        <LinkCrumb title="Transactions" href="/merchants/transactions" />
        <MutedCrumb title={source === "rooms" ? 'Room Orders' : 'Orders'} />
      </BreadCrumbsHeader>

      <div className="w-full flex flex-wrap mt-2">
        <TransactionsTable
          transactions={transactions}
          rawTransactions={raw_transactions}
          onPaginationLinkClicked={onPaginationLinkClicked}
          isLoading={isLoadingList}
          filterWithRoom={filterWithRoom}
          filterWithDates={filterWithDates}
          filterWithBranch={filterWithBranch}
          filter={filter}
          source={source}
          rooms={rooms}
        />
      </div>
    </Fragment>
  );
}

export default SuspendedTransactionListView;
