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
import PaginationLinksDark from "@/components/ui/layouts/pagination-links-dark";
import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";
import {
  TheadDark,
  TrowDark,
} from "@/components/ui/layouts/scrolling-table-dark";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import { Table, TDateFilter } from "@/components/ui/layouts/scrolling-table";
import CardDark from "@/components/ui/layouts/card-dark";

function ClientBookingsView({ clientId }) {
  const { data: session, status } = useSession();

  const router = useRouter();

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
    <CardDark>
      <TableCardHeader>
        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />
      </TableCardHeader>

      <Table>
        <TheadDark>
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
        </TheadDark>
        <tbody>
          {!isLoading &&
            bookings?.contact_bookings?.data &&
            bookings?.contact_bookings?.data.map((item) => (
              <TrowDark key={item.int_id}>
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
              </TrowDark>
            ))}
        </tbody>
      </Table>
      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-base-300 rounded-lg">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinksDark
        paginatedData={bookings?.contact_bookings}
        onLinkClicked={onPaginationLinkClicked}
      />
    </CardDark>
  );
}

export default ClientBookingsView;
