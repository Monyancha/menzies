import { useRouter } from "next/router";
import CustomerDetailView from "../../../../components/accounts/customers/customer-detail-view";
import BackButton from "../../../../components/ui/actions/back-button";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Card from "../../../../components/ui/layouts/card";
import store from "../../../../src/store/Store";
import { fetchCompanyDetails } from "../../../../src/store/accounts/accounts-slice";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
//
import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/clients",
    title: "Clients",
  },
  {
    title: "View Company",
  },
];

function CustomerDetailsPage() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const companyId = router?.query?.customerId;

  const isLoading = useSelector(
    (state) => state.accounts.companyDetailsStatus === "loading"
  );

  const recordName = useSelector((state) =>
    (state.accounts.companyDetails?.name ?? "-").substr(0, 20)
  );

  useEffect(() => {
    if (!accessToken || !router.isReady) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;

    store.dispatch(fetchCompanyDetails(params));
  }, [accessToken, companyId, router]);

  const breadCrumbActions = <BackButton href={`/merchants/partners/clients`} />;

  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="View Company" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>

      <div className="w-full flex flex-wrap mt-2">
        {isLoading && (
          <Card>
            <div className="flex justify-center w-full p-3 bg-light rounded-lg">
              <StatelessLoadingSpinner />
            </div>
          </Card>
        )}

        {!isLoading && <CustomerDetailView companyId={companyId} />}
      </div>

      </Box>
    </PageContainer>
  );
}

export default CustomerDetailsPage;
