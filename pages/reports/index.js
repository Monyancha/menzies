import { Box } from "@mui/material";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
//
import { useSession } from "next-auth/react";
import { Card, Tabs, ScrollArea } from "@mantine/core";
import {
  IconChartLine,
  IconChartAreaLine,
  IconChartArea,
  IconChartPie,
  IconPercentage,
  IconReport,
  IconCurrencyDollar
} from "@tabler/icons-react";
import { useState } from "react";
// import BalanceSheet from "./balancesheet";
import Taxes from "./taxes";
import ProfitLossView from "../../components/merchants/reports/profitloss/profitloss-view";
import InvoicesReportView from "../../components/merchants/reports/invoices/invoices-view";
import ExpensesView from "../../components/merchants/reports/expenses/expenses-view";
// import StaffReportListview from "@/components/merchants/partners/staffs/staff-report-list-view";
import SalesReportView from "../../components/merchants/reports/sales_report";
import ConsignmentsReport from "./consignments";
import UsdSummary from "./usd-summary";
import KesSummary from "./kes-summary";
// import TrialBalance from "./trialbalance";
//
const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Reports",
  },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("sales_report");

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Reports" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <div className="w-full flex flex-wrap mt-2">
        <div className="w-full">
          <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
            <ScrollArea scrollbarSize={5} scrollHideDelay={500}>
              <div style={{ width: 2000 }}>
                <div className="z-10">
                  <Card>
                    <Tabs.List>
                      {/* <Tabs.Tab
                        value="sales"
                        icon={<IconChartLine size={14} />}
                      >
                        Item Sales
                      </Tabs.Tab> */}

                      <Tabs.Tab icon={<IconChartLine size={14} />} value="sales_report">
                        <span>Sales Report</span>
                      </Tabs.Tab>
                      <Tabs.Tab icon={<IconReport size={14} />} value="consignments">
                        <span>Consignment Report</span>
                      </Tabs.Tab>
                      <Tabs.Tab icon={<IconCurrencyDollar size={14} />} value="usd">
                        <span>USD Summary</span>
                      </Tabs.Tab>
                      <Tabs.Tab icon={<IconCurrencyDollar size={14} />} value="kes">
                        <span>KES Summary</span>
                      </Tabs.Tab>

                      {/* <Tabs.Tab
                        value="balance_sheet"
                        icon={<IconReport size={14} />}
                      >
                        <span>Balance Sheet</span>
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="trial_balance"
                        icon={<IconReport size={14} />}
                      >
                        <span>Trial Balance</span>
                      </Tabs.Tab> */}

                      {/* <Tabs.Tab
                        value="staff"
                        icon={<IconUserCheck size={14} />}
                      >
                        <span aria-label="staff report">Staff</span>
                      </Tabs.Tab> */}

                      
                      <Tabs.Tab
                        value="invoice"
                        icon={<IconChartArea size={14} />}
                      >
                        <span>Invoices</span>
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="expense"
                        icon={<IconChartPie size={14} />}
                      >
                        <span>Expenses</span>
                      </Tabs.Tab>
                      <Tabs.Tab value="tax" icon={<IconPercentage size={14} />}>
                        <span>Taxes</span>
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="profit_loss"
                        icon={<IconChartAreaLine size={14} />}
                      >
                        <span>Profit & Loss</span>
                      </Tabs.Tab>

                    </Tabs.List>
                  </Card>
                </div>
              </div>
            </ScrollArea>

            <div className="w-full mt-1 z-100">
              {/* <Tabs.Panel value="sales">
                {activeTab === "sales" && <SalesListView />}
              </Tabs.Panel> */}
              <Tabs.Panel value="sales_report">
                {activeTab === "sales_report" && <SalesReportView />}
              </Tabs.Panel>

              {/* <Tabs.Panel value="staff">
                {activeTab === "staff" && <StaffReportListview />}
              </Tabs.Panel> */}

              <Tabs.Panel value="consignments">
                {activeTab === "consignments" && <ConsignmentsReport />}
              </Tabs.Panel>
              {/*  */}
              <Tabs.Panel value="usd">
                {activeTab === "usd" && <UsdSummary />}
              </Tabs.Panel>
              <Tabs.Panel value="kes">
                {activeTab === "kes" && <KesSummary />}
              </Tabs.Panel>
              <Tabs.Panel value="invoice">
                {activeTab === "invoice" && <InvoicesReportView />}
              </Tabs.Panel>
              <Tabs.Panel value="expense">
                {activeTab === "expense" && <ExpensesView />}
              </Tabs.Panel>
              {/* <Tabs.Panel value="balance_sheet">
                {activeTab === "balance_sheet" && <BalanceSheet />}
              </Tabs.Panel>
              <Tabs.Panel value="trial_balance">
                {activeTab === "trial_balance" && <TrialBalance />}
              </Tabs.Panel> */}

              <Tabs.Panel value="tax">
                {activeTab === "tax" && <Taxes />}
              </Tabs.Panel>
              <Tabs.Panel value="profit_loss">
                {activeTab === "profit_loss" && <ProfitLossView />}
              </Tabs.Panel>

            </div>
          </Tabs>
        </div>
      </div>



      </Box>
    </PageContainer>
  );
}
