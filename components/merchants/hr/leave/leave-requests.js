import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState,Fragment } from "react";
import { useSession } from "next-auth/react";
import { parseValidFloat, parseValidInt,formatDate } from "../../../../lib/shared/data-formatters";
import { Button, Menu,Card } from "@mantine/core";
import {
  IconChevronDown,
  IconCheckbox
} from "@tabler/icons-react";
import Link from "next/link";
import store from "../../../../src/store/Store";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Table,Thead,Trow,TDateFilter,TSearchFilter } from "../../../ui/layouts/scrolling-table";
import RequestLeave from "../../../partners/staffs/request-leave-modal";
import { getDateFilterFrom,getDateFilterTo } from "../../../../lib/shared/data-formatters";
import { fetchLeaveRequests } from "../../../../src/store/merchants/hr/hr-slice";

function LeaveRequestList() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
    const [startDate, setStartDate] = useState(getDateFilterFrom(30));
    const [endDate, setEndDate] = useState(getDateFilterTo());


    

    const leaveRequestList = useSelector(
      (state) => state.hr.leave_request_list
    );

    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["branch_id"] = branch_id;

        store.dispatch(fetchLeaveRequests(params));
      }, [session, status,branch_id]);

   

      const actions = (
        <Fragment>
          <div className="btn-group">
            {/* {isUserMerchant && ( */}
              <RequestLeave/>
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
             Staff
            </th>
            <th scope="col" className="th-primary ">
              TYPE
            </th>
            <th scope="col" className="th-primary">
              Start Date
            </th>
            <th scope="col" className="th-primary ">
              End Date
            </th>
            <th scope="col" className="th-primary ">
              Comments
            </th>
            <th scope="col" className="th-primary ">
              Date Requested
            </th>
            <th scope="col" className="th-primary ">
              Actions
            </th>



          </tr>
        </Thead>
        <tbody>

        {leaveRequestList &&
              leaveRequestList?.data?.map((item) => (
                <Trow key={item.id}>

                  <td>{item?.staff?.name ?? "-"}</td>
                  <td>{item?.leave?.name ?? "-"}</td>
                  <td>{item?.start_date ?? "-"}</td>
                  <td>{item?.end_date ?? "-"}</td>
                  <td>{item?.comment ?? "-"}</td>
                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>

                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        variant="outline"
                      >
                        <Menu.Target>
                          <Button
                            rightIcon={<IconChevronDown size={14} />}
                            size="xs"
                          >
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>#</Menu.Label>
                          <Link
                            href={`#`}
                          >
                            <Menu.Item
                              color="blue"
                              icon={<IconCheckbox size={15} />}
                            >
                              APPROVE
                            </Menu.Item>
                          </Link>
                        </Menu.Dropdown>
                      </Menu>
                    </span>
                  </td>
                
                </Trow>
              ))}




                 
              

        </tbody>
      </Table>
         
        </Card>


      )

}
export default LeaveRequestList;