import Card from "../../../ui/layouts/card";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSubmittedTransaction,
  sendTransactionNotification,
} from "../../../../store/merchants/transactions/transaction-slice";
import { useRouter } from "next/router";
import { printRemotePdf } from "../../../../lib/shared/printing-helpers";
import { Button } from "@mantine/core";
import {
  IconPrinter,
  IconSend,
  IconMailForward,
  IconChevronRight,
} from "@tabler/icons";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";

function ReceiptsView() {
  const transaction = useSelector(
    (state) => state.posTransaction.submittedTransaction
  );
  const [sendingSms, setSendingSms] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const branch_id = useSelector((state) => state.branches.branch_id);


  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const dispatch = useDispatch();
  const router = useRouter();

  function createNewOrder() {
    dispatch(clearSubmittedTransaction());

    router.replace("/merchants/transactions/new", undefined, {
      shallow: true,
    });
  }

  async function sendSmsReceipt() {
    const params = {};
    params["accessToken"] = accessToken;
    params["transactionId"] = transaction.id;
    params["sendSms"] = true;
    params["branch_id"] = branch_id;

    console.log("Passed Branch Id Is " + branch_id);

    try {
      setSendingSms(true);
      await dispatch(sendTransactionNotification(params)).unwrap();
      showNotification({
        title: "Success",
        message: "Sending sms receipt",
        color: "green",
      });
    } catch (e) {
      const message = e.message ?? "Could not send sms receipt";
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    } finally {
      setSendingSms(false);
    }
  }

  async function sendEmailReceipt() {
    const params = {};
    params["accessToken"] = accessToken;
    params["transactionId"] = transaction.id;
    params["sendEmail"] = true;
    params["branch_id"] = branch_id;

    try {
      setSendingEmail(true);
      await dispatch(sendTransactionNotification(params)).unwrap();
      showNotification({
        title: "Success",
        message: "Sending email receipt",
        color: "green",
      });
    } catch (e) {
      const message = e.message ?? "Could not send email receipt: ";
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <main className="w-full px-4 py-2 pt-6 mt-32 md:mt-20">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1>Receipt</h1>

          <Button
            color="green"
            onClick={createNewOrder}
            rightIcon={<IconChevronRight size={16} />}
          >
            New Order
          </Button>
        </div>

        <Card>
          <div className="flex w-full justify-end">
            {transaction && (
              <div className="grid grid-cols-1 gap-2 w-full">
                <Button
                  leftIcon={<IconPrinter size={16} />}
                  onClick={() => printRemotePdf(transaction.receipt_address)}
                >
                  Print
                </Button>

                {transaction.client_id && (
                  <>
                    <Button
                      leftIcon={<IconSend size={16} />}
                      variant="outline"
                      onClick={sendSmsReceipt}
                      loading={sendingSms}
                    >
                      Send via SMS
                    </Button>

                    <Button
                      leftIcon={<IconMailForward size={16} />}
                      variant="outline"
                      onClick={sendEmailReceipt}
                      loading={sendingEmail}
                    >
                      Send via Email
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

export default ReceiptsView;
