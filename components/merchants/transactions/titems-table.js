import {
  Table,
  Thead,
  TDateFilter,
  TSearchFilter,
  Badge,
  Checkbox
} from "@/components/ui/layouts/scrolling-table";
import PaginationLinks from "../../ui/layouts/pagination-links";

import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";

import { useSession } from "next-auth/react";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  isMerchant,
  isRestaurant,
} from "../../../lib/shared/roles_and_permissions";

import TableCardHeader from "@/components/ui/layouts/table-card-header";

import CardDark from "@/components/ui/layouts/card-dark";
import {
  TheadDark,
  TrowDark,
} from "@/components/ui/layouts/scrolling-table-dark";
import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";
import LinkButton from "@/components/ui/actions/link-button";

export default function TitemsTable({
  returned_titems=null,
  onPaginationLinkClicked = () => {},
  isLoading = false
} = {}) {
  const { data: session } = useSession();




  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());




  const isLoadingList = isLoading && true;

  const isMerchantAc = isMerchant(session?.user);
  const isRestaurantAc = isRestaurant(session?.user);




  const actions = (
    <>
       <LinkButton
      title="SELL"
      href={`#`}
      icon="fa-solid fa-angle-right"
      responsive={false}
    />



    </>
  );
  return (
    <CardDark>
      <TableCardHeader actions={actions}>
        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />

        <div className="col-span-1 md:col-span-2">
          {/* <TSearchFilter onChangeSearchTerm={setSearchTerm} /> */}
        </div>

      </TableCardHeader>

      <Table>
            <TheadDark className="bg-gray-50">
              <tr>
              <th scope="col" className="th-primary">
                 Select
                </th>
                <th scope="col" className="th-primary">
                  ID
                </th>
                <th scope="col" className="th-primary">
                  PRODUCT
                </th>
                <th scope="col" className="th-primary">
                  QUANTITY
                </th>
                <th scope="col" className="th-primary">
                  COST
                </th>
                <th scope="col" className="th-primary">
                  Discount
                </th>
                <th scope="col" className="th-primary">
                  Staff Commission
                </th>
                <th scope="col" className="th-primary">
                  Total Tax
                </th>
                <th scope="col" className="th-primary">
                  Net Total
                </th>
                {isRestaurantAc && (
                  <th scope="col" className="th-primary">
                  Order Type
                  </th>
                )}
                {isRestaurantAc && (
                  <th scope="col" className="th-primary">
                    Accompaniments
                  </th>
                )}
              </tr>
            </TheadDark>
            <tbody>
              {returned_titems?.data &&
                returned_titems?.data.map((item) => (
                  <TrowDark key={item?.id}>
                     <td>
                      <Checkbox
                          key={item.id}
                          onChange={()=>updateCheckbox(item.id)}

                        />
                      </td>
                    <td className="py-3 px-6 text-sm font-medium whitespace-nowrap">
                      {item?.id}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {item?.sellable?.sellable?.name ?? "--"}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {item?.quantity}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {item?.sub_total}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {item?.discount}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {item?.staff_income?.map((staff) => (
                          <Badge key={staff.id}>
                            {staff?.staff?.name}: {staff.amount}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">0</td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {item?.total}
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      {item?.order_type ?? "-"}
                    </td>
                    {isRestaurantAc && (
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {item?.sold_accompaniments?.map(
                          (it) => it.accompaniments.name + " ," ?? "-"
                        )}
                      </td>
                    )}
                  </TrowDark>
                ))}
            </tbody>
          </Table>
      {isLoadingList && (
        <div className="flex justify-center w-full p-3 bg-base-300 rounded-lg">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      <PaginationLinks
        paginatedData={returned_titems}
        onLinkClicked={onPaginationLinkClicked}
      />





    </CardDark>
  );
}
