import { useState } from "react";
import { Tabs,Card} from "@mantine/core"
import { IconBooks,IconMoneybag, IconCalendarEvent,IconCalendarMinus,IconUser,IconList } from "@tabler/icons-react";
import PersonalDetailsForm from "./personal-details-form";
import FinancialDetailsForm from "./financial-details";
import DocumentsForm from "./documents";
import StaffsListView from "../../../partners/staffs/staffs-list-view";
import StaffAllowancePage from "./allowance-tab";
import Link from "next/link";
function StaffTabsPage()
{
    const [activeTab, setActiveTab] = useState("personal-info");


return (
    <div className="w-full flex flex-col lg:flex-row lg:flex-wrap">
       <div className="mb-3 mt-2 w-full bg-white">
       <Card>
            <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="personal-info" icon={<IconUser size={14} />}>
                Personal Info
              </Tabs.Tab>
              <Tabs.Tab value="financial" icon={<IconMoneybag size={14} />}>
                Financial Info
              </Tabs.Tab>
              <Tabs.Tab value="documents" icon={<IconBooks size={14} />}>
                Documents
              </Tabs.Tab>
              <Tabs.Tab value="allowances" icon={<IconBooks size={14} />}>
                Allowances
              </Tabs.Tab>
              <Tabs.Tab value="list" icon={<IconList size={14} />}>
               Staff List
              </Tabs.Tab>
              <Tabs.Tab value="list" icon={<IconCalendarEvent size={14} />}>
              <Link href={`/merchants/partners/staffs/attendance`}>
               Attendance
               </Link>
              </Tabs.Tab>
              <Tabs.Tab value="list" icon={<IconCalendarMinus size={14} />}>
              <Link href={`/merchants/partners/staffs/shifts`}>

               Shifts
               </Link>
              </Tabs.Tab>

            </Tabs.List>
            <div className="w-full mt-1 z-100">
          <Tabs.Panel value="personal-info">
            <PersonalDetailsForm/>
          </Tabs.Panel>
          <Tabs.Panel value="financial">

            {activeTab === "financial" &&
            <FinancialDetailsForm/>
            }
          </Tabs.Panel>
          <Tabs.Panel value="documents">
            {activeTab === "documents" &&
             <DocumentsForm/>}
          </Tabs.Panel>
          <Tabs.Panel value="allowances">

            {activeTab === "allowances" &&
            <StaffAllowancePage/>
            }
          </Tabs.Panel>
          <Tabs.Panel value="list">
            {activeTab === "list" &&
             <StaffsListView/>}
          </Tabs.Panel>

        </div>
      </Tabs>


        </Card>
       </div>

      </div>
)

}

export default StaffTabsPage;