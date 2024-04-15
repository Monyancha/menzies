import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
//
import Card from "../../../../components/ui/layouts/card";
import PaginationLinks from "../../../../components/ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../../components/ui/layouts/scrolling-table";
import TableCardHeader from "../../../../components/ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import { formatNumber } from "../../../../lib/shared/data-formatters";
import {
  fetchCompanyBills,
  fetchCompanyBillsExcel,
  fetchCompanyPayments,
  fetchCompanyPaymentsExcel,
  fetchCompanyPurchaseSummary,
  fetchCompanyPurchaseSummaryExcel,
} from "../../../../src/store/merchants/inventory/purchases-slice";
import store from "../../../../src/store/Store";
import { Button, Tabs, TextInput } from "@mantine/core";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IconFileExport } from "@tabler/icons-react";

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
    title: "Vendor Statement",
  },
];

export default function CompaniesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const companyId = router?.query?.companyId;

  const [activeTab, setActiveTab] = useState("summary");
  const [searchTerm, setSearchTerm] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Vendor Statement" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>


      <section className="w-full">
        <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
          <div className="z-10 w-full bg-red-300">
            <Card>
              <Tabs.List>
                <Tabs.Tab value="summary">Summary</Tabs.Tab>
                <Tabs.Tab value="bills">Bills</Tabs.Tab>
                <Tabs.Tab value="payments">Payments</Tabs.Tab>
              </Tabs.List>
            </Card>
          </div>

          <div className="w-full mt-1 z-100">
            <Tabs.Panel value="summary">
              <PurchaseSummaryView />
            </Tabs.Panel>
            <Tabs.Panel value="bills">
              <BillingsView />
            </Tabs.Panel>
            <Tabs.Panel value="payments">
              <PaymentsView />
            </Tabs.Panel>
          </div>
        </Tabs>
      </section>

      </Box>
    </PageContainer>
  );
}

function PurchaseSummaryView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const companyId = router?.query?.companyId;

  const purchases = useSelector(
    (state) => state.purchases.companySummaryDetails
  );

  const isLoading = useSelector(
    (state) => state.purchases.companySummaryDetailsStatus === "loading"
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["companyId"] = companyId;

    store.dispatch(fetchCompanyPurchaseSummary(params));
  }, [session, status, companyId]);

  return (
    <Card>
      {!isLoading && purchases && (
        <Table>
          <Thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </Thead>
          <tbody>
            <>
              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Name
                  </td>
                  <td>{purchases?.name}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Phone
                  </td>
                  <td>{purchases.phone ?? purchases?.user?.phone ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Address
                  </td>
                  <td>{purchases?.address ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Bills
                  </td>
                  <td>
                    {formatNumber(purchases?.bill_items_sum_subtotal ?? 0)}
                  </td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Payments
                  </td>
                  <td>{formatNumber(purchases?.payments_sum_amount ?? 0)}</td>
                </>
              </Trow>
            </>
          </tbody>
        </Table>
      )}

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </Card>
  );
}

function BillingsView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const companyId = router?.query?.companyId;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.purchases.companyBillStatus === "loading"
  );

  const bills = useSelector((state) => state.purchases.companyBillList);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    store.dispatch(fetchCompanyBills(params));
  }, [session, status, branch_id, companyId, startDate, endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    store.dispatch(fetchCompanyBills(params));
  }

  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadExcel() {
    if (!session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    try {
      setIsDownloading(true);
      await store.dispatch(fetchCompanyBillsExcel(params)).unwrap();
      console.log("ha");
    } catch (e) {
      console.warn(e);
    } finally {
      setIsDownloading(false);
    }
  }

  const actions = (
    <>
      <Button size="xs" variant="outline" onClick={downloadExcel} leftIcon={<IconFileExport size={18} />} loading={isDownloading}>Export</Button>
    </>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
        <div className="w-full md:w-6/12 xl:w-fit">
          <TextInput
            label="From"
            placeholder="From"
            type="date"
            onChange={(event) => {
              setStartDate(event.target.value);
            }}
            value={startDate}
          />
        </div>

        <div className="w-full md:w-6/12 xl:w-fit md:pl-2">
          <TextInput
            label="To"
            placeholder="To"
            type="date"
            onChange={(event) => {
              setEndDate(event.target.value);
            }}
            value={endDate}
          />
        </div>
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              NARRATION
            </th>
            <th scope="col" className="th-primary">
              DATE
            </th>
            <th scope="col" className="th-primary">
              ACCOUNTING DATE
            </th>
            <th scope="col" className="th-primary">
              REFERENCE TYPE
            </th>
            <th scope="col" className="th-primary text-right">
              SUBTOTAL
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            bills?.data?.map((item) => (
              <Trow key={item.id}>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-center">
                  {item.id}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.narration ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.date ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.accounting_date ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.reference_type ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item.items_sum_subtotal ?? 0)}
                </td>
              </Trow>
            ))}
          {!isLoading && (
            <Trow>
              <td
                className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold"
                colSpan={5}
              >
                TOTAL
              </td>
              <td className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold">
                {formatNumber(bills?.subtotal_sum ?? 0)}
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
        paginatedData={bills}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

function PaymentsView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const companyId = router?.query?.companyId;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.purchases.companyPaymentsStatus === "loading"
  );

  const payments = useSelector((state) => state.purchases.companyPaymentsList);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    store.dispatch(fetchCompanyPayments(params));
  }, [session, status, branch_id, companyId, startDate, endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    store.dispatch(fetchCompanyPayments(params));
  }

  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadExcel() {
    if (!session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    try {
      setIsDownloading(true);
      await store.dispatch(fetchCompanyPaymentsExcel(params)).unwrap();
    } catch (e) {
      console.warn(e);
    } finally {
      setIsDownloading(false);
    }
  }

  const actions = (
    <>
    <Button size="xs" variant="outline" onClick={downloadExcel} leftIcon={<IconFileExport size={18} />} loading={isDownloading}>Export</Button>
    </>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
        <div className="w-full md:w-6/12 xl:w-fit">
          <TextInput
            label="From"
            placeholder="From"
            type="date"
            onChange={(event) => {
              setStartDate(event.target.value);
            }}
            value={startDate}
          />
        </div>

        <div className="w-full md:w-6/12 xl:w-fit md:pl-2">
          <TextInput
            label="To"
            placeholder="To"
            type="date"
            onChange={(event) => {
              setEndDate(event.target.value);
            }}
            value={endDate}
          />
        </div>
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              NARRATION
            </th>
            <th scope="col" className="th-primary">
              DATE
            </th>
            <th scope="col" className="th-primary">
              PAYMENT TYPE
            </th>
            <th scope="col" className="th-primary">
              TYPE
            </th>
            <th scope="col" className="th-primary text-right">
              AMOUNT
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            payments?.data?.map((item) => (
              <Trow key={item.id}>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-center">
                  {item.id}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.narration ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.date ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.payment_type ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  {item.type ?? "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                  {formatNumber(item.amount ?? 0)}
                </td>
              </Trow>
            ))}
          {!isLoading && (
            <Trow>
              <td
                className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold"
                colSpan={5}
              >
                TOTAL
              </td>
              <td className="py-3 px-6 text-sm whitespace-nowrap text-right font-bold">
                {formatNumber(payments?.debit_sum ?? 0)}
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
        paginatedData={payments}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}
