import { Box } from "@mui/material";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import {
  TDateFilter,
  TSearchFilter,
  Table,
  Thead,
  Trow,
} from "../../components/ui/layouts/scrolling-table";
import { Badge, Button } from "@mantine/core";
import Card from "../../components/ui/layouts/card";
import TableCardHeader from "../../components/ui/layouts/table-card-header";
import { IconPlus } from "@tabler/icons-react";
import NewConsignmentModal from "../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../components/ui/layouts/pagination-links";
import { getConsignments } from "../../src/store/consignments/consignments-slice";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../src/store/Store";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../lib/shared/data-formatters";
import Link from "next/link";
import { useRouter } from "next/router";
import { getDashboard, getLists } from "../../src/store/cargo/cargo-slice";
import CheckoutVisitorModal from "../../components/visitors/checkout-visitor-modal";
import DashboardCard from "../../components/dashboard/dashboard-card";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Checked In Menzies Staff",
  },
];

export default function Visitors() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { status: queryStatus } = router.query;

  const [searchTerm, setSearchTerm] = useState("");

  const itemStatus = useSelector(
    (state) => state.cargo.getListsStatus
  );
  const items = useSelector((state) => state.cargo.getLists);

  const isLoading = itemStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getLists(params));
  }, [session, status, searchTerm]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getLists(params));
  }


  const visitors = items?.lists?.menziesVisitsIn;

  //Get Dashboard Stats
  const dashboard = useSelector((state) => state.cargo.getDashboard);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;
    store.dispatch(getDashboard(params));
  }, [session, status, searchTerm]);

  //End Dashboard Stats


  const actions = (
    <div className="flex flex-row items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Checked In Menzies Staff" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            {/* <NewConsignmentModal /> */}
            <Button variant="outline" leftIcon={<IconPlus size={18} />}>New Visitor</Button>
          </div>
        </header>

        <div className="w-full flex flex-wrap mt-2">
          <div className="flex w-full items-stretch flex-wrap mb-3">
          <DashboardCard title="Total Check In" value={dashboard?.menzies_visits_in ?? 0} color="blue" />
          <DashboardCard title="Total Staff" value={dashboard?.menziesvisitors ?? 0} color="orange" />
          <DashboardCard title="Total Visits" value={dashboard?.menzies_visits ?? 0} color="red" />
          <DashboardCard title="Total Check Out" value={dashboard?.menzies_visits_out ?? 0} color="purple" />
        </div>
        </div>

        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <TableCardHeader actions={actions}>

            </TableCardHeader>

            <Table>
              <Thead>
                {/* make sure the titles are aligned well */}
                <tr>
                  <th scope="col" className="th-primary">
                    FULL NAME
                  </th>
                  <th scope="col" className="th-primary">
                  TIME IN
                  </th>
                  <th scope="col" className="th-primary"> 
                    PASS NUMBER
                  </th>
                  <th scope="col" className="th-primary">
                    CAR NUMBER
                  </th>
                  <th scope="col" className="th-primary">
                    CHECKIN IN BY
                  </th> 
                  <th scope="col" className="th-primary text-right">
                    ACTION
                  </th>
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  visitors &&
                  // visitors?.data?.map((item) => ( //After pagination use this
                  visitors?.map((item) => (
                    <tr key={item?.id} className="border-b" >
                      <td>{item?.visitor?.first_name} {item?.visitor?.last_name}</td>
                      <td>{new Date(item?.created_at).toLocaleString()}</td>
                      <td>{item?.pass_number}</td>
                      <td>{item?.car_number || "N/A"}</td>
                      <td>{item?.checkin_by.first_name} {item?.checkin_by.last_name}</td>
                      
                      <td className="text-right"> 
                        
                           <CheckoutVisitorModal item={item} />
                        
                      </td>
                    </tr>
                   ))}
              </tbody>
            </Table>
            {isLoading && (
              <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                <StatelessLoadingSpinner />
              </div>
            )}

            <PaginationLinks
              paginatedData={visitors}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
