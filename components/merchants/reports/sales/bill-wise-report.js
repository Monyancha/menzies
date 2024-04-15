import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "@/store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
  TSearchFilter,
} from "@/components/ui/layouts/scrolling-table";
import { Fragment, useContext, useEffect, useState } from "react";
import InfoAlert from "@/components/ui/display/info-alert";
import TransactionListContext from "@/store/merchants/transactions/transaction-list-context";
import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import { isMerchant, isRestaurant } from "@/lib/shared/roles_and_permissions";
import { Menu, Button, Text,Select,MultiSelect } from "@mantine/core";
import {
  IconPrinter,
  IconChevronDown,
  IconEdit,
  IconX,
  IconToolsKitchen2,
  IconGlassFull,
  IconListDetails,
  IconLayout2,
  IconFileDownload
} from "@tabler/icons";
import { printRemotePdf } from "@/lib/shared/printing-helpers";
import TransactionDetailModal from "../../transactions/transaction-detail-modal";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import LinkIconButton from "@/components/ui/actions/link-icon-button";
import ActionIconButton from "@/components/ui/actions/action-icon-button";
import { showNotification } from "@mantine/notifications";
import CursorPaginationLinks from "@/components/ui/layouts/cursor-pagination-links";

//mo
import LinkCrumb from "@/components/ui/actions/link-crumb";
import { useCallback } from "react";
import { useMemo } from "react";
import { fetchTransactionList } from "@/store/merchants/transactions/transaction-list-slice";
import { fetchDepartments } from "@/store/merchants/settings/branches-slice";
function BillsReportData() {
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [department_id,setDepartment] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    transactions?.per_page ?? 10
  );

  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );
  const branch_id = useSelector((state) => state.branches.branch_id);
  const [br_id, setBranch] = useState(branch_id);
  const transactionList = useSelector(
    (state) => state.transactions.transactionList
  );
  const isLoadingList = transactionListStatus === "loading";

  const departments_list = useSelector((state) => state.branches.departments_list);


  const transactions = transactionList?.data;
  const rawTransactions = transactionList;

  const total_mpesa = transactions?.filter((item)=>item?.transaction_payments[0]?.type==="mpesa")
  ?.reduce(
    (sum, y) => sum + parseValidFloat(y?.total_paid),
    0
  ) ?? 0;
  const total_cash = transactions?.filter((item)=>item?.transaction_payments[0]?.type==="cash")
  ?.reduce(
    (sum, y) => sum + parseValidFloat(y?.total_paid),
    0
  ) ?? 0;

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    console.log(type);

    if(type)
    {
      params["payment_type"] =type;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if(department_id) {
      params["department_id"] = department_id;
    }
    if (!startDate && !endDate) {
      store.dispatch(fetchTransactionList(params));
      return;
    }
    if (entriesPerPage) {
      params["entries"] = entriesPerPage;
    }

    // if (!startDate || !endDate) {
    //   return;
    // }
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchTransactionList(params));
    store.dispatch(fetchDepartments(params));
  }, [startDate, endDate, branch_id, accessToken, status, searchTerm,type,department_id,entriesPerPage]);

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

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (entriesPerPage) {
      params["entries"] = entriesPerPage;
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

  const canViewTotals = useSelector(
    hasBeenGranted("can_view_transaction_list_totals")
  );
  const canView = useSelector(hasBeenGranted("can_view_transaction"));
  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));
  const canVoid = useSelector(hasBeenGranted("can_void_transaction"));

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
    const endpoint = `${API_URL}/reports/sales-reports/export-excel?start_date=${startDate}&end_date=${endDate}&payment_type=${type}&filter=${searchTerm}`;

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
    a.innerHTML = "Bill Wise Report.xlsx";
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

  const exportPdf = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/billwise-reports/export-pdf?start_date=${startDate}&end_date=${endDate}&payment_type=${type}&filter=${searchTerm}&department_id=${department_id}`;

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
    a.innerHTML = "BillWiseReport.pdf";
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
    // setIsLoadingExcel(false);
  };
  const paymentTypes = [
    { value: "glovo", label: "Glovo" },
    { value: "jumia", label: "Jumia Food" },
    { value: "bolt", label: "Bolt Food" },
    { value: "uber", label: "Uber Eats" },
    { value: "complimentary", label: "Complimentary" },
    { value: "cash", label: "cash" },
    { value: "mpesa", label: "mpesa" },
  ];

  const actions = (
    <>
    {/* { isRestaurantAc &&
       (
        <MultiSelect
          placeholder="Payment Type"
          value={type}
          onChange={setType}
          data={paymentTypes}
          searchable
          clearable
        />
       )
      } */}



<Button
        className="mr-2"
        leftIcon={<IconFileDownload size={16} />}
        variant="outline"

        onClick={exportPdf}
      >
        Export PDF
      </Button>


    </>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />

        <div className="col-span-1 md:col-span-2">
          <TSearchFilter onChangeSearchTerm={setSearchTerm} />
        </div>
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              Bill NO
            </th>

            <th scope="col" className="th-primary">
              PRODUCT NAME
            </th>

            <th scope="col" className="th-primary ">
              QTY
            </th>

            <th scope="col" className="th-primary ">
              RATE
            </th>

            <th scope="col" className="th-primary ">
              TOTAL
            </th>
            <th scope="col" className="th-primary ">
              DATE PAID
            </th>


          </tr>
        </Thead>
        <tbody>
          {transactions &&
            transactions.map((item) => (
              <Trow key={item.id}>
                <Fragment>
                  <td>{item?.bill_no}</td>
                 <td>
                 <Table>
                          {item?.titems?.map((y, ind) => (
                             <Trow key={ind}>
                             <td>
                             <span>
                               {y?.sellable?.sellable?.name?.substr(
                                 0,
                                 30
                               ) ?? ""}
                               ...
                             </span>

                           </td>
                             </Trow>

                          ))}


                    </Table>
                 </td>

                 <td>
                 <Table>
                          {item?.titems?.map((y, ind) => (
                             <Trow key={ind}>
                             <td>
                             <span>
                               {y?.quantity ?? 0}

                             </span>

                           </td>
                             </Trow>

                          ))}


                    </Table>
                 </td>
                  <td className="">
                  <Table>
                          {item?.titems?.map((y, ind) => (
                             <Trow key={ind}>
                             <td>
                             <span>
                             Kshs  {formatNumber(y?.cost ?? 0)}
                             </span>

                           </td>
                             </Trow>

                          ))}



                    </Table>
                  </td>
                  <td className="">
                  <Table>
                          {item?.titems?.map((y, ind) => (
                          <>
                             <Trow key={ind}>
                             <td>
                             <span>

            Kshs  {formatNumber((parseValidFloat(y.cost) * parseValidFloat(y.quantity)))}


                             </span>


                           </td>
                             </Trow>


                          </>
                          ))}


                    </Table>
                    <br></br>
                             <span>

Total Kshs   {formatNumber(parseValidFloat(item.cost))}


                 </span>
                  </td>
                  <td className="text-right">{formatDate(item.date)}</td>

                </Fragment>
              </Trow>
            ))}

          {rawTransactions && canViewTotals && (
            <>
             <Trow>
              <td className="text-lg text-dark font-bold" colSpan={4}>
                Grand Total
              </td>
              <td className="text-lg text-dark">
              <strong> { formatNumber(parseValidFloat(rawTransactions?.transaction_discount_total) + parseValidFloat(rawTransactions?.transaction_total) ?? 0)}</strong>
              </td>
            </Trow>

            <Trow>
              <td className="text-lg text-dark font-bold" colSpan={4}>
                Discount
              </td>
              <td className="text-lg text-dark">
              <strong> Kshs  { formatNumber(rawTransactions?.transaction_discount_total ?? 0)}</strong>
              </td>
            </Trow>
            <Trow>
              <td className="text-lg text-dark font-bold" colSpan={4}>
                Total
              </td>
              <td className="text-lg text-dark">
              <strong> Kshs  {type==="complimentary" ? 0 : formatNumber(rawTransactions?.transaction_total ?? 0)}</strong>
              </td>
            </Trow>




            </>


          )}
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

export default BillsReportData;
