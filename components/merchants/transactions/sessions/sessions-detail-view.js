import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
  parseValidFloat,
} from "../../../../lib/shared/data-formatters";
import {
  fetchPosSessionDetails,
  fetchPosSessionDetailsReceipt,
  fetchPosSessionDetailsPdf,
} from "../../../../store/merchants/transactions/pos-sessions-slice";
import store from "../../../../store/store";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import PosCashDrawerModal from "./pos-cash-drawer-modal";

function SessionsDetailView() {
  const router = useRouter();
  let sessionId = router.query?.sessionId ?? null;

  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  // TODO:: Check if user is merchant or normal user

  const transactionsRawData = useSelector(
    (state) => state.posSessions.posSessionDetails?.transactions
  );
  const rawData = useSelector((state) => state.posSessions.posSessionDetails);
  const loadedId = rawData?.id ?? null;
  const posSessionDetailsStatus = useSelector(
    (state) => state.posSessions.posSessionDetailsStatus
  );
  const posSessionDetails = useSelector(
    (state) => state.posSessions.posSessionDetails
  );
  const isLoading = posSessionDetailsStatus === "loading";
  const isReceiptLoading = useSelector(
    (state) => state.posSessions.posSessionDetailsReceiptStatus === "loading"
  );

  const isPdfLoading = useSelector(
    (state) => state.posSessions.posSessionDetailsPdfStatus === "loading"
  );

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["page"] = page;

    store.dispatch(fetchPosSessionDetails(params));
  }

  function refreshList() {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = { accessToken, sessionId };
    store.dispatch(fetchPosSessionDetails(params));
  }

  function downloadReceipt() {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = { accessToken, sessionId };
    store.dispatch(fetchPosSessionDetailsReceipt(params));
  }

  function downloadPdf() {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = { accessToken, sessionId };
    store.dispatch(fetchPosSessionDetailsPdf(params));
  }

  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !sessionId) {
      return;
    }

    const params = { accessToken, sessionId };

    if (`${loadedId}` !== sessionId) {
      store.dispatch(fetchPosSessionDetails(params));
      return;
    }
  }, [accessToken, status, sessionId, loadedId]);

  const actions = (
    <>
      <div className="flex gap-2 items-end">
        {posSessionDetails?.closing_date === null && <PosCashDrawerModal />}

        <ActionIconButton
          icon="fa-solid fa-file-export"
          isLoading={isReceiptLoading}
          tooltip="Export"
          clickHandler={downloadReceipt}
        />

        <ActionIconButton
          icon="fa-solid fa-download"
          isLoading={isPdfLoading}
          tooltip="PDF"
          clickHandler={downloadPdf}
        />

        <ActionIconButton
          icon="fa-solid fa-arrows-rotate"
          tooltip="Refresh"
          clickHandler={refreshList}
        />
      </div>
    </>
  );

  return (
    <div className="flex flex-col space-y-1 w-full">
      <Card>
        <TableCardHeader actions={actions}></TableCardHeader>
      </Card>

      <Card>
        {!isLoading && rawData && <SessionMetaData rawData={rawData} />}

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}
      </Card>

      {rawData?.departments && (
        <Card>
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <h2>Department Totals</h2>
          </div>

          <Table>
            <Thead>
              <tr>
                <th scope="col" className="th-primary">
                  Department
                </th>
                <th scope="col" className="th-primary">
                  Amount
                </th>
              </tr>
            </Thead>
            <tbody>
              {rawData?.departments?.map((item) => (
                <Trow key={item.id}>
                  <td>{item.name}</td>
                  <td className="text-left">{item.sum}</td>
                </Trow>
              ))}
              <Trow>
                <td>Without Departments</td>
                <td className="text-left">
                  {formatNumber(rawData?.without_departments_sum ?? 0)}
                </td>
              </Trow>
            </tbody>
          </Table>
        </Card>
      )}

      {!isLoading && rawData?.wallet_movements && (
        <SessionWalletMovements walletMovements={rawData?.wallet_movements} />
      )}

      <Card>
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>

              <th scope="col" className="th-primary text-right">
                COST
              </th>

              <th scope="col" className="th-primary text-right">
                DISCOUNT
              </th>

              <th scope="col" className="th-primary text-right">
                TOTAL PAID
              </th>

              <th scope="col" className="th-primary">
                CLIENT
              </th>

              <th scope="col" className="th-primary text-right">
                TRANSACTION DATE
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoading &&
              transactionsRawData &&
              transactionsRawData.data.map((item) => (
                <Trow key={item.id}>
                  <>
                    <td>{item.id}</td>
                    <td className="text-right">{formatNumber(item.cost)}</td>
                    <td className="text-right">
                      {formatNumber(item.discount)}
                    </td>
                    <td className="text-right">{item.total_paid}</td>
                    <td>{item.client?.name ?? "-"}</td>
                    <td className="text-right">{formatDate(item.date)}</td>
                  </>
                </Trow>
              ))}
          </tbody>
        </Table>

        <PaginationLinks
          paginatedData={transactionsRawData}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </div>
  );
}

function SessionMetaData({ rawData }) {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <Trow>
          <>
            <td className="font-bold py-2">Id</td>
            <td className="py-2">{rawData.id}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Opened By</td>
            <td className="py-2">{rawData.opener?.name ?? "-"}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Opened On</td>
            <td className="py-2">{formatDate(rawData.opening_date)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Closed On</td>
            <td className="py-2">
              {rawData.closing_date ? formatDate(rawData.closing_date) : "-"}
            </td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Opening Balance</td>
            <td className="py-2">{formatNumber(rawData.opening_balance)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Cash In</td>
            <td className="py-2">{formatNumber(rawData.cash_in)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Cash Out</td>
            <td className="py-2">{formatNumber(rawData.cash_out)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Closing Balance</td>
            <td className="py-2">{formatNumber(rawData.closing_balance)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Cash Payments</td>
            <td className="py-2">{formatNumber(rawData.cash_payments)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Bank Payments</td>
            <td className="py-2">{formatNumber(rawData.bank_payments)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Card Payments</td>
            <td className="py-2">{formatNumber(rawData.card_payments)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Mpesa Payments</td>
            <td className="py-2">{formatNumber(rawData.mpesa_payments)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Cheque Payments</td>
            <td className="py-2">{formatNumber(rawData.cheque_payments)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Complimentary</td>
            <td className="py-2">{rawData?.complimentary_payments}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Credited Payments</td>
            <td className="py-2">{formatNumber(rawData.credited_payments)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Suspended Transactions Worth</td>
            <td className="py-2">
              {formatNumber(rawData.suspended_transactions_sum)}
            </td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Discount</td>
            <td className="py-2">{formatNumber(rawData.discount_total)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Grand Total</td>
            <td className="py-2">{formatNumber(rawData.grand_total)}</td>
          </>
        </Trow>

        <Trow>
          <>
            <td className="font-bold py-2">Narration</td>
            <td className="py-2">{rawData?.narration ?? "-"}</td>
          </>
        </Trow>
      </tbody>
    </Table>
  );
}

function SessionWalletMovements({ walletMovements }) {
  return (
    <Card>
      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              Id
            </th>
            <th scope="col" className="th-primary">
              Wallet
            </th>
            <th scope="col" className="th-primary text-right">
              Amount
            </th>
            <th scope="col" className="th-primary">
              Type
            </th>
            <th scope="col" className="th-primary">
              Variance
            </th>
          </tr>
        </Thead>
        <tbody>
          {walletMovements?.map((item) => (
            <Trow key={item.id}>
              <>
                <td>{item.id}</td>
                <td>{item.wallet_type}</td>
                <td className="text-right">{formatNumber(item.amount)}</td>
                <td>{item.type}</td>
                <td>
                  {item?.metadata?.variance && (
                    <>
                      <div>{item?.metadata?.variance?.amount}</div>
                      <div>{item?.metadata?.variance?.type}</div>
                      <div>{item?.metadata?.variance?.human_readable_type}</div>
                    </>
                  )}
                </td>
              </>
            </Trow>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default SessionsDetailView;
