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

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Departments",
  },
];

export default function Departments() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [projectStatus, setProjectStatus] = useState(null);

  const router = useRouter();
  const { status: queryStatus } = router.query;

  // Update project status when query status changes
  useEffect(() => {
    if (queryStatus) {
      setProjectStatus(queryStatus);
    }
  }, [queryStatus]);

  const [searchTerm, setSearchTerm] = useState("");

  const itemStatus = useSelector(
    (state) => state.consignments.getConsignmentsStatus
  );
  const items = useSelector((state) => state.consignments.getConsignments);

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

    if (!startDate && !endDate) {
      store.dispatch(getConsignments(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getConsignments(params));
  }, [session, status, startDate, endDate, searchTerm]);

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

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getConsignments(params));
  }


  const actions = (
    <div className="flex flex-row items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Departments" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            {/* <NewConsignmentModal /> */}
            <Button variant="outline" leftIcon={<IconPlus size={18} />}>New Department</Button>
          </div>
        </header>

        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <TableCardHeader actions={actions}>

            </TableCardHeader>

            <Table>
              <Thead>
                <tr>
                  <th scope="col" className="th-primary">
                    NO
                  </th>
                  <th scope="col" className="th-primary">
                  NAME
                  </th>
                  <th scope="col" className="th-primary text-right">
                    DATE
                  </th> 
                  <th scope="col" className="th-primary text-right">
                    ACTION
                  </th>
                </tr>
              </Thead>
              <tbody>
                {/* {!isLoading &&
                  items &&
                  items?.data?.map((item) => ( */}
                    <tr className="border-b" >
                      <td>6</td>
                      <td>Health Department</td>
                      <td className="text-right">
                        {/* {formatDate(item?.created_at)} */}
                        19-02-2024
                      </td>
                      
                      <td className="text-right"> 
                        
                          <Button size="xs" variant="outline">
                            Update
                          </Button>
                        
                      </td>
                    </tr>
                    <tr className="border-b" >
                      <td>5</td>
                      <td>Agriculture Department</td>
                      <td className="text-right">
                        {/* {formatDate(item?.created_at)} */}
                        19-02-2024
                      </td>
                      
                      <td className="text-right"> 
                       
                          <Button size="xs" variant="outline">
                            Update
                          </Button>
                    
                      </td>
                    </tr>
                    <tr className="border-b" >
                      <td>4</td>
                      <td>Sports Department</td>
                      <td className="text-right">
                        {/* {formatDate(item?.created_at)} */}
                        19-02-2024
                      </td>
                      
                      <td className="text-right"> 
                          <Button size="xs" variant="outline">
                            Update
                          </Button>
                      
                      </td>
                    </tr>
                    <tr className="border-b" >
                      <td>3</td>
                      <td>Finance Department</td>
                      <td className="text-right">
                        {/* {formatDate(item?.created_at)} */}
                        19-02-2024
                      </td>
                      
                      <td className="text-right"> 
                          <Button size="xs" variant="outline">
                            Update
                          </Button>
                      
                      </td>
                    </tr>
                    <tr className="border-b" >
                      <td>2</td>
                      <td>Education Department</td>
                      <td className="text-right">
                        {/* {formatDate(item?.created_at)} */}
                        19-02-2024
                      </td>
                      
                      <td className="text-right"> 
                          <Button size="xs" variant="outline">
                            Update
                          </Button>
                      
                      </td>
                    </tr>
                  {/* ))} */}
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
