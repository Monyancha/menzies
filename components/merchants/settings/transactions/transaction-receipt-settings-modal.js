import {
  Button,
  Modal,
  Select,
  Textarea,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import {
  fetchReceiptSettings,
  submitTransactionReceiptSettings,
} from "@/store/merchants/transactions/transaction-list-slice";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";

export default function TransactionReceiptSettingsModal({
  opened = null,
  setOpened = () => {},
} = {}) {
  const { data: session, status } = useSession();
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [logo_enabled ,setLogo] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearForm() {
    setHeader("");
    setFooter("");
  }

  const isLoading = useSelector(
    (state) => state.transactions.receiptSettingsStatus === "loading"
  );

  const receiptSettingsDetails = useSelector(
    (state) => state.transactions.receiptSettingsDetails
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(fetchReceiptSettings(params));
  }, [session, status]);

  useEffect(() => {
    if (!session || status !== "authenticated" || isLoading) {
      return;
    }

    setHeader(receiptSettingsDetails?.header ?? "");
    setFooter(receiptSettingsDetails?.footer ?? "");
    setLogo(receiptSettingsDetails?.logo_enabled===1 ? true : false)
  }, [session, status, isLoading, receiptSettingsDetails]);

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["header"] = header;
    params["footer"] = footer;
    params["logo_enabled"] = logo_enabled;

    try {
      setIsSubmitting(true);

      await store.dispatch(submitTransactionReceiptSettings(params)).unwrap();

      store.dispatch(fetchReceiptSettings(params));

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });

      clearForm();
      setOpened(false);
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }

      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Receipt Settings"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {!isLoading && (
          <>
            <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
              <Textarea
                placeholder="Header"
                label="Header"
                value={header}
                onChange={(e) => setHeader(e.currentTarget.value)}
              />

              <Textarea
                placeholder="Footer"
                label="Footer"
                value={footer}
                onChange={(e) => setFooter(e.currentTarget.value)}
              />
            </section>
            <section className="flext flex-col">
              {/* <Checkbox
                onChange={(e)=>setLogo(e.currentTarget.checked)}
                label="Show Company Lo go On Receipt"
                checked={logo_enabled}

              /> */}
            </section>

            <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
              <Button
                onClick={submitDetails}
                loading={isSubmitting || isLoading}
              >
                Save
              </Button>
            </section>
          </>
        )}

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}
      </Modal>
    </>
  );
}
