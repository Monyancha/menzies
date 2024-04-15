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

function StaffBioView() {
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
      <div className="flex justify-end mb-2 gap-2">
        <Link href={`/merchants/partners/staffs/edit/${staffId}`}>
          <Button variant="outline" size="xs">
            Edit Staff
          </Button>
        </Link>

        <Link href={`/merchants/partners/staffs/commission/${staffId}`}>
          <Button variant="outline" size="xs">
            Edit Commission
          </Button>
        </Link>
      </div>
      {!isLoading && staff && (
        <Table>
          <Thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </Thead>
          <tbody>
            {staff && (
              <>
                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      Name
                    </td>
                    <td>{staff?.name}</td>
                  </>
                </Trow>

                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      Phone
                    </td>
                    <td>{staff.phone ?? staff?.user?.phone ?? "-"}</td>
                  </>
                </Trow>

                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      Email
                    </td>
                    <td>{staff?.email ?? "-"}</td>
                  </>
                </Trow>


                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      Rate
                    </td>
                    <td>{staff?.rate ?? 0}%</td>
                  </>
                </Trow>
              </>
            )}
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

export default StaffBioView;
