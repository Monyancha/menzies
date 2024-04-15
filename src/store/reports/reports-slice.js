import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Reports");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getChanges: null,
  getChangesStatus: "idle",

  getTaxes: null,
  getTaxesStatus: "idle",

  getInventory: null,
  getInventoryStatus: "idle",

  getBalanceSheet: null,
  getBalanceSheetStatus: "idle",

  getExpenses: null,
  getExpensesStatus: "idle",

  getInvoices: null,
  getInvoicesStatus: "idle",

  getStaffs: null,
  getStaffsStatus: "idle",

  getCustomerTrends: null,
  getCustomerTrendsStatus: "idle",

  getCustomerTrendsTabular: null,
  getCustomerTrendsTabularStatus: "idle",

  //getProductReports
  getProductReports: null,
  getProductReportsStatus: "idle",

  //variation reports
  product_variations_list: [],
  getProductVariationsStatus: "idle",

  //getProductUnitSales
  getProductUnitSales: null,
  getProductUnitSalesStatus: "idle",

  //getProductManualAdjustments
  getProductManualAdjustments: null,
  getProductManualAdjustmentsStatus: "idle",

  //getInventoryRecons
  getInventoryRecons: null,
  getInventoryReconsStatus: "idle",

  //getStockReports
  getStockReports: null,
  getStockReportsStatus: "idle",

  //getProfitLossGraphReports
  getProfitLossGraphReports: null,
  getProfitLossGraphReportsStatus: "idle",

  //getAgingReports
  getAgingReports: null,
  getAgingReportsStatus: "idle",

  vendorBillPayments: null,
  vendorBillPaymentsStatus: "idle",

  //getSalesReport
  getSalesReport: null,
  getSalesReportStatus: "idle",

  //getSalesReportGraph
  getSalesReportGraph: null,
  getSalesReportGraphStatus: "idle",

  //getServicesRank
  getServicesRank: null,
  getServicesRankStatus: "idle",

  //getSalesReturns
  getSalesReturns: null,
  getSalesReturnsStatus: "idle",

  //getStockSummary
  getStockSummary: null,
  getStockSummaryStatus: "idle",

  //getUnitStockSummary
  getUnitStockSummary: null,
  getUnitStockSummaryStatus: "idle",

  carSummaryGraph: null,
  carSummaryGraphStatus: "idle",

  //getRoomTypes
  getRoomTypes: null,
  getRoomTypesStatus: "idle",

  //getRoomPayments
  getRoomPayments: null,
  getRoomPaymentsStatus: "idle",

  //getRoomGuests
  getRoomGuests: null,
  getRoomGuestsStatus: "idle",

  //getOccupiedRooms
  getOccupiedRooms: null,
  getOccupiedRoomsStatus: "idle",

  //getVacantRooms
  getOccupiedRooms: null,
  getOccupiedRoomsStatus: "idle",

  //getRoomInvoices
  getRoomInvoices: null,
  getRoomInvoicesStatus: "idle",

  //getRoomsDashboard
  getRoomsDashboard: null,
  getRoomsDashboardStatus: "idle",

  //getRoomTypesView
  getRoomTypesView: null,
  getRoomTypesViewStatus: "idle",

};

//getRoomTypesView
export const getRoomTypesView = createAsyncThunk(
  "reports/getRoomTypesView",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    branch_id = null,
    typeId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/room-category/${typeId}?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRoomTypesView::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomTypesView::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRoomInvoices
export const getRoomInvoices = createAsyncThunk(
  "reports/getRoomInvoices",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-invoices?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRoomInvoices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomInvoices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


//getRoomsDashboard
export const getRoomsDashboard = createAsyncThunk(
  "reports/getRoomsDashboard",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/rooms-dashboard?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRoomsDashboard::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomsDashboard::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getVacantRooms
export const getVacantRooms = createAsyncThunk(
  "reports/getVacantRooms",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/vacant-rooms?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getVacantRooms::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVacantRooms::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getOccupiedRooms
export const getOccupiedRooms = createAsyncThunk(
  "reports/getOccupiedRooms",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/occupied-rooms?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getOccupiedRooms::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getOccupiedRooms::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRoomGuests
export const getRoomGuests = createAsyncThunk(
  "reports/getRoomGuests",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-guests?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRoomGuests::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomGuests::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRoomPayments
export const getRoomPayments = createAsyncThunk(
  "reports/getRoomPayments",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-payments?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRoomPayments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomPayments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


//getRoomTypes
export const getRoomTypes = createAsyncThunk(
  "reports/getRoomTypes",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-types-report?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRoomTypes::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomTypes::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCarSummaryGraph = createAsyncThunk(
  "reports/fetchCarSummaryGraph",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/car_summaries/chart_data?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCarSummaryGraph::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCarSummaryGraph::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStockSummary = createAsyncThunk(
  "reports/getStockSummary",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/inventory/stock-summary?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getStockSummary::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStockSummary::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getUnitStockSummary = createAsyncThunk(
  "reports/getUnitStockSummary",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    branch_id = null,
    sellableId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/inventory/stock-summary/${sellableId}?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getUnitStockSummary::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getUnitStockSummary::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getChanges Async Thunk
export const getChanges = createAsyncThunk(
  "reports/getChanges",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    recordType = null,
    changeType = null,
    branch_id = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/change-tracking?`;
    }

    const params = {};
    if (recordType) {
      params["record_type"] = recordType;
    }
    if (changeType) {
      params["change_type"] = changeType;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["search_string"] = filter;
    }
    // params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getChanges::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getChanges::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getSalesReturns
export const getSalesReturns = createAsyncThunk(
  "reports/getSalesReturns",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
    returnLocation = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/transactions/return-sales-items?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (returnLocation) {
      params["return_location"] = returnLocation;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getSalesReturns::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getSalesReturns::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getSalesReport
export const getSalesReport = createAsyncThunk(
  "reports/getSalesReport",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    paymentDate = null,
    branch_id = null,
    paymentMethod = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/sales-reports/tabular?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    //paymentMethod
    if (paymentMethod) {
      params["payment_method"] = paymentMethod;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getSalesReport::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getSalesReport::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getSalesReportGraph
export const getSalesReportGraph = createAsyncThunk(
  "reports/getSalesReportGraph",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    branch_id = null,
    paymentMethod = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/sales-reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    //paymentMethod
    if (paymentMethod) {
      params["payment_method"] = paymentMethod;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getSalesReportGraph::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getSalesReportGraph::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getServicesRank
export const getServicesRank = createAsyncThunk(
  "reports/getServicesRank",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/sales-reports/services-rank?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServicesRank::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServicesRank::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAgingReports
export const getAgingReports = createAsyncThunk(
  "reports/getAgingReports",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/aging-reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getAgingReports::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAgingReports::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getTaxes
export const getTaxes = createAsyncThunk(
  "reports/getTaxes",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
    branch_id = null,

    tax_rate = null,
    tax_rate_levy = null,
    tax_type = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/tax-reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["search_string"] = filter;
    }
    if (tax_rate) {
      params["tax_rate"] = tax_rate;
    }
    if (tax_type) {
      params["tax_type"] = tax_type;
    }
    if (tax_rate_levy) {
      params["tax_rate_levy"] = tax_rate_levy;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getTaxes::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getTaxes::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getStockReports
export const getStockReports = createAsyncThunk(
  "reports/getStockReports",
  async ({
    accessToken = null,
    page = null,
    start_date = null,
    end_date = null,
    filter = null,
    branch_id = null,
    variationId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/inventory/stock/reports?`;
    }

    const params = {};
    if (start_date) {
      params["start_date"] = start_date;
    }
    if (end_date) {
      params["end_date"] = end_date;
    }
    if (filter) {
      params["search_string"] = filter;
    }
    if (variationId) {
      params["variation_id"] = variationId;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getStockReports::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStockReports::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getProfitLossGraphReports
export const getProfitLossGraphReports = createAsyncThunk(
  "reports/getProfitLossGraphReports",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/profit-and-loss?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProfitLossGraphReports::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProfitLossGraphReports::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getInventoryRecons
export const getInventoryRecons = createAsyncThunk(
  "reports/getInventoryRecons",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
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
      url = `${API_URL}/reports/inventory/stock-reconciliations?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["search_string"] = filter;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getInventoryRecons::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInventoryRecons::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getProductManualAdjustments
export const getProductManualAdjustments = createAsyncThunk(
  "reports/getProductManualAdjustments",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    productId = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/inventory/products/${productId}/manual-adjustments/reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProductManualAdjustments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductManualAdjustments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getInventory Async Thunk
export const getInventory = createAsyncThunk(
  "reports/getInventory",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    paymentMethod = null,
    branch_id = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/inventory-reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (paymentMethod) {
      params["payment_method"] = paymentMethod;
    }
    console.log("The filter is " + filter);
    if (filter) {
      params["search_string"] = filter;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getInventory::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInventory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getInventory Async Thunk
export const getProductReports = createAsyncThunk(
  "reports/getProductReports",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
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
      url = `${API_URL}/reports/inventory/products/reports?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["search_string"] = filter;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProductReports::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductReports::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// get variations products
export const getProductVariations = createAsyncThunk(
  "reports/getProductVariations",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    search_string = null,
    branch_id = null,
  } = {}) => {
    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/variations-products?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (search_string) {
      params["search_string"] = search_string;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProductVariations::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductVariations::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getProductUnitSales
export const getProductUnitSales = createAsyncThunk(
  "reports/getProductUnitSales",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    productId = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    console.log("getProductID enock", productId);

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/inventory/products/${productId}/reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProductUnitSales::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductUnitSales::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getBalanceSheet Async Thunk
export const getBalanceSheet = createAsyncThunk(
  "reports/getBalanceSheet",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/balance-sheet?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getBalanceSheet::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBalanceSheet::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getInvoices Async Thunk
export const getInvoices = createAsyncThunk(
  "reports/getInvoices",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/invoice-reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getInvoices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInvoices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getExpenses Async Thunk
export const getExpenses = createAsyncThunk(
  "reports/getExpenses",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/expenses-reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getExpenses::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getExpenses::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getStaffs Async Thunk
export const getStaffs = createAsyncThunk(
  "reports/getStaffs",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
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
      url = `${API_URL}/reports/staff-reports?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["search_string"] = filter;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getStaffs::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffs::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getCustomerTrendsTabular Async Thunk
export const getCustomerTrendsTabular = createAsyncThunk(
  "reports/getCustomerTrendsTabular",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
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
      url = `${API_URL}/reports/customer-trends/tabular?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["search_string"] = filter;
    }
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getCustomerTrendsTabular::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCustomerTrendsTabular::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getCustomerTrends Async Thunk
export const getCustomerTrends = createAsyncThunk(
  "reports/getCustomerTrends",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/reports/customer-trends?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getCustomerTrends::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCustomerTrends::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchVendorBillPayments = createAsyncThunk(
  "reports/fetchVendorBillPayments",
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
      url = `${API_URL}/reports/purchases/vendor_bills?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = encodeURIComponent(filter);
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchVendorBillPayments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchVendorBillPayments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCarSummaryGraph.pending, (state) => {
        state.carSummaryGraphStatus = "loading";
      })
      .addCase(fetchCarSummaryGraph.rejected, (state) => {
        state.carSummaryGraphStatus = "rejected";
        logger.log("fetchCarSummaryGraph::REJECTED");
      })
      .addCase(fetchCarSummaryGraph.fulfilled, (state, action) => {
        logger.log("fetchCarSummaryGraph::FULFILLED");
        state.carSummaryGraphStatus = "fulfilled";
        state.carSummaryGraph = action.payload;
      })

      // getChanges Data
      .addCase(getChanges.pending, (state) => {
        state.getChangesStatus = "loading";
      })
      .addCase(getChanges.rejected, (state) => {
        state.getChangesStatus = "rejected";
        logger.log("getChanges::REJECTED");
      })
      .addCase(getChanges.fulfilled, (state, action) => {
        state.getChangesStatus = "fulfilled";
        state.getChanges = action.payload;
      })

      //getRoomPayments
      .addCase(getRoomPayments.pending, (state) => {
        state.getRoomPaymentsStatus = "loading";
      })
      .addCase(getRoomPayments.rejected, (state) => {
        state.getRoomPaymentsStatus = "rejected";
        logger.log("getRoomPayments::REJECTED");
      })
      .addCase(getRoomPayments.fulfilled, (state, action) => {
        state.getRoomPaymentsStatus = "fulfilled";
        state.getRoomPayments = action.payload;
      })
      //getRoomGuests
      .addCase(getRoomGuests.pending, (state) => {
        state.getRoomGuestsStatus = "loading";
      })
      .addCase(getRoomGuests.rejected, (state) => {
        state.getRoomGuestsStatus = "rejected";
        logger.log("getRoomGuests::REJECTED");
      })
      .addCase(getRoomGuests.fulfilled, (state, action) => {
        state.getRoomGuestsStatus = "fulfilled";
        state.getRoomGuests = action.payload;
      })
      //getOccupiedRooms
      .addCase(getOccupiedRooms.pending, (state) => {
        state.getOccupiedRoomsStatus = "loading";
      })
      .addCase(getOccupiedRooms.rejected, (state) => {
        state.getOccupiedRoomsStatus = "rejected";
        logger.log("getOccupiedRooms::REJECTED");
      })
      .addCase(getOccupiedRooms.fulfilled, (state, action) => {
        state.getOccupiedRoomsStatus = "fulfilled";
        state.getOccupiedRooms = action.payload;
      })

      //getRoomsDashboard
      .addCase(getRoomsDashboard.pending, (state) => {
        state.getRoomsDashboardStatus = "loading";
      })
      .addCase(getRoomsDashboard.rejected, (state) => {
        state.getRoomsDashboardStatus = "rejected";
        logger.log("getRoomsDashboard::REJECTED");
      })
      .addCase(getRoomsDashboard.fulfilled, (state, action) => {
        state.getRoomsDashboardStatus = "fulfilled";
        state.getRoomsDashboard = action.payload;
      })

      //getRoomTypesView
      .addCase(getRoomTypesView.pending, (state) => {
        state.getRoomTypesViewStatus = "loading";
      })
      .addCase(getRoomTypesView.rejected, (state) => {
        state.getRoomTypesViewStatus = "rejected";
        logger.log("getRoomTypesView::REJECTED");
      })
      .addCase(getRoomTypesView.fulfilled, (state, action) => {
        state.getRoomTypesViewStatus = "fulfilled";
        state.getRoomTypesView = action.payload;
      })


      //getVacantRooms
      .addCase(getVacantRooms.pending, (state) => {
        state.getVacantRoomsStatus = "loading";
      })
      .addCase(getVacantRooms.rejected, (state) => {
        state.getVacantRoomsStatus = "rejected";
        logger.log("getVacantRooms::REJECTED");
      })
      .addCase(getVacantRooms.fulfilled, (state, action) => {
        state.getVacantRoomsStatus = "fulfilled";
        state.getVacantRooms = action.payload;
      })
      // getRoomInvoices
      .addCase(getRoomInvoices.pending, (state) => {
        state.getRoomInvoicesStatus = "loading";
      })
      .addCase(getRoomInvoices.rejected, (state) => {
        state.getRoomInvoicesStatus = "rejected";
        logger.log("getRoomInvoices::REJECTED");
      })
      .addCase(getRoomInvoices.fulfilled, (state, action) => {
        state.getRoomInvoicesStatus = "fulfilled";
        state.getRoomInvoices = action.payload;
      })

      //getUnitStockSummary
      .addCase(getUnitStockSummary.pending, (state) => {
        state.getUnitStockSummaryStatus = "loading";
      })
      .addCase(getUnitStockSummary.rejected, (state) => {
        state.getUnitStockSummaryStatus = "rejected";
        logger.log("getUnitStockSummary::REJECTED");
      })
      .addCase(getUnitStockSummary.fulfilled, (state, action) => {
        state.getUnitStockSummaryStatus = "fulfilled";
        state.getUnitStockSummary = action.payload;
      })

      //getStockSummary
      .addCase(getStockSummary.pending, (state) => {
        state.getStockSummaryStatus = "loading";
      })
      .addCase(getStockSummary.rejected, (state) => {
        state.getStockSummaryStatus = "rejected";
        logger.log("getStockSummary::REJECTED");
      })
      .addCase(getStockSummary.fulfilled, (state, action) => {
        state.getStockSummaryStatus = "fulfilled";
        state.getStockSummary = action.payload;
      })

      //getSalesReportGraph
      .addCase(getSalesReportGraph.pending, (state) => {
        state.getSalesReportGraphStatus = "loading";
      })
      .addCase(getSalesReportGraph.rejected, (state) => {
        state.getSalesReportGraphStatus = "rejected";
        logger.log("getSalesReportGraph::REJECTED");
      })
      .addCase(getSalesReportGraph.fulfilled, (state, action) => {
        state.getSalesReportGraphStatus = "fulfilled";
        state.getSalesReportGraph = action.payload;
      })

      //getServicesRank
      .addCase(getServicesRank.pending, (state) => {
        state.getServicesRankStatus = "loading";
      })
      .addCase(getServicesRank.rejected, (state) => {
        state.getServicesRankStatus = "rejected";
        logger.log("getServicesRank::REJECTED");
      })
      .addCase(getServicesRank.fulfilled, (state, action) => {
        state.getServicesRankStatus = "fulfilled";
        state.getServicesRank = action.payload;
      })

      //getSalesReport
      .addCase(getSalesReport.pending, (state) => {
        state.getSalesReportStatus = "loading";
      })
      .addCase(getSalesReport.rejected, (state) => {
        state.getSalesReportStatus = "rejected";
        logger.log("getSalesReport::REJECTED");
      })
      .addCase(getSalesReport.fulfilled, (state, action) => {
        state.getSalesReportStatus = "fulfilled";
        state.getSalesReport = action.payload;
      })

      //getSalesReturns
      .addCase(getSalesReturns.pending, (state) => {
        state.getSalesReturnsStatus = "loading";
      })
      .addCase(getSalesReturns.rejected, (state) => {
        state.getSalesReturnsStatus = "rejected";
        logger.log("getSalesReturns::REJECTED");
      })
      .addCase(getSalesReturns.fulfilled, (state, action) => {
        state.getSalesReturnsStatus = "fulfilled";
        state.getSalesReturns = action.payload;
      })

      //getAgingReports
      .addCase(getAgingReports.pending, (state) => {
        state.getAgingReportsStatus = "loading";
      })
      .addCase(getAgingReports.rejected, (state) => {
        state.getAgingReportsStatus = "rejected";
        logger.log("getAgingReports::REJECTED");
      })
      .addCase(getAgingReports.fulfilled, (state, action) => {
        state.getAgingReportsStatus = "fulfilled";
        state.getAgingReports = action.payload;
      })

      //getTaxes
      .addCase(getTaxes.pending, (state) => {
        state.getTaxesStatus = "loading";
      })
      .addCase(getTaxes.rejected, (state) => {
        state.getTaxesStatus = "rejected";
        logger.log("getTaxes::REJECTED");
      })
      .addCase(getTaxes.fulfilled, (state, action) => {
        state.getTaxesStatus = "fulfilled";
        state.getTaxes = action.payload;
      })

      //getProfitLossGraphReports
      .addCase(getProfitLossGraphReports.pending, (state) => {
        state.getProfitLossGraphReportsStatus = "loading";
      })
      .addCase(getProfitLossGraphReports.rejected, (state) => {
        state.getProfitLossGraphReportsStatus = "rejected";
        logger.log("getProfitLossGraphReports::REJECTED");
      })
      .addCase(getProfitLossGraphReports.fulfilled, (state, action) => {
        state.getProfitLossGraphReportsStatus = "fulfilled";
        state.getProfitLossGraphReports = action.payload;
      })

      //getStockReports
      .addCase(getStockReports.pending, (state) => {
        state.getStockReportsStatus = "loading";
      })
      .addCase(getStockReports.rejected, (state) => {
        state.getStockReportsStatus = "rejected";
        logger.log("getStockReports::REJECTED");
      })
      .addCase(getStockReports.fulfilled, (state, action) => {
        state.getStockReportsStatus = "fulfilled";
        state.getStockReports = action.payload;
      })

      //getInventoryRecons
      .addCase(getInventoryRecons.pending, (state) => {
        state.getInventoryReconsStatus = "loading";
      })
      .addCase(getInventoryRecons.rejected, (state) => {
        state.getInventoryReconsStatus = "rejected";
        logger.log("getInventoryRecons::REJECTED");
      })
      .addCase(getInventoryRecons.fulfilled, (state, action) => {
        state.getInventoryReconsStatus = "fulfilled";
        state.getInventoryRecons = action.payload;
      })

      //getProductManualAdjustments
      .addCase(getProductManualAdjustments.pending, (state) => {
        state.getProductManualAdjustmentsStatus = "loading";
      })
      .addCase(getProductManualAdjustments.rejected, (state) => {
        state.getProductManualAdjustmentsStatus = "rejected";
        logger.log("getProductManualAdjustmentsStatus::REJECTED");
      })
      .addCase(getProductManualAdjustments.fulfilled, (state, action) => {
        state.getProductManualAdjustmentsStatus = "fulfilled";
        state.getProductManualAdjustments = action.payload;
      })

      // getInventory Data
      .addCase(getInventory.pending, (state) => {
        state.getInventoryStatus = "loading";
      })
      .addCase(getInventory.rejected, (state) => {
        state.getInventoryStatus = "rejected";
        logger.log("getInventory::REJECTED");
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.getInventoryStatus = "fulfilled";
        state.getInventory = action.payload;
      })

      //getRoomTypes
      .addCase(getRoomTypes.pending, (state) => {
        state.getRoomTypesStatus = "loading";
      })
      .addCase(getRoomTypes.rejected, (state) => {
        state.getRoomTypesStatus = "rejected";
        logger.log("getRoomTypes::REJECTED");
      })
      .addCase(getRoomTypes.fulfilled, (state, action) => {
        state.getRoomTypesStatus = "fulfilled";
        state.getRoomTypes = action.payload;
      })

      //getProductUnitSales
      .addCase(getProductUnitSales.pending, (state) => {
        state.getProductUnitSalesStatus = "loading";
      })
      .addCase(getProductUnitSales.rejected, (state) => {
        state.getProductUnitSalesStatus = "rejected";
        logger.log("getProductUnitSales::REJECTED");
      })
      .addCase(getProductUnitSales.fulfilled, (state, action) => {
        state.getProductUnitSalesStatus = "fulfilled";
        state.getProductUnitSales = action.payload;
      })

      //getProductReports
      .addCase(getProductReports.pending, (state) => {
        state.getProductReportsStatus = "loading";
      })
      .addCase(getProductReports.rejected, (state) => {
        state.getProductReportsStatus = "rejected";
        logger.log("getProductReports::REJECTED");
      })
      .addCase(getProductReports.fulfilled, (state, action) => {
        state.getProductReportsStatus = "fulfilled";
        state.getProductReports = action.payload;
      })

      //getProductVariations
      .addCase(getProductVariations.pending, (state) => {
        state.getProductVariationsStatus = "loading";
      })
      .addCase(getProductVariations.rejected, (state) => {
        state.getProductVariationsStatus = "rejected";
        logger.log("getProductVariations::REJECTED");
      })
      .addCase(getProductVariations.fulfilled, (state, action) => {
        state.getProductVariationsStatus = "fulfilled";
        state.product_variations_list = action.payload;
      })

      // getExpenses Data
      .addCase(getExpenses.pending, (state) => {
        state.getExpensesStatus = "loading";
      })
      .addCase(getExpenses.rejected, (state) => {
        state.getExpensesStatus = "rejected";
        logger.log("getExpenses::REJECTED");
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.getExpensesStatus = "fulfilled";
        state.getExpenses = action.payload;
      })

      // getInvoices Data
      .addCase(getInvoices.pending, (state) => {
        state.getInvoicesStatus = "loading";
      })
      .addCase(getInvoices.rejected, (state) => {
        state.getInvoicesStatus = "rejected";
        logger.log("getInvoices::REJECTED");
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.getInvoicesStatus = "fulfilled";
        state.getInvoices = action.payload;
      })

      // getStaffs Data
      .addCase(getStaffs.pending, (state) => {
        state.getStaffsStatus = "loading";
      })
      .addCase(getStaffs.rejected, (state) => {
        state.getStaffsStatus = "rejected";
        logger.log("getStaffs::REJECTED");
      })
      .addCase(getStaffs.fulfilled, (state, action) => {
        state.getStaffsStatus = "fulfilled";
        state.getStaffs = action.payload;
      })

      // getCustomerTrends Data
      .addCase(getCustomerTrends.pending, (state) => {
        state.getCustomerTrendsStatus = "loading";
      })
      .addCase(getCustomerTrends.rejected, (state) => {
        state.getCustomerTrendsStatus = "rejected";
        logger.log("getCustomerTrends::REJECTED");
      })
      .addCase(getCustomerTrends.fulfilled, (state, action) => {
        state.getCustomerTrendsStatus = "fulfilled";
        state.getCustomerTrends = action.payload;
      })

      // getCustomerTrendsTabular Data
      .addCase(getCustomerTrendsTabular.pending, (state) => {
        state.getCustomerTrendsTabularStatus = "loading";
      })
      .addCase(getCustomerTrendsTabular.rejected, (state) => {
        state.getCustomerTrendsTabularStatus = "rejected";
        logger.log("getCustomerTrendsTabular::REJECTED");
      })
      .addCase(getCustomerTrendsTabular.fulfilled, (state, action) => {
        state.getCustomerTrendsTabularStatus = "fulfilled";
        state.getCustomerTrendsTabular = action.payload;
      })

      // getBalanceSheet Data
      .addCase(getBalanceSheet.pending, (state) => {
        state.getBalanceSheetStatus = "loading";
      })
      .addCase(getBalanceSheet.rejected, (state) => {
        state.getBalanceSheetStatus = "rejected";
        logger.log("getBalanceSheet::REJECTED");
      })
      .addCase(getBalanceSheet.fulfilled, (state, action) => {
        state.getBalanceSheetStatus = "fulfilled";
        state.getBalanceSheet = action.payload;
      })

      // fetchVendorBillPayments
      .addCase(fetchVendorBillPayments.pending, (state) => {
        state.vendorBillPaymentsStatus = "loading";
      })
      .addCase(fetchVendorBillPayments.rejected, (state) => {
        state.vendorBillPaymentsStatus = "rejected";
        logger.log("fetchVendorBillPayments::REJECTED");
      })
      .addCase(fetchVendorBillPayments.fulfilled, (state, action) => {
        state.vendorBillPaymentsStatus = "fulfilled";
        state.vendorBillPayments = action.payload;
      });
  },
});

export default reportsSlice.reducer;
