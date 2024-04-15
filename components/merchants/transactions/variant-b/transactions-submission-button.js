import { Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/ui/layouts/card";
import { IconDeviceFloppy } from "@tabler/icons";
import { useSession } from "next-auth/react";
import {
  resetTransactionState,
  setProcessFullTransaction,
  showViewReceipts,
  submitTransaction,
} from "@/store/merchants/transactions/transaction-slice";
import { showNotification } from "@mantine/notifications";
import { Alert, Loader } from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import getLogger from "@/lib/shared/logger";
import {
  clearPoints,
  clearPointsR,
} from "@/store/merchants/transactions/transaction-slice";
const logger = getLogger("TransactionSubmissionButton");

function TransactionSubmissionButton({ canCredit, remainingAmount }) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [startTime, setStartTime] = useState();

  const TRANSACTION_MODE = process.env.NEXT_PUBLIC_TRANSACTION_MODE ?? "async";
  const MODE_ASYNC = TRANSACTION_MODE === "async";

  const transactionData = useSelector((state) => state.posTransaction);
  const branch_id = useSelector((state) => state.branches.branch_id);
  const submittedSagaId = useSelector(
    (state) => state.posTransaction.submittedSagaId
  );
  const isSubmitting = useSelector(
    (state) => state.posTransaction.submissionStatus == "loading"
  );

  const isProcessing = useSelector(
    (state) => state.posTransaction.isProcessingFullTransaction
  );

  //awarded redeemed points
  const award_data = useSelector(
    (state) => state?.posTransaction?.clientAwardPoints ?? 0
  );

  const isLoading = isSubmitting;
  let buttonText = "Confirm";
  let buttonColor = "blue";

  if (canCredit && remainingAmount > 0) {
    buttonText = "Credit Transaction";
    buttonColor = "red";
  }

  const canConfirm = () => {
    if (!canCredit && remainingAmount > 0) {
      return false;
    }

    return true;
  };

  const dispatch = useDispatch();
  async function confirmTransaction() {
    if (!accessToken || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["transactionData"] = transactionData;
    params["branch_id"] = branch_id;
    params["template_two_points"] = award_data;

    logger.log("confirmTransaction::BEGIN");
    setStartTime(new Date());
    try {
      await dispatch(submitTransaction(params)).unwrap();

      if (MODE_ASYNC) {
        showNotification({
          title: "Info",
          message: "Processing transaction",
          color: "blue",
        });

        dispatch(setProcessFullTransaction(true));
      } else {
        showNotification({
          title: "Success",
          message: "Transaction saved successfully",
          color: "green",
        });

        dispatch(resetTransactionState());
        dispatch(showViewReceipts());
        dispatch(clearPoints());
        dispatch(clearPointsR());
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

  return (
    <Card>
      <div className="flex w-full justify-end">
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

        {!isProcessing && (
          <Button
            loading={isLoading}
            leftIcon={<IconDeviceFloppy size={14} />}
            disabled={!canConfirm()}
            color={buttonColor}
            onClick={confirmTransaction}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default TransactionSubmissionButton;
