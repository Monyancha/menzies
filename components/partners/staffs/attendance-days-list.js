import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
  TSearchFilter,
} from "../../../ui/layouts/scrolling-table";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Menu, Button, Select } from "@mantine/core";
import MakePaymentModal from "./make-payment-modal";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Fragment } from "react";
import Link from "next/link";
import DeleteStaffModal from "./delete-staff-modal";
import { fetchStaffAttendanceDays } from "@/store/merchants/partners/staff-slice";
import { fetchStaffList } from "@/store/merchants/partners/staffs-slice";
import {
  formatNumber,
  parseValidFloat,
  getDateFilterFrom,
  getDateFilterTo,
  formatDate,
} from "../../../../lib/shared/data-formatters";

import MakeDeductionModal from "./make-deduction-modal";
import { isMerchant } from "@/lib/shared/roles_and_permissions";
function AttendanceDaysList() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [start_date, setStartDate] = useState(getDateFilterFrom(30));
  const [end_date, setEndDate] = useState(getDateFilterTo());

  const staff_attendance_days = useSelector(
    (state) => state.staff.staff_attendance_days
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.staff.getStaffAttendanceDaysStatus === "loading"
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (start_date) {
      params["start_date"] = start_date;
    }
    if (end_date) {
      params["end_date"] = end_date;
    }

    store.dispatch(fetchStaffAttendanceDays(params));
  }, [branch_id, session, status, searchTerm, start_date, end_date]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (start_date) {
      params["start_date"] = start_date;
    }
    if (end_date) {
      params["end_date"] = end_date;
    }

    store.dispatch(fetchStaffAttendanceDays(params));
  }

  const actions = <TSearchFilter onChangeSearchTerm={setSearchTerm} />;

  return (
    <Card>
      <TableCardHeader actions={actions}>
        <TDateFilter
          startDate={start_date}
          endDate={end_date}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />
      </TableCardHeader>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

     <div className="mb-4">
     <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary ">
              No Of Days Attended
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            staff_attendance_days?.data?.map((item) => (
              <Trow key={item?.id}>
                <>
                  <td>{item?.name}</td>
                  <td>{item?.staff_attendances_count ?? 0}</td>
                </>
              </Trow>
            ))}
        </tbody>
      </Table>
     </div>

      <PaginationLinks
        paginatedData={staff_attendance_days}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default AttendanceDaysList;
