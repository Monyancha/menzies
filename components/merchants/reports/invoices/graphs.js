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
import { getInvoices } from "../../../../src/store/reports/reports-slice";
import store from "../../../../src/store/Store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import {
  TDateFilter,
  TSearchFilter,
} from "../../../../components/ui/layouts/scrolling-table";
import { showNotification } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";

function GraphsView() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const invoices = useSelector((state) => state.reports.getInvoices);

  const invoicesStatus = useSelector(
    (state) => state.reports.getInvoicesStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = invoicesStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    if (!startDate && !endDate) {
      store.dispatch(getInvoices(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getInvoices(params));
  }, [branch_id, session, status, startDate, endDate]);

  console.log(invoices);

  const data = {
    labels: invoices?.pmethod_labels,

    datasets: [
      {
        label: "Invoices Payment Method",
        data: invoices?.pmethod_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(217, 78, 78)",
        ],
        borderColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(217, 78, 78, 1)",
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
    labels: invoices?.transaction_day_labelsx,
    datasets: [
      {
        label: "Count",
        data: invoices?.transaction_day_valuesx,
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
    labels: invoices?.sdc_labels,
    datasets: [
      {
        label: "Amount",
        data: invoices?.sdc_values,
        borderColor: "rgba(74, 124, 213, 1)",
        backgroundColor: "rgba(74, 124, 213, 1)",
      },
    ],
  };

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
    <div>
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

      {!isLoading && (
        <>
          <div className="h-full w-full">
            <div className="h-full w-full mt-2 flex justify-between items-stretch flex-wrap">
              <div className="w-full md:w-9/12">
                <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
                  <div className="text-sm font-semibold">
                    Total Invoices Amount
                  </div>
                  <div className="w-full h-full flex items-center">
                    <div className="w-full flex justify-center ">
                      <div
                        id="canvas1"
                        className="relative w-full h-72 overflow-x-hidden"
                        style={{ display: "block", width: "100%" }}
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
                    Invoices Payment Method
                  </div>
                  <div id="canvas2" className="overflow-x-hidden relative h-72">
                    <Doughnut data={data} />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full w-full mt-2 flex justify-between items-stretch mb-8 flex-wrap">
              <div className="w-full md:w-12/12">
                <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
                  <div className="text-sm font-semibold">
                    Invoices per Month
                  </div>
                  <div id="canvas3" className="w-100 h-72 overflow-x-hidden">
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
