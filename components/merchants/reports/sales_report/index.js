import { Card, Tabs } from "@mantine/core";
import { IconGraph, IconCash, IconCashBanknote } from "@tabler/icons-react";
import { useState } from "react";

import SalesReportData from "../sales/sales-report";

function SalesReportView() {
  const [activeTab, setActiveTab] = useState("trends");

  return (
    <div className="w-full">
      <Tabs defaultValue="trends" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <Card>
            <Tabs.List>
              {/* <Tabs.Tab value="graphs" icon={<IconGraph size={14} />}>
                Graphs View
              </Tabs.Tab> */}
              <Tabs.Tab value="trends" icon={<IconCash size={14} />}>
                Tabular View
              </Tabs.Tab>
              {/* <Tabs.Tab value="wholesale" icon={<IconCash size={14} />}>
                Wholesale Report
              </Tabs.Tab> */}
              {/* <Tabs.Tab value="rank" icon={<IconCash size={14} />}>
                Services Rank
              </Tabs.Tab> */}
            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
          {/* <Tabs.Panel value="graphs">
            <SalesReportGraphs />
          </Tabs.Panel> */}
          <Tabs.Panel value="trends">
            <SalesReportData />
          </Tabs.Panel>
          {/* <Tabs.Panel value="wholesale">
            <WholesaleReport />
          </Tabs.Panel> */}
          {/* <Tabs.Panel value="rank">
            <ServicesRank />
          </Tabs.Panel> */}
        </div>
      </Tabs>
    </div>
  );
}

export default SalesReportView;
