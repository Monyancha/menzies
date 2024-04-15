import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Staffs");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  //fetchStaffList
  fetchStaffList: null,
  fetchStaffListStatus: "idle",
};

export const fetchStaffList = createAsyncThunk(
  "staffs/fetchStaffList",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
    filter = null,
    branch_id = null,
    is_staff = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/staff/list?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["search"] = filter;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const staffsSlice = createSlice({
  name: "staffs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      //fetchStaffList
      .addCase(fetchStaffList.pending, (state) => {
        state.fetchStaffListStatus = "loading";
      })
      .addCase(fetchStaffList.rejected, (state) => {
        state.fetchStaffListStatus = "rejected";
        logger.log("fetchStaffList::REJECTED");
      })
      .addCase(fetchStaffList.fulfilled, (state, action) => {
        state.fetchStaffListStatus = "fulfilled";
        state.fetchStaffList = action.payload;
      });
  },
});

export default staffsSlice.reducer;
