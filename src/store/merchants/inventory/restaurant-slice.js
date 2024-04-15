import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Restaurant");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getRestaurant: [],
  getRestaurantStatus: "idle",

  getTableDetails: [],
  getTableDetailStatus: "idle",
};

export const uploadRecipesBulk = createAsyncThunk(
  "restaurant/uploadRecipesBulk",
  async ({
    accessToken = null,

    body = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/recipes_bulk/upload?`;

    const startTime = new Date();
    logger.log("uploadRecipesBulk::BEGIN");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("uploadRecipesBulk::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getRestaurant = createAsyncThunk(
  "restaurant/getRestaurant",
  async ({
    accessToken = null,
    filter = null,
    branch_id = null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/restaurant_tables_index?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    logger.log("getRestaurant::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRestaurant::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getTableDetails = createAsyncThunk(
  "restaurant/getTableDetails",
  async ({ accessToken = null, tableId } = {}) => {
    if (!accessToken || !tableId) {
      return;
    }

    let url = `${API_URL}/restaurant-tables/${tableId}`;

    const startTime = new Date();
    logger.log("getTableDetails::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getTableDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Restaurant Data
      .addCase(getRestaurant.pending, (state) => {
        state.getRestaurantStatus = "loading";
      })
      .addCase(getRestaurant.rejected, (state) => {
        state.getRestaurantStatus = "rejected";
        logger.log("getRestaurant::REJECTED");
      })
      .addCase(getRestaurant.fulfilled, (state, action) => {
        state.getRestaurantStatus = "fulfilled";
        state.getRestaurant = action.payload;
      })

      // TableDetails Data
      .addCase(getTableDetails.pending, (state) => {
        state.getTableDetailStatus = "loading";
      })
      .addCase(getTableDetails.rejected, (state) => {
        state.getTableDetailStatus = "rejected";
        logger.log("getTableDetails::REJECTED");
      })
      .addCase(getTableDetails.fulfilled, (state, action) => {
        state.getTableDetailStatus = "fulfilled";
        state.getTableDetails = action.payload;
      });
  },
});

export default restaurantSlice.reducer;
