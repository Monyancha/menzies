import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../../lib/shared/logger";

const logger = getLogger("SalesReportsSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  salesList: null,
  salesListStatus: "idle",

  comboSalesList: null,
  comboSalesListStatus: "idle",

  comboSalesDetails: null,
  comboSalesDetailsStatus: "idle",

  sellablesList: null,
  sellablesListStatus: "idle",

  salesSummaryReceiptStatus: "idle",

  salesListReceiptStatus: "idle",

  inventoryReportList: null,
  inventoryReportListStatus: "idle",

  categorySalesList: null,
  categorySalesListStatus: "idle",

  categorySalesDetails: null,
  categorySalesDetailsStatus: "idle",
};

export const fetchCategorySalesDetails = createAsyncThunk(
  "salesReports/fetchCategorySalesDetails",
  async ({
    page = null,
    accessToken = null,

    categoryId = null,
    filter = null,
    start_date = null,
    end_date = null,

    branch_id = null,
    sellable_type = null,
  } = {}) => {
    if (!accessToken || !categoryId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/categories/${categoryId}/sales?`;
    }

    const params = {};
    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    if (filter) {
      params["filter"] = filter;
    }
    if (start_date) {
      params["start_date"] = start_date;
    }
    if (end_date) {
      params["end_date"] = end_date;
    }
    if (sellable_type) {
      params["sellable_type"] = sellable_type;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCategorySalesDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCategorySalesDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCategorySalesList = createAsyncThunk(
  "salesReports/fetchCategorySalesList",
  async ({
    page = null,
    accessToken = null,

    filter = null,
    start_date = null,
    end_date = null,

    branch_id = null,
    sellable_type = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/categories/sales?`;
    }

    const params = {};
    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    if (filter) {
      params["filter"] = filter;
    }
    if (start_date) {
      params["start_date"] = start_date;
    }
    if (end_date) {
      params["end_date"] = end_date;
    }

    if (sellable_type) {
      params["sellable_type"] = sellable_type;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchCategorySalesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCategorySalesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchInventoryReportList = createAsyncThunk(
  "sellableSalesReports/fetchInventoryReportList",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    category_id,
    sub_category_id,
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
      url = `${API_URL}/reports/sellables/inventory_report?`;
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

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchInventoryReportList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchInventoryReportList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSalesSummaryReceipt = createAsyncThunk(
  "sellableSalesReports/fetchSalesSummaryReceipt",
  async ({
    page = null,
    accessToken = null,
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
      url = `${API_URL}/reports/transactions/sold_sellables/receipt?`;
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
    logger.log("fetchSalesSummaryReceipt::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSalesSummaryReceipt::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `SalesSummary.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchSoldSellables = createAsyncThunk(
  "sellableSalesReports/fetchSoldSellables",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
    filter = null,
    categoryId = null,
    subCategoryId = null,
    branch_id = null,
    department_id = null,
    startDateTime = null,
    endDateTime = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/transactions/sold_sellables?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (startDateTime) {
      params["start_date_time"] = startDateTime;
    }
    if (endDateTime) {
      params["end_date_time"] = endDateTime;
    }

    if (categoryId !== null) {
      params["category_id"] = categoryId;
    }

    if (filter) {
      params["search_string"] = filter;
    }

    if (subCategoryId !== null) {
      params["sub_category_id"] = subCategoryId;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    if (department_id) {
      params["department_id"] = department_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchSoldSellables::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSoldSellables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSalesListReceipt = createAsyncThunk(
  "sellableSalesReports/fetchSalesListReceipt",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
    branch_id = null,
    department_id = null,
    startDateTime = null,
    endDateTime = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/transactions/sales_list_pdf?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (startDateTime) {
      params["start_date_time"] = startDateTime;
    }
    if (endDateTime) {
      params["end_date_time"] = endDateTime;
    }
    if (department_id) {
      params["department_id"] = department_id;
    }
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchSalesListReceipt::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSalesListReceipt::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `SalesSummary.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchSalesList = createAsyncThunk(
  "salesReport/fetchSalesList",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
    branch_id = null,
    filter = null,
    department_id = null,
    payment_type = null,
    startDateTime = null,
    endDateTime = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/transactions/sales_list?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (startDateTime) {
      params["start_date_time"] = startDateTime;
    }
    if (endDateTime) {
      params["end_date_time"] = endDateTime;
    }

    if (department_id) {
      params["department_id"] = department_id;
    }

    if (payment_type) {
      params["payment_type"] = payment_type;
    }

    params["branch_id"] = branch_id;
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchSalesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSalesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchComboSalesList = createAsyncThunk(
  "salesReport/fetchComboSalesList",
  async ({
    page = null,
    accessToken = null,
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
      url = `${API_URL}/reports/transactions/combo_sales_list?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    console.log("The filter is " + filter);
    if (filter) {
      params["search_string"] = filter;
    }
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchComboSalesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchComboSalesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchComboSalesDetails = createAsyncThunk(
  "salesReport/fetchComboSalesDetails",
  async ({
    comboSellableId = null,
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !comboSellableId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/transactions/combo_item_sales_list/${comboSellableId}?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchComboSalesDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchComboSalesDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const salesReports = createSlice({
  name: "salesReports",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // fetchCategorySalesDetails
      .addCase(fetchCategorySalesDetails.pending, (state) => {
        state.categorySalesDetailsStatus = "loading";
      })
      .addCase(fetchCategorySalesDetails.rejected, (state) => {
        state.categorySalesDetailsStatus = "rejected";
        logger.log("fetchCategorySalesDetails::REJECTED");
      })
      .addCase(fetchCategorySalesDetails.fulfilled, (state, action) => {
        state.categorySalesDetailsStatus = "fulfilled";
        state.categorySalesDetails = action.payload;
      })

      // fetchCategorySalesList
      .addCase(fetchCategorySalesList.pending, (state) => {
        state.categorySalesListStatus = "loading";
      })
      .addCase(fetchCategorySalesList.rejected, (state) => {
        state.categorySalesListStatus = "rejected";
        logger.log("fetchCategorySalesList::REJECTED");
      })
      .addCase(fetchCategorySalesList.fulfilled, (state, action) => {
        state.categorySalesListStatus = "fulfilled";
        state.categorySalesList = action.payload;
      })

      .addCase(fetchSalesList.pending, (state) => {
        state.salesListStatus = "loading";
      })
      .addCase(fetchSalesList.rejected, (state, action) => {
        state.salesListStatus = "rejected";
        logger.log("fetchSalesList::REJECTED", action.error);
      })
      .addCase(fetchSalesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSalesList::FULFILLED", { payload });

        state.salesListStatus = "fulfilled";
        state.salesList = action.payload;
      })

      // fetchSoldSellables
      .addCase(fetchSoldSellables.pending, (state) => {
        state.sellablesListStatus = "loading";
      })
      .addCase(fetchSoldSellables.rejected, (state, action) => {
        state.sellablesListStatus = "rejected";
        logger.log("fetchSoldSellables::REJECTED", action.error);
      })
      .addCase(fetchSoldSellables.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSoldSellables::FULFILLED", { payload });

        state.sellablesListStatus = "fulfilled";
        state.sellablesList = action.payload;
      })

      // fetchSalesSummaryReceipt
      .addCase(fetchSalesSummaryReceipt.pending, (state) => {
        state.salesSummaryReceiptStatus = "loading";
      })
      .addCase(fetchSalesSummaryReceipt.rejected, (state) => {
        state.salesSummaryReceiptStatus = "rejected";
        logger.log("salesSummaryReceiptStatus::REJECTED");
      })
      .addCase(fetchSalesSummaryReceipt.fulfilled, (state) => {
        state.salesSummaryReceiptStatus = "fulfilled";
      })

      // fetchSalesListReceipt
      .addCase(fetchSalesListReceipt.pending, (state) => {
        state.salesListReceiptStatus = "loading";
      })
      .addCase(fetchSalesListReceipt.rejected, (state) => {
        state.salesListReceiptStatus = "rejected";
        logger.log("fetchSalesListReceipt::REJECTED");
      })
      .addCase(fetchSalesListReceipt.fulfilled, (state) => {
        state.salesListReceiptStatus = "fulfilled";
      })

      // fetchComboSalesList
      .addCase(fetchComboSalesList.pending, (state) => {
        state.comboSalesListStatus = "loading";
      })
      .addCase(fetchComboSalesList.rejected, (state) => {
        state.comboSalesListStatus = "rejected";
        logger.log("fetchComboSalesList::REJECTED");
      })
      .addCase(fetchComboSalesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchComboSalesList::FULFILLED", { payload });

        state.comboSalesListStatus = "fulfilled";
        state.comboSalesList = action.payload;
      })

      // fetchComboSalesDetails
      .addCase(fetchComboSalesDetails.pending, (state) => {
        state.comboSalesDetailsStatus = "loading";
      })
      .addCase(fetchComboSalesDetails.rejected, (state) => {
        state.comboSalesDetailsStatus = "rejected";
        logger.log("fetchComboSalesDetails::REJECTED");
      })
      .addCase(fetchComboSalesDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchComboSalesDetails::FULFILLED", { payload });

        state.comboSalesDetailsStatus = "fulfilled";
        state.comboSalesDetails = action.payload;
      })
      //
      .addCase(fetchInventoryReportList.pending, (state) => {
        state.inventoryReportListStatus = "loading";
      })
      .addCase(fetchInventoryReportList.rejected, (state, action) => {
        state.inventoryReportListStatus = "rejected";
        logger.log("fetchInventoryReportList::REJECTED", action.error);
      })
      .addCase(fetchInventoryReportList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchInventoryReportList::FULFILLED", { payload });

        state.inventoryReportListStatus = "fulfilled";
        state.inventoryReportList = action.payload;
      });
    //
  },
});

export default salesReports.reducer;
