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
  setProcessingSuspendedTransaction,
} from "../../../../store/merchants/transactions/transaction-slice";

const logger = getLogger("SuspendedTransactionDonePusher");

export default function SuspendedTransactionDonePusher() {
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
        logger.log("ECHO:: Subscribed to suspended-transactions-done channel");
      })
      .error((e) => {
        logger.error("Could not connect ", e);
      });
  }, [status, session, user]);

  return <></>;
}
