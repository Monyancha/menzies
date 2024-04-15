import getLogger from "@/lib/shared/logger";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const logger = getLogger("Inventory Reports");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  stockMovementList: null,
  stockMovementStatus: "idle",

  stockMovementExcelStatus: "idle",

  stockMovementDetail: null,
  stockMovementDetailStatus: "idle",
};

export const fetchStockMovementsReport = createAsyncThunk(
  "inventoryReports/fetchStockMovementsReport",
  async ({
    accessToken = null,
    page = null,

    startDate = null,
    endDate = null,

    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/sellables/stock_movement_report?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStockMovementsReport::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStockMovementsReport::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStockMovementReportExcel = createAsyncThunk(
  "inventoryReports/fetchStockMovementReportExcel",
  async ({ accessToken = null, startDate = null, endDate = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/reports/sellables/stock_movement_report_excel?`;

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStockMovementReportExcel::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStockMovementReportExcel::END", { took: seconds });

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

export const fetchStockMovementDetailReport = createAsyncThunk(
  "inventoryReports/fetchStockMovementDetailReport",
  async ({
    accessToken = null,
    page = null,

    startDate = null,
    endDate = null,

    sellableId = null,
  } = {}) => {
    if (!accessToken || !sellableId) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/sellables/stock_movement_report/${sellableId}?`;
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
    logger.log("fetchStockMovementDetailReport::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStockMovementDetailReport::END", {
        took: seconds,
        data,
      });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const inventoryReportsSlice = createSlice({
  name: "inventoryReports",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // -
      .addCase(fetchStockMovementsReport.pending, (state) => {
        state.stockMovementStatus = "loading";
      })
      .addCase(fetchStockMovementsReport.rejected, (state) => {
        state.stockMovementStatus = "rejected";
        logger.log("fetchStockMovementsReport::REJECTED");
      })
      .addCase(fetchStockMovementsReport.fulfilled, (state, action) => {
        state.stockMovementStatus = "fulfilled";
        logger.log("fetchStockMovementsReport::FULFILLED", {
          data: action.payload,
        });
        state.stockMovementList = action.payload;
      })

      // -
      .addCase(fetchStockMovementDetailReport.pending, (state) => {
        state.stockMovementDetailStatus = "loading";
      })
      .addCase(fetchStockMovementDetailReport.rejected, (state) => {
        state.stockMovementDetailStatus = "rejected";
        logger.log("fetchStockMovementDetailReport::REJECTED");
      })
      .addCase(fetchStockMovementDetailReport.fulfilled, (state, action) => {
        state.stockMovementDetailStatus = "fulfilled";
        logger.log("fetchStockMovementDetailReport::FULFILLED", {
          data: action.payload,
        });
        state.stockMovementDetail = action.payload;
      })

      // -
      .addCase(fetchStockMovementReportExcel.pending, (state) => {
        state.stockMovementExcelStatus = "loading";
      })
      .addCase(fetchStockMovementReportExcel.rejected, (state) => {
        state.stockMovementExcelStatus = "rejected";
        logger.log("fetchStockMovementReportExcel::REJECTED");
      })
      .addCase(fetchStockMovementReportExcel.fulfilled, (state) => {
        state.stockMovementExcelStatus = "fulfilled";
        logger.log("fetchStockMovementReportExcel::FULFILLED");
      });
  },
});

export default inventoryReportsSlice.reducer;
