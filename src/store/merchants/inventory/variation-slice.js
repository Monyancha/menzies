import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("VariationSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  variationList: null,
  variationData: null,
  variationListStatus: "idle",
  submitVariationStatus: "idle",
  updateVariationStatus: "idle",
  fetchVariationList: [],
  fetchVariationListStatus: "idle",
  variation_vals: [],
  selected_index: null,
};

export const fetchVariationList = createAsyncThunk(
  "variations/fetchVariationList",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/variations-list`;

    const startTime = new Date();
    logger.log("fetchVariationList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchVariationList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteVariation = createAsyncThunk(
  "staff/deleteVariation",
  async ({ accessToken = null, id = null } = {}) => {
    if (!accessToken || !id) {
      return;
    }

    let url = `${API_URL}/variations-list/${id}?`;

    const startTime = new Date();
    logger.log("deleteVariation::BEGIN");
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("deleteVariation::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVariationValue = createAsyncThunk(
  "variations/getVariationValue",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/variations-list`;

    const startTime = new Date();
    logger.log("getVariationValue::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVariationValue::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitVariation = createAsyncThunk(
  "variations/submitVariation",
  async ({ accessToken = null, name = null, variation_values = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/variations-list`;

    let body = {};

    body["name"] = name;
    body["variation_values"] = variation_values;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitVariation::BEGIN", body);
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
      logger.log("submitVariation::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateVariation = createAsyncThunk(
  "variations/updateVariation",
  async ({
    accessToken = null,
    name = null,
    id = null,
    variation_values = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/update-variation`;

    let body = {};

    body["name"] = name;
    body["id"] = id;
    body["variation_values"] = variation_values;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitVariation::BEGIN", body);
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
      logger.log("submitVariation::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const variation = createSlice({
  name: "variation",
  initialState,
  reducers: {
    setVals(state, action) {
      const { vals } = action.payload;
      console.log(vals);
      state.variation_vals.push(vals);
    },
    setMultipleVals(state, action) {
      const { vals } = action.payload;
      state.variation_vals = vals;
      console.log("Random", vals);
    },
    setValsName(state, action) {
      const { values } = action.payload;

      const newValues = [...state.variation_vals];
      newValues[state.selected_index]["name"] = values;
      state.variation_vals = newValues;
    },
    setValsId(state, action) {
      const { values } = action.payload;
      const newValues = [...state.variation_vals];
      newValues[state.selected_index]["id"] = values;
      state.variation_vals = newValues;
    },
    setIndex(state, action) {
      const { index_id } = action.payload;
      state.selected_index = index_id;
    },
  },
  extraReducers(builder) {
    builder
      // submitVariationData
      .addCase(submitVariation.pending, (state) => {
        state.submitVariationStatus = "loading";
      })
      .addCase(submitVariation.rejected, (state, action) => {
        state.submitVariationStatus = "rejected";
        logger.warn("submitVariation::REJECTED", action.error);
      })
      .addCase(submitVariation.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitVariation::FULFILLED", { payload });

        state.submitVariationStatus = "fulfilled";
      })

      // updateVariationData
      .addCase(updateVariation.pending, (state) => {
        state.updateVariationStatus = "loading";
      })
      .addCase(updateVariation.rejected, (state, action) => {
        state.updateVariationStatus = "rejected";
        logger.warn("updateVariation::REJECTED", action.error);
      })
      .addCase(updateVariation.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("updateVariation::FULFILLED", { payload });
        state.updateVariationStatus = "fulfilled";
      })

      //fetchVariationList
      .addCase(fetchVariationList.pending, (state) => {
        state.fetchVariationListStatus = "loading";
      })
      .addCase(fetchVariationList.rejected, (state, action) => {
        state.fetchVariationListStatus = "rejected";
        logger.warn("fetchVariationList::REJECTED", action.error);
      })
      .addCase(fetchVariationList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchVariationList::FULFILLED", { payload });

        state.fetchVariationListStatus = "fulfilled";
        state.variationList = action.payload.list;
        state.variationData = action.payload.data;
      });

    // END
  },
});

export const { setIndex, setValsId, setValsName, setMultipleVals, setVals } =
  variation.actions;

export default variation.reducer;
