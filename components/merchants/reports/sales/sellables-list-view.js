import { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import {
  Table,
  Thead,
  TSearchFilter,
  TDateFilter,
  TDateTimeFilter
} from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import {
  fetchSalesSummaryReceipt,
  fetchSoldSellables,
} from "../../../../store/merchants/reports/sales/sales-reports-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { isRestaurant } from "../../../../lib/shared/roles_and_permissions";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import { useRouter } from "next/router";
import SellablesListFilterBadges from "./sellables-list-filter-badges";
import { Select,Switch } from "@mantine/core";
import { fetchDepartments } from "@/store/merchants/settings/branches-slice";

function SellablesListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [searchTerm, setSearchTerm] = useState("");
  const [department_id,setDepartment] = useState("");
  const [checked, setChecked] = useState(false);
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();



  const rawData = useSelector((state) => state.salesReports.sellablesList);
  const sellablesListStatus = useSelector(
    (state) => state.salesReports.sellablesListStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const departments_list = useSelector((state) => state.branches.departments_list);


  const isLoading = sellablesListStatus === "loading";
  const isRestaurantAc = isRestaurant(session?.user);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken || !router.isReady) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    if (router?.query?.category_id) {
      params["categoryId"] = router?.query?.category_id;
    }

    if (router?.query?.sub_category_id) {
      params["subCategoryId"] = router?.query?.sub_category_id;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    if (startDateTime) {
      params["startDateTime"] = startDateTime;
    }

    if (endDateTime) {
      params["endDateTime"] = endDateTime;
    }


    if (department_id) {
      params["department_id"] = department_id;
    }

    store.dispatch(fetchSoldSellables(params));
    // store.dispatch(fetchDepartments(params));

  }, [branch_id, startDate, endDate, accessToken, router, searchTerm,department_id,startDateTime,endDateTime]);


  const showDateTime = (e) => {
    setStartDate("");
    setEndDate("");
    setChecked(e)
    if(!e)
    {
      setStartDate(getDateFilterFrom);
      setEndDate(getDateFilterTo);
    }

  }
  function havingQueryFilters() {
    if (router?.query?.category_id) {
      return true;
    }

    if (router?.query?.sub_category_id) {
      return true;
    }

    return false;
  }

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    if (startDateTime) {
      params["startDateTime"] = startDateTime;
    }

    if (endDateTime) {
      params["endDateTime"] = endDateTime;
    }

    if (router?.query?.category_id) {
      params["categoryId"] = router?.query?.category_id;
    }

    if (router?.query?.sub_category_id) {
      params["subCategoryId"] = router?.query?.sub_category_id;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchSoldSellables(params));
  }

  const isReceiptLoading = useSelector(
    (state) => state.salesReports.salesSummaryReceiptStatus === "loading"
  );

  function downloadReceipt() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    params["branch_id"] = branch_id;
    store.dispatch(fetchSalesSummaryReceipt(params));
  }

  const actions = (
    <div className="flex items-end space-x-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
      {/* {departments_list?.data?.length>0 && (
               <Select
               placeholder="Department"
               data={
                 departments_list
                   ?.data
                   ?.map((item) => ({
                     value: `${item.id}`,
                     label: `${item?.name}`,
                   })) ?? []
               }
               value={department_id}
               onChange={(v) => setDepartment(v)}
               searchable
               clearable
               className="space-x-1"
             />
             )} */}

      <ActionIconButton
        icon="fa-solid fa-file-export"
        isLoading={isReceiptLoading}
        tooltip="Export"
        clickHandler={downloadReceipt}
      />
    </div>
  );

  return (
    <div className="flex flex-col space-y-2 space-x-1 w-full mb-8">
      <Card>
      {/* <TableCardHeader>
      <Switch
          label="Show Date and Time"
           checked={checked}
            onChange={(event) => showDateTime(event.currentTarget.checked)}
           size="md"
            />
      </TableCardHeader> */}
        <TableCardHeader actions={actions}>
        {checked ? (
          <TDateTimeFilter
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          onChangeStartDateTime={setStartDateTime}
          onChangeEndDateTime={setEndDateTime}
        />
        ) : (
          <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />

        )}
        </TableCardHeader>

        <SellablesListFilterBadges pageUrl="/merchants/reports/sales/sellables" />

        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>
              <th scope="col" className="th-primary">
                GOOD/SERVICE
              </th>
              <th scope="col" className="th-primary text-right">
                QUANTITY
              </th>
              <th scope="col" className="th-primary text-right">
                SUBTOTAL
              </th>
            </tr>
          </Thead>
          <tbody className="bg-yellow-100">
            {!isLoading &&
              rawData &&
              rawData.data.map((item) => (
                <tr className="bg-white border-b" key={item.product_id}>
                  <td>{item.product_id}</td>
                  <td>{item.sellable?.sellable?.name ?? "-"}</td>
                  <td className="text-right">
                    {formatNumber(item.total_quantity)}
                  </td>
                  <td className="text-right">{formatNumber(item.total)}</td>
                </tr>
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

      <div className="border-2 border-dark rounded-lg">
        <Card>
          <Table>
            <Thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th scope="col" className="th-primary text-right">
                  TOTAL
                </th>
              </tr>
            </Thead>
            <tbody>
              {!isLoading && rawData && (
                <Fragment>
                  {!havingQueryFilters() && (
                    <>
                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          CASH (IN)
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.cash_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          CASH (OUT)
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.cash_payments_credit)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          CARD
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.card_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          CHEQUE
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.cheque_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          BANK TRANSFER
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.bank_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          M-PESA
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.mpesa_payments)}
                        </td>
                      </tr>
                    </>
                  )}

                  {!havingQueryFilters() && isRestaurantAc && (
                    <>
                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          GLOVO
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.glovo_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          JUMIA FOOD
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.jumia_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          UBER EATS
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.uber_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          BOLT FOOD
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.bolt_payments)}
                        </td>
                      </tr>
                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          COMPLIMENTARY
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.complimentary_payments)}
                        </td>
                      </tr>
                    </>
                  )}

                  {!havingQueryFilters() && (
                    <>
                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-error font-bold text-right"
                        >
                          ITEM DISCOUNTS
                        </th>
                        <td className="text-right text-error tracking-wider text-xl font-bold">
                          {formatNumber(rawData.titem_discounts)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-error font-bold text-right"
                        >
                          TRANSACTION DISCOUNTS
                        </th>
                        <td className="text-right text-error tracking-wider text-xl font-bold">
                          {formatNumber(rawData.transaction_discounts)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-error font-bold text-right"
                        >
                          TOTAL DISCOUNTS
                        </th>
                        <td className="text-right text-error tracking-wider text-xl font-bold">
                          {formatNumber(rawData.discount_total)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-error font-bold text-right"
                        >
                          CREDIT SALES
                        </th>
                        <td className="text-right text-error tracking-wider text-xl font-bold">
                          {formatNumber(rawData.credited_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right ml-3"
                        >
                          CREDIT PAYMENTS
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.credited_debit_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-success font-bold text-right"
                        >
                          SUSPENDED
                        </th>
                        <td className="text-right text-success tracking-wider text-xl font-bold">
                          {formatNumber(rawData.suspended_transactions_worth)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          BEFORE TAX
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.total_before_tax)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          TAX AMOUNT
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.total_tax_amount)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          AFTER TAX
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.total_after_tax)}
                        </td>
                      </tr>
                    </>
                  )}

                  <tr className="bg-white border-b">
                    <th
                      scope="row"
                      colSpan="3"
                      className="text-primary font-bold text-right"
                    >
                      GROSS TOTAL
                    </th>
                    <td className="text-right text-dark tracking-wider text-xl font-bold">
                      {formatNumber(rawData.gross_total)}
                    </td>
                  </tr>

                  {!havingQueryFilters() && (
                    <>
                      <tr className="bg-white border-b text-lg">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          NET TOTAL
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.net_total)}
                        </td>
                      </tr>
                    </>
                  )}
                </Fragment>
              )}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

export default SellablesListView;
