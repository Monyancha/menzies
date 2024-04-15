import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState,Fragment } from "react";
import { useSession } from "next-auth/react";
import { parseValidFloat } from "../../../../lib/shared/data-formatters";
import { Button, Menu,Card } from "@mantine/core";
import { getStaffRoles } from "../../../../src/store/partners/staff-slice";
import store from "../../../../src/store/Store";
import { getDateFilterFrom,getDateFilterTo,formatNumber } from "../../../../lib/shared/data-formatters";
import { IconUsers } from "@tabler/icons-react";
import { fetchHrData } from "../../../../src/store/partners/staff-slice";

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
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
  );

function HrDashboardView() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
    const [startDate, setStartDate] = useState(getDateFilterFrom(30));
    const [endDate, setEndDate] = useState(getDateFilterTo());


    const hr_data = useSelector(
      (state) => state.staff.hr_data
    );

   




    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;

        store.dispatch(fetchHrData(params));
      }, [session, status]);

      let departments =
      [
        { label: "Accounting", value: "Accounting" },
        { label: "Sales", value: "Sales" },
        { label: "Procurement", value: "Procurement" },
      ] ?? [];

    let payments_freq =
      [
        { label: "Monthly", value: "Monthly" },
        { label: "Weekly", value: "Weekly" },
      ] ?? [];

      // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // ==========================================================================
  // Recent Attendance Line Graph
  // ==========================================================================
  const attendanceLineGraphOptions = {
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

  const inVsOutLineGraphData = {
    labels: ["09-01-2024","10-01-2024","11-01-2024","12-01-2024","13-01-2024"],
    datasets: [
      {
        label: "Dates",
        data: [0,0,0,0,3,4],
        borderColor: "#376FD0",
        backgroundColor: "#376FD0",
        tension: 0.4,
      },
    ],
  };

      const attendancePieOptions = {
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

      const commissionBarOptions = {
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

      const attendancePieData = {
        labels: hr_data?.depts,
        datasets: [
          {
            label: "No Of Attendances",
            data: hr_data?.depts_no ?? [],
            backgroundColor: ["#376FD0", "#1B5E20", "#C62828", "#E65100"],
          },
        ],
      };
      const commissionBarData = {
        labels: ["Doughlas","Abby","Abdi","Ashley"],
        datasets: [
          {
            label: "Employees",
            data: [2,0,1,1],
            backgroundColor: ["#376FD0", "#1B5E20", "#C62828", "#E65100"],
          },
        ],
      };

      const paymentsBarOptions = {
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
      const paymentsBarData = {
        labels: ["JAN","FEB","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPT","OCT","NOV","DEC"],
        datasets: [
          {
            label: "MONTHS",
            data: [6,0,0,0,0,0,0,0,0,0,0,0],
            backgroundColor: ["#376FD0", "#1B5E20", "#C62828", "#E65100","#376FD0", "#1B5E20", "#C62828", "#E65100","#376FD0", "#1B5E20", "#C62828", "#E65100"],
          },
        ],
      };
      const attendancePieGraph = (
        <div className="rounded bg-white p-4">
          <div className="text-lg w-full text-center font-bold">Employees By Department</div>
          <div className="h-72">
            <Pie
              options={attendancePieOptions}
              data={attendancePieData}
              updateMode="resize"
            />
          </div>
        </div>
      );
      const commissionBarGraph = (
        <div className="rounded bg-white p-4">
          <div className="text-lg w-full text-center font-bold">Top Employees By Attendance</div>
          <div className="h-72">
            <Bar
              options={commissionBarOptions}
              data={commissionBarData}
              updateMode="resize"
            />
          </div>
        </div>
      );

      const attendanceLineGraph = (
        <div className="rounded bg-white p-4">
          <div className="text-lg w-full text-center font-bold">
            Attendance In The Last Five Days
          </div>
          <div className="h-72">
            <Line
              options={attendanceLineGraphOptions}
              data={inVsOutLineGraphData}
              updateMode="resize"
            />
          </div>
        </div>
      );

      const paymentsBarGraph = (
        <div className="rounded bg-white p-4">
          <div className="text-lg w-full text-center font-bold">Staff Attendance Per Month</div>
          <div className="h-72">
            <Bar
              options={paymentsBarOptions}
              data={paymentsBarData}
              updateMode="resize"
            />
          </div>
        </div>
      );



      return (

        <Card>
            <section className="w-full space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <DashCard title="Total Employees" content={hr_data?.staffs_count ?? 0} />

        <DashCard
          title="Employees Present Today"
          content={hr_data?.no_of_attendances ?? 0}
        />

        <DashCard
          title="Employees Absent Today"
          content={parseValidFloat(hr_data?.staffs_count ?? 0)-parseValidFloat(hr_data?.no_of_attendances ?? 0)}

        />

        <DashCard
          title="Employees On Leave"
          content="1"

        />

        {/* <DashCard
          title="Total Salaries Paid"
          content={formatNumber(45000)}

        /> */}




      </div>

      <section className="flex w-full flex-wrap md:flex-nowrap items-stretch justify-between gap-2">
        <div className="w-full md:w-4/12">{attendancePieGraph}</div>

        <div className="w-full md:w-8/12">{commissionBarGraph}</div>
      </section>
      <section className="flex w-full flex-wrap md:flex-nowrap items-stretch justify-between gap-2">
        <div className="w-full md:w-6/12">{attendanceLineGraph}</div>

        <div className="w-full md:w-6/12">{paymentsBarGraph}</div>
      </section>

      {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {salesComparisonGraph}

        {topItems}
      </section>

      <section className="flex w-full flex-wrap md:flex-nowrap items-stretch justify-between gap-2">
        <div className="w-full md:w-8/12">{transactionLineGraph}</div>
        <div className="w-full md:w-4/12">{topProducts}</div>
      </section> */}
    </section>



        </Card>


      )

}
function DashCard({ title, content, left }) {
    return (
      <section className="rounded bg-white h-32 px-6 py-4 flex flex-col justify-start items-start border-y-2 border-x-2 pl-2">
        <span className="text-sm text-dark font-semibold flex-none">{title}</span>
        <span className="grow flex flex-col justify-center items-center">
          <div>
            {left && <span className="text-md tracking-wide mr-2">{left}</span>}
            <span className="text-2xl font-thin tracking-widest text-darkest">
              {content}
            </span>
          </div>
          <div>

          </div>
        </span>
      </section>
    );
  }
export default HrDashboardView;