import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { TSearchFilter } from "../../../ui/layouts/scrolling-table";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Menu, Button, Select, Tabs, ScrollArea } from "@mantine/core";
import MakePaymentModal from "./make-payment-modal";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Fragment } from "react";
import Link from "next/link";
import DeleteStaffModal from "./delete-staff-modal";
import { fetchStaffAttendance } from "@/store/merchants/partners/staff-slice";
import { fetchShiftList } from "@/store/merchants/partners/shift-slice";
import { formatDateNoTime } from "@/lib/shared/data-formatters";
import { IconUser, IconCash, IconCashBanknote } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import moment from "moment";


import { isMerchant } from "@/lib/shared/roles_and_permissions";
function ShiftCalendarView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("bio");

  const [month, setMonth] = useState("");
  const [selected_date,setDate] = useState();
  const [set_date,sDt] = useState(new Date());

  const staff_attendance_list = useSelector(
    (state) => state.staff.staff_attendance_list
  );

  const month_date_ranges = useSelector(
    (state) => state.staff.month_date_ranges
  );
  const month_start_end_dates = useSelector(
    (state) => state.staff.month_start_end_dates
  );

  const shift_list = useSelector((state) => state.shift.shift_list);
  const staff_shifts = useSelector((state) => state.shift.staff_shifts);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.shift.fetchShiftListStatus === "loading"
  );

  const staffsList = useSelector((state) => state.staffs.fetchStaffList);

  const setSelectedDate = (date) => {
    let dt = moment(date).format("YYYY-MM-DD");
     setDate(dt);
     sDt(dt);

  }



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

    if(selected_date)
    {
      params["selected_date"] = selected_date
    }

    store.dispatch(fetchStaffAttendance(params));
    store.dispatch(fetchShiftList(params));
  }, [branch_id, session, status, searchTerm, month,selected_date]);

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

  const shifts = ["Day", "Night"];

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
  const color = "blue";

  const actions = (
    <Fragment>
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </Fragment>
  );

  return (
    <div className="w-full">
      <div className="flex items-center mb-3 space-x-4">
        <DatePicker
        label="Choose Date"
        onChange={(e)=>{setSelectedDate(e)}}
        value={set_date}

        />
      </div>
      <div className="relative z-0 grid auto-cols-[14rem] grid-flow-col gap-24 overflow-x-auto overflow-y-auto">
        {month_date_ranges &&
          month_date_ranges.map((dat, ind) => (
            <Button key={ind} color={color} variant="filled" onClick={()=>setSelectedDate(dat)}>
              {formatDateNoTime(dat)}
            </Button>
          ))}
      </div>
      <div className="flex justify-center space-x-4">
        {set_date && (
          <h2 className="text-4xl font-extrabold dark:text-dark">{formatDateNoTime(set_date)}</h2>

        )}
      </div>
       {!isLoading && (
      <div className={`grid grid-flow-col  auto-cols-[14rem]  overflow-x-auto overflow-y-auto sm:grid-cols-1 md:grid-cols-2 divide-x-4 space-x-2`}>
        {shift_list &&
          shift_list?.map((dat, ind) => (
            <div key={ind} className=" py-5">
              <div className="flex justify-center space-x-4">

                <h2 className="text-4xl font-extrabold dark:text-dark">{dat?.name}</h2>
              </div>
              <div className={`flex justify-between space-x-3 p-2 divide-y-3 text-md font-bold`}>
                <span> Staff</span>
                            <span>Check In</span>
                            <span>Check Out</span>
                            </div>

              <div className="">
                {staff_shifts &&
                  staff_shifts?.map((shif, inc) => (
                    <div key={inc} className="grid grid-flow-row divide-x-2">
                      {dat.id === shif.shift_id && (
                        <div className={`border-spacing-2 border-b-2`}>
                          <div className="flex justify-between space-x-3 p-2 divide-y-3 text-sm font-serif">
                          <div className={`min-w-full`}>
                          <span className="text-center">
                              {shif?.staff_name}
                            </span>
                          </div>
                            {dat?.shift_attendances?.length > 0 ? dat?.shift_attendances?.map((sh_att,ind)=> (
                                   <div key={ind} className="flex items-start space-x-3 max-w-fit">
                                    <span className="font-semibold">{sh_att?.time_in ? new Date(sh_att?.time_in).toLocaleTimeString("en-US") : "-" }</span>
                                    </div>

                            )) : ( <div className="flex items-start space-x-3 max-w-fit">
                                    <span className="font-semibold">___</span>
                                    </div>)}
                                  {dat?.shift_attendances?.length > 0 ? dat?.shift_attendances?.map((sh_att,indx)=> (
                                    <div key={indx} className="flex items-start space-x-3 max-w-fit">
                                    <span className="font-semibold">{sh_att?.time_out ? new Date(sh_att?.time_out).toLocaleTimeString("en-US") : "-" }</span>
                                    </div>

                            )) : ( <div className="flex items-start space-x-3 max-w-fit">
                                    <span className="font-semibold">___</span>
                                    </div>)}


                            </div>

                          <div className={`flex items-start p-7`}>

                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
      )}
      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      {/* <Tabs.Tab value="transactions" icon={<IconCash size={14} />}>
                Transactions
              </Tabs.Tab>
              <Tabs.Tab value="income" icon={<IconCashBanknote size={14} />}>
                Income
              </Tabs.Tab>
              <Tabs.Tab value="targets">Targets Income</Tabs.Tab> */}
    </div>
  );
}

export default ShiftCalendarView;
