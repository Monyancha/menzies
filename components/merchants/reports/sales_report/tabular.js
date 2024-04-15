import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import {
  formatDate,
  formatNumber,
} from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Menu, Button, Text, TextInput } from "@mantine/core";
import { IconDownload, IconTableExport } from "@tabler/icons";
import Link from "next/link";
import { getCustomerTrendsTabular } from "../../../../store/merchants/reports/reports-slice";
import { showNotification } from "@mantine/notifications";
import { getSalesReport } from "../../../../store/merchants/reports/reports-slice";
import { Select } from "@mantine/core";
import { IconAlertCircle, IconHelp } from "@tabler/icons";
import { ActionIcon } from "@mantine/core";
import { Modal, Alert, Mark } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function SalesReportTabular() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  //setPaymentMethod
  const [paymentMethod, setPaymentMethod] = useState("");
  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const trendsStatus = useSelector(
    (state) => state.reports.getSalesReportStatus
  );
  const itemsData = useSelector((state) => state.reports.getSalesReport);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const trends = itemsData?.transactions;

  const isLoading = trendsStatus === "loading";

  console.log("Payment Method", paymentMethod);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (!startDate && !endDate) {
      store.dispatch(getSalesReport(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    //paymentMethod
    if (paymentMethod) {
      params["paymentMethod"] = paymentMethod;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getSalesReport(params));
  }, [
    branch_id,
    session,
    status,
    startDate,
    endDate,
    searchTerm,
    paymentMethod,
  ]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

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
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    //paymentMethod
    if (paymentMethod) {
      params["paymentMethod"] = paymentMethod;
    }

    store.dispatch(getSalesReport(params));
  }

  console.log(trends);

  const exportExcel = async () => {
    setIsLoadingExcel(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    // const endpoint = `${API_URL}/reports/sales-reports/export-excel?start_date=${startDate}&end_date=${endDate}`;
    const endpoint = `${API_URL}/reports/transactions/sales_list_excel?start_date=${startDate}&end_date=${endDate}`;

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
      link.download = "Sales Report.xlsx";
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

  const exportPdf = async () => {
    setIsLoadingPdf(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/sales-reports/export-pdf?start_date=${startDate}&end_date=${endDate}`;

    const accessToken = session.user.accessToken;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/pdf",
      },
    };

    try {
      const response = await fetch(endpoint, options);
      const blob = await response.blob();

      if (!response.ok) {
        throw { message: "failure" };
      }

      // const result = response.json();

      // console.log("Response Result", result);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Sales Report.pdf";
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

    setIsLoadingPdf(false);
  };

  return (
    <Card>
      <div className="flex justify-between items-center flex-wrap">
        <div className="flex w-full md:w-6/12 flex-wrap">
          <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
            <div className="text-dark text-sm">From</div>
            <input
              type="date"
              name="search"
              className="input-primary h-12 text-grey-100"
              placeholder="dd/mm/yyyy"
              onChange={(event) => {
                setStartDate(event.target.value);
              }}
              value={startDate}
            />
          </div>
          <div className="flex flex-wrap space-y-1 w-full md:w-6/12 md:pl-2 xl:w-fit">
            <div className="text-dark text-sm">To</div>
            <input
              type="date"
              name="search"
              className="input-primary h-12 text-grey-100"
              placeholder="dd/mm/yyyy"
              onChange={(event) => {
                setEndDate(event.target.value);
              }}
              value={endDate}
            />
          </div>
        </div>
        <div className="flex w-full md:w-6/12 flex-wrap md:justify-end mt-2 md:mt-0 space-x-2 items-center">
          {/* <TextInput
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
          /> */}

          <Select
            placeholder="Payment Method"
            data={[
              { value: "Cash", label: "Cash" },
              { value: "Mpesa", label: "Mpesa" },
              { value: "Credit", label: "Credit" },
              { value: "Others", label: "Others" },
            ]}
            size="md"
            clearable
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <Button
            className="mr-2"
            leftIcon={<IconTableExport size={16} />}
            variant="outline"
            loading={isLoadingExcel}
            onClick={exportExcel}
            size="md"
          >
            Excel
          </Button>
          <Button
            className="mr-2"
            leftIcon={<IconDownload size={16} />}
            variant="outline"
            loading={isLoadingPdf}
            onClick={exportPdf}
            size="md"
          >
            PDF
          </Button>
          <ActionIcon color="blue" size="lg" onClick={open} variant="filled">
            <IconHelp size="1.625rem" />
          </ActionIcon>
        </div>
      </div>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID
            </th>
            <th scope="col" className="th-primary">
              ITEM
            </th>
            <th scope="col" className="th-primary">
              SELLING PRICE
            </th>
            <th scope="col" className="th-primary">
              DISCOUNT
            </th>
            <th scope="col" className="th-primary">
              POINTS REDEEMED
            </th>
            <th scope="col" className="th-primary">
              PAYMENT METHOD
            </th>
            <th scope="col" className="th-primary">
              CLIENT
            </th>
            <th scope="col" className="th-primary">
              RATING
            </th>
            <th scope="col" className="th-primary text-right">
              TRANSACTION DATE
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            trends &&
            trends.data.map((item) => (
              <Trow key={item?.id}>
                <>
                  <td>{item?.id}</td>
                  <td>{item?.item ?? "-"}</td>
                  <td>Ksh. {item?.sellingPrice ?? 0}</td>
                  <td>{item?.discount ?? 0}</td>
                  <td>{item?.points_redeemed ?? 0}</td>
                  <td>{item.payment_method ?? "-"}</td>
                  <td>{item?.client?.name ?? "-"}</td>
                  <td>{item?.rating ?? "-"}</td>
                  <td className="text-right">{formatDate(item.date)}</td>
                </>
              </Trow>
            ))}
        </tbody>
      </Table>
      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={trends}
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

export default SalesReportTabular;
