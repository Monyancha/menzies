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
import { getCustomerTransactions } from "@/store/merchants/accounts/acounts-slice";

function CustomerTransactionsView() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const customerId = router?.query?.customerId;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const bookingsStatus = useSelector(
    (state) => state.accounts.getCustomerTransactionsStatus
  );
  const bookings = useSelector(
    (state) => state.accounts.getCustomerTransactions
  );
  const isLoading = bookingsStatus === "loading";

  useEffect(() => {
    if (
      !router.isReady ||
      !customerId ||
      !session ||
      status !== "authenticated"
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["customerId"] = customerId;

    if (!startDate && !endDate) {
      store.dispatch(getCustomerTransactions(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getCustomerTransactions(params));
  }, [startDate, endDate, session, status, customerId, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["customerId"] = customerId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getCustomerTransactions(params));
  }

  const filterWithDates = useCallback((startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  //console
  console.log("Transactions Data", bookings);

  const items = bookings?.data[0];

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
                        ITEM
                      </th>
                      <th scope="col" className="th-primary">
                        QUANTITY
                      </th>
                      <th scope="col" className="th-primary">
                        COST
                      </th>
                      <th scope="col" className="th-primary">
                        DISCOUNT
                      </th>
                      <th scope="col" className="th-primary">
                        PAYMENT METHOD
                      </th>
                      {/* <th scope="col" className="th-primary">
                        PROVIDER
                      </th>
                      <th scope="col" className="th-primary">
                        CLIENT
                      </th> */}
                      <th scope="col" className="th-primary">
                        TRANSACTION DATE
                      </th>
                      {/* <th scope="col" className="th-primary text-right">
                        ACTIONS
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!isLoading &&
                      items?.transactions &&
                      items?.transactions?.map((item) => (
                        <tr className="bg-white border-b" key={item.id}>
                          <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {item?.id}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.description ?? "-"}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.quantity ?? 0}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            Ksh. {item?.cost ?? 0}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.discount ?? 0}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.payment_method ?? "-"}
                          </td>
                          {/* <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.service?.name}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.service?.name}
                          </td> */}
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {formatDate(item?.date)}
                          </td>
                          {/* <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.service?.name}
                          </td> */}
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

export default CustomerTransactionsView;
