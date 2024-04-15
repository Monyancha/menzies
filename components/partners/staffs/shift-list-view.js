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
import { Menu, Button, TextInput } from "@mantine/core";
import MakePaymentModal from "./make-payment-modal";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Fragment } from "react";
import Link from "next/link";
import DeleteStaffModal from "./delete-staff-modal";
import { fetchShiftList } from "@/store/merchants/partners/shift-slice";
import {
  formatNumber,
  parseValidFloat,
  getDateFilterFrom,
  getDateFilterTo,
  formatDateNoTime,
} from "../../../../lib/shared/data-formatters";
import {
  IconEye,
  IconPencil,
  IconChevronDown,
  IconSquareMinus,
  IconSquarePlus,
  IconTrash,
  IconAccessPoint,
} from "@tabler/icons";
import { isMerchant } from "@/lib/shared/roles_and_permissions";
function ShiftListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const shift_list = useSelector((state) => state.shift.shift_list);

  const fetchShiftListStatus = useSelector(
    (state) => state.shift.fetchShiftListStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.shift.fetchShiftListStatus === "loading"
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

    store.dispatch(fetchShiftList(params));
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

    store.dispatch(fetchShiftList(params));
  }

  const actions = <TSearchFilter onChangeSearchTerm={setSearchTerm} />;

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
            {/* <th scope="col" className="th-primary ">
              START DATE
            </th>
            <th scope="col" className="th-primary ">
              END DATE
            </th> */}
            <th scope="col" className="th-primary ">
              START TIME
            </th>
            <th scope="col" className="th-primary ">
              END TIME
            </th>
            <th scope="col" className="th-primary ">
              ACTION
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            shift_list?.map((item) => (
              <Trow key={item?.id}>
                <>
                  <td>{item?.id}</td>
                  <td>{item?.name}</td>

                  {/* <td>{formatDateNoTime(item?.start_date)}</td>
                  <td>{formatDateNoTime(item?.end_date)}</td> */}
                  <td>
                    {new Date(item?.start_time).toLocaleTimeString("en-US")}
                  </td>

                  <td>
                    {new Date(item?.end_time).toLocaleTimeString("en-US")}
                  </td>
                  <td>
                      <Link
                          href={`/merchants/partners/staffs/shifts/view/${item?.id}`}
                        >
                          <Button

                            variant="outline"
                            size="xs"
                          >
                            View
                          </Button>
                        </Link>
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

      {/* <PaginationLinks
        paginatedData={staffIncomeList}
        onLinkClicked={onPaginationLinkClicked}
      /> */}
    </Card>
  );
}

export default ShiftListView;
