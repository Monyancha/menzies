import { Card, Tabs } from "@mantine/core";
import {
  IconUser,
  IconCash,
  IconCashBanknote,
} from "@tabler/icons-react";
import { useState } from "react";
import CustomerInvoicesView from "./customers-invoices-view";
import CompanyBioView from "../../partners/clients/company-bio-view";
// import CompanyTransactionListView from "./company-transactions-list-view";
import CompanyStatementOfAccounts from "./company-statement-of-accounts";
import CardDark from "../../ui/layouts/card-dark";

function CustomerDetailView({ companyId }) {
  const [activeTab, setActiveTab] = useState("bio");

  return (
    <div className="w-full">
      <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <CardDark>
            <Tabs.List>
              <Tabs.Tab value="bio" icon={<IconUser size={14} />}>
                Account
              </Tabs.Tab>
              {/* <Tabs.Tab value="transactions" icon={<IconCash size={14} />}>
                Transactions
              </Tabs.Tab> */}
              <Tabs.Tab value="invoices" icon={<IconCash size={14} />}>
                Invoices
              </Tabs.Tab>
              <Tabs.Tab
                value="statement_of_accounts"
                icon={<IconCash size={14} />}
              >
                Statement of Accounts
              </Tabs.Tab>
            </Tabs.List>
          </CardDark>
        </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="bio">
            <CompanyBioView companyId={companyId} />
          </Tabs.Panel>
          {/* <Tabs.Panel value="transactions">
            {activeTab === "transactions" && (
              <CompanyTransactionListView companyId={companyId} />
            )}
          </Tabs.Panel> */}
          <Tabs.Panel value="invoices">
            {activeTab === "invoices" && (
              <CustomerInvoicesView companyId={companyId} />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="statement_of_accounts">
            {activeTab === "statement_of_accounts" && (
              <CompanyStatementOfAccounts companyId={companyId} />
            )}
          </Tabs.Panel>

        </div>
      </Tabs>
    </div>
  );
}

export default CustomerDetailView;
