import { Fragment, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchTransactionList } from "../../../../store/merchants/transactions/transaction-list-slice";
import store from "../../../../store/store";
import TransactionsTable from "../../transactions/transactions-table";
import { useRouter } from "next/router";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { getClientBookings } from "../../../../store/merchants/partners/clients-slice";
import {
  formatDate,
  formatNumber,
} from "../../../../lib/shared/data-formatters";

function ClientBookingsView() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const clientId = router?.query?.clientId;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const bookingsStatus = useSelector(
    (state) => state.clients.getClientBookingsStatus
  );
  const bookings = useSelector((state) => state.clients.getClientBookings);
  const isLoading = bookingsStatus === "loading";

  useEffect(() => {
    if (
      !router.isReady ||
      !clientId ||
      !session ||
      status !== "authenticated"
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["clientId"] = clientId;

    if (!startDate && !endDate) {
      store.dispatch(getClientBookings(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getClientBookings(params));
  }, [startDate, endDate, session, status, clientId, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["clientId"] = clientId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getClientBookings(params));
  }

  const filterWithDates = useCallback((startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  return (
    <Fragment>
      <div className="h-full w-full bg-white rounded-xl px-6 py-8">
        <div className="flex justify-between items-end">
          <section className="flex w-fit flex-wrap mb-2">
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
              <div className="text-dark text-sm">From</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                placeholder="dd/mm/yyyy"
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
                value={startDate}
              />
            </div>

            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 md:pl-2 xl:w-fit">
              <div className="text-dark text-sm">To</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                placeholder="dd/mm/yyyy"
                onChange={(event) => {
                  setEndDate(event.target.value);
                }}
                value={endDate}
              />
            </div>
          </section>
        </div>
        <div className="flex flex-col z-0">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-lg">
                <table className="rounded-lg min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="th-primary">
                        ID
                      </th>
                      <th scope="col" className="th-primary">
                        Service
                      </th>
                      <th scope="col" className="th-primary">
                        Start
                      </th>
                      <th scope="col" className="th-primary">
                        Closing
                      </th>
                      <th scope="col" className="th-primary text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isLoading &&
                      bookings?.contact_bookings?.data &&
                      bookings?.contact_bookings?.data.map((item) => (
                        <tr className="bg-white border-b" key={item.int_id}>
                          <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {item?.int_id}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.service?.name}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {formatDate(item?.start)}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {formatDate(item?.end)}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                            {item?.status !== "Closed" && (
                              <button className="btn btn-error btn-outline btn-sm gap-2">
                                <i className="fa-solid fa-times-circle" />
                                Cancel
                              </button>
                            )}
                            {item?.status === "Closed" && (
                              <button className="btn btn-success  btn-sm gap-2">
                                <i className="fa-solid fa-check-circle" />
                                Closed
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {isLoading && (
                  <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                    <StatelessLoadingSpinner />
                  </div>
                )}

                <PaginationLinks
                  paginatedData={bookings?.contact_bookings}
                  onLinkClicked={onPaginationLinkClicked}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ClientBookingsView;
