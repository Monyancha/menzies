import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import {
  TDateFilter,
  TSearchFilter,
  Table,
  Thead,
  Trow,
} from "../../../components/ui/layouts/scrolling-table";
import { Badge, Button } from "@mantine/core";
import Card from "../../../components/ui/layouts/card";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import { IconPlus } from "@tabler/icons-react";
import NewConsignmentModal from "../../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../../src/store/Store";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../lib/shared/data-formatters";
import Link from "next/link";
import { fetchAllStaffIncome } from "../../../src/store/partners/staff-slice";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Staff",
  },
];

export default function Staff() {
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
      <Breadcrumb title="Staff" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <Link href="/partners/staff/create">
            <Button size="sm" variant="outline">New Staff</Button>
          </Link>
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
                    NAME
                  </th>
                  <th scope="col" className="th-primary">
                    EMAIL
                  </th>
                  <th scope="col" className="th-primary">
                    DURATION
                  </th>
                  <th scope="col" className="th-primary">
                    DATE
                  </th>
                  <th scope="col" className="th-primary text-right">
                    ACTION
                  </th>
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  items &&
                  items?.data?.map((item) => (
                    <tr className="border-b" key={item?.id}>
                      <td>{item?.name ?? "-"}</td>
                      <td>{item?.email ?? "-"}</td>
                      <td>{item?.no_of_days ?? "-"}</td>

                      <td >
                        {formatDate(item?.created_at)}
                      </td>
                      <td className="text-right">
                          <Button size="xs" variant="outline">
                            Actions
                          </Button>
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
              paginatedData={items}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
