import { getData } from "../../../lib/shared/fetch-api-helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Accounts");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  //getAllCustomers
  getAllCustomers: null,
  getAllCustomersStatus: "idle",

  //getAllQuotations
  getAllQuotations: null,
  getAllQuotationsStatus: "idle",

  //getAllRequirements
  getAllRequirements: null,
  getAllRequirementsStatus: "idle",

  //getAllInvoices
  getAllInvoices: null,
  getAllInvoicesStatus: "idle",

  //getPostedInvoices
  getPostedInvoices: null,
  getPostedInvoicesStatus: "idle",

  //getDeletedInvoices
  getDeletedInvoices: null,
  getDeletedInvoicesStatus: "idle",

  //getAllExpenses
  getAllExpenses: null,
  getAllExpensesStatus: "idle",

  //getExpenseTypes
  getExpenseTypes: null,
  getExpenseTypesStatus: "idle",

  //getAllTaxes
  getAllTaxes: null,
  getAllTaxesStatus: "idle",

  //getOneInvoice
  getOneInvoice: null,
  getOneInvoiceStatus: "idle",

  //getFooterNote
  getFooterNote: null,
  getFooterNoteStatus: "idle",

  //fetchClients
  fetchClients: null,
  fetchClientsStatus: "idle",

  //getTrialBalance: null,
  getTrialBalance: null,
  getTrialBalanceStatus: "idle",

  //getCustomerInvoices
  getCustomerInvoices: null,
  getCustomerInvoicesStatus: "idle",

  //getCustomerTransactions
  getCustomerTransactions: null,
  getCustomerTransactionsStatus: "idle",

  companyList: null,
  companyListStatus: "idle",

  companyDetails: null,
  companyDetailsStatus: "idle",

  companyTransactions: null,
  companyTransactionsStatus: "idle",

  companyInvoices: null,
  companyInvoicesStatus: "idle",

  companySoA: null,
  companySoAStatus: "idle",

  companyCarList: null,
  companyCarListStatus: "idle",

  carTransactions: null,
  carTransactionsStatus: "idle",

  agingReportStatus: "idle",
  agingReport: null,

  companyCarDetails: null,
  companyCarDetailsStatus: "idle",

  walletList: null,
  walletListStatus: "idle",

  walletFormList: null,
  walletFormListStatus: "idle",

  walletDetails: null,
  walletDetailsStatus: "idle",

  walletLedgerList: null,
  walletLedgerListStatus: "idle",

  //getAllCreditNotes
  getAllCreditNotes: null,
  getAllCreditNotesStatus: "idle",
};

export const fetchPettyCashWalletDetails = createAsyncThunk(
  "accounts/fetchPettyCashWalletDetails",
  async ({ accessToken = null, recordId = null } = {}) => {
    if (!accessToken || !recordId) {
      throw "AccessToken or RecordId empty";
    }

    let url = `${API_URL}/accounts/expenses/petty_cash_wallets/${recordId}?`;

    return await getData({ url, accessToken });
  }
);

export const fetchPettyCashWalletsListForForms = createAsyncThunk(
  "accounts/fetchPettyCashWalletsListForForms",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/accounts/expenses/petty_cash_wallets/forms/get_wallets?`;

    return await getData({ url, accessToken });
  }
);

export const fetchPettyCashWalletsList = createAsyncThunk(
  "accounts/fetchPettyCashWalletsList",
  async ({
    page = null,
    accessToken = null,

    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/expenses/petty_cash_wallets?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchWalletLedgerList = createAsyncThunk(
  "accounts/fetchWalletLedgerList",
  async ({
    page = null,
    accessToken = null,
    recordId = null,

    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken || !recordId) {
      throw "AccessToken or RecordId empty";
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/expenses/petty_cash_wallets/${recordId}/ledgers?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchAgingReport = createAsyncThunk(
  "accounts/fetchAgingReport",
  async ({
    page = null,
    accessToken = null,

    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/invoices/aging?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchCarTransactions = createAsyncThunk(
  "accounts/fetchCarTransactions",
  async ({
    page = null,
    accessToken = null,
    companyId = null,
    vehicleId = null,

    filter = null,
    branch_id = null,

    startDate = null,
    endDate = null,

    is_credited = false,
  } = {}) => {
    if (!accessToken || !vehicleId || !companyId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/companies/${companyId}/cars/${vehicleId}/transactions?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    if (is_credited) {
      params["is_credited"] = is_credited;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchCompanyStatementOfAccounts = createAsyncThunk(
  "accounts/fetchCompanyStatementOfAccounts",
  async ({
    page = null,
    accessToken = null,
    companyId = null,

    filter = null,
    branch_id = null,

    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !companyId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/companies/${companyId}/statement_of_accounts?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchCompanyInvoices = createAsyncThunk(
  "accounts/fetchCompanyInvoices",
  async ({
    page = null,
    accessToken = null,
    companyId = null,

    filter = null,
    branch_id = null,

    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !companyId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/companies/${companyId}/invoices?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchCompanyTransactions = createAsyncThunk(
  "accounts/fetchCompanyTransactions",
  async ({
    page = null,
    accessToken = null,
    companyId = null,

    filter = null,
    branch_id = null,

    startDate = null,
    endDate = null,

    is_credited = false,
  } = {}) => {
    if (!accessToken || !companyId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/companies/${companyId}/transactions?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    if (is_credited) {
      params["is_credited"] = is_credited;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchCompanyCarDetails = createAsyncThunk(
  "accounts/fetchCompanyCarDetails",
  async ({ accessToken = null, carId = null } = {}) => {
    if (!accessToken || !carId) {
      return;
    }

    let url = `${API_URL}/accounts/company_cars/${carId}?`;

    return await getData({ url, accessToken });
  }
);

export const fetchCompanyCarList = createAsyncThunk(
  "accounts/fetchCompanyCarList",
  async ({
    page = null,
    accessToken = null,
    companyId = null,

    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken || !companyId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/companies/${companyId}/cars?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const fetchCompanyDetails = createAsyncThunk(
  "accounts/fetchCompanyDetails",
  async ({
    accessToken = null,

    companyId = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken || !companyId) {
      return;
    }

    let url = `${API_URL}/accounts/companies/${companyId}`;

    return await getData({ url, accessToken });
  }
);

export const fetchCompanies = createAsyncThunk(
  "accounts/fetchCompanies",
  async ({
    page = null,
    accessToken = null,

    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/companies?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

export const getAllCustomers = createAsyncThunk(
  "customers/getAllCustomers",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/customers/list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

///accounts/customers/69597/transactions
export const getCustomerTransactions = createAsyncThunk(
  "customers/getCustomerTransactions",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    customerId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/customers/${customerId}/transactions?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);


//getCustomerInvoices
export const getCustomerInvoices = createAsyncThunk(
  "customers/getCustomerInvoices",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    customerId = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/customers/${customerId}/invoices?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//fetchClients
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/clients?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getTrialBalance
export const getTrialBalance = createAsyncThunk(
  "trialbalance/getTrialBalance",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/trial-balance?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getFooterNote
export const getFooterNote = createAsyncThunk(
  "footer/getFooterNote",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/accounts/invoices/default-footer`;

    return await getData({ url, accessToken });
  }
);

//getOneInvoice
export const getOneInvoice = createAsyncThunk(
  "invoices/getOneInvoice",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    invoiceId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/invoices/show/${invoiceId}?`;
    }

    const params = {};
    if (filter) {
      params["search"] = filter;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//
export const getAllQuotations = createAsyncThunk(
  "quotations/getAllQuotations",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    startDate = null,
    endDate = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/quotations/list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getAllInvoices
export const getAllInvoices = createAsyncThunk(
  "quotations/getAllInvoices",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    startDate = null,
    endDate = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/invoices/list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getPostedInvoices
export const getPostedInvoices = createAsyncThunk(
  "quotations/getPostedInvoices",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    startDate = null,
    endDate = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/invoices/post/invoices?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

// getDeletedInvoices
export const getDeletedInvoices = createAsyncThunk(
  "quotations/getDeletedInvoices",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    startDate = null,
    endDate = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/invoices/deleted?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getAllExpenses
export const getAllExpenses = createAsyncThunk(
  "expenses/getAllExpenses",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    startDate = null,
    endDate = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/expenses/list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getExpenseTypes
export const getExpenseTypes = createAsyncThunk(
  "quotations/getExpenseTypes",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/accounts/expenses/expense-types?`;

    return await getData({ url, accessToken });
  }
);

//getAllTaxes

export const getAllTaxes = createAsyncThunk(
  "quotations/getAllTaxes",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/get-taxes?`;
    }

    const params = {};

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getAllCreditNotes
export const getAllCreditNotes = createAsyncThunk(
  "creditnotes/getAllCreditNotes",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/credit-notes/list?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

//getAllRequirements
export const getAllRequirements = createAsyncThunk(
  "quotations/getAllRequirements",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/accounts/quotations/requirements?`;
    }

    const params = {};
    if (filter) {
      params["search_product"] = filter;
    }

    url += new URLSearchParams(params);

    return await getData({ url, accessToken });
  }
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // fetchWalletLedgerList
      .addCase(fetchWalletLedgerList.pending, (state) => {
        state.walletLedgerListStatus = "loading";
        logger.log("fetchWalletLedgerList::LOADING");
      })
      .addCase(fetchWalletLedgerList.rejected, (state, action) => {
        state.walletLedgerListStatus = "rejected";
        logger.log("fetchWalletLedgerList::REJECTED", { data: action });
      })
      .addCase(fetchWalletLedgerList.fulfilled, (state, action) => {
        logger.log("fetchWalletLedgerList::FULFILLED", {
          data: action.payload,
        });
        state.walletLedgerListStatus = "fulfilled";
        state.walletLedgerList = action.payload;
      })

      // fetchPettyCashWalletDetails
      .addCase(fetchPettyCashWalletDetails.pending, (state) => {
        state.walletDetailsStatus = "loading";
        logger.log("fetchPettyCashWalletDetails::LOADING");
      })
      .addCase(fetchPettyCashWalletDetails.rejected, (state, action) => {
        state.walletDetailsStatus = "rejected";
        logger.log("fetchPettyCashWalletDetails::REJECTED", { data: action });
      })
      .addCase(fetchPettyCashWalletDetails.fulfilled, (state, action) => {
        logger.log("fetchPettyCashWalletDetails::FULFILLED", {
          data: action.payload,
        });
        state.walletDetailsStatus = "fulfilled";
        state.walletDetails = action.payload;
      })

      // fetchPettyCashWalletsListForForms
      .addCase(fetchPettyCashWalletsListForForms.pending, (state) => {
        logger.log("fetchPettyCashWalletsListForForms::LOADING");
        state.walletFormListStatus = "loading";
      })
      .addCase(fetchPettyCashWalletsListForForms.rejected, (state) => {
        logger.log("fetchPettyCashWalletsListForForms::REJECTED");
        state.walletFormListStatus = "rejected";
        logger.log("fetchAgingReport::REJECTED");
      })
      .addCase(fetchPettyCashWalletsListForForms.fulfilled, (state, action) => {
        logger.log("fetchPettyCashWalletsListForForms::FULFILLED");
        state.walletFormListStatus = "fulfilled";
        state.walletFormList = action.payload;
      })

      // fetchPettyCashWalletsList
      .addCase(fetchPettyCashWalletsList.pending, (state) => {
        logger.log("fetchPettyCashWalletsList::LOADING");
        state.walletListStatus = "loading";
      })
      .addCase(fetchPettyCashWalletsList.rejected, (state) => {
        state.walletListStatus = "rejected";
        logger.log("fetchPettyCashWalletsList::REJECTED");
      })
      .addCase(fetchPettyCashWalletsList.fulfilled, (state, action) => {
        logger.log("fetchPettyCashWalletsList::FULFILLED");
        state.walletListStatus = "fulfilled";
        state.walletList = action.payload;
      })

      // fetchAgingReport
      .addCase(fetchAgingReport.pending, (state) => {
        state.agingReportStatus = "loading";
      })
      .addCase(fetchAgingReport.rejected, (state) => {
        state.agingReportStatus = "rejected";
        logger.log("fetchAgingReport::REJECTED");
      })
      .addCase(fetchAgingReport.fulfilled, (state, action) => {
        state.agingReportStatus = "fulfilled";
        state.agingReport = action.payload;
      })

      // fetchCarTransactions
      .addCase(fetchCarTransactions.pending, (state) => {
        state.carTransactionsStatus = "loading";
      })
      .addCase(fetchCarTransactions.rejected, (state) => {
        state.carTransactionsStatus = "rejected";
        logger.log("fetchCarTransactions::REJECTED");
      })
      .addCase(fetchCarTransactions.fulfilled, (state, action) => {
        state.carTransactionsStatus = "fulfilled";
        state.carTransactions = action.payload;
      })

      // fetchCompanyStatementOfAccounts
      .addCase(fetchCompanyStatementOfAccounts.pending, (state) => {
        state.companySoAStatus = "loading";
      })
      .addCase(fetchCompanyStatementOfAccounts.rejected, (state) => {
        state.companySoAStatus = "rejected";
        logger.log("fetchCompanyStatementOfAccounts::REJECTED");
      })
      .addCase(fetchCompanyStatementOfAccounts.fulfilled, (state, action) => {
        state.companySoAStatus = "fulfilled";
        state.companySoA = action.payload;
      })

      // fetchCompanyInvoices
      .addCase(fetchCompanyInvoices.pending, (state) => {
        state.companyInvoicesStatus = "loading";
      })
      .addCase(fetchCompanyInvoices.rejected, (state) => {
        state.companyInvoicesStatus = "rejected";
        logger.log("fetchCompanyInvoices::REJECTED");
      })
      .addCase(fetchCompanyInvoices.fulfilled, (state, action) => {
        state.companyInvoicesStatus = "fulfilled";
        state.companyInvoices = action.payload;
      })

      // fetchCompanyTransactions
      .addCase(fetchCompanyTransactions.pending, (state) => {
        state.companyTransactionsStatus = "loading";
      })
      .addCase(fetchCompanyTransactions.rejected, (state) => {
        state.companyTransactionsStatus = "rejected";
        logger.log("fetchCompanyTransactions::REJECTED");
      })
      .addCase(fetchCompanyTransactions.fulfilled, (state, action) => {
        state.companyTransactionsStatus = "fulfilled";
        state.companyTransactions = action.payload;
      })

      // fetchCompanyCarDetails
      .addCase(fetchCompanyCarDetails.pending, (state) => {
        state.companyCarDetailsStatus = "loading";
      })
      .addCase(fetchCompanyCarDetails.rejected, (state) => {
        state.companyCarDetailsStatus = "rejected";
        logger.log("fetchCompanycarDetails::REJECTED");
      })
      .addCase(fetchCompanyCarDetails.fulfilled, (state, action) => {
        state.companyCarDetailsStatus = "fulfilled";
        state.companyCarDetails = action.payload;
      })

      // fetchCompanyCarList
      .addCase(fetchCompanyCarList.pending, (state) => {
        state.companyCarListStatus = "loading";
      })
      .addCase(fetchCompanyCarList.rejected, (state) => {
        state.companyCarListStatus = "rejected";
        logger.log("fetchCompanyCarList::REJECTED");
      })
      .addCase(fetchCompanyCarList.fulfilled, (state, action) => {
        state.companyCarListStatus = "fulfilled";
        state.companyCarList = action.payload;
      })

      // fetchCompanyDetails
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.companyDetailsStatus = "loading";
      })
      .addCase(fetchCompanyDetails.rejected, (state) => {
        state.companyDetailsStatus = "rejected";
        logger.log("fetchCompanyDetails::REJECTED");
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.companyDetailsStatus = "fulfilled";
        state.companyDetails = action.payload;
      })

      // fetchCompanies
      .addCase(fetchCompanies.pending, (state) => {
        state.companyListStatus = "loading";
      })
      .addCase(fetchCompanies.rejected, (state) => {
        state.companyListStatus = "rejected";
        logger.log("fetchCompanies::REJECTED");
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companyListStatus = "fulfilled";
        state.companyList = action.payload;
      })

      //getAllCustomers
      .addCase(getAllCustomers.pending, (state) => {
        state.getAllCustomersStatus = "loading";
      })
      .addCase(getAllCustomers.rejected, (state) => {
        state.getAllCustomersStatus = "rejected";
        logger.log("getAllCustomers::REJECTED");
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.getAllCustomersStatus = "fulfilled";
        state.getAllCustomers = action.payload;
      })

      //getCustomerTransactions
      .addCase(getCustomerTransactions.pending, (state) => {
        state.getCustomerTransactionsStatus = "loading";
      })
      .addCase(getCustomerTransactions.rejected, (state) => {
        state.getCustomerTransactionsStatus = "rejected";
        logger.log("getCustomerTransactions::REJECTED");
      })
      .addCase(getCustomerTransactions.fulfilled, (state, action) => {
        state.getCustomerTransactionsStatus = "fulfilled";
        state.getCustomerTransactions = action.payload;
      })

      //getCustomerInvoices
      .addCase(getCustomerInvoices.pending, (state) => {
        state.getCustomerInvoicesStatus = "loading";
      })
      .addCase(getCustomerInvoices.rejected, (state) => {
        state.getCustomerInvoicesStatus = "rejected";
        logger.log("getCustomerInvoices::REJECTED");
      })
      .addCase(getCustomerInvoices.fulfilled, (state, action) => {
        state.getCustomerInvoicesStatus = "fulfilled";
        state.getCustomerInvoices = action.payload;
      })

      //fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.fetchClientsStatus = "loading";
      })
      .addCase(fetchClients.rejected, (state) => {
        state.fetchClientsStatus = "rejected";
        logger.log("fetchClients::REJECTED");
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.fetchClientsStatus = "fulfilled";
        state.fetchClients = action.payload;
      })

      //getFooterNote
      .addCase(getFooterNote.pending, (state) => {
        state.getFooterNoteStatus = "loading";
      })
      .addCase(getFooterNote.rejected, (state) => {
        state.getFooterNoteStatus = "rejected";
        logger.log("getFooterNote::REJECTED");
      })
      .addCase(getFooterNote.fulfilled, (state, action) => {
        state.getFooterNoteStatus = "fulfilled";
        state.getFooterNote = action.payload;
      })

      //getTrialBalance
      .addCase(getTrialBalance.pending, (state) => {
        state.getTrialBalanceStatus = "loading";
      })
      .addCase(getTrialBalance.rejected, (state) => {
        state.getTrialBalanceStatus = "rejected";
        logger.log("getTrialBalance::REJECTED");
      })
      .addCase(getTrialBalance.fulfilled, (state, action) => {
        state.getTrialBalanceStatus = "fulfilled";
        state.getTrialBalance = action.payload;
      })


      //getOneInvoice
      .addCase(getOneInvoice.pending, (state) => {
        state.getOneInvoiceStatus = "loading";
      })
      .addCase(getOneInvoice.rejected, (state) => {
        state.getOneInvoiceStatus = "rejected";
        logger.log("getOneInvoice::REJECTED");
      })
      .addCase(getOneInvoice.fulfilled, (state, action) => {
        state.getOneInvoiceStatus = "fulfilled";
        state.getOneInvoice = action.payload;
      })

      //getAllTaxes
      .addCase(getAllTaxes.pending, (state) => {
        state.getAllTaxesStatus = "loading";
      })
      .addCase(getAllTaxes.rejected, (state) => {
        state.getAllTaxesStatus = "rejected";
        logger.log("getAllTaxes::REJECTED");
      })
      .addCase(getAllTaxes.fulfilled, (state, action) => {
        state.getAllTaxesStatus = "fulfilled";
        state.getAllTaxes = action.payload;
      })
      //getExpenseTypes
      .addCase(getExpenseTypes.pending, (state) => {
        state.getExpenseTypesStatus = "loading";
      })
      .addCase(getExpenseTypes.rejected, (state) => {
        state.getExpenseTypesStatus = "rejected";
        logger.log("getExpenseTypes::REJECTED");
      })
      .addCase(getExpenseTypes.fulfilled, (state, action) => {
        state.getExpenseTypesStatus = "fulfilled";
        state.getExpenseTypes = action.payload;
      })

      //getAllCreditNotes
      .addCase(getAllCreditNotes.pending, (state) => {
        state.getAllCreditNotesStatus = "loading";
      })
      .addCase(getAllCreditNotes.rejected, (state) => {
        state.getAllCreditNotesStatus = "rejected";
        logger.log("getAllCreditNotes::REJECTED");
      })
      .addCase(getAllCreditNotes.fulfilled, (state, action) => {
        state.getAllCreditNotesStatus = "fulfilled";
        state.getAllCreditNotes = action.payload;
      })

      //getAllExpenses
      .addCase(getAllExpenses.pending, (state) => {
        state.getAllExpensesStatus = "loading";
      })
      .addCase(getAllExpenses.rejected, (state) => {
        state.getAllExpensesStatus = "rejected";
        logger.log("getAllExpenses::REJECTED");
      })
      .addCase(getAllExpenses.fulfilled, (state, action) => {
        state.getAllExpensesStatus = "fulfilled";
        state.getAllExpenses = action.payload;
      })

      //getAllInvoices
      .addCase(getAllInvoices.pending, (state) => {
        state.getAllInvoicesStatus = "loading";
      })
      .addCase(getAllInvoices.rejected, (state) => {
        state.getAllInvoicesStatus = "rejected";
        logger.log("getAllInvoices::REJECTED");
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.getAllInvoicesStatus = "fulfilled";
        state.getAllInvoices = action.payload;
      })

      //getPostedInvoices
      .addCase(getPostedInvoices.pending, (state) => {
        state.getPostedInvoicesStatus = "loading";
      })
      .addCase(getPostedInvoices.rejected, (state) => {
        state.getPostedInvoicesStatus = "rejected";
        logger.log("getPostedInvoices::REJECTED");
      })
      .addCase(getPostedInvoices.fulfilled, (state, action) => {
        state.getPostedInvoicesStatus = "fulfilled";
        state.getPostedInvoices = action.payload;
      })

      //getDeletedInvoices
      .addCase(getDeletedInvoices.pending, (state) => {
        state.getDeletedInvoicesStatus = "loading";
      })
      .addCase(getDeletedInvoices.rejected, (state) => {
        state.getDeletedInvoicesStatus = "rejected";
        logger.log("getDeletedInvoices::REJECTED");
      })
      .addCase(getDeletedInvoices.fulfilled, (state, action) => {
        state.getDeletedInvoicesStatus = "fulfilled";
        state.getDeletedInvoices = action.payload;
      })

      //getAllRequirements
      .addCase(getAllRequirements.pending, (state) => {
        state.getAllRequirementsStatus = "loading";
      })
      .addCase(getAllRequirements.rejected, (state) => {
        state.getAllRequirementsStatus = "rejected";
        logger.log("getAllRequirements::REJECTED");
      })
      .addCase(getAllRequirements.fulfilled, (state, action) => {
        state.getAllRequirementsStatus = "fulfilled";
        state.getAllRequirements = action.payload;
      })

      //getAllQuotations
      .addCase(getAllQuotations.pending, (state) => {
        state.getAllQuotationsStatus = "loading";
      })
      .addCase(getAllQuotations.rejected, (state) => {
        state.getAllQuotationsStatus = "rejected";
        logger.log("getAllQuotations::REJECTED");
      })
      .addCase(getAllQuotations.fulfilled, (state, action) => {
        state.getAllQuotationsStatus = "fulfilled";
        state.getAllQuotations = action.payload;
      });
  },
});

export default accountsSlice.reducer;
