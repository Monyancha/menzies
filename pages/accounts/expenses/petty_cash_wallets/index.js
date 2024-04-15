import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
import BackButton from "../../../../components/ui/actions/back-button";
import Card from "../../../../components/ui/layouts/card";
import TableCardHeader from "../../../../components/ui/layouts/table-card-header";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../../../src/store/Store";
import StatelessLoadingSpinnerDark from "../../../../components/ui/utils/stateless-loading-spinner-dark";
import { Table, TSearchFilter } from "../../../../components/ui/layouts/scrolling-table";
import {
  TheadDark,
  TrowDark,
} from "../../../../components/ui/layouts/scrolling-table-dark";
import { formatDate } from "../../../../lib/shared/data-formatters";
import { Button } from "@mantine/core";
import { IconPencil, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import CreateLinkButton from "../../../../components/ui/actions/create-link-button";
import PaginationLinksDark from "../../../../components/ui/layouts/pagination-links-dark";
import { fetchPettyCashWalletsList } from "../../../../src/store/accounts/accounts-slice";

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
];

export default function PettyCashWallets() {


  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Petty Cash" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <div className="flex flex-row gap-1">
      <BackButton href="/accounts/expenses" />

      <CreateLinkButton
        href="/accounts/expenses/petty_cash_wallets/-1"
        variant="outline"
      />
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

  const [filter, setFilter] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state?.accounts.walletListStatus === "loading"
  );
  const walletList = useSelector((state) => state?.accounts.walletList);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    if (filter) {
      params["filter"] = filter;
    }
    store.dispatch(fetchPettyCashWalletsList(params));
  }, [branch_id, accessToken, filter]);

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
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary">
              DESCRIPTION
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
            walletList?.data?.map((item) => (
              <TrowDark key={item.id}>
                <td className="py-3 px-6 text-sm whitespace-nowrap capitalize">
                  {item?.id}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap capitalize">
                  {item?.name}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap capitalize">
                  {item?.description}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatDate(item?.created_at)}
                </td>
                <td className="py-0 pl-14 2xl:pl-4">
                  <span className="flex justify-end items-center w-full gap-2">
                    <Link
                      href={`/accounts/expenses/petty_cash_wallets/${item.id}`}
                    >
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<IconPencil size={14} />}
                      >
                        Edit
                      </Button>
                    </Link>

                      <Link
                        href={`/accounts/expenses/petty_cash_wallets/${item.id}/ledger`}
                      >
                        <Button

                          variant="outline"
                          size="xs"
                          leftIcon={<IconEye size={14} />}
                        >
                          Ledger
                        </Button>
                      </Link>

                  </span>
                </td>
              </TrowDark>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinksDark
        paginatedData={walletList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}
