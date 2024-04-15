import Card from "@/components/ui/layouts/card";
import { Table, Thead, Trow } from "@/components/ui/layouts/scrolling-table";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import {
  formatDate,
  formatNumber,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import { fetchVendorBillPayments } from "@/store/merchants/reports/reports-slice";
import store from "@/store/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function VendorBillsReportsListView() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [endDate, setEndDate] = useState("");

  const isLoading = useSelector(
    (state) => state.reports.vendorBillPaymentsStatus === "loading"
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const vendorBills = useSelector((state) => state.reports.vendorBillPayments);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (startDate) {
      params["startDate"] = startDate;
    }

    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchVendorBillPayments(params));
  }, [branch_id, session, status, startDate, endDate, searchTerm]);

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
              ID
            </th>
            <th scope="col" className="th-primary">
              COMPANY
            </th>
            <th scope="col" className="th-primary">
              ACCOUNTING DATE
            </th>
            <th scope="col" className="th-primary">
              REFERENCE TYPE
            </th>
            <th scope="col" className="th-primary">
              REFERENCE ID
            </th>
            <th scope="col" className="th-primary ">
              OWED
            </th>
            <th scope="col" className="th-primary ">
              PAID
            </th>
            <th scope="col" className="th-primary ">
              OWING(TO PAY)
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            vendorBills?.data?.map((item) => (
              <Trow key={item.id}>
                <td>{item.id}</td>
                <td>{item?.company?.name}</td>
                <td>{formatDate(item?.accounting_date)}</td>
                <td>{item?.reference_type}</td>
                <td>{item?.referenceable_id}</td>
                <td>{formatNumber(item?.items_sum_subtotal)}</td>
                <td>{formatNumber(item?.payments_sum_amount)}</td>
                <td>
                  {formatNumber(
                    parseValidFloat(item?.items_sum_subtotal) -
                      parseValidFloat(item?.payments_sum_amount)
                  )}
                </td>
              </Trow>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </Card>
  );
}
