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
import { IconPlus, IconTrash, IconEye, IconEdit, IconLogin, IconCheckupList } from "@tabler/icons-react";
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
import EditVisitorModal from "../../components/visitors/edit-visitor-modal";
import MoreVisitorModal from "../../components/visitors/more-visitor-modal";
import DashboardCard from "../../components/dashboard/dashboard-card";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Visitors",
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


  const visitors = items?.lists?.visitors;

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
      <Breadcrumb title="Visitors" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            {/* <NewConsignmentModal /> */}
            <Link href="/visitors/new" >
            <Button variant="outline" color="orange" leftIcon={<IconPlus size={18} />}>New Visitor</Button>
            </Link>
          </div>
        </header>

        <div className="w-full flex flex-wrap mt-2">
          <div className="flex w-full items-stretch flex-wrap mb-3">
          <DashboardCard title="Total Visitors" value={dashboard?.visitors ?? 0} color="orange" />
          <DashboardCard title="Total Visits" value={dashboard?.visits ?? 0} color="purple" />
          <DashboardCard title="Total Check In" value={dashboard?.visits_in ?? 0} color="green" />
          <DashboardCard title="Total Check Out" value={dashboard?.visits_out ?? 0} color="red" />
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
                    NO
                  </th>
                  <th scope="col" className="th-primary">
                  FULL NAME
                  </th>
                  <th scope="col" className="th-primary"> 
                    PHONE NUMBER
                  </th>
                  <th scope="col" className="th-primary">
                    ID NUMBER
                  </th> 
                  <th scope="col" className="th-primary text-right">
                    ACTION
                  </th>
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  visitors &&
                  visitors?.data?.map((item) => ( //After pagination use this
                  // visitors?.map((item) => (
                    <tr key={item?.id} className="border-b" >
                      <td>{item?.id}</td>
                      <td>{item?.first_name} {item?.last_name}</td>
                      <td>{item?.phone_number}</td>
                      <td>{item?.id_no}</td>
                      
                      <td className="py-0 pl-14 2xl:pl-4">
                        <span className="flex justify-end items-center w-full gap-2">
                          <Link
                            href={`/visitors/checkin?visitor_id=${item?.id}`}
                          >
                            <Button
                              variant="outline"
                              leftIcon={<IconCheckupList size={16} />}
                              size="xs"
                              color="grape"
                            >
                              Checkin
                            </Button>
                          </Link>
                          
                          {/*<EditVisitorModal item={item} />*/}

                          {/*<Link
                            href={`/visitors/more?visitor_id=${item?.id}`}
                          >
                            <Button
                              variant="outline"
                              leftIcon={<IconCheckupList size={16} />}
                              size="xs"
                              color="red"
                            >
                              More
                            </Button>
                          </Link>*/}

                          <MoreVisitorModal item={item} />

                        </span>
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
