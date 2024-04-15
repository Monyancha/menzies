import LinkIconButton from "../../ui/actions/link-icon-button";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
  TSearchFilter,
} from "@/components/ui/layouts/scrolling-table";
import PaginationLinks from "../../ui/layouts/pagination-links";
import { Fragment, useContext, useEffect, useState } from "react";
import InfoAlert from "../../ui/display/info-alert";
import TransactionListContext from "../../../store/merchants/transactions/transaction-list-context";
import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import { useSession } from "next-auth/react";
import {
  isMerchant,
  isRestaurant,
} from "../../../lib/shared/roles_and_permissions";
import { Menu, Button, Text, TextInput, ActionIcon } from "@mantine/core";
import {
  IconPrinter,
  IconChevronDown,
  IconEdit,
  IconX,
  IconToolsKitchen2,
  IconGlassFull,
  IconListDetails,
  IconLayout2,
} from "@tabler/icons";
import Link from "next/link";
import { printRemotePdf } from "../../../lib/shared/printing-helpers";
import TransactionDetailModal from "./transaction-detail-modal";
import { useSelector } from "react-redux";
import { hasBeenGranted } from "../../../store/merchants/settings/access-control-slice";
import Card from "../..//ui/layouts/card";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import ValidateWithPinModal from "../settings/security/validate-with-pin-modal";
import { showNotification } from "@mantine/notifications";

function TransactionsTable({
  transactions,
  onPaginationLinkClicked,
  rawTransactions,
  isLoading,
  filterWithDates,
  filterWithBranch,
  hideActions,
  filter,
}) {
  const { data: session } = useSession();

  function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
  }

  const [selectedTransactionId, setSelectedTransactionId] = useState(undefined);
  const [password, setPassword] = useState("");

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const [branch_id, setBranch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const transactionsListCtx = useContext(TransactionListContext);
  const isLoadingList = isLoading && true;

  const isMerchantAc = isMerchant(session?.user);
  const isRestaurantAc = isRestaurant(session?.user);

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [shownTransaction, setShownTransaction] = useState(null);

  const canViewTotals = useSelector(
    hasBeenGranted("can_view_transaction_list_totals")
  );
  const canView = useSelector(hasBeenGranted("can_view_transaction"));
  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));
  const canVoid = useSelector(hasBeenGranted("can_void_transaction"));
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

  function voidTransaction() {
    if (!selectedTransactionId || !password) {
      return;
    }

    transactionsListCtx.actions.void(selectedTransactionId, password);

    setSelectedTransactionId(undefined);
    setPassword("");
  }

  useEffect(() => {
    filterWithDates(startDate, endDate);
    filter(searchTerm);
  }, [startDate, endDate, filterWithDates, filter, searchTerm]);

  useEffect(() => {
    filterWithBranch(branch_id);
  }, [branch_id, filterWithBranch]);

  return (
    <section className="bg-v3-dark mt-5 w-full">
      <Table>
        <thead>
          <tr>
            <th>
              <span className="flex ">ID NO</span>
            </th>

            <th>
              <span className="flex justify-start gap-2">ITEM(s)</span>
            </th>

            <th>
              <span className="flex justify-start gap-2">COST</span>
            </th>

            <th>
              <span className="flex justify-start gap-2">DISCOUNT</span>
            </th>

            <th>
              <span className="flex justify-start gap-2">TOTAL PAID</span>
            </th>

            <th>
              <span className="flex justify-start gap-2">
                PAYMENT METHOD(S)
              </span>
            </th>

            <th>
              <span className="flex justify-start gap-2">STAFF</span>
            </th>

            <th>
              <span className="flex justify-start gap-2">
                {isRestaurantAc && "TABLE/"}
                CLIENT
              </span>
            </th>

            <th>
              <span className="flex justify-start gap-2">TRANSACTION DATE</span>
            </th>

            <th>
              <span className="flex justify-end items-center w-full gap-2">
                ACTIONS
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions.map((item) => (
              <tr key={item.id}>
                <Fragment>
                  <td className="flex ">{item.id}</td>
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
                  <td className="">
                    {formatNumber(
                      parseValidFloat(
                        parseFloat(item.cost) +
                          parseFloat(item?.titems_sum_discount ?? 0)
                      )
                    )}
                  </td>
                  <td className="">
                    {formatNumber(
                      parseValidFloat(item?.discount) +
                        parseValidFloat(item?.titems_sum_discount ?? 0)
                    )}
                  </td>
                  <td className="">
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
                    <span className="text-white">
                      {isRestaurantAc &&
                        (item.restaurant_transaction?.table?.name ?? "")}
                      {" - "}
                    </span>
                    <span>{item.client?.name ?? ""}</span>
                  </td>
                  <td className="">{formatDate(item.date)}</td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        variant="filled"
                      >
                        <Menu.Target>
                          <ActionIcon
                            size="lg"
                            variant="filled"
                            color="primary"
                          >
                            <IconChevronDown size="1.625rem" />
                          </ActionIcon>
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

                              <div className="inline md:hidden ">
                                <Link href={item.receipt_address}>
                                  <a target="_blank">
                                    <Menu.Item icon={<IconPrinter size={15} />}>
                                      Legacy Print
                                    </Menu.Item>
                                  </a>
                                </Link>
                              </div>

                              {item.is_draft && isRestaurantAc && (
                                <Menu.Item
                                  icon={<IconToolsKitchen2 size={15} />}
                                  onClick={() => {
                                    if (canReprintOrder) {
                                      printRemotePdf(item.food_receipt_address);
                                    } else {
                                      setPinValidationOpen(true);
                                      setPinValidationMessage("reprint order");
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
                                      setPinValidationMessage("reprint order");
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

                              {canView && (
                                <>
                                  <Menu.Item
                                    icon={
                                      <IconListDetails size={15} color="lime" />
                                    }
                                    onClick={() => {
                                      setShowTransactionDetails(true);
                                      setShownTransaction(item);
                                    }}
                                  >
                                    <Text color="lime">Summary</Text>
                                  </Menu.Item>

                                  <Link
                                    href={`/merchants/transactions/view/${item.id}`}
                                  >
                                    <Menu.Item
                                      icon={
                                        <IconLayout2 size={15} color="purple" />
                                      }
                                    >
                                      <Text color="purple">Detailed View</Text>
                                    </Menu.Item>
                                  </Link>
                                </>
                              )}

                              {canEdit && item.can_be_edited && (
                                <Link
                                  href={`/merchants/transactions/v3/new?transaction_id=${item.id}`}
                                >
                                  <Menu.Item
                                    icon={<IconEdit size={15} color="blue" />}
                                  >
                                    <Text color="blue">Edit</Text>
                                  </Menu.Item>
                                </Link>
                              )}

                              {canVoid && (
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
                    </span>
                  </td>
                </Fragment>
              </tr>
            ))}

          {rawTransactions && canViewTotals && (
            <tr>
              <td className="text-xl text-light font-bold" colSpan={4}>
                <strong>Total</strong>
              </td>
              <td className="text-xl text-light">
                <strong>
                  Ksh. {formatNumber(rawTransactions?.transaction_total ?? 0)}
                </strong>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {isLoadingList && (
        <div className="flex justify-center w-full p-3 bg-v3-dark rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={rawTransactions}
        onLinkClicked={onPaginationLinkClicked}
      />

      <div className="modal" id="my-modal-2">
        <div className="modal-box bg-white">
          {selectedTransactionId && (
            <Fragment>
              <h3 className="font-bold text-lg">
                Void Transaction #{selectedTransactionId}
              </h3>
              <div className="flex flex-wrap space-y-1 w-full">
                <div className="text-dark text-sm">
                  <span>Password</span>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password to proceed"
                  className="input input-primary w-full"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                />
              </div>
            </Fragment>
          )}
          {!selectedTransactionId && (
            <div className="flex justify-center">
              <InfoAlert
                title="No transaction selected"
                message="Click the BACK button"
              />
            </div>
          )}

          <div className="modal-action">
            <a href="#" className="btn btn-outline">
              Back
            </a>

            <a href="#" className="btn btn-error" onClick={voidTransaction}>
              Void
            </a>
          </div>
        </div>
      </div>

      <TransactionDetailModal
        opened={showTransactionDetails}
        onCloseHandler={() => setShowTransactionDetails(false)}
        transaction={shownTransaction}
      />

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
    </section>
  );
}

export default TransactionsTable;
