import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
  getTimeAgo,
} from "../../../../lib/shared/data-formatters";
import { fetchUnits } from "@/store/merchants/inventory/units-slice";
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
import EditUnitModal from "./edit-unit-modal";
import RemoveUnitModal from "./remove-unit-modal";
function UnitsListView() {
  const { data: session, status } = useSession();
  // TODO:: Check if user is merchant or normal user

  const [searchTerm, setSearchTerm] = useState("");

  const unitListStatus = useSelector(
    (state) => state.branches.fetchUnitsStatus
  );

  const unitList = useSelector((state) => state.units.unitList);

  const isLoadingList = unitListStatus === "loading";

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

    store.dispatch(fetchUnits(params));
  }, [searchTerm, session, status]);

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["page"] = page;

    store.dispatch(fetchUnits(params));
  }

  // function refreshList() {
  //   if (!session || status !== "authenticated") {
  //     return;
  //   }

  //   const params = {};
  //   params["accessToken"] = session?.user?.accessToken;

  //   store.dispatch(fetchUnits(params));
  // }

  const actions = (
    <Fragment>
      <ActionIconButton
        icon="fa-solid fa-arrows-rotate"
        tooltip="Refresh"
        // clickHandler={refreshList}
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
              {/* <th scope="col" className="th-primary">
                Description
              </th> */}
              {/* <th scope="col" className="th-primary">
                Unit Family
              </th> */}
              <th scope="col" className="th-primary">
                ADDED ON
              </th>
              <th scope="col" className="th-primary">
                ACTION
              </th>
            </tr>
          </Thead>
          <tbody>
            {unitList &&
              unitList?.data?.map((item) => (
                <Trow key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  {/* <td>{item.descrption ?? "-"}</td> */}
                  
                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>

                  <td className="py-0 pl-4 2xl:pl-4">
                    
                  <span className="flex justify-end items-center w-full gap-2">

                        <EditUnitModal item={item} />
                        <RemoveUnitModal unit={item} />
                        </span>
                       
                      
                    
                  </td>
                  {/* <td></td> */}
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
          paginatedData={unitList}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </section>
  );
}

export default UnitsListView;
