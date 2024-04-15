import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState,Fragment } from "react";
import { useSession } from "next-auth/react";
import { Button, Menu,Card } from "@mantine/core";
import store from "../../../../src/store/Store";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Table,Thead,Trow,TDateFilter,TSearchFilter } from "../../../ui/layouts/scrolling-table";
import { getDateFilterFrom,getDateFilterTo } from "../../../../lib/shared/data-formatters";
import NewDepartmentModal from "./new-department-modal";
import { fetchStaffDepartments } from "../../../../src/store/partners/staff-slice";

function DepartmentListView() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
    const [startDate, setStartDate] = useState(getDateFilterFrom(30));
    const [endDate, setEndDate] = useState(getDateFilterTo());

    const departmentsList = useSelector(
      (state) => state.staff.staff_departments_list
    );




    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;

        store.dispatch(fetchStaffDepartments(params));
      }, [session, status]);

      let departments =
      [
        { label: "Accounting", value: "Accounting" },
        { label: "Sales", value: "Sales" },
        { label: "Procurement", value: "Procurement" },
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
              <NewDepartmentModal/>
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
              Name
            </th>
            <th scope="col" className="th-primary">
              No Of Staff
            </th>


            {/* <th scope="col" className="th-primary text-right">
              ACTIONS
            </th> */}
          </tr>
        </Thead>
        <tbody>

          {departmentsList && departmentsList?.data?.map((item)=>(

<Trow key={item?.id}>
<>
  <td>{item?.name}</td>
  <td>{item?.staffs_count}</td>
  {/* <td className="py-0 pl-14 2xl:pl-4">
    0
  </td> */}
</>
</Trow>

          ))}

              

           
          

        </tbody>
      </Table>

        </Card>


      )

}
export default DepartmentListView;