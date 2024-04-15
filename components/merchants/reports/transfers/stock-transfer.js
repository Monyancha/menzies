import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import Card from "../../../ui/layouts/card";
import {
  Table,
  Thead,
  TSearchFilter,
  TDateFilter,
} from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import { getAdjustments } from "@/store/merchants/inventory/inventory-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { TextInput } from "@mantine/core";

function StockTransfer() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const adjustmentStatus = useSelector(
    (state) => state.inventory.getAdjustmentStatus
  );

  const adjustments = useSelector((state) => state.inventory.getAdjustments);

  const branch_id = useSelector((state) => state.branches.branch_id);

  let branchesList = useSelector((state) => state.branches.branchesList);

  const isLoading = adjustmentStatus === "loading";

  let adjustmentsList = adjustments?.data?.filter((value) => {
    return value.from_branch !== null;
  });

  let total_quantity = adjustmentsList?.reduce(
    (total, item) => total + item?.quantity,
    0
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getAdjustments(params));
  }, [branch_id, session, status, searchTerm,startDate,endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getAdjustments(params));
  }

  const actions = (
    <div className="flex items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
  );

  return (
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
              PRODUCT NAME
            </th>

            <th scope="col" className="th-primary">
              TRANSFERED BY
            </th>

            <th scope="col" className="th-primary">
              QUANTITY
            </th>
            <th scope="col" className="th-primary">
              FROM BRANCH
            </th>
            <th scope="col" className="th-primary">
              TO BRANCH
            </th>
            <th scope="col" className="th-primary">
              DATE
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            adjustmentsList &&
            adjustmentsList?.map((item) => (
              <tr className="border-b" key={item.id}>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.product_inventory?.name ?? "-"}
                </td>

                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item.changed_by?.name}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.quantity}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.from_branch?.length != 0
                    ? branchesList?.find(
                        (value) => value?.id === item?.from_branch
                      )?.name ?? "-"
                    : "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.to_branch?.length != 0
                    ? branchesList?.find(
                        (value) => value?.id === item?.to_branch
                      )?.name ?? "-"
                    : "-"}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {formatDate(item.created_at)}
                </td>
              </tr>
            ))}
          {!isLoading && adjustments?.data && (
            <>
              <tr className="bg-white border-b text-lg">
                <th scope="row" colSpan="2" className="text-primary font-bold">
                  TOTAL QUANTITY
                </th>
                <td className="text-dark tracking-wider text-xl font-bold">
                  {total_quantity}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={adjustmentsList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default StockTransfer;
