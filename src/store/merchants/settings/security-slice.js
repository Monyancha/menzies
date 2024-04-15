import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";
import { getData } from "@/lib/shared/fetch-api-helpers";

const logger = getLogger("SecuritySlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  merchantFlags: null,
  merchantFlagsStatus: "idle",

  platformData: null,
  platformDataStatus: "idle",

  approvalRequest: null,
  approvalRequestStatus: "idle",

  tokenApprovalRequest: null,
  tokenApprovalRequestStatus: "idle",

  getDevices: null,
  getDevicesStatus: "idle",

  getZkteco: null,
  getZktecoStatus: "idle",
};

//getZkteco
export const getZkteco = createAsyncThunk(
  "biometrics/getZkteco",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/test-zkteco?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getZkteco::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getZkteco::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getDevices = createAsyncThunk(
  "biometrics/getDevices",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/biometric/devices?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getDevices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getDevices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


export const fetchTokenApprovalStatus = createAsyncThunk(
  "security/fetchTokenApprovalStatus",
  async ({ accessToken, token }) => {
    if (!accessToken || !token) {
      return;
    }

    const url = `${API_URL}/security/approval_requests/tokens/${token}?`;

    return await getData({
      url,
      accessToken,
      logKey: "fetchTokenApprovalStatus",
    });
  }
);

export const fetchApprovalStatus = createAsyncThunk(
  "security/fetchApprovalStatus",
  async ({ accessToken, referenceableId, referenceableType }) => {
    if (!accessToken || !referenceableId || !referenceableType) {
      return;
    }

    let url = `${API_URL}/security/approval_requests/referenceables/${referenceableId}?`;

    url += new URLSearchParams({
      referenceable_type: encodeURIComponent(referenceableType),
    });

    return await getData({ url, accessToken, logKey: "fetchApprovalStatus" });
  }
);

export const updateMerchantBooleanFlag = createAsyncThunk(
  "security/updateMerchantBooleanFlag",
  async ({
    accessToken = null,

    body = {},
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/settings/merchant_flags/boolean_flags`;

    logger.log("updateMerchantBooleanFlag::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateMerchantBooleanFlag::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchMerchantFlags = createAsyncThunk(
  "security/fetchMerchantFlags",
  async ({ accessToken }) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/settings/merchant_flags`;

    return await getData({ url, accessToken, logKey: "fetchMerchantFlags" });
  }
);

export const fetchPlatformData = createAsyncThunk(
  "security/fetchPlatformData",
  async () => {
    const url = `${API_URL}/merchant_onboarding/get_onboarding_data`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPlatformData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPlatformData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitPin = createAsyncThunk(
  "security/submitPin",
  async ({
    accessToken = null,

    body = {},
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/security_credentials/pin/set`;

    logger.log("submitPin::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("submitPin::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const validatePin = createAsyncThunk(
  "security/validatePin",
  async ({
    accessToken = null,

    body = {},
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/security_credentials/pin/validate`;

    logger.log("validatePin::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("validatePin::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const security = createSlice({
  name: "security",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // fetchTokenApprovalStatus
      .addCase(fetchTokenApprovalStatus.pending, (state) => {
        state.tokenApprovalRequestStatus = "loading";
      })
      .addCase(fetchTokenApprovalStatus.rejected, (state, action) => {
        state.tokenApprovalRequestStatus = "rejected";
        logger.log("fetchApprovalStatus::REJECTED", { data: action?.payload });
      })
      .addCase(fetchTokenApprovalStatus.fulfilled, (state, action) => {
        state.tokenApprovalRequestStatus = "fulfilled";
        state.tokenApprovalRequest = action.payload;
      })

      //Get Zkteco Devices
      .addCase(getDevices.pending, (state) => {
        state.getDevicesStatus = "loading";
      })
      .addCase(getDevices.rejected, (state) => {
        state.getDevicesStatus = "rejected";
        logger.log("getDevices::REJECTED");
      })
      .addCase(getDevices.fulfilled, (state, action) => {
        state.getDevicesStatus = "fulfilled";
        state.getDevices = action.payload;
      })

      //getZkteco
      .addCase(getZkteco.pending, (state) => {
        state.getZktecoStatus = "loading";
      })
      .addCase(getZkteco.rejected, (state) => {
        state.getZktecoStatus = "rejected";
        logger.log("getZkteco::REJECTED");
      })
      .addCase(getZkteco.fulfilled, (state, action) => {
        state.getZktecoStatus = "fulfilled";
        state.getZkteco = action.payload;
      })

      // fetchApprovalStatus
      .addCase(fetchApprovalStatus.pending, (state) => {
        state.approvalRequestStatus = "loading";
      })
      .addCase(fetchApprovalStatus.rejected, (state, action) => {
        state.approvalRequestStatus = "rejected";
        logger.log("fetchApprovalStatus::REJECTED", { data: action?.payload });
      })
      .addCase(fetchApprovalStatus.fulfilled, (state, action) => {
        state.approvalRequestStatus = "fulfilled";
        state.approvalRequest = action.payload;
      })

      // fetchMerchantFlags
      .addCase(fetchMerchantFlags.pending, (state) => {
        state.merchantFlagsStatus = "loading";
      })
      .addCase(fetchMerchantFlags.rejected, (state) => {
        state.merchantFlagsStatus = "rejected";
        logger.log("fetchMerchantFlags::REJECTED");
      })
      .addCase(fetchMerchantFlags.fulfilled, (state, action) => {
        state.merchantFlagsStatus = "fulfilled";
        state.merchantFlags = action.payload;
      })

      // fetchMerchantFlags
      .addCase(fetchPlatformData.pending, (state) => {
        state.platformDataStatus = "loading";
      })
      .addCase(fetchPlatformData.rejected, (state) => {
        state.platformDataStatus = "rejected";
        logger.log("fetchPlatformData::REJECTED");
      })
      .addCase(fetchPlatformData.fulfilled, (state, action) => {
        state.platformDataStatus = "fulfilled";
        state.platformData = action.payload;
      });
  },
});

export default security.reducer;
