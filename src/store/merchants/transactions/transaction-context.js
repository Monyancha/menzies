import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getLogger from "../../../lib/shared/logger";
import BottomAlertsContext from "../../shared/bottom-alerts";
import MerchantUiContext from "../../shared/merchant-ui";
import PaymentsContext from "./payments-context";
import TransactionEditingContext from "./transaction-editing-context";
import {
  isSearchTermBarCode,
  resetSellableSearchTerm,
} from "./transaction-slice";

const TransactionContext = createContext({
  titems: () => {},
  titemFormData: () => {},
  sellables: undefined,
  titemActions: {
    load: () => {},
    add: (sellableId) => {},
    delete: (titemId) => {},
    increment: (titemId) => {},
    decrement: (titemId) => {},
    isService: (titem) => {},
    form: {
      validateServices: () => {},
      setStaff: (titem, staffId) => {},
      setDiscount: (titem, discount) => {},
    },
  },
  sellableActions: {
    load: (filter = null, insertOnFound = false) => {},
  },
  transactions: {
    transaction: {
      client_id: undefined,
      payment_method: "Cash",
      getClient: () => {},
      isPaymentCash: () => {},
      isPaymentMpesa: () => {},
      isPaymentCard: () => {},
      isPaymentCredit: () => {},
    },
    returnedTransaction: {
      receipt_address: "http://ilo.test/api/v1/transactions/22952/receipt",
    },
    actions: {
      confirm: () => {},
      suspend: () => {},
      setClient: (clientId) => {},
      setPaymentMethod: (paymentMethod) => {},
      clearForNewTransaction: () => {},
      sendStkPush: (phone, amount) => {},
      selectSellableSearch: () => {},
    },
  },
  views: {
    view: "pos",
    setView: (view) => {},
    showViewPos: () => {},
    showViewPayments: () => {},
    isViewPos: () => {},
    isViewPayments: () => {},
    isViewReceipts: () => {},
  },
});

export function TransactionContextProvider(props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const logger = getLogger("TransactionContext");

  const { data: session } = useSession();
  const [titems, setTitems] = useState(undefined);
  const [titemFormData, setTitemFormData] = useState({});
  const [sellables, setSellables] = useState();
  const [clientId, setClientId] = useState();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [returnedTransaction, setReturnedTransaction] = useState({
    receipt_address: "#",
  });
  const [view, setView] = useState("pos");

  const dispatch = useDispatch();

  // Assume all bar codes have atleast 5 of the last character as numeric
  const isSellableSearchTermBarCode = (term) => {
    if (!term) {
      return false;
    }
    const isNumeric = !isNaN(term.slice(-5)) && term !== "";
    // console.log(`Is ${searchTerm} really numeric`, isNumeric);
    return isNumeric;
  };

  const alertCtx = useContext(BottomAlertsContext);
  const uiCtx = useContext(MerchantUiContext);
  const existingTransactionCtx = useContext(TransactionEditingContext);
  const paymentMethodCtx = useContext(PaymentsContext);

  let sellableSearchInput;
  if (typeof window !== "undefined") {
    sellableSearchInput = document.getElementById("posSellableSearchInput");
  }

  function selectSellableSearch() {
    if (!sellableSearchInput) {
      return;
    }

    console.log("Sellable search");
    sellableSearchInput.select();
  }

  function resetSellableSearch() {
    selectSellableSearch();
    dispatch(resetSellableSearchTerm());
    // loadSellables();
  }

  function loadTransactionItems() {
    selectSellableSearch();
    if (existingTransactionCtx.isEditing()) {
      existingTransactionCtx.titemActions.load();
      return;
    }

    const startDate = new Date();

    logger.log("Loading titems");
    if (!session) {
      return;
    }

    uiCtx.loaders.actions.increment();
    fetch(`${API_URL}/transactions/items?by_me&pending_transaction`, {
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
          logger.log("Error while loading titems", { data });
          return;
        }

        const data = await response.json();
        logger.log("Loaded titems", { took: seconds, ...data });
        setTitems(data);
        selectSellableSearch();
      })
      .catch((error) => {
        setTitems(undefined);
        logger.warn(error);
      });
  }

  function addTransactionItem(sellableId) {
    if (existingTransactionCtx.isEditing()) {
      existingTransactionCtx.titemActions.add(sellableId);
      return;
    }

    let body = { sellable_id: sellableId };
    logger.log("Adding Item", body);
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

        logger.log("Added Item", data);
        alertCtx.show.success("Added item");
        setTitems(data);
        resetSellableSearch();
        return data;
      })
      .catch((error) => {
        alertCtx.show.warning("Could not add item");
        logger.warn("addTransactionItem::ERROR", error);
      });
  }

  function checkResultsForUpc(data, filter) {
    if (!filter) {
      return;
    }
    const productForThisBarCode = data.find(
      (item) => item.metadata.upc === filter
    );

    if (productForThisBarCode) {
      addTransactionItem(productForThisBarCode.id);
    }
  }

  function deleteTransactionItem(titemId) {
    if (existingTransactionCtx.isEditing()) {
      existingTransactionCtx.titemActions.delete(titemId);
      return;
    }

    logger.log("Deleting Item", titemId);

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
        logger.log("Deleted Item", data);
        uiCtx.loaders.actions.decrement();

        if (!response.ok) {
          return;
        }
        alertCtx.show.success("Deleted item");
        setTitems(data);

        // Remove form data for this
        const items = { ...titemFormData };
        delete items[titemId];
        setTitemFormData(items);
        resetSellableSearch();

        return data;
      })
      .catch((error) => {
        logger.warn(error);
        loadTransactionItems();
      });
  }

  function incrementTransactionItem(titemId) {
    logger.log("Incrementing Item", titemId);

    fetch(`${API_URL}/transactions/items/${titemId}/increment`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        logger.log("Incremented Item", data);
        alertCtx.show.success("Quantity increased");
        setTitems(data);
      })
      .catch((error) => {
        logger.warn(error);
      });
  }

  function decrementTransactionItem(titemId) {
    logger.log("Decrementing Item", titemId);

    fetch(`${API_URL}/transactions/items/${titemId}/decrement`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        logger.log("Decremented Item", data);
        alertCtx.show.success("Quantity decreased");
        setTitems(data);
      })
      .catch((error) => {
        logger.warn(error);
      });
  }

  function loadSellables(filter = null, insertOnFound = false) {
    const startDate = new Date();
    uiCtx.loaders.actions.increment();

    logger.log("Loading sellables");
    if (!session) {
      return;
    }

    const url = `${API_URL}/sellables?${
      filter !== null && "filter=" + encodeURIComponent(filter)
    }`;

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

        const data = await response.json();
        if (!response.ok) {
          logger.log("Error while loading sellables", { data });
          return;
        }

        logger.log("Loaded sellables", { took: seconds, ...data.data });
        console.log("Is it a bar code", isSellableSearchTermBarCode(filter));
        if (isSellableSearchTermBarCode(filter)) {
          checkResultsForUpc([...data.data], filter);
        }
        setSellables([...data.data]);
      })
      .catch((error) => {
        logger.warn(error);
      });
  }

  function isService(titem) {
    if (!titem || !titem.sellable) {
      return false;
    }
    return titem.sellable.sellable_type === "App\\Product";
  }

  function setTitemStaff(titem, staffId) {
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.titemActions.form.setStaff(titem, staffId);
    }

    logger.log(`Adding staff: #${staffId} to `, {
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
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.titemActions.form.setDiscount(
        titem,
        discount
      );
    }

    logger.log(`Adding discount: ${discount} to `, {
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

  function setTransactionClient(clientId) {
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.transactions.actions.setClient(clientId);
    }

    setClientId(clientId);
    selectSellableSearch();
  }

  function confirmTransaction() {
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.transactions.actions.confirm(
        showViewReceipts
      );
    }

    // TODO: VALIDATE
    // PREPARE DATA
    let body = {
      titem_staff: titemFormData,
    };
    if (f) {
      body["client_id"] = clientId;
    }

    body["payment_methods"] = paymentMethodCtx.payments;
    body = JSON.stringify(body);

    logger.log("Confirming Transaction", body);

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

        throw "Error!";
        logger.log("Confirm Transaction::SERVER RESPONSE", data);
        setReturnedTransaction({ ...data });

        alertCtx.show.success("Transaction confirmed");
        showViewReceipts();
        // clearForNewTransaction();
        return data;
      })
      .catch((error) => {
        alertCtx.show.warning("Could not confirm transaction");
        logger.warn("Confirm Transaction::ERROR", error);
      });
  }

  function suspendTransaction() {
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.transactions.actions.suspend();
    }

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

  function clearForNewTransaction() {
    logger.log("clearForNewTransaction::RESETTING EVERYTHING");
    loadTransactionItems();
    setTitemFormData(undefined);
    setClientId(undefined);
    setPaymentMethod("Cash");
    setView("pos");
    paymentMethodCtx.actions.clearAllPayments();
  }

  function showViewPayments() {
    const tmp_titems = existingTransactionCtx.isEditing()
      ? existingTransactionCtx.titems
      : titems;
    if (!tmp_titems || !Array.isArray(tmp_titems) || tmp_titems.length <= 0) {
      alertCtx.show.warning("Add items first");
      return;
    }
    setView("payments");
  }

  function showViewReceipts() {
    setView("receipts");
  }

  function getTitems() {
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.titems;
    }

    return titems;
  }

  function getTitemForData() {
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.titemFormData;
    }

    return titemFormData;
  }

  function getClient() {
    if (existingTransactionCtx.isEditing()) {
      return existingTransactionCtx.transactions.transaction.client_id;
    }

    return clientId;
  }

  function sendStkPush(phone, amount) {
    if (!phone) {
      alertCtx.show.warning("Enter the phone number first");
    }

    let body = {};
    body["phone"] = phone;
    body["amount"] = amount;
    body = JSON.stringify(body);

    logger.log("sendStkPush::BEGIN", body);

    uiCtx.loaders.actions.increment();
    fetch(`${API_URL}/transactions/send_stk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then(async (response) => {
        uiCtx.loaders.actions.decrement();
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        logger.log("sendStkPush::END", data);

        alertCtx.show.success("STK Push Sent");
        console.log(data.mpesa_checkout_id);
        paymentMethodCtx.actions.setMpesaPaymentCheckoutId(
          index,
          data.mpesa_checkout_id
        );
      })
      .catch((error) => {
        alertCtx.show.warning("Could not send STK Push");
        logger.warn("sendStkPush::ERROR", error);
      });
  }

  const context = {
    titems: getTitems,
    titemFormData: getTitemForData,
    sellables,
    loadTransactionItems,
    addTransactionItem,
    deleteTransactionItem,
    titemActions: {
      load: loadTransactionItems,
      add: addTransactionItem,
      delete: deleteTransactionItem,
      increment: incrementTransactionItem,
      decrement: decrementTransactionItem,
      isService,
      form: {
        setStaff: setTitemStaff,
        setDiscount: setTitemDiscount,
      },
    },
    sellableActions: {
      load: loadSellables,
    },
    transactions: {
      transaction: {
        client_id: clientId,
        payment_method: paymentMethod,
        getClient,
        isPaymentCash: () => paymentMethod === "Cash",
        isPaymentMpesa: () => paymentMethod === "MPesa",
        isPaymentCard: () => paymentMethod === "Card",
        isPaymentCredit: () => paymentMethod === "Credit",
      },
      returnedTransaction,
      actions: {
        confirm: confirmTransaction,
        suspend: suspendTransaction,
        setClient: setTransactionClient,
        setPaymentMethod,
        clearForNewTransaction,
        sendStkPush,
        selectSellableSearch,
      },
    },
    views: {
      view,
      setView,
      isViewPos: () => view === "pos",
      isViewPayments: () => view === "payments",
      isViewReceipts: () => view === "receipts",
      showViewPos: () => setView("pos"),
      showViewPayments,
      showViewReceipts,
    },
  };

  return (
    <TransactionContext.Provider
      value={context}
      displayName="Transaction Context"
    >
      {props.children}
    </TransactionContext.Provider>
  );
}

export default TransactionContext;
