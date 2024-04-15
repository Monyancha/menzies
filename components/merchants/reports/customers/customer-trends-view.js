import { Card, Tabs } from "@mantine/core";
import { IconGraph, IconCash, IconCashBanknote } from "@tabler/icons";
import { useState } from "react";
import CustomerTrendGraphs from "./customer-graphs";
import CustomerTrendsList from "./customer-trends";

function CustomerTrendsView() {
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
              <Tabs.Tab value="trends" icon={<IconCash size={14} />}>
                Tabular View
              </Tabs.Tab>
            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="graphs">
            <CustomerTrendGraphs />
          </Tabs.Panel>
          <Tabs.Panel value="trends">
            {activeTab === "trends" && <CustomerTrendsList />}
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}

export default CustomerTrendsView;
