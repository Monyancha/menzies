import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("BookingData");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchBookingData = createAsyncThunk(
  "booking/fetchBookingData",
  async ({ accessToken = null, bookingId = null } = {}) => {
    if (!bookingId) {
      return;
    }

    let url = `${API_URL}/bookings/${bookingId}`;

    const startTime = new Date();
    logger.log("fetchBookingData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchBookingData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const initialState = {
  fetchBookingData: [],
  fetchBookingDataStatus: "idle",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Booking Data
      .addCase(fetchBookingData.pending, (state) => {
        state.fetchBookingDataStatus = "loading";
      })
      .addCase(fetchBookingData.rejected, (state) => {
        state.fetchBookingDataStatus = "rejected";
        logger.log("fetchBookingData::REJECTED");
      })
      .addCase(fetchBookingData.fulfilled, (state, action) => {
        state.fetchBookingDataStatus = "fulfilled";
        state.fetchBookingData = action.payload;
      });
  },
});

export default bookingSlice.reducer;
