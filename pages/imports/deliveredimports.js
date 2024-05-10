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
import { getLists } from "../../src/store/cargo/cargo-slice";
import NewImportModal from "../../components/imports/new-import-modal";
import DeliverImportModal from "../../components/imports/deliver-import-modal";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Delivered Imports",
  },
];

export default function ReceivedImports() {
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


  const received = items?.lists?.deliveredImports;

  const actions = (
    <div className="flex flex-row items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Delivered Imports" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            {/*<Button variant="outline" leftIcon={<IconPlus size={18} />}>New Visitor</Button>*/}
          </div>
        </header>

        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <TableCardHeader actions={actions}>

            </TableCardHeader>

            <Table>
              <Thead>
                {/* make sure the titles are aligned well */}
                <tr>
                  <th scope="col" className="th-primary">
                    AGENT NAME
                  </th>
                  <th scope="col" className="th-primary"> 
                    NO. OF PIECES
                  </th>
                  <th scope="col" className="th-primary">
                    WEIGHT
                  </th>
                  <th scope="col" className="th-primary">
                    DELIVERED BY
                  </th>
                  <th scope="col" className="th-primary">
                    DELIVERED ON
                  </th>
   
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  received &&
                  received.map((item) => (
                    <tr key={item?.id} className="border-b">
                      <td>{item?.agent?.first_name} {item?.agent?.last_name}</td>
                      <td>{item?.no_of_pieces}</td>
                      <td>{item?.weight}</td>
                      <td>{item?.created_by?.first_name} {item?.created_by?.last_name}</td>                      
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
              paginatedData={received}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
