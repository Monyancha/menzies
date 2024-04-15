import { useState } from "react";
import { Tabs,Card} from "@mantine/core"
import { IconBooks,IconMoneybag, IconCashBanknote,IconUser,IconList } from "@tabler/icons-react";
import AllowanceDetailsForm from "./allowances-details";
import AllowanceListTab from "./allowance-list";
function StaffAllowancePage()
{
    const [activeTab, setActiveTab] = useState("new-allowance");

return (
    <div className="w-full flex flex-col lg:flex-row lg:flex-wrap">
       <div className="mb-3 mt-2 w-full bg-white">
       <Card>
            <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="new-allowance" icon={<IconUser size={14} />}>
                New Allowance
              </Tabs.Tab>
              <Tabs.Tab value="allowance-list" icon={<IconList size={14} />}>
                Allowance List
              </Tabs.Tab>


            </Tabs.List>
            <div className="w-full mt-1 z-100">
          <Tabs.Panel value="new-allowance">
            <AllowanceDetailsForm/>
          </Tabs.Panel>
          <Tabs.Panel value="allowance-list">
            <AllowanceListTab/>
          </Tabs.Panel>


        </div>
      </Tabs>


        </Card>
       </div>

      </div>
)

}

export default StaffAllowancePage;