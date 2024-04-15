import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
  getTimeAgo,
} from "../../../../lib/shared/data-formatters";
import {
  fetchCurrentPosSession,
  fetchPosSessionList,
} from "../../../../store/merchants/transactions/pos-sessions-slice";
import store from "../../../../store/store";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import LinkButton from "../../../ui/actions/link-button";
import { Stat, StatsContainer } from "../../../ui/display/stats";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";

function SessionsListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  // TODO:: Check if user is merchant or normal user
  const branch_id = useSelector((state) => state.branches.branch_id);
  const rawData = useSelector((state) => state.posSessions.posSessionsList);
  const posSessionsListStatus = useSelector(
    (state) => state.posSessions.posSessionsListStatus
  );
  const isLoadingList = posSessionsListStatus === "loading";

  const currentPosSessionStatus = useSelector(
    (state) => state.posSessions.currentPosSessionStatus
  );
  const currentPosSession = useSelector(
    (state) => state.posSessions.currentPosSession
  );
  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["detailed"] = true;
    params["branch_id"] = branch_id;

    store.dispatch(fetchPosSessionList(params));
  }, [branch_id, accessToken, status]);

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;

    store.dispatch(fetchPosSessionList(params));
  }

  function refreshList() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    store.dispatch(fetchPosSessionList(params));

    store.dispatch(fetchCurrentPosSession(params));
  }

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    if (posSessionsListStatus === "idle") {
      store.dispatch(fetchPosSessionList(params));
    }

    if (currentPosSessionStatus === "idle") {
      store.dispatch(fetchCurrentPosSession(params));
    }
  }, [
    branch_id,
    accessToken,
    status,
    posSessionsListStatus,
    currentPosSessionStatus,
  ]);

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
      <CurrentSessionStats currentSession={currentPosSession} />
      <Card>
        <TableCardHeader actions={actions}></TableCardHeader>
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>
              <th scope="col" className="th-primary">
                BY
              </th>
              <th scope="col" className="th-primary text-right">
                OPENED ON
              </th>
              <th scope="col" className="th-primary text-right">
                CLOSED ON
              </th>
              <th scope="col" className="th-primary text-right">
                DURATION(HOURS)
              </th>
              <th scope="col" className="th-primary text-right">
                ACTIONS
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoadingList &&
              rawData &&
              rawData.data.map((item) => (
                <Trow key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.opener?.name ?? "-"}</td>
                  <td className="text-right">
                    {formatDate(item.opening_date)}
                  </td>
                  <td className="text-right">
                    {item.closing_date ? formatDate(item.closing_date) : "-"}
                  </td>
                  <td className="text-right">
                    {formatNumber(item.session_length)}
                  </td>
                  <td className="py-0 pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <LinkButton
                        href={`/merchants/transactions/sessions/${item.id}`}
                        title="View"
                        filled={false}
                        variant="base"
                        responsive={false}
                      />
                    </span>
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
          paginatedData={rawData}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </section>
  );
}

function CurrentSessionStats({ currentSession }) {
  return (
    currentSession && (
      <StatsContainer>
        <Stat
          title="Session Started"
          value={
            <span className="capitalize">
              {getTimeAgo(currentSession.opening_date)}
            </span>
          }
          description={formatDate(currentSession.opening_date)}
          icon="fa-solid fa-clock"
        />

        <Stat
          title="Transactions Done"
          value={currentSession.transactions?.data?.length ?? 0}
          description="Count"
          icon="fa-solid fa-cash-register"
        />
        <Stat
          title="Transactions' Worth"
          value={formatNumber(currentSession.grand_total)}
          description="KES"
          icon="fa-solid fa-money-bill-wave"
        />
      </StatsContainer>
    )
  );
}

export default SessionsListView;
