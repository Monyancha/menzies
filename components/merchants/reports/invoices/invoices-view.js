import { Card, Tabs } from "@mantine/core";
import { IconGraph, IconCash, IconCashBanknote } from "@tabler/icons-react";
import { AgingReportListView } from "../../../../pages/accounts/invoices/aging";
import { useState } from "react";
import GraphsView from "./graphs";
import TableView from "./table";

function InvoicesReportView() {
  const [activeTab, setActiveTab] = useState("graphs");

  return (
    <div className="w-full">
      <Tabs defaultValue="graphs" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <Card>
            <Tabs.List>
              <Tabs.Tab value="graphs" icon={<IconGraph size={14} />}>
                Graphs View
              </Tabs.Tab>
              <Tabs.Tab value="tabular" icon={<IconCash size={14} />}>
                Tabular View
              </Tabs.Tab>
              <Tabs.Tab value="aging">Aging Report</Tabs.Tab>
            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="graphs">
            <GraphsView />
          </Tabs.Panel>
          <Tabs.Panel value="tabular">
            {activeTab === "tabular" && <TableView />}
          </Tabs.Panel>
          <Tabs.Panel value="aging">
            {activeTab === "aging" && <AgingReportListView />}
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}

export default InvoicesReportView;
