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
import LogoutCargoModal from "../../components/screening/logout-cargo-modal";
import DashboardCard from "../../components/dashboard/dashboard-card";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Screened Cargo",
  },
];

export default function Screened() {
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


  const screened = items?.lists?.screened;

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
      <Breadcrumb title="Screened Cargo" items={BCrumb} />
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
          <DashboardCard title="Awaiting Screening" value={dashboard?.awaiting ?? 0} color="blue" />
          <DashboardCard title="Total Screened" value={dashboard?.screened ?? 0} color="purple" />
          <DashboardCard title="Awaiting Screening" value={dashboard?.pending_screens ?? 0} color="brown" />
          <DashboardCard title="Total Logged Out" value={dashboard?.logged_out ?? 0} color="green" />
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
                    AWB NO.
                  </th>
                  <th scope="col" className="th-primary">
                  NATURE OF GOODS
                  </th>
                  <th scope="col" className="th-primary"> 
                    NO. OF PIECES
                  </th>
                  <th scope="col" className="th-primary">
                    SCREENED BY
                  </th>
                  <th scope="col" className="th-primary">
                    SCREENED AT
                  </th> 
                  <th scope="col" className="th-primary text-right">
                    ACTION
                  </th>
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  screened &&
                  screened.map((item) => (
                    <tr key={item?.id} className="border-b">
                      <td>{item?.awb}</td>
                      <td>{item?.nature_of_goods}</td>
                      <td>{item?.no_of_pieces}</td>
                      <td>{item?.created_by.first_name} {item?.created_by.last_name}</td>                      
                      <td>{new Date(item?.updated_at).toLocaleString()}</td>

                      <td className="text-right">
                           <LogoutCargoModal item={item} />

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
              paginatedData={screened}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
