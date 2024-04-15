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


function MembershipServiceView() {
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
              <td className="py-3 px-6 text-sm whitespace-nowrap">Service</td>
              <td className="py-3 px-6 text-sm whitespace-nowrap">Price</td>
              <td className="py-3 px-6 text-sm whitespace-nowrap">Discount</td>
              <td className="py-3 px-6 text-sm whitespace-nowrap">
                Mermbership Price
              </td>
              <td className="py-3 px-6 text-sm whitespace-nowrap">
               Remove
              </td>

            </tr>
        </thead>
                  <tbody>

            { membership?.membership_sellables?.map((it, index) => (
              <tr className="border-b" key={index}>
               
                <td className="text-sm whitespace-nowrap">{it?.sellable.sellable.name}</td>
                <td className="text-sm whitespace-nowrap">{it?.sellable.sellable.cost}</td>


                <td className="text-sm whitespace-nowrap">

                  {it?.discount}

                </td>

                <td className="text-sm whitespace-nowrap">
                  {it?.membership_price}
                </td>
                <td>
                <i
                            onClick={() => removeComponent(index)}
                            className="text-red-800 font-bold px-2 cursor-pointer mt-4"
                          >
                            X
                          </i>
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

export default MembershipServiceView;
