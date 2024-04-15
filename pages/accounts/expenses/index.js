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
import { IconPlus, IconShare } from "@tabler/icons-react";
import NewConsignmentModal from "../../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import { Fragment, useMemo, useState } from "react";
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
import { getAllExpenses } from "../../../src/store/accounts/accounts-slice";
import { IconPrinter } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
//
import VoidExpenseModal from "../../../components/accounts/void-expense-modal";
import UploadExpensesModal from "../../../components/accounts/upload-expenses-modal";
import MerchantFlagsPreloader from "../../../components/merchants/settings/access-control/merchant-flags-preloader";
import { IconCash } from "@tabler/icons-react";
import ActionIconButton from "../../../components/ui/actions/action-icon-button";
import { IconCircleCheck } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";


const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Expenses",
  },
];


const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function Expenses() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [shareLoading, setShareLoading] = useState({});
  const [pdfLoading, setPdfLoading] = useState({});

  const invoiceStatus = useSelector(
    (state) => state.accounts.getAllExpensesStatus
  );
  const invoiceData = useSelector((state) => state.accounts.getAllExpenses);

  const isLoading = invoiceStatus === "loading";

  const branch_id = useSelector((state) => state.branches.branch_id);

  const merchantFlags = useSelector((state) => state.security.merchantFlags);

  const requireApproval = useMemo(
    () =>
      merchantFlags?.find(
        (item) => item.name === "require-approval-for-expenses"
      )?.details?.value ?? false,
    [merchantFlags]
  );

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

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getAllExpenses(params));
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

    store.dispatch(getAllExpenses(params));
  }

  const invoices = invoiceData?.expenses;

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/expenses/downloadPDF`;

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
    a.innerHTML = `Expenses.pdf`;
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
  const printExpenses = async (itemId) => {
    // Set loading state to true for the clicked item
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: true,
    }));

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/expenses/download-pdf/${itemId}`;

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
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = `Expense.pdf`;
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

  //
  console.log("Expenses", invoices);

  const handleShare = async (itemId) => {
    // Set loading state to true for the clicked item
    setShareLoading((prevShareLoading) => ({
      ...prevShareLoading,
      [itemId]: true,
    }));

    try {
      const accessToken = session?.user?.accessToken;

      const shareUrl = `${BASE_URL}/expenses/${itemId}`;
      const shareEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/accounts/expenses/share/${itemId}`;

      const payload = {
        expense_client_name: "Test",
        expense_client_email: "test@gmail.com",
        expense_message: "message",
        expense_client_email_cc: "",
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
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />

      <section>
        <Button leftIcon={<IconPrinter size={18} />} size="sm" variant="outline" clickHandler={exportPDF} loading={isLoadingPdf}>Export PDF</Button>
      </section>
    </div>
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Expenses" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <Fragment>
      <div className="flex flex-row gap-1">
        <UploadExpensesModal />

          <Link href="/accounts/expenses/petty_cash_wallets">
            <Button
              leftIcon={<IconCash size={16} />}
              variant="outline"
              size="xs"
            >
              Petty Cash
            </Button>
          </Link>

        <Link href="/accounts/expenses/create">
          <Button variant="outline" leftIcon={<IconPlus size={16} />} size="xs">
            New
          </Button>
        </Link>
      </div>

      <MerchantFlagsPreloader />
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
          </TableCardHeader>

          <Table>
            <Thead>
              <tr>
                <th scope="col" className="th-primary">
                  NO
                </th>
                <th scope="col" className="th-primary">
                  NAME
                </th>
                {/* <th scope="col" className="th-primary">
                  DESCRIPTION
                </th> */}
                {requireApproval && (
                  <th scope="col" className="th-primary">
                    STATUS
                  </th>
                )}
                <th scope="col" className="th-primary ">
                  AMOUNT
                </th>
                <th scope="col" className="th-primary ">
                  CREATED ON
                </th>
                
                {/* <th scope="col" className="th-primary">
                  PAYMENT METHOD
                </th> */}
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
                      <td>{item?.expense_number}</td>
                      <td
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          maxWidth: "50ch",
                        }}
                      >
                        {JSON.parse(item?.items).map((name) => {
                          const truncatedName = name?.name?.substr(0, 15);
                          const truncatedNameWithEllipsis =
                            truncatedName &&
                            truncatedName.length < name?.name?.length
                              ? truncatedName + "..."
                              : truncatedName;
                          return truncatedNameWithEllipsis;
                        })}
                      </td>
                      {/* <td
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          maxWidth: "50ch",
                        }}
                      >
                        {JSON.parse(item?.items).map((name) => {
                          const truncatedDesc = name?.desc?.substr(0, 15);
                          const truncatedDescWithEllipsis =
                            truncatedDesc &&
                            truncatedDesc.length < name?.desc?.length
                              ? truncatedDesc + "..."
                              : truncatedDesc;
                          return truncatedDescWithEllipsis;
                        })}
                      </td> */}

                      {requireApproval && (
                        <td>
                          {item?.approval_status && (
                            <>
                              {item?.approval_status === "pending" && (
                                <Badge color="gray">pending</Badge>
                              )}
                              {item?.approval_status === "approved" && (
                                <Badge color="green">approved</Badge>
                              )}
                              {item?.approval_status === "rejected" && (
                                <Badge color="red">rejected</Badge>
                              )}
                            </>
                          )}
                        </td>
                      )}

                      
                      <td>
                        Ksh.{" "}
                        {JSON.parse(item?.items || "[]")
                          .map((itemQuantity) => {
                            const qty = itemQuantity?.quantity ?? 1;
                            const itemPrice = itemQuantity?.price || 0;
                            return qty * itemPrice;
                          })
                          .reduce((total, itemTotal) => total + itemTotal, 0)}
                      </td>
                      <td>{formatDate(item?.expense_date)}</td>

                      {/* <td>{item?.payment_method ?? "-"}</td> */}

                      <td className="py-0 pl-14 2xl:pl-4">
                        <span className="flex justify-end items-center w-full gap-2">
                          {/* <Button
                            leftIcon={<IconShare size={16} />}
                            onClick={() => handleShare(item?.id)}
                            variant="outline"
                            size="xs"
                            loading={shareLoading[item.id]}
                          >
                            Share
                          </Button> */}

                          {item?.payment_method === "credit" && (
                            <Link
                              href={`/accounts/expenses/edit/${item?.id}`}
                            >
                              <Button
                                variant="filled"
                                leftIcon={<IconCircleCheck size={16} />}
                                size="xs"
                                color="lime"
                              >
                                Settle
                              </Button>
                            </Link>
                          )}

                          <Link
                            href={`/accounts/expenses/edit/${item?.id}`}
                          >
                            <Button
                              variant="outline"
                              leftIcon={<IconEdit size={16} />}
                              size="xs"
                            >
                              Edit
                            </Button>
                          </Link>

                          <Button
                            leftIcon={<IconPrinter size={16} />}
                            onClick={() => printExpenses(item?.id)}
                            variant="outline"
                            size="xs"
                            loading={pdfLoading[item.id]}
                          >
                            Download
                          </Button>

                          <VoidExpenseModal item={item} />
                        </span>
                      </td>
                    </>
                  </Trow>
                ))}

              {!isLoading && invoices?.data && (
                <>
                  <tr className="bg-white border-b text-lg">
                    <th
                      scope="row"
                      colSpan="2"
                      className="text-primary font-bold"
                    >
                      TOTALS
                    </th>
                    <td className="text-dark tracking-wider text-xxl font-bold">
                      Ksh.{" "}
                      {invoices.data.reduce((total, item) => {
                        const itemTotal = JSON.parse(item?.items || "[]")
                          .map((itemQuantity) => {
                            const qty = itemQuantity?.quantity ?? 1;
                            const itemPrice = itemQuantity?.price || 0;
                            return qty * itemPrice;
                          })
                          .reduce((total, itemTotal) => total + itemTotal, 0);
                        return total + itemTotal;
                      }, 0)}
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

export default Expenses;
