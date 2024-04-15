import { Card, Tabs } from "@mantine/core";
import { IconUser, IconCash, IconCashBanknote } from "@tabler/icons";
import { useState } from "react";
import StaffBioView from "./staff-bio-view";
import StaffIncomeListView from "./staff-income-list-view";
import StaffTargetsIncomeListView from "./staff-targets-income-list-view";
import StaffTransactionListView from "./staff-transactions-list-view";
import StaffFinancialView from "./staff-financial-view";
import StaffDocumentView from "./staff-document-view";
function StaffDetailView() {
  const [activeTab, setActiveTab] = useState("bio");

  return (
    <div className="w-full">
      <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <Card>
            <Tabs.List>
              <Tabs.Tab value="bio" icon={<IconUser size={14} />}>
                Info
              </Tabs.Tab>
              <Tabs.Tab value="transactions" icon={<IconCash size={14} />}>
                Transactions
              </Tabs.Tab>
              <Tabs.Tab value="income" icon={<IconCashBanknote size={14} />}>
                Income
              </Tabs.Tab>
              <Tabs.Tab value="targets">Targets Income</Tabs.Tab>
              <Tabs.Tab value="financial">Financial Details</Tabs.Tab>
              <Tabs.Tab value="document">Documents</Tabs.Tab>
            </Tabs.List>
          </Card>
      </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="bio">
            <StaffBioView />
          </Tabs.Panel>
          <Tabs.Panel value="transactions">
            {activeTab === "transactions" && <StaffTransactionListView />}
          </Tabs.Panel>
          <Tabs.Panel value="income">
            {activeTab === "income" && <StaffIncomeListView />}
          </Tabs.Panel>
          <Tabs.Panel value="targets">
            {activeTab === "targets" && <StaffTargetsIncomeListView />}
          </Tabs.Panel>
          <Tabs.Panel value="financial">
            {activeTab === "financial" && <StaffFinancialView/>}
          </Tabs.Panel>
          <Tabs.Panel value="document">
            {activeTab === "document" && <StaffDocumentView/>}
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}

export default StaffDetailView;
