import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("OrdersData");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchOrdersData = createAsyncThunk(
  "orders/fetchOrdersData",
  async ({ orderId = null } = {}) => {
    if (!orderId) {
      return;
    }

    let url = `${API_URL}/view-order/${orderId}`;

    const startTime = new Date();
    logger.log("fetchOrdersData::BEGIN");
    const response = await fetch(url, {
      headers: {
        // Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchOrdersData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const initialState = {
  fetchOrdersData: [],
  fetchOrdersDataStatus: "idle",
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Booking Data
      .addCase(fetchOrdersData.pending, (state) => {
        state.fetchOrdersDataStatus = "loading";
      })
      .addCase(fetchOrdersData.rejected, (state) => {
        state.fetchOrdersDataStatus = "rejected";
        logger.log("getDashboard::REJECTED");
      })
      .addCase(fetchOrdersData.fulfilled, (state, action) => {
        state.fetchOrdersDataStatus = "fulfilled";
        state.fetchOrdersData = action.payload;
      });
  },
});

export default ordersSlice.reducer;
