import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("JobSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BETA_API_URL = process?.env?.NEXT_PUBLIC_BETA_API_URL ?? API_URL;

const TRANSACTION_MODE = process.env.NEXT_PUBLIC_TRANSACTION_MODE ?? "async";
const MODE_ASYNC = TRANSACTION_MODE === "async";

const initialState = {
  suspensionStatus: "idle",
  suspendedTransaction: null,
  suspensionStatus: "idle",
  order_transaction_id: null,
  suspendedTransaction: null,
  jobList: null,
  taskList: null,
  jobData: null,
  jobListStatus: "idle",
  submitJobCardStatus: "idle",
  job_card_data: null,
  submitLaundryItemStatus: "idle",
  updateVariationStatus: "idle",
  updateJobTransactionStatus: "idle",
  fetchJobsList: [],
  fetchJobsListStatus: "idle",
  fetchJobTasksStatus: "idle",
  variation_vals: [],
  selected_index: null,
  fetchStagesListStatus: "idle",
  stagesList: [],
  updatestageStatus: "idle",
  updateInfo: null,
  job_card: null,
  task_id: null,
  service_values: [],
  task_data: [],
  getJobCardsPDF: null,
  getJobCardsPDFStatus: "idle",
  getSingleJobCardsPDF: null,
  getSingleJobCardsPDFStatus: "idle",
  laundryItemsList: null,
  laundryItemsData: null,
  laundryItemsListStatus: "idle",
  deleteJobStatus: "idle",
  existingJob: null,
  existingJobStatus: "idle",
  tasks: [],
  task_items: [],
};

export const fetchJobsList = createAsyncThunk(
  "jobs/fetchJobsList",
  async ({
    accessToken = null,
    startDate = null,
    endDate = null,
    selected_client = null,
    status = null,
    filter = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/job-cards?`;

    const params = {};
    if (filter) {
      params["search_term"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }

    if (endDate) {
      params["end_date"] = endDate;
    }

    if (selected_client) {
      params["selected_client"] = selected_client;
    }

    if (status) {
      params["status"] = status;
    }
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchJobsList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchJobsList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchLaundryItems = createAsyncThunk(
  "job/fetchLaundryItems",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/laundry-items`;

    const startTime = new Date();
    logger.log("fetchLaundryItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchLaundryItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchJobTasks = createAsyncThunk(
  "jobs/fetchJobTasks",
  async ({
    accessToken = null,
    startDate = null,
    endDate = null,
    selected_staff = null,
    filter = null,
    job_card_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/tasks?`;

    const params = {};
    if (filter) {
      params["search_term"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }

    if (endDate) {
      params["end_date"] = endDate;
    }

    if (selected_staff) {
      params["selected_staff"] = selected_staff;
    }
    if (job_card_id) {
      params["job_card_id"] = job_card_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchJobTasks::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchJobTasks::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const createOrderTransaction = createAsyncThunk(
  "posTransaction/createOrderTransaction",
  async ({
    accessToken = null,
    table_id = null,
    client_id = null,
    payment_methods = [],
    branch_id = null,
    transaction_id = null,
    task_item = null,
    cost = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${BETA_API_URL}/transactions/suspend`;
    if (!MODE_ASYNC) {
      url = `${BETA_API_URL}/transactions-sync/suspend`;
    }

    let body = {};
    body["client_id"] = client_id;
    body["table_id"] = table_id;
    body["payment_methods"] = payment_methods;
    body["branch_id"] = branch_id;

    body["transaction_items"] = task_item;

    if (transaction_id) {
      body["transaction_id"] = transaction_id;
    }

    body["cost"] = cost;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("createOrderTransaction::BEGIN", body);
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
      logger.log("createOrderTransaction::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getJobCardsPDF = createAsyncThunk(
  "products/getJobCardsPdf",
  async ({ page = null, accessToken = null, transfer_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/job-cards-pdf?`;
    }

    const params = {};

    params["transfer_id"] = transfer_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getJobCardsPdf::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getJobCardsPdf::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `JobCards.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const getSingleJobCardsPDF = createAsyncThunk(
  "products/getSingleJobCardsPDF",
  async ({ page = null, accessToken = null, job_card_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/single-job-card-pdf?`;
    }

    const params = {};

    params["job_card_id"] = job_card_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getSingleJobCardsPDF::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getSingleJobCardsPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `SingleCards.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const updateJobTransaction = createAsyncThunk(
  "jobs/updateJobTransaction",
  async ({
    accessToken = null,
    job_card_id = null,
    transaction_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/update-job-transaction?`;

    const params = {};

    params["job_card_id"] = job_card_id;

    params["transaction_id"] = transaction_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("updateJobTransaction::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateJobTransaction::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateStage = createAsyncThunk(
  "jobs/updateStage",
  async ({
    accessToken = null,
    task_id = null,
    destination_stage = null,
    job_card_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/update-stage?`;

    const params = {};

    params["task_id"] = task_id;

    params["destination_stage"] = destination_stage;
    params["job_card_id"] = job_card_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("updateStage::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateStage::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStagesList = createAsyncThunk(
  "jobs/fetchStagesList",
  async ({ accessToken = null, job_card_id = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/stages?`;

    const params = {};

    params["job_card_id"] = job_card_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStagesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStagesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async ({ accessToken = null, id = null } = {}) => {
    if (!accessToken || !id) {
      console.log(id);
      return;
    }

    let url = `${API_URL}/job-cards/${id}?`;

    const startTime = new Date();
    logger.log("deleteJob::BEGIN");
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
      logger.log("deleteJob::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVariationValue = createAsyncThunk(
  "jobs/getVariationValue",
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

export const submitJobCard = createAsyncThunk(
  "jobs/submitJobCard",
  async ({
    accessToken = null,
    job_name = null,
    branch_id = null,
    tasks = null,
    start_date = null,
    end_date = null,
    description = null,
    client_id = null,
    service_values = null,
    is_laundry = null,
    service_data = null,
    selected_product = null,
    send_sms,
    send_email,
    req_id,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/job-cards?`;
    const params = {};
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    let body = {};

    body["job_name"] = job_name;
    body["tasks"] = tasks;
    body["start_date"] = start_date;
    body["end_date"] = end_date;
    body["client_id"] = client_id;
    body["selected_product"] = selected_product;
    body["description"] = description;
    body["is_laundry"] = is_laundry;
    body["service_values"] = service_values;
    body["service_data"] = service_data;
    body["req_id"] = req_id;
    body["send_sms"] = send_sms;
    body["send_email"] = send_email;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitJobCard::BEGIN", body);
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
      logger.log("submitJobCard::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitLaundryItem = createAsyncThunk(
  "jobs/submitLaundryItem",
  async ({
    accessToken = null,
    name = null,
    product_values = null,
    product_type = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/laundry-items`;

    let body = {};

    body["name"] = name;
    body["product_values"] = product_values;
    body["product_type"] = product_type;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitLaundryItem::BEGIN", body);
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
      logger.log("submitLaundryItem::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Product
export const fetchExistingJob = createAsyncThunk(
  "products/fetchExistingJob",
  async ({ accessToken = null, job_card_id = null } = {}) => {
    if (!accessToken || !job_card_id) {
      return;
    }

    let url = `${API_URL}/single-job-card/${job_card_id}?`;

    const startTime = new Date();
    logger.log("fetchExistingJob::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingJob:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateVariation = createAsyncThunk(
  "jobs/updateVariation",
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
    logger.log("submitJobCard::BEGIN", body);
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
      logger.log("submitJobCard::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const job = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobCardId(state, action) {
      const { job_card } = action?.payload;
      state.job_card = job_card;
    },
    setTaskId(state, action) {
      const { task_id } = action?.payload;
      state.task_id = task_id;
    },
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
    clearOrderTransId(state) {
      state.order_transaction_id = null;
    },
    updateStageId(state, action) {
      let spread_stages = [...state.stagesList];
      const vals = action.payload;
      //console.log(action.payload);
      // spread_stages[vals.drop_id].tasks[vals.stage_index]['stage_id']=vals.stage_id;
      spread_stages[vals.drop_id].tasks.splice(vals.stage_index, 1);
      spread_stages[vals.destination_droppable].tasks.splice(
        vals.destination_index,
        0,
        vals.drag_item
      );

      state.stagesList = spread_stages;
      //console.log(state.stagesList);
    },
    setTaskData(state, action) {
      let spread_task_data = [...state.task_data];
      const { item } = action.payload;
      console.log("this are the items " + item?.id);

      if (spread_task_data.some((el) => el.id === item.id)) {
        return;
      }
      spread_task_data.push({
        service_id: item?.service_id,
        item_tasks: item.item_tasks,
        start_date: item?.start_date,
        end_date: item.end_date,
        assignees: item.staff_tasks,
        charge_type: item?.charge_type,
        unit_of_measure: item?.unit_of_measure,
        id: item?.id,
      });
      state.task_data = spread_task_data;
    },
  },
  extraReducers(builder) {
    builder
      // submitJobCardData
      .addCase(submitJobCard.pending, (state) => {
        state.submitJobCardStatus = "loading";
      })
      .addCase(submitJobCard.rejected, (state, action) => {
        state.submitJobCardStatus = "rejected";
        logger.warn("submitJobCard::REJECTED", action.error);
      })
      .addCase(submitJobCard.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitJobCard::FULFILLED", { payload });

        state.submitJobCardStatus = "fulfilled";
        state.job_card_data = payload;
      })

      // submit laundry item
      .addCase(submitLaundryItem.pending, (state) => {
        state.submitLaundryItemStatus = "loading";
      })
      .addCase(submitLaundryItem.rejected, (state, action) => {
        state.submitLaundryItemStatus = "rejected";
        logger.warn("submitLaundryItem::REJECTED", action.error);
      })
      .addCase(submitLaundryItem.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitLaundryItem::FULFILLED", { payload });

        state.submitLaundryItemStatus = "fulfilled";
      })

      .addCase(createOrderTransaction.pending, (state) => {
        state.suspensionStatus = "loading";
      })
      .addCase(createOrderTransaction.rejected, (state, action) => {
        state.suspensionStatus = "rejected";
        logger.warn("createOrderTransaction::REJECTED", action.error);
      })
      .addCase(createOrderTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("createOrderTransaction::FULFILLED", { payload });

        state.suspensionStatus = "fulfilled";
        state.order_transaction_id = payload.id;

        // if (MODE_ASYNC) {
        //   state.submittedSagaId = action.payload?.saga_id ?? null;
        // } else {
        //   state.submittedTransaction = action.payload;
        // }
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

      // deleteBranch
      .addCase(deleteJob.pending, (state) => {
        state.deleteJobStatus = "loading";
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleteJobStatus = "rejected";
        logger.warn("deleteJob::REJECTED", action.error);
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteJob::FULFILLED");

        state.deleteJobStatus = "fulfilled";
      })

      //fetchJobsList
      .addCase(fetchJobsList.pending, (state) => {
        state.fetchJobsListStatus = "loading";
      })
      .addCase(fetchJobsList.rejected, (state, action) => {
        state.fetchJobsListStatus = "rejected";
        logger.warn("fetchJobsList::REJECTED", action.error);
      })
      .addCase(fetchJobsList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchJobsList::FULFILLED", { payload });

        state.fetchJobsListStatus = "fulfilled";
        state.jobList = action.payload;
      })

      //
      .addCase(fetchExistingJob.pending, (state) => {
        state.existingJobStatus = "loading";
      })
      .addCase(fetchExistingJob.rejected, (state, action) => {
        state.existingJobStatus = "rejected";
        logger.log("fetchExistingJob::REJECTED", action.error);
      })
      .addCase(fetchExistingJob.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingJob::FULFILLED", { payload });

        state.existingJobStatus = "fulfilled";

        const job = action.payload;
        state.existingJob = job;
        // state.existingProductId = product?.id ?? null;
      })

      //fetchLaundryItems
      .addCase(fetchLaundryItems.pending, (state) => {
        state.laundryItemsListStatus = "loading";
      })
      .addCase(fetchLaundryItems.rejected, (state, action) => {
        state.laundryItemsListStatus = "rejected";
        logger.warn("fetchLaundryItems::REJECTED", action.error);
      })
      .addCase(fetchLaundryItems.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchLaundryItems::FULFILLED", { payload });

        state.laundryItemsListStatus = "fulfilled";
        state.laundryItemsList = action.payload.list;
        state.laundryItemsData = action.payload.data;
      })

      //fetchJobTasks
      .addCase(fetchJobTasks.pending, (state) => {
        state.fetchJobTasksStatus = "loading";
      })
      .addCase(fetchJobTasks.rejected, (state, action) => {
        state.fetchJobTasksStatus = "rejected";
        logger.warn("fetchJobTasks::REJECTED", action.error);
      })
      .addCase(fetchJobTasks.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchJobTasks::FULFILLED", { payload });

        state.fetchJobTasksStatus = "fulfilled";
        state.taskList = action.payload;
      })

      //fetchJobsList
      .addCase(fetchStagesList.pending, (state) => {
        state.fetchStagesListStatus = "loading";
      })
      .addCase(fetchStagesList.rejected, (state, action) => {
        state.fetchStagesListStatus = "rejected";
        logger.warn("fetchStagesList::REJECTED", action.error);
      })
      .addCase(fetchStagesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchStagesList::FULFILLED", { payload });

        state.fetchStagesListStatus = "fulfilled";
        state.stagesList = action.payload;
      })

      // PDF Data
      .addCase(getJobCardsPDF.pending, (state) => {
        state.getJobCardsPDFStatus = "loading";
      })
      .addCase(getJobCardsPDF.rejected, (state) => {
        state.getJobCardsPDFStatus = "rejected";
        logger.log("getJobCardsPDFStatus::REJECTED");
      })
      .addCase(getJobCardsPDF.fulfilled, (state, action) => {
        state.getJobCardsPDFStatus = "fulfilled";
        state.getJobCardsPDF = action.payload;
      })

      // Single PDF Data
      .addCase(getSingleJobCardsPDF.pending, (state) => {
        state.getSingleJobCardsPDFStatus = "loading";
      })
      .addCase(getSingleJobCardsPDF.rejected, (state) => {
        state.getSingleJobCardsPDFStatus = "rejected";
        logger.log("getSingleJobCardsPDFStatus::REJECTED");
      })
      .addCase(getSingleJobCardsPDF.fulfilled, (state, action) => {
        state.getSingleJobCardsPDFStatus = "fulfilled";
        state.getSingleJobCardsPDF = action.payload;
      })

      //update stage
      .addCase(updateStage.pending, (state) => {
        state.updatestageStatus = "loading";
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.updatestageStatus = "rejected";
        logger.warn("updateStage::REJECTED", action.error);
      })
      .addCase(updateStage.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("updateStage::FULFILLED", { payload });

        state.updatestageStatus = "fulfilled";
        state.updateInfo = action.payload;
      })

      //update stage
      .addCase(updateJobTransaction.pending, (state) => {
        state.updateJobTransactionStatus = "loading";
      })
      .addCase(updateJobTransaction.rejected, (state, action) => {
        state.updateJobTransactionStatus = "rejected";
        logger.warn("updateJobTransaction::REJECTED", action.error);
      })
      .addCase(updateJobTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("updateJobTransaction::FULFILLED", { payload });

        state.updateJobTransactionStatus = "fulfilled";
        state.updateInfo = action.payload;
      });

    // END
  },
});

export const { setJobCardId, clearOrderTransId, updateStageId, setTaskData } =
  job.actions;

export default job.reducer;
