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
import { Menu, Button, TextInput,Checkbox,Select} from "@mantine/core";
import MakePaymentModal from "./make-payment-modal";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { Fragment } from "react";
import Link from "next/link";
import DeleteStaffModal from "./delete-staff-modal";
import { fetchAllStaffIncome } from "../../../../store/merchants/partners/staff-slice";
import {
  formatNumber,
  parseValidFloat,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import {
  IconEye,
  IconPencil,
  IconChevronDown,
  IconSquareMinus,
  IconSquarePlus,
  IconTrash,
  IconAccessPoint,
  IconCashBanknote
} from "@tabler/icons";
import MakeDeductionModal from "./make-deduction-modal";
import { isMerchant } from "@/lib/shared/roles_and_permissions";
function StaffsPayrollView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const [currentStaff, setCurrentStaff] = useState();
  const [deductionModalOpen, setDeductionModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [time_in_out, setTimeInOut] = useState(null);


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
    if (branch_id) {
      params["branch_id"] = branch_id;
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

    //function set checkbox
    function updateCheckbox(menu_id) {
        // return (event) => {
        //   event.currentTarget.checked;
  
        //   let nam = menuItems?.data?.find((value) => value?.id === menu_id).name;
  
        //   let data = {
        //     id: menu_id,
        //     name: nam,
        //     status:1
        //   };
  
        //   let pars = { menu_id: data };
        //   store.dispatch(setStockManagement(pars));
        // };
      }

      const times = [{label:"My Shop",value:"main"},{label:"Test",value:"main"},{label:"Branch A",value:"A"}]


 

  const actions =   <Select
  placeholder="Choose Branch"
  label="Branches"
 
  onChange={setTimeInOut}
  data={times}
  searchable
  clearable
/>;

  return (
    <Card>
      <TableCardHeader actions={actions}>
      <div className="py-2">
                <label>Start Date</label>
              <input
                  type="date"
                  name="start_date"
                  className="input-primary h-10"

                 
                />
                </div>
                <div className="py-2">
                <label>End Date</label>
              <input
                  type="date"
                  name="start_date"
                  className="input-primary h-10"

                 
                />
                </div>
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th></th>
            
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary ">
              SALARY
            </th>
            <th scope="col" className="th-primary ">
              PAYEE
            </th>
            <th scope="col" className="th-primary ">
              NSSF
            </th>
            <th scope="col" className="th-primary ">
              NHIF
            </th>

            <th scope="col" className="th-primary ">
              ALLOWANCES
            </th>
            
            
            
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            staffIncomeList?.data?.map((item) => (
              <Trow key={item?.id}>
                <>
                <td>
                        <Checkbox
                          key={item.id}
                          onChange={updateCheckbox(item.id)}
                          checked
                        />
                      </td>
                 
                  <td>{item?.name}</td>
                  <td>{formatNumber(item?.salary ?? 0)}</td>
                  <td>{formatNumber(item?.payee_amount ?? 0)}</td>
                  <td>
                  {formatNumber(item?.nssf_amount ?? 0)}
                  </td>
                  <td>
                  {formatNumber(item?.nhif_amount ?? 0)}
                  </td>
                  <td>
                  {item?.staff_allowances?.map((it)=>(
                    <p key={it?.id}> {it?.name } :  {formatNumber(it?.amount ?? 0)}</p>
                  ))}
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

      <MakePaymentModal
        staff={currentStaff}
        opened={paymentModalOpen}
        setOpened={setPaymentModalOpen}
      />

      <MakeDeductionModal
        staff={currentStaff}
        opened={deductionModalOpen}
        setOpened={setDeductionModalOpen}
      />

      <DeleteStaffModal
        staff={currentStaff}
        opened={deleteModalOpen}
        setOpened={setDeleteModalOpen}
      />
    </Card>
  );
}

export default StaffsPayrollView;
