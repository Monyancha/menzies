import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "@/store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import {
    Table,
    Thead,
    Trow,
    TDateFilter,
    TSearchFilter,
} from "@/components/ui/layouts/scrolling-table";
import { Fragment, useContext, useEffect, useState } from "react";
import InfoAlert from "@/components/ui/display/info-alert";
import TransactionListContext from "@/store/merchants/transactions/transaction-list-context";
import {
    formatDate,
    getDateFilterFrom,
    getDateFilterTo,
    parseValidFloat,
} from "@/lib/shared/data-formatters";
import { isMerchant, isRestaurant } from "@/lib/shared/roles_and_permissions";
import { Menu, Button, Text, TextInput } from "@mantine/core";
import {
    IconPrinter,
    IconChevronDown,
    IconEdit,
    IconX,
    IconToolsKitchen2,
    IconGlassFull,
    IconListDetails,
    IconLayout2,
    IconTableExport,
} from "@tabler/icons";
import { printRemotePdf } from "@/lib/shared/printing-helpers";
import TransactionDetailModal from "../../transactions/transaction-detail-modal";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import LinkIconButton from "@/components/ui/actions/link-icon-button";
import ActionIconButton from "@/components/ui/actions/action-icon-button";
import { showNotification } from "@mantine/notifications";

//mo
import LinkCrumb from "@/components/ui/actions/link-crumb";
import { useCallback } from "react";
import { useMemo } from "react";
import { fetchTransactionList } from "@/store/merchants/transactions/transaction-list-slice";

function WholesaleReport() {
    const [isLoadingExcel, setIsLoadingExcel] = useState(false);
    const { data: session, status } = useSession();
    const accessToken = useMemo(() => {
        return session?.user?.accessToken;
    }, [session]);

    const [startDate, setStartDate] = useState(getDateFilterFrom());
    const [endDate, setEndDate] = useState(getDateFilterTo());

    const [searchTerm, setSearchTerm] = useState("");

    const transactionListStatus = useSelector(
        (state) => state.transactions.transactionListStatus
    );
    const branch_id = useSelector((state) => state.branches.branch_id);
    const [br_id, setBranch] = useState(branch_id);
    const transactionList = useSelector(
        (state) => state.transactions.transactionList
    );
    const isLoadingList = transactionListStatus === "loading";

    const transactions = transactionList?.data;
    const rawTransactions = transactionList;

    useEffect(() => {
        if (!accessToken || status !== "authenticated") {
            return;
        }

        const params = {};
        params["accessToken"] = accessToken;
        params["branch_id"] = branch_id;
        if (searchTerm) {
            params["filter"] = searchTerm;
        }
        if (!startDate && !endDate) {
            store.dispatch(fetchTransactionList(params));
            return;
        }
        if (!startDate || !endDate) {
            return;
        }
        params["startDate"] = startDate;
        params["endDate"] = endDate;

        store.dispatch(fetchTransactionList(params));
    }, [startDate, endDate, branch_id, accessToken, status, searchTerm]);

    function onPaginationLinkClicked(page) {
        if (!page || !status || !accessToken) {
            return;
        }

        const params = {};
        params["accessToken"] = accessToken;
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

        if (branch_id) {
            params["branch_id"] = branch_id;
        }

        if (searchTerm) {
            params["filter"] = searchTerm;
        }

        store.dispatch(fetchTransactionList(params));
    }

    const filterWithBranch = useCallback((br_id) => {
        setBranch(br_id);
    }, []);

    const filterWithDates = useCallback((startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);
    }, []);

    const filter = useCallback((searchTerm) => {
        setSearchTerm(searchTerm);
    }, []);

    const [showReceiptSettings, setShowReceiptSettings] = useState(false);
    const [showPrintingDownloads, setShowPrintingDownloads] = useState(false);

    function formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }

    const [selectedTransactionId, setSelectedTransactionId] = useState(undefined);
    const [password, setPassword] = useState("");

    const [isLoadingPdf, setIsLoadingPdf] = useState(false);

    const transactionsListCtx = useContext(TransactionListContext);

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

    const exportExcel = async () => {
        setIsLoadingExcel(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `${API_URL}/reports/sales-reports/export-excel?start_date=${startDate}&end_date=${endDate}`;

        const accessToken = session.user.accessToken;

        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: "GET",
            // Tell the server we're sending JSON.
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        const response = await fetch(endpoint, options);
        const result = await response.blob();

        if (!response.ok) {
            throw { message: "failure" };
        }

        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(result);
        a.innerHTML = "Sale Report.xlsx";
        a.target = "_blank";
        a.click();

        if (response.status === 200) {
            showNotification({
                title: "Success",
                message: "Download Successful",
                color: "green",
            });
        } else {
            showNotification({
                title: "Error",
                message: "Sorry! " + result.message,
                color: "red",
            });
        }
        setIsLoadingExcel(false);
    };

    const actions = (
        <>
            <Button
                className="mr-2"
                leftIcon={<IconTableExport size={16} />}
                variant="outline"
                loading={isLoadingExcel}
                onClick={exportExcel}
            >
                Export
            </Button>

        </>
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

                <div className="col-span-1 md:col-span-2">
                    <TSearchFilter onChangeSearchTerm={setSearchTerm} />
                </div>
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
                </Thead>
                <tbody>
                    {transactions &&
                        transactions.map((item) => (
                            <Trow key={item.id}>
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
                                        {item?.titems[0]?.staff_income ? (
                                            <>
                                                <span>
                                                    {item?.titems[0]?.staff_income[0]?.staff?.name ?? ""}
                                                </span>

                                                <span className="text-xs">
                                                    {(item.titems?.length ?? 0) > 1 ? "(+)" : ""}
                                                </span>
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        <span className="text-dark">
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
                                                    <Button rightIcon={<IconChevronDown size={14} />}>
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
                                                                    onClick={() =>
                                                                        printRemotePdf(item.food_receipt_address)
                                                                    }
                                                                >
                                                                    Food Receipt
                                                                </Menu.Item>
                                                            )}

                                                            {item.is_draft && isRestaurantAc && (
                                                                <Menu.Item
                                                                    icon={<IconGlassFull size={15} />}
                                                                    onClick={() =>
                                                                        printRemotePdf(item.drink_receipt_address)
                                                                    }
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
                                                                    href={`/merchants/transactions/new?transaction_id=${item.id}`}
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
                            </Trow>
                        ))}

                    {rawTransactions && canViewTotals && (
                        <Trow>
                            <td className="text-lg text-dark font-bold" colSpan={4}>
                                Total
                            </td>
                            <td className="text-lg text-dark text-right">
                                {formatNumber(rawTransactions?.transaction_total ?? 0)}
                            </td>
                        </Trow>
                    )}
                </tbody>
            </Table>

            {isLoadingList && (
                <div className="flex justify-center w-full p-3 bg-light rounded-lg">
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
        </Card>
    );
}

export default WholesaleReport;
