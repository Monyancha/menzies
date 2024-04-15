import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import CardDark from "../../../components/ui/layouts/card-dark";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
  TSearchFilter,
} from "../../../components/ui/layouts/scrolling-table";
import store from "../../../src/store/Store";
import { fetchAgingReport } from "../../../src/store/accounts/accounts-slice";
import { useSelector } from "react-redux";
import StatelessLoadingSpinnerDark from "../../../components/ui/utils/stateless-loading-spinner-dark";
import PaginationLinksDark from "../../../components/ui/layouts/pagination-links-dark";
import { TrowDark } from "../../../components/ui/layouts/scrolling-table-dark";
import { formatNumber } from "../../../lib/shared/data-formatters";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import { Button } from "@mantine/core";
import { IconFileExport } from "@tabler/icons-react";
import { downloadFile } from "../../../lib/shared/printing-helpers";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Aging",
  },
];

export default function InvoicesAgingReport() {

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Aging Report" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <div className="w-full flex flex-wrap mt-2">
        <AgingReportListView />
      </div>
      </Box>
    </PageContainer>
  );
}

export function AgingReportListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const branch_id = useSelector((state) => state.branches.branch_id);
  const [filter, setFilter] = useState("");
  const clients = useSelector((state) => state?.accounts.agingReport);

  const isLoading = useSelector(
    (state) => state?.accounts.agingReportStatus === "loading"
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    if (filter) {
      params["filter"] = filter;
    }

    store.dispatch(fetchAgingReport(params));
  }, [accessToken, filter, session]);

  function onPaginationLinkClicked(page) {
    if (!page || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["page"] = page;
    if (filter) {
      params["filter"] = filter;
    }

    store.dispatch(fetchAgingReport(params));
  }

  const [isExporting, setIsExporting] = useState(false);
  async function downloadExcel() {
    const url = `/accounts/invoices/aging_excel`;

    const params = {};
    params["accessToken"] = accessToken;
    params["url"] = url;
    params["fileName"] = "exported.xlsx";

    setIsExporting(true);

    await downloadFile(params);

    setIsExporting(false);
  }

  const actions = (
    <Button
      leftIcon={<IconFileExport size={16} />}
      variant="outline"
      size="xs"
      loading={isExporting}
      onClick={downloadExcel}
    >
      Excel
    </Button>
  );

  return (
    <CardDark>
      <TableCardHeader actions={actions}></TableCardHeader>
      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              CLIENT
            </th>
            <th scope="col" className="th-primary text-right">
              CURRENT
            </th>
            <th scope="col" className="th-primary text-right">
              1-30
            </th>
            <th scope="col" className="th-primary text-right">
              31-60
            </th>
            <th scope="col" className="th-primary text-right">
              61-90
            </th>
            <th scope="col" className="th-primary text-right">
              OVER 90
            </th>
            <th scope="col" className="th-primary text-right">
              TOTAL
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            clients?.data?.map((item) => (
              <TrowDark key={item.id}>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.name ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item?.owed_now)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item?.owed_1_to_30)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item?.owed_31_to_60)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item?.owed_61_to_90)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item?.owed_over_90)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item?.owed_total)}
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
        paginatedData={clients}
        onLinkClicked={onPaginationLinkClicked}
      />
    </CardDark>
  );
}
