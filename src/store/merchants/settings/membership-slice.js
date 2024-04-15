import { debounce } from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("BranchesSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  membershipList: null,
  membership_lists:null,
  membershipListStatus: "idle",
  clientsList:null,

  submitMembershipStatus: "idle",
  EditSubmissionStatus: "idle",
  deleteMembershipStatus: "idle",
  topUpMembershipStatus:"idle",

  fetchMembershipList: [],
  fetchMembershipListStatus: "idle",
  existingMembership:null,
  existingMembershipId:null,
  existingMembershipStatus:"idle"

};

export const fetchMembershipList = createAsyncThunk(
  "membership/fetchMembershipList",
  async ({
     accessToken = null,
     client_id=null,
     filter = null,
     startDate = null,
     endDate = null,
     branch_id = null,
    } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/membership?`;

    const params = {};

    if (client_id) {
      params["client_id"] = client_id;
    }

    if (filter) {
      params["filter"] = filter;
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);


    const startTime = new Date();
    logger.log("fetchMembershipList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchMembershipList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchExistingMembership = createAsyncThunk(
  "membership/fetchExistingMembership",
  async ({ accessToken = null,membershipId=null } = {}) => {
    if (!accessToken || !membershipId) {
      console.log(membershipId);
      return;
    }
    let url = `${API_URL}/membership/${membershipId}`;
    console.log(url);

    const startTime = new Date();
    logger.log("fetchExistingMembership::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingMembership::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitMembership = createAsyncThunk(
  "membership/submitMembership",
  async ({
    accessToken = null,
    name = null,
    cost = null,
    validity = null,
    validity_in = null,
    discount = null,
    new_services = [],
    new_products = [],
    branch_id = null,
    membership_type=null,
    calculate_commission=null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/membership`;

    let body = {};

    body["name"] = name;
    body["cost"] = cost;
    body["validity"] = validity;
    body["validity_in"] = validity_in;
    body["discount"] = discount;
    body["new_services"] = new_services;
    body["new_products"] = new_products;
    body["branch_id"] = branch_id;
    body["membership_type"] = membership_type;
    body["calculate_commission"] = calculate_commission;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitMembership::BEGIN", body);
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
      logger.log("submitMembership::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const topUpMembership = createAsyncThunk(
  "membership/topUpMembership",
  async ({
    accessToken = null,
    membership_id = null,
    membership_client_id = null,
    client_id = null,
    top_up_amount = null,

  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/topup-membership`;

    let body = {};

    body["membership_id"] = membership_id;
    body["membership_client_id"] = membership_client_id;
    body["client_id"] = client_id;
    body["top_up_amount"] = top_up_amount;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("topUpMembership::BEGIN", body);
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
      logger.log("topUpMembership::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteMembership = createAsyncThunk(
  "BranchesSlice/deleteMembership",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/membership/${itemId}`;

    const startTime = new Date();
    logger.log("deleteMembership::BEGIN");
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
      logger.log("deleteMembership::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitEditMembership = createAsyncThunk(
  "Membership/submitEditMembership",
  async ({
    accessToken = null,
    name = null,
    cost = null,
    validity = null,
    validity_in = null,
    discount = null,
    branch_id = null,
    membership_type=null,
    calculate_commission=null,
    id=null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/membership/${id}`;
    let body = {};

    body["name"] = name;
    body["cost"] = cost;
    body["validity"] = validity;
    body["validity_in"] = validity_in;
    body["discount"] = discount;
    body["branch_id"] = branch_id;
    body["membership_type"] = membership_type;
    body["calculate_commission"] = calculate_commission;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditMembership::BEGIN", body);
    const response = await fetch(url, {
      method: "PUT",
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
      logger.log("submitEditMembership::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const membership = createSlice({
  name: "membership",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // submitMembershipData
      .addCase(submitMembership.pending, (state) => {
        state.submitMembershipStatus = "loading";
      })
      .addCase(submitMembership.rejected, (state, action) => {
        state.submitMembershipStatus = "rejected";
        logger.warn("submitMembership::REJECTED", action.error);
      })
      .addCase(submitMembership.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitMembership::FULFILLED", { payload });

        state.submitMembershipStatus = "fulfilled";
      })

      // submitEditMembership
      .addCase(submitEditMembership.pending, (state) => {
        state.EditSubmissionStatus = "loading";
      })
      .addCase(submitEditMembership.rejected, (state, action) => {
        state.EditSubmissionStatus = "rejected";
        logger.warn("submitEditMembership::REJECTED", action.error);
      })
      .addCase(submitEditMembership.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditMembership::FULFILLED", { payload });

        state.EditSubmissionStatus = "fulfilled";
      })

       // topUpMembership
       .addCase(topUpMembership.pending, (state) => {
        state.topUpMembershipStatus = "loading";
      })
      .addCase(topUpMembership.rejected, (state, action) => {
        state.topUpMembershipStatus = "rejected";
        logger.warn("topUpMembership::REJECTED", action.error);
      })
      .addCase(topUpMembership.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("topUpMembership::FULFILLED", { payload });

        state.topUpMembershipStatus = "fulfilled";
      })

      // deleteMembership
      .addCase(deleteMembership.pending, (state) => {
        state.deleteMembershipStatus = "loading";
      })
      .addCase(deleteMembership.rejected, (state, action) => {
        state.deleteMembershipStatus = "rejected";
        logger.warn("deleteMembership::REJECTED", action.error);
      })
      .addCase(deleteMembership.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteMembership::FULFILLED");

        state.deleteMembershipStatus = "fulfilled";
      })

      //fetchvar
      .addCase(fetchMembershipList.pending, (state) => {
        state.fetchMembershipListStatus = "loading";
      })
      .addCase(fetchMembershipList.rejected, (state, action) => {
        state.fetchMembershipListStatus = "rejected";
        logger.warn("fetchMembershipList::REJECTED", action.error);
      })
      .addCase(fetchMembershipList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchMembershipList::FULFILLED", { payload });

        state.fetchMembershipListStatus = "fulfilled";
        const data = action.payload;
        state.membershipList = data.memberships;
        state.membership_lists = data.membership_list;
        state.clientsList = data.clients;
      })
      //
      .addCase(fetchExistingMembership.pending, (state) => {
        state.existingMembershipStatus = "loading";
      })
      .addCase(fetchExistingMembership.rejected, (state, action) => {
        state.existingMembershipStatus = "rejected";
        logger.log("fetchExistingMembership::REJECTED", action.error);
      })
      .addCase(fetchExistingMembership.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingMembership::FULFILLED", { payload });

        state.existingMembershipStatus = "fulfilled";

        const membership = action.payload;
        console.log("Membeship is returned");
        state.existingMembership = membership;
        state.existingMembershipId = membership?.id ?? null;
      })

    // END
  },
});

export default membership.reducer;
