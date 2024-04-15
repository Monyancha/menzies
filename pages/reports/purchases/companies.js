import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
//
import Card from "../../../components/ui/layouts/card";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../components/ui/layouts/scrolling-table";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import { formatNumber } from "../../../lib/shared/data-formatters";
import {
  fetchCompanySummary,
  fetchCompanySummaryExcel,
} from "../../../src/store/merchants/inventory/purchases-slice";
import store from "../../../src/store/Store";
import { Button, TextInput } from "@mantine/core";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IconFileExport, IconFileInvoice } from "@tabler/icons-react";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/vendors",
    title: "Vendors",
  },
  {
    to: "/reports/purchases/companies",
    title: "Vendor Reports",
  },
];

export default function CompaniesPage() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.purchases.companySummaryStatus === "loading"
  );

  const companyList = useSelector(
    (state) => state.purchases.companySummaryList
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(fetchCompanySummary(params));
  }, [session, status, branch_id]);

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

    store.dispatch(fetchCompanySummary(params));
  }

  // Avoid recreating the function on every state change
  // https://stackoverflow.com/a/67266725/7450617
  // https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks
  const debouncedSearchRequest = useMemo(
    () =>
      debounce((term) => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["branch_id"] = branch_id;
        if (term) {
          params["filter"] = term;
        }

        store.dispatch(fetchCompanySummary(params));
      }, 500),
    [session, status, branch_id]
  );

  const sendSearchRequest = useCallback(
    (term) => debouncedSearchRequest(term),
    [debouncedSearchRequest]
  );

  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadExcel() {
    if (!session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    try {
      setIsDownloading(true);
      await store.dispatch(fetchCompanySummaryExcel(params)).unwrap();
    } catch (e) {
    } finally {
      setIsDownloading(false);
    }
  }


  return (
      <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Vendor Reports" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <Button leftIcon={<IconFileExport size={18} />} onClick={downloadExcel} variant="outline" size="xs" loading={isDownloading} >Export</Button>
          <Link href="/reports/purchases/companies_detailed">
            <Button size="xs" leftIcon={<IconFileInvoice size={18} />} variant="outline">
              Detailed
            </Button>
          </Link>
          </div>
        </header>

      <Card>
        <TableCardHeader>
          <TextInput
            placeholder="Search Vendor"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              sendSearchRequest(e.target.value);
            }}
          />
        </TableCardHeader>

        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>
              <th scope="col" className="th-primary">
                NAME
              </th>
              <th scope="col" className="th-primary">
                EMAIL
              </th>
              <th scope="col" className="th-primary">
                PHONE
              </th>
              <th scope="col" className="th-primary text-right">
                BILLS
              </th>
              <th scope="col" className="th-primary text-right">
                PAYMENTS
              </th>
              <th scope="col" className="th-primary text-right">
                OWING
              </th>
              <th scope="col" className="th-primary text-right">
                ACTIONS
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoading &&
              companyList?.data?.map((item) => (
                <Trow key={item.id}>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-center">
                    {item.id}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.name ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.email ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.phone ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(item.bill_items_sum_subtotal ?? 0)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(item.payments_sum_amount ?? 0)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(
                      (item.bill_items_sum_subtotal ?? 0) -
                        (item.payments_sum_amount ?? 0)
                    )}
                  </td>

                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right gap-2 flex">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Link href={`/reports/purchases/${item.id}/`}>
                        <Button size="xs" variant="outline">
                          View
                        </Button>
                      </Link>
                    </span>
                  </td>
                </Trow>
              ))}
            {!isLoading && (
              <Trow>
                <td
                  className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold"
                  colSpan={4}
                >
                  TOTAL
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold">
                  {formatNumber(companyList?.bill_sum ?? 0)}
                </td>

                <td className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold">
                  {formatNumber(companyList?.payments_sum ?? 0)}
                </td>

                <td className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold">
                  {formatNumber(
                    (companyList?.bill_sum ?? 0) -
                      (companyList?.payments_sum ?? 0)
                  )}
                </td>
              </Trow>
            )}
          </tbody>
        </Table>

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={companyList}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    
    </Box>
    </PageContainer>
  );
}
