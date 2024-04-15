import Card from "@/components/layouts/card";
import ActionIconButton from "@/components/ui/actions/action-icon-button";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import {
  Table,
  Thead,
  Trow,
  TSearchFilter,
  TDateFilter,
} from "@/components/ui/layouts/scrolling-table";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import {
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import {
  fetchStockMovementReportExcel,
  fetchStockMovementsReport,
} from "@/store/merchants/reports/sellables/inventory-reports-slice";
import store from "@/store/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function StockMovementList() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const [searchTerm, setSearchTerm] = useState("");

  const isLoading = useSelector(
    (state) => state.inventoryReports.stockMovementStatus === "loading"
  );

  const isLoadingExcel = useSelector(
    (state) => state.inventoryReports.stockMovementExcelStatus === "loading"
  );

  const rawData = useSelector(
    (state) => state.inventoryReports.stockMovementList
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchStockMovementsReport(params));
  }, [session, status, startDate, endDate, searchTerm]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
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

    store.dispatch(fetchStockMovementsReport(params));
  }

  function downloadExcel() {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchStockMovementReportExcel(params));
  }

  const actions = (
    <>
      <div className="flex items-end gap-2">
        <TSearchFilter onChangeSearchTerm={setSearchTerm} />
        <ActionIconButton
          icon="fa-solid fa-download"
          isLoading={isLoadingExcel}
          tooltip="Excel"
          clickHandler={downloadExcel}
        />
      </div>
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
            <th scope="col" className="th-primary text-right">
              SOLD COUNT(OUT)
            </th>
            <th scope="col" className="th-primary text-right">
              OTHER COUNT(OUT)
            </th>
            <th scope="col" className="th-primary text-right">
              ALL COUNT (OUT)
            </th>
            <th scope="col" className="th-primary text-right">
              ALL COUNT (IN)
            </th>
            <th scope="col" className="th-primary text-right">
              REMAINING COUNT
            </th>

            <th scope="col" className="th-primary text-right">
              SOLD WORTH(OUT)
            </th>
            <th scope="col" className="th-primary text-right">
              OTHER WORTH(OUT)
            </th>
            <th scope="col" className="th-primary text-right">
              ALL WORTH (OUT)
            </th>
            <th scope="col" className="th-primary text-right">
              ALL WORTH (IN)
            </th>
            <th scope="col" className="th-primary text-right">
              REMAINING WORTH
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            rawData?.data?.map((item) => (
              <Trow key={item.id}>
                <td className="font-bold text-primary underline underline-offset-2">
                  <Link
                    href={`/merchants/reports/sellables/inventory/stock-movements/${item.id}`}
                  >
                    {item.id}
                  </Link>
                </td>
                <td>{item?.sellable?.name ?? "-"}</td>
                <td className="text-right">
                  {formatNumber(item?.sold_sum ?? 0)}
                </td>
                <td className="text-right">
                  {formatNumber(item?.other_credits ?? 0)}
                </td>
                <td className="text-right">
                  {formatNumber(item?.all_credits ?? 0)}
                </td>
                <td className="text-right">
                  {formatNumber(item?.all_debits ?? 0)}
                </td>
                <td className="text-right">
                  {formatNumber(
                    (item?.all_debits ?? 0) - (item?.all_credits ?? 0)
                  )}
                </td>
                <td className="text-right">
                  {formatNumber(
                    parseValidFloat(item?.sold_sum) *
                      parseValidFloat(item?.sellable?.cost)
                  )}
                </td>
                <td className="text-right">
                  {formatNumber(
                    parseValidFloat(item?.other_sum) *
                      parseValidFloat(item?.sellable?.cost)
                  )}
                </td>
                <td className="text-right">
                  {formatNumber(
                    parseValidFloat(item?.all_credits) *
                      parseValidFloat(item?.sellable?.cost)
                  )}
                </td>
                <td className="text-right">
                  {formatNumber(
                    parseValidFloat(item?.all_debits) *
                      parseValidFloat(item?.sellable?.cost)
                  )}
                </td>
                <td className="text-right">
                  {formatNumber(
                    (parseValidFloat(item?.all_debits) -
                      parseValidFloat(item?.all_credits)) *
                      parseValidFloat(item?.sellable?.cost)
                  )}
                </td>
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
