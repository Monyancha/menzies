import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import getLogger from "../../../lib/shared/logger";
import MerchantUiContext from "../../shared/merchant-ui";
import BottomAlertsContext from "../../shared/bottom-alerts";
import PaymentsEditingContext from "./payments-editing-context";
import PaymentsContext from "./payments-context";

const TransactionEditingContext = createContext({
  titems: undefined,
  transactionId: undefined,
  isEditing: () => {},
  titemFormData: {},
  titemActions: {
    load: () => {},
    add: (sellableId) => {},
    delete: (titemId) => {},
    form: {
      validateServices: () => {},
      setStaff: (titem, staffId) => {},
      setDiscount: (titem, discount) => {},
    },
  },
  transactions: {
    transaction: {
      client_id: undefined,
      payment_method: "Cash",
      isPaymentCash: () => {},
      isPaymentMpesa: () => {},
      isPaymentCard: () => {},
      isPaymentCredit: () => {},
    },
    actions: {
      confirm: () => {},
      suspend: () => {},
      setClient: (clientId) => {},
      setPaymentMethod: (paymentMethod) => {},
    },
  },
});

export function TransactionEditingContextProvider(props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const logger = getLogger("TransactionEditingContext");

  const [titems, setTitems] = useState(undefined);
  const [titemFormData, setTitemFormData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [clientId, setClientId] = useState();

  const { data: session } = useSession();

  const router = useRouter();
  const { transaction_id: transactionId } = router.query;

  const alertCtx = useContext(BottomAlertsContext);
  const uiCtx = useContext(MerchantUiContext);
  const paymentMethodCtx = useContext(PaymentsEditingContext);
  const newPaymentMethodsCtx = useContext(PaymentsContext);

  function isEditing() {
    const editing =
      transactionId && !isNaN(transactionId) && parseInt(transactionId) > 0;

    return editing;
  }

  function confirmTransaction(callback) {
    // TODO: VALIDATE
    // PREPARE DATA
    let body = {
      titem_staff: titemFormData,
    };
    if (clientId) {
      body["client_id"] = clientId;
    }

    body["payment_methods"] = newPaymentMethodsCtx.payments;
    body["transaction_id"] = transactionId;
    body = JSON.stringify(body);

    logger.log("confirmTransaction::BEGIN", body);

    fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        logger.log("confirmTransaction::END", data);
        alertCtx.show.success("Transaction confirmed");
        clearForNewTransaction();
        callback();
        return data;
      })
      .catch((error) => {
        alertCtx.show.warning("Could not confirm transaction");
        logger.warn("confirmTransaction::ERROR", error);
      });
  }

  function suspendTransaction() {
    if (!titems || !Array.isArray(titems) || titems.length <= 0) {
      alertCtx.show.warning("Add items first");
      return;
    }

    // PREPARE DATA
    let body = {
      titem_staff: titemFormData,
    };
    if (clientId) {
      body["client_id"] = clientId;
    }

    body["transaction_id"] = transactionId;
    body = JSON.stringify(body);
    logger.log("Suspending Transaction", body);

    fetch(`${API_URL}/transactions/suspend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        logger.log("Suspend Transaction::SERVER RESPONSE", data);
        alertCtx.show.success("Transaction suspended");
        clearForNewTransaction();
        return data;
      })
      .catch((error) => {
        alertCtx.show.warning("Could not suspend transaction");
        logger.warn("Suspend Transaction::ERROR", error);
      });
  }

  function loadExistingTransactionItems() {
    logger.log("loadExistingTransactionItems::BEGIN");
    if (!session) {
      return;
    }

    let url = `${API_URL}/transactions/${transactionId}`;

    uiCtx.loaders.actions.increment();
    const startDate = new Date();
    fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const endDate = new Date();
        const seconds = endDate.getTime() - startDate.getTime();
        uiCtx.loaders.actions.decrement();

        if (!response.ok) {
          throw data;
        }

        const data = await response.json();
        logger.log("loadExistingTransactionItems::END", {
          took: seconds,
          ...data,
        });

        setTitems(data.titems);
        if (data.client) {
          setClientId(data.client.id);
        }

        if (data.transaction_payments) {
          paymentMethodCtx.actions.preloadFromDb([
            ...data.transaction_payments,
          ]);
          setClientId(data.client.id);
        }
      })
      .catch((error) => {
        logger.warn("loadExistingTransactionItems::ERROR", { error });
        setTitems(undefined);
      });
  }

  function addTransactionItem(sellableId) {
    let body = { sellable_id: sellableId, transaction_id: transactionId };
    logger.log("addTransactionItem::BEGIN", body);
    body = JSON.stringify(body);

    uiCtx.loaders.actions.increment();
    fetch(`${API_URL}/transactions/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then(async (response) => {
        const data = await response.json();
        uiCtx.loaders.actions.decrement();

        if (!response.ok) {
          throw data;
        }

        logger.log("addTransactionItem::END", data);
        alertCtx.show.success("Added item");
        setTitems(data);
        return data;
      })
      .catch((error) => {
        const message = error.message ?? "Could not add item";
        alertCtx.show.warning(message);
        logger.warn("addTransactionItem::ERROR", error);
      });
  }

  function deleteTransactionItem(titemId) {
    logger.log("deleteTransactionItem::BEGIN", titemId);

    uiCtx.loaders.actions.increment();
    fetch(`${API_URL}/transactions/items/${titemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        logger.log("deleteTransactionItem::END", data);
        uiCtx.loaders.actions.decrement();

        if (!response.ok) {
          throw data;
        }
        alertCtx.show.success("Deleted item");
        setTitems(data);

        // Remove form data for this
        const items = { ...titemFormData };
        delete items[titemId];
        setTitemFormData(items);

        return data;
      })
      .catch((error) => {
        logger.warn("deleteTransactionItem::ERROR", data);
        loadExistingTransactionItems();
      });
  }

  function setTransactionClient(clientId) {
    setClientId(clientId);
  }

  function setTitemStaff(titem, staffId) {
    logger.log(`setTitemStaff: #${staffId} to `, {
      existing: titemFormData,
      titem,
    });

    const updatedItems = { ...titemFormData };
    updatedItems[titem.id] = {
      ...updatedItems[titem.id],
      id: titem.id,
      staff_id: staffId,
    };

    setTitemFormData(updatedItems);
  }

  function setTitemDiscount(titem, discount) {
    logger.log(`setTitemDiscount: ${discount} to `, {
      existing: titemFormData,
      titem,
    });

    const updatedItems = { ...titemFormData };
    updatedItems[titem.id] = {
      ...updatedItems[titem.id],
      id: titem.id,
      discount: discount,
    };

    setTitemFormData(updatedItems);
  }

  function clearForNewTransaction() {
    logger.log("clearForNewTransaction::RESETTING EVERYTHING");
    router.replace("/merchants/transactions/new");
  }

  const context = {
    titems,
    transactionId,
    titemFormData,
    isEditing,
    titemActions: {
      load: loadExistingTransactionItems,
      add: addTransactionItem,
      delete: deleteTransactionItem,
      form: {
        setStaff: setTitemStaff,
        setDiscount: setTitemDiscount,
      },
    },
    transactions: {
      transaction: {
        client_id: clientId,
        payment_method: paymentMethod,
        isPaymentCash: () => paymentMethod === "Cash",
        isPaymentMpesa: () => paymentMethod === "MPesa",
        isPaymentCard: () => paymentMethod === "Card",
        isPaymentCredit: () => paymentMethod === "Credit",
      },
      actions: {
        confirm: confirmTransaction,
        suspend: suspendTransaction,
        setClient: setTransactionClient,
        setPaymentMethod,
      },
    },
  };

  return (
    <TransactionEditingContext.Provider value={context}>
      {props.children}
    </TransactionEditingContext.Provider>
  );
}

export default TransactionEditingContext;
