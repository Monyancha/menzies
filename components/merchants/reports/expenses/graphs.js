import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import Card from "../../../ui/layouts/card";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getExpenses } from "../../../../src/store/reports/reports-slice";
import store from "../../../../src/store/Store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { showNotification } from "@mantine/notifications";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  TDateFilter,
  TSearchFilter,
} from "../../../ui/layouts/scrolling-table";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";

function GraphsView() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const expenses = useSelector((state) => state.reports.getExpenses);

  const expenseStatus = useSelector((state) => state.reports.getExpensesStatus);
  const branch_id = useSelector((state) => state.branches.branch_id);

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

  console.log(expenses);

  const data = {
    labels: expenses?.expense_items?.map((item) => item.payment_method),

    datasets: [
      {
        label: "Invoices Payment Method",
        data: expenses?.expense_items?.map((item) => item.total),
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(27, 78, 78)",
          "rgba(274, 78, 78)",
          "rgba(27, 728, 78)",
          "rgba(27, 728, 738)",
          "rgba(37, 28, 738)",
          "rgba(337, 28, 738)",
          "rgba(7, 28, 738)",
          "rgba(37, 28, 78)",
          "rgba(337, 28, 738)",
          "rgba(7, 628, 738)",
          "rgba(37, 28, 8)",
          "rgba(7, 778, 778)",
          "rgba(17, 228, 38)",
        ],
        borderColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(27, 78, 78)",
          "rgba(274, 78, 78)",
          "rgba(27, 728, 78)",
          "rgba(27, 728, 738)",
          "rgba(37, 28, 738)",
          "rgba(337, 28, 738)",
          "rgba(7, 28, 738)",
          "rgba(37, 28, 78)",
          "rgba(337, 28, 738)",
          "rgba(7, 628, 738)",
          "rgba(37, 28, 8)",
          "rgba(7, 778, 778)",
          "rgba(17, 228, 38)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const data3 = {
    labels: expenses?.transaction_day_labelsx,
    datasets: [
      {
        label: "Count",
        data: expenses?.transaction_day_valuesx,
        borderColor: "rgba(74, 124, 213, 1)",
        backgroundColor: "rgba(74, 124, 213, 1)",
        tension: 0.4,
      },
    ],
  };

  const options2 = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Horizontal Bar Chart",
      },
    },
  };

  const data2 = {
    labels: expenses?.sdc_labels,
    datasets: [
      {
        label: "Amount",
        data: expenses?.sdc_values,
        borderColor: [
          "rgba(74, 124, 213, 1)",
          "rgba(255, 140, 66, 1)",

          "rgba(217, 78, 78, 1)",
        ],
        backgroundColor: [
          "rgba(74, 124, 213, 1)",
          "rgba(255, 140, 66, 1)",

          "rgba(217, 78, 78)",
        ],
      },
    ],
  };

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/expenses-reports/export-pdf?start_date=${startDate}&&end_date=${endDate}`;

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

  return (
    <div>
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
        <ActionIconButton
              icon="fa-solid fa-download"
              isLoading={isLoadingPdf}
              tooltip="PDF"
              clickHandler={exportPDF}
            />
        </div>
      </div>
      {!isLoading && (
        <>
          <div className="h-full w-full">
            <div className="h-full w-full mt-2 flex justify-between items-stretch flex-wrap">
              <div className="w-full md:w-9/12">
                <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
                  <div className="text-sm font-semibold">Total Expenses</div>
                  <div className="w-full h-full flex items-center">
                    <div className="w-full flex justify-center ">
                      <div
                        id="canvas1"
                        className="relative w-full h-72 overflow-x-hidden"
                      >
                        <Bar options={options2} data={data2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/12 md:pl-2">
                <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
                  <div className="text-sm font-semibold">
                    Expense Categories
                  </div>
                  <div
                    id="canvas2"
                    className="overflow-x-hidden h-72 relative "
                  >
                    <Doughnut data={data} />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full w-full mt-2 flex justify-between items-stretch mb-8 flex-wrap">
              <div className="w-full md:w-12/12">
                <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
                  <div className="text-sm font-semibold">
                    Expenses per Month
                  </div>
                  <div
                    id="canvas4"
                    className="w-full relative h-72 overflow-x-hidden "
                  >
                    <Line options={options} data={data3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default GraphsView;
