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
import ScreenCargoModal from "../../components/screening/screen-cargo-modal";
import DashboardCard from "../../components/dashboard/dashboard-card";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Awaiting Screening",
  },
];

export default function Screening() {
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


  const screening = items?.lists?.pendingScreens;


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
      <Breadcrumb title="Awaiting Screening" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            {/* <NewConsignmentModal /> */}
            {/*<Button variant="outline" leftIcon={<IconPlus size={18} />}>New Visitor</Button>*/}
          </div>
        </header>

        <div className="w-full flex flex-wrap mt-2">
          <div className="flex w-full items-stretch flex-wrap mb-3">
          <DashboardCard title="Awaiting Screening" value={dashboard?.pending_screens ?? 0} color="purple" />
          <DashboardCard title="Total Screened" value={dashboard?.screened ?? 0} color="green" />
          <DashboardCard title="Total Logged Out" value={dashboard?.logged_out ?? 0} color="blue" />
          <DashboardCard title="Total Cargo" value={dashboard?.cargo ?? 0} color="brown" />
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
                    TIME IN
                  </th> 
                  <th scope="col" className="th-primary text-right">
                    ACTION
                  </th>
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  screening &&
                  screening.map((item) => (
                    <tr key={item?.id} className="border-b">
                      <td>
                        {item?.cargo.type_id === 1 && "Unknown"}
                        {item?.cargo.type_id === 0 && "Known"}
                        {item?.cargo.type_id === 2 && "General"}
                      </td>
                      <td>{item?.cargo.shipper_name}</td>
                      <td>{item?.created_by.first_name} {item?.created_by.last_name}</td>
                      <td>{new Date(item?.created_at).toLocaleString()}</td>

                      <td className="text-right">
                           <ScreenCargoModal item={item} />
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
              paginatedData={screening}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
