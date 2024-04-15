import { useSession } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import getLogger from "../../../../lib/shared/logger";
import BottomAlertsContext from "../shared/bottom-alerts";
import MerchantUiContext from "../shared/merchant-ui";

const TransactionListContext = createContext({
  transactions: undefined,
  actions: {
    load: ({
      suspended = false,
      page = null,
      is_credited = false,
      voided = false,
    } = {}) => {},
    void: (transaction_id, password) => {},
  },
});

export function TransactionListContextProvider(props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const logger = getLogger("StaffContext");

  const { data: session } = useSession();
  const [transactions, setTransactions] = useState(undefined);

  const uiCtx = useContext(MerchantUiContext);
  const alertCtx = useContext(BottomAlertsContext);

  function loadTransactions({
    suspended = false,
    page = null,
    is_credited = false,
    voided = false,
    branch_id = null,
  } = {}) {
    const startDate = new Date();

    logger.log("Loading transactions");
    if (!session) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/transactions?`;
    }
    const params = {};

    if (suspended) {
      params["suspended"] = true;
    }

    if (voided) {
      params["voided"] = true;
    }

    if (branch_id) {
      params["branch"] = true;
    }

    if (is_credited) {
      params["is_credited"] = true;
    }
    url += new URLSearchParams(params);

    uiCtx.loaders.actions.increment();
    fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        uiCtx.loaders.actions.decrement();

        if (!response.ok) {
          throw data;
        }

        const endDate = new Date();
        const seconds = endDate.getTime() - startDate.getTime();

        logger.log("Loaded transactions", { took: seconds, data });
        setTransactions(data);
      })
      .catch((error) => {
        logger.warn("Load Transactions::ERROR", error);
      });
  }

  function voidTransaction(transaction_id, password) {
    const params = {};
    params["transaction_id"] = transaction_id;

    let url = `${API_URL}/transactions/${transaction_id}/void`;
    let body = {
      password,
    };
    body = JSON.stringify(body);

    const startDate = new Date();
    uiCtx.loaders.actions.increment();

    fetch(url, {
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

        const endDate = new Date();
        const seconds = endDate.getTime() - startDate.getTime();

        const data = await response.json();

        if (!response.ok) {
          throw data;
        }

        logger.log("voidTransaction::END", {
          took: seconds,
          ...data,
        });

        // TODO:: In the server response add the data

        alertCtx.show.success("Transaction voided successfully");
        loadTransactions();
      })
      .catch((error) => {
        if (error.message) {
          alertCtx.show.warning(error.message);
          return;
        }
        alertCtx.show.warning("Could not void transaction");
        logger.warn("voidTransaction::ERROR", { error });
      });
  }

  const context = {
    transactions,
    actions: {
      load: loadTransactions,
      void: voidTransaction,
    },
  };

  return (
    <TransactionListContext.Provider
      value={context}
      displayName="Transaction List Context"
    >
      {props.children}
    </TransactionListContext.Provider>
  );
}

export default TransactionListContext;
