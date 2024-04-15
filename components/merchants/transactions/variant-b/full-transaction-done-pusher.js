import { showNotification } from "@mantine/notifications";
import Echo from "laravel-echo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLogger from "../../../../lib/shared/logger";

import {
  resetTransactionState,
  setProcessFullTransaction,
  setProcessingSuspendedTransaction,
  setSubmittedTransaction,
  showViewReceipts,
} from "../../../../store/merchants/transactions/transaction-slice";

const logger = getLogger("FullTransactionDonePusher");

export default function FullTransactionDonePusher() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accessControl.myAccountData);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !session || !user?.id) {
      return;
    }

    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      encrypted: true,
      forceTLS: true,
    });

    echo
      .channel(`transaction-done.${user?.id}`)
      .subscribed(() => {
        logger.log("ECHO:: Subscribed to transactions-done channel");
      })
      .listen(`.full_transaction_done`, (data) => {
        data = JSON.parse(data);
        logger.log("ECHO::TransactionSaga::Received::", data);

        dispatch(setProcessFullTransaction(false));

        if (data.result_code === 0) {
          showNotification({
            title: "Success",
            message: "Transaction confirmed successfully",
            color: "green",
          });

          // Yay. Transaction was confirmed successfully
          dispatch(setSubmittedTransaction(data.transaction));
          dispatch(resetTransactionState());
          dispatch(showViewReceipts());
        } else if (data.result_code === -1) {
          showNotification({
            title: "Warning",
            message: data?.message ?? "Error confirming transaction",
            color: "orange",
          });
        }
      })
      .listen(`.suspended_transaction_done`, (data) => {
        data = JSON.parse(data);
        logger.log("ECHO::TransactionSaga::Received::", data);

        dispatch(setProcessingSuspendedTransaction(false));

        if (data.result_code === 0) {
          showNotification({
            title: "Success",
            message: "Transaction confirmed successfully",
            color: "green",
          });

          // Yay. Transaction was confirmed successfully
          dispatch(resetTransactionState());

          router.push("/merchants/transactions/new", "", {
            scroll: false,
          });
        } else if (data.result_code === -1) {
          showNotification({
            title: "Warning",
            message: data?.message ?? "Error confirming transaction",
            color: "orange",
          });
        }
      })
      .error((e) => {
        showNotification({
          title: "Warning",
          message: "Please check your internet connection",
          color: "orange",
        });

        logger.error("Could not connect ", e);
      });
  }, [status, session, user, router, dispatch]);

  return <></>;
}
