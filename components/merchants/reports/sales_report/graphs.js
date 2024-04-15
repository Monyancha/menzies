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
import { Doughnut, Pie, Bar, Line } from "react-chartjs-2";

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
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "@/store/store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import { IconDownload, IconTableExport } from "@tabler/icons";
import { getSalesReportGraph } from "@/store/merchants/reports/reports-slice";
import { showNotification } from "@mantine/notifications";
import { Select } from "@mantine/core";

function SalesReportGraphs() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //setPaymentMethod
  const [paymentMethod, setPaymentMethod] = useState("");
  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const trends = useSelector((state) => state.reports.getSalesReportGraph);

  const trendStatus = useSelector(
    (state) => state.reports.getSalesReportGraphStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = trendStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (!startDate && !endDate) {
      store.dispatch(getSalesReportGraph(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    //paymentMethod
    if (paymentMethod) {
      params["paymentMethod"] = paymentMethod;
    }

    // console.log(session.user.accessToken);

    store.dispatch(getSalesReportGraph(params));
  }, [branch_id, session, status, startDate, endDate, paymentMethod]);

  console.log("Monyancha Enock", trends);

  const data = {
    labels: trends?.pmethod_labels,
    datasets: [
      {
        label: "Total ",
        data: trends?.pmethod_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(74, 124, 21, 1)",
          "rgba(74, 24, 213, 1)",
          "rgba(74, 24, 13, 123)",
        ],
        borderColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(74, 124, 21, 1)",
          "rgba(74, 24, 213, 1)",
          "rgba(74, 24, 13, 123)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const data2 = {
    labels: trends?.client_visits_labels,

    datasets: [
      {
        label: "No. of Clients (%)",
        data: trends?.client_visits_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(74, 124, 21, 1)",
          "rgba(74, 24, 213, 1)",
          "rgba(74, 24, 13, 123)",
        ],
        borderColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(74, 124, 21, 1)",
          "rgba(74, 24, 213, 1)",
          "rgba(74, 24, 13, 123)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const salesOptions = {
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
        display: true,
        text: "Total sales",
      },
    },
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
    labels: trends?.sdc_labels,
    datasets: [
      {
        label: "Sales",
        data: trends?.sdc_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(74, 124, 21, 1)",
          "rgba(74, 24, 213, 1)",
          "rgba(74, 24, 13, 123)",
        ],
      },
    ],
  };

  const data4 = {
    labels: trends?.transaction_day_labels,
    datasets: [
      {
        label: "Points",
        data: trends?.transaction_day_values,
        borderColor: "rgba(74, 124, 213, 1)",
        backgroundColor: "rgba(74, 124, 213, 1)",
        tension: 0.4,
      },
    ],
  };

  const data5 = {
    labels: trends?.sale_labels,
    datasets: [
      {
        label: "Count",
        data: trends?.sale_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(74, 124, 21, 1)",
          "rgba(74, 24, 213, 1)",
          "rgba(74, 24, 13, 123)",
        ],
        tension: 0.4,
      },
    ],
  };

  const exportExcel = async () => {
    setIsLoadingExcel(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/sales-reports/export-excel?start_date=${startDate}&end_date=${endDate}`;

    const accessToken = session.user.accessToken;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    };

    try {
      const response = await fetch(endpoint, options);
      const blob = await response.blob();

      if (!response.ok) {
        throw { message: "failure" };
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Sales Report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification({
        title: "Success",
        message: "Download successful",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Sorry! " + error.message,
        color: "red",
      });
    }

    setIsLoadingExcel(false);
  };

  const exportPdf = async () => {
    setIsLoadingPdf(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/sales-reports/export-pdf?start_date=${startDate}&end_date=${endDate}`;

    const accessToken = session.user.accessToken;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/pdf",
      },
    };

    try {
      const response = await fetch(endpoint, options);
      const blob = await response.blob();

      if (!response.ok) {
        throw { message: "failure" };
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Sales Report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification({
        title: "Success",
        message: "Download successful",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Sorry! " + error.message,
        color: "red",
      });
    }

    setIsLoadingPdf(false);
  };

  return (
    <div>
      <div className="h-full w-full bg-white rounded-xl px-6 py-4 pb-8">
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex w-full md:w-6/12 flex-wrap">
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
              <div className="text-dark text-sm">From</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                placeholder="dd/mm/yyyy"
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
                value={startDate}
              />
            </div>
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 md:pl-2 xl:w-fit">
              <div className="text-dark text-sm">To</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                placeholder="dd/mm/yyyy"
                onChange={(event) => {
                  setEndDate(event.target.value);
                }}
                value={endDate}
              />
            </div>
          </div>
          <div className="flex w-full md:w-6/12 flex-wrap md:justify-end mt-2 md:mt-0 space-x-2 items-center">
            <Select
              placeholder="Payment Method"
              data={[
                { value: "Cash", label: "Cash" },
                { value: "Mpesa", label: "Mpesa" },
                { value: "Credit", label: "Credit" },
                { value: "Others", label: "Others" },
              ]}
              size="md"
              clearable
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
            <Button
              className="mr-2"
              leftIcon={<IconTableExport size={16} />}
              variant="outline"
              loading={isLoadingExcel}
              onClick={exportExcel}
              size="md"
            >
              Excel
            </Button>
            <Button
              className="mr-2"
              leftIcon={<IconDownload size={16} />}
              variant="outline"
              loading={isLoadingPdf}
              onClick={exportPdf}
              size="md"
            >
              PDF
            </Button>
          </div>
        </div>
      </div>

      {!isLoading && (
        <>
          <div className="h-full w-full">
            <div className="h-full w-full mt-2 flex justify-between items-stretch flex-wrap">
              <div className="w-full md:w-9/12 md:pl-2">
                <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Total Sales and Discounts</span>
                  </div>
                  <div className="w-full h-full flex items-center">
                    <div className="w-full flex justify-center ">
                      <div
                        id="canvas1"
                        className="relative w-full h-72 overflow-x-hidden"
                      >
                        <Bar
                          options={salesOptions}
                          data={data3}
                          updateMode="resize"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/12">
                <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Transaction Payment Method</span>
                  </div>
                  <div id="canvas2" className="overflow-x-hidden relative h-72">
                    <Doughnut data={data} updateMode="resize" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full w-full mt-2 flex justify-between items-stretch mb-8 flex-wrap">
              <div className="w-full md:w-6/12 ">
                <div className="w-full  bg-white rounded-xl px-6 py-4 pb-8">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Transactions per Day</span>
                  </div>
                  <div
                    id="canvas3"
                    className="w-full relative overflow-x-hidden h-72"
                  >
                    <Line options={options} data={data4} updateMode="resize" />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-6/12 md:pl-2 ">
                <div className="w-full  bg-white rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Product Sales Trends</span>
                  </div>
                  <div
                    id="canvas3"
                    className="w-full relative overflow-x-hidden h-72"
                  >
                    <Bar options={options} data={data5} updateMode="resize" />
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

export default SalesReportGraphs;
