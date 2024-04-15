import { Tabs } from "@mantine/core";
import Card from "../../../../components/ui/layouts/card";
import { IconGraph, IconCash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { getProfitLossGraphReports } from "../../../../src/store/reports/reports-slice";
import store from "../../../../src/store/Store";
import {
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import GraphsView from "./graphs";
import TableView from "./table";

function ProfitLossView() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("graphs");
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const branch_id = useSelector((state) => state.branches.branch_id);

  const rawData = useSelector(
    (state) => state.reports.getProfitLossGraphReports
  );

  const isLoading = useSelector(
    (state) => state.reports.getProfitLossGraphReportsStatus === "loading"
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getProfitLossGraphReports(params));
  }, [branch_id, session, status, startDate, endDate]);

  return (
    <Tabs defaultValue="graphs" value={activeTab} onTabChange={setActiveTab}>
      <div className="w-full h-full flex flex-col gap-1">
        <Card>
          <Tabs.List>
            <Tabs.Tab value="graphs" icon={<IconGraph size={14} />}>
              Graphs View
            </Tabs.Tab>
            <Tabs.Tab value="tabular" icon={<IconCash size={14} />}>
              Tabular View
            </Tabs.Tab>
          </Tabs.List>
        </Card>

        <Tabs.Panel value="graphs">
          {activeTab === "graphs" && (
            <GraphsView
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              isLoading={isLoading}
              data={rawData}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="tabular">
          {activeTab === "tabular" && (
            <TableView
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              isLoading={isLoading}
              data={rawData}
            />
          )}
        </Tabs.Panel>
      </div>
    </Tabs>
  );
}

export default ProfitLossView;
