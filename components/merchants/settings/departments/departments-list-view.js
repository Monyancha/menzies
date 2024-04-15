import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
  getTimeAgo,
} from "../../../../lib/shared/data-formatters";
import { fetchDepartments } from "../../../../store/merchants/settings/branches-slice";
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
// import EditBranch from "./edit-branch-modal";
// import RemoveBranch from "./remove-branch-modal";
import Link from "next/link";

function DepartmentsListView() {
  const { data: session, status } = useSession();
  // TODO:: Check if user is merchant or normal user

  const [searchTerm, setSearchTerm] = useState("");

  const departmentListStatus = useSelector(
    (state) => state.branches.fetchDepartmentsStatus
  );
  
  const departments_list = useSelector((state) => state.branches.departments_list);

  const isLoadingList = departmentListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    // params["detailed"] = true;
    // params["branch_id"] = session.user.branch;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchDepartments(params));
  }, [searchTerm, session, status]);

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["page"] = page;

    store.dispatch(fetchDepartments(params));
  }

  function refreshList() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;

    store.dispatch(fetchDepartments(params));
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
                NAME
              </th>

              <th scope="col" className="th-primary">
                ADDED ON
              </th>
              {/* <th scope="col" className="th-primary">
                ACTION
              </th> */}
            </tr>
          </Thead>
          <tbody>
            {departments_list &&
              departments_list?.data?.map((item) => (
                <Trow key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>


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
          paginatedData={departments_list}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </section>
  );
}

export default DepartmentsListView;
