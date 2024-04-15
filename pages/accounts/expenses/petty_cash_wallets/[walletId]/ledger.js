import BackButton from "../../../../../components/ui/actions/back-button";
import Card from "../../../../../components/ui/layouts/card";
import TableCardHeader from "../../../../../components/ui/layouts/table-card-header";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../../../../src/store/Store";
import StatelessLoadingSpinnerDark from "../../../../../components/ui/utils/stateless-loading-spinner-dark";
import { Table, TSearchFilter } from "../../../../../components/ui/layouts/scrolling-table";
import {
  TheadDark,
  TrowDark,
} from "../../../../../components/ui/layouts/scrolling-table-dark";
import { formatDate, formatNumber } from "../../../../../lib/shared/data-formatters";
import { Button } from "@mantine/core";
import { IconPencil, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import CreateLinkButton from "../../../../../components/ui/actions/create-link-button";
import PaginationLinksDark from "../../../../../components/ui/layouts/pagination-links-dark";
import {
  fetchPettyCashWalletsList,
  fetchWalletLedgerList,
} from "../../../../../src/store/accounts/accounts-slice";
import { useRouter } from "next/router";
import CreatePettyCashLedgerEntryModal from "../../../../../components/accounts/create-petty-cash-ledger-entry-modal";
import UpdatePettyCashLedgerEntryStatusModal from "../../../../../components/accounts/update-petty-cash-ledger-entry-status-modal";

import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../../src/components/container/PageContainer";
const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/accounts/expenses",
    title: "Expenses",
  },
  {
    to: "/accounts/expenses/petty_cash_wallets",
    title: "Petty Cash",
  },
  {
    title: "Petty Cash Ledger",
  },
];

export default function PettyCashWallets() {
  const router = useRouter();
  const walletId = router?.query?.walletId;

  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Petty Cash Ledger" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>

    <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <div className="flex flex-row gap-1">
      <BackButton href="/accounts/expenses/petty_cash_wallets" />

      <CreatePettyCashLedgerEntryModal walletId={walletId} />
    </div>
          </div>
        </header>

      <ListView />

      </Box>
    </PageContainer>
  );
}

function ListView() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const walletId = router?.query?.walletId;

  const [filter, setFilter] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state?.accounts.walletLedgerListStatus === "loading"
  );
  const ledgerList = useSelector((state) => state?.accounts.walletLedgerList);

  useEffect(() => {
    if (!accessToken || !walletId) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["recordId"] = walletId;
    params["branch_id"] = branch_id;
    if (filter) {
      params["filter"] = filter;
    }
    store.dispatch(fetchWalletLedgerList(params));
  }, [branch_id, accessToken, filter, walletId]);

  function onPaginationLinkClicked(page) {
    if (!page || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    if (filter) {
      params["filter"] = filter;
    }
    params["page"] = page;

    store.dispatch(fetchPettyCashWalletsList(params));
  }

  const [currentLedger, setCurrentLedger] = useState(null);

  const tableHeaderActions = <TSearchFilter onChangeSearchTerm={setFilter} />;

  return (
    <Card>
      <TableCardHeader actions={tableHeaderActions}></TableCardHeader>

      <Table>
        <TheadDark>
          <tr>
            <th scope="col" className="th-primary">
              ID
            </th>
            <th scope="col" className="th-primary text-right">
              AMOUNT
            </th>
            <th scope="col" className="th-primary">
              TYPE
            </th>
            <th scope="col" className="th-primary">
              NOTES
            </th>
            <th scope="col" className="th-primary">
              STATUS
            </th>
            <th scope="col" className="th-primary">
              CREATED BY
            </th>
            <th scope="col" className="th-primary text-right">
              CREATED AT
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </TheadDark>
        <tbody>
          {!isLoading &&
            ledgerList?.data?.map((item) => (
              <TrowDark key={item.id}>
                <td className="py-3 px-6 text-sm whitespace-nowrap capitalize">
                  {item?.id}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item?.amount)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.type_human_readable}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.notes}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  <span className="uppercase">{item?.status ?? "-"}: </span>
                  {item?.status_changing_user?.name ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.creating_user?.name ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatDate(item?.created_at)}
                </td>
                <td className="py-0 pl-14 2xl:pl-4">
                  <span className="flex justify-end items-center w-full gap-2">
                    <Button
                      color="blue"
                      variant="outline"
                      size="xs"
                      leftIcon={<IconPencil size={14} />}
                      onClick={() => {
                        console.log("rasta", item);
                        setCurrentLedger(item);
                      }}
                    >
                      Status
                    </Button>
                  </span>
                </td>
              </TrowDark>
            ))}
          {!isLoading && ledgerList && (
            <>
              <TrowDark>
                <td
                  className="py-3 px-6 text-xs whitespace-nowrap font-bold text-right"
                  colSpan={5}
                >
                  #
                </td>
                <td className="py-3 px-6 text-xs whitespace-nowrap font-bold text-right">
                  TOTAL IN
                </td>
                <td className="py-3 px-6 text-xs whitespace-nowrap font-bold text-right">
                  TOTAL OUT
                </td>
                <td className="py-3 px-6 text-xs whitespace-nowrap font-bold text-right">
                  GRAND TOTAL
                </td>
              </TrowDark>

              <TrowDark>
                <td
                  className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-error"
                  colSpan={5}
                >
                  REJECTED
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-error">
                  {formatNumber(ledgerList?.rejected?.total_debit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-error">
                  {formatNumber(ledgerList?.rejected?.total_credit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-error">
                  {formatNumber(ledgerList?.rejected?.grand_total ?? 0)}
                </td>
              </TrowDark>

              <TrowDark>
                <td
                  className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-warning"
                  colSpan={5}
                >
                  PENDING
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-warning">
                  {formatNumber(ledgerList?.pending?.total_debit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-warning">
                  {formatNumber(ledgerList?.pending?.total_credit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-warning">
                  {formatNumber(ledgerList?.pending?.grand_total ?? 0)}
                </td>
              </TrowDark>

              <TrowDark>
                <td
                  className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-base-content"
                  colSpan={5}
                >
                  APPROVED
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-base-content">
                  {formatNumber(ledgerList?.approved?.total_debit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-base-content">
                  {formatNumber(ledgerList?.approved?.total_credit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-base-content">
                  {formatNumber(ledgerList?.approved?.grand_total ?? 0)}
                </td>
              </TrowDark>

              <TrowDark>
                <td
                  className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-success"
                  colSpan={5}
                >
                  ISSUED
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-success">
                  {formatNumber(ledgerList?.issued?.total_debit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-success">
                  {formatNumber(ledgerList?.issued?.total_credit ?? 0)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap font-bold text-right text-success">
                  {formatNumber(ledgerList?.issued?.grand_total ?? 0)}
                </td>
              </TrowDark>
            </>
          )}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinksDark
        paginatedData={ledgerList}
        onLinkClicked={onPaginationLinkClicked}
      />

      <UpdatePettyCashLedgerEntryStatusModal
        opened={currentLedger !== null}
        ledger={currentLedger}
        setClosed={() => {
          setCurrentLedger(null);
        }}
      />
    </Card>
  );
}
