import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
//
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import {
  Table,
  TDateFilter,
  Thead,
  Trow,
  TSearchFilter,
} from "../../../components/ui/layouts/scrolling-table";
import { IconFileExport } from "@tabler/icons-react";
import { formatNumber } from "../../../lib/shared/data-formatters";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import CardDark from "../../../components/ui/layouts/card-dark";
import store from "../../../src/store/Store";
import StatelessLoadingSpinnerDark from "../../../components/ui/utils/stateless-loading-spinner-dark";
import PaginationLinksDark from "../../../components/ui/layouts/pagination-links-dark";
import { fetchCompanySummaryWithItems } from "../../../src/store/merchants/inventory/purchases-slice";
import { Button } from "@mantine/core";
import { downloadFile } from "../../../lib/shared/printing-helpers";

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
  {
    title: "Detailed Vendor Reports",
  },
];

export default function CompaniesPageDetailed() {

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Detailed Vendor Reports" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

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

  const branch_id = useSelector((state) => state.branches.branch_id);
  const [filter, setFilter] = useState("");

  const isLoading = useSelector(
    (state) => state.purchases.companySummaryWithItemsStatus === "loading"
  );

  const companyList = useSelector(
    (state) => state.purchases.companySummaryListWithItems
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(fetchCompanySummaryWithItems(params));
  }, [accessToken, branch_id]);

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

    store.dispatch(fetchCompanySummaryWithItems(params));
  }

  const [isExporting, setIsExporting] = useState(false);
  async function downloadExcel() {
    const url = `/reports/purchases/company_bills_and_payments_with_items_excel?`;

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
      <TableCardHeader actions={actions}>
        <TSearchFilter onChangeSearchTerm={setFilter} />
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              COMPANY
            </th>
            <th scope="col" className="th-primary">
              ITEM NAME
            </th>
            <th scope="col" className="th-primary text-right">
              QUANTITY
            </th>
            <th scope="col" className="th-primary text-right">
              UNIT PRICE
            </th>
            <th scope="col" className="th-primary text-right">
              SUBTOTAL
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            companyList?.data?.map((item) => (
              <Fragment key={item.id}>
                {item?.bill_items.map((billItem, idx) => (
                  <Trow key={billItem.id}>
                    {idx === 0 && (
                      <td
                        className="py-3 px-6 text-sm whitespace-nowrap text-center"
                        rowSpan={`${item?.bill_items.length}`}
                        colSpan="1"
                        key={item.id}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-left text-xs font-bold w-fit">
                            ID
                          </span>

                          <span className="text-left">{item.id}</span>

                          <span className="text-left text-xs font-bold w-fit">
                            NAME
                          </span>
                          <span className="text-left">{item.name ?? "-"}</span>

                          <span className="text-left text-xs font-bold w-fit">
                            PHONE
                          </span>
                          <span className="text-left">{item.phone ?? "-"}</span>

                          <span className="text-left text-xs font-bold w-fit">
                            PIN
                          </span>
                          <span className="text-left">
                            {item.tax_id ?? "-"}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-6 text-sm whitespace-nowrap ">
                      {billItem?.sellable?.sellable?.name ?? "-"}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                      {formatNumber(billItem?.quantity ?? 0)}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                      {formatNumber(billItem?.unit_price ?? 0)}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                      {formatNumber(billItem?.subtotal ?? 0)}
                    </td>
                  </Trow>
                ))}
              </Fragment>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinksDark
        paginatedData={companyList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </CardDark>
  );
}
