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
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import { TDateFilter } from "../../../../components/ui/layouts/scrolling-table";
import TableCardHeader from "../../../../components/ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import Card from "../../../../components/ui/layouts/card";
import { Button } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";

function GraphsView({
  startDate = null,
  endDate = null,
  isLoading = false,
  data = null,
  setStartDate = () => {},
  setEndDate = () => {},
} = {}) {
  const { data: session, status } = useSession();

  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/profit-and-loss/export-pdf`;

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
        message: "Download Successful",
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

  // ==========================================================================
  // Payments pie
  // ==========================================================================
  const paymentsPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };

  const paymentsPieData = {
    labels: Object.keys(data?.payments_worth ?? {}),
    datasets: [
      {
        label: "Amount",
        data: Object.values(data?.payments_worth ?? {}),
        backgroundColor: ["#376FD0", "#1B5E20", "#C62828", "#E65100"],
      },
    ],
  };

  const paymentsPieGraph = (
    <div className="rounded bg-white p-4">
      <div className="text-sm w-full text-center font-bold">Payments Worth</div>
      <div className="h-72">
        <Pie
          options={paymentsPieOptions}
          data={paymentsPieData}
          updateMode="resize"
        />
      </div>
    </div>
  );
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // ==========================================================================
  // Sales vs Discounts
  // ==========================================================================
  const tdLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };

  const tdLineData = {
    labels: Object.keys(data?.last_x_transactions ?? {}),
    datasets: [
      {
        label: "Transactions",
        data: Object.values(data?.last_x_transactions ?? {}),
        borderColor: "#376FD0",
        backgroundColor: "#376FD0",
        tension: 0.4,
      },
      {
        label: "Discounts",
        data: Object.values(data?.last_x_transaction_discounts ?? {}),
        borderColor: "rgb(54, 75, 106)",
        backgroundColor: "rgba(54, 75, 106, 1)",
        tension: 0.4,
      },
    ],
  };

  const tdLineGraph = (
    <div className="rounded bg-white p-4">
      <div className="text-sm w-full text-center font-bold">
        Transactions vs Discounts
      </div>
      <div className="h-72">
        <Line options={tdLineOptions} data={tdLineData} updateMode="resize" />
      </div>
    </div>
  );
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // ==========================================================================
  // Income vs Expenses
  // ==========================================================================
  const ieLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };

  const ieLineData = {
    labels: Object.keys(data?.last_x_invoices ?? {}),
    datasets: [
      {
        label: "Invoices",
        data: Object.values(data?.last_x_invoices ?? {}),
        borderColor: "#376FD0",
        backgroundColor: "#376FD0",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: Object.values(data?.last_x_expenses ?? {}),
        borderColor: "rgb(54, 75, 106)",
        backgroundColor: "rgba(54, 75, 106, 1)",
        tension: 0.4,
      },
    ],
  };

  const ieLineGraph = (
    <div className="rounded bg-white p-4">
      <div className="text-sm w-full text-center font-bold">
        Income vs Expenses
      </div>
      <div className="h-72">
        <Line options={ieLineOptions} data={ieLineData} updateMode="resize" />
      </div>
    </div>
  );
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // ==========================================================================
  // Sales Breakdown Pie
  // ==========================================================================
  const sbPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };

  const sbPieData = {
    labels: Object.keys(data?.sales_breakdown ?? {}),
    datasets: [
      {
        label: "Amount",
        data: Object.values(data?.sales_breakdown ?? {}),
        backgroundColor: ["#376FD0", "#1B5E20", "#C62828", "#E65100"],
      },
    ],
  };

  const sbDoughnutGraph = (
    <div className="rounded bg-white p-4">
      <div className="text-lg w-full text-center font-bold">
        Points Comparison
      </div>
      <div className="h-72">
        <Doughnut options={sbPieOptions} data={sbPieData} updateMode="resize" />
      </div>
    </div>
  );
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  const actions = (
    <Button leftIcon={<IconPrinter size={18} />} variant="outline" clickHandler={exportPDF} loading={isLoadingPdf}>Export PDF</Button>
  );

  return (
    <div className="flex flex-col gap-2">
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
        <>
          <section className="flex w-full flex-wrap md:flex-nowrap items-stretch justify-between gap-2">
            <div className="w-full md:w-9/12">{tdLineGraph}</div>
            <div className="w-full md:w-3/12">{paymentsPieGraph}</div>
          </section>

          <section className="flex w-full flex-wrap md:flex-nowrap items-stretch justify-between gap-2">
            <div className="w-full md:w-9/12">{ieLineGraph}</div>
            <div className="w-full md:w-3/12">{sbDoughnutGraph}</div>
          </section>
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
