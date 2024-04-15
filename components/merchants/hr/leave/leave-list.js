import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState,Fragment } from "react";
import { useSession } from "next-auth/react";
import { formatDate } from "../../../../lib/shared/data-formatters";
import { Button, Menu,Card } from "@mantine/core";
import store from "../../../../src/store/Store";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Table,Thead,Trow,TDateFilter,TSearchFilter } from "../../../ui/layouts/scrolling-table";
import { fetchLeaveList } from "../../../../src/store/merchants/hr/hr-slice";
import { getDateFilterFrom,getDateFilterTo } from "../../../../lib/shared/data-formatters";
import NewLeaveModal from "../../../partners/staffs/new-leave-modal";

function LeaveListView() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
    const [startDate, setStartDate] = useState(getDateFilterFrom(30));
    const [endDate, setEndDate] = useState(getDateFilterTo());

    const leaveList = useSelector(
      (state) => state.hr.leave_list
    );




    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;

        store.dispatch(fetchLeaveList(params));
      }, [session, status]);

     

      const actions = (
        <Fragment>
          <div className="btn-group">
            {/* {isUserMerchant && ( */}
              {/* <RequestLeave/> */}
              <NewLeaveModal/>
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
              Date
            </th>
          
            



          </tr>
        </Thead>
        <tbody>
        {leaveList &&
              leaveList?.data?.map((item) => (
                <Trow key={item.id}>

                  <td>{item?.name ?? "-"}</td>
                 
                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>

                
                
                </Trow>
              ))}

        </tbody>
      </Table>
         
        </Card>


      )

}
export default LeaveListView;