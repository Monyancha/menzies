import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect, useState, Fragment } from "react";
import { useSession } from "next-auth/react";
import store from "../../../src/store/Store";
import { Menu, Button, Text, TextInput } from "@mantine/core";
import Link from "next/link";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import {
  Table,
  Thead,
  Trow,
} from "../../../components/ui/layouts/scrolling-table";
import Card from "../../../components/ui/layouts/card";
import { formatDate } from "../../../lib/shared/data-formatters";
import { formatNumber } from "../../../lib/shared/data-formatters";
import {
  IconShare,
  IconPrinter,
  IconPrinterOff,
  IconEdit,
} from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { getOneInvoice } from "../../../src/store/accounts/accounts-slice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Invoices() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const invoiceId = router.query?.invoiceId ?? null;
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [shareLoading, setShareLoading] = useState({});
  const [pdfLoading, setPdfLoading] = useState({});

  const invoiceData = useSelector((state) => state.accounts.getAllInvoices);
  const invoiceStatus = useSelector(
    (state) => state.accounts.getAllInvoicesStatus
  );

  const isLoading = invoiceStatus === "loading";

  const item = useSelector((state) => state.accounts.getOneInvoice);
  const itemStatus = useSelector((state) => state.accounts.getOneInvoiceStatus);
  const itemsData = item;

  const isLoadingItem = itemStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["invoiceId"] = invoiceId;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getOneInvoice(params));
  }, [session, status, searchTerm, invoiceId]);

  const parsedItems = item?.invoice_items
    ? JSON.parse(item?.invoice_items)
    : [];

  const printInvoice = async (itemId) => {
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: true,
    }));
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/invoices/payment/${itemId}/print-receipt`;

    const accessToken = session.user.accessToken;

    const options = {
      method: "GET",
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
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = `Invoice #${invoiceId}.pdf`;
    a.target = "_blank";
    a.click();

    console.log(response);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    }
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: false,
    }));
  };

  const BCrumb = [
    {
      to: "/dashboard",
      title: "Dashboard",
    },
    {
      to: "/accounts/invoices",
      title: "Invoices",
    },
    {
      title: "Invoice Payments",
    },
  ];

  
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Invoice Payments" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <div className="w-full flex flex-wrap mt-2">
        <Card>
          <Table>
            <Thead>
              <tr>
                <th scope="col" className="th-primary">
                  PAYMENTS
                </th>
                <th scope="col" className="th-primary">
                  PAYMENT MADE ON
                </th>
                <th scope="col" className="th-primary ">
                  PAYMENT TYPE
                </th>
                <th scope="col" className="th-primary ">
                  PAYMENT REF
                </th>
                <th scope="col" className="th-primary ">
                  PAYMENT AMOUNT
                </th>
                <th scope="col" className="th-primary text-right">
                  ACTIONS
                </th>
              </tr>
            </Thead>
            <tbody>
              {!isLoadingItem &&
                itemsData?.payments?.map((item) => (
                  <Trow key={item?.id}>
                    <>
                      <td>{item?.id}</td>
                      <td>{formatDate(item?.payment_date)}</td>
                      <td>{item?.payment_method ?? "-"}</td>
                      <td>{item?.receiptno ?? "-"}</td>
                      <td>{formatNumber(item?.amount)}</td>
                      <td className="th-primary text-right">
                        <Button
                          leftIcon={<IconPrinter size={16} />}
                          onClick={() => printInvoice(item?.id)}
                          variant="outline"
                          size="xs"
                          color="orange"
                          loading={pdfLoading[item?.id]}
                        >
                          Download
                        </Button>
                      </td>
                    </>
                  </Trow>
                ))}

              {!isLoadingItem && item && (
                <>
                  <tr>
                    <th scope="col" className="font-bold"></th>
                    <th scope="col" colSpan="2" className="font-bold ">
                      <h1 className=" text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        TOTAL Invoice Amount
                      </h1>
                      <h1 className=" text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        TOTAL Paid
                      </h1>
                      <h1 className=" text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        TOTAL Owed
                      </h1>
                    </th>

                    <th
                      scope="col"
                      colSpan="4"
                      className=" text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                    >
                      <h1 className=" text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        Ksh. {formatNumber(item?.amount ?? 0)}{" "}
                      </h1>
                      <h1 className=" text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        Ksh. {formatNumber(item?.total_paid ?? 0)}{" "}
                      </h1>
                      <h1 className=" text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        Ksh. {formatNumber(item?.total_owed ?? 0)}{" "}
                      </h1>
                    </th>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
          {isLoadingItem && (
            <div className="flex justify-center w-full p-3 bg-light rounded-lg">
              <StatelessLoadingSpinner />
            </div>
          )}
        </Card>
      </div>
      </Box>
    </PageContainer>
  );
}

export default Invoices;
