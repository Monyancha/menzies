import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import Card from "../../../ui/layouts/card";
import { Table, Thead } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  formatNumber,
  formatDate,
} from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import {
  fetchSalesList,
  fetchSalesListReceipt,
} from "../../../../store/merchants/reports/sales/sales-reports-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Button, TextInput } from "@mantine/core";
import { IconTableExport, IconDownload, IconEdit } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

function AccompanimentsListView() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const rawData = useSelector((state) => state.salesReports.salesList);
  const salesListStatus = useSelector(
    (state) => state.salesReports.salesListStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

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

    if (!startDate && !endDate) {
      store.dispatch(fetchSalesList(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchSalesList(params));
  }, [branch_id, startDate, endDate, session, status, searchTerm]);

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
    store.dispatch(fetchSalesListReceipt(params));
  }

  const exportExcel = async () => {
    setIsLoadingExcel(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    // const endpoint = `${API_URL}/reports/transactions/sales_list_excel?start_date=${startDate}&end_date=${endDate}`;
    const endpoint = `${API_URL}/reports/sales-reports/export-excel?start_date=${startDate}&end_date=${endDate}`;

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

  const actions = (
    <Fragment>
      <TextInput
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <Button
        className="mr-2"
        leftIcon={<IconDownload size={16} />}
        variant="outline"
        loading={isReceiptLoading}
        onClick={downloadReceipt}
      >
        Export PDF
      </Button>
      <Button
        className="mr-2"
        leftIcon={<IconTableExport size={16} />}
        variant="outline"
        loading={isLoadingExcel}
        onClick={exportExcel}
      >
        Export Excel
      </Button> */}
    </Fragment>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
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
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>

            <th scope="col" className="th-primary">
              MENU ITEM
            </th>
            <th scope="col" className="th-primary text-right">
              QUANTITY
            </th>
            <th scope="col" className="th-primary text-right">
              ACCOMPANIMENTS
            </th>
            <th scope="col" className="th-primary text-right">
              SOLD ON
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            rawData &&
            rawData?.data?.map((item) => (
              <tr className="bg-white border-b" key={item.id}>
                <td>{item.id}</td>

                <td>{item.sellable?.sellable?.name ?? "-"}</td>
                <td className="text-right">{formatNumber(item.quantity)}</td>
                <td className="text-right">
                  {item?.sold_accompaniments?.map(
                    (it) => it.accompaniments.name + " ," ?? "-"
                  )}
                </td>

                <td className="text-right">
                  {formatDate(item.transaction?.date)}
                </td>
              </tr>
            ))}

          {!isLoading && rawData && <></>}
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
    </Card>
  );
}

export default AccompanimentsListView;
