import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../../src/store/Store";
import PaginationLinks from "../../ui/layouts/pagination-links";
import {
  formatDate,
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../lib/shared/data-formatters";
import { Button } from "@mantine/core";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import { Table, TDateFilter } from "../../../components/ui/layouts/scrolling-table";
import { fetchCompanyStatementOfAccounts } from "../../../src/store/accounts/accounts-slice";
import { downloadFile } from "../../../lib/shared/printing-helpers";
import {
  TheadDark,
  TrowDark,
} from "../../../components/ui/layouts/scrolling-table-dark";
import StatelessLoadingSpinnerDark from "../../../components/ui/utils/stateless-loading-spinner-dark";
import CardDark from "../../../components/ui/layouts/card-dark";

export default function CompanyStatementOfAccounts({ companyId }) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const records = useSelector((state) => state.accounts.companySoA);

  const isLoading = useSelector(
    (state) => state.accounts.companySoAStatus === "loading"
  );

  useEffect(() => {
    if (!companyId || !accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchCompanyStatementOfAccounts(params));
  }, [accessToken, companyId, startDate, endDate, branch_id]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["companyId"] = companyId;
    params["branch_id"] = branch_id;
    params["page"] = page;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchCompanyStatementOfAccounts(params));
  }

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  async function downloadPdf() {
    const params = {};
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    let url = `/accounts/companies/${companyId}/statement_of_accounts_pdf?`;
    url += new URLSearchParams(params);

    setIsDownloadingPdf(true);

    await downloadFile({
      accessToken,
      url,
      fileName: `SoA - ${companyId}.pdf`,
    });

    setIsDownloadingPdf(false);
  }

  const actions = (
    <Button
      size="xs"
      variant="outline"
      onClick={downloadPdf}
      loading={isDownloadingPdf}
    >
      Pdf
    </Button>
  );

  return (
    <CardDark>
      <main className="flex flex-col gap-4">
        <TableCardHeader actions={actions}>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </TableCardHeader>

        <section className="flex w-full flex-row justify-end">
          <div className="w-full">
            <Table>
              <TheadDark>
                <tr>
                  <th
                    scope="col"
                    className="th-primary text-lg text-left"
                    colSpan={2}
                  >
                    Statement of Accounts
                  </th>
                </tr>
              </TheadDark>
              {!isLoading && (
                <tbody>
                  <TRowSubHeader label="Account Summary (Ksh)" />
                  <TRowRecord
                    label="Invoiced Amount"
                    value={records?.total_invoices ?? 0}
                  />
                  <TRowRecord
                    label="Amount Paid"
                    value={records?.total_payments ?? 0}
                  />
                  <TRowFooter
                    label="Balance Due"
                    value={records?.balance_due ?? 0}
                  />
                </tbody>
              )}
            </Table>
          </div>
        </section>

        <Table>
          <TheadDark>
            <tr>
              <th scope="col" className="th-primary">
                Record ID
              </th>
              <th scope="col" className="th-primary">
                Type
              </th>
              <th scope="col" className="th-primary">
                Details
              </th>
              <th scope="col" className="th-primary text-right">
                Amount
              </th>
              <th scope="col" className="th-primary text-right">
                Payments
              </th>
              <th scope="col" className="th-primary text-right">
                Date
              </th>
            </tr>
          </TheadDark>
          <tbody>
            {!isLoading &&
              records?.invoices?.data?.map((item) => (
                <>
                  {item?.payments?.map((record) => (
                    <TrowDark key={`${item.id}_payment`}>
                      <td>{record.id}</td>
                      <td>Payment</td>
                      <td>FOR: {item?.invoice_number ?? "-"}</td>
                      <td className="text-right"></td>
                      <td className="text-right">
                        {formatNumber(record?.amount ?? 0)}
                      </td>
                      <td className="text-right">
                        {formatDate(record?.created_at)}
                      </td>
                    </TrowDark>
                  ))}

                  <TrowDark key={`${item.id}_invoice`}>
                    <td>{item.id}</td>
                    <td>Invoice</td>
                    <td>{item?.invoice_number ?? "-"}</td>
                    <td className="text-right">
                      {formatNumber(item?.amount ?? 0)}
                    </td>
                    <td className="text-right"></td>
                    <td className="text-right">
                      {formatDate(item?.created_at)}
                    </td>
                  </TrowDark>
                </>
              ))}
          </tbody>
        </Table>

        {!isLoading && (
          <div>
            <span className="font-bold text-sm text-base-content">
              Aging Report
            </span>
            <Table>
              <TheadDark>
                <tr>
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
              </TheadDark>
              <tbody>
                <TrowDark>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(records?.contact?.owed_now)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(records?.contact?.owed_1_to_30)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(records?.contact?.owed_31_to_60)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(records?.contact?.owed_61_to_90)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(records?.contact?.owed_over_90)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                    {formatNumber(records?.contact?.owed_total)}
                  </td>
                </TrowDark>
              </tbody>
            </Table>
          </div>
        )}
      </main>

      {isLoading && (
        <div className="flex justify-center w-full p-3 rounded-lg">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinks
        paginatedData={records?.invoices}
        onLinkClicked={onPaginationLinkClicked}
      />
    </CardDark>
  );
}

function TRowRecord({ label, value }) {
  return (
    <TrowDark>
      <td>
        <span className="pl-4">{label}</span>
      </td>
      <td className="text-right">{formatNumber(value ?? 0)}</td>
    </TrowDark>
  );
}

function TRowSubHeader({ label }) {
  return (
    <TrowDark>
      <td className="text-lg text-primary font-bold" colSpan={2}>
        {label}
      </td>
    </TrowDark>
  );
}

function TRowFooter({ label, value }) {
  return (
    <TrowDark>
      <td className="text-lg bg-primary text-info">{label}</td>
      <td className="text-right bg-primary text-info">
        {formatNumber(value ?? 0)}
      </td>
    </TrowDark>
  );
}
