import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../src/store/Store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
  TSearchFilter,
  TDateTimeFilter,
} from "../../../../components/ui/layouts/scrolling-table";
import { Fragment, useContext, useEffect, useState } from "react";
import InfoAlert from "../../../../components/ui/display/info-alert";
import TransactionListContext from "../../../../src/store/merchants/transactions/transaction-list-context";
import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "../../../../lib/shared/data-formatters";
import { isMerchant, isRestaurant } from "../../../../lib/shared/roles_and_permissions";
import { Menu, Button, Text, Select, MultiSelect, Switch } from "@mantine/core";
import {
  IconPrinter,
  IconChevronDown,
  IconEdit,
  IconX,
  IconToolsKitchen2,
  IconGlassFull,
  IconListDetails,
  IconLayout2,
  IconFileDownload,
  IconFileAnalytics,
} from "@tabler/icons-react";
import { printRemotePdf } from "../../../../lib/shared/printing-helpers";
import TransactionDetailModal from "../../transactions/transaction-detail-modal";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { showNotification } from "@mantine/notifications";

//mo
import { useCallback } from "react";
import { useMemo } from "react";
import { fetchTransactionList } from "../../../../src/store/merchants/transactions/transaction-list-slice";
import CursorPaginationLinks from "../../../ui/layouts/cursor-pagination-links";

function SalesReportData() {
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [checked, setChecked] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
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
  const rawTransactions = transactionList;

  const all_total =
    transactions?.reduce((sum, y) => sum + parseValidFloat(y?.total_paid), 0) ??
    0;
  const all_discount =
    transactions?.reduce((sum, y) => sum + parseValidFloat(y?.discount), 0) ??
    0;

  const all_titem_discount =
    transactions?.reduce(
      (sum, y) => sum + parseValidFloat(y?.titems_sum_discount),
      0
    ) ?? 0;

  const total_mpesa =
    transactions
      ?.filter((item) => item?.transaction_payments[0]?.type === "mpesa")
      ?.reduce((sum, y) => sum + parseValidFloat(y?.total_paid), 0) ?? 0;
  const total_cash =
    transactions
      ?.filter((item) => item?.transaction_payments[0]?.type === "cash")
      ?.reduce((sum, y) => sum + parseValidFloat(y?.total_paid), 0) ?? 0;

  const total_card =
    transactions
      ?.filter((item) => item?.transaction_payments[0]?.type === "card")
      ?.reduce((sum, y) => sum + parseValidFloat(y?.total_paid), 0) ?? 0;

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    console.log(type);

    if (type) {
      params["payment_type"] = type;
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

    if (startDateTime) {
      params["startDateTime"] = startDateTime;
      console.log("Start Date Time Is " + startDateTime);
    }

    if (endDateTime) {
      params["endDateTime"] = endDateTime;
      console.log("Start Date Time Is " + startDateTime);
    }
    if (entriesPerPage) {
      params["entries"] = entriesPerPage;
    }


    store.dispatch(fetchTransactionList(params));
  }, [
    startDate,
    endDate,
    branch_id,
    accessToken,
    status,
    searchTerm,
    type,
    endDateTime,
    startDateTime,
    entriesPerPage
  ]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (startDateTime) {
      params["startDateTime"] = startDateTime;
    }
    if (endDateTime) {
      params["endDateTime"] = endDateTime;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    if (entriesPerPage) {
      params["entries"] = entriesPerPage;
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

  const [showReceiptSettings, setShowReceiptSettings] = useState(false);
  const [showPrintingDownloads, setShowPrintingDownloads] = useState(false);

  function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
  }

  const [selectedTransactionId, setSelectedTransactionId] = useState(undefined);
  const [password, setPassword] = useState("");

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const transactionsListCtx = useContext(TransactionListContext);

  const isMerchantAc = isMerchant(session?.user);
  const isRestaurantAc = isRestaurant(session?.user);

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [shownTransaction, setShownTransaction] = useState(null);


  function voidTransaction() {
    if (!selectedTransactionId || !password) {
      return;
    }

    transactionsListCtx.actions.void(selectedTransactionId, password);

    setSelectedTransactionId(undefined);
    setPassword("");
  }

  useEffect(() => {
    filterWithDates(startDate, endDate);
    filter(searchTerm);
  }, [startDate, endDate, filterWithDates, filter, searchTerm]);

  useEffect(() => {
    filterWithBranch(branch_id);
  }, [branch_id, filterWithBranch]);

  const exportExcel = async () => {
    setIsLoadingExcel(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/sales-reports/export-excel?start_date=${startDate}&end_date=${endDate}&payment_type=${type}&filter=${searchTerm}&start_date_time=${startDateTime}&end_date_time=${endDateTime}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(endpoint, options);
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = "Sale Report.xlsx";
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
    setIsLoadingExcel(false);
  };

  const showDateTime = (e) => {
    setStartDate("");
    setEndDate("");
    setChecked(e)
    if(!e)
    {
      setStartDate(getDateFilterFrom);
      setEndDate(getDateFilterTo);

    }

  }

  const exportPdf = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/sales-reports/export-pdf?start_date=${startDate}&end_date=${endDate}&payment_type=${type}&filter=${searchTerm}&start_date_time=${startDateTime}&end_date_time=${endDateTime}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(endpoint, options);
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = "Sale Report.xlsx";
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
    setIsLoadingExcel(false);
  };
  const paymentTypes = [
    { value: "glovo", label: "Glovo" },
    { value: "jumia", label: "Jumia Food" },
    { value: "bolt", label: "Bolt Food" },
    { value: "uber", label: "Uber Eats" },
    { value: "complimentary", label: "Complimentary" },
    { value: "cash", label: "cash" },
    { value: "mpesa", label: "mpesa" },
    { value: "card", label: "card" },
    { value: "membership", label: "membership" },
  ];

  const actions = (
    <>
      {/* { !isRestaurantAc &&
       ( */}

      {/* )
      } */}
      {/* */}
      {/* <ActionIconButton
        icon="fa-solid fa-download"
        isLoading={isLoadingExcel}
        tooltip="Excel"
        clickHandler={exportExcel}
      /> */}

      <div>
        <Button
          className="mr-2"
          leftIcon={<IconFileDownload size={16} />}
          variant="outline"
          // loading={isReceiptLoading}
          onClick={exportPdf}
        >
          Export PDF
        </Button>

        <Button
          className="mr-2"
          leftIcon={<IconFileAnalytics size={16} />}
          variant="outline"
          isLoading={isLoadingExcel}
          onClick={exportExcel}
        >
          Export Excel
        </Button>
      </div>

      {/* <LinkIconButton
        icon="fa-solid fa-money-bill"
        href="/merchants/transactions/credited"
        tooltip="Credited"
      />

      <LinkIconButton
        icon="fa-solid fa-arrow-down"
        href="/merchants/transactions/suspended"
        tooltip="Orders"
      />

      <LinkIconButton
        icon="fa-solid fa-sitemap"
        href="/merchants/transactions/tables"
        tooltip="Tables"
      />

      <LinkIconButton
        icon="fa-solid fa-ban"
        href="/merchants/transactions/voided"
        tooltip="Voided"
      />

      <LinkIconButton
        icon="fa-solid fa-plus"
        href="/merchants/transactions/new"
        tooltip="POS"
      /> */}
    </>
  );

  return (
    <Card>
      <TableCardHeader>
        <Switch
          label="Show Date and Time"
          checked={checked}
          onChange={(event) => showDateTime(event.currentTarget.checked)}
          size="md"
        />
      </TableCardHeader>
      <TableCardHeader actions={actions}>
        {checked ? (
          <TDateTimeFilter
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            onChangeStartDateTime={setStartDateTime}
            onChangeEndDateTime={setEndDateTime}
          />
        ) : (
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        )}

        <TSearchFilter onChangeSearchTerm={setSearchTerm} />

        <MultiSelect
          placeholder="Payment Type"
          label="Payment Type"
          value={type}
          onChange={setType}
          data={paymentTypes}
          searchable
          clearable
        />
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>

            <th scope="col" className="th-primary">
              ITEM(s)
            </th>

            <th scope="col" className="th-primary text-right">
              COST
            </th>

            {/* <th scope="col" className="th-primary text-right">
              DISCOUNT
            </th> */}

            <th scope="col" className="th-primary text-right">
              PAID
            </th>

            <th scope="col" className="th-primary">
              METHOD(S)
            </th>

            {/* <th scope="col" className="th-primary">
              STAFF
            </th> */}

            <th scope="col" className="th-primary">
              {isRestaurantAc && "TABLE/"}
              CLIENT
            </th>

            <th scope="col" className="th-primary text-right">
              DATE
            </th>

            {/* <th scope="col" className="th-primary text-right">
              ACTIONS
            </th> */}
          </tr>
        </Thead>
        <tbody>
          {transactions &&
            transactions.map((item) => (
              <Trow key={item.id}>
                <Fragment>
                  <td>{item?.bill_no}</td>
                  <td>
                    <span>
                      {item.titems[0]?.sellable?.sellable?.name?.substr(
                        0,
                        30
                      ) ?? ""}
                      ...
                    </span>
                    <span className="text-xs">
                      ({item.titems?.length ?? 0})
                    </span>
                  </td>
                  <td className="text-right">
                    {formatNumber(
                      parseValidFloat(
                        parseFloat(item.cost) +
                          parseFloat(item?.titems_sum_discount ?? 0)
                      )
                    )}
                  </td>
                  {/* <td className="text-right">
                    {formatNumber(
                      parseValidFloat(item?.discount) +
                        parseValidFloat(item?.titems_sum_discount ?? 0)
                    )}
                  </td> */}
                  <td className="text-right">
                    {(item?.total_paid ?? 0) !== 0
                      ? item.transaction_payments[0]?.type === "complimentary"
                        ? 0
                        : item?.total_paid
                      : item.transaction_payments[0]?.type === "complimentary"
                      ? 0
                      : item?.total ?? 0}
                  </td>
                  <td>
                    {item.transaction_payments[0]?.type ??
                      item?.payment_method ??
                      "-"}
                    {item.transaction_payments?.length > 1 ? " +" : ""}
                  </td>
                  {/* <td>
                    {item?.titems[0]?.staff_income ? (
                      <>
                        <span>
                          {item?.titems[0]?.staff_income[0]?.staff?.name ?? ""}
                        </span>

                        <span className="text-xs">
                          {(item.titems?.length ?? 0) > 1 ? "(+)" : ""}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td> */}

                  <td>
                    <span>{item.client?.name ?? ""}</span>
                  </td>
                  <td className="text-right">{formatDate(item.date)}</td>

                  {/* <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        variant="outline"
                      >
                        <Menu.Target>
                          <Button variant="outline" rightIcon={<IconChevronDown size={14} />}>
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>#{item.id}</Menu.Label>
                          {!item.is_void && (
                            <Fragment>
                              <Menu.Item
                                icon={<IconPrinter size={15} />}
                                onClick={() =>
                                  printRemotePdf(item.receipt_address)
                                }
                              >
                                Print
                              </Menu.Item>

                              <div className="inline md:hidden ">
                                <Link href={item.receipt_address}>
                                 
                                    <Menu.Item icon={<IconPrinter size={15} />}>
                                      Legacy Print
                                    </Menu.Item>
                                 
                                </Link>
                              </div>
                             
                                <>
                                  <Menu.Item
                                    icon={
                                      <IconListDetails size={15} color="lime" />
                                    }
                                    onClick={() => {
                                      setShowTransactionDetails(true);
                                      setShownTransaction(item);
                                    }}
                                  >
                                    <Text color="lime">Summary</Text>
                                  </Menu.Item>

                                  <Link
                                    href={`/transactions/view/${item.id}`}
                                  >
                                    <Menu.Item
                                      icon={
                                        <IconLayout2 size={15} color="purple" />
                                      }
                                    >
                                      <Text color="purple">Detailed View</Text>
                                    </Menu.Item>
                                  </Link>
                                </>
                            
                              
                                <a
                                  href="#my-modal-2"
                                  onClick={() =>
                                    setSelectedTransactionId(item.id)
                                  }
                                >
                                  <Menu.Item
                                    icon={<IconX size={15} color="red" />}
                                  >
                                    <Text color="red">Void</Text>
                                  </Menu.Item>
                                </a>
                              
                            </Fragment>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </span>
                  </td> */}
                </Fragment>
              </Trow>
            ))}

         
            <>
              <Trow>
                <td className="text-lg text-dark font-bold" colSpan={1}>
                  Grand Total
                </td>
                <td className="text-lg text-dark text-right">
                  {type === "complimentary"
                    ? 0
                    : formatNumber(
                       rawTransactions?.all_total ?? 0
                      )}
                </td>
              </Trow>

              {/* <Trow>
                <td className="text-lg text-dark font-bold" colSpan={4}>
                  MPESA
                </td>
                <td className="text-lg text-dark text-right">
                  {type === "complimentary"
                    ? 0
                    : formatNumber(rawTransactions?.mpesa_payments ?? 0)}
                </td>
              </Trow> */}

              {/* <Trow>
                <td className="text-lg text-dark font-bold" colSpan={4}>
                  CASH
                </td>
                <td className="text-lg text-dark text-right">
                  {type === "complimentary" ? 0 : formatNumber(rawTransactions?.cash_payments ?? 0)}
                </td>
              </Trow> */}
{/*
              <Trow>
                <td className="text-lg text-dark font-bold" colSpan={4}>
                  CARD
                </td>
                <td className="text-lg text-dark text-right">
                  {type === "complimentary" ? 0 : formatNumber(rawTransactions?.card_payments ?? 0)}
                </td>
              </Trow> */}
              <Trow>
                <td className="text-lg text-dark font-bold" colSpan={4}>
                 DISCOUNT
                </td>
                <td className="text-lg text-dark text-right">
                  {formatNumber(
                    rawTransactions?.transaction_discount_total ?? 0
                  )}
                </td>
              </Trow>
              {/* <Trow>
                <td className="text-lg text-dark font-bold" colSpan={4}>
                  ITEM DISCOUNT
                </td>
                <td className="text-lg text-dark text-right">
                  {formatNumber(
                    rawTransactions?.titem_discount_total ?? 0
                  )}
                </td>
              </Trow> */}
              {/* <Trow>
                <td className="text-lg text-dark font-bold" colSpan={4}>
                  CASH
                </td>
                <td className="text-lg text-dark text-right">
                  {type === "complimentary" ? 0 : formatNumber(total_cash ?? 0)}
                </td>
              </Trow> */}

              <Trow>
                <td className="text-lg text-dark font-bold" colSpan={4}>
                  NET
                </td>
                <td className="text-lg text-dark text-right">

                  {type === "complimentary" ? 0 : formatNumber(rawTransactions?.transaction_total ?? 0)}
                </td>
              </Trow>
            </>
      
        </tbody>
      </Table>

      {isLoadingList && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}


<CursorPaginationLinks
        paginatedData={rawTransactions}
        onLinkClicked={onPaginationLinkClicked}
        pageSize={entriesPerPage}
        setPageSize={setEntriesPerPage}
      />

      <div className="modal" id="my-modal-2">
        <div className="modal-box bg-white">
          {selectedTransactionId && (
            <Fragment>
              <h3 className="font-bold text-lg">
                Void Transaction #{selectedTransactionId}
              </h3>
              <div className="flex flex-wrap space-y-1 w-full">
                <div className="text-dark text-sm">
                  <span>Password</span>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password to proceed"
                  className="input input-primary w-full"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                />
              </div>
            </Fragment>
          )}
          {!selectedTransactionId && (
            <div className="flex justify-center">
              <InfoAlert
                title="No transaction selected"
                message="Click the BACK button"
              />
            </div>
          )}

          <div className="modal-action">
            <a href="#" className="btn btn-outline">
              Back
            </a>

            <a href="#" className="btn btn-error" onClick={voidTransaction}>
              Void
            </a>
          </div>
        </div>
      </div>

      <TransactionDetailModal
        opened={showTransactionDetails}
        onCloseHandler={() => setShowTransactionDetails(false)}
        transaction={shownTransaction}
      />
    </Card>
  );
}

export default SalesReportData;
