import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { parseValidFloat } from "../../../lib/shared/data-formatters";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("PosTransactions");
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BETA_API_URL = process?.env?.NEXT_PUBLIC_BETA_API_URL ?? API_URL;

const TRANSACTION_MODE = process.env.NEXT_PUBLIC_TRANSACTION_MODE ?? "async";
const MODE_ASYNC = TRANSACTION_MODE === "async";

const initialState = {
  sellableSearchTerm: "",

  sellablesList: null,
  sellablesListStatus: "idle",

  transactionTableList: null,
  transactionTableStatus: "idle",

  sellableCategoryList: null,
  sellableCategoryStatus: "idle",

  pointConversionDetails: null,
  pointConversionStatus: "idle",

  existingTransaction: null,
  existingTransactionId: null,
  existingTransactionStatus: "idle",

  transactionItems: [],

  view: "pos",
  showCategoryMenu: false,

  payments: [],
  client_id: null,
  membership_id: null,
  selectedClient: null,
  membership_discount: null,
  transactionDate: null,
  discount: null,
  coupon: null,
  redeemed_points: null,
  raw_redeemed_points: null,
  table_id: null,

  clientAwardPoints: null,
  redeem_points_status: false,
  checkClientPointsStatus: "idle",

  checkUnRedeemedPointsStatus: "idle",
  clientUnredeemedPoints: null,

  submissionStatus: "idle",
  submittedTransaction: null,
  submittedSagaId: null,

  suspensionStatus: "idle",
  suspendedTransaction: null,

  isProcessingFullTransaction: false,
  isProcessingSuspendedTransaction: false,

  stkPushStatus: "idle",
  mpesaCheckoutId: null,

  getReminders: null,
  getRemindersStatus: "idle",

  getServiceReminders: null,
  getServiceRemindersStatus: "idle",

  getServiceReminderDetails: null,
  getServiceReminderDetailsStatus: "idle",

  getReminderDetails: null,
  getReminderDetailsStatus: "idle",

  comboSellableList: [],
  comboSellableListStatus: "idle",

  autoTransactionId: null,
  returned_items: [],
};

export const savePosState = debounce((state) => {
  try {
    logger.info("Caching POS", { state });

    const posState = JSON.stringify(state);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("redux_cache_pos", posState);
    }
  } catch (e) {
    logger.warn("Could not cache POS", { error: e });
  }
}, 2000);

const loadPosState = () => {
  let state = initialState;
  try {
    logger.info("Loading POS", { state });
    let loadedState = null;
    if (typeof window !== "undefined") {
      loadedState = window.localStorage.getItem("redux_cache_pos");
    }
    if (loadedState) {
      state = JSON.parse(loadedState);
    }
  } catch (e) {
    logger.warn("Could not cache POS", { error: e });
  }

  return state;
};

let sellableSearchInput;
if (typeof window !== "undefined") {
  sellableSearchInput = document.getElementById("posSellableSearchInput");
}

function selectSellableSearch() {
  if (!sellableSearchInput) {
    return;
  }

  sellableSearchInput.select();
}

export function isTransactionItemAService(titem) {
  if (!titem || !titem.sellable) {
    return false;
  }
  return titem.sellable.sellable_type === "App\\Product";
}

export function isTransactionItemAProduct(titem) {
  if (!titem || !titem.sellable) {
    return false;
  }
  return titem.sellable.sellable_type === "App\\ProductInventory";
}

export function isTransactionItemAMenuItem(titem) {
  if (!titem || !titem.sellable) {
    return false;
  }
  return titem.sellable.sellable_type === "App\\Models\\Restaurant\\MenuItem";
}

export function isTransactionItemACombo(titem) {
  if (!titem || !titem.sellable) {
    return false;
  }
  if (titem?.sellable?.sellable?.max_count === null) {
    return false;
  }
  return (
    titem.sellable.sellable_type === "App\\Models\\Sellables\\ComboSellable"
  );
}

export const sendTransactionNotification = createAsyncThunk(
  "posTransaction/sendTransactionNotification",
  async ({
    accessToken = null,
    transactionId = null,
    sendSms = null,
    sendEmail = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken || !transactionId) {
      return;
    }

    let url =
      (url = `${API_URL}/transactions/${transactionId}/send_transaction_notification?`);

    const params = {};
    if (sendSms) {
      params["send_sms"] = encodeURIComponent(sendSms);
    }
    if (sendEmail) {
      params["send_email"] = encodeURIComponent(sendEmail);
    }
    if (branch_id) {
      params["branch_id"] = encodeURIComponent(branch_id);
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("sendTransactionNotification::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("sendTransactionNotification::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const sendStkPush = createAsyncThunk(
  "posTransaction/sendStkPush",
  async ({ accessToken = null, phone = null, amount = null } = {}) => {
    if (!accessToken || !phone || !amount) {
      return;
    }

    const url = `${API_URL}/transactions/send_stk`;

    let body = { phone, amount };
    tr;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("sendStkPush::BEGIN");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("sendStkPush::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPointsTemplate = createAsyncThunk(
  "transactions/fetchPointsTemplate",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transaction/conversion_template?`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPointsTemplate::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPointsTemplate::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getReminders = createAsyncThunk(
  "transactions/getReminders",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/transaction/reminder?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getReminders::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getReminders::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServiceReminderDetails = createAsyncThunk(
  "transactions/getServiceReminderDetails",
  async ({ page = null, accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/service/reminder/${itemId}`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServiceReminderDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServiceReminderDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getReminderDetails = createAsyncThunk(
  "transactions/getReminderDetails",
  async ({ page = null, accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/transaction/reminder/${itemId}`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getReminderDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getReminderDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServiceReminders = createAsyncThunk(
  "transactions/getServiceReminders",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/service/reminder?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServiceReminders::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServiceReminders::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSellableComboItems = createAsyncThunk(
  "posTransaction/fetchSellableComboItems",
  async ({ id = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    url = `${API_URL}/transaction/get-sellable-combo-items/${id}`;

    const startTime = new Date();
    logger.log("fetchSellableComboItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSellableComboItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSellables = createAsyncThunk(
  "posTransaction/fetchSellables",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    category_id,
    sub_category_id,
    branch_id = null,
    per_page = 10,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/sellables?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = encodeURIComponent(filter);
    }
    if (category_id) {
      params["category_id"] = encodeURIComponent(category_id);
    }
    if (sub_category_id) {
      params["sub_category_id"] = encodeURIComponent(sub_category_id);
    }
    params["per_page"] = encodeURIComponent(per_page);

    params["branch_id"] = encodeURIComponent(branch_id);

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchSellables::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSellables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSellableCategories = createAsyncThunk(
  "posTransaction/fetchSellableCategories",
  async ({
    page = null,
    accessToken = null,
    pageCount = null,
    caller = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/sellable-categories?`;
    }

    const params = {};
    if (pageCount) {
      params["page_count"] = pageCount;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log(`fetchSellableCategories::BEGIN::${caller ?? "NONE"}`);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSellableCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchTransactionTables = createAsyncThunk(
  "posTransaction/fetchTransactionTables",
  async ({ page = null, accessToken = null, branch_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/restaurant-tables?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchTransactionTables::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchTransactionTables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchExistingTransaction = createAsyncThunk(
  "posTransaction/fetchExistingTransaction",
  async ({
    accessToken = null,
    transactionId = null,
    is_returned = null,
  } = {}) => {
    if (!accessToken || !transactionId) {
      return;
    }

    let url = `${API_URL}/transactions/${transactionId}?`;
    const params = {};
    if (is_returned) {
      params["is_returned"] = is_returned;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingTransaction::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingTransaction:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitTransaction = createAsyncThunk(
  "posTransaction/submitTransaction",
  async ({
    accessToken = null,
    transactionData = null,
    branch_id = null,
    template_two_points = null,
    membership_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${BETA_API_URL}/transactions`;
    if (!MODE_ASYNC) {
      url = `${BETA_API_URL}/transactions-sync`;
    }

    let body = {};
    body["client_id"] = transactionData.client_id;
    body["room_id"] = transactionData.room_id;
    body["table_id"] = transactionData.table_id;
    body["branch_id"] = branch_id;
    body["membership_id"] = transactionData.membership_id;

    if (transactionData.existingTransactionId) {
      body["transaction_id"] = transactionData.existingTransactionId;
    }
    if (transactionData.transactionDate) {
      body["trans_date"] = transactionData.transactionDate;
    }
    if (transactionData.discount) {
      body["discount"] = transactionData.discount;
    }
    if (transactionData.existingTransaction?.uuid) {
      body["uuid"] = transactionData.existingTransaction.uuid;
    }

    body["payment_methods"] = transactionData.payments;
    body["transaction_items"] = transactionData.transactionItems.map((item) => {
      const this_item = {
        product_id: item.sellable.id,
        type: item.sellable.sellable_type,
        quantity: item.quantity,
        discount: item.discount,
        staff_id: item.staff_id,
        room_id: transactionData.room_id,
        cost: item.cost ?? item.sellable?.sellable?.cost ?? 0,
        staff_list: item.staff_list ?? [],
        combo_items: item.combo_items ?? [],
        accomp_items: item.accomp_items ?? [],
        gift_card_codes: item?.gift_card_codes?.map((gc) => gc.id) ?? [],
        max_count: item?.sellable?.sellable?.max_count,
        order_type: item?.order_type,
        note: item?.note,
        previous_titem_id: item?.previous_titem_id ?? null,
        membership_cost: item?.membership_cost ?? null,
        referenceable_id: item?.referenceable_id,
        referenceable_type: item?.referenceable_type,
      };

      if (!isNaN(item.id)) {
        this_item["id"] = item.id;
      }
      return this_item;
    });

    if (transactionData.raw_redeemed_points) {
      body["raw_redeemed_points"] = transactionData.raw_redeemed_points;
    }
    if (transactionData.redeemed_points) {
      body["redeemed_points"] = transactionData.redeemed_points;
    }
    if (transactionData.autoTransactionId) {
      body["auto_transaction_id"] = transactionData.autoTransactionId;
    }

    if (template_two_points) {
      body["template_two_points"] = template_two_points;
    }

    let grand_total = transactionData.transactionItems.reduce(
      (partialSum, item) => partialSum + item.sub_total,
      0
    );
    body["cost"] = grand_total;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitTransaction::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("submitTransaction::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const dispatchTransaction = createAsyncThunk(
  "posTransaction/dispatchTransaction",
  async ({ accessToken = null, sagaId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transaction-dispatcher`;

    let body = {};
    body["saga_id"] = sagaId;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("dispatchTransaction::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("dispatchTransaction::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const checkUnRedeemedPoints = createAsyncThunk(
  "posTransaction/checkUnRedeemedPoints",
  async ({ accessToken = null, client_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/partners/check-unredeemed-points/${client_id}`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("checkUnRedeemedPoints::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("checkUnRedeemedPoints::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const checkClientPoints = createAsyncThunk(
  "posTransaction/checkClientPoints",
  async ({ accessToken = null, client_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/partners/check-client-points/${client_id}`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("checkClientPoints::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("checkClientPoints::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const suspendTransaction = createAsyncThunk(
  "posTransaction/supsendTransaction",
  async ({
    accessToken = null,
    transactionData = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${BETA_API_URL}/transactions/suspend`;
    if (!MODE_ASYNC) {
      url = `${BETA_API_URL}/transactions-sync/suspend`;
    }

    let body = {};
    body["client_id"] = transactionData.client_id;
    body["room_id"] = transactionData.room_id;
    body["table_id"] = transactionData.table_id;
    body["payment_methods"] = transactionData.payments;
    body["branch_id"] = branch_id;
    if (transactionData.existingTransactionId) {
      body["transaction_id"] = transactionData.existingTransactionId;
    }
    if (transactionData.transactionDate) {
      body["trans_date"] = transactionData.transactionDate;
    }
    if (transactionData.discount) {
      body["discount"] = transactionData.discount;
    }
    if (transactionData.autoTransactionId) {
      body["auto_transaction_id"] = transactionData.autoTransactionId;
    }
    if (transactionData.existingTransaction?.uuid) {
      body["uuid"] = transactionData.existingTransaction.uuid;
    }

    body["transaction_items"] = transactionData.transactionItems.map((item) => {
      console.log(item);
      const this_item = {
        id: isNaN(item.id) ? null : item.id,
        product_id: item.sellable.id,
        type: item.sellable.sellable_type,
        quantity: item.quantity,
        discount: item.discount,
        staff_id: item.staff_id,
        room_id: transactionData.room_id,
        cost: item.cost ?? item.sellable?.sellable?.cost ?? 0,
        staff_list: item.staff_list ?? [],
        combo_items: item.combo_items,
        accomp_items: item.accomp_items ?? [],
        max_count: item?.sellable?.sellable?.max_count,
        order_type: item?.order_type ?? null,
        note: item?.note ?? null,
        previous_titem_id: item?.previous_titem_id ?? null,
        membership_cost: item?.membership_cost ?? null,
      };
      return this_item;
    });

    let grand_total = transactionData.transactionItems.reduce(
      (partialSum, item) => partialSum + item.sub_total,
      0
    );

    body["cost"] = grand_total;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("supsendTransaction::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("supsendTransaction::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const posTransactionSlice = createSlice({
  name: "posTransaction",
  initialState: loadPosState(),
  reducers: {
    //
    //
    setProcessFullTransaction(state, action) {
      state.isProcessingFullTransaction = action.payload;
    },
    setProcessingSuspendedTransaction(state, action) {
      state.isProcessingSuspendedTransaction = action.payload;
    },
    //
    //
    showViewPos(state) {
      state.view = "pos";
    },
    showViewPayments(state) {
      state.view = "payments";
    },
    showViewReceipts(state) {
      state.view = "receipts";
    },
    showViewTables(state) {
      state.view = "tables";
    },
    //
    //
    toggleCategoryMenu(state, action) {
      const show = action?.payload?.show ?? !state.showCategoryMenu;
      state.showCategoryMenu = show;
    },
    //
    //
    addCashPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "cash",
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addCardPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "card",
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addMpesaPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "mpesa",
        amount: 0,
        phone: "",
        transaction_code: "",
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addOtherPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "other",
        name: null,
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addBankPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "other",
        name: "bank",
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addChequePayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "other",
        name: "cheque",
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addMembershipPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "membership",
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },

    removePayment(state, action) {
      const { itemId } = action.payload;
      if (!itemId) {
        return;
      }

      const remaining = state.payments.filter((item) => item.id !== itemId);

      state.payments = remaining;
    },
    setPaymentAmount(state, action) {
      const { itemId, amount } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.amount = parseValidFloat(amount);
    },
    setMpesaPaymentPhone(state, action) {
      const { itemId, phone } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.phone = phone;
    },
    setMpesaPaymentCode(state, action) {
      const { itemId, code } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.transaction_code = code;
    },
    setOtherPaymentName(state, action) {
      const { itemId, name } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.name = name;
    },
    setPaymentReferenceNo(state, action) {
      const { itemId, referenceNo } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.reference_no = referenceNo;
    },

    //
    //
    sellableSearchTermUpdated(state, action) {
      state.sellableSearchTerm = action.payload;
    },
    resetSellableSearchTerm(state) {
      state.sellableSearchTerm = "1";
      selectSellableSearch();
    },
    //
    //

    clearPoints(state) {
      state.clientAwardPoints = null;
    },
    clearPointsR(state) {
      state.clientUnredeemedPoints = null;
    },
    redeemPoints(state) {
      state.redeem_points_status = true;
    },
    resetRedeemPoints(state) {
      state.redeem_points_status = false;
    },
    setClient(state, action) {
      const { client_id } = action.payload;
      state.client_id = client_id;
    },
    setRoomId(state, action) {
      const { room_id } = action.payload;
      state.room_id = room_id;
    },
    setMembership(state, action) {
      const { membership_id } = action.payload;
      state.membership_id = membership_id;
      console.log(state.membership_id);
    },
    setSelectedClient(state, action) {
      const { client } = action.payload;
      state.selectedClient = client;
    },
    setPercentageDiscount(state, action) {
      const { percentage_discount } = action.payload;
      state.percentage_discount = percentage_discount;
      console.log(state.percentage_discount);
    },
    clearClient(state) {
      state.client_id = null;
      state.selectedClient = null;
      state.clientAwardPoints = null;
      state.clientUnredeemedPoints = null;
    },
    setTable(state, action) {
      const { table_id } = action.payload;
      state.table_id = table_id;
    },

    //
    addTransactionItem(state, action) {
      const sellableId = action.payload;

      if (!state.sellablesList) {
        return;
      }

      const sellable = state.sellablesList.data.find(
        (item) => item.id === sellableId
      );

      // const membership_percentage_discount = state.percentage_discount;
      // console.log("the membership discount is " + membership_discount);
      if (!sellable) {
        return;
      }

      const existingTitem = state.transactionItems.find(
        (item) =>
          item.sellable.sellable_type !== "App\\Product" &&
          item.sellable.id === sellable.id
      );

      // const mb_disc = membership_percentage_discount ?  parseFloat(membership_percentage_discount)/100 : 0

      // const membership_discount = parseFloat(sellable.sellable.cost) * mb_disc;

      const cost = parseFloat(sellable.sellable.cost);

      if (existingTitem) {
        const quantity = (existingTitem?.quantity ?? 0) + 1;
        const discount = existingTitem?.discount ?? 0;

        existingTitem["quantity"] = quantity;
        existingTitem["discount"] = discount;
        existingTitem["sub_total"] = cost * quantity - discount;
      } else {
        const quantity = 1;
        const discount = 0;

        const titem = {
          id: crypto.randomUUID(),
          sellable,
          client_id: null,
          staff_id: null,
          quantity,
          discount,
          cost,
          sub_total: cost * quantity - discount,
          combo_items: [],
          accomp_items: [],
          order_type: null,
          note: null,
          previous_titem_id: null,
          membership_cost: null,
        };

        state.transactionItems.push(titem);
      }
    },
    addTransactionItemRaw(state, action) {
      const {
        sellable,
        cost,
        quantity,
        discount,
        staff_id,
        previous_titem_id,
      } = action.payload;

      if (!sellable) {
        return;
      }

      cost = parseFloat(cost);
      quantity = parseFloat(quantity);
      discount = parseFloat(discount);

      const titem = {
        id: action.payload.id ?? crypto.randomUUID(),
        sellable,
        client_id: null,
        staff_id: staff_id ?? null,
        quantity,
        discount,
        cost,
        sub_total: cost * quantity - discount,
        combo_items: [],
        accomp_items: [],
        order_type: null,
        note: null,
        previous_titem_id: previous_titem_id,
        membership_cost: null,
        referenceable_id: action.payload?.referenceable_id,
        referenceable_type: action.payload?.referenceable_type,
      };

      state.transactionItems.push(titem);
    },

    // add Gift Voucher to current transaction
    addTransactionGiftCardItem(state, action) {
      const gift_card = action.payload;
      const { sellable, gift_card_code } = gift_card;

      if (!sellable) {
        return;
      }

      const cost = parseFloat(sellable.sellable.cost);

      const quantity = gift_card_code?.length ?? 1;
      const discount = 0;
      const titem = {
        id: crypto.randomUUID(),
        sellable,
        client_id: null,
        staff_id: null,
        quantity,
        discount,
        cost,
        sub_total: cost * quantity - discount,
        combo_items: [],
        accomp_items: [],
        gift_card_codes: [...gift_card_code],
        order_type: null,
        note: null,
        previous_titem_id: null,
        membership_cost: null,
      };

      // To prevent duplicates
      const remainingItems = state.transactionItems.filter(
        (item) => item.sellable.id !== sellable.id
      );
      state.transactionItems = remainingItems;

      state.transactionItems.push(titem);
    },

    //addVoucherItem to Transaction items
    addVoucherItem(state, action) {
      const sellableVoucher = action.payload;

      if (!sellableVoucher) {
        return;
      }

      const sellable = sellableVoucher;

      const cost = parseFloat(sellable?.gift_card?.discount);
      const quantity = 1;
      const discount = 0;

      const clientId = null;

      const staffId = null;
      const titem = {
        id: crypto.randomUUID(),
        sellable,
        client_id: clientId,
        staff_id: staffId,
        quantity,
        discount,
        cost,
        sub_total: cost * quantity - discount,
        staff_list: [],
        combo_items: [],
        accomp_items: [],
        max_count: null,
        order_type: null,
        note: null,
        previous_titem_id: null,
        membership_cost: null,
      };

      state.client_id = clientId;
      state.selectedClient = null;
      state.transactionItems.push(titem);
    },

    // Add Redirected for Booking items
    addRedirectItem(state, action) {
      const sellableBooking = action.payload;

      if (!sellableBooking) {
        return;
      }

      const sellable = sellableBooking?.service?.sellable;

      console.log("Sellable Slice Enock", sellableBooking);

      const cost = parseFloat(sellable?.sellable?.cost);
      const quantity = 1;
      const discount = 0;

      const clientId = sellableBooking?.user_id;

      const staffId = sellableBooking?.staff_id;
      const titem = {
        id: crypto.randomUUID(),
        sellable,
        client_id: clientId,
        staff_id: staffId,
        quantity,
        discount,
        cost,
        sub_total: cost * quantity - discount,
        staff_list: [],
        combo_items: [],
        accomp_items: [],
        max_count: null,
        order_type: null,
        note: null,
        previous_titem_id: null,
        membership_cost: null,
      };

      state.client_id = clientId;
      state.selectedClient = sellableBooking?.contact ?? null;
      state.transactionItems.push(titem);
    },

    // Add Redirected Transaction items
    addOrderRedirectItem(state, action) {
      const sellableOrder = action.payload;

      if (!sellableOrder || !sellableOrder.cart_items) {
        return;
      }

      const deliveryFee = sellableOrder.delivery_fee;
      const clientId = sellableOrder.user_id;
      const staffId = sellableOrder.staff_id;

      // Initialize an array to store the transaction items
      const transactionItems = [];

      sellableOrder.cart_items.forEach((cartItem) => {
        const sellable = cartItem.sellable;
        const cost = parseFloat(sellable.sellable.cost);
        const quantity = cartItem.quantity || 1; // Use 1 if quantity is not available
        const discount = 0;

        const titem = {
          id: crypto.randomUUID(),
          sellable,
          client_id: clientId,
          staff_id: staffId,
          quantity,
          delivery_fee: deliveryFee,
          discount,
          cost,
          sub_total: cost * quantity - discount,
          staff_list: [],
          combo_items: [],
          accomp_items: [],
          max_count: null,
          order_type: null,
          note: null,
          previous_titem_id: null,
          membership_cost: null,
        };

        transactionItems.push(titem);
      });

      state.client_id = clientId;
      state.selectedClient = sellableOrder.client ?? null;

      // Append all transaction items to the state
      state.transactionItems = state.transactionItems.concat(transactionItems);
    },

    // Add Redirected Transaction items
    // addOrderRedirectItem(state, action) {
    //   const sellableOrder = action.payload;

    //   if (!sellableOrder) {
    //     return;
    //   }

    //   const sellable = sellableOrder?.cart_items[0]?.sellable;

    //   console.log("Sellable Slice Enock", sellableOrder);

    //   const cost = parseFloat(sellable?.sellable?.cost);
    //   const quantity = 1;
    //   const discount = 0;
    //   const deliveryFee = sellableOrder?.delivery_fee;

    //   const clientId = sellableOrder?.user_id;

    //   const staffId = sellableOrder?.staff_id;
    //   const titem = {
    //     id: crypto.randomUUID(),
    //     sellable,
    //     client_id: clientId,
    //     staff_id: staffId,
    //     quantity,
    //     delivery_fee: deliveryFee,
    //     discount,
    //     cost,
    //     sub_total: cost * quantity - discount,
    //     staff_list: [],
    //     combo_items: [],
    //     accomp_items: [],
    //     max_count: null,
    //     order_type: null,
    //     previous_titem_id: null,
    //   };

    //   state.client_id = clientId;
    //   state.selectedClient = sellableOrder?.client ?? null;
    //   state.transactionItems.push(titem);
    // },

    setTransactionItemStaff(state, action) {
      const { itemId, staffId } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );
      if (!transactionItem) {
        return;
      }

      transactionItem.staff_id = staffId;
    },

    setTransactionComboItems(state, action) {
      const { itemId, item_ids } = action.payload;

      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem.combo_items = item_ids;
    },

    setTransactionAccompItems(state, action) {
      const { itemId, item_ids } = action.payload;
      console.log("The item id is " + itemId);

      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem?.accomp_items?.push(item_ids);
      console.log("The new transaction item " + transactionItem?.accomp_items);
    },

    toggleTransactionItemAccomp(state, action) {
      const { itemId, accompId } = action.payload;

      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem.accomp_items ??= [];

      // Remove it if it exists
      const exists =
        transactionItem?.accomp_items?.findIndex(
          (mItem) => mItem[0] === accompId
        ) !== -1;
      if (exists) {
        const remaining =
          transactionItem?.accomp_items?.filter(
            (mItem) => mItem[0] !== accompId
          ) ?? [];
        transactionItem.accomp_items = remaining;
      } else {
        transactionItem.accomp_items?.push([accompId]);
      }
    },

    setTransactionItemQuantity(state, action) {
      let { itemId, quantity } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      quantity = parseValidFloat(quantity);

      transactionItem.quantity = quantity <= 0 ? 1 : quantity;

      const cost = parseFloat(transactionItem.cost);
      transactionItem.sub_total =
        cost * transactionItem.quantity - transactionItem.discount;
    },
    setTransactionItemDiscount(state, action) {
      const { itemId, discount } = action.payload;

      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        console.log("Transaction Item Not Found");
        return;
      }

      transactionItem.discount = parseValidFloat(discount);

      const cost = parseFloat(transactionItem.cost);
      transactionItem.sub_total =
        cost * transactionItem.quantity - transactionItem.discount;
    },
    setTransactionItemCost(state, action) {
      const { itemId, cost } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem.cost = parseValidFloat(cost);

      transactionItem.sub_total =
        cost * transactionItem.quantity - transactionItem.discount;
    },
    setTransactionMembershipItemCost(state, action) {
      const { itemId, discount } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      let qty = transactionItem.quantity;

      let total_discount = discount * qty;
      let cost = transactionItem.cost;

      cost = parseValidFloat(cost);

      transactionItem.membership_cost = cost * qty - total_discount;
    },
    setTransactionItemOrderType(state, action) {
      const { itemId, order_type } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem.order_type = order_type;
    },
    setTransactionItemNote(state, action) {
      const { itemId, note } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem.note = note;
    },
    removeTransactionItem(state, action) {
      const { itemId } = action.payload;
      if (!itemId) {
        return;
      }

      const remainingItems = state.transactionItems.filter(
        (item) => item.id !== itemId
      );

      state.transactionItems = remainingItems;
    },
    //
    addTransactionMultipleStaff(state, action) {
      const { itemId, staffId, commission, staffList, commissionType } =
        action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );
      if (!transactionItem) {
        return;
      }

      const staff_name =
        staffList?.find((item) => item.id == staffId)?.name ?? staffId;

      transactionItem.staff_list = transactionItem.staff_list ?? [];

      // =======================================================================
      // Commission Types
      // =======================================================================
      if (commissionType === "service_rate") {
        // The total count of staff increases by one
        const staffCount = transactionItem.staff_list.length + 1;

        // Get service rate
        let serviceRate = transactionItem?.sellable?.sellable?.commission ?? 0;
        serviceRate = parseValidFloat(serviceRate);

        // Compute commission total * rate% / staffCount
        const serviceTotal = transactionItem?.sub_total ?? 0;
        commission = (serviceTotal * (serviceRate / 100)) / staffCount;
        commission = commission.toFixed(2);

        // Update the previous commissions under this item
        transactionItem.staff_list.forEach((staffItem) => {
          staffItem.commission = commission;
          staffItem.commission_type = commissionType;
        });
      }

      if (commissionType === "split_percentage") {
        // Get service rate
        let serviceRate = transactionItem?.sellable?.sellable?.commission ?? 0;
        serviceRate = parseValidFloat(serviceRate);

        // Compute service commission total * rate% / staffCount
        const serviceTotal = transactionItem?.sub_total ?? 0;
        const serviceCommission = serviceTotal * (serviceRate / 100);
        commission = serviceCommission * (commission / 100);
        commission = commission.toFixed(2);

        // Update the previous commissions under this item
        transactionItem.staff_list.forEach((staffItem) => {
          staffItem.commission_type = commissionType;
        });
      }

      if (commissionType === "amount") {
        // Update the previous commissions under this item
        transactionItem.staff_list.forEach((staffItem) => {
          staffItem.commission_type = commissionType;
        });
      }
      // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

      const item = {
        id: crypto.randomUUID(),
        staff_id: staffId,
        staff_name,
        commission,
        commission_type: commissionType,
      };

      transactionItem.staff_list.push(item);
    },
    //
    removeTransactionMultipleStaff(state, action) {
      const { itemId, staffListId } = action.payload;
      if (!itemId || !staffListId) {
        return;
      }

      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      const remainingStaff = transactionItem?.staff_list?.filter(
        (item) => item.id != staffListId
      );

      const removedStaff = transactionItem?.staff_list?.find(
        (item) => item.id != staffListId
      );

      if (removedStaff?.commission_type === "service_rate") {
        const commissionType = "service_rate";
        const staffCount = remainingStaff.length;

        // Get service rate
        let serviceRate = transactionItem?.sellable?.sellable?.commission ?? 0;
        serviceRate = parseValidFloat(serviceRate);

        // Compute commission total * rate% / staffCount
        const serviceTotal = transactionItem?.sub_total ?? 0;
        let commission = (serviceTotal * (serviceRate / 100)) / staffCount;
        commission = commission.toFixed(2);

        // Update the remaining commissions under this item
        remainingStaff.forEach((staffItem) => {
          staffItem.commission = commission;
          staffItem.commission_type = commissionType;
        });
      }

      transactionItem.staff_list = remainingStaff;
    },
    //
    //
    setExistingTransactionId(state, action) {
      const { transactionId } = action.payload;
      state.existingTransactionId = transactionId;
    },
    //
    //
    setSubmittedTransaction(state, action) {
      state.submittedSagaId = null;
      state.submittedTransaction = action.payload;
    },
    //
    //
    clearSubmittedTransaction(state) {
      state.existingTransaction = null;
      state.existingTransactionId = null;
      state.existingTransactionStatus = "idle";

      state.submittedTransaction = null;
      state.suspendedTransaction = null;
      state.view = "pos";
      state.showCategoryMenu = false;
    },
    //
    //
    setTransactionDate(state, action) {
      const { transactionDate } = action.payload;
      state.transactionDate = transactionDate == "" ? null : transactionDate;
    },
    setDiscount(state, action) {
      const { discount } = action.payload;
      state.discount = parseValidFloat(discount);
    },
    //

    setCoupon(state, action) {
      const { coupon } = action.payload;
      state.coupon = parseValidFloat(coupon);
    },
    //
    setRedeemedPoints(state, action) {
      let { points, redemption_rate } = action.payload;
      points = parseValidFloat(points);
      redemption_rate = parseValidFloat(redemption_rate);
      redemption_rate = redemption_rate <= 0 ? 1 : redemption_rate;

      state.raw_redeemed_points = points;
      state.redeemed_points = points / redemption_rate;
    },
    //

    setAutoTransactionId(state, action) {
      let { autoTransactionId } = action.payload;
      state.autoTransactionId = autoTransactionId;
    },
    setReturnItem(state, action) {
      const { return_item } = action.payload;
      let spread_items = [...state.returned_items];
      if (spread_items?.some((el) => el === return_item)) {
        console.log("Item Already Added");
        console.dir(state.returned_items);
        return;
      } else {
        console.log("ID NOT" + return_item);
        spread_items.push(return_item);
        state.returned_items = spread_items;
        console.log(state?.returned_items);
      }
    },
    //
    resetTransactionState(state) {
      state.sellableSearchTerm = "";

      state.sellablesList = null;
      state.sellablesListStatus = "idle";

      state.transactionTableList = null;
      state.transactionTableStatus = "idle";

      state.pointConversionDetails = null;
      state.pointConversionStatus = "idle";

      state.sellableCategoryList = null;
      state.sellableCategoryStatus = "idle";

      state.transactionItems = [];

      state.payments = [];
      state.client_id = null;
      state.selectedClient = null;
      state.transactionDate = null;
      state.redeemed_points = null;
      state.raw_redeemed_points = null;
      state.discount = null;
      state.table_id = null;

      state.submissionStatus = "idle";
      state.submittedSagaId = null;

      state.suspensionStatus = "idle";
      state.stkPushStatus = "idle";
      state.mpesaCheckoutId = null;

      state.existingTransaction = null;
      state.existingTransactionId = null;
      state.existingTransactionStatus = "idle";

      state.autoTransactionId = null;
      state.returned_items = [];
      state.percentage_discount = null;
    },

    //
    clearExistingTransaction(state) {
      state.existingTransaction = null;
      state.existingTransactionId = null;
      state.existingTransactionStatus = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSellables.pending, (state) => {
        state.sellablesListStatus = "loading";
      })
      .addCase(fetchSellables.rejected, (state, action) => {
        state.sellablesListStatus = "rejected";
        logger.log("fetchSellables::REJECTED", action.error);
      })
      .addCase(fetchSellables.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSellables::FULFILLED", { payload });

        state.sellablesListStatus = "fulfilled";
        state.sellablesList = action.payload;
      });
    //
    builder
      .addCase(sendStkPush.pending, (state) => {
        state.stkPushStatus = "loading";
      })
      .addCase(sendStkPush.rejected, (state, action) => {
        state.stkPushStatus = "rejected";
        logger.log("sendStkPush::REJECTED", action.error);
      })
      .addCase(sendStkPush.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("sendStkPush::FULFILLED", { payload });

        state.mpesaCheckoutId = payload.mpesa_checkout_id;

        state.stkPushStatus = "fulfilled";
      })
      //
      .addCase(fetchTransactionTables.pending, (state) => {
        state.transactionTableStatus = "loading";
      })
      .addCase(fetchTransactionTables.rejected, (state, action) => {
        state.transactionTableStatus = "rejected";
        logger.log("fetchTransactionTables::REJECTED", action.error);
      })
      .addCase(fetchTransactionTables.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchTransactionTables::FULFILLED", { payload });

        state.transactionTableStatus = "fulfilled";
        state.transactionTableList = action.payload;
      })
      //

      //getReminders
      .addCase(getReminders.pending, (state) => {
        state.getRemindersStatus = "loading";
      })
      .addCase(getReminders.rejected, (state, action) => {
        state.getRemindersStatus = "rejected";
        logger.log("getReminders::REJECTED", action.error);
      })
      .addCase(getReminders.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getReminders::FULFILLED", { payload });

        state.getRemindersStatus = "fulfilled";
        state.getReminders = action.payload;
      })

      //Sellable Combo Items
      .addCase(fetchSellableComboItems.pending, (state) => {
        state.comboSellableListStatus = "loading";
      })
      .addCase(fetchSellableComboItems.rejected, (state, action) => {
        state.comboSellableListStatus = "rejected";
        logger.log("fetchSellableComboItems::REJECTED", action.error);
      })
      .addCase(fetchSellableComboItems.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSellableComboItems::FULFILLED", { payload });

        // const new_vals = [...state.comboSellableList, ...action.payload];
        state.comboSellableList = action.payload;
        state.comboSellableListStatus = "fulfilled";
      })

      //getServiceReminders
      .addCase(getServiceReminders.pending, (state) => {
        state.getServiceRemindersStatus = "loading";
      })
      .addCase(getServiceReminders.rejected, (state, action) => {
        state.getServiceRemindersStatus = "rejected";
        logger.log("getServiceReminders::REJECTED", action.error);
      })
      .addCase(getServiceReminders.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getServiceReminders::FULFILLED", { payload });

        state.getServiceRemindersStatus = "fulfilled";
        state.getServiceReminders = action.payload;
      })

      //getServiceReminderDetails
      .addCase(getServiceReminderDetails.pending, (state) => {
        state.getServiceReminderDetailsStatus = "loading";
      })
      .addCase(getServiceReminderDetails.rejected, (state, action) => {
        state.getServiceReminderDetailsStatus = "rejected";
        logger.log("getServiceReminderDetails::REJECTED", action.error);
      })
      .addCase(getServiceReminderDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getServiceReminderDetails::FULFILLED", { payload });

        state.getServiceReminderDetailsStatus = "fulfilled";
        state.getServiceReminderDetails = action.payload;
      })

      //check client points
      .addCase(checkClientPoints.pending, (state) => {
        state.checkClientPointsStatus = "loading";
      })
      .addCase(checkClientPoints.rejected, (state, action) => {
        state.checkClientPointsStatus = "rejected";
        logger.log("checkClientPoints::REJECTED", action.error);
      })
      .addCase(checkClientPoints.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("checkClientPoints::FULFILLED", { payload });

        state.checkClientPointsStatus = "fulfilled";
        state.clientAwardPoints = action.payload;
      })

      //check  unredeemed client points
      .addCase(checkUnRedeemedPoints.pending, (state) => {
        state.checkUnRedeemedPointsStatus = "loading";
      })
      .addCase(checkUnRedeemedPoints.rejected, (state, action) => {
        state.checkUnRedeemedPointsStatus = "rejected";
        logger.log("checkUnRedeemedPoints::REJECTED", action.error);
      })
      .addCase(checkUnRedeemedPoints.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("checkUnRedeemedPoints::FULFILLED", { payload });

        state.checkUnRedeemedPointsStatus = "fulfilled";
        state.clientUnredeemedPoints = action.payload;
      })

      //getReminderDetails

      .addCase(getReminderDetails.pending, (state) => {
        state.getReminderDetailsStatus = "loading";
      })
      .addCase(getReminderDetails.rejected, (state, action) => {
        state.getReminderDetailsStatus = "rejected";
        logger.log("getReminderDetails::REJECTED", action.error);
      })
      .addCase(getReminderDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getReminderDetails::FULFILLED", { payload });

        state.getReminderDetailsStatus = "fulfilled";
        state.getReminderDetails = action.payload;
      })

      //
      .addCase(fetchSellableCategories.pending, (state) => {
        state.sellableCategoryStatus = "loading";
      })
      .addCase(fetchSellableCategories.rejected, (state, action) => {
        state.sellableCategoryStatus = "rejected";
        logger.log("fetchSellableCategories::REJECTED", action.error);
      })
      .addCase(fetchSellableCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSellableCategories::FULFILLED", { payload });

        state.sellableCategoryStatus = "fulfilled";
        state.sellableCategoryList = action.payload;
      })

      //
      .addCase(fetchPointsTemplate.pending, (state) => {
        state.pointConversionStatus = "loading";
      })
      .addCase(fetchPointsTemplate.rejected, (state, action) => {
        state.pointConversionStatus = "rejected";
        logger.log("fetchPointsTemplate::REJECTED", action.error);
      })
      .addCase(fetchPointsTemplate.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchPointsTemplate::FULFILLED", { payload });

        state.pointConversionStatus = "fulfilled";
        state.pointConversionDetails = action.payload;
      })

      //
      .addCase(fetchExistingTransaction.pending, (state) => {
        state.existingTransactionStatus = "loading";
      })
      .addCase(fetchExistingTransaction.rejected, (state, action) => {
        state.existingTransactionStatus = "rejected";
        logger.log("fetchExistingTransaction::REJECTED", action.error);
      })
      .addCase(fetchExistingTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingTransaction::FULFILLED", { payload });

        state.existingTransactionStatus = "fulfilled";

        const transaction = action.payload;
        state.existingTransaction = transaction;
        state.existingTransactionId = transaction.id;

        if (parseInt(transaction.client_id) !== 0) {
          state.client_id = parseInt(transaction.client_id);
        } else {
          state.client_id = null;
        }
        state.selectedClient = transaction.client ?? null;

        state.discount = parseInt(transaction.discount);
        state.table_id = transaction.restaurant_transaction?.table_id ?? null;

        state.transactionItems = transaction.titems.map((item) => {
          const cost = parseFloat(
            item.cost ?? item.sellable?.sellable?.cost ?? 0
          );
          const sellable = item.sellable;
          const quantity = parseFloat(item.quantity);
          const discount = parseFloat(item.discount);
          const client_id = item.client_id;
          const staff_id = item.staff_id;
          let accomps_defaults = [];
          let accomp_items = [];

          let staff_list = null;

          if (!item.staff_id ?? false) {
            staff_list = item?.staff_income?.map((income) => ({
              id: income?.id,
              staff_id: income?.staff_id,
              staff_name: income?.staff?.name,
              commission: parseValidFloat(income?.amount),
            }));
          }

          item?.sold_accompaniments?.forEach((val) => {
            accomps_defaults.push(val.accompaniment_id);
            accomp_items.push([val.accompaniment_id]);
          });

          const titem = {
            id: item.id,
            sellable,
            client_id,
            staff_id,
            cost,
            quantity,
            discount,
            sub_total: cost * quantity - discount,
            accomps_defaults,
            accomp_items,
            order_type: item?.order_type,
            membership_cost: item?.membership_cost ?? null,
            note: item?.note,
            previous_titem_id: item?.previous_titem_id ?? null,
          };
          // console.log("the length is "+accomps_defaults.length);

          if (staff_list) {
            titem["staff_list"] = staff_list;
          }

          return titem;
        });
      })
      //
      .addCase(submitTransaction.pending, (state) => {
        state.submissionStatus = "loading";
      })
      .addCase(submitTransaction.rejected, (state, action) => {
        state.submissionStatus = "rejected";
        logger.warn("submitTransaction::REJECTED", action.error);
      })
      .addCase(submitTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitTransaction::FULFILLED", { payload });

        state.submissionStatus = "fulfilled";

        if (MODE_ASYNC) {
          state.submittedSagaId = action.payload?.saga_id ?? null;
        } else {
          state.submittedTransaction = action.payload;
        }
      })
      //
      .addCase(suspendTransaction.pending, (state) => {
        state.suspensionStatus = "loading";
      })
      .addCase(suspendTransaction.rejected, (state, action) => {
        state.suspensionStatus = "rejected";
        logger.warn("suspendTransaction::REJECTED", action.error);
      })
      .addCase(suspendTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("suspendTransaction::FULFILLED", { payload });

        state.suspensionStatus = "fulfilled";

        if (MODE_ASYNC) {
          state.submittedSagaId = action.payload?.saga_id ?? null;
        } else {
          state.submittedTransaction = action.payload;
        }
      });
    //
  },
});

export const {
  sellableSearchTermUpdated,
  resetSellableSearchTerm,
  //
  addCashPayment,
  addCardPayment,
  addBankPayment,
  addChequePayment,
  addMpesaPayment,
  addOtherPayment,
  addMembershipPayment,
  removePayment,
  setPaymentAmount,
  setMpesaPaymentPhone,
  setMpesaPaymentCode,
  setOtherPaymentName,
  setPaymentReferenceNo,
  //
  addTransactionItem,
  addTransactionItemRaw,
  addTransactionGiftCardItem,
  addRedirectItem,
  addOrderRedirectItem,
  addVoucherItem,
  setTransactionItemStaff,
  setTransactionComboItems,
  setTransactionAccompItems,
  toggleTransactionItemAccomp,
  setTransactionItemQuantity,
  setTransactionItemDiscount,
  setTransactionItemCost,
  setTransactionMembershipItemCost,
  removeTransactionItem,
  setTransactionItemOrderType,
  setTransactionItemNote,
  //
  addTransactionMultipleStaff,
  removeTransactionMultipleStaff,
  //
  setClient,
  setRoomId,
  setMembership,
  setSelectedClient,
  setPercentageDiscount,
  clearClient,
  setTransactionDate,
  setDiscount,
  setCoupon,
  setRedeemedPoints,
  setTable,
  //
  setProcessFullTransaction,
  setProcessingSuspendedTransaction,
  //
  showViewPos,
  showViewPayments,
  showViewReceipts,
  showViewTables,
  //
  toggleCategoryMenu,
  //
  setExistingTransactionId,
  //
  setSubmittedTransaction,
  //
  setAutoTransactionId,
  //
  resetTransactionState,
  clearExistingTransaction,
  clearSubmittedTransaction,
  clearPoints,
  clearPointsR,
  redeemPoints,
  resetRedeemPoints,
  setIsComplimentary,
  setReturnItem,
} = posTransactionSlice.actions;

export default posTransactionSlice.reducer;

// Assume all bar codes have atleast 5 of the last character as numeric
export const isSearchTermBarCode = (state) => {
  const searchTerm = state.posTransaction.sellableSearchTerm.slice(-5);
  const isNumeric = !isNaN(searchTerm.slice(-5)) && searchTerm !== "";
  return isNumeric;
};

export const isViewPos = (state) => state.posTransaction.view === "pos";
export const isViewPayments = (state) =>
  state.posTransaction.view === "payments";
export const isViewReceipts = (state) =>
  state.posTransaction.view === "receipts";
export const isViewTables = (state) => state.posTransaction.view === "tables";
