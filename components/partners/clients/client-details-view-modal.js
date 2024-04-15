import StatelessLoadingSpinnerDark from "@/components/ui/utils/stateless-loading-spinner-dark";
import { fetchClientDetails } from "@/store/merchants/partners/clients-slice";
import store from "@/store/store";
import { Modal } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import ClientDetailView from "./client-details-view";

export default function ClientDetailsViewModal({
  opened = false,
  setOpened = () => {},
  clientId = null,
}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const isLoading = useSelector(
    (state) => state.clients.clientDetailsStatus === "loading"
  );

  const recordName = useSelector((state) =>
    (state.clients.clientDetails?.name ?? "-").substr(0, 20)
  );

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
    <Modal
      opened={opened}
      title={`Client: #${recordName}`}
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

        {!isLoading && <ClientDetailView clientId={clientId} />}
      </div>
    </Modal>
  );
}
