import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import {
  TDateFilter,
  TSearchFilter,
  Table,
  Thead,
  Trow,
} from "../../../components/ui/layouts/scrolling-table";
import { Badge, Button } from "@mantine/core";
import Card from "../../../components/ui/layouts/card";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import { IconFileExport, IconPlus, IconPrinter, IconTrash } from "@tabler/icons-react";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../../src/store/Store";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../lib/shared/data-formatters";
import Link from "next/link";
import { getAllInvoices } from "../../../src/store/accounts/accounts-slice";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheck } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { IconShare } from "@tabler/icons-react";
import DelTable from "../../../components/merchants/inventory/del-modals/del-table-modal";
import RecordPaymentModal from "../../../components/accounts/record-payment-modal";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Invoices",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function Invoices() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [shareLoading, setShareLoading] = useState({});
  const [pdfLoading, setPdfLoading] = useState({});

  const invoiceStatus = useSelector(
    (state) => state.accounts.getAllInvoicesStatus
  );
  const invoiceData = useSelector((state) => state.accounts.getAllInvoices);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = invoiceStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getAllInvoices(params));
  }, [branch_id, session, status, searchTerm, startDate, endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
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
    params["branch_id"] = branch_id;

    store.dispatch(getAllInvoices(params));
  }

  const invoices = invoiceData?.invoices;

  const exportExcel = async () => {
    const url = `/accounts/invoices/downloadExcel`;

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["url"] = url;
    params["fileName"] = "invoices.xlsx";

    setIsLoadingPdf(true);

    await downloadFile(params);

    setIsLoadingPdf(false);
  };

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/invoices/downloadPDF`;

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
    a.innerHTML = `Invoices.pdf`;
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
      setIsLoadingPdf(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setIsLoadingPdf(false);
    }
    setIsLoadingPdf(false);
  };

  //
  const printInvoice = async (itemId) => {
    // Set loading state to true for the clicked item
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: true,
    }));

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/invoices/exportPDF/${itemId}`;

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

    //Fix Naming Start Here
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw { message: "failure" };
    }

    const filenameHeader = response.headers.get("Content-Disposition");
    const filename = filenameHeader
      ? filenameHeader.split("filename=")[1]
      : "Invoice.pdf";

    const result = await response.blob();

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = filename; // Set the actual filename here
    a.target = "_blank";
    a.click();
    //End Here

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

  //
  console.log("Invoices", invoices);

  const handleShare = async (itemId) => {
    // Set loading state to true for the clicked item
    setShareLoading((prevShareLoading) => ({
      ...prevShareLoading,
      [itemId]: true,
    }));

    try {
      const accessToken = session?.user?.accessToken;

      const shareUrl = `${BASE_URL}/estimate/${itemId}`;
      const shareEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/accounts/quotations/share/${itemId}`;

      const payload = {
        estimate_client_name: "Enock",
        estimate_client_email: "test@gmail.com",
        estimate_message: "message",
        estimate_client_email_cc: "",
      };

      const response = await fetch(shareEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          payload,
          shareUrl,
        }),
      });
      const data = await response.json();
      const shareId = data.shareId;
      if (navigator.share) {
        navigator
          .share({
            title: document.title,
            text: `Check out this shared content with ID ${shareId}`,
            url: shareUrl,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing:", error));
        setShareLoading((prevShareLoading) => ({
          ...prevShareLoading,
          [itemId]: false,
        }));
      } else {
        console.log("Web Share API not supported");
        setShareLoading((prevShareLoading) => ({
          ...prevShareLoading,
          [itemId]: false,
        }));
      }
    } catch (error) {
      console.log("Error sharing:", error);
      setShareLoading((prevShareLoading) => ({
        ...prevShareLoading,
        [itemId]: false,
      }));
    }
  };


  const extras = (
    <div className="flex flex-row items-end gap-2">
      <Button
        onClick={exportExcel}
        loading={isLoadingPdf}
        variant="outline"
        size="xs"
        color="blue"
        leftIcon={<IconFileExport size={16} />}
      >
        Excel
      </Button>

      <Button
        onClick={exportPDF}
        loading={isLoadingPdf}
        variant="outline"
        size="xs"
        color="blue"
        leftIcon={<IconFileExport size={16} />}
      >
        PDF
      </Button>
    </div>
  );

  return (
<PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Invoices" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <Fragment>
      <div className="btn-group gap-2 mt-3">
        {/* <Link href={`/accounts/invoices/archives`}>
          <Button
            leftIcon={<IconCircleCheck size={16} />}
            variant="outline"
            size="xs"
            color="green"
          >
            Posted Invoices
          </Button>
        </Link> */}

        {/* <Link href={`/accounts/invoices/deleted`}>
          <Button
            leftIcon={<IconTrash size={16} />}
            variant="outline"
            size="xs"
            color="red"
          >
            Archives
          </Button>
        </Link> */}

        <Link href={`/accounts/invoices/create`}>
          <Button leftIcon={<IconPlus size={16} />} variant="outline" >
            New Invoice
          </Button>
        </Link>
      </div>
    </Fragment>
          </div>
        </header>

      <div className="w-full flex flex-wrap mt-2">
        <Card>
          <TableCardHeader actions={extras}>
            <TDateFilter
              startDate={startDate}
              endDate={endDate}
              onChangeStartDate={setStartDate}
              onChangeEndDate={setEndDate}
            />

            <TSearchFilter onChangeSearchTerm={setSearchTerm} />
          </TableCardHeader>

          <Table>
            <Thead>
              <tr>
                <th scope="col" className="th-primary">
                  NO
                </th>
                <th scope="col" className="th-primary">
                  CUSTOMER
                </th>
                <th scope="col" className="th-primary ">
                  CREATED ON
                </th>
                <th scope="col" className="th-primary ">
                  STATUS
                </th>
                {/* <th scope="col" className="th-primary ">
                  EXPIRY
                </th> */}
                <th scope="col" className="th-primary ">
                  AMOUNT
                </th>
                {/* <th scope="col" className="th-primary ">
                  TAX
                </th>
                <th scope="col" className="th-primary ">
                  DISCOUNT
                </th>
                <th scope="col" className="th-primary ">
                  TOTAL AMOUNT
                </th> */}
                <th scope="col" className="th-primary ">
                  TOTAL PAID
                </th>
                <th scope="col" className="th-primary ">
                  TOTAL OWED
                </th>
                <th scope="col" className="th-primary text-right">
                  ACTIONS
                </th>
              </tr>
            </Thead>
            <tbody>
              {!isLoading &&
                invoices?.data &&
                invoices?.data?.map((item) => (
                  <Trow key={item?.id}>
                    <>
                      <td>{item?.invoice_number}</td>
                      <td>{item?.client_name}</td>
                      <td>{formatDate(item?.invoice_date)}</td>
                      {item?.total_owed === 0 ? (
                        <td>Fully Paid</td>
                      ) : (
                        <td>{item?.status}</td>
                      )}
                      {/* <td>{formatDate(item?.due_date)}</td> */}
                      <td>Ksh. {formatNumber(item?.amount) ?? 0}</td>
                      {/* <td>{formatNumber(item?.tax) ?? 0}</td>
                      <td>Ksh. {formatNumber(item?.discount) ?? 0}</td>
                      <td>Ksh. {formatNumber(item?.amount) ?? 0}</td> */}
                      <td>Ksh. {formatNumber(item?.total_paid) ?? 0}</td>
                      <td>Ksh. {formatNumber(item?.total_owed) ?? 0}</td>

                      <td className="py-0 pl-14 2xl:pl-4">
                        <span className="flex justify-end items-center w-full gap-2">
                          <Link
                            href={`/accounts/invoices/${item?.id}`}
                          >
                            <Button
                              variant="outline"
                              leftIcon={<IconEye size={16} />}
                              size="xs"
                              color="cyan"
                            >
                              View
                            </Button>
                          </Link>
                          {item?.restored != 1 && (
                            <Link
                              href={`/accounts/invoices/edit/${item?.id}`}
                            >
                              <Button
                                variant="outline"
                                leftIcon={<IconEdit size={16} />}
                                size="xs"
                                color="indigo"
                              >
                                Edit
                              </Button>
                            </Link>
                          )}

                          {/* <Button
                            leftIcon={<IconShare size={16} />}
                            onClick={() => handleShare(item?.id)}
                            variant="outline"
                            size="xs"
                            loading={shareLoading[item.id]}
                            color="violet"
                          >
                            Share
                          </Button> */}

                          {/* <PostInvoiceModal item={item} /> */}

                          <Button
                            leftIcon={<IconPrinter size={16} />}
                            onClick={() => printInvoice(item?.id)}
                            variant="outline"
                            size="xs"
                            loading={pdfLoading[item.id]}
                            color="green"
                          >
                            Download
                          </Button>

                          <RecordPaymentModal item={item} />

                          {/* <CreditNoteModal item={item} /> */}

                          <DelTable item={item} source="invoices" />
                        </span>
                      </td>
                    </>
                  </Trow>
                ))}

              {!isLoading && invoiceData && (
                <>
                  <tr className="bg-white border-b text-lg">
                    <th
                      scope="row"
                      colSpan="4"
                      className="text-primary font-bold text-right"
                    >
                      TOTALS
                    </th>
                    <td className="text-dark tracking-wider text-xxl font-bold">
                      Ksh. {formatNumber(invoiceData.total_invoices)}
                    </td>

                    {/* <th
                      scope="row"
                      colSpan="1"
                      className="text-primary font-bold text-right"
                    >
                     OWED
                    </th> */}
                    <td className="text-dark tracking-wider text-xxl font-bold">
                      Ksh. {formatNumber(invoiceData.total_owed)}
                    </td>

                    {/* <th
                      scope="row"
                      colSpan="1"
                      className="text-primary font-bold text-right"
                    >
                     PAYMENTS
                    </th> */}
                    <td className="text-dark tracking-wider text-xxl font-bold">
                      Ksh. {formatNumber(invoiceData.total_payments)}
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
            paginatedData={invoices}
            onLinkClicked={onPaginationLinkClicked}
          />
        </Card>
      </div>
      </Box>
    </PageContainer>
  );
}

export default Invoices;
