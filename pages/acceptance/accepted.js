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
import { getAccepted, getDashboard } from "../../src/store/cargo/cargo-slice";
import DashboardCard from "../../components/dashboard/dashboard-card";
// import AddStaffModal from "../../components/users/add-staff-modal";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Accepted Cargo",
  },
];

export default function Accepted() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { status: queryStatus } = router.query;

  const [searchTerm, setSearchTerm] = useState("");

  const itemStatus = useSelector(
    (state) => state.cargo.getAcceptedStatus
  );
  const items = useSelector((state) => state.cargo.getAccepted);

  console.log("bavo", items)

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

    console.log("am here");

    store.dispatch(getAccepted(params));
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

    store.dispatch(getAccepted(params));
  }

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
      <Breadcrumb title="Accepted Cargo" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            {/*<AddStaffModal />*/}
          </div>
        </header>

        <div className="w-full flex flex-wrap mt-2">
          <div className="flex w-full items-stretch flex-wrap mb-3">
          <DashboardCard title="Awaiting Acceptance" value={dashboard?.awaiting ?? 0} color="green" />
          <DashboardCard title="Total Cargo" value={dashboard?.cargo ?? 0} color="orange" />
          <DashboardCard title="Total Check In" value={dashboard?.visits_in ?? 0} color="purple" />
          <DashboardCard title="Total Visits" value={dashboard?.visits ?? 0} color="red" />
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
                    CARGO TYPE
                  </th>
                  <th scope="col" className="th-primary">
                  SHIPPER NAME
                  </th>
                  <th scope="col" className="th-primary"> 
                    ACCEPTED BY
                  </th>
                  <th scope="col" className="th-primary"> 
                    ACCEPTED ON
                  </th>
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  items &&
                  // items?.data?.map((item) => ( //After pagination use this
                  items?.data?.map((item) => (
                    <tr key={item?.id} className="border-b" >
                      <td>
                        {item?.type_id === 0 && "Known"}
                        {item?.type_id === 1 && "Unknown"}
                        {item?.type_id === 2 && "General"}
                      </td>
                      <td>{item?.shipper_name}</td>
                      <td>{item?.created_by.first_name} {item?.created_by.last_name}</td>
                       <td>{new Date(item?.created_at).toLocaleString()}</td>
                      
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
              paginatedData={items}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
