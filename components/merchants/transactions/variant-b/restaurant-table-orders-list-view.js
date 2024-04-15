import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TDateFilter,
  Thead,
  Trow,
} from "@/components/ui/layouts/scrolling-table";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "@/store/store";
import { fetchTransactionList } from "@/store/merchants/transactions/transaction-list-slice";
import { useRouter } from "next/router";
import { Menu, Button, Text } from "@mantine/core";
import {
  IconPrinter,
  IconChevronDown,
  IconEdit,
  IconX,
  IconToolsKitchen2,
  IconGlassFull,
  IconListDetails,
  IconSlice,
} from "@tabler/icons";
import Link from "next/link";
import { isMerchant, isRestaurant } from "@/lib/shared/roles_and_permissions";
import {
  formatDate,
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
} from "@/lib/shared/data-formatters";
import TransactionDetailModal from "../transaction-detail-modal";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import ChangeOrderTableModal from "./restaurants/change-order-table-modal";
import { printRemotePdf } from "@/lib/shared/printing-helpers";
import ValidateWithPinModal from "@/components/merchants/settings/security/validate-with-pin-modal";
import { showNotification } from "@mantine/notifications";
import CardDark from "@/components/ui/layouts/card-dark";
import {
  TheadDark,
  TrowDark,
} from "@/components/ui/layouts/scrolling-table-dark";
import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";
import TableCardHeader from "@/components/ui/layouts/table-card-header";

function RestaurantTableOrdersListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const tableId = router.query?.tableId;

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [shownTransaction, setShownTransaction] = useState(null);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );

  const transactionList = useSelector(
    (state) => state.transactions.transactionList
  );
  const isLoadingList = transactionListStatus === "loading";

  const transactions = transactionList?.data ?? [];
  const raw_transactions = transactionList;

  const isMerchantAc = isMerchant(session?.user);
  const isRestaurantAc = isRestaurant(session?.user);

  useEffect(() => {
    if (!tableId || !accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["suspended"] = true;
    params["tableId"] = tableId;
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(fetchTransactionList(params));
  }, [accessToken, status, tableId, startDate, endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !tableId) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["page"] = page;
    params["suspended"] = true;
    params["tableId"] = tableId;
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(fetchTransactionList(params));
  }

  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));
  const canReprintOrder = useSelector(hasBeenGranted("can_reprint_order"));

  const [pinValidationOpen, setPinValidationOpen] = useState(false);
  const [pinValidationMessage, setPinValidationMessage] = useState("");
  const [pinValidationCallback, setPinValidationCallback] = useState(() => {});

  function printReceiptWithPermission(receipt_address) {
    printRemotePdf(receipt_address);

    showNotification({
      title: "Info",
      message: "Printing receipt",
      color: "blue",
    });
  }

  return (
    <div className="flex flex-col space-y-2 w-full mb-8">
      <CardDark>
        <TableCardHeader>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            disabled={isLoadingList}
          />
        </TableCardHeader>

        <Table>
          <TheadDark>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>

              <th scope="col" className="th-primary">
                ITEM(s)
              </th>

              <th scope="col" className="th-primary">
                COST
              </th>

              <th scope="col" className="th-primary text-right">
                TRANSACTION DATE
              </th>

              <th scope="col" className="th-primary text-right">
                ACTIONS
              </th>
            </tr>
          </TheadDark>
          <tbody>
            {!isLoadingList &&
              transactions.map((item) => (
                <TrowDark key={item.id}>
                  <Fragment>
                    <td>{item.id}</td>
                    <td>
                      <span>
                        {item.titems[0]?.sellable?.sellable?.name?.substr(
                          0,
                          30
                        ) ?? ""}
                        ...
                      </span>
                      <span className="text-xs">
                        ({item.titems?.length ?? 0})
                      </span>
                    </td>
                    <td>{formatNumber(item.cost)}</td>
                    <td className="text-right">
                      {item?.date ? formatDate(item.date) : "-"}
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
                            {!item.is_void && (
                              <Fragment>
                                <Menu.Item
                                  icon={<IconPrinter size={15} />}
                                  onClick={() =>
                                    printRemotePdf(item.receipt_address)
                                  }
                                >
                                  Print
                                </Menu.Item>

                                {item.is_draft && isRestaurantAc && (
                                  <Menu.Item
                                    icon={<IconToolsKitchen2 size={15} />}
                                    onClick={() => {
                                      if (canReprintOrder) {
                                        printRemotePdf(
                                          item.food_receipt_address
                                        );
                                      } else {
                                        setPinValidationOpen(true);
                                        setPinValidationMessage(
                                          "reprint order"
                                        );
                                        setPinValidationCallback({
                                          callback: () =>
                                            printReceiptWithPermission(
                                              item.food_receipt_address
                                            ),
                                        });
                                      }
                                    }}
                                  >
                                    Food Receipt
                                  </Menu.Item>
                                )}

                                {item.is_draft && isRestaurantAc && (
                                  <Menu.Item
                                    icon={<IconGlassFull size={15} />}
                                    onClick={() => {
                                      if (canReprintOrder) {
                                        printRemotePdf(
                                          item.drink_receipt_address
                                        );
                                      } else {
                                        setPinValidationOpen(true);
                                        setPinValidationMessage(
                                          "reprint order"
                                        );
                                        setPinValidationCallback({
                                          callback: () =>
                                            printReceiptWithPermission(
                                              item.drink_receipt_address
                                            ),
                                        });
                                      }
                                    }}
                                  >
                                    Drinks Receipt
                                  </Menu.Item>
                                )}

                                <Menu.Item
                                  icon={<IconListDetails size={15} />}
                                  onClick={() => {
                                    setShowTransactionDetails(true);
                                    setShownTransaction(item);
                                  }}
                                >
                                  <Text>View</Text>
                                </Menu.Item>

                                {canEdit && item.can_be_edited && (
                                  <>
                                    <Link
                                      href={`/merchants/transactions/tables/${tableId}/orders/${item.id}`}
                                    >
                                      <Menu.Item icon={<IconSlice size={15} />}>
                                        <Text>Split Bill</Text>
                                      </Menu.Item>
                                    </Link>

                                    <Link
                                      href={`/merchants/transactions/v3/new?transaction_id=${item.id}`}
                                    >
                                      <Menu.Item icon={<IconEdit size={15} />}>
                                        <Text>Edit</Text>
                                      </Menu.Item>
                                    </Link>
                                  </>
                                )}

                                {isMerchantAc && (
                                  <a
                                    href="#my-modal-2"
                                    onClick={() =>
                                      setSelectedTransactionId(item.id)
                                    }
                                  >
                                    <Menu.Item
                                      icon={<IconX size={15} color="red" />}
                                    >
                                      <Text color="red">Void</Text>
                                    </Menu.Item>
                                  </a>
                                )}
                              </Fragment>
                            )}
                          </Menu.Dropdown>
                        </Menu>

                        <ChangeOrderTableModal
                          orderId={item.id}
                          tableId={tableId}
                        />
                      </span>
                    </td>
                  </Fragment>
                </TrowDark>
              ))}
          </tbody>
        </Table>

        {isLoadingList && (
          <div className="flex justify-center w-full p-3 bg-base-300 rounded-lg">
            <StatelessLoadingSpinnerDark />
          </div>
        )}

        <PaginationLinks
          paginatedData={raw_transactions}
          onLinkClicked={onPaginationLinkClicked}
        />
      </CardDark>

      <ValidateWithPinModal
        opened={pinValidationOpen}
        setOpened={setPinValidationOpen}
        message={pinValidationMessage}
        onFail={(message) => {
          showNotification({
            title: "Warning",
            message,
            color: "orange",
          });
        }}
        onSuccess={pinValidationCallback?.callback}
      />

      <TransactionDetailModal
        opened={showTransactionDetails}
        onCloseHandler={() => setShowTransactionDetails(false)}
        transaction={shownTransaction}
      />
    </div>
  );
}

export default RestaurantTableOrdersListView;
