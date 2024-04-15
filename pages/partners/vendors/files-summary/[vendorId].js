import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
import {
  TDateFilter,
  TSearchFilter,
  Table,
  Thead,
  Trow,
} from "../../../../components/ui/layouts/scrolling-table";
import { Badge, Button } from "@mantine/core";
import Card from "../../../../components/ui/layouts/card";
import TableCardHeader from "../../../../components/ui/layouts/table-card-header";
import { IconPlus, IconPrinter } from "@tabler/icons-react";
import NewConsignmentModal from "../../../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../../components/ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../../../src/store/Store";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import Link from "next/link";
import { fetchAllStaffIncome } from "../../../../src/store/partners/staff-slice";
import { IconEye } from "@tabler/icons-react";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/vendors",
    title: "Vendors",
  },
  {
    title: "Files Summary",
  },
];

export default function FileSummary() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const [searchTerm, setSearchTerm] = useState("");

  const itemStatus = useSelector(
    (state) => state.staff.allStaffIncomeListStatus
  );
  const items = useSelector((state) => state.staff.allStaffIncomeList);

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
      store.dispatch(fetchAllStaffIncome(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(fetchAllStaffIncome(params));
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

    store.dispatch(fetchAllStaffIncome(params));
  }

  const actions = (
    <div className="flex flex-row items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Files Summary" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <TableCardHeader actions={actions}>
             
            </TableCardHeader>

            <Table>
              <Thead>
                <tr>
                  <th scope="col" className="th-primary">
                    ID
                  </th>
                  <th scope="col" className="th-primary">
                    FILE NAME
                  </th>
                  <th scope="col" className="th-primary">
                    DESCRIPTION
                  </th>
                  <th scope="col" className="th-primary">
                    UPLOADED DATE
                  </th>
                  <th scope="col" className="th-primary text-right">
                    ACTIONS
                  </th>
                </tr>
              </Thead>
              <tbody>
                {/* {!isLoading &&
                  items &&
                  items?.data?.map((item) => ( */}
                    <tr className="border-b" key={1}>
                      <td>1002</td>
                      <td>Kra Pin</td>
                      <td>Kra Pin Document File</td>

                      <td >
                        2024-02-12 10:34
                      </td>
                      <td className="text-right">
                          <Button leftIcon={<IconEye size={18} />} mr="xs" size="xs" variant="outline">
                            View
                          </Button>
                          <Button size="xs" leftIcon={<IconPrinter size={18} />} variant="outline">
                            Download
                          </Button>
                      </td>
                    </tr>

                    <tr className="border-b" key={1}>
                      <td>976</td>
                      <td>Business License</td>
                      <td>Business License Document File</td>

                      <td >
                        2024-02-12 09:59
                      </td>
                      <td className="text-right">
                          <Button leftIcon={<IconEye size={18} />} mr="xs" size="xs" variant="outline">
                            View
                          </Button>
                          <Button size="xs" leftIcon={<IconPrinter size={18} />} variant="outline">
                            Download
                          </Button>
                      </td>
                    </tr>
          

                  {/* ))} */}
              </tbody>
            </Table>
            {/* {isLoading && (
              <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                <StatelessLoadingSpinner />
              </div>
            )}

            <PaginationLinks
              paginatedData={items}
              onLinkClicked={onPaginationLinkClicked}
            /> */}
          </Card>
        </div>
        </Box>
    </PageContainer>
  );
}
