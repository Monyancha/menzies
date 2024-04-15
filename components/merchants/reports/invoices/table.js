import { Button, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import {
  TDateFilter,
  TSearchFilter,
} from "../../../../components/ui/layouts/scrolling-table";
import TableCardHeader from "../../../../components/ui/layouts/table-card-header";
import { IconPrinter } from "@tabler/icons-react";

function TableView() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const router = useRouter();
  const current = useSelector(
    (state) => state.reports?.getInvoices?.invoice_report_totals
  );

  const isLoaded = useSelector(
    (state) => state.reports?.getInvoicesStatus === "fulfilled"
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!isLoaded) {
      router.replace("/reports");
    }
  }, [branch_id, isLoaded, router]);

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/invoice-reports/export-pdf`;

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
    a.innerHTML = `Bookings.pdf`;
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successfull",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
    setIsLoadingPdf(false);
  };

  const actions = (
    <Button leftIcon={<IconPrinter size={18} />} variant="outline" clickHandler={exportPDF} loading={isLoadingPdf}>Export PDF</Button>
  );

  return (
    <Card>
      <div className="h-full w-full bg-white rounded-xl px-6 py-4 pb-8">
        <TableCardHeader actions={actions}>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </TableCardHeader>
      </div>

      <div className="flex flex-col z-0">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
          <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg">
              <table className="rounded-lg min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary text-lg">
                      Invoice Statement
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-lg text-right"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b ">
                    <td
                      style={{ fontSize: 20 }}
                      className="py-3 px-6 text-sm font-large text-blue-900 whitespace-nowrap"
                    >
                      <b>INVOICE TOTALS</b>
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap"></td>
                  </tr>
                  <tr className="bg-white border-b ">
                    <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <span className="ml-4">Total Amount</span>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                      {formatNumber(current?.total_amount)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b ">
                    <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <span className="ml-4">Total Paid</span>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                      {formatNumber(current?.total_paid)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b ">
                    <td className="py-3 px-6 text-sm font-medium text-green-600 whitespace-nowrap">
                      <span className="ml-4">
                        <b>Total Owed</b>
                      </span>
                    </td>
                    <td className="py-3 px-6 text-lg text-green-600 whitespace-nowrap text-right">
                      {formatNumber(current?.total_owed)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b ">
                    <td
                      style={{ fontSize: 20 }}
                      className="py-3 px-6 text-sm font-large text-blue-900 whitespace-nowrap"
                    >
                      <b>INVOICE DEDUCTIONS</b>
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap"></td>
                  </tr>
                  <tr className="bg-white border-b ">
                    <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <span className="ml-4">Discounts</span>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                      {formatNumber(current?.total_discounts)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b ">
                    <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <span className="ml-4">Taxes</span>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                      {formatNumber(current?.total_taxes)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b ">
                    <td className="py-3 px-6 text-sm font-medium text-green-600 whitespace-nowrap">
                      <span className="ml-4">
                        <b>Total Deductions</b>
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-green-600 whitespace-nowrap text-right">
                      {formatNumber(
                        current?.total_discounts + current?.total_taxes
                      )}
                    </td>
                  </tr>
                  <tr className="bg-primary border-b text-white">
                    <td
                      style={{ fontSize: 20 }}
                      className="py-3 px-6 text-sm font-large text-white whitespace-nowrap"
                    >
                      <b>Net Total Owed</b>
                    </td>
                    <td className="py-3 px-6 text-lg text-green-600 whitespace-nowrap text-right">
                      {formatNumber(current?.total_owed)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TableView;
