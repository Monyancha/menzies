import { Card, Tabs } from "@mantine/core";
import {
  IconUser,
  IconCash,
  IconCashBanknote,
  IconDeviceLaptop,
  IconMessage,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { useState } from "react";
import ClientBioView from "./client-bio-view";
// import ClientTransactionListView from "./client-transactions-list-view";
import ClientDashboardView from "./client-dashboard-view";
import ClientStatementOfAccounts from "./client-statement-of-accounts";

function ClientDetailView({ clientId }) {
  const [activeTab, setActiveTab] = useState("bio");

  return (
    <div className="w-full">
      <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <Card>
            <Tabs.List>
              <Tabs.Tab value="dashboard" icon={<IconDeviceLaptop size={14} />}>
                Dashboard
              </Tabs.Tab>
              <Tabs.Tab value="bio" icon={<IconUser size={14} />}>
                Bio
              </Tabs.Tab>
              {/* <Tabs.Tab value="transactions" icon={<IconCash size={14} />}>
                Transactions
              </Tabs.Tab> */}
              <Tabs.Tab value="statement_of_accounts">
                Statement of Accounts
              </Tabs.Tab>
            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="dashboard">
            <ClientDashboardView clientId={clientId} />
          </Tabs.Panel>
          <Tabs.Panel value="bio">
            <ClientBioView clientId={clientId} />
          </Tabs.Panel>
          {/* <Tabs.Panel value="transactions">
            {activeTab === "transactions" && (
              <ClientTransactionListView clientId={clientId} />
            )}
          </Tabs.Panel> */}
          <Tabs.Panel value="statement_of_accounts">
            {activeTab === "statement_of_accounts" && (
              <ClientStatementOfAccounts clientId={clientId} />
            )}
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}

export default ClientDetailView;
