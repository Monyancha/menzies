import { debounce } from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("BranchesSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  branchesList: null,
  branchesListStatus: "idle",

  categoriesList: null,
  fetchCategoriesListStatus: "idle",
  fetchCategoriesList: [],

  submitBranchStatus: "idle",
  submitDepartmentStatus: "idle",
  assignBranchAccessStatus: "idle",
  EditSubmissionStatus: "idle",
  transferStockStatus: "idle",
  transferMultipleStockStatus: "idle",
  deleteBranchStatus: "idle",

  currentBranch: null,
  currentBranchStatus: "idle",

  fetchBranchesList: [],
  fetchBranchesListStatus: "idle",

  branchesDataList: null,
  departments_list: null,
  branches_transactions_totals: null,
  branch_names: null,
  fetchDepartmentsStatus: "idle",
  fetchBranchTransactionsStatus: "idle",
  fetchBranhesData: [],
  fetchBranchesDataStatus: "idle",
  staffAccessibleBranchesStatus: "idle",
  staffBranchesList: null,
  branch_id: null,
  transfer_ids: [],
  selected_index: null,
};

export const saveBranchesState = debounce((state) => {
  try {
    logger.info("Caching branches", { state });

    const branchesState = JSON.stringify(state);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("redux_cache_branches", branchesState);
    }
  } catch (e) {
    logger.warn("Could not cache branches", { error: e });
  }
}, 2000);

const loadBranchesState = () => {
  let state = initialState;
  try {
    logger.info("Loading branches", { state });
    let loadedState = null;
    if (typeof window !== "undefined") {
      loadedState = window.localStorage.getItem("redux_cache_branches");
    }
    if (loadedState) {
      state = JSON.parse(loadedState);
    }
  } catch (e) {
    logger.warn("Could not cache branches", { error: e });
  }

  return state;
};

export const fetchBranchesList = createAsyncThunk(
  "branches/fetchBranchesList",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/branches-list`;

    const startTime = new Date();
    logger.log("fetchBranchesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchBranchesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const staffAccessibleBranches = createAsyncThunk(
  "branches/staffAccessibleBranches",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = `${API_URL}/staff-accessible-branches/${staffId}`;

    const startTime = new Date();
    logger.log("staffAccessibleBranches::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("staffAccessibleBranches::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCategoriesList = createAsyncThunk(
  "categories/fetchCategoriesList",
  async () => {
    let url = `${API_URL}/categories-data`;

    const startTime = new Date();
    logger.log("fetchCategoriesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCategoriesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchBranchesData = createAsyncThunk(
  "branches/fetchBranchesData",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    detailed = false,
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/branches-data?`;
    }
    const params = {};

    if (filter) {
      params["filter"] = filter;
    }
    if (detailed) {
      params["detailed"] = true;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchBranchesData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchBranchesData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchBranchTransactions = createAsyncThunk(
  "branches/fetchBranchTransactions",
  async ({
    page = null,
    accessToken = null,
    lastXDays = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/branch-transactions?`;
    }
    const params = {};

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (lastXDays) {
      params["last_x_days"] = lastXDays;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchBranchTransactions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchBranchTransactions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchDepartments = createAsyncThunk(
  "branches/fetchDepartments",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/departments-list?`;
    }
    const params = {};

    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchDepartments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchDepartments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitBranch = createAsyncThunk(
  "BranchesSlice/submitBranch",
  async ({
    accessToken = null,
    name = null,
    email = null,
    phone = null,
    location = null,
    category_id = null,
    staff_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/branches-list`;

    let body = {};

    body["name"] = name;
    body["email"] = email;
    body["phone"] = phone;
    body["location"] = location;
    body["category_id"] = category_id;
    body["staff_id"] = staff_id;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitBranch::BEGIN", body);
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
      logger.log("submitBranch::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitDepartment = createAsyncThunk(
  "BranchesSlice/submitDepartment",
  async ({ accessToken = null, name = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/add-department`;

    let body = {};

    body["name"] = name;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitDepartment::BEGIN", body);
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
      logger.log("submitDepartment::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const assignBranchAccess = createAsyncThunk(
  "BranchesSlice/assignBranchAccess",
  async ({
    accessToken = null,
    staff_id = null,
    accessible_branches = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/accessible-branch`;

    let body = {};

    body["staff_id"] = staff_id;
    body["accessible_branches"] = accessible_branches;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("assignBranchAccess::BEGIN", body);
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
      logger.log("assignBranchAccess::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteBranch = createAsyncThunk(
  "BranchesSlice/deleteBranch",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/branches-list/${itemId}`;

    const startTime = new Date();
    logger.log("deleteBranch::BEGIN");
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
      logger.log("deleteBranch::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitEditBranch = createAsyncThunk(
  "BranchesSlice/submitEditBranch",
  async ({
    accessToken = null,
    id = null,
    name = null,
    email = null,
    phone = null,
    location = null,
    category_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/branches-list/${id}`;
    let body = {};

    body["name"] = name;
    body["email"] = email;
    body["phone"] = phone;
    body["location"] = location;
    body["phone"] = phone;
    body["category_id"] = category_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditBranch::BEGIN", body);
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
      logger.log("submitEditBranch::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitStockTransfer = createAsyncThunk(
  "BranchesSlice/submitStockTransfer",
  async ({
    accessToken = null,
    id = null,
    from_branch = null,
    to_branch = null,
    stock_to_transfer = null,
    current_stock = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transfer-stock/${id}`;
    let body = {};

    body["id"] = id;
    body["from_branch"] = from_branch;
    body["to_branch"] = to_branch;
    body["stock_to_transfer"] = stock_to_transfer;
    body["current_stock"] = current_stock;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitStockTransfer::BEGIN", body);
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
      logger.log("submitStockTransfer::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitMultipleStockTransfer = createAsyncThunk(
  "BranchesSlice/submitMultipleStockTransfer",
  async ({
    accessToken = null,
    product_details = [],
    from_branch = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transfer-multiple-stock?`;
    let body = {};

    body["product_details"] = product_details;
    body["from_branch"] = from_branch;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitMultipleStockTransfer::BEGIN", body);
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
      logger.log("submitMultipleStockTransfer::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const branches = createSlice({
  name: "branches",
  initialState: loadBranchesState(),
  reducers: {
    setBranchId(state, action) {
      const { branch_id } = action.payload;
      // console.log("this is the branch " +branch_id);
      state.branch_id = branch_id;
    },
    setTransferId(state, action) {
      const { transfer_id } = action.payload;

      if (state.transfer_ids.find((e) => e.id === transfer_id.id)) {
        state.transfer_ids.filter(function (item) {
          return item.id !== transfer_id.id;
        });
        console.log("ID Found" + transfer_id.id);
        //console.log(state.transfer_ids);
      } else {
        console.log("ID NOT");
        state.transfer_ids.push(transfer_id);
      }
    },
    setIndex(state, action) {
      const { index_id } = action.payload;
      state.selected_index = index_id;
    },
    setStockToTransfer(state, action) {
      const { stock_to_transfer } = action.payload;
      // state.transfer_ids[state.selected_index]['stock_to_transfer'] = stock_to_transfer;
      // state.transfer_ids = { ...state.transfer_ids[state.selected_index]['stock_to_transfer'],...action.payload};
      // state.transfer_ids[state.selected_index].likes(action.payload);
      const newArray = [...state.transfer_ids];
      newArray[state.selected_index]["stock_to_transfer"] = stock_to_transfer;
      state.transfer_ids = newArray;
      console.log(state.transfer_ids);
    },
    setBranchToTransfer(state, action) {
      const { branch_to_transfer } = action.payload;
      const newArray = [...state.transfer_ids];
      newArray[state.selected_index]["branch_to_transfer"] = branch_to_transfer;
      state.transfer_ids = newArray;
      console.log(state.transfer_ids);
    },
    clearTransfers(state) {
      state.transfer_ids.length = 0;
    },
  },
  extraReducers(builder) {
    builder
      // submitBranchData
      .addCase(submitBranch.pending, (state) => {
        state.submitBranchStatus = "loading";
      })
      .addCase(submitBranch.rejected, (state, action) => {
        state.submitBranchStatus = "rejected";
        logger.warn("submitBranch::REJECTED", action.error);
      })
      .addCase(submitBranch.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitBranch::FULFILLED", { payload });

        state.submitBranchStatus = "fulfilled";
      })

      // submitDepartmenData
      .addCase(submitDepartment.pending, (state) => {
        state.submitDepartmentStatus = "loading";
      })
      .addCase(submitDepartment.rejected, (state, action) => {
        state.submitDepartmentStatus = "rejected";
        logger.warn("submitDepartmen::REJECTED", action.error);
      })
      .addCase(submitDepartment.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitDepartmen::FULFILLED", { payload });

        state.submitDepartmentStatus = "fulfilled";
      })

      // submitEditBranch
      .addCase(submitEditBranch.pending, (state) => {
        state.EditSubmissionStatus = "loading";
      })
      .addCase(submitEditBranch.rejected, (state, action) => {
        state.EditSubmissionStatus = "rejected";
        logger.warn("submitEditBranch::REJECTED", action.error);
      })
      .addCase(submitEditBranch.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditBranch::FULFILLED", { payload });

        state.EditSubmissionStatus = "fulfilled";
      })

      // submitStockTransfer
      .addCase(submitStockTransfer.pending, (state) => {
        state.transferStockStatus = "loading";
      })
      .addCase(submitStockTransfer.rejected, (state, action) => {
        state.transferStockStatus = "rejected";
        logger.warn("submitStockTransfer::REJECTED", action.error);
      })
      .addCase(submitStockTransfer.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitStockTransfer::FULFILLED", { payload });

        state.transferStockStatus = "fulfilled";
      })

      // submitMultipleStockTransfer
      .addCase(submitMultipleStockTransfer.pending, (state) => {
        state.transferMultipleStockStatus = "loading";
      })
      .addCase(submitMultipleStockTransfer.rejected, (state, action) => {
        state.transferMultipleStockStatus = "rejected";
        logger.warn("submitStockTransfer::REJECTED", action.error);
      })
      .addCase(submitMultipleStockTransfer.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitMultipleStockTransfer::FULFILLED", { payload });

        state.transferMultipleStockStatus = "fulfilled";
      })

      //submit staff accessible branches
      // submitBranchData
      .addCase(assignBranchAccess.pending, (state) => {
        state.assignBranchAccessStatus = "loading";
      })
      .addCase(assignBranchAccess.rejected, (state, action) => {
        state.assignBranchAccessStatus = "rejected";
        logger.warn("assignBranchAccess::REJECTED", action.error);
      })
      .addCase(assignBranchAccess.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("assignBranchAccess::FULFILLED", { payload });

        state.assignBranchAccessStatus = "fulfilled";
      })

      // deleteBranch
      .addCase(deleteBranch.pending, (state) => {
        state.deleteBranchStatus = "loading";
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.deleteBranchStatus = "rejected";
        logger.warn("deleteBranch::REJECTED", action.error);
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteBranch::FULFILLED");

        state.deleteBranchStatus = "fulfilled";
      })

      //fetchvar
      .addCase(fetchBranchesList.pending, (state) => {
        state.branchesListStatus = "loading";
      })
      .addCase(fetchBranchesList.rejected, (state, action) => {
        state.branchesListStatus = "rejected";
        logger.warn("fetchBranchesList::REJECTED", action.error);
      })
      .addCase(fetchBranchesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchBranchesList::FULFILLED", { payload });

        state.branchesListStatus = "fulfilled";
        state.branchesList = action.payload;
      })

      //fetchBranchesData
      .addCase(fetchBranchesData.pending, (state) => {
        state.fetchBranchesDataStatus = "loading";
      })
      .addCase(fetchBranchesData.rejected, (state, action) => {
        state.fetchBranchesDataStatus = "rejected";
        logger.warn("fetchBranchesData::REJECTED", action.error);
      })
      .addCase(fetchBranchesData.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchBranchesData::FULFILLED", { payload });

        state.fetchBranchesDataStatus = "fulfilled";
        state.branchesDataList = action.payload;
      })

      //fetchDepartmentsData
      .addCase(fetchDepartments.pending, (state) => {
        state.fetchDepartmentsStatus = "loading";
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.fetchDepartmentsStatus = "rejected";
        logger.warn("fetchDepartments::REJECTED", action.error);
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchDepartments::FULFILLED", { payload });

        state.fetchDepartmentsStatus = "fulfilled";
        state.departments_list = action.payload;
      })

      //fetchBranchTransactions
      .addCase(fetchBranchTransactions.pending, (state) => {
        state.fetchBranchTransactionsStatus = "loading";
      })
      .addCase(fetchBranchTransactions.rejected, (state, action) => {
        state.fetchBranchTransactionsStatus = "rejected";
        logger.warn("fetchBranchTransactions::REJECTED", action.error);
      })
      .addCase(fetchBranchTransactions.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchBranchTransactions::FULFILLED", { payload });

        state.fetchBranchTransactionsStatus = "fulfilled";
        const data = action.payload;
        state.branch_names = data.branch_names;
        state.branches_transactions_totals = data.branch_totals;
      })

      //fetch staff branches
      .addCase(staffAccessibleBranches.pending, (state) => {
        state.staffAccessibleBranchesStatus = "loading";
      })
      .addCase(staffAccessibleBranches.rejected, (state, action) => {
        state.staffAccessibleBranchesStatus = "rejected";
        logger.warn("staffAccessibleBranches::REJECTED", action.error);
      })
      .addCase(staffAccessibleBranches.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("staffAccessibleBranches::FULFILLED", { payload });

        state.staffAccessibleBranchesStatus = "fulfilled";
        state.staffBranchesList = action.payload;
      })

      //fetchCategoriesList
      .addCase(fetchCategoriesList.pending, (state) => {
        state.fetchCategoriesListStatus = "loading";
      })
      .addCase(fetchCategoriesList.rejected, (state, action) => {
        state.fetchCategoriesListStatus = "rejected";
        logger.warn("fetchCategoriesList::REJECTED", action.error);
      })
      .addCase(fetchCategoriesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchCategoriesList::FULFILLED", { payload });

        state.fetchCategoriesListStatus = "fulfilled";
        state.categoriesList = action.payload;
      });

    // END
  },
});

export const {
  setBranchId,
  setTransferId,
  setIndex,
  setStockToTransfer,
  setBranchToTransfer,
  clearTransfers,
} = branches.actions;

export default branches.reducer;
