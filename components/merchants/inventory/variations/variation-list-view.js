import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
  getTimeAgo,
} from "../../../../lib/shared/data-formatters";
import { fetchVariationList } from "../../../../store/merchants/inventory/variation-slice";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import LinkButton from "../../../ui/actions/link-button";
import { Stat, StatsContainer } from "../../../ui/display/stats";
import Card from "../../../ui/layouts/card";
import { TextInput, Menu, Button, Text } from "@mantine/core";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import { IconChevronDown, IconUsers, IconLockAccess } from "@tabler/icons";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import store from "../../../../store/store";
import Link from "next/link";
import EditVariationModal from "./edit-variation-modal";
import DeleteVariationModal from "./delete-variation-modal";

function VariationListView() {
  const { data: session, status } = useSession();
  // TODO:: Check if user is merchant or normal user

  const [searchTerm, setSearchTerm] = useState("");

  const variationListStatus = useSelector(
    (state) => state.variation.variationListStatus
  );
  const variationList = useSelector((state) => state.variation.variationList);
  const variationData = useSelector((state) => state.variation.variationData);
  const isLoadingList = variationListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    // params["detailed"] = true;
    // params["branch_id"] = session.user.branch;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchVariationList(params));
  }, [searchTerm, session, status]);

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(fetchVariationList(params));
  }

  function refreshList() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(fetchVariationList(params));
  }

  const actions = (
    <Fragment>
      <ActionIconButton
        icon="fa-solid fa-arrows-rotate"
        tooltip="Refresh"
        clickHandler={refreshList}
      />
    </Fragment>
  );

  return (
    <section className="space-y-2 w-full">
      <div className="flex w-full justify-center">
        <TextInput
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Card>
        <TableCardHeader actions={actions}></TableCardHeader>
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID
              </th>
              <th scope="col" className="th-primary">
                NAME
              </th>
              <th scope="col" className="th-primary">
                Variations
              </th>
              <th scope="col" className="th-primary">
                Created At
              </th>
              <th>Action</th>
            </tr>
          </Thead>
          <tbody>
            {variationData &&
              variationData.data.map((item) => (
                <Trow key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    {item.variation_values.map((val) => (
                      <span className="space-x-0.5" key={val.id}>
                        {val.name},
                      </span>
                    ))}
                  </td>
                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>
                  <td>
                    <EditVariationModal item={item} />
                    <DeleteVariationModal variation={item} />
                  </td>
                </Trow>
              ))}
          </tbody>
        </Table>

        {isLoadingList && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={variationData}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </section>
  );
}

export default VariationListView;
