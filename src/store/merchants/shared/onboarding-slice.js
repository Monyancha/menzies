import getLogger from "@/lib/shared/logger";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const logger = getLogger("PosSessions");
const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

const initialState = {
  pageVideosStatus: "idle",
  pageVideos: null,
};

export const fetchPageVideos = createAsyncThunk(
  "onboarding/fetchPageVideos",
  async ({ b64_url = null } = {}) => {
    let url = `${API_URL}/docs/page_videos/${b64_url}?`;

    const startTime = new Date();
    logger.log("fetchPageVideos::BEGIN");
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPageVideos::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const onboarding = createSlice({
  name: "onboarding",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchPageVideos.pending, (state) => {
        state.pageVideosStatus = "loading";
      })
      .addCase(fetchPageVideos.rejected, (state, action) => {
        state.pageVideosStatus = "rejected";
        logger.log("fetchPageVideos::REJECTED", action.error);
        state.pageVideos = null;
      })
      .addCase(fetchPageVideos.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchPageVideos::FULFILLED", { payload });

        state.pageVideosStatus = "fulfilled";
        state.pageVideos = action.payload;
      });
  },
});

export default onboarding.reducer;
