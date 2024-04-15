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

function StaffFinancialView() {
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
                      Commission
                    </td>
                    <td>{staff?.rate ?? "-"}</td>
                  </>
                </Trow>

                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      Salary
                    </td>
                    <td>{staff?.salary ?? "-"}</td>
                  </>
                </Trow>

                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      KRA PIN
                    </td>
                    <td>{staff?.kra_pin ?? "-"}</td>
                  </>
                </Trow>


                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      NSSF
                    </td>
                    <td>{staff?.nssf ?? "-"}</td>
                  </>
                </Trow>
                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      NHIF
                    </td>
                    <td>{staff?.nhif ?? "-"}</td>
                  </>
                </Trow>
                <Trow>
                  <>
                    <td scope="row" className="text-primary font-bold">
                      Payment Frequency
                    </td>
                    <td>{staff?.payment_freq ?? "-"}</td>
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

export default StaffFinancialView;
