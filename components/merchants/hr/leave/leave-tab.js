import { useState } from "react";
import { Tabs, Card } from "@mantine/core"
import { IconBooks, IconMoneybag, IconCalendarEvent, IconCalendarMinus, IconUser, IconList } from "@tabler/icons-react";
import LeaveListView from "./leave-list";
import Link from "next/link";
import LeaveRequestList from "./leave-requests";
function LeaveTabsPage() {
  const [activeTab, setActiveTab] = useState("leave-types");


  return (
    <div className="w-full flex flex-col lg:flex-row lg:flex-wrap">
      <div className="mb-3 mt-2 w-full bg-white">
        <Card>
          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="leave-types" icon={<IconUser size={14} />}>
                Leave Types
              </Tabs.Tab>
              <Tabs.Tab value="leave-requests" icon={<IconMoneybag size={14} />}>
                Leave Requests
              </Tabs.Tab>

            </Tabs.List>
            <div className="w-full mt-1 z-100">
              <Tabs.Panel value="leave-types">
                {activeTab === "leave-types" &&
                  <LeaveListView />
                }
              </Tabs.Panel>
              <Tabs.Panel value="leave-requests">

                {activeTab === "leave-requests" &&
               <LeaveRequestList/>
            }
              </Tabs.Panel>


            </div>
          </Tabs>


        </Card>
      </div>

    </div>
  )

}

export default LeaveTabsPage;