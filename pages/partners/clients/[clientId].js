import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import BackButton from "../../../components/ui/actions/back-button";
import StatelessLoadingSpinnerDark from "../../../components/ui/utils/stateless-loading-spinner-dark";
import { fetchClientDetails } from "../../../src/store/partners/clients-slice";
import store from "../../../src/store/Store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import ClientDetailView from "../../../components/partners/clients/client-details-view";

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
    title: "View Client",
  },
];

function ClientDetailsPage() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const clientId = router?.query?.clientId ?? "-1";

  const isLoading = useSelector(
    (state) => state.clients.clientDetailsStatus === "loading"
  );

  const currentClient = useSelector((state) =>
    state.clients?.clientList?.data?.find((item) => item.id == clientId)
  );

  const breadCrumbActions = <BackButton href="/partners/clients" />;

  useEffect(() => {
    if (!accessToken || !clientId) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["clientId"] = clientId;

    store.dispatch(fetchClientDetails(params));
  }, [accessToken, clientId]);

  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Clients" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>
      <div className="w-full flex flex-wrap mt-2"></div>

      <div className="bg-base-200 h-full">
        {isLoading && (
          <div className="flex justify-center w-full p-3">
            <StatelessLoadingSpinnerDark />
          </div>
        )}

        {!isLoading && <ClientDetailView clientId={clientId} />}
      </div>
      </Box>
    </PageContainer>
  );
}

export default ClientDetailsPage;
