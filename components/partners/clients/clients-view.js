import { Card, Tabs } from "@mantine/core";
import { IconUser, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import ClientsListView from "./clients-list-view";
import CompaniesListView from "./companies-list-view";

function ClientsView() {
  const [activeTab, setActiveTab] = useState("individuals");

  return (
    <div className="w-full">
      <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <Card>
            <Tabs.List>
              <Tabs.Tab value="individuals" icon={<IconUser size={14} />}>
                Individuals
              </Tabs.Tab>
              <Tabs.Tab value="companies" icon={<IconUsers size={14} />}>
                Companies
              </Tabs.Tab>
            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="individuals">
            {activeTab === "individuals" && <ClientsListView />}
          </Tabs.Panel>
          <Tabs.Panel value="companies">
            {activeTab === "companies" && <CompaniesListView />}
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}

export default ClientsView;
