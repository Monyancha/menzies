import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("ClientSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  clientDetails: null,
  clientDetailsStatus: "idle",

  clientList: null,
  clientListStatus: "idle",

  clientSoAStatus: "idle",
  clientSoA: null,

  template_status: null,
  checkTemplatesStatus: "idle",

  //specialOccassions
  specialOccassions: null,
  specialOccassionsStatus: "idle",

  //specialOccassionsDetails
  specialOccassionsDetails: null,
  specialOccassionsDetailsStatus: "idle",

  clientFormData: null,
  clientFormDataStatus: "idle",

  //getClientMessages
  getClientMessages: null,
  getClientMessagesStatus: "idle",

  //getClientDashboard
  getClientDashboard: null,
  getClientDashboardStatus: "idle",

  //getClientBookings
  getClientBookings: null,
  getClientBookingsStatus: "idle",

  //getCustomerCategories
  getCustomerCategories: null,
  getCustomerCategoriesStatus: "idle",

  //getAllCustomerCategories
  getAllCustomerCategories: null,
  getAllCustomerCategoriesStatus: "idle",

  //getCategoryCustomers
  getCategoryCustomers: null,
  getCategoryCustomersStatus: "idle",

  //getHighSpendingCustomers
  getHighSpendingCustomers: null,
  getHighSpendingCustomersStatus: "idle",

  //Frequent Customers
  frequentCustomers: null,
  frequentCustomersStatus: "idle",

  //New Customers
  newCustomers: null,
  newCustomersStatus: "idle",

  //Churning Customers
  churningCustomers: null,
  churningCustomersStatus: "idle",

  //Customer Category Settings
  customerCategorySettings: null,
  customerCategorySettingsStatus: "idle",

  //getLowSpendingCustomers
  getLowSpendingCustomers: null,
  getLowSpendingCustomersStatus: "idle",

  submissionStatus: "idle",
};

export const fetchClientSoA = createAsyncThunk(
  "clients/fetchClientSoA",
  async ({
    clientId = null,
    accessToken = null,

    page = null,
    filter = null,
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
      url = `${API_URL}/partners/clients/${clientId}/statement_of_accounts?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchClientSoA::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchClientSoA::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchClientDetails = createAsyncThunk(
  "clients/fetchClientDetails",
  async ({ clientId = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/clients/${clientId}?`;

    const startTime = new Date();
    logger.log("fetchClientDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchClientDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    branch_id = null,
    detailed = false,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/clients?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (detailed) {
      params["detailed"] = true;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchClients::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchClients::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//customerCategorySettings
export const customerCategorySettings = createAsyncThunk(
  "clients/customerCategorySettings",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/customer/categories/settings`;

    const startTime = new Date();
    logger.log("customerCategorySettings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("customerCategorySettings::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getHighSpendingCustomers
export const getHighSpendingCustomers = createAsyncThunk(
  "clients/getHighSpendingCustomers",
  async ({
    page = null,
    accessToken = null,
    filter = null,
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
      url = `${API_URL}/customer/categories/high-spending-customers?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getHighSpendingCustomers::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getHighSpendingCustomers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getLowSpendingCustomers
export const getLowSpendingCustomers = createAsyncThunk(
  "clients/getLowSpendingCustomers",
  async ({
    page = null,
    accessToken = null,
    filter = null,
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
      url = `${API_URL}/customer/categories/low-spending-customers?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getLowSpendingCustomers::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLowSpendingCustomers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Frequent Customers
export const frequentCustomers = createAsyncThunk(
  "clients/frequentCustomers",
  async ({
    page = null,
    accessToken = null,
    filter = null,
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
      url = `${API_URL}/customer/categories/frequent-customers?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("frequentCustomers::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("frequentCustomers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//New Customers
export const newCustomers = createAsyncThunk(
  "clients/newCustomers",
  async ({
    page = null,
    accessToken = null,
    filter = null,
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
      url = `${API_URL}/customer/categories/new-customers?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("newCustomers::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("newCustomers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Churning Customers
export const churningCustomers = createAsyncThunk(
  "clients/churningCustomers",
  async ({
    page = null,
    accessToken = null,
    filter = null,
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
      url = `${API_URL}/customer/categories/churning-customers?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("churningCustomers::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("churningCustomers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Get Customer Categories
export const getCustomerCategories = createAsyncThunk(
  "clients/getCustomerCategories",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/customer/categories?`;
    }

    const startTime = new Date();
    logger.log("fetchCustomerCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCustomerCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getCategoryCustomers
export const getCategoryCustomers = createAsyncThunk(
  "clients/getCategoryCustomers",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    categoryId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/customer/categories/list?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (categoryId) {
      params["categoryId"] = categoryId;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getCategoryCustomers::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCategoryCustomers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//

//getAllCustomerCategories
export const getAllCustomerCategories = createAsyncThunk(
  "clients/getAllCustomerCategories",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/customer/categories/all`;

    const startTime = new Date();
    logger.log("getAllCustomerCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAllCustomerCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//specialOccassions
export const specialOccassions = createAsyncThunk(
  "clients/specialOccassions",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/clients/special-occasions?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("specialOccassions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("specialOccassions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//specialOccassionsDetails
export const specialOccassionsDetails = createAsyncThunk(
  "clients/specialOccassionsDetails",
  async ({ accessToken = null, occassionId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/clients/special-occasion/show/${occassionId}`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("specialOccassionsDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("specialOccassionsDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getClientBookings = createAsyncThunk(
  "clients/getClientBookings",
  async ({
    page = null,
    accessToken = null,
    clientId = null,
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
      url = `${API_URL}/partners/clients/${clientId}/client-bookings?`;
    }

    const params = {};

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getClientBookings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getClientBookings::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getClientDashboard
export const getClientDashboard = createAsyncThunk(
  "clients/getClientDashboard",
  async ({ accessToken = null, clientId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/clients/${clientId}/client-dashboard`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getClientDashboard::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getClientDashboard::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getClientMessages
export const getClientMessages = createAsyncThunk(
  "clients/getClientMessages",
  async ({ accessToken = null, clientId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/clients/${clientId}/client-messages`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getClientMessages::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getClientMessages::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchClientFormData = createAsyncThunk(
  "clients/fetchClientFormData",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/client-form-data`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchClientFormData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchClientFormData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const checkClientPoints = createAsyncThunk(
  "clients/checkClientPoints",
  async ({ accessToken = null, client_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/check-client-points/${client_id}`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("checkClientPoints::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("checkClientPoints::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const checkTemplateStatus = createAsyncThunk(
  "clients/checkTemplateStatus",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/check-template-status`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("checkTemplateStatus::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("checkTemplateStatus::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitClient = createAsyncThunk(
  "posTransaction/submitClient",
  async ({
    accessToken = null,
    branch_id = null,
    name = null,
    email = null,
    phone = null,
    dob = null,
    house_no = null,
    street_name = null,
    estate = null,
    city = null,
    gender = null,
    car_model = null,
    car_plate = null,
    car_series = null,
    car_year = null,
    car_type = null,
    allergies = null,
    med_condition = null,
    //Additional
    prev_treatment = null,
    prev_procedure = null,
    blood_pressure = null,
    body_weight = null,
    hair_type = null,
    next_of_kin_contact = null,
    blood_type = null,
    skin_type = null,
    //Customer Category
    customerCategory = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/clients?`;
    const params = {};
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    let body = {};

    body["name"] = name;
    body["email"] = email;
    body["phone"] = phone;
    body["dob"] = dob;
    body["street_name"] = street_name;
    body["house_no"] = house_no;
    body["estate"] = estate;
    body["city"] = city;
    body["gender"] = gender;
    body["car_model"] = car_model;
    body["car_plate"] = car_plate;
    body["car_series"] = car_series;
    body["car_year"] = car_year;
    body["car_type"] = car_type;

    body["house_no"] = house_no;
    body["street_name"] = street_name;
    body["city"] = city;
    body["estate"] = estate;

    //
    body["allergies"] = allergies;
    body["med_condition"] = med_condition;

    //Additional
    body["prev_treatment"] = prev_treatment;
    body["prev_procedure"] = prev_procedure;
    body["blood_pressure"] = blood_pressure;
    body["body_weight"] = body_weight;
    body["hair_type"] = hair_type;
    body["next_of_kin_contact"] = next_of_kin_contact;

    body["blood_type"] = blood_type;
    body["skin_type"] = skin_type;

    if (customerCategory) {
      body["category_id"] = customerCategory;
    }

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitClient::BEGIN", body);
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
      logger.log("submitClient::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const clients = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClientSoA.pending, (state) => {
        state.clientSoAStatus = "loading";
      })
      .addCase(fetchClientSoA.rejected, (state, action) => {
        state.clientSoAStatus = "rejected";
        logger.log("fetchClientSoA::REJECTED", action.error);
      })
      .addCase(fetchClientSoA.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchClientSoA::FULFILLED", { payload });

        state.clientSoAStatus = "fulfilled";
        state.clientSoA = action.payload;
      })

      .addCase(fetchClientDetails.pending, (state) => {
        state.clientDetailsStatus = "loading";
      })
      .addCase(fetchClientDetails.rejected, (state, action) => {
        state.clientDetailsStatus = "rejected";
        logger.log("fetchClientDetails::REJECTED", action.error);
      })
      .addCase(fetchClientDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchClientDetails::FULFILLED", { payload });

        state.clientDetailsStatus = "fulfilled";
        state.clientDetails = action.payload;
      })

      .addCase(fetchClients.pending, (state) => {
        state.clientListStatus = "loading";
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.clientListStatus = "rejected";
        logger.log("fetchClients::REJECTED", action.error);
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchClients::FULFILLED", { payload });

        state.clientListStatus = "fulfilled";
        state.clientList = action.payload;
      })

      //getClientMessages
      .addCase(getClientMessages.pending, (state) => {
        state.getClientMessagesStatus = "loading";
      })
      .addCase(getClientMessages.rejected, (state, action) => {
        state.getClientMessagesStatus = "rejected";
        logger.log("getClientMessages::REJECTED", action.error);
      })
      .addCase(getClientMessages.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getClientMessages::FULFILLED", { payload });

        state.getClientMessagesStatus = "fulfilled";
        state.getClientMessages = action.payload;
      })

      //customerCategorySettings
      .addCase(customerCategorySettings.pending, (state) => {
        state.customerCategorySettingsStatus = "loading";
      })
      .addCase(customerCategorySettings.rejected, (state, action) => {
        state.customerCategorySettingsStatus = "rejected";
        logger.log("customerCategorySettings::REJECTED", action.error);
      })
      .addCase(customerCategorySettings.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("customerCategorySettings::FULFILLED", { payload });

        state.customerCategorySettingsStatus = "fulfilled";
        state.customerCategorySettings = action.payload;
      })

      //getLowSpendingCustomers
      .addCase(getLowSpendingCustomers.pending, (state) => {
        state.getLowSpendingCustomersStatus = "loading";
      })
      .addCase(getLowSpendingCustomers.rejected, (state, action) => {
        state.getLowSpendingCustomersStatus = "rejected";
        logger.log("getLowSpendingCustomers::REJECTED", action.error);
      })
      .addCase(getLowSpendingCustomers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getLowSpendingCustomers::FULFILLED", { payload });

        state.getLowSpendingCustomersStatus = "fulfilled";
        state.getLowSpendingCustomers = action.payload;
      })

      //frequentCustomers
      .addCase(frequentCustomers.pending, (state) => {
        state.frequentCustomersStatus = "loading";
      })
      .addCase(frequentCustomers.rejected, (state, action) => {
        state.frequentCustomersStatus = "rejected";
        logger.log("frequentCustomers::REJECTED", action.error);
      })
      .addCase(frequentCustomers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("frequentCustomers::FULFILLED", { payload });

        state.frequentCustomersStatus = "fulfilled";
        state.frequentCustomers = action.payload;
      })

      //churningCustomers
      .addCase(churningCustomers.pending, (state) => {
        state.churningCustomersStatus = "loading";
      })
      .addCase(churningCustomers.rejected, (state, action) => {
        state.churningCustomersStatus = "rejected";
        logger.log("churningCustomers::REJECTED", action.error);
      })
      .addCase(churningCustomers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("churningCustomers::FULFILLED", { payload });

        state.churningCustomersStatus = "fulfilled";
        state.churningCustomers = action.payload;
      })

      //newCustomers
      .addCase(newCustomers.pending, (state) => {
        state.newCustomersStatus = "loading";
      })
      .addCase(newCustomers.rejected, (state, action) => {
        state.newCustomersStatus = "rejected";
        logger.log("newCustomers::REJECTED", action.error);
      })
      .addCase(newCustomers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("newCustomers::FULFILLED", { payload });

        state.newCustomersStatus = "fulfilled";
        state.newCustomers = action.payload;
      })

      //getHighSpendingCustomers
      .addCase(getHighSpendingCustomers.pending, (state) => {
        state.getHighSpendingCustomersStatus = "loading";
      })
      .addCase(getHighSpendingCustomers.rejected, (state, action) => {
        state.getHighSpendingCustomersStatus = "rejected";
        logger.log("getHighSpendingCustomers::REJECTED", action.error);
      })
      .addCase(getHighSpendingCustomers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getHighSpendingCustomers::FULFILLED", { payload });

        state.getHighSpendingCustomersStatus = "fulfilled";
        state.getHighSpendingCustomers = action.payload;
      })

      //getCustomerCategories
      .addCase(getCustomerCategories.pending, (state) => {
        state.getCustomerCategoriesStatus = "loading";
      })
      .addCase(getCustomerCategories.rejected, (state, action) => {
        state.getCustomerCategoriesStatus = "rejected";
        logger.log("getCustomerCategories::REJECTED", action.error);
      })
      .addCase(getCustomerCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getCustomerCategories::FULFILLED", { payload });

        state.getCustomerCategoriesStatus = "fulfilled";
        state.getCustomerCategories = action.payload;
      })

      //getCategoryCustomers
      .addCase(getCategoryCustomers.pending, (state) => {
        state.getCategoryCustomersStatus = "loading";
      })
      .addCase(getCategoryCustomers.rejected, (state, action) => {
        state.getCategoryCustomersStatus = "rejected";
        logger.log("getCategoryCustomers::REJECTED", action.error);
      })
      .addCase(getCategoryCustomers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getCategoryCustomers::FULFILLED", { payload });

        state.getCategoryCustomersStatus = "fulfilled";
        state.getCategoryCustomers = action.payload;
      })

      //getAllCustomerCategories
      .addCase(getAllCustomerCategories.pending, (state) => {
        state.getAllCustomerCategoriesStatus = "loading";
      })
      .addCase(getAllCustomerCategories.rejected, (state, action) => {
        state.getAllCustomerCategoriesStatus = "rejected";
        logger.log("getAllCustomerCategories::REJECTED", action.error);
      })
      .addCase(getAllCustomerCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getAllCustomerCategories::FULFILLED", { payload });

        state.getAllCustomerCategoriesStatus = "fulfilled";
        state.getAllCustomerCategories = action.payload;
      })

      //getClientDashboard
      .addCase(getClientDashboard.pending, (state) => {
        state.getClientDashboardStatus = "loading";
      })
      .addCase(getClientDashboard.rejected, (state, action) => {
        state.getClientDashboardStatus = "rejected";
        logger.log("getClientDashboard::REJECTED", action.error);
      })
      .addCase(getClientDashboard.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getClientDashboard::FULFILLED", { payload });

        state.getClientDashboardStatus = "fulfilled";
        state.getClientDashboard = action.payload;
      })
      //specialOccassions
      .addCase(specialOccassions.pending, (state) => {
        state.specialOccassionsStatus = "loading";
      })
      .addCase(specialOccassions.rejected, (state, action) => {
        state.specialOccassionsStatus = "rejected";
        logger.log("specialOccassions::REJECTED", action.error);
      })
      .addCase(specialOccassions.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("specialOccassions::FULFILLED", { payload });

        state.specialOccassionsStatus = "fulfilled";
        state.specialOccassions = action.payload;
      })

      //getClientBookings
      .addCase(getClientBookings.pending, (state) => {
        state.getClientBookingsStatus = "loading";
      })
      .addCase(getClientBookings.rejected, (state, action) => {
        state.getClientBookingsStatus = "rejected";
        logger.log("getClientBookings::REJECTED", action.error);
      })
      .addCase(getClientBookings.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getClientBookings::FULFILLED", { payload });

        state.getClientBookingsStatus = "fulfilled";
        state.getClientBookings = action.payload;
      })

      //specialOccassionsDetails
      .addCase(specialOccassionsDetails.pending, (state) => {
        state.specialOccassionsDetailsStatus = "loading";
      })
      .addCase(specialOccassionsDetails.rejected, (state, action) => {
        state.specialOccassionsDetailsStatus = "rejected";
        logger.log("specialOccassionsDetails::REJECTED", action.error);
      })
      .addCase(specialOccassionsDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("specialOccassionsDetails::FULFILLED", { payload });

        state.specialOccassionsDetailsStatus = "fulfilled";
        state.specialOccassionsDetails = action.payload;
      })

      .addCase(fetchClientFormData.pending, (state) => {
        state.clientFormDataStatus = "loading";
      })
      .addCase(fetchClientFormData.rejected, (state, action) => {
        state.clientFormDataStatus = "rejected";
        logger.log("fetchClientFormData::REJECTED", action.error);
      })
      .addCase(fetchClientFormData.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchClientFormData::FULFILLED", { payload });

        state.clientFormDataStatus = "fulfilled";
        state.clientFormData = action.payload;
      })

      //check template status
      .addCase(checkTemplateStatus.pending, (state) => {
        state.checkTemplatesStatus = "loading";
      })
      .addCase(checkTemplateStatus.rejected, (state, action) => {
        state.checkTemplatesStatus = "rejected";
        logger.log("checkTemplatesStatus::REJECTED", action.error);
      })
      .addCase(checkTemplateStatus.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("checkTemplatesStatus::FULFILLED", { payload });
        state.checkTemplatesStatus = "fulfilled";
        state.template_status =
          action.payload.template_status == "Two" ? true : false;
        console.log(
          "The template status is Second " + action.payload.template_status
        );
      })
      //
      .addCase(submitClient.pending, (state) => {
        state.submissionStatus = "loading";
      })
      .addCase(submitClient.rejected, (state, action) => {
        state.submissionStatus = "rejected";
        logger.warn("submitClient::REJECTED", action.error);
      })
      .addCase(submitClient.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitClient::FULFILLED", { payload });

        state.submissionStatus = "fulfilled";
      });
    //
  },
});

export default clients.reducer;
