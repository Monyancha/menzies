import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Consignments");
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const { v4: uuidv4 } = require('uuid');

const initialState = {
  //getConsignments
  getConsignments: null,
  getConsignmentsStatus: "idle",

  //getSingleConsignment
  getSingleConsignment: null,
  getSingleConsignmentStatus: "idle",

  //getConsignmentDashboard
  getConsignmentDashboard: null,
  getConsignmentDashboardStatus: "idle",

};

//getSingleConsignment
export const getSingleConsignment = createAsyncThunk(
  "consignments/getSingleConsignment",
  async ({
      accessToken = null,
      itemId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/consignment/${itemId}`;

    const startTime = new Date();
    logger.log("getSingleConsignment::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getSingleConsignment::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getConsignments
export const getConsignments = createAsyncThunk(
    "consignments/getConsignments",
    async ({
      page = null,
      accessToken = null,
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
        url = `${API_URL}/consignments?`;
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
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getConsignments::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getConsignments::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getConsignmentDashboard
  export const getConsignmentDashboard = createAsyncThunk(
    "consignments/getConsignmentDashboard",
    async ({
      page = null,
      accessToken = null,
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
        url = `${API_URL}/consignments-dashboard?`;
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
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getConsignmentDashboard::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getConsignmentDashboard::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

const consignmentsSlice = createSlice({
  name: "consignments",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Conversations Data
      .addCase(getConsignments.pending, (state) => {
        state.getConsignmentsStatus = "loading";
      })
      .addCase(getConsignments.rejected, (state) => {
        state.getConsignmentsStatus = "rejected";
      })
      .addCase(getConsignments.fulfilled, (state, action) => {
        state.getConsignmentsStatus = "fulfilled";
        state.getConsignments = action.payload;
      })

      //getConsignmentDashboard
      .addCase(getConsignmentDashboard.pending, (state) => {
        state.getConsignmentDashboardStatus = "loading";
      })
      .addCase(getConsignmentDashboard.rejected, (state) => {
        state.getConsignmentDashboardStatus = "rejected";
      })
      .addCase(getConsignmentDashboard.fulfilled, (state, action) => {
        state.getConsignmentDashboardStatus = "fulfilled";
        state.getConsignmentDashboard = action.payload;
      })

      //getSingleConsignment
      .addCase(getSingleConsignment.pending, (state) => {
        state.getSingleConsignmentStatus = "loading";
      })
      .addCase(getSingleConsignment.rejected, (state) => {
        state.getSingleConsignmentStatus = "rejected";
      })
      .addCase(getSingleConsignment.fulfilled, (state, action) => {
        state.getSingleConsignmentStatus = "fulfilled";
        state.getSingleConsignment = action.payload;
      })



  },
});

export default consignmentsSlice.reducer;
