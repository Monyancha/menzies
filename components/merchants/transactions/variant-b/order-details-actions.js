import { Button, Alert, Loader } from "@mantine/core";
import {
  resetTransactionState,
  setProcessingSuspendedTransaction,
  showViewPayments,
  suspendTransaction,
} from "../../../../store/merchants/transactions/transaction-slice";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { hasBeenGranted } from "../../../../store/merchants/settings/access-control-slice";
import { useMemo } from "react";
import {
  clearPoints,
  clearPointsR,
} from "../../../../store/merchants/transactions/transaction-slice";

function OrderDetailsActions() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const dispatch = useDispatch();
  const router = useRouter();

  const TRANSACTION_MODE = process.env.NEXT_PUBLIC_TRANSACTION_MODE ?? "async";
  const MODE_ASYNC = TRANSACTION_MODE === "async";

  const isProcessing = useSelector(
    (state) => state.posTransaction.isProcessingSuspendedTransaction
  );

  const transactionData = useSelector((state) => state.posTransaction);
  const isSuspending = useSelector(
    (state) => state.posTransaction.suspensionStatus == "loading"
  );
  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = isSuspending;

  async function suspendTransactionHandler() {
    if (!accessToken || status !== "authenticated" || isSuspending) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["transactionData"] = transactionData;
    params["branch_id"] = branch_id;
    try {
      await dispatch(suspendTransaction(params)).unwrap();

      if (MODE_ASYNC) {
        showNotification({
          title: "Info",
          message: "Processing transaction",
          color: "blue",
        });

        dispatch(setProcessingSuspendedTransaction(true));
      } else {
        showNotification({
          title: "Success",
          message: "Transaction saved successfully",
          color: "green",
        });

        dispatch(resetTransactionState());
        dispatch(clearPoints());
        dispatch(clearPointsR());

        router.push("/merchants/transactions/v3roo/new", "", {
          scroll: false,
        });
      }
    } catch (e) {
      const message = e.message ?? "Could not save transaction";
      showNotification({
        title: "Warning",
        message,
        color: "orange",
      });
    }
  }

  function showPaymentsView() {
    store.dispatch(showViewPayments());
  }

  return (
    <>
      <div className="w-full justify-end">
        {isProcessing && (
          <div className="w-full">
            <Alert
              icon={<Loader variant="bars" />}
              title="Processing Transaction"
              color="blue"
            >
              Please do not close or leave this tab while this is happening.
            </Alert>
          </div>
        )}
      </div>

      <section className="w-full flex items-center gap-4 mt-2">
        {useSelector(hasBeenGranted("can_create_order")) && (
          <Button
            variant="outline"
            color="blue"
            loading={isLoading}
            disabled={isProcessing}
            onClick={suspendTransactionHandler}
            fullWidth
          >
            Create Order
          </Button>
        )}

        {useSelector(hasBeenGranted("can_confirm_transaction")) && (
          <Button
            variant="filled"
            color="blue"
            disabled={isProcessing}
            onClick={showPaymentsView}
            fullWidth
          >
            Receive Payments
          </Button>
        )}
      </section>
    </>
  );
}

export default OrderDetailsActions;
