import { ActionIcon, Badge } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
} from "../../../../lib/shared/data-formatters";
import { fetchSubscriptionInvoices } from "../../../../store/merchants/settings/access-control-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { IconFileDownload } from "@tabler/icons";
import Link from "next/link";

function SubscriptionHistoryList() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const rawData = useSelector(
    (state) => state.accessControl.subscriptionInvoiceList
  );
  const subscriptionInvoiceStatus = useSelector(
    (state) => state.accessControl.subscriptionInvoiceStatus
  );
  const isLoading = subscriptionInvoiceStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchSubscriptionInvoices(params));
  }, [startDate, endDate, session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchSubscriptionInvoices(params));
  }

  function getInvoiceUrl(invoiceId) {
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

    return `${url}/api/v1/settings/packages/subscription_pdf/${invoiceId}`;
  }

  return (
    <Card>
      <TableCardHeader>
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
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              SUBSCRIPTION ID
            </th>
            <th scope="col" className="th-primary text-right">
              TAX
            </th>
            <th scope="col" className="th-primary text-right">
              AMOUNT
            </th>
            <th scope="col" className="th-primary">
              DATE
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            rawData?.data?.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item.id}</td>
                  <td>{item?.subscription?.id ?? "-"}</td>
                  <td className="text-right">{formatNumber(item.tax ?? 0)}</td>
                  <td className="text-right">
                    {formatNumber(item.total ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatDate(item.invoice_date)}
                  </td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Link href={getInvoiceUrl(item?.subscription?.id)}>
                        <a target="_blank">
                          <ActionIcon variant="outline" size="md" color="lime">
                            <IconFileDownload size={16} />
                          </ActionIcon>
                        </a>
                      </Link>
                    </span>
                  </td>
                </>
              </Trow>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={rawData}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default SubscriptionHistoryList;
