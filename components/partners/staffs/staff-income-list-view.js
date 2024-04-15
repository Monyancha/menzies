import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchStaffIncomeExcel,
  fetchStaffIncomeList,
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

function StaffIncomeListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const staffId = router?.query?.staffId;

  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const incomeListStatus = useSelector(
    (state) => state.staff.staffIncomeListStatus
  );

  const excelLoading = useSelector(
    (state) => state.staff.staffIncomeExcelStatus === "loading"
  );

  const incomeList = useSelector((state) => state.staff.staffIncomeList);
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

    store.dispatch(fetchStaffIncomeList(params));
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

    store.dispatch(fetchStaffIncomeList(params));
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
        <TableCardHeader actions={actions}>
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
                TYPE
              </th>
              <th scope="col" className="th-primary text-right">
                AMOUNT
              </th>
              <th scope="col" className="th-primary">
                REFERENCE TYPE
              </th>
              <th scope="col" className="th-primary">
                REFERENCE ID
              </th>
              <th scope="col" className="th-primary">
                NOTES
              </th>
              <th scope="col" className="th-primary">
                DATE
              </th>
              <th scope="col" className="th-primary text-right">
                ACTIONS
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
                    {item?.type === "debit" ? "in" : "out"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {item?.amount}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item?.reference_type}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item?.referenceable_id}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item?.notes?.substring(0, 30) ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item?.date}
                  </td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <ActionIcon
                        color="red"
                        variant="outline"
                        size="md"
                        loading={isDeleting}
                        onClick={() => {
                          setShowDeletingModal(true);
                          setDeletionModalText(`Void payment #${item.id}?`);
                          setDeletionCallback({
                            callback: () => deleteRecord(item.id),
                          });
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </span>
                  </td>
                </Trow>
              ))}

            {!isLoading && (
              <>
                <Trow className="bg-white border-b">
                  <th scope="row" colSpan="2">
                    IN TOTAL
                  </th>
                  <td className="text-right text-dark tracking-wider text-xl font-bold">
                    {formatNumber(incomeList?.sum_debit)}
                  </td>
                </Trow>

                <Trow className="bg-white border-b">
                  <th scope="row" colSpan="2">
                    OUT TOTAL
                  </th>
                  <td className="text-right text-dark tracking-wider text-xl font-bold">
                    {formatNumber(incomeList?.sum_credit)}
                  </td>
                </Trow>

                <Trow className="bg-white border-b">
                  <th scope="row" colSpan="2">
                    GRAND TOTAL
                  </th>
                  <td className="text-right text-dark tracking-wider text-xl font-bold">
                    {formatNumber(incomeList?.sum_total)}
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

        <ConfirmationModal
          opened={showDeletingModal}
          setOpened={setShowDeletingModal}
          title="Void Payment?"
          text={deletionModalText}
          loading={isDeleting}
          onCancel={() => {
            showNotification({
              title: "Info",
              message: "Operation Cancelled",
              color: "blue",
            });
          }}
          onProceed={deletionCallback?.callback}
        />
      </>
    </Card>
  );
}

export default StaffIncomeListView;
