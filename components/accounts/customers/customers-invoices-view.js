import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../../src/store/Store";
import PaginationLinks from "../../ui/layouts/pagination-links";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import Card from "../../ui/layouts/card";
import {
  formatDate,
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "../../../lib/shared/data-formatters";
import { Menu, Button } from "@mantine/core";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
} from "../../../components/ui/layouts/scrolling-table";
import { fetchCompanyInvoices } from "../../../src/store/accounts/accounts-slice";
import { IconChevronDown, IconEdit, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import CardDark from "../../../components/ui/layouts/card-dark";
import {
  TheadDark,
  TrowDark,
} from "../../../components/ui/layouts/scrolling-table-dark";
import StatelessLoadingSpinnerDark from "../../../components/ui/utils/stateless-loading-spinner-dark";

function CustomerInvoicesView({ companyId }) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const isLoading = useSelector(
    (state) => state.accounts.companyInvoicesStatus === "loading"
  );
  const records = useSelector((state) => state.accounts.companyInvoices);

  useEffect(() => {
    if (!companyId || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchCompanyInvoices(params));
  }, [accessToken, companyId, startDate, endDate, branch_id]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;
    params["page"] = page;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchCompanyInvoices(params));
  }

  return (
    <CardDark>
      <TableCardHeader>
        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />
      </TableCardHeader>

      <Table>
        <TheadDark>
          <tr>
            <th scope="col" className="th-primary">
              NO
            </th>
            <th scope="col" className="th-primary">
              CUSTOMER
            </th>
            <th scope="col" className="th-primary ">
              CREATED ON
            </th>
            <th scope="col" className="th-primary ">
              STATUS
            </th>
            <th scope="col" className="th-primary ">
              EXPIRY
            </th>
            <th scope="col" className="th-primary ">
              AMOUNT
            </th>
            <th scope="col" className="th-primary ">
              TAX
            </th>
            <th scope="col" className="th-primary ">
              DISCOUNT
            </th>
            <th scope="col" className="th-primary ">
              TOTAL AMOUNT
            </th>
            <th scope="col" className="th-primary ">
              TOTAL PAID
            </th>
            <th scope="col" className="th-primary ">
              TOTAL OWED
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </TheadDark>
        <tbody>
          {!isLoading &&
            records?.data?.map((item) => (
              <TrowDark key={item.id}>
                <>
                  <td>{item?.invoice_number}</td>
                  <td>{item?.client_name}</td>
                  <td>{formatDate(item?.invoice_date)}</td>
                  {item?.total_owed === 0 ? (
                    <td>Fully Paid</td>
                  ) : (
                    <td>{item?.status}</td>
                  )}
                  <td>{formatDate(item?.due_date)}</td>
                  <td>Ksh. {formatNumber(item?.amount) ?? 0}</td>
                  <td>Ksh. {formatNumber(item?.tax) ?? 0}</td>
                  <td>Ksh. {formatNumber(item?.discount) ?? 0}</td>
                  <td>Ksh. {formatNumber(item?.amount) ?? 0}</td>
                  <td>Ksh. {formatNumber(item?.total_paid) ?? 0}</td>
                  <td>Ksh. {formatNumber(item?.total_owed) ?? 0}</td>
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
                          <>
                            <Link
                              href={`/merchants/accounts/invoices/${item?.id}`}
                            >
                              <Menu.Item
                                icon={<IconEye size={15} />}
                                color="lime"
                              >
                                View
                              </Menu.Item>
                            </Link>

                            <Link
                              href={`/merchants/accounts/invoices/edit/${item?.id}`}
                            >
                              <Menu.Item
                                icon={<IconEdit size={15} />}
                                color="blue"
                              >
                                Edit
                              </Menu.Item>
                            </Link>
                          </>
                        </Menu.Dropdown>
                      </Menu>
                    </span>
                  </td>
                </>
              </TrowDark>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 rounded-lg">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinks
        paginatedData={records}
        onLinkClicked={onPaginationLinkClicked}
      />
    </CardDark>
  );
}

export default CustomerInvoicesView;
