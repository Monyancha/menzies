import { Card, Tabs } from "@mantine/core";
import { IconUser,IconInfoCircle, IconCashBanknote,IconServicemark,IconBrandProducthunt,IconCalendarEvent } from "@tabler/icons";
import { useState } from "react";
import MembershipServiceView from "./membership-service-view";
import MembershipClientView from "./membership-client-view";
import MembershipTransactionView from "./membership_transactions";
import MembershipPurchaseView from "./membership_purchases";
import MembershipAttendanceView from "./membership-attendances";
import { useSelector } from "react-redux";



function MembershipDetailView() {
  const [activeTab, setActiveTab] = useState("purchased");
  const membership = useSelector(
    (state) => state.membership.existingMembership
  );


  return (
    <div className="w-full">
      <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <Card>
            <Tabs.List>

            <Tabs.Tab value="purchased" icon={<IconCalendarEvent size={14} />}>
               Memberships Sales
              </Tabs.Tab>
              <Tabs.Tab value="info" icon={<IconInfoCircle size={14} />}>
              Info
              </Tabs.Tab>
              {membership?.membership_type==="Discount" && (
              <Tabs.Tab value="services" icon={<IconServicemark size={14} />}>
                Services
              </Tabs.Tab>
              )}
               {membership?.membership_type==="Discount" && (
              <Tabs.Tab value="products" icon={<IconBrandProducthunt size={14} />}>
                Products
              </Tabs.Tab>
               )}
                {membership?.membership_type==="Discount" && (
              <Tabs.Tab value="transactions" icon={<IconCashBanknote size={14} />}>
               Transactions
              </Tabs.Tab>
                )}
                {membership?.membership_type==="Access" && (
              <Tabs.Tab value="attendance" icon={<IconCashBanknote size={14} />}>
               Attendance
              </Tabs.Tab>
                )}


            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
        <Tabs.Panel value="purchased">
            {activeTab === "purchased" && <MembershipPurchaseView/>}
          </Tabs.Panel>
        <Tabs.Panel value="info">
            {activeTab === "info" && <MembershipClientView />}
          </Tabs.Panel>
          <Tabs.Panel value="services">
              {activeTab === "services" && <MembershipServiceView/>}
          </Tabs.Panel>
          <Tabs.Panel value="products">
            {activeTab === "products" && <MembershipServiceView />}
          </Tabs.Panel>

          <Tabs.Panel value="transactions">
            {activeTab === "transactions" && <MembershipTransactionView/>}
          </Tabs.Panel>



          <Tabs.Panel value="attendance">
            {activeTab === "attendance" && <MembershipAttendanceView/>}
          </Tabs.Panel>


        </div>
      </Tabs>
    </div>
  );
}

export default MembershipDetailView;
