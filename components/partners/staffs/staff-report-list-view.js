import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { TextInput } from "@mantine/core";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  formatNumber,
  parseValidFloat,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import Card from "@/components/ui/layouts/card";
import {
  Table,
  Thead,
  Trow,
  TSearchFilter,
  TDateFilter,
} from "@/components/ui/layouts/scrolling-table";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import ActionIconButton from "@/components/ui/actions/action-icon-button";
import {
  fetchAllStaffIncome,
  fetchAllStaffIncomeExcel,
} from "@/store/merchants/partners/staff-slice";

function StaffReportListview() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const staffIncomeList = useSelector(
    (state) => state.staff.allStaffIncomeList
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.staff.allStaffIncomeListStatus === "loading"
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

    store.dispatch(fetchAllStaffIncome(params));
  }, [branch_id, session, status, searchTerm, startDate, endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

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

    store.dispatch(fetchAllStaffIncome(params));
  }

  const sum_db_cr = (db, cr) => parseValidFloat(db) - parseValidFloat(cr);

  const excelLoading = useSelector(
    (state) => state.staff.staffIncomeAllExcelStatus === "loading"
  );

  function downloadExcel() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    store.dispatch(fetchAllStaffIncomeExcel(params));
  }

  const actions = (
    <div className="flex items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
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
              NO
            </th>
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary ">
              COMMISSIONS
            </th>
            <th scope="col" className="th-primary ">
              SALARY
            </th>
            <th scope="col" className="th-primary ">
              RENT
            </th>
            <th scope="col" className="th-primary ">
              TOTAL IN
            </th>
            <th scope="col" className="th-primary ">
              TOTAL OUT
            </th>
            <th scope="col" className="th-primary ">
              BALANCE OWED
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            staffIncomeList?.data?.map((item) => (
              <Trow key={item?.id}>
                <>
                  <td>{item?.id}</td>
                  <td>{item?.name}</td>

                  <td>
                    {formatNumber(
                      sum_db_cr(item?.titem_debit_sum, item?.titem_credit_sum)
                    )}
                  </td>
                  <td>{formatNumber(item?.salary ?? 0)}</td>
                  <td>{formatNumber(item?.rent ?? 0)}</td>

                  <td className="text-right">
                    {formatNumber(item?.debit_sum)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.credit_sum)}
                  </td>

                  <td className="text-right">
                    {formatNumber(sum_db_cr(item?.debit_sum, item?.credit_sum))}
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

      <PaginationLinks
        paginatedData={staffIncomeList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default StaffReportListview;
