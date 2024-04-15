import { Button, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow, TDateFilter,
  TSearchFilter } from "../../../ui/layouts/scrolling-table";
import { fetchExistingMembership } from "@/store/merchants/settings/membership-slice";
import { useEffect, useState } from "react";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import { IconPencil } from "@tabler/icons";
import { formatDate,
  parseValidFloat,
  getDateFilterFrom,
  getDateFilterTo } from "@/lib/shared/data-formatters";
import TableCardHeader from "@/components/ui/layouts/table-card-header";


function MembershipAttendanceView() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const membershipId = router?.query?.MembershipId;

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const [searchTerm, setSearchTerm] = useState("");

  const membershipStatus = useSelector(
    (state) => state.membership.existingMembershipStatus
  );
  const membership = useSelector((state) => state.membership.existingMembership);

  const isLoading = membershipStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["detailed"] = true;
    params["membershipId"] = membershipId;

    store.dispatch(fetchExistingMembership(params));
  }, [session, status, membershipId]);

  return (
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

      {!isLoading && membership && (

        <Table>
          <thead>
            <tr>


            <th scope="col" className="th-primary">
              CLIENT
            </th>
            <th scope="col" className="th-primary">
              Membership No
            </th>
            <th scope="col" className="th-primary">
              COST
            </th>
            <th scope="col" className="th-primary">
              Days Valid
            </th>
            <th scope="col" className="th-primary">
              Days Accessed
            </th>
            <th scope="col" className="th-primary">
              Days Remaining
            </th>

            <th scope="col" className="th-primary">
              DATE PURCHASED
            </th>

            </tr>
        </thead>
                  <tbody>

            { membership?.membership_clients?.map((it, index) => (
              <tr className="border-b" key={index}>

                <td>
                <span>
                      {it?.client?.name ?? "-"}
                      ...
                    </span>

                </td>
                <td>{it?.membership_no}</td>



                <td>

                  {membership?.cost ?? 0}

                </td>

                <td>{membership.validity ?? 0}</td>
                <td>{it?.membership_attendances.length}</td>
                <td>{parseValidFloat(membership.validity) - parseValidFloat(it?.membership_attendances.length)}</td>

                <td>
                {formatDate(it?.created_at)}
                </td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </Card>
  );
}

export default MembershipAttendanceView;
