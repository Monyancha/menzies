import Card from "@/components/layouts/card";
import ActionIconButton from "@/components/ui/actions/action-icon-button";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import {
  Table,
  TDateFilter,
  Thead,
  Trow,
  TSearchFilter,
} from "@/components/ui/layouts/scrolling-table";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import {
  formatDate,
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import { downloadFile } from "@/lib/shared/printing-helpers";
import { fetchStockMovementDetailReport } from "@/store/merchants/reports/sellables/inventory-reports-slice";
import store from "@/store/store";
import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function StockMovementDetailView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const sellableId = router?.query?.sellableId;

  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const isLoading = useSelector(
    (state) => state.inventoryReports.stockMovementDetailStatus === "loading"
  );

  const rawData = useSelector(
    (state) => state.inventoryReports.stockMovementDetail
  );

  useEffect(() => {
    if (
      !session ||
      status !== "authenticated" ||
      !sellableId ||
      !router.isReady
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["sellableId"] = sellableId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchStockMovementDetailReport(params));
  }, [session, status, startDate, endDate, router, sellableId]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["sellableId"] = sellableId;
    params["page"] = page;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchStockMovementDetailReport(params));
  }

  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  async function exportExcel() {
    setIsLoadingExcel(true);

    const params = {};
    params[
      "url"
    ] = `/reports/sellables/stock_movement_report/${sellableId}/excel?`;
    params["fileName"] = `Stock Movements - ${sellableId}.csv`;
    params["accessToken"] = session.user.accessToken;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    await downloadFile(params);

    setIsLoadingExcel(false);
  }

  const actions = (
    <>
      <Button
        variant="outline"
        color="blue"
        size="xs"
        onClick={exportExcel}
        loading={isLoadingExcel}
      >
        Excel
      </Button>
      {/*
      <ActionIconButton
        icon="fa-solid fa-download"
        // isLoading={isLoadingPdf}
        tooltip="Excel"
        // clickHandler={exportPDF}
      />
      */}
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
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary">
              TYPE
            </th>
            <th scope="col" className="th-primary">
              AMOUNT
            </th>
            <th scope="col" className="th-primary">
              REFERENCE TYPE
            </th>
            <th scope="col" className="th-primary">
              REFERENCE ID
            </th>

            <th scope="col" className="th-primary">
              DONE BY
            </th>

            <th scope="col" className="th-primary text-right">
              DATE
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            rawData?.data?.map((item) => (
              <Trow key={item.id}>
                <td>{item.id}</td>
                <td>{item?.sellable?.sellable?.name ?? "-"}</td>
                <td>{item?.type === "debit" ? "in" : "out"}</td>
                <td className="">
                  {formatNumber(item?.quantity ?? 0)}
                </td>
                <td>{item?.reference_type ?? "-"}</td>
                <td>{item?.referenceable_id ?? "-"}</td>
                <td>{item?.changeables?.[0]?.user?.name ?? session?.user?.name ?? "-"}</td>
                <td className="text-right">{formatDate(item?.created_at)}</td>
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
        paginatedData={rawData}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}
