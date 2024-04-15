import { parseValidInt } from "@/lib/shared/data-formatters";
import { Button, Checkbox, Radio, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchMembershipList } from "@/store/merchants/settings/membership-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Table, Thead, Trow,  TDateFilter,
  TSearchFilter } from "@/components/ui/layouts/scrolling-table";
import { formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat } from "@/lib/shared/data-formatters";
import Link from "next/link";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import PaginationLinks from "@/components/ui/layouts/pagination-links";


function MembershipListView() {


  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const [searchTerm, setSearchTerm] = useState("");

  const memberships = useSelector(
    (state) => state.membership.membershipList
  );
  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = useSelector(
    (state) => state.transactions.creditReminderSettingStatus === "loading"
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    // params["detailed"] = true;
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

    store.dispatch(fetchMembershipList(params));
  }, [branch_id, session, status,searchTerm,startDate,endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchMembershipList(params));
  }








  return (
    <>
      <Card>
      <TableCardHeader>
        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />

        <div className="col-span-1 md:col-span-2">
          <TSearchFilter onChangeSearchTerm={setSearchTerm} />
        </div>
      </TableCardHeader>
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 gap-2">
              <Table>
                <Thead>
                  <tr>
                    <th scope="col" className="th-primary">
                      Membership
                    </th>
                    <th scope="col" className="th-primary">
                      Cost
                    </th>
                    <th scope="col" className="th-primary ">
                      Validity
                    </th>
                    <th scope="col" className="th-primary ">
                      Calculate Commission On Staff
                    </th>
                    <th scope="col" className="th-primary ">
                      Action
                    </th>
                  </tr>
                </Thead>
                <tbody>
                {memberships?.data?.length >0 &&
              memberships?.data?.map((item,index) => (
                  <Trow key={index}>
                    <>
                      <td>{item?.name ?? "-"}</td>
                      <td>Kshs {formatNumber(item?.cost ?? "-")}</td>
                      <td>{item?.validity}{item?.validity_in}</td>
                      <td>{item?.calculate_commission==1 ? "YES" : "NO"}</td>
                      <td>
                      <Link
                          href={`/merchants/marketing/membership/${item?.id}`}
                        >
                          <Button

                            variant="outline"
                            size="xs"
                          >
                            View
                          </Button>
                        </Link>
                      </td>

                    </>
                  </Trow>
              ))}


                </tbody>
              </Table>
              <PaginationLinks
        paginatedData={ memberships}
        onLinkClicked={onPaginationLinkClicked}
      />
            </div>
          </>
        )}
      </Card>
    </>
  );
}

export default MembershipListView;
