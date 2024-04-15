import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import TableCardHeader from "../../../../components/ui/layouts/table-card-header";
import {
  TDateFilter,
  Table,
  Thead,
  Trow,
  TSearchFilter,
} from "../../../../components/ui/layouts/scrolling-table";
import Card from "../../../../components/ui/layouts/card";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import { showNotification } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";

function TableView({
  startDate = null,
  endDate = null,
  data = null,
  isLoading = false,
  setStartDate = () => {},
  setEndDate = () => {},
} = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const current = useSelector(
    (state) => state.reports?.getProfitLossGraphReports
  );

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const isLoaded = useSelector(
    (state) => state.reports?.getProfitLossGraphReportsStatus === "fulfilled"
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const exportPDF = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    let endpoint = `${API_URL}/reports/profit-and-loss/export-pdf?`;

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    endpoint += new URLSearchParams(params);

    try {
      setIsLoadingPdf(true);

      await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.blob();

        if (!response.ok) {
          throw { message: "Could not download file" };
        }

        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.target = "_blank";
        a.click();
      });

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Download Successfull",
          color: "green",
        });
      }
    } catch (e) {
      showNotification({
        title: "Error",
        message: e?.message ?? "Could not download",
        color: "red",
      });
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const actions = (
    <Button leftIcon={<IconPrinter size={18} />} variant="outline" clickHandler={exportPDF} loading={isLoadingPdf}>Export PDF</Button>
  );

  return (
    <div className="flex flex-col gap-1">
      <Card>
        <TableCardHeader actions={actions}>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </TableCardHeader>
      </Card>

      {!isLoading && (
        <Card>
          <Table>
            <Thead>
              <tr>
                <th scope="col" className="th-primary text-lg">
                  Profit &amp; Loss Statement (Ksh)
                </th>
                <th scope="col" className="th-primary"></th>
              </tr>
            </Thead>
            <tbody>
              <TRowSubHeader label="INCOME" />
              {/* <Trow>
                <td>
                  <span className="pl-4">Transaction Sales</span>
                </td>
                <td className="text-right">
                  {formatNumber(data?.all_debit_payments ?? 0)}
                </td>
              </Trow> */}
              <Trow>
                <td>
                  <span className="pl-4">Invoices Paid</span>
                </td>
                <td className="text-right">
                Ksh. {formatNumber(Math.abs(data?.total_invoices ?? 0))}
                </td>
              </Trow>
              <TRowFooter
                label="TOTAL INCOME"
                value={Math.abs(data?.total_income) ?? 0}
              />

              <TRowSubHeader label="LESS COST OF SALES" />
              {/* <TRowRecord
                label="Discounts"
                value={data?.total_discounts ?? 0}
              /> */}
              <TRowRecord label="Vendor Purchases" value={Math.abs(data?.total_purchases) ?? 0} />

              <TRowFooter
                label="GROSS PROFIT"
                value={Math.abs(data?.gross_profit) ?? 0}
              />

              <TRowSubHeader label="OPERATING EXPENSES" />
              <TRowRecord label="Expenses" value={data?.total_expenses ?? 0} />
              <TRowRecord
                label="Petty Cash (OUT)"
                value={data?.petty_cash_out ?? 0}
              />
              <TRowRecord
                label="Staff Wages"
                value={data?.total_staff_payments ?? 0}
              />
              <TRowRecord
                label="Tax Deductions"
                value={data?.total_taxes ?? 0}
              />

              <TRowFooter label="NET PROFIT" value={data?.net_profit ?? 0} />
            </tbody>
          </Table>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </div>
  );
}

function TRowRecord({ label, value }) {
  return (
    <Trow>
      <td>
        <span className="pl-4">{label}</span>
      </td>
      <td className="text-right">Ksh. {formatNumber(value ?? 0)}</td>
    </Trow>
  );
}

function TRowSubHeader({ label }) {
  return (
    <Trow>
      <td className="text-lg text-primary font-bold" colSpan={2}>
        {label}
      </td>
    </Trow>
  );
}

function TRowFooter({ label, value }) {
  return (
    <Trow>
      <td className="text-lg bg-primary text-info">{label}</td>
      <td className="text-right bg-primary text-info">
        Ksh. {formatNumber(value ?? 0)}
      </td>
    </Trow>
  );
}

export default TableView;
