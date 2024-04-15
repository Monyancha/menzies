import { Fragment, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  fetchStaffTransactionList,
  fetchStaffTransactionListExcel,
  recalculateStaffCommission,
} from "../../../../store/merchants/partners/staff-slice";
import store from "../../../../store/store";
import { useRouter } from "next/router";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "@/lib/shared/data-formatters";
import { showNotification } from "@mantine/notifications";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
} from "@/components/ui/layouts/scrolling-table";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import { Button } from "@mantine/core";
import { IconTableExport, IconCalculator } from "@tabler/icons";

function StaffTransactionListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const staffId = router?.query?.staffId;

  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [isRecalculating, setIsRecalculating] = useState(false);

  const transactionListStatus = useSelector(
    (state) => state.staff.staffTransactionListStatus
  );
  const transactionList = useSelector(
    (state) => state.staff.staffTransactionList
  );
  const isLoadingList = transactionListStatus === "loading";

  useEffect(() => {
    if (!router.isReady || !staffId || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["staffId"] = staffId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchStaffTransactionList(params));
  }, [accessToken, staffId, startDate, endDate, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["page"] = page;
    params["staffId"] = staffId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchStaffTransactionList(params));
  }

  const [isDownloading, setIsDownloading] = useState(false);
  async function downloadExcel() {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    params["staffId"] = staffId;

    try {
      setIsDownloading(true);
      await store.dispatch(fetchStaffTransactionListExcel(params)).unwrap();
    } catch (e) {
      console.warn(e);
    } finally {
      setIsDownloading(false);
    }
  }

  async function recalculateCommissions({ titemId = null } = {}) {
    let params = {};

    params["accessToken"] = accessToken;
    params["staffId"] = staffId;

    if (titemId) {
      params["titemId"] = titemId;
    }

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    try {
      setIsRecalculating(true);

      await store.dispatch(recalculateStaffCommission(params)).unwrap();

      params = {};
      params["accessToken"] = accessToken;
      params["staffId"] = staffId;

      if (startDate) {
        params["startDate"] = startDate;
      }
      if (endDate) {
        params["endDate"] = endDate;
      }

      store.dispatch(fetchStaffTransactionList(params));

      showNotification({
        title: "success",
        message: "Recalculated commissions successfully",
        color: "green",
      });
    } catch (e) {
      showNotification({
        title: "success",
        message: e?.message ?? "Could not recalculate commissions",
        color: "green",
      });
    } finally {
      setIsRecalculating(false);
    }
  }

  const actions = (
    <div className="flex flex-row gap-2">
      <Button
        leftIcon={<IconTableExport size={16} />}
        variant="outline"
        loading={isDownloading}
        onClick={downloadExcel}
        size="xs"
      >
        Export
      </Button>

      <Button
        leftIcon={<IconCalculator size={16} />}
        onClick={() => recalculateCommissions()}
        loading={isRecalculating}
        variant="outline"
        size="xs"
      >
        Recalculate Commissions
      </Button>
    </div>
  );

  return (
    <div className="h-full w-full bg-white rounded-xl px-6 py-8 space-y-2">
      <TableCardHeader actions={actions}>
        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />
      </TableCardHeader>

      {!isLoadingList && (
        <Table>
          <Thead className="bg-gray-50">
            <tr>
              <th scope="col" className="th-primary">
                ID
              </th>
              <th scope="col" className="th-primary">
                ITEM
              </th>
              <th scope="col" className="th-primary">
                QUANTITY
              </th>
              <th scope="col" className="th-primary">
                TOTAL
              </th>
              <th scope="col" className="th-primary">
                COMMISSION
              </th>
              <th scope="col" className="th-primary">
                DISCOUNT
              </th>
              <th scope="col" className="th-primary">
                CLIENT
              </th>
              <th scope="col" className="th-primary">
                DATE
              </th>
              <th scope="col" className="th-primary">
                ACTION
              </th>
            </tr>
          </Thead>
          <tbody>
            {transactionList?.data?.map((item) => (
              <Trow className="bg-white border-b" key={item.id}>
                <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {item?.id}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.referenceable?.sellable?.sellable?.name}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.referenceable?.quantity}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.referenceable?.total}
                </td>
                <td className="py-3 px-6 text-sm text-right">
                  {formatNumber(item?.amount)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.referenceable?.discount}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.referenceable?.transaction?.client?.name ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {formatDate(item?.date)}
                </td>

                <td className="py-0 pl-14 2xl:pl-4">
                  <span className="flex justify-end items-center w-full gap-2">
                    <Button
                      leftIcon={<IconCalculator size={16} />}
                      onClick={() =>
                        recalculateCommissions({
                          titemId: item?.referenceable_id,
                        })
                      }
                      loading={isRecalculating}
                      variant="outline"
                      size="xs"
                    >
                      Recalculate
                    </Button>
                  </span>
                </td>
              </Trow>
            ))}

            <Trow className="bg-white border-b">
              <th scope="row" colSpan="3">
                GRAND TOTAL
              </th>
              <td className="text-right text-dark tracking-wider text-xl font-bold">
                {formatNumber(transactionList?.titem_total)}
              </td>
              <td className="text-right text-dark tracking-wider text-xl font-bold">
                {formatNumber(transactionList?.sum_total)}
              </td>
            </Trow>
          </tbody>
        </Table>
      )}
      {isLoadingList && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={transactionList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </div>
  );
}

export default StaffTransactionListView;
