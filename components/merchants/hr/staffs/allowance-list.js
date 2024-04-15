import { useDispatch, useSelector } from "react-redux";
import {Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { parseValidFloat, formatDate } from "../../../../lib/shared/data-formatters";
import { Button, Checkbox, Select, Textarea, TextInput,FileInput,Card } from "@mantine/core";
import { fetchStaffAllowances } from "../../../../src/store/partners/staff-slice";
import Link from "next/link";
import { DatePicker } from "@mantine/dates";
import store from "../../../../src/store/Store";
import { showNotification } from "@mantine/notifications";
import { fetchStaffAttendance } from "../../../../src/store/partners/staff-slice";
import { Table,Thead,Trow } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import RemoveAllowanceModal from "./remove-allowance";
import EditAllowance from "./edit-allowance";
function AllowanceListTab() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
    const [selected_staff, setStaffId] = useState(selected_staff);



    const allowanceStatus = useSelector((state) => state.staff.staffAllowanceStatus);

    const staff_id = useSelector((state)=>state.staff.current_staff_id);

    const staff_allowances_list = useSelector((state)=>state.staff.staffAllowanceList);

    const isLoadingList = allowanceStatus === "loading";

    const dataStatus = useSelector((state) => state.branches.submitBranchStatus);


    // console.log("Staff Id At Financial Stage " + staff_id);
    const staffsList = useSelector(
      (state) => state.staff.staff_attendance_list
    );

    let options = staffsList?.map((staff) => ({
      value: staff?.id,
      label: staff?.name,
    }));

    console.log(staffsList);

    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }

      const params = {};
      params["accessToken"] = session?.user?.accessToken;
      params["branch_id"] = "All";

      store.dispatch(fetchStaffAttendance(params));


    }, [dataStatus, session, status]);



    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["staffId"] =  selected_staff;

        console.log("The selected staff is " + selected_staff);

        store.dispatch(fetchStaffAllowances(params));
      }, [session, status,staff_id,selected_staff]);

    //   const actions = (
    //     <Fragment>
    //       <ActionIconButton
    //         icon="fa-solid fa-arrows-rotate"
    //         tooltip="Refresh"
    //         clickHandler={refreshList}
    //       />
    //       </Fragment>
    // )

    function onPaginationLinkClicked(page) {
        if (!page) {
          return;
        }

        const params = {};
        params["accessToken"] = session?.user?.accessToken;
        params["page"] = page;
        params["staffId"] = staff_id ?? selected_staff;


        store.dispatch(fetchStaffAllowances(params));
      }


      return (

        <Card>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end">
            <Select
            placeholder="Staff"
            label="Choose Staff"
            value={selected_staff}
            onChange={setStaffId}
            data={options}
            searchable
            clearable
          />
          </div>
        <Table>
          <Thead>
            <tr>

              <th scope="col" className="th-primary">
                NAME
              </th>
              <th scope="col" className="th-primary">
                AMOUNT
              </th>
              <th scope="col" className="th-primary">
                ADDED ON
              </th>
              <th scope="col" className="th-primary">
                ACTION
              </th>
            </tr>
          </Thead>
          <tbody>
            {staff_allowances_list &&
              staff_allowances_list?.data?.map((item) => (
                <Trow key={item.id}>

                  <td>{item?.name ?? "-"}</td>
                  <td>{item?.amount ?? "-"}</td>
                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>

                  <td className="py-0 pl-14 2xl:pl-4">

                      <span className="flex justify-end items-center w-full gap-2">
                        <EditAllowance allowance={item} />

                        <RemoveAllowanceModal item={item} />

                      </span>

                  </td>
                  <td></td>
                </Trow>
              ))}
          </tbody>
        </Table>

        {isLoadingList && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={staff_allowances_list}
          onLinkClicked={onPaginationLinkClicked}
        />
        </Card>


      )

}
export default AllowanceListTab;