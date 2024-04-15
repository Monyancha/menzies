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
import { IconPlus } from "@tabler/icons-react";
import NewConsignmentModal from "../../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import { useState } from "react";
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
import { getAllQuotations } from "../../../src/store/accounts/accounts-slice";
import { showNotification } from "@mantine/notifications";
import { IconPrinter } from "@tabler/icons-react";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Quotations",
  },
];

export default function Quotations() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [pdfLoading, setPdfLoading] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const itemStatus = useSelector(
    (state) => state.accounts.getAllQuotationsStatus
  );
  const items = useSelector((state) => state.accounts.getAllQuotations);

  const isLoading = itemStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (!startDate && !endDate) {
      store.dispatch(getAllQuotations(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getAllQuotations(params));
  }, [session, status, startDate, endDate, searchTerm]);

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

    store.dispatch(getAllQuotations(params));
  }

  //Download Quotation
  const printInvoice = async (itemId) => {
    // Set loading state to true for the clicked item
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: true,
    }));

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/quotations/downloadPDF/${itemId}`;

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
    a.innerHTML = `Quotations.pdf`;
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

  const actions = (
    <div className="flex flex-row items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Quotations" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            <Link href="/accounts/quotations/create">
              <Button size="sm" variant="outline">New Quotation</Button>
            </Link>
          </div>
        </header>

        <div className="w-50 flex flex-wrap mt-2">
          <Card>
            <TableCardHeader actions={actions}>
              <TDateFilter
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={setStartDate}
                onChangeEndDate={setEndDate}
              />
            </TableCardHeader>

            <TableContainer>

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
                  AMOUNT
                </th>
                <th scope="col" className="th-primary ">
                  CREATED ON
                </th>
                <th scope="col" className="th-primary text-right">
                  ACTIONS
                </th>
              </tr>
            </Thead>
              <tbody>
                {!isLoading &&
                  items &&
                  items?.estimates?.data?.map((item) => (
                    <tr className="border-b" key={item?.id}>
                    <td>{item?.estimate_number}</td>
                      <td>{item?.client_name}</td>
                      <td>Ksh. {formatNumber(item?.amount + item?.discount) ?? 0}</td>
                      <td>{formatDate(item?.estimate_date)}</td>
              
                      <td className="text-right">
                       
                          <Button
                          leftIcon={<IconPrinter size={16} />}
                          onClick={() => printInvoice(item?.id)}
                          variant="outline"
                          size="xs"
                          loading={pdfLoading[item.id]}
                          >
                            Download
                          </Button>
                       
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            </TableContainer>
            {isLoading && (
              <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                <StatelessLoadingSpinner />
              </div>
            )}

            <PaginationLinks
              paginatedData={items?.estimates}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
