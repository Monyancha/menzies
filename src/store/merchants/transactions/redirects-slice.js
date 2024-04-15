import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Order Redirects");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  fetchBookingRedirect: null,
  fetchBookingRedirectStatus: "idle",
  //
  fetchOrderRedirect: null,
  fetchOrderRedirectStatus: "idle",
};

export const fetchBookingRedirect = createAsyncThunk(
  "redirect/fetchBookingRedirect",
  async ({ accessToken = null, bookingId } = {}) => {
    if (!accessToken || !bookingId) {
      return;
    }

    let url = `${API_URL}/bookings/${bookingId}`;

    const startTime = new Date();
    logger.log("fetchBookingRedirect::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchBookingRedirect::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchOrderRedirect = createAsyncThunk(
  "redirect/fetchOrderRedirect",
  async ({ accessToken = null, orderId = null } = {}) => {
    if (!accessToken || !orderId) {
      return;
    }

    let url = `${API_URL}/online-orders/show/${orderId}`;

    const startTime = new Date();
    logger.log("fetchOrderRedirect::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchOrderRedirect::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const redirectSlice = createSlice({
  name: "redirect",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Redirect Booking Data
      .addCase(fetchBookingRedirect.pending, (state) => {
        state.fetchBookingRedirectStatus = "loading";
      })
      .addCase(fetchBookingRedirect.rejected, (state) => {
        state.fetchBookingRedirectStatus = "rejected";
        logger.log("fetchBookingRedirect::REJECTED");
      })
      .addCase(fetchBookingRedirect.fulfilled, (state, action) => {
        state.fetchBookingRedirectStatus = "fulfilled";
        state.fetchBookingRedirect = action.payload;
      })

      // Redirect Order Data
      .addCase(fetchOrderRedirect.pending, (state) => {
        state.fetchOrderRedirectStatus = "loading";
      })
      .addCase(fetchOrderRedirect.rejected, (state) => {
        state.fetchOrderRedirectStatus = "rejected";
        logger.log("fetchOrderRedirect::REJECTED");
      })
      .addCase(fetchOrderRedirect.fulfilled, (state, action) => {
        state.fetchOrderRedirectStatus = "fulfilled";
        state.fetchOrderRedirect = action.payload;
      });
  },
});

export default redirectSlice.reducer;
