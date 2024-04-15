import { Button, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import {
  Table,
  TDateFilter,
  TSearchFilter,
} from "../../../ui/layouts/scrolling-table";
import { fetchExistingMembership } from "@/store/merchants/settings/membership-slice";
import { useEffect, useState } from "react";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import {   IconFileDownload } from "@tabler/icons";
import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
  formatNumber
} from "@/lib/shared/data-formatters";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import { showNotification } from "@mantine/notifications";


function MembershipPurchaseView() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const membershipId = router?.query?.MembershipId;

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const membershipStatus = useSelector(
    (state) => state.membership.existingMembershipStatus
  );
  const membership = useSelector(
    (state) => state.membership.existingMembership
  );

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

  const exportPdf = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/membership-reports/export-pdf/${membershipId}?start_date=${startDate}&end_date=${endDate}&filter=${searchTerm}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(endpoint, options);
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = "BillWiseReport.pdf";
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
    // setIsLoadingExcel(false);
  };

  const actions = (
    <>
    {/* { isRestaurantAc &&
       (
        <MultiSelect
          placeholder="Payment Type"
          value={type}
          onChange={setType}
          data={paymentTypes}
          searchable
          clearable
        />
       )
      } */}


<Button
        className="mr-2"
        leftIcon={<IconFileDownload size={16} />}
        variant="outline"

        onClick={exportPdf}
      >
        Export PDF
      </Button>


    </>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
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
              {membership?.membership_type==="Discount" && (
                 <th scope="col" className="th-primary">
                 Amount Used
               </th>
              )}
              {membership?.membership_type==="Discount" && (
                 <th scope="col" className="th-primary">
                 Top Up
               </th>
              )}

{membership.membership_type==="Discount" && (
                 <th scope="col" className="th-primary">
                 Remaining Amount
               </th>
              )}

              <th scope="col" className="th-primary">
                Status
              </th>
              <th scope="col" className="th-primary">
                DATE PURCHASED
              </th>
            </tr>
          </thead>
          <tbody>
            {membership?.membership_clients?.map((it, index) => (
              <tr className="border-b" key={index}>
                <td>
                  <span>
                    {it?.client?.name ?? "-"}
                    ...
                  </span>
                </td>
                <td>{it?.membership_no}</td>

                <td>{formatNumber(membership?.cost ?? 0)}</td>
                {membership?.membership_type==="Discount" && (
                <td>{ formatNumber(it?.amount_used ?? 0)}</td>
                )}
                 {membership?.membership_type==="Discount" && (
                <td>Kshs {formatNumber(it?.membership_topup ?? 0)}</td>
                )}
                {membership?.membership_type==="Discount" && (
                <td>Kshs {formatNumber(it?.membership_rem_amount ?? 0)}</td>
                )}
                <td>{it?.status ?? "-"}</td>

                <td>{formatDate(it?.created_at)}</td>
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

export default MembershipPurchaseView;
