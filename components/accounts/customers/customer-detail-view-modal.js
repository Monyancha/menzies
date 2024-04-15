import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";
import { fetchCompanyDetails } from "@/store/merchants/accounts/acounts-slice";
import store from "@/store/store";
import { Modal } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import CustomerDetailView from "./customer-detail-view";

export default function CustomerDetailViewModal({
  opened = false,
  setOpened = () => {},
  companyId = null,
}) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const isLoading = useSelector(
    (state) => state.accounts.companyDetailsStatus === "loading"
  );

  const recordName = useSelector((state) =>
    (state.accounts.companyDetails?.name ?? "-").substr(0, 20)
  );

  useEffect(() => {
    if (!accessToken || !companyId) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;

    store.dispatch(fetchCompanyDetails(params));
  }, [accessToken, companyId]);

  return (
    <Modal
      opened={opened}
      title={`Company: ${recordName}`}
      onClose={() => setOpened(false)}
      padding="xs"
      overflow="inside"
      className="bg-base-200"
      fullScreen
    >
      <div className="bg-base-200 h-full">
        {isLoading && (
          <div className="flex justify-center w-full p-3">
            <StatelessLoadingSpinnerDark />
          </div>
        )}

        {!isLoading && <CustomerDetailView companyId={companyId} />}
      </div>
    </Modal>
  );
}
