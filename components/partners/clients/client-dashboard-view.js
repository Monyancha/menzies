import { Fragment, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../../src/store/Store";
import { getClientDashboard } from "../../../src/store/partners/clients-slice";
import { formatDate } from "../../../lib/shared/data-formatters";

function ClientDashboardView({ clientId }) {
  const { data: session, status } = useSession();

  const dashboardStatus = useSelector(
    (state) => state.clients.getClientDashboardStatus
  );

  const dashboard = useSelector((state) => state.clients.getClientDashboard);

  const isLoading = dashboardStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["clientId"] = clientId;

    store.dispatch(getClientDashboard(params));
  }, [session, status, clientId]);

  console.log("Client Messages", dashboard);

  return (
    <Fragment>
      <div className="flex w-full flex-wrap pb-3 px-2">
        <div className="w-full md:w-6/12 xl:w-4/12 h-32 md:pr-1">
          <div className="h-full w-full bg-base-300 rounded-xl px-6 py-4 flex flex-col justify-between items-start text-base-content shadow">
            <div className="flex w-full justify-between items-center">
              <span className="text-sm font-semibold">No of Transactions</span>
            </div>
            <div className="w-full">
              <span className="text-2xl tracking-wide mr-2">
                {dashboard?.transaction_count ?? 0}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-6/12 xl:w-4/12 h-32 md:pl-1 xl:pr-1 mt-2 md:mt-0">
          <div className="h-full w-full bg-base-300 rounded-xl px-6 py-4 flex flex-col justify-between items-start text-base-content">
            <div className="flex w-full">
              <span className="text-sm font-semibold">Last Transaction</span>
            </div>
            <div className="w-full">
              <span className="text-thin tracking-wide">
                {dashboard?.last_transaction
                  ? formatDate(dashboard?.last_transaction)
                  : "-"}
              </span>
              <span className="text-2xl tracking-wide ml-1" />
            </div>
          </div>
        </div>
        <div className="w-full xl:w-4/12 h-32 xl:pl-1 mt-2 xl:mt-0">
          <div className="h-full w-full bg-base-300 rounded-xl px-6 py-4 flex flex-col justify-between items-start text-base-content">
            <div className="flex w-full justify-between items-center">
              <span className="text-sm font-semibold">
                Last Service/Product Consumed
              </span>
            </div>
            <div className="w-full">
              <span className="text-thin tracking-wide">
                {dashboard?.last_items?.map((item) => (
                  <>
                    <p>
                      <span>{item}</span>
                    </p>
                  </>
                )) ?? "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ClientDashboardView;
