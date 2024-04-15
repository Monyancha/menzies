import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import {
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
import { fetchStaffAttendance } from "@/store/merchants/partners/staff-slice";
import { formatDateNoTime } from "@/lib/shared/data-formatters";

import { isMerchant } from "@/lib/shared/roles_and_permissions";
function AttendanceMonthlyListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const [month, setMonth] = useState("");

  const staff_attendance_list = useSelector(
    (state) => state.staff.staff_attendance_list
  );

  const month_date_ranges = useSelector(
    (state) => state.staff.month_date_ranges
  );
  const month_start_end_dates = useSelector(
    (state) => state.staff.month_start_end_dates
  );

  console.log(month_date_ranges);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.staff.getStaffAttendanceStatus === "loading"
  );

  const staffsList = useSelector((state) => state.staffs.fetchStaffList);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["branch_id"] = branch_id;
    params["view"] = "monthly";

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (month) {
      params["month"] = month;
    }

    store.dispatch(fetchStaffAttendance(params));
  }, [branch_id, session, status, searchTerm, month]);

  const days = [
    { name: "Monday", id: 1 },
    { name: "Tuesday", id: 2 },
    { name: "Wednesday", id: 3 },
    { name: "Thursday", id: 4 },
    { name: "Friday", id: 5 },
    { name: "Saturday", id: 6 },
    { name: "Sunday", id: 0 },
  ];

  const months = [
    { label: "JANUARY", value: 1 },
    { label: "FEBRUARY", value: 2 },
    { label: "MARCH", value: 3 },
    { label: "APRIL", value: 4 },
    { label: "MAY", value: 5 },
    { label: "JUNE", value: 6 },
    { label: "JULY", value: 7 },
    { label: "AUGUST", value: 8 },
    { label: "SEPTEMBER", value: 9 },
    { label: "OCTOBER", value: 10 },
    { label: "NOVEMBER", value: 11 },
    { label: "DECEMBER", value: 12 },
  ];

  function startOfWeek(date) {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    const options = {
      dateStyle: "medium",
    };
    return new Date(date.setDate(diff)).toLocaleString("en-GB", options);
  }

  function endOfWeek(date) {
    const options = {
      dateStyle: "medium",
    };

    var lastday = date.getDate() - (date.getDay() - 1) + 6;
    return new Date(date.setDate(lastday)).toLocaleString("en-GB", options);
  }

  const actions = (
    <Fragment>
      <div className="flex justify-between mt-4 space-x-2 mr-2">
      <span className="text-sm text-black-100">

START :{month_start_end_dates[0]}
</span>{" "}
<span className="text-sm text-black-100">
  {" "}

  END :{month_start_end_dates[1]}
</span>{" "}

      </div>
      <div className="mt-3">


      </div>

      <TSearchFilter onChangeSearchTerm={setSearchTerm} />



    </Fragment>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
        <Select
          label="MONTH"
          data={months}
          searchable
          clearable
          onChange={(e) => setMonth(e)}
          className="p-2"
        />

      </TableCardHeader>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <div className="overflow-y-scroll overflow-x-scroll max-h-96 overflow-hidden mt-3">
        <table className="table-auto">
          <thead className="bg-white border-b sticky top-0 overflow-hidden z-40">
            <tr className="text-left divide-x-2 divide-y-2">
              <th className="p-10 sticky left-0 bg-white ">Day</th>
              {staff_attendance_list &&
                staff_attendance_list &&
                staff_attendance_list?.map((staff, index) => (
                  <th scope="col" className="th-primary" key={index}>
                    <p>{staff?.name ?? "-"}</p>
                    <p className="text-xs">{staff.no_of_days}</p>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="overflow-hidden">
            {month_date_ranges &&
              month_date_ranges.map((dat, ind) => (
                <tr key={ind} className="border-b divide-x-2 ">
                  <td className="sticky left-0 z-30 ">
                  <p className="text-xs space-x-4 p-5 bg-white">
                    {dat}
                    </p>
                    </td>

                  {staff_attendance_list &&
                    staff_attendance_list &&
                    staff_attendance_list?.map((staff, inx) => (
                      <td key={inx}>
                        {staff?.staff_attendances.length > 0 &&
                          staff?.staff_attendances?.map((attendance, ina) => (
                            <div key={ina}>
                              {/*
{attendance?.time_in} */}

                              {attendance?.attendance_date === dat && (
                                <div className="p-2">
                                  <p className="text-xs">
                                    {" "}
                                    Time In :{" "}
                                    {attendance?.time_in
                                      ? new Date(
                                          attendance?.time_in
                                        ).toLocaleTimeString("en-US")
                                      : "-"}{" "}
                                  </p>

                                  <p className="text-xs">
                                    Time Out :{" "}
                                    {attendance?.time_out
                                      ? new Date(
                                          attendance?.time_out
                                        ).toLocaleTimeString("en-US")
                                      : "-"}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default AttendanceMonthlyListView;
