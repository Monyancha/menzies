import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "@/store/store";
import { useRouter } from "next/router";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import Card from "@/components/ui/layouts/card";
import {
  formatDate,
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import { Menu, Button, Text } from "@mantine/core";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
} from "@/components/ui/layouts/scrolling-table";
import { fetchCarTransactions } from "@/store/merchants/accounts/acounts-slice";
import { printRemotePdf } from "@/lib/shared/printing-helpers";
import { IconPrinter, IconChevronDown, IconEdit } from "@tabler/icons";
import Link from "next/link";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";

function CarTransactionListView({ isCredited = false } = {}) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const companyId = router?.query?.customerId;
  const vehicleId = router?.query?.vehicleId;

  const branch_id = useSelector((state) => state.branches.branch_id);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));

  const isLoading = useSelector(
    (state) => state.accounts.carTransactionsStatus === "loading"
  );
  const records = useSelector((state) => state.accounts.carTransactions);

  useEffect(() => {
    if (!router.isReady || !companyId || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;
    params["vehicleId"] = vehicleId;
    params["branch_id"] = branch_id;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (isCredited) {
      params["is_credited"] = isCredited;
    }

    store.dispatch(fetchCarTransactions(params));
  }, [
    router,
    accessToken,
    companyId,
    vehicleId,
    startDate,
    endDate,
    branch_id,
    isCredited,
  ]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["companyId"] = companyId;
    params["vehicleId"] = vehicleId;
    params["branch_id"] = branch_id;
    params["page"] = page;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (isCredited) {
      params["is_credited"] = isCredited;
    }

    store.dispatch(fetchCarTransactions(params));
  }

  return (
    <Card>
      <TableCardHeader>
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
              ID NO
            </th>

            <th scope="col" className="th-primary">
              ITEM(s)
            </th>

            <th scope="col" className="th-primary text-right">
              COST
            </th>

            <th scope="col" className="th-primary text-right">
              DISCOUNT
            </th>

            <th scope="col" className="th-primary text-right">
              TOTAL PAID
            </th>

            <th scope="col" className="th-primary">
              PAYMENT METHOD(S)
            </th>

            <th scope="col" className="th-primary">
              STAFF
            </th>

            <th scope="col" className="th-primary">
              CLIENT
            </th>

            <th scope="col" className="th-primary text-right">
              TRANSACTION DATE
            </th>

            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            records?.data?.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item.id}</td>
                  <td>
                    <span>
                      {item.titems[0]?.sellable?.sellable?.name?.substr(
                        0,
                        30
                      ) ?? "Gift Card"}
                      ...
                    </span>
                    <span className="text-xs">
                      ({item.titems?.length ?? 0})
                    </span>
                  </td>
                  <td className="text-right">
                    {formatNumber(
                      parseValidFloat(
                        parseFloat(item.cost) +
                          parseFloat(item?.titems_sum_discount ?? 0)
                      )
                    )}
                  </td>
                  <td className="text-right">
                    {formatNumber(
                      parseValidFloat(item?.discount) +
                        parseValidFloat(item?.titems_sum_discount ?? 0)
                    )}
                  </td>
                  <td className="text-right">
                    {(item?.total_paid ?? 0) !== 0
                      ? item?.total_paid
                      : item?.total ?? 0}
                  </td>
                  <td>
                    {item.transaction_payments[0]?.type ??
                      item?.payment_method ??
                      "-"}
                    {item.transaction_payments?.length > 1 ? " +" : ""}
                  </td>
                  <td>
                    <span>
                      {item?.titems[0]?.staff_income[0]?.staff?.name ||
                        item?.titems[0]?.staff?.name ||
                        "-"}
                    </span>

                    <span className="text-xs">
                      {(item?.titems?.length || 0) > 1 ? "(+)" : ""}
                    </span>
                  </td>

                  <td>
                    <span className="text-dark">
                      {item.restaurant_transaction?.table?.name ?? ""}
                    </span>
                    <span>{item.client?.name ?? ""}</span>
                  </td>
                  <td className="text-right">{formatDate(item.date)}</td>
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
                            <Menu.Item
                              icon={<IconPrinter size={15} />}
                              onClick={() =>
                                printRemotePdf(item.receipt_address)
                              }
                            >
                              Print
                            </Menu.Item>

                            <div className="inline md:hidden ">
                              <Link href={item.receipt_address}>
                                <a target="_blank">
                                  <Menu.Item icon={<IconPrinter size={15} />}>
                                    Legacy Print
                                  </Menu.Item>
                                </a>
                              </Link>
                            </div>

                            {canEdit && item.can_be_edited && (
                              <Link
                                href={`/merchants/transactions/new?transaction_id=${item.id}`}
                              >
                                <Menu.Item
                                  icon={<IconEdit size={15} color="blue" />}
                                >
                                  <Text color="blue">Settle</Text>
                                </Menu.Item>
                              </Link>
                            )}
                          </>
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
        paginatedData={records}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default CarTransactionListView;
