import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState,Fragment } from "react";
import { useSession } from "next-auth/react";
import { Button, Menu,Card } from "@mantine/core";
import { getStaffRoles } from "../../../../src/store/partners/staff-slice";
import Link from "next/link";
import { DatePicker } from "@mantine/dates";
import store from "../../../../src/store/Store";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Table,Thead,Trow,TDateFilter,TSearchFilter } from "../../../ui/layouts/scrolling-table";
import { getDateFilterFrom,getDateFilterTo } from "../../../../lib/shared/data-formatters";
import ApprovePayrollModal from "./approve-payroll-modal";


function PayrollListView() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
    const [startDate, setStartDate] = useState(getDateFilterFrom(30));
    const [endDate, setEndDate] = useState(getDateFilterTo());

    const payroll_status = useSelector((state)=> state.staff.show_payroll)




    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;

        store.dispatch(getStaffRoles(params));
      }, [session, status]);

      let departments =
      [
        { label: "Department One", value: "Department One" },
        { label: "Department Two", value: "Department Two" },
        { label: "Department Three", value: "Department Three" },
      ] ?? [];

    let payments_freq =
      [
        { label: "Monthly", value: "Monthly" },
        { label: "Weekly", value: "Weekly" },
      ] ?? [];

      const actions = (
        <Fragment>
          <div className="btn-group">
            {/* {isUserMerchant && ( */}
            <Link href={`/merchants/partners/staffs-payroll`}>
          <Button
            size="xs"
            variant="filled"
            className="ml-2"
            
          >
            Create Payroll
          </Button>
        </Link>
            {/* )} */}


          </div>
        </Fragment>
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
              MONTH/YEAR
            </th>
            <th scope="col" className="th-primary">
             START DATE
            </th>
            <th scope="col" className="th-primary ">
              END DATE
            </th>
            <th scope="col" className="th-primary ">
              BRANCHES
            </th>


            <th scope="col" className="th-primary text-left">
              ACTION
            </th>
          </tr>
        </Thead>
        <tbody>

           {payroll_status && (
               <Trow>
               <>
                 <td className="th-primary"> 12/2023</td>
                 <td className="th-primary text-left">20/12/2023</td>

                 <td className="th-primary text-left">
                   22/12/2023
                 </td>
                 <td className="th-primary text-left">
                   MAIN
                 </td>



                 <td className="th-primary text-left">
                     <ApprovePayrollModal/>

                 </td>
               </>
             </Trow>
           )}

        </tbody>
      </Table>

        </Card>


      )

}
export default PayrollListView;