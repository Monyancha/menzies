import { Button, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import { fetchExistingMembership } from "@/store/merchants/settings/membership-slice";
import { useEffect, useState } from "react";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import { IconPencil } from "@tabler/icons";
import { formatDate } from "@/lib/shared/data-formatters";


function MembershipTransactionView() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const membershipId = router?.query?.MembershipId;

  console.log(`This is the membership ID ${membershipId}`)

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

      {!isLoading && membership && (

        <Table>
          <thead>
            <tr>


            <th scope="col" className="th-primary">
              ITEM(s)
            </th>

            <th scope="col" className="th-primary">
              COST
            </th>
            <th scope="col" className="th-primary">
              DISCOUNT
            </th>
            <th scope="col" className="th-primary">
              CLIENT
            </th>


            <th scope="col" className="th-primary">
              TRANSACTION DATE
            </th>

            </tr>
        </thead>
                  <tbody>

            { membership?.membership_transactions?.map((it, index) => (
              <tr className="border-b" key={index}>

                <td>
                <span>
                      {it?.all_transactions?.titems[0]?.sellable?.sellable?.name?.substr(
                        0,
                        30
                      ) ?? "Gift Card"}
                      ...
                    </span>
                    <span className="text-xs">
                      ({it.all_transactions?.titems?.length ?? 0})
                    </span>
                </td>
                <td>{it?.all_transactions?.cost}</td>
                <td>-</td>


                <td>

                  {it?.all_transactions?.client?.name}

                </td>

                <td>
                {formatDate(it?.all_transactions?.date)}
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

export default MembershipTransactionView;
