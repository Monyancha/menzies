import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchStaffIncomeExcel,
  fetchStaffIncomeList,
  fetchTargetCommissionIncome,
  voidStaffIncome,
} from "@/store/merchants/partners/staff-slice";
import store from "@/store/store";
import { useRouter } from "next/router";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
} from "@/components/ui/layouts/scrolling-table";
import Card from "@/components/ui/layouts/card";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import ActionIconButton from "@/components/ui/actions/action-icon-button";
import ConfirmationModal from "@/components/ui/display/confirmation-modal";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

function StaffTargetsIncomeListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const staffId = router?.query?.staffId;

  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const incomeListStatus = useSelector(
    (state) => state.staff.targetCommissionIncomeStatus
  );

  const excelLoading = useSelector(
    (state) => state.staff.staffIncomeExcelStatus === "loading"
  );

  const incomeList = useSelector((state) => state.staff.targetCommissionIncome);
  const isLoading = incomeListStatus === "loading";

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletingModal, setShowDeletingModal] = useState(false);
  const [deletionModalText, setDeletionModalText] = useState(false);
  const [deletionCallback, setDeletionCallback] = useState({
    callback: () => {},
  });

  async function deleteRecord(recordId) {
    try {
      setIsDeleting(true);

      await store.dispatch(voidStaffIncome({ accessToken, recordId }));

      showNotification({
        title: "Success",
        message: "Record voided successfully",
        color: "green",
      });

      // ==================================================================
      // Refetch records
      // ==================================================================
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["staffId"] = staffId;

      if (startDate) {
        params["startDate"] = startDate;
      }
      if (endDate) {
        params["endDate"] = endDate;
      }

      store.dispatch(fetchStaffIncomeList(params));
      // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    } catch (e) {
      showNotification({
        title: "Warning",
        message: e?.message ?? "Could not void record",
        color: "orange",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    if (!router.isReady || !staffId || !session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["staffId"] = staffId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchTargetCommissionIncome(params));
  }, [startDate, endDate, session, status, staffId, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["staffId"] = staffId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchTargetCommissionIncome(params));
  }

  function downloadExcel() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    params["staffId"] = staffId;
    store.dispatch(fetchStaffIncomeExcel(params));
  }

  const actions = (
    <>
      <ActionIconButton
        icon="fa-solid fa-file-export"
        isLoading={excelLoading}
        tooltip="Export"
        clickHandler={downloadExcel}
      />
    </>
  );

  return (
    <Card>
      <>
        <TableCardHeader>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </TableCardHeader>

        <Table>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="th-primary">
                ID
              </th>
              <th scope="col" className="th-primary">
                TARGET
              </th>
              <th scope="col" className="th-primary text-right">
                TIER
              </th>
              <th scope="col" className="th-primary text-right">
                ACHIEVED (KES)
              </th>
              <th scope="col" className="th-primary text-right">
                DIVISOR
              </th>
              <th scope="col" className="th-primary text-right">
                COMMISSION
              </th>
              <th scope="col" className="th-primary text-right">
                CREATED AT
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              incomeList?.data?.map((item) => (
                <Trow className="bg-white border-b" key={item.id}>
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.id}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item?.target?.name}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {`${item?.tier?.from} - ${item?.tier?.to}`}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {item?.achieved_amount}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {item?.divisor}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {item?.commission}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatDate(item?.created_at)}
                  </td>
                </Trow>
              ))}

            {!isLoading && (
              <>
                <Trow className="bg-white border-b">
                  <th scope="row" colSpan="2">
                    TOTAL
                  </th>
                  <td className="text-right text-dark tracking-wider text-xl font-bold">
                    {formatNumber(incomeList?.total)}
                  </td>
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
          paginatedData={incomeList}
          onLinkClicked={onPaginationLinkClicked}
        />
      </>
    </Card>
  );
}

export default StaffTargetsIncomeListView;
