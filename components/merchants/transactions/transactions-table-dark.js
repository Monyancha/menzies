import LinkIconButton from "../../ui/actions/link-icon-button";
import {
  Table,
  TDateFilter,
  TSearchFilter,
} from "@/components/ui/layouts/scrolling-table";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import InfoAlert from "../../ui/display/info-alert";
import TransactionListContext from "../../../store/merchants/transactions/transaction-list-context";
import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import { useSession } from "next-auth/react";
import {
  isCarWash,
  isMerchant,
  isRestaurant,
} from "@/lib/shared/roles_and_permissions";
import { Menu, Button, Text, TextInput, Select, Badge } from "@mantine/core";
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
import { downloadFile, printRemotePdf } from "@/lib/shared/printing-helpers";
import TransactionDetailModal from "./transaction-detail-modal";
import { useSelector } from "react-redux";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import ValidateWithPinModal from "../settings/security/validate-with-pin-modal";
import { showNotification } from "@mantine/notifications";
import CardDark from "@/components/ui/layouts/card-dark";
import {
  TheadDark,
  TrowDark,
} from "@/components/ui/layouts/scrolling-table-dark";
import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";
import CursorPaginationLinks from "@/components/ui/layouts/cursor-pagination-links";

export default function TransactionsTableDark({
  transactions = null,
  onPaginationLinkClicked = () => {},
  rawTransactions = null,
  isLoading = false,
  filterWithDates = () => {},
  filterWithBranch = () => {},
  hideActions = () => {},
  filter = null,
  entries = (value) => {},
} = {}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);
  const isCarWashAc = useMemo(() => isCarWash(session?.user), [session]);

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

  //entriesPerPage
  const [entriesPerPage, setEntriesPerPage] = useState(
    transactions?.per_page ?? 10
  );

  const canViewTotals = useSelector(
    hasBeenGranted("can_view_transaction_list_totals")
  );
  const canView = useSelector(hasBeenGranted("can_view_transaction"));
  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));
  const canVoid = useSelector(hasBeenGranted("can_void_transaction"));
  const canReprintOrder = useSelector(hasBeenGranted("can_reprint_order"));
  const canPrintWholeOrder = useSelector(
    hasBeenGranted("can_print_whole_order")
  );
  const canPrintOrderUpdates = useSelector(
    hasBeenGranted("can_print_order_updates")
  );
  const canPrintPreviousCompleteTransaction = useSelector(
    hasBeenGranted("can_print_previous_complete_transaction")
  );

  const [pinValidationOpen, setPinValidationOpen] = useState(false);
  const [pinValidationMessage, setPinValidationMessage] = useState("");
  const [pinValidationCallback, setPinValidationCallback] = useState(() => {});

  function printReceiptWithPermission(receipt_address) {
    downloadFile({
      url: receipt_address,
      fileName: "receipt.pdf",
      accessToken,
    });

    showNotification({
      title: "Info",
      message: "Printing receipt",
      color: "blue",
    });
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  async function downloadWithAuth(receipt_address) {
    setIsSubmitting(true);

    await downloadFile({
      url: receipt_address,
      isURLAbsolute: true,
      fileName: "receipt.pdf",
      accessToken,
    });

    setIsSubmitting(false);
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
    entries(entriesPerPage);
  }, [
    startDate,
    endDate,
    filterWithDates,
    entriesPerPage,
    entries,
    filter,
    searchTerm,
  ]);

  useEffect(() => {
    filterWithBranch(branch_id);
  }, [branch_id, filterWithBranch]);

  const actions = !hideActions && (
    <>
      <LinkIconButton
        icon="fa-solid fa-money-bill"
        href="/merchants/transactions/v3/credited"
        tooltip="Credited"
      />

      <LinkIconButton
        icon="fa-solid fa-arrow-down"
        href="/merchants/transactions/v3/suspended"
        tooltip="Orders"
      />

      <LinkIconButton
        icon="fa-solid fa-sitemap"
        href="/merchants/transactions/tables"
        tooltip="Tables"
      />

      <LinkIconButton
        icon="fa-solid fa-ban"
        href="/merchants/transactions/v3/voided"
        tooltip="Voided"
      />

      <LinkIconButton
        icon="fa-solid fa-plus"
        href="/merchants/transactions/v3/new"
        tooltip="POS"
      />
    </>
  );

  return (
    <CardDark>
      <TableCardHeader actions={actions}>
        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
          disabled={isLoading}
        />

        <div className="col-span-1 md:col-span-2">
          <TSearchFilter onChangeSearchTerm={setSearchTerm} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Select
            placeholder="Show Entries"
            clearable
            data={[
              { value: "10", label: "10" },
              { value: "25", label: "25" },
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ]}
            value={entriesPerPage}
            onChange={setEntriesPerPage}
          />
        </div>
      </TableCardHeader>

      <Table>
        <TheadDark>
          <tr>
            <th scope="col" className="th-primary">
              NO
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
              CREATED BY
            </th>

            <th scope="col" className="th-primary">
              UPDATED BY
            </th>

            {isRestaurantAc && (
              <th scope="col" className="th-primary">
                Order Type
              </th>
            )}

            <th scope="col" className="th-primary">
              {isRestaurantAc && "TABLE/"}
              CLIENT
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
          {transactions &&
            transactions.map((item) => (
              <TrowDark key={item.id}>
                <Fragment>
                  <td>{item?.bill_no}</td>
                  <td>
                    <span>
                      {item.titems[0]?.sellable?.sellable?.name?.substr(
                        0,
                        30
                      ) ??
                        item?.membership_client?.membership?.name ??
                        "Gift Card"}
                      ...
                    </span>
                    <span className="text-xs">
                      ({item.titems?.length ?? 0})
                    </span>
                  </td>
                  <td className="text-right">
                    {formatNumber(parseValidFloat(parseFloat(item.cost)))}
                  </td>
                  <td className="text-right">
                    {formatNumber(
                      parseValidFloat(item?.discount) +
                        parseValidFloat(item?.titems_sum_discount ?? 0)
                    )}
                  </td>
                  <td className="text-right">
                    {item?.total_paid > 0
                      ? item.transaction_payments[0]?.type === "complimentary"
                        ? 0
                        : parseValidFloat(item?.total ?? 0) -
                          (parseValidFloat(item?.discount) +
                            parseValidFloat(item?.titems_sum_discount))
                      : 0}
                  </td>
                  <td>
                    {item.transaction_payments[0]?.type ??
                      item?.payment_method ??
                      "-"}
                    {item.transaction_payments?.length > 1 ? " +" : ""}
                    <p>
                      {item.membership && (
                        <Badge color="blue">
                          {item?.membership?.membership?.name}
                        </Badge>
                      )}
                    </p>
                  </td>
                  {!isRestaurantAc ? (
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
                  ) : (
                    <td>
                      <span>{item?.titems[0]?.session_by?.name ?? "-"}</span>
                    </td>
                  )}

                  <td>
                    <span>{item?.creating_user?.name ?? "-"}</span>
                  </td>
                  <td>
                    <span>{item?.updating_user?.name ?? "-"}</span>
                  </td>

                  {isRestaurantAc && (
                    <td>{item?.titems[0]?.order_type ?? "-"}</td>
                  )}

                  <td>
                    <span className="text-v3-lightest">
                      {isRestaurantAc &&
                        (item.restaurant_transaction?.table?.name ?? "")}
                      {" - "}
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
                            loading={isSubmitting}
                          >
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>#{item.id}</Menu.Label>
                          {!item.is_void && (
                            <Fragment>
                              {item.is_draft && canPrintOrderUpdates && (
                                <Menu.Item
                                  icon={<IconPrinter size={15} />}
                                  onClick={() =>
                                    printRemotePdf(
                                      item.receipt_address_new_only
                                    )
                                  }
                                >
                                  Print Current Order
                                </Menu.Item>
                              )}

                              {((item.is_draft && canPrintWholeOrder) ||
                                (!item.is_draft &&
                                  canPrintPreviousCompleteTransaction)) && (
                                <>
                                  <Menu.Item
                                    icon={<IconPrinter size={15} />}
                                    onClick={() =>
                                      printRemotePdf(item.receipt_address)
                                    }
                                  >
                                    {(item.is_draft
                                      ? "Print Whole Order"
                                      : "Print") +
                                      (isCarWashAc ? " (80mm)" : "")}
                                  </Menu.Item>

                                  {isCarWashAc && (
                                    <Menu.Item
                                      icon={<IconPrinter size={15} />}
                                      onClick={() =>
                                        downloadWithAuth(
                                          item.receipt_address_a4
                                        )
                                      }
                                    >
                                      {item.is_draft
                                        ? "Print Whole Order (a4)"
                                        : "Print (a4)"}
                                    </Menu.Item>
                                  )}
                                </>
                              )}

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
                                    icon={<IconListDetails size={15} />}
                                    onClick={() => {
                                      setShowTransactionDetails(true);
                                      setShownTransaction(item);
                                    }}
                                  >
                                    <Text>Summary</Text>
                                  </Menu.Item>

                                  <Link
                                    href={`/merchants/transactions/view/${item.id}`}
                                  >
                                    <Menu.Item icon={<IconLayout2 size={15} />}>
                                      <Text>Detailed View</Text>
                                    </Menu.Item>
                                  </Link>
                                </>
                              )}
                              {canView && (
                                <>
                                  <Menu.Item
                                    icon={<IconListDetails size={15} />}
                                    onClick={() => {
                                      setShowTransactionDetails(true);
                                      setShownTransaction(item);
                                    }}
                                  >
                                    <Text>Summary</Text>
                                  </Menu.Item>
                                </>
                              )}

                              {canEdit && item.can_be_edited && (
                                <Link
                                  href={`/merchants/transactions/v3/new?transaction_id=${item.id}`}
                                >
                                  <Menu.Item icon={<IconEdit size={15} />}>
                                    <Text>Edit</Text>
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
              </TrowDark>
            ))}

          {rawTransactions && canViewTotals && (
            <TrowDark>
              <td className="text-lg font-bold" colSpan={4}>
                Total
              </td>
              <td className="text-lg text-right">
                {formatNumber(rawTransactions?.transaction_total ?? 0)}
              </td>
              <td colSpan={8}></td>
            </TrowDark>
          )}
        </tbody>
      </Table>

      {!isLoadingList && (
        <div className="text-sm px-3 w-full text-center lg:text-left">
          <span className="text-xs">Total Count: </span>{" "}
          <span className="tracking-wider text-primary">
            {formatNumber(rawTransactions?.total ?? 0)}
          </span>
        </div>
      )}

      {isLoadingList && (
        <div className="flex justify-center w-full p-3 bg-base-300 rounded-lg">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <CursorPaginationLinks
        paginatedData={rawTransactions}
        onLinkClicked={onPaginationLinkClicked}
        pageSize={entriesPerPage}
        setPageSize={setEntriesPerPage}
      />

      <div className="modal" id="my-modal-2">
        <div className="modal-box bg-base-300">
          {selectedTransactionId && (
            <Fragment>
              <h3 className="font-bold text-lg">
                Void Transaction #{selectedTransactionId}
              </h3>

              <TextInput
                label="Password"
                type="password"
                placeholder="Enter your password to proceed"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
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
    </CardDark>
  );
}
