import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Batches");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getBatches: null,
  getBatchesStatus: "idle",
};

export const getBatches = createAsyncThunk(
  "batches/getBatches",
  async ({
    page = null,
    branch_id = null,
    filter = null,
    accessToken = null,
    sellable_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/batchedable-records?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (sellable_id) {
      params["sellable_id"] = sellable_id;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getBatches::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBatches::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const mergeUnbatched = createAsyncThunk(
  "batches/mergeUnbatched",
  async ({
    accessToken = null,

    from_batch_id = null,
    buying_price = null,
    selling_price = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/batchedable-records/merge_unbatched`;
    let body = {
      from_batch_id,
      buying_price,
      selling_price,
    };

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("mergeUnbatched::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("mergeUnbatched::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const mergeBatches = createAsyncThunk(
  "batches/mergeBatches",
  async ({
    accessToken = null,

    from_batch_id = null,
    to_batch_id = null,
    buying_price = null,
    selling_price = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/batchedable-records/merge_batches`;
    let body = {
      from_batch_id,
      to_batch_id,
      buying_price,
      selling_price,
    };

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("mergeBatches::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("mergeBatches::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const batchesSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getBatches Data
      .addCase(getBatches.pending, (state) => {
        state.getBatchesStatus = "loading";
      })
      .addCase(getBatches.rejected, (state) => {
        state.getBatchesStatus = "rejected";
        logger.log("getBatches::REJECTED");
      })
      .addCase(getBatches.fulfilled, (state, action) => {
        state.getBatchesStatus = "fulfilled";
        state.getBatches = action.payload;
      });
  },
});

export default batchesSlice.reducer;
