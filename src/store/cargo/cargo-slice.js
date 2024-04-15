import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Cargo");
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const { v4: uuidv4 } = require('uuid');

const initialState = {
  //getLists
  getLists: null,
  getListsStatus: "idle",

  // Add More here
  getStaff: null,
  getStaffStatus: "idle",

  getAcceptance: null,
  getAcceptanceStatus: "idle",

  //getDashboard
  getDashboard: null,
  getDashboardStatus: "idle",

  //getReceivedULDs
  getDashboard: null,
  getDashboardStatus: "idle",

};

//getLists
export const getLists = createAsyncThunk(
  "cargo/getLists",
  async ({
      accessToken = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/lists`;

    const startTime = new Date();
    logger.log("getLists::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLists::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getDashboard
export const getDashboard = createAsyncThunk(
  "cargo/getDashboard",
  async ({
      accessToken = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/dashboard`;

    const startTime = new Date();
    logger.log("getDashboard::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getDashboard::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getStaff
export const getStaff = createAsyncThunk(
    "cargo/getStaff",
    async ({
        accessToken = null,
        filter = null,
        page = null,
    } = {}) => {
      if (!accessToken) {
        return;
      }

      console.log('am here 123');
  
      let url = undefined;

      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/staff?`;
      }
  
      const params = {};
      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);

      console.log('am here 999', url);

      const startTime = new Date();
      logger.log("getStaff::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getStaff::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

//get Awaiting Acceptance Cargo
export const getAcceptance = createAsyncThunk(
    "cargo/getAcceptance",
    async ({
        accessToken = null,
        filter = null,
        page = null,
    } = {}) => {
      if (!accessToken) {
        return;
      }

      console.log('am here 123');
  
      let url = undefined;

      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/awaiting-acceptance?`;
      }
  
      const params = {};
      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);

      console.log('search', url);

      const startTime = new Date();
      logger.log("getAcceptance::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getAcceptance::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

//get accepted cargo
export const getAccepted = createAsyncThunk(
    "cargo/getAccepted",
    async ({
        accessToken = null,
        filter = null,
        page = null,
    } = {}) => {
      if (!accessToken) {
        return;
      }

      console.log('am here 123');
  
      let url = undefined;

      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/done-acceptance?`;
      }
  
      const params = {};
      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);

      console.log('search', url);

      const startTime = new Date();
      logger.log("getAccepted::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getAccepted::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


//get issued ulds
export const getIssuedUld = createAsyncThunk(
    "cargo/getIssuedUld",
    async ({
        accessToken = null,
        filter = null,
        page = null,
    } = {}) => {
      if (!accessToken) {
        return;
      }

      console.log('am here 123');
  
      let url = undefined;

      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/issuedulds?`;
      }
  
      const params = {};
      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);

      console.log('search', url);

      const startTime = new Date();
      logger.log("getIssuedUld::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getIssuedUld::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


//get delivered imports
export const getDeliveredImport = createAsyncThunk(
    "cargo/getDeliveredImport",
    async ({
        accessToken = null,
        filter = null,
        page = null,
    } = {}) => {
      if (!accessToken) {
        return;
      }

      console.log('am here 123');
  
      let url = undefined;

      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/deliveredimports?`;
      }
  
      const params = {};
      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);

      console.log('am here 999', url);

      const startTime = new Date();
      logger.log("getDeliveredImport::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getDeliveredImport::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


const cargoSlice = createSlice({
  name: "cargo",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Lists Data
      .addCase(getLists.pending, (state) => {
        state.getListsStatus = "loading";
      })
      .addCase(getLists.rejected, (state) => {
        state.getListsStatus = "rejected";
      })
      .addCase(getLists.fulfilled, (state, action) => {
        state.getListsStatus = "fulfilled";
        state.getLists = action.payload;
      })

      // Staff Data
      .addCase(getStaff.pending, (state) => {
        state.getStaffStatus = "loading";
      })
      .addCase(getStaff.rejected, (state) => {
        state.getStaffStatus = "rejected";
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.getStaffStatus = "fulfilled";
        state.getStaff = action.payload;
      })

      // Acceptance Data
      .addCase(getAcceptance.pending, (state) => {
        state.getAcceptanceStatus = "loading";
      })
      .addCase(getAcceptance.rejected, (state) => {
        state.getAcceptanceStatus = "rejected";
      })
      .addCase(getAcceptance.fulfilled, (state, action) => {
        state.getAcceptanceStatus = "fulfilled";
        state.getAcceptance = action.payload;
      })

      // Dashboard Data
      .addCase(getDashboard.pending, (state) => {
        state.getDashboardStatus = "loading";
      })
      .addCase(getDashboard.rejected, (state) => {
        state.getDashboardStatus = "rejected";
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.getDashboardStatus = "fulfilled";
        state.getDashboard = action.payload;
      })

  },
});

export default cargoSlice.reducer;
