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
import { IconEye, IconPlus } from "@tabler/icons-react";
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

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "USD Summary",
  },
];

export default function UsdSummary() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

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

      <Box>

        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <TableCardHeader actions={actions}>
              <TDateFilter
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={setStartDate}
                onChangeEndDate={setEndDate}
              />
            </TableCardHeader>

            <Table>
              <Thead>
                <tr>
                  <th scope="col" className="th-primary">
                    CONSIGNMENT
                  </th>
                  <th scope="col" className="th-primary">
                    CLIENT
                  </th>
                  <th scope="col" className="th-primary">
                    AMOUNT
                  </th>
                  <th scope="col" className="th-primary text-right">
                    DATE
                  </th>

                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  items &&
                  items?.data?.map((item) => (
                    <tr className="border-b" key={item?.id}>
                      <td>{item?.code ?? "-"}</td>
                      <td>{item?.contact?.name ?? "-"}</td>

                      <td>$ {item?.total_cost ?? 0}</td>
                      <td className="text-right">
                        {formatDate(item?.created_at)}
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
  );
}
