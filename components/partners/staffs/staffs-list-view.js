import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../ui/layouts/card";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
  TSearchFilter,
} from "../../ui/layouts/scrolling-table";
import PaginationLinks from "../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../src/store/Store";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import { Menu, Button, TextInput } from "@mantine/core";
import MakePaymentModal from "./make-payment-modal";
import TableCardHeader from "../../ui/layouts/table-card-header";
import { Fragment } from "react";
import Link from "next/link";
import DeleteStaffModal from "./delete-staff-modal";
import { fetchAllStaffIncome } from "../../../src/store/partners/staff-slice";
import {
  formatNumber,
  parseValidFloat,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../lib/shared/data-formatters";
import {
  IconEye,
  IconPencil,
  IconChevronDown,
  IconSquareMinus,
  IconSquarePlus,
  IconTrash,
  IconAccessPoint,
  IconCashBanknote
} from "@tabler/icons-react";
import MakeDeductionModal from "./make-deduction-modal";
import { isMerchant } from "../../../lib/shared/roles_and_permissions";
import { useRouter } from "next/router";

function StaffsListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(getDateFilterFrom(30));
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const router = useRouter();
  const nextUrl = router?.query?.next_url ?? null;
  const [next_url, setNextUrl] = useState(nextUrl ?? "");

  const [currentStaff, setCurrentStaff] = useState();
  const [deductionModalOpen, setDeductionModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

    if (next_url) {
      params["page"] = next_url;
    }

    store.dispatch(fetchAllStaffIncome(params));
  }, [branch_id, session, status, searchTerm, startDate, endDate, next_url]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    setNextUrl(page);

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

  const sum_db_cr = (db, cr) => parseValidFloat(db) - parseValidFloat(cr);
  const reverse_sum_db_cr = (db, cr) =>
    parseValidFloat(cr) - parseValidFloat(db);

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
            <th scope="col" className="th-primary ">
              WAGES
            </th>
            <th scope="col" className="th-primary ">
              PAYMENTS
            </th>
            <th scope="col" className="th-primary ">
              DEDUCTIONS
            </th>
            <th scope="col" className="th-primary ">
              SALARY
            </th>
            <th scope="col" className="th-primary ">
              RENT
            </th>
            <th scope="col" className="th-primary ">
              BALANCE OWED(debit)
            </th>
            <th scope="col" className="th-primary ">
              BALANCE OWED(credit)
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            staffIncomeList?.data?.map((item) => (
              <Trow key={item?.id}>
                <>
                  <td>{item?.id}</td>
                  <td>{item?.name}</td>

                  <td>
                    {formatNumber(
                      sum_db_cr(item?.titem_debit_sum, item?.titem_credit_sum)
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      reverse_sum_db_cr(
                        item?.payment_debit_sum,
                        item?.payment_credit_sum
                      )
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      reverse_sum_db_cr(
                        item?.deduction_debit_sum,
                        item?.deduction_credit_sum
                      )
                    )}
                  </td>

                  <td>{formatNumber(item?.salary ?? 0)}</td>
                  <td>{formatNumber(item?.rent ?? 0)}</td>
                  <td>
                    {/*
                     * INFO: Negatives tend to confuse clients
                     * show under debit if merchant owes staff
                     * 21/06/2023
                     */}
                    {sum_db_cr(item?.debit_sum, item?.credit_sum) >= 0
                      ? formatNumber(
                          sum_db_cr(item?.debit_sum, item?.credit_sum)
                        )
                      : 0}
                  </td>
                  <td>
                    {/*
                     * INFO: Negatives tend to confuse clients
                     * show under credit if merchant overpays staff
                     * 21/06/2023
                     */}
                    {sum_db_cr(item?.debit_sum, item?.credit_sum) < 0
                      ? formatNumber(
                          Math.abs(sum_db_cr(item?.debit_sum, item?.credit_sum))
                        )
                      : 0}
                  </td>

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
                          <Menu.Label>#{item.id}</Menu.Label>
                          <Link
                            href={`/merchants/partners/staffs/view/${item?.id}`}
                          >
                            <Menu.Item
                              color="blue"
                              icon={<IconEye size={15} />}
                            >
                              View
                            </Menu.Item>
                          </Link>

                          <Link
                            href={`/merchants/partners/staffs/edit/${item?.id}?next_url=${next_url}`}
                          >
                            <Menu.Item
                              color="blue"
                              icon={<IconPencil size={15} />}
                            >
                              Edit
                            </Menu.Item>
                          </Link>

                          <Link
                            href={`/merchants/partners/staffs/payroll/payslip/${item?.id}`}
                          >
                            <Menu.Item
                              color="blue"
                              icon={<IconCashBanknote size={15} />}
                            >
                              Payslip
                            </Menu.Item>
                          </Link>
                          {isMerchant(session.user) && (
                            <Link
                              href={`/merchants/partners/staffs/branches/${item?.id}`}
                            >
                              <Menu.Item
                                color="green"
                                icon={<IconAccessPoint size={15} />}
                              >
                                Accessible Branches
                              </Menu.Item>
                            </Link>
                          )}

                          <Menu.Item
                            icon={<IconSquarePlus size={15} />}
                            onClick={() => {
                              setPaymentModalOpen(true);
                              setCurrentStaff(item);
                            }}
                            color="green"
                          >
                            Make Payment
                          </Menu.Item>

                          <Menu.Item
                            icon={<IconSquareMinus size={15} />}
                            onClick={() => {
                              setDeductionModalOpen(true);
                              setCurrentStaff(item);
                            }}
                            color="orange"
                          >
                            Make Deduction
                          </Menu.Item>

                          <Menu.Item
                            icon={<IconTrash size={15} />}
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setCurrentStaff(item);
                            }}
                            color="red"
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </span>
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

export default StaffsListView;
