import { Button, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import {
  fetchStaffDetail,
  getStaffDetails,
} from "../../../../store/merchants/partners/staff-slice";
import { useEffect, useState } from "react";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import { IconPencil } from "@tabler/icons";

function StaffDocumentView() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const staffId = router?.query?.staffId;

  const staffDetailStatus = useSelector(
    (state) => state.staff.staffDetailStatus
  );
  const staff = useSelector((state) => state.staff.staffDetail);

  const isLoading = staffDetailStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["detailed"] = true;
    params["staffId"] = staffId;

    store.dispatch(fetchStaffDetail(params));
  }, [session, status, staffId]);

  return (
    <Card>

      {!isLoading && staff && (
        <Table>
          <Thead>
            <Trow>
            <th>Document Name</th>
              <th>Document</th>
              <th>Comment</th>

            </Trow>

           
          </Thead>
          <tbody>

              <>
                <Trow>
                  <>
                    <td>
                      ID
                    </td>
                    <td><Link href={`#`}>Download </Link></td>
                    <td>-</td>
                  </>
                </Trow>

                <Trow>
                  <>
                    <td>
                      Contract
                    </td>
                    <td><Link href={`#`}>Download </Link></td>
                    <td>-</td>
                  </>
                </Trow>


              </>

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

export default StaffDocumentView;
