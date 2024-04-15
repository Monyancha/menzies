import { Box } from "@mui/material";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Tabs, Card } from "@mantine/core";
import {
  IconDashboard,
  IconCash,
  IconCashBanknote,
  IconUsers,
  IconLocation,
  IconStepOut,
} from "@tabler/icons-react";
import StaffTabsPage from "../../components/merchants/hr/staffs/staff-tab";
import LeaveListView from "../../components/merchants/hr/leave/leave-list";
import PayrollListView from "../../components/merchants/hr/payroll/payroll-list";
import DepartmentListView from "../../components/merchants/hr/departments/departments-list";
import HrDashboardView from "../../components/merchants/hr/dashboard/dashboard";
import LeaveTabsPage from "../../components/merchants/hr/leave/leave-tab";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Human Resource",
  },
];


export default function HrPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Staff" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
      <div className="w-full flex flex-col lg:flex-row lg:flex-wrap">
        <div className="mb-3 mt-2 w-full bg-white">
          <Card>
            <Tabs value={activeTab} onTabChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="dashboard" icon={<IconDashboard size={14} />}>
                  Dashboard
                </Tabs.Tab>
                <Tabs.Tab value="staff" icon={<IconUsers size={14} />}>
                  STAFF
                </Tabs.Tab>
                <Tabs.Tab value="departments" icon={<IconLocation size={14} />}>
                  DEPARTMENTS
                </Tabs.Tab>
                <Tabs.Tab value="leave" icon={<IconStepOut size={14} />}>
                  LEAVE
                </Tabs.Tab>
                <Tabs.Tab value="payroll" icon={<IconCashBanknote size={14} />}>
                  PAYROLL
                </Tabs.Tab>
                
              </Tabs.List>
              <div className="w-full mt-1 z-100">
                <Tabs.Panel value="dashboard">
                  <HrDashboardView />
                </Tabs.Panel>
                <Tabs.Panel value="staff">
                  {activeTab === "staff" && <StaffTabsPage />}
                </Tabs.Panel>
                <Tabs.Panel value="departments">
                  {activeTab === "departments" && <DepartmentListView />}
                </Tabs.Panel>
                <Tabs.Panel value="leave">
                  {activeTab === "leave" && <LeaveTabsPage/>}
                </Tabs.Panel>
                <Tabs.Panel value="payroll">
                  {activeTab === "payroll" && <PayrollListView />}
                </Tabs.Panel>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
      </Box>
    </PageContainer>
  );
}
