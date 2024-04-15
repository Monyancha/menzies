import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import Card from "../../../ui/layouts/card";
import {
  Table,
  Thead,
  TSearchFilter,
  TDateFilter,
  TDateTimeFilter,
} from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import {
  fetchSalesList,
  fetchSalesListReceipt,
} from "../../../../store/merchants/reports/sales/sales-reports-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Button, Select, Switch } from "@mantine/core";
import {
  IconTableExport,
  IconDownload,
  IconAlertCircle,
  IconHelp,
} from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { ActionIcon } from "@mantine/core";
import { Modal, Alert, Mark, MultiSelect } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { fetchDepartments } from "@/store/merchants/settings/branches-slice";

function SalesListView() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [department_id, setDepartment] = useState("");

  const [currentPage, setCurrentPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [type, setType] = useState("");
  const [checked, setChecked] = useState(false);

  const showDateTime = (e) => {
    setStartDate("");
    setEndDate("");
    setChecked(e);
    if (!e) {
      setStartDate(getDateFilterFrom);
      setEndDate(getDateFilterTo);
    }
  };

  const rawData = useSelector((state) => state.salesReports.salesList);
  const salesListStatus = useSelector(
    (state) => state.salesReports.salesListStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const departments_list = useSelector(
    (state) => state.branches.departments_list
  );

  const isLoading = salesListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    //TODO::Allow refreshing
    if (salesListStatus === "idle") {
      store.dispatch(
        fetchSalesList({
          accessToken: session.user.accessToken,
          branch_id: branch_id,
        })
      );
    }
  }, [branch_id, session, status, salesListStatus]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

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

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (department_id) {
      params["department_id"] = department_id;
    }
    if (type) {
      params["payment_type"] = type;
    }

    store.dispatch(fetchSalesList(params));
    store.dispatch(fetchDepartments(params));
  }, [
    branch_id,
    startDate,
    endDate,
    session,
    status,
    searchTerm,
    department_id,
    type,
    endDateTime,
    startDateTime,
  ]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }
    setCurrentPage(page);

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;
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

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchSalesList(params));
  }

  const isReceiptLoading = useSelector(
    (state) => state.salesReports.salesListReceiptStatus === "loading"
  );

  function downloadReceipt() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    params["branch_id"] = branch_id;
    params["department_id"] = department_id;
    if (startDateTime) {
      params["startDateTime"] = startDateTime;
    }

    if (endDateTime) {
      params["endDateTime"] = endDateTime;
    }
    store.dispatch(fetchSalesListReceipt(params));
  }

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

  const exportExcel = async () => {
    setIsLoadingExcel(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/transactions/sales_list_excel?start_date=${startDate}&end_date=${endDate}&department_id=${department_id}&start_date_time=${
      startDateTime ?? ""
    }&end_date_time=${endDateTime ?? ""}`;
    // const endpoint = `${API_URL}/reports/sales-reports/export-excel?start_date=${startDate}&end_date=${endDate}`;

    const accessToken = session.user.accessToken;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    };

    try {
      const response = await fetch(endpoint, options);
      const blob = await response.blob();

      if (!response.ok) {
        throw { message: "failure" };
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Sale Report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification({
        title: "Success",
        message: "Download successful",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Sorry! " + error.message,
        color: "red",
      });
    }

    setIsLoadingExcel(false);
  };

  //Help Modal
  const [opened, { open, close }] = useDisclosure(false);

  const actions = (
    <Fragment>
      <div className="mt-5">
        <Button
          className="mr-2"
          leftIcon={<IconDownload size={16} />}
          variant="outline"
          loading={isReceiptLoading}
          onClick={downloadReceipt}
        >
          PDF
        </Button>
        <Button
          className="mr-2"
          leftIcon={<IconTableExport size={16} />}
          variant="outline"
          loading={isLoadingExcel}
          onClick={exportExcel}
        >
          Excel
        </Button>
      </div>
      {departments_list?.data?.length > 0 && (
        <Select
          placeholder="Department"
          label="Department"
          data={
            departments_list?.data?.map((item) => ({
              value: `${item.id}`,
              label: `${item?.name}`,
            })) ?? []
          }
          value={department_id}
          onChange={(v) => setDepartment(v)}
          searchable
          clearable
        />
      )}

      <div className="mt-6">
        <ActionIcon color="blue" size="lg" onClick={open} variant="filled">
          <IconHelp size="1.625rem" />
        </ActionIcon>
      </div>
    </Fragment>
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
          label="Payment Type"
          placeholder="Payment Type"
          value={type}
          onChange={setType}
          data={paymentTypes}
          searchable
          clearable
        />
      </TableCardHeader>

      <div className="grid grid-cols-2 gap-1"></div>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              CLIENT NAME
            </th>
            <th scope="col" className="th-primary">
              GOOD/SERVICE
            </th>
            <th scope="col" className="th-primary text-right">
              QUANTITY
            </th>
            <th scope="col" className="th-primary text-right">
              SELLING PRICE
            </th>
            <th scope="col" className="th-primary text-right">
              SUBTOTAL
            </th>
            <th scope="col" className="th-primary text-right">
              DISCOUNT*
            </th>
            <th scope="col" className="th-primary">
              PAYMENT METHOD(S)
            </th>
            <th scope="col" className="th-primary">
              SOLD BY
            </th>
            <th scope="col" className="th-primary text-right">
              SOLD ON
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            rawData &&
            rawData.data.map((item) => (
              <tr className="bg-white border-b" key={item.id}>
                <td>{item?.id}</td>
                <td>{item.transaction?.client?.name ?? "-"}</td>
                <td>{item.sellable?.sellable?.name ?? "-"}</td>
                <td className="text-right">{formatNumber(item.quantity)}</td>
                <td className="text-right">{formatNumber(item.cost)}</td>
                <td className="text-right">
                  {item.transaction?.transaction_payments[0]?.type ===
                  "complimentary"
                    ? 0
                    : formatNumber(item.total)}
                </td>
                <td className="text-right">{formatNumber(item.discount)}</td>
                <td>
                  {item.transaction?.transaction_payments[0]?.type}
                  {item.transaction?.transaction_payments?.length > 1
                    ? " +"
                    : ""}
                </td>

                <td>{item.transaction?.updating_user?.name ?? "-"}</td>
                <td className="text-right">
                  {formatDate(item.transaction?.date)}
                </td>
              </tr>
            ))}

          {!isLoading && rawData && (
            <>
              <tr className="bg-white border-b text-lg">
                <th
                  scope="row"
                  colSpan="5"
                  className="text-primary font-bold text-right"
                >
                  GRAND TOTAL
                </th>
                <td className="text-right text-dark tracking-wider text-xl font-bold">
                  {formatNumber(rawData?.gross_total)}
                </td>
                <td className="text-right text-dark tracking-wider text-xl font-bold">
                  {formatNumber(rawData?.item_discount_sum)}
                </td>
              </tr>
              <tr className="bg-white border-b text-lg">
                <th
                  scope="row"
                  colSpan="5"
                  className="text-primary font-bold text-right"
                >
                  TRANSACTION DISCOUNT
                </th>

                <td className="text-right text-dark tracking-wider text-xl font-bold">
                  {formatNumber(rawData?.transaction_discount_sum)}
                </td>
              </tr>
              <tr className="bg-white border-b text-lg">
                <th
                  scope="row"
                  colSpan="5"
                  className="text-primary font-bold text-right"
                >
                  ITEM DISCOUNT
                </th>

                <td className="text-right text-dark tracking-wider text-xl font-bold">
                  {formatNumber(rawData?.item_discount_sum)}
                </td>
              </tr>
              <tr className="bg-white border-b text-lg">
                <th
                  scope="row"
                  colSpan="5"
                  className="text-primary font-bold text-right"
                >
                  NET
                </th>

                <td className="text-right text-dark tracking-wider text-xl font-bold">
                  {formatNumber(rawData?.grand_total)}
                </td>
              </tr>

              <tr className="bg-white border-b text-lg">
                <td
                  className="text-xs font-bold text-dark mt-2 text-right"
                  colSpan={7}
                >
                  *Only showing item discounts, not transaction discounts
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={rawData}
        onLinkClicked={onPaginationLinkClicked}
      />

      <Modal opened={opened} onClose={close} size="xl" title="Sales">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Sales"
          color="blue"
        >
          This is a note of what the Sales Report contains
        </Alert>
        <br />
        <b>1. ID NO:</b> <br /> Is the transaction number. You can use this to
        search for a transaction. <br />
        <b>2. CLIENT NAME:</b> <br /> Refers to the customer who received the
        goods or service. <br />
        <b>3. GOOD/SERVICE:</b> <br /> This is the product or service which you
        have offered to the customer. <br />
        <b>4. QUANTITY:</b> <br /> Is the total count of product or service
        offered/sold to the customer. <br />
        <b>5. SELLING PRICE:</b> <br /> This is your retail price at the moment
        you sold the product/service to the customer. <br />
        <b>6. SUBTOTAL:</b> <br /> Refers to the total amount amount for the
        product/service according to the quantity count offered to the customer.
        E.g. if Quantity = 2 and Selling price = 4,000, then the Subtotal is
        Ksh. 8,000 <br />
        <b>7. DISCOUNT:</b> <br /> Refers to the price deduction you offer to
        your customers.{" "}
        <Mark>
          NOTE: The Discounts on this table only show Item discounts and not
          Transaction discounts!
        </Mark>{" "}
        <br />
        <b>8. PAYMENT METHOD:</b> <br /> This is the payment option the customer
        used to pay you. E.g. Cash, M-Pesa, Card, Bank Transfer, Crypto, etc.{" "}
        <br />
        <b>9. SOLD BY:</b> <br /> Refers to the merchant or staff who made the
        sale/transaction.{" "}
        <Mark>
          {" "}
          You can assign individual staff permissions from the Access Control
          under Settings{" "}
        </Mark>{" "}
        <br />
        <b>10. SOLD ON:</b> <br /> This has the exact date and time when the
        sale/transaction was made. <br />
        <Alert icon={<IconAlertCircle size="1rem" />} title="NOTE" color="red">
          1. The Date filter helps you to filter transactions for a specific
          period of time. E.g 1st March 2023 to 31st March 2023 <br />
          2. The PDF export allows you to download the Sales in form of PDF. In
          default only daily reports will be generated unless you filter for
          your specific period of time. <br />
          3. The Excel export allows you to export transactions in form of
          Microsof Excel Sheet. In default it generates full time reports for
          all your transactions. You can as well filter using the date filter to
          get transactions for a specific period of time only.
        </Alert>
      </Modal>
    </Card>
  );
}

export default SalesListView;
