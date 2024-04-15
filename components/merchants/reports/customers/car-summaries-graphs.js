import Card from "@/components/ui/layouts/card";
import { TDateFilter } from "@/components/ui/layouts/scrolling-table";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import {
  getDateFilterFrom,
  getDateFilterTo,
} from "@/lib/shared/data-formatters";
import { fetchCarSummaryGraph } from "@/store/merchants/reports/reports-slice";
import store from "@/store/store";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";

export default function CarSummariesGraphs() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchCarSummaryGraph(params));
  }, [startDate, endDate, accessToken]);

  const summaries = useSelector((state) => state.reports.carSummaryGraph);
  const isLoading = useSelector(
    (state) => state.reports.carSummaryGraphStatus === "loading"
  );

  return (
    <div className="flex flex-col w-full gap-2">
      <Card>
        <TableCardHeader>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </TableCardHeader>
      </Card>

      {isLoading && (
        <div className="w-full flex justify-center rounded p-4 bg-white">
          <StatelessLoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <BarGraph
            title="Car Types(sales)"
            data={summaries?.sales?.car_types?.map((val) => val.total_sum)}
            labels={summaries?.sales?.car_types?.map((val) => val.car_type)}
            dataLabel="Sales"
          />

          <BarGraph
            title="Car Types(count)"
            data={summaries?.counts?.car_types?.map((val) => val.count)}
            labels={summaries?.counts?.car_types?.map((val) => val.car_type)}
            dataLabel="Count"
          />

          <BarGraph
            title="Car Models(sales)"
            data={summaries?.sales?.car_models?.map((val) => val.total_sum)}
            labels={summaries?.sales?.car_models?.map((val) => val.car_model)}
            dataLabel="Sales"
          />

          <BarGraph
            title="Car Models(count)"
            data={summaries?.counts?.car_models?.map((val) => val.count)}
            labels={summaries?.counts?.car_models?.map((val) => val.car_model)}
            dataLabel="Count"
          />

          <BarGraph
            title="Car Makes(sales)"
            data={summaries?.sales?.car_makes?.map((val) => val.total_sum)}
            labels={summaries?.sales?.car_makes?.map((val) => val.car_make)}
            dataLabel="Sales"
          />

          <BarGraph
            title="Car Makes(count)"
            data={summaries?.counts?.car_makes?.map((val) => val.count)}
            labels={summaries?.counts?.car_makes?.map((val) => val.car_make)}
            dataLabel="Count"
          />
        </div>
      )}
    </div>
  );
}

function BarGraph({ labels, data, dataLabel, title }) {
  // ==========================================================================
  // Referrals Bar
  // ==========================================================================
  const referralsOptions = {
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

  const referralsData = {
    labels: labels ?? [],
    datasets: [
      {
        label: dataLabel ?? "",
        data: data ?? [],
        backgroundColor: ["#376FD0", "#1B5E20", "#C62828", "#E65100"],
      },
    ],
  };

  const referralsBarGraph = (
    <div className="rounded bg-white p-4">
      <div className="text-lg w-full text-center font-bold">{title}</div>
      <div className="h-72">
        <Bar
          options={referralsOptions}
          data={referralsData}
          updateMode="resize"
        />
      </div>
    </div>
  );
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  return referralsBarGraph;
}
