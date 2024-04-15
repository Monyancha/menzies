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
import { getServicesRank } from "../../../../store/merchants/reports/reports-slice";

function ServicesRank() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const trendsStatus = useSelector(
    (state) => state.reports.getServicesRankStatus
  );
  const itemsData = useSelector((state) => state.reports.getServicesRank);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const trends = itemsData;

  const isLoading = trendsStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (!startDate && !endDate) {
      store.dispatch(getServicesRank(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getServicesRank(params));
  }, [branch_id, session, status, startDate, endDate, searchTerm]);

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

    store.dispatch(getServicesRank(params));
  }

  console.log(trends);

  const exportExcel = async () => {
    setIsLoadingExcel(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/sales-reports/services-rank/export-excel?start_date=${startDate}&end_date=${endDate}`;

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
      link.download = "Services Rank Excel.xlsx";
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
    const endpoint = `${API_URL}/reports/sales-reports/services-rank/export-pdf?start_date=${startDate}&end_date=${endDate}`;

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
      link.download = "Services Rank PDF.pdf";
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
          <TextInput
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
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
        </div>
      </div>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              PRODUCT/SERVICE
            </th>
            <th scope="col" className="th-primary">
              TOTAL
            </th>
            <th scope="col" className="th-primary text-right">
              NO SALES
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            trends &&
            trends?.map((item) => (
              <Trow key={item?.id}>
                <>
                  <td>{item?.name ?? "-"}</td>
                  <td>Ksh. {item?.total ?? "0"}</td>
                  <td className="th-primary text-right">
                    {item?.transactions_count ?? 0}
                  </td>
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

      {/* <PaginationLinks
        paginatedData={trends}
        onLinkClicked={onPaginationLinkClicked}
      /> */}
    </Card>
  );
}

export default ServicesRank;
