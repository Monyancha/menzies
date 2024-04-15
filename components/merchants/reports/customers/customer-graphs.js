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
import { getCustomerTrends } from "../../../../store/merchants/reports/reports-slice";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@mantine/core";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";

function CustomerTrendGraphs() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const trends = useSelector((state) => state.reports.getCustomerTrends);

  const trendStatus = useSelector(
    (state) => state.reports.getCustomerTrendsStatus
  );

  const isLoading = trendStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(getCustomerTrends(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    // console.log(session.user.accessToken);

    store.dispatch(getCustomerTrends(params));
  }, [session, status, startDate, endDate]);

  // console.log(trends.client_visits_labels)

  const data = {
    labels: trends?.client_visits_labels,

    datasets: [
      {
        label: "No. of Clients ",
        data: trends?.client_visits_pcvalues,
        backgroundColor: ["rgba(255, 140, 66, 1)", "rgba(74, 124, 213, 1)"],
        borderColor: ["rgba(255, 140, 66, 1)", "rgba(74, 124, 213, 1)"],
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
        backgroundColor: ["rgba(93, 162,113, 1)", "rgba(74, 124, 213, 1)"],
        borderColor: ["rgba(93, 162,113, 1)", "rgba(74, 124, 213, 1)"],
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
    labels: trends?.product_b_labels,
    datasets: [
      {
        label: "Sales",
        data: trends?.product_b_values,
        backgroundColor: "rgba(255, 140, 66, 1)",
      },
    ],
  };

  const data4 = {
    labels: trends?.visit_trend_labels,
    datasets: [
      {
        label: "Points",
        data: trends?.visit_trend_values,
        borderColor: "rgba(74, 124, 213, 1)",
        backgroundColor: "rgba(74, 124, 213, 1)",
        tension: 0.4,
      },
    ],
  };

  const data5 = {
    labels: trends?.visit_labels,
    datasets: [
      {
        label: "Count",
        data: trends?.visit_values,
        borderColor: "rgba(255, 242, 117, 1)",
        backgroundColor: "rgba(255, 242, 117, 1)",
        tension: 0.4,
      },
    ],
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
        </div>
      </div>

      {!isLoading && (
        <>
          <div className="h-full w-full">
            <div className="h-full w-full mt-2 flex justify-between items-stretch flex-wrap">
              <div className="w-full md:w-3/12">
                <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Client Visits</span>
                  </div>
                  <div id="canvas2" className="overflow-x-hidden relative h-72">
                    <Doughnut data={data} updateMode="resize" />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/12 md:pl-2">
                <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Client by Visit (%)</span>
                  </div>
                  <div id="canvas5" className="overflow-x-hidden relative h-72">
                    <Pie data={data2} updateMode="resize" />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-6/12  md:pl-2">
                <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Product Sales Trends</span>
                  </div>
                  <div className="w-full h-full flex items-center">
                    <div className="w-full flex justify-center ">
                      <div
                        id="canvas1"
                        className="relative w-full h-72 overflow-x-hidden"
                      >
                        <Bar options={options} data={data3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full w-full mt-2 flex justify-between items-stretch mb-8 flex-wrap">
              <div className="w-full md:w-6/12 ">
                <div className="w-full  bg-white rounded-xl px-6 py-4 pb-8">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Client Visit Trends</span>
                  </div>
                  <div
                    id="canvas3"
                    className="w-full relative overflow-x-hidden h-72"
                  >
                    <Line options={options} data={data4} />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-6/12 md:pl-2 ">
                <div className="w-full  bg-white rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
                  <div className="text-sm font-semibold flex justify-between items-center">
                    <span>Loyal Clients</span>
                  </div>
                  <div
                    id="canvas3"
                    className="w-full relative overflow-x-hidden h-72"
                  >
                    <Line options={options} data={data5} />
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

export default CustomerTrendGraphs;
