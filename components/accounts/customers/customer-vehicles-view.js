import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "@/store/store";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import { formatDate, formatNumber } from "@/lib/shared/data-formatters";
import { Button } from "@mantine/core";
import { IconCash, IconTableExport } from "@tabler/icons";
import { fetchCompanyCarList } from "@/store/merchants/accounts/acounts-slice";
import Card from "@/components/ui/layouts/card";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import {
  Table,
  Thead,
  Trow,
  TSearchFilter,
} from "@/components/ui/layouts/scrolling-table";
import NewCompanyCarsModal from "./new-company-cars-modal";
import EditCompanyCarsModal from "./edit-company-cars-modal";
import Link from "next/link";
import {
  TheadDark,
  TrowDark,
} from "@/components/ui/layouts/scrolling-table-dark";
import CardDark from "@/components/ui/layouts/card-dark";
import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";

function CustomerVehiclesView({ companyId }) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [searchTerm, setSearchTerm] = useState();

  const isLoading = useSelector(
    (state) => state.accounts.companyCarListStatus === "loading"
  );
  const records = useSelector((state) => state.accounts.companyCarList);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;
    params["filter"] = searchTerm;

    store.dispatch(fetchCompanyCarList(params));
  }, [accessToken, companyId, searchTerm]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["page"] = page;
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchCompanyCarList(params));
  }

  const actions = (
    <div className="flex items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />

      <NewCompanyCarsModal
        companyId={companyId}
        onSuccess={(v) => {
          const params = {};
          params["accessToken"] = session?.user?.accessToken;
          params["companyId"] = companyId;
          store.dispatch(fetchCompanyCarList(params));
        }}
      />
    </div>
  );

  return (
    <CardDark>
      <TableCardHeader actions={actions}></TableCardHeader>

      <Table>
        <TheadDark>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              NUMBER PLATE
            </th>
            <th scope="col" className="th-primary">
              YEAR OF MANUFACTURE
            </th>
            <th scope="col" className="th-primary text-right">
              CREATED AT
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </TheadDark>
        <tbody>
          {!isLoading &&
            records?.data.map((item) => (
              <TrowDark key={item.id}>
                <>
                  <td>{item.id}</td>
                  <td>{item.car_plate}</td>
                  <td>{item.car_year ?? "-"}</td>
                  <td className="text-right">
                    {item?.created_at ? formatDate(item?.created_at) : "-"}
                  </td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Link
                        href={`/merchants/accounts/customers/${companyId}/${item.id}/transactions`}
                      >
                        <Button
                          size="xs"
                          variant="outline"
                          leftIcon={<IconCash size={14} />}
                        >
                          Transactions
                        </Button>
                      </Link>
                      <EditCompanyCarsModal
                        record={item}
                        companyId={companyId}
                      />
                    </span>
                  </td>
                </>
              </TrowDark>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinks
        paginatedData={records}
        onLinkClicked={onPaginationLinkClicked}
      />
    </CardDark>
  );
}

export default CustomerVehiclesView;
