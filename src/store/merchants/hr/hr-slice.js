import { debounce } from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../../lib/shared/logger";

const logger = getLogger("HrSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  membershipList: null,
  membership_lists:null,
  membershipListStatus: "idle",
  clientsList:null,

  submitShiftStatus: "idle",
  assignShiftStatus:"idle",
  EditSubmissionStatus: "idle",
  deleteShiftStatus: "idle",
  topUpMembershipStatus:"idle",

  leave_list: [],
  leave_request_list:[],
  fetchLeaveListStatus: "idle",
  fetchLeaveRequestsStatus:"idle",
  existingMembership:null,
  existingMembershipId:null,
  submitNewLeaveRequestStatus:"idle"

};

export const fetchLeaveList = createAsyncThunk(
  "leave/fetchLeaveList",
  async ({
     accessToken = null,
     filter = null,
     startDate = null,
     endDate = null,
     branch_id = null,
     selected_date=null
    } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/leaves?`;

    const params = {};



    if (filter) {
      params["filter"] = filter;
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if(selected_date)
    {
      params["selected_shift_attendance_date"] = selected_date;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);


    const startTime = new Date();
    logger.log("fetchLeaveList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchLeaveList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


export const fetchLeaveRequests = createAsyncThunk(
    "hr/fetchLeaveRequests",
    async ({
       accessToken = null,
       filter = null,
       startDate = null,
       endDate = null,
       branch_id = null,
       staff_id=null
      } = {}) => {
      if (!accessToken) {
        return;
      }
      let url = `${API_URL}/leave-requests?`;
  
      const params = {};
  
  
  
      if (filter) {
        params["filter"] = filter;
      }
  
      if (startDate) {
        params["start_date"] = startDate;
      }
      if (endDate) {
        params["end_date"] = endDate;
      }

      if (staff_id) {
        params["staff_id"] = staff_id;
      }
      
  
      params["branch_id"] = branch_id;
  
      url += new URLSearchParams(params);
  
  
      const startTime = new Date();
      logger.log("fetchLeaveRequests::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("fetchLeaveRequests::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

export const fetchExistingShift = createAsyncThunk(
  "shift/fetchExistingShift",
  async ({ accessToken = null,shiftId=null } = {}) => {
    if (!accessToken || !shiftId) {
      console.log(shiftId);
      return;
    }
    let url = `${API_URL}/shifts/${shiftId}`;
    console.log(url);

    const startTime = new Date();
    logger.log("fetchExistingShift::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingShift::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitNewLeave = createAsyncThunk(
  "hr/submitNewLeave",
  async ({
    accessToken = null,
    name = null,
    branch_id = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/leaves`;

    let body = {};

    body["name"] = name;
    body["branch_id"] = branch_id;


    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitNewLeave::BEGIN", body);
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
      logger.log("submitNewLeave::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitNewLeaveRequest = createAsyncThunk(
  "hr/submitNewLeaveRequest",
  async ({
    accessToken = null,
    staff_id = null,
    leave_type_id=null,
    start_date=null,
    end_date=null,
    comment=null,
    branch_id = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/leave-requests`;

    let body = {};

    body["staff_id"] = staff_id;
    body["leave_type_id"] = leave_type_id;
    body["start_date"] = start_date;
    body["end_date"] = end_date;
    body["comment"] = comment;
    body["branch_id"] = branch_id;


    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitNewLeaveRequest::BEGIN", body);
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
      logger.log("submitNewLeaveRequest::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);



export const topUpMembership = createAsyncThunk(
  "shift/topUpMembership",
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

export const deleteShift = createAsyncThunk(
  "shift/deleteShift",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/shifts/${itemId}`;

    const startTime = new Date();
    logger.log("deleteShift::BEGIN");
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
      logger.log("deleteShift::END", { took: seconds, data });

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

    let url = `${API_URL}/shifts/${id}`;
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

const hr = createSlice({
  name: "hr",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
     
      .addCase(submitNewLeave.pending, (state) => {
        state.submitNewLeaveStatus = "loading";
      })
      .addCase(submitNewLeave.rejected, (state, action) => {
        state.submitNewLeaveStatus = "rejected";
        logger.warn("submitNewLeave::REJECTED", action.error);
      })
      .addCase(submitNewLeave.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitNewLeave::FULFILLED", { payload });

        state.submitNewLeaveStatus = "fulfilled";
      })

      .addCase(submitNewLeaveRequest.pending, (state) => {
        state.submitNewLeaveRequestStatus = "loading";
      })
      .addCase(submitNewLeaveRequest.rejected, (state, action) => {
        state.submitNewLeaveRequestStatus = "rejected";
        logger.warn("submitNewLeaveRequest::REJECTED", action.error);
      })
      .addCase(submitNewLeaveRequest.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitNewLeaveRequest::FULFILLED", { payload });

        state.submitNewLeaveRequestStatus = "fulfilled";
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

      // deleteShift
      .addCase(deleteShift.pending, (state) => {
        state.deleteShiftStatus = "loading";
      })
      .addCase(deleteShift.rejected, (state, action) => {
        state.deleteShiftStatus = "rejected";
        logger.warn("deleteShift::REJECTED", action.error);
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteShift::FULFILLED");

        state.deleteShiftStatus = "fulfilled";
      })

      //fetchvar
      .addCase(fetchLeaveList.pending, (state) => {
        state.fetchLeaveListStatus = "loading";
      })
      .addCase(fetchLeaveList.rejected, (state, action) => {
        state.fetchLeaveListStatus = "rejected";
        logger.warn("fetchLeaveList::REJECTED", action.error);
      })
      .addCase(fetchLeaveList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchLeaveList::FULFILLED", { payload });

        state.fetchLeaveListStatus = "fulfilled";
        const data = action.payload;
        state.leave_list = data;
      })
       //fetchvar
       .addCase(fetchLeaveRequests.pending, (state) => {
        state.fetchLeaveListStatus = "loading";
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.fetchLeaveRequestsStatus = "rejected";
        logger.warn("fetchLeaveRequests::REJECTED", action.error);
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchLeaveRequests::FULFILLED", { payload });

        state.fetchLeaveRequestsStatus = "fulfilled";
        const data = action.payload;
        state.leave_request_list = data;
      })
      //
      .addCase(fetchExistingShift.pending, (state) => {
        state.existingMembershipStatus = "loading";
      })
      .addCase(fetchExistingShift.rejected, (state, action) => {
        state.existingMembershipStatus = "rejected";
        logger.log("fetchExistingShift::REJECTED", action.error);
      })
      .addCase(fetchExistingShift.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingShift::FULFILLED", { payload });

        state.existingMembershipStatus = "fulfilled";

        const membership = action.payload;
        console.log("Membeship is returned");
        state.existingMembership = membership;
        state.existingMembershipId = membership?.id ?? null;
      })

    // END
  },
});

export default hr.reducer;
