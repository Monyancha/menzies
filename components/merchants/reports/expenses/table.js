import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Button, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../../../lib/shared/data-formatters";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import { useSession } from "next-auth/react";
import store from "../../../../src/store/Store";
import { getExpenses } from "../../../../src/store/reports/reports-slice";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  TDateFilter,
  TSearchFilter,
} from "../../../ui/layouts/scrolling-table";
import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import { showNotification } from "@mantine/notifications";
import { IconPrinter } from "@tabler/icons-react";

function TableView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const current = useSelector((state) => state.reports?.getExpenses);

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const isLoaded = useSelector(
    (state) => state.reports?.getExpensesStatus === "fulfilled"
  );
  const branch_id = useSelector((state) => state.branches.branch_id);

  const expenses = useSelector((state) => state.reports.getExpenses);

  const expenseStatus = useSelector((state) => state.reports.getExpensesStatus);

  const isLoading = expenseStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (startDate || endDate) {
      params["startDate"] = startDate;
      params["endDate"] = endDate;
    }

    store.dispatch(getExpenses(params));
  }, [branch_id, session, status, startDate, endDate]);


  console.log("Current Expenses Data", current);

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint =
      `${API_URL}/reports/expenses-reports/export-pdf?start_date=${startDate}&&end_date=${endDate}&&` +
      new URLSearchParams({
        branch_id: branch_id,
      });

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
    a.innerHTML = `Expenses.pdf`;
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

  function calculateNetTotal(expenseItems) {
    let netTotal = 0;
    if (expenseItems) {
      expenseItems.forEach((item) => {
        netTotal += item.total ?? 0;
      });
    }
    return netTotal;
  }

  return (
    <Card>
      {current && (
        <>
          <TableCardHeader>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
          
      </TableCardHeader>
      <div className="flow-root">
        <div className="float-right">

            <Button variant="outline" size="xs" leftIcon={<IconPrinter size={18} />} clickHandler={exportPDF} loading={isLoadingPdf} >Export PDF</Button>
        </div>
      </div>
          {!isLoading && (
            <div className="flex flex-col z-0">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
                <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden rounded-lg">
                    <table className="rounded-lg min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="th-primary text-lg">
                            Expense Statement
                          </th>
                          <th
                            scope="col"
                            className="th-primary text-lg text-right"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b">
                          <td
                            style={{ fontSize: 20 }}
                            className="py-3 px-6 text-sm font-large text-blue-900 whitespace-nowrap"
                          >
                            <b>Expenses</b>
                          </td>
                          <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap"></td>
                        </tr>
                        {current?.expense_items?.map((item) => (
                          <tr
                            className="bg-white border-b"
                            key={item.payment_method}
                          >
                            <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                              <span className="ml-4">
                                {item?.payment_method ?? "-"}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                              {item?.total ?? "0"}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-primary border-b text-white">
                          <td
                            style={{ fontSize: 20 }}
                            className="py-3 px-6 text-sm font-large text-white whitespace-nowrap"
                          >
                            <b>Net Expenses</b>
                          </td>
                          <td className="py-3 px-6 text-lg text-green-600 whitespace-nowrap text-right">
                            {/* Ksh. {calculateNetTotal(current?.expense_items)} */}
                            Ksh. {formatNumber(current?.total_expenses) ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center w-full p-3 bg-light rounded-lg">
              <StatelessLoadingSpinner />
            </div>
          )}
        </>
      )}

      {!current && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </Card>
  );
}

export default TableView;
