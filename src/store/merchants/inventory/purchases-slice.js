import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../../lib/shared/logger";

const logger = getLogger("Purchases");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getLPOSDetails: null,
  getLPOSDetailsStatus: "idle",

  getLRFQDetails: null,
  getLRFQDetailsStatus: "idle",

  getRFQSubItems: null,
  getRFQSubItemsStatus: "idle",

  getRFQItems: null,
  getRFQItemsStatus: "idle",

  companySummaryList: null,
  companySummaryStatus: "idle",

  companySummaryDetails: null,
  companySummaryDetailsStatus: "idle",

  companySummaryListWithItems: null,
  companySummaryWithItemsStatus: "idle",

  companyBillList: null,
  companyBillStatus: "idle",

  companyPaymentsList: null,
  companyPaymentsStatus: "idle",

  companyList: null,
  companyListStatus: "idle",

  rfqDetail: null,
  rfqDetailStatus: "idle",
  expiries: [],
};

export const updateSellablePrice = createAsyncThunk(
  "purchases/updateSellablePrice",
  async ({
    accessToken = null,

    receivalId = null,
    itemId = null,

    body = {},
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/inventory/purchases/receival/${receivalId}/item/${itemId}/changePrice`;

    logger.log("updateSellablePrice::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateSellablePrice::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCompanyList = createAsyncThunk(
  "purchases/fetchCompanyList",
  async ({
    accessToken = null,

    page = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory_purchases/companies?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanyList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanyList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getLPOSDetails = createAsyncThunk(
  "purchases/getLPOSDetails",
  async ({ accessToken = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/inventory/purchases/rfq/${rfqId}`;

    const startTime = new Date();
    logger.log("getLPOSDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLPOSDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getLRFQDetails = createAsyncThunk(
  "purchases/getLRFQDetails",
  async ({ accessToken = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/inventory/purchases/show/${rfqId}`;

    const startTime = new Date();
    logger.log("getLRFQDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLRFQDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getRFQSubItems = createAsyncThunk(
  "purchases/getRFQSubItems",
  async ({
    accessToken = null,
    page = null,
    rfqId = null,
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
      url = `${API_URL}/inventory/purchases/rfq/${rfqId}/products?`;
    }

    const params = {};
    if (filter) {
      params["search_product"] = filter;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRFQSubItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQSubItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

///inventory/purchases/rfq/{rfq_id}

export const getRFQItems = createAsyncThunk(
  "purchases/getRFQItems",
  async ({ accessToken = null, branch_id = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = undefined;
    url = `${API_URL}/inventory/purchases/rfq/${rfqId}?`;

    const params = {};
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getRFQItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const createRFQ = createAsyncThunk(
  "purchases/createRFQ",
  async ({
    accessToken = null,

    body = {},
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/inventory_purchases/rfqs`;

    logger.log("createRFQ::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("createRFQ::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCompanySummaryWithItems = createAsyncThunk(
  "purchases/fetchCompanySummaryWithItems",
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
      url = `${API_URL}/reports/purchases/company_bills_and_payments_with_items?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanySummaryWithItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanySummaryWithItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCompanySummary = createAsyncThunk(
  "purchases/fetchCompanySummary",
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
      url = `${API_URL}/reports/purchases/company_bills_and_payments?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanySummary::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanySummary::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCompanySummaryExcel = createAsyncThunk(
  "purchases/fetchCompanySummaryExcel",
  async ({
    accessToken = null,

    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/reports/purchases/company_bills_and_payments_excel?`;

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanySummaryExcel::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanySummaryExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchCompanyPurchaseSummary = createAsyncThunk(
  "purchases/fetchCompanyPurchaseSummary",
  async ({
    page = null,
    accessToken = null,
    companyId = null,

    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/purchases/companies/${companyId}?`;
    }

    const params = {};
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanyPurchaseSummary::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanyPurchaseSummary::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCompanyBills = createAsyncThunk(
  "purchases/fetchCompanyBills",
  async ({
    page = null,
    accessToken = null,
    companyId = null,

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
      url = `${API_URL}/reports/purchases/companies/${companyId}/bills?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanyBills::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanyBills::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCompanyBillsExcel = createAsyncThunk(
  "purchases/fetchCompanyBillsExcel",
  async ({
    accessToken = null,
    companyId = null,

    startDate = null,
    endDate = null,

    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/reports/purchases/companies_excel/${companyId}/bills?`;

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanyBillsExcel::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanyBillsExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchCompanyPayments = createAsyncThunk(
  "purchases/fetchCompanyPayments",
  async ({
    page = null,
    accessToken = null,
    companyId = null,

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
      url = `${API_URL}/reports/purchases/companies/${companyId}/payments?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanyPayments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanyPayments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCompanyPaymentsExcel = createAsyncThunk(
  "purchases/fetchCompanyPaymentsExcel",
  async ({
    accessToken = null,
    companyId = null,

    startDate = null,
    endDate = null,

    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/reports/purchases/companies_excel/${companyId}/payments?`;

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCompanyPaymentsExcel::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCompanyPaymentsExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    setExpiries(state, action) {
      const { data } = action.payload;
      // console.dir(data.data);
      let exp = [...state.expiries];
      if (exp.some((el) => el.sellable_id == data.sellable_id)) {
        console.log("Product Already Exists");
        return;
      }
      exp.push(data);
      state.expiries = exp;
      console.log(state.expiries);
    },
    clearExpiries(state) {
      state.expiries.length = 0;
    },
  },
  extraReducers(builder) {
    builder
      // createRFQ
      .addCase(createRFQ.pending, () => {
        logger.log("createRFQ::LOADING");
      })
      .addCase(createRFQ.rejected, () => {
        logger.log("createRFQ::REJECTED");
      })
      .addCase(createRFQ.fulfilled, (state, action) => {
        logger.log("createRFQ::FULFILLED");
        state.rfqDetail = action.payload;
      })

      // fetchCompanyList
      .addCase(fetchCompanyList.pending, (state) => {
        state.companyListStatus = "loading";
      })
      .addCase(fetchCompanyList.rejected, (state) => {
        state.companyListStatus = "rejected";
        logger.log("fetchCompanyList::REJECTED");
      })
      .addCase(fetchCompanyList.fulfilled, (state, action) => {
        state.companyListStatus = "fulfilled";
        state.companyList = action.payload;
      })

      // fetchCompanySummaryWithItems
      .addCase(fetchCompanySummaryWithItems.pending, (state) => {
        state.companySummaryWithItemsStatus = "loading";
      })
      .addCase(fetchCompanySummaryWithItems.rejected, (state) => {
        state.companySummaryWithItemsStatus = "rejected";
        logger.log("fetchCompanySummaryWithItems::REJECTED");
      })
      .addCase(fetchCompanySummaryWithItems.fulfilled, (state, action) => {
        state.companySummaryWithItemsStatus = "fulfilled";
        state.companySummaryListWithItems = action.payload;
      })

      // fetchCompanySummary
      .addCase(fetchCompanySummary.pending, (state) => {
        state.companySummaryStatus = "loading";
      })
      .addCase(fetchCompanySummary.rejected, (state) => {
        state.companySummaryStatus = "rejected";
        logger.log("fetchCompanySummary::REJECTED");
      })
      .addCase(fetchCompanySummary.fulfilled, (state, action) => {
        state.companySummaryStatus = "fulfilled";
        state.companySummaryList = action.payload;
      })

      // fetchCompanyPurchaseSummary
      .addCase(fetchCompanyPurchaseSummary.pending, (state) => {
        state.companySummaryDetailsStatus = "loading";
      })
      .addCase(fetchCompanyPurchaseSummary.rejected, (state) => {
        state.companySummaryDetailsStatus = "rejected";
        logger.log("fetchCompanyPurchaseSummary::REJECTED");
      })
      .addCase(fetchCompanyPurchaseSummary.fulfilled, (state, action) => {
        state.companySummaryDetailsStatus = "fulfilled";
        logger.log("fetchCompanyPurchaseSummary::FULFILLED");

        state.companySummaryDetails = action.payload;
      })

      // fetchCompanyBills
      .addCase(fetchCompanyBills.pending, (state) => {
        state.companyBillStatus = "loading";
      })
      .addCase(fetchCompanyBills.rejected, (state) => {
        state.companyBillStatus = "rejected";
        logger.log("fetchCompanyBills::REJECTED");
      })
      .addCase(fetchCompanyBills.fulfilled, (state, action) => {
        state.companyBillStatus = "fulfilled";
        logger.log("fetchCompanyPurchaseSummary::FULFILLED");

        state.companyBillList = action.payload;
      })

      // fetchCompanyPayments
      .addCase(fetchCompanyPayments.pending, (state) => {
        state.companyPaymentsStatus = "loading";
      })
      .addCase(fetchCompanyPayments.rejected, (state) => {
        state.companyPaymentsStatus = "rejected";
        logger.log("fetchCompanyPayments::REJECTED");
      })
      .addCase(fetchCompanyPayments.fulfilled, (state, action) => {
        state.companyPaymentsStatus = "fulfilled";
        state.companyPaymentsList = action.payload;
      })

      // getLRFQDetails Data
      .addCase(getLRFQDetails.pending, (state) => {
        state.getLRFQDetailsStatus = "loading";
      })
      .addCase(getLRFQDetails.rejected, (state) => {
        state.getLRFQDetailsStatus = "rejected";
        logger.log("getLRFQDetails::REJECTED");
      })
      .addCase(getLRFQDetails.fulfilled, (state, action) => {
        state.getLRFQDetailsStatus = "fulfilled";
        state.getLRFQDetails = action.payload;
      })

      //getRFQItems
      .addCase(getRFQItems.pending, (state) => {
        state.getRFQItemsStatus = "loading";
      })
      .addCase(getRFQItems.rejected, (state) => {
        state.getRFQItemsStatus = "rejected";
        logger.log("getLRFQDetails::REJECTED");
      })
      .addCase(getRFQItems.fulfilled, (state, action) => {
        state.getRFQItemsStatus = "fulfilled";
        state.getRFQItems = action.payload;
      })

      //getRFQSubItems
      .addCase(getRFQSubItems.pending, (state) => {
        state.getRFQSubItemsStatus = "loading";
      })
      .addCase(getRFQSubItems.rejected, (state) => {
        state.getRFQSubItemsStatus = "rejected";
        logger.log("getRFQSubItems::REJECTED");
      })
      .addCase(getRFQSubItems.fulfilled, (state, action) => {
        state.getRFQSubItemsStatus = "fulfilled";
        state.getRFQSubItems = action.payload;
      })

      // getLPOS Data
      .addCase(getLPOSDetails.pending, (state) => {
        state.getLPOSDetailsStatus = "loading";
      })
      .addCase(getLPOSDetails.rejected, (state) => {
        state.getLPOSStatus = "rejected";
        logger.log("getLPOSDetails::REJECTED");
      })
      .addCase(getLPOSDetails.fulfilled, (state, action) => {
        state.getLPOSDetailsStatus = "fulfilled";
        state.getLPOSDetails = action.payload;
      });
  },
});

export const { setExpiries, clearExpiries } = purchasesSlice.actions;

export default purchasesSlice.reducer;
