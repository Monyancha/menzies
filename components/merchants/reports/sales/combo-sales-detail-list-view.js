import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { formatNumber } from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import {
  fetchComboSalesDetails,
  fetchComboSalesList,
  fetchSalesSummaryReceipt,
} from "../../../../store/merchants/reports/sales/sales-reports-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { useRouter } from "next/router";

function ComboSalesDetailView() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();
  const comboSellableId = router?.query?.comboSellableId;

  const rawData = useSelector((state) => state.salesReports.comboSalesDetails);
  const comboSalesDetailsStatus = useSelector(
    (state) => state.salesReports.comboSalesDetailsStatus
  );
  const isLoading = comboSalesDetailsStatus === "loading";
  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (
      !router.isReady ||
      !comboSellableId ||
      !session ||
      status !== "authenticated"
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["comboSellableId"] = comboSellableId;
    params["branch_id"] = branch_id;

    store.dispatch(fetchComboSalesDetails(params));
  }, [branch_id, session, status, comboSellableId, router]);

  useEffect(() => {
    if (
      !router.isReady ||
      !comboSellableId ||
      !session ||
      status !== "authenticated"
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["comboSellableId"] = comboSellableId;

    if (!startDate && !endDate) {
      store.dispatch(fetchComboSalesDetails(params));
      return;
    }

    if (startDate && endDate) {
      params["startDate"] = startDate;
      params["endDate"] = endDate;
      store.dispatch(fetchComboSalesDetails(params));
    }
  }, [branch_id, startDate, endDate, session, status, comboSellableId, router]);

  function onStartDateChanged(event) {
    setStartDate(event.target.value);
  }

  function onEndDateChanged(event) {
    setEndDate(event.target.value);
  }

  function onPaginationLinkClicked(page) {
    if (!page || !comboSellableId) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["comboSellableId"] = comboSellableId;
    params["page"] = page;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchComboSalesDetails(params));
  }

  const isReceiptLoading = useSelector(
    (state) => state.salesReports.salesSummaryReceiptStatus === "loading"
  );

  function downloadReceipt() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    store.dispatch(fetchSalesSummaryReceipt(params));
  }

  return (
    <div className="flex flex-col space-y-2 w-full mb-8">
      <Card>
        <TableCardHeader>
          <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
            <div className="text-dark text-sm">From</div>
            <input
              type="date"
              name="search"
              className="input-primary h-12 text-grey-100"
              placeholder="dd/mm/yyyy"
              onChange={onStartDateChanged}
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
              onChange={onEndDateChanged}
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
                COMBO
              </th>
              <th scope="col" className="th-primary text-right">
                QUANTITY
              </th>
              <th scope="col" className="th-primary text-right">
                SUBTOTAL
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoading &&
              rawData &&
              rawData.data.map((item) => (
                <Trow key={item.combo_sellable_id}>
                  <>
                    <td>{item.combo_sellable_item_id}</td>
                    <td>
                      {item.combo_sellable_item?.sellable?.sellable?.name ??
                        "-"}
                    </td>
                    <td className="text-right">
                      {formatNumber(item.total_quantity)}
                    </td>
                    <td className="text-right">{formatNumber(item.total)}</td>
                  </>
                </Trow>
              ))}
            {!isLoading && rawData && (
              <>
                <Trow>
                  <>
                    <td colSpan={2} className="text-lg font-bold">
                      TOTAL
                    </td>
                    <td className="text-right text-lg font-bold">
                      {formatNumber(rawData?.grand_quantity ?? 0)}
                    </td>
                    <td className="text-right text-lg font-bold">
                      {formatNumber(rawData?.grand_total ?? 0)}
                    </td>
                  </>
                </Trow>
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
      </Card>
    </div>
  );
}

export default ComboSalesDetailView;
