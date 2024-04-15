import { getData } from "../../../../lib/shared/fetch-api-helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../../lib/shared/logger";

const logger = getLogger("Inventory");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getMenuItems: null,
  getMenuItemsStatus: "idle",

  getProductDetails: null,
  getProductDetailsStatus: "idle",

  getMenuDetails: [],
  getMenuDetailsStatus: "idle",

  menuAccompsList: [],
  menuAccompsListStatus: "idle",

  getAdjustments: null,
  getAdjustmentStatus: "idle",

  getVendors: null,
  getVendorStatus: "idle",

  getVendorDetails: null,
  getVendorDetailsStatus: "idle",

  getPurchases: null,
  getPurchaseStatus: "idle",

  getServices: null,
  getServicesStatus: "idle",

  getServicesDetails: null,
  getServicesDetailsStatus: "idle",

  fetchBatchDetails: null,
  fetchBatchDetailsStatus: "idle",

  getAccompaniments: null,
  getAccompanimentsStatus: "idle",

  getAccoDetails: null,
  getAccoDetailsStatus: "idle",

  getContacts: null,
  getContactsStatus: "idle",

  contactList: null,
  contactListStatus: "idle",

  getContactDetails: null,
  getContactDetailsStatus: "idle",

  getComboSubItems: null,
  getComboSubItemsStatus: "idle",

  getVendorPurchases: null,
  getVendorPurchasesStatus: "idle",

  getVendorAdjustments: null,
  getVendorAdjustmentsStatus: "idle",

  getAdjustmentReq: null,
  getAdjustmentReqStatus: "idle",

  getRFQCompanies: null,
  getRFQCompaniesStatus: "idle",

  getRFQDetails: null,
  getRFQDetailsStatus: "idle",

  getBillDetails: null,
  getBillDetailsStatus: "idle",
  selectMenusStatus: "idle",
  selected_menus: null,

  //getBillPayments
  getBillPayments: null,
  getBillPaymentsStatus: "idle",

  //
  inventory_items_profits: null,
  inventoryItemsProfitStatus: "idle",
  service_items_totals: null,
  serviceItemsTotalStatus: "idle",

  //getProperties
  getProperties: null,
  getPropertiesStatus: "idle",

  //getIncome
  getIncome: null,
  getIncomeStatus: "idle",
  menu_ids:[],
  enableStockStatus:"idle",

  //getAssets
  getAssets: null,
  getAssetsStatus: "idle",

  //getLiabilities
  getLiabilities: null,
  getLiabilitiesStatus: "idle",

  leanServicesList: null,
  leanServicesStatus: "idle",

  //getRooms
  getRooms: null,
  getRoomsStatus: "idle",

  //getConferences
  getConferences: null,
  getConferencesStatus: "idle",

  //getCheckIns
  getCheckIns: null,
  getCheckInsStatus: "idle",

  //getFacilities
  getFacilities: null,
  getFacilitiesStatus: "idle",

  //getFacilityDetails
  getFacilityDetails: null,
  getFacilityDetailsStatus: "idle",

  //getRoomSizes
  getRoomSizes: null,
  getRoomSizesStatus: "idle",

  //getBeds
  getBeds: null,
  getBedsStatus: "idle",

  //getBookingTypes
  getBookingTypes: null,
  getBookingTypesStatus: "idle",

  //getComplementaries
  getComplementaries: null,
  getComplementariesStatus: "idle",

  //getRequirements
  getRoomRequirements: null,
  getRoomRequirementsStatus: "idle",

  //getReservations
  getReservations: null,
  getReservationsStatus: "idle",

  //getCheckins
  getCheckins: null,
  getCheckinsStatus: "idle",

  //getCheckouts
  getCheckouts: null,
  getCheckoutsStatus: "idle",

  //getRoomTypes
  getRoomTypes: null,
  getRoomTypesStatus: "idle",

  //getRoomInventory
  getRoomInventory: null,
  getRoomInventoryStatus: "idle",

  //getProductSellables
  getProductSellables: null,
  getProductSellablesStatus: "idle",

  //getChecklist
  getChecklist: null,
  getChecklistStatus: "idle",

  //getHouseKeeping
  getHouseKeeping: null,
  getHouseKeepingStatus: "idle",

  //getLands
  getLands: null,
  getLandsStatus: "idle",

};

//getLands
export const getLands = createAsyncThunk(
  "lands/getLands",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/lands?`;
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
    logger.log("getLands::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLands::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getHouseKeeping
export const getHouseKeeping = createAsyncThunk(
  "rooms/getHouseKeeping",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/house-keeping?`;
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
    logger.log("getHouseKeeping::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getHouseKeeping::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getChecklist
export const getChecklist = createAsyncThunk(
  "rooms/getChecklist",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/room-checklist?`;
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
    logger.log("getChecklist::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getChecklist::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getProductSellables
export const getProductSellables = createAsyncThunk(
  "rooms/getProductSellables",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/sellable-products?`;
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
    logger.log("getProductSellables::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductSellables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRoomInventory
export const getRoomInventory = createAsyncThunk(
  "rooms/getRoomInventory",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-inventories?`;
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
    logger.log("getRoomInventory::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomInventory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRoomTypes
export const getRoomTypes = createAsyncThunk(
  "rooms/getRoomTypes",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-types?`;
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
    logger.log("getRoomTypes::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomTypes::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


//getCheckins
export const getCheckins = createAsyncThunk(
  "rooms/getCheckins",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/checkins?`;
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
    logger.log("getCheckins::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCheckins::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getCheckouts
export const getCheckouts = createAsyncThunk(
  "rooms/getCheckouts",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/checkouts?`;
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
    logger.log("getCheckouts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCheckouts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getReservations
export const getReservations = createAsyncThunk(
  "rooms/getReservations",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/room-reservations?`;
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
    logger.log("getReservations::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getReservations::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getComplementaries
export const getComplementaries = createAsyncThunk(
  "rooms/getComplementaries",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/complementary?`;
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
    logger.log("getComplementaries::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getComplementaries::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getConferences
export const getConferences = createAsyncThunk(
  "rooms/getConferences",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/conferences?`;
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
    logger.log("getConferences::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getConferences::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRoomRequirements
export const getRoomRequirements = createAsyncThunk(
  "rooms/getRoomRequirements",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-requirements?`;
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
    logger.log("getRoomRequirements::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomRequirements::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


//getBookingTypes
export const getBookingTypes = createAsyncThunk(
  "rooms/getBookingTypes",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/booking-type-list?`;
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
    logger.log("getBookingTypes::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookingTypes::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getBeds
export const getBeds = createAsyncThunk(
  "rooms/getBeds",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/bed-list?`;
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
    logger.log("getBeds::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBeds::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRoomSizes
export const getRoomSizes = createAsyncThunk(
  "rooms/getRoomSizes",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-size?`;
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
    logger.log("getRoomSizes::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRoomSizes::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getFacilityDetails
export const getFacilityDetails = createAsyncThunk(
  "rooms/getFacilityDetails",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/facility-details?`;
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
    logger.log("getFacilityDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getFacilityDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getFacilities
export const getFacilities = createAsyncThunk(
  "rooms/getFacilities",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/room-facilities?`;
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
    logger.log("getFacilities::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getFacilities::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchLeanServices = createAsyncThunk(
  "services/fetchLeanServices",
  async ({ page = null, accessToken = null, filter = null,branch_id=null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/lean_services?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
   if(branch_id)
   {
    params["branch_id"] = branch_id;
   }
    url += new URLSearchParams(params);

    return await getData({ url, accessToken, logKey: "fetchLeanServices" });
  }
);

//Fetch Select Menus
export const fetchSelectMenus = createAsyncThunk(
  "inventory/fetchSelectMenus",
  async ({
    accessToken = null,
    search_string = null,
    page = null,
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
      url = `${API_URL}/all-menus?`;
    }

    const params = {};

    if (search_string) {
      params["search_string"] = search_string;
    }
    if (detailed) {
      params["detailed"] = true;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchSelectMenus::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSelectMenus:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getMenuItems = createAsyncThunk(
  "inventory/getMenuItems",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    branch_id = null,
    startDate = null,
    endDate = null,
    entries = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-items?`;
    }

    const params = {};

    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (entries) {
      params["entries"] = entries;
    }


    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getMenuItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getMenuItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Start Manufacturing
export const enableStock = createAsyncThunk(
  "products/enableStock",
  async ({
    accessToken = null,
    menu_ids = [],


  } = {}) => {
    if (!accessToken || !menu_ids) {
      return;
    }

    let url = `${API_URL}/enable-menu-stock`;
    let body = {};


    body["menu_ids"] = menu_ids;



    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("enableStock::BEGIN", body);
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
      logger.log("enableStock::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


export const getInventoryProfits = createAsyncThunk(
  "inventory/getInventoryProfits",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    branch_id = null,
    startDate = null,
    endDate = null,
    lastXDays = null,
    entries = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/items-profit?`;
    }

    const params = {};

    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (lastXDays) {
      params["last_x_days"] = lastXDays;
    }
    if (entries) {
      params["entries"] = entries;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getInventoryProfits::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInventoryProfits::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServiceTotalCounts = createAsyncThunk(
  "inventory/getServiceTotalCounts",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    branch_id = null,
    startDate = null,
    endDate = null,
    lastXDays = null,
    entries = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/service-totals-count?`;
    }

    const params = {};

    if (filter) {
      params["search_string"] = filter;
    }
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (lastXDays) {
      params["last_x_days"] = lastXDays;
    }
    if (entries) {
      params["entries"] = entries;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServiceTotalCounts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServiceTotalCounts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAdjustmentReq
export const getAdjustmentReq = createAsyncThunk(
  "adjustment/getAdjustmentReq",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/manual-adjustment-req`;

    const startTime = new Date();
    logger.log("getAdjustmentReq::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAdjustmentReq::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const createVendor = createAsyncThunk(
  "vendors/createVendor",
  async ({
    accessToken = null,

    body = {},
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/vendors/store`;

    logger.log("createVendor::BEGIN", body);
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
      logger.log("createVendor::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async ({
    accessToken = null,

    vendorId = null,
    body = {},
  } = {}) => {
    if (!accessToken || !vendorId) {
      return;
    }

    let url = `${API_URL}/vendors/update/${vendorId}`;

    logger.log("updateVendor::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "PATCH",
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
      logger.log("updateVendor::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteVendor = createAsyncThunk(
  "vendors/deleteVendor",
  async ({ accessToken = null, vendorId = null } = {}) => {
    if (!accessToken || !vendorId) {
      return;
    }

    let url = `${API_URL}/vendors/delete/${vendorId}?`;

    const startTime = new Date();
    logger.log("deleteVendor::BEGIN");
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
      logger.log("deleteVendor::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVendorPurchases = createAsyncThunk(
  "vendors/getVendorPurchases",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    vendorId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/vendors/${vendorId}/show-purchases?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getVendorPurchases::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendorPurchases::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVendorAdjustments = createAsyncThunk(
  "vendors/getVendorAdjustments",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    vendorId = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      if (vendorId) {
        url = `${API_URL}/vendors/${vendorId}/show-manual-adjustment?`;
      } else {
        url = `${API_URL}/supplier-manual-adjustments?`;
      }
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getVendorAdjustments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendorAdjustments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

///bill/show/{id}

export const getBillDetails = createAsyncThunk(
  "bills/getBillDetails",
  async ({ accessToken = null, billId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/bill/show/${billId}`;

    const startTime = new Date();
    logger.log("getBillDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBillDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAssets
export const getAssets = createAsyncThunk(
  "assets/getAssets",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/assets?`;
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
    logger.log("getAssets::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAssets::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getLiabilities
export const getLiabilities = createAsyncThunk(
  "assets/getLiabilities",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/liabilities?`;
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
    logger.log("getLiabilities::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLiabilities::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getProperties
export const getProperties = createAsyncThunk(
  "properties/getProperties",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/properties?`;
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
    logger.log("getProperties::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProperties::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getCheckIns
export const getCheckIns = createAsyncThunk(
  "rooms/getCheckIns",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/check-ins?`;
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
    logger.log("getCheckIns::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCheckIns::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRooms
export const getRooms = createAsyncThunk(
  "rooms/getRooms",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/rooms?`;
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
    logger.log("getRooms::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRooms::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getIncome
export const getIncome = createAsyncThunk(
  "income/getIncome",
  async ({
    accessToken = null,
    page = null,
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
      url = `${API_URL}/incomes?`;
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
    logger.log("getIncome::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getIncome::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getBillPayments
export const getBillPayments = createAsyncThunk(
  "bills/getBillPayments",
  async ({
    accessToken = null,
    billId = null,
    page = null,
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
      url = `${API_URL}/bill/payments/${billId}?`;
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
    logger.log("getBillPayments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBillPayments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getComboSubItems = createAsyncThunk(
  "inventory/getComboSubItems",
  async ({ accessToken = null, comboId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/combo/${comboId}/subitems/requirements`;

    const startTime = new Date();
    logger.log("getComboSubItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getComboSubItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getVendorDetails
export const getVendorDetails = createAsyncThunk(
  "vendors/getVendorDetails",
  async ({ accessToken = null, vendorId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/vendors/show/${vendorId}`;

    const startTime = new Date();
    logger.log("getVendorDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendorDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Menu Item Accompaniments
export const fetchMenuItemsAccomp = createAsyncThunk(
  "menu/fetchMenuItemsAccomp",
  async ({ id = null, accessToken = null } = {}) => {
    if (!accessToken || !id) {
      return;
    }

    let url = undefined;

    url = `${API_URL}/menu-items/get-menu-items-accomp/${id}`;

    const startTime = new Date();
    logger.log("fetchMenuItemsAccomp::BEGIN", { url });
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchMenuItemsAccomp::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getContactDetails
export const getContactDetails = createAsyncThunk(
  "contacts/getContactDetails",
  async ({ accessToken = null, vendorId = null, contactId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/vendors/${vendorId}/contact/${contactId}/show`;

    const startTime = new Date();
    logger.log("getContactDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getContactDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getProductDetails = createAsyncThunk(
  "inventory/getProductDetails",
  async ({ accessToken = null, productId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    console.log(productId);

    let url = `${API_URL}/products/${productId}`;

    const startTime = new Date();
    logger.log("getProductDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getMenuDetails = createAsyncThunk(
  "menu/getMenuDetails",
  async ({ accessToken = null, page = null, menuId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-items/${menuId}?`;
    }

    const startTime = new Date();
    logger.log("getMenuDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getMenuDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getAdjustments = createAsyncThunk(
  "adjustments/getAdjustments",
  async ({
    page = null,
    accessToken = null,
    branch_id = null,
    startDate = null,
    endDate = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/product-adjustment-list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
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
    logger.log("getAdjustments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAdjustments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    vendorId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/vendors/${vendorId}/contacts?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchContacts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchContacts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async ({
    accessToken = null,

    vendorId = null,
    body = {},
  } = {}) => {
    if (!accessToken || !vendorId) {
      return;
    }

    const url = `${API_URL}/vendors/${vendorId}/contact/store`;

    logger.log("createContact::BEGIN", body);
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
      logger.log("createContact::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({
    accessToken = null,

    contactId = null,
    vendorId = null,
    body = {},
  } = {}) => {
    if (!accessToken || !vendorId) {
      return;
    }

    const url = `${API_URL}/vendors/${vendorId}/contact/update/${contactId}`;

    logger.log("updateContact::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "PATCH",
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
      logger.log("updateContact::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async ({ accessToken = null, vendorId = null, contactId } = {}) => {
    if (!accessToken || !vendorId || !contactId) {
      return;
    }

    const url = `${API_URL}/vendors/${vendorId}/contact/delete/${contactId}`;

    const startTime = new Date();
    logger.log("deleteContact::BEGIN");
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
      logger.log("deleteContact::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getContacts = createAsyncThunk(
  "contacts/getContacts",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    vendorId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/vendors/show/${vendorId}`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getContacts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getContacts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVendors = createAsyncThunk(
  "vendors/getVendors",
  async ({
    page = null,
    accessToken = null,
    branch_id = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/vendors?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getVendors::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendors::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getPurchases = createAsyncThunk(
  "purchases/getPurchases",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    vendorId = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      if (!vendorId) {
        url = `${API_URL}/inventory/purchases?`;
      } else {
        url = `${API_URL}/vendors/${vendorId}/show-purchases?`;
      }
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getPurchases::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getPurchases::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRFQDetails
export const getRFQDetails = createAsyncThunk(
  "rfqs/getRFQDetails",
  async ({ accessToken = null, page = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/purchases/show/${rfqId}?`;
    }

    const startTime = new Date();
    logger.log("getRFQDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRFQCompanies
export const getRFQCompanies = createAsyncThunk(
  "rfqs/getRFQCompanies",
  async ({ accessToken = null, page = null, menuId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/purchases/rfq-item-requirements?`;
    }

    const startTime = new Date();
    logger.log("getRFQCompanies::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQCompanies::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServices = createAsyncThunk(
  "services/getServices",
  async ({
    page = null,
    accessToken = null,
    branch_id = null,
    entries = null,
    filter = null,
    category_id = null,
    sub_category_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/products?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    if (category_id) {
      params["category_id"] = category_id;
    }
    if (sub_category_id) {
      params["sub_category_id"] = sub_category_id;
    }
    if (entries) {
      params["entries"] = entries;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServicesDetails = createAsyncThunk(
  "services/getServicesDetails",
  async ({ accessToken = null, page = null, serviceId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/products/show/${serviceId}?`;
    }

    const startTime = new Date();
    logger.log("getServicesDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServicesDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchBatchDetails = createAsyncThunk(
  "batches/fetchBatchDetails",
  async ({ accessToken = null, page = null, batchId = null } = {}) => {
    if (!accessToken || !batchId) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/batchedable-records/show/${batchId}`;
    }

    const startTime = new Date();
    logger.log("fetchBatchDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchBatchDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getAccompaniments = createAsyncThunk(
  "inventory/getAccompaniments",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    menuItemId = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-item/${menuItemId}/accompaniments/list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getAccompaniments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAccompaniments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getAccoDetails = createAsyncThunk(
  "accompaniments/getAccoDetails",
  async ({
    accessToken = null,
    page = null,
    itemId = null,
    menuItemId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-item/${menuItemId}/accompaniments/${itemId}/show`;
    }

    const startTime = new Date();
    logger.log("getAccoDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAccoDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setStockManagement(state, action) {
      const { menu_id } = action.payload;

      if (state.menu_ids.find((e) => e.id === menu_id.id)) {
        state.menu_ids.filter(function (item) {
          return item.id !== transfer_id.id;
        });

      } else {
        // console.log("ID NOT");
        state.menu_ids.push(menu_id.id);
      }
    }

  },
  extraReducers(builder) {
    builder
      // fetchLeanServices Data
      .addCase(fetchLeanServices.pending, (state) => {
        state.leanServicesStatus = "loading";
      })
      .addCase(fetchLeanServices.rejected, (state) => {
        state.leanServicesStatus = "rejected";
        logger.log("fetchLeanServices::REJECTED");
      })
      .addCase(fetchLeanServices.fulfilled, (state, action) => {
        state.leanServicesStatus = "fulfilled";
        state.leanServicesList = action.payload;
      })

      // getMenuDetails Data
      .addCase(getMenuDetails.pending, (state) => {
        state.getMenuDetailsStatus = "loading";
      })
      .addCase(getMenuDetails.rejected, (state) => {
        state.getMenuDetailsStatus = "rejected";
        logger.log("getMenuDetails::REJECTED");
      })
      .addCase(getMenuDetails.fulfilled, (state, action) => {
        state.getMenuDetailsStatus = "fulfilled";
        state.getMenuDetails = action.payload;
      })

      // getInventory Profits Data
      .addCase(getInventoryProfits.pending, (state) => {
        state.inventoryItemsProfitStatus = "loading";
      })
      .addCase(getInventoryProfits.rejected, (state) => {
        state.inventoryItemsProfitStatus = "rejected";
        logger.log("getInventoryProfits::REJECTED");
      })
      .addCase(getInventoryProfits.fulfilled, (state, action) => {
        state.inventoryItemsProfitStatus = "fulfilled";
        state.inventory_items_profits = action.payload;
        // console.log(state.inventory_items_profits);
      })

      // getService Totals Data
      .addCase(getServiceTotalCounts.pending, (state) => {
        state.serviceItemsTotalStatus = "loading";
      })
      .addCase(getServiceTotalCounts.rejected, (state) => {
        state.serviceItemsTotalStatus = "rejected";
        logger.log("getServiceTotalCounts::REJECTED");
      })
      .addCase(getServiceTotalCounts.fulfilled, (state, action) => {
        state.serviceItemsTotalStatus = "fulfilled";
        state.service_items_totals = action.payload;
        // console.log(state.inventory_items_profits);
      })

      //getChecklist
      .addCase(getChecklist.pending, (state) => {
        state.getChecklistStatus = "loading";
      })
      .addCase(getChecklist.rejected, (state) => {
        state.getChecklistStatus = "rejected";
        logger.log("getChecklist::REJECTED");
      })
      .addCase(getChecklist.fulfilled, (state, action) => {
        state.getChecklistStatus = "fulfilled";
        state.getChecklist = action.payload;
      })


      //getBillPayments
      .addCase(getBillPayments.pending, (state) => {
        state.getBillPaymentsStatus = "loading";
      })
      .addCase(getBillPayments.rejected, (state) => {
        state.getBillPaymentsStatus = "rejected";
        logger.log("getBillPayments::REJECTED");
      })
      .addCase(getBillPayments.fulfilled, (state, action) => {
        state.getBillPaymentsStatus = "fulfilled";
        state.getBillPayments = action.payload;
      })

      //getRooms
      .addCase(getRooms.pending, (state) => {
        state.getRoomsStatus = "loading";
      })
      .addCase(getRooms.rejected, (state) => {
        state.getRoomsStatus = "rejected";
        logger.log("getRooms::REJECTED");
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.getRoomsStatus = "fulfilled";
        state.getRooms = action.payload;
      })


      //getAjustmentReq
      .addCase(getAdjustmentReq.pending, (state) => {
        state.getAdjustmentReqStatus = "loading";
      })
      .addCase(getAdjustmentReq.rejected, (state) => {
        state.getAdjustmentReqStatus = "rejected";
        logger.log("getAdjustmentReq::REJECTED");
      })
      .addCase(getAdjustmentReq.fulfilled, (state, action) => {
        state.getAdjustmentReqStatus = "fulfilled";
        state.getAdjustmentReq = action.payload;
      })

      //getRFQCompanies
      .addCase(getRFQCompanies.pending, (state) => {
        state.getRFQCompaniesStatus = "loading";
      })
      .addCase(getRFQCompanies.rejected, (state) => {
        state.getRFQCompaniesStatus = "rejected";
        logger.log("getRFQCompanies::REJECTED");
      })
      .addCase(getRFQCompanies.fulfilled, (state, action) => {
        state.getRFQCompaniesStatus = "fulfilled";
        state.getRFQCompanies = action.payload;
      })

      //getCheckins
      .addCase(getCheckins.pending, (state) => {
        state.getCheckinsStatus = "loading";
      })
      .addCase(getCheckins.rejected, (state) => {
        state.getCheckinsStatus = "rejected";
        logger.log("getCheckins::REJECTED");
      })
      .addCase(getCheckins.fulfilled, (state, action) => {
        state.getCheckinsStatus = "fulfilled";
        state.getCheckins = action.payload;
      })

      //getProductSellables
      .addCase(getProductSellables.pending, (state) => {
        state.getProductSellablesStatus = "loading";
      })
      .addCase(getProductSellables.rejected, (state) => {
        state.getProductSellablesStatus = "rejected";
        logger.log("getProductSellables::REJECTED");
      })
      .addCase(getProductSellables.fulfilled, (state, action) => {
        state.getProductSellablesStatus = "fulfilled";
        state.getProductSellables = action.payload;
      })

      //getCheckouts
      .addCase(getCheckouts.pending, (state) => {
        state.getCheckoutsStatus = "loading";
      })
      .addCase(getCheckouts.rejected, (state) => {
        state.getCheckoutsStatus = "rejected";
        logger.log("getCheckouts::REJECTED");
      })
      .addCase(getCheckouts.fulfilled, (state, action) => {
        state.getCheckoutsStatus = "fulfilled";
        state.getCheckouts = action.payload;
      })


      //getReservations
      .addCase(getReservations.pending, (state) => {
        state.getReservationsStatus = "loading";
      })
      .addCase(getReservations.rejected, (state) => {
        state.getReservationsStatus = "rejected";
        logger.log("getReservations::REJECTED");
      })
      .addCase(getReservations.fulfilled, (state, action) => {
        state.getReservationsStatus = "fulfilled";
        state.getReservations = action.payload;
      })

      //getRoomTypes
      .addCase(getRoomTypes.pending, (state) => {
        state.getRoomTypesStatus = "loading";
      })
      .addCase(getRoomTypes.rejected, (state) => {
        state.getRoomTypesStatus = "rejected";
        logger.log("getRoomTypes::REJECTED");
      })
      .addCase(getRoomTypes.fulfilled, (state, action) => {
        state.getRoomTypesStatus = "fulfilled";
        state.getRoomTypes = action.payload;
      })

      //getRFQDetails
      .addCase(getRFQDetails.pending, (state) => {
        state.getRFQDetailsStatus = "loading";
      })
      .addCase(getRFQDetails.rejected, (state) => {
        state.getRFQDetailsStatus = "rejected";
        logger.log("getRFQDetails::REJECTED");
      })
      .addCase(getRFQDetails.fulfilled, (state, action) => {
        state.getRFQDetailsStatus = "fulfilled";
        state.getRFQDetails = action.payload;
      })

      //getBillDetails
      .addCase(getBillDetails.pending, (state) => {
        state.getBillDetailsStatus = "loading";
      })
      .addCase(getBillDetails.rejected, (state) => {
        state.getBillDetailsStatus = "rejected";
        logger.log("getBillDetails::REJECTED");
      })
      .addCase(getBillDetails.fulfilled, (state, action) => {
        state.getBillDetailsStatus = "fulfilled";
        state.getBillDetails = action.payload;
      })

        //Enable Stock
        .addCase(enableStock.pending, (state) => {
          state.enableStockStatus = "loading";
        })
        .addCase(enableStock.rejected, (state, action) => {
          state.enableStockStatus = "rejected";
          logger.warn("enableStock::REJECTED", action.error);
        })
        .addCase(enableStock.fulfilled, (state, action) => {
          const { payload } = action;
          logger.log("enableStock::FULFILLED", { payload });
          state.enableStockStatus = "fulfilled";
        })

      //getVendorPurchases
      .addCase(getVendorPurchases.pending, (state) => {
        state.getVendorPurchasesStatus = "loading";
      })
      .addCase(getVendorPurchases.rejected, (state) => {
        state.getVendorPurchasesStatus = "rejected";
        logger.log("getVendorPurchases::REJECTED");
      })
      .addCase(getVendorPurchases.fulfilled, (state, action) => {
        state.getVendorPurchasesStatus = "fulfilled";
        state.getVendorPurchases = action.payload;
      })

      //Menu Items Accompaniments
      .addCase(fetchMenuItemsAccomp.pending, (state) => {
        state.menuAccompsListStatus = "loading";
      })
      .addCase(fetchMenuItemsAccomp.rejected, (state, action) => {
        state.menuAccompsListStatus = "rejected";
        logger.log("fetchMenuItemsAccomp::REJECTED", action.error);
      })
      .addCase(fetchMenuItemsAccomp.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchMenuItemsAccomp::FULFILLED", { payload });

        state.menuAccompsListStatus = "fulfilled";

        // Remove duplicates
        const currentItems = {};
        state.menuAccompsList?.forEach((item) => {
          currentItems[`id${item?.id}`] = { ...item };
        });
        action?.payload?.forEach((item) => {
          currentItems[`id${item?.id}`] = { ...item };
        });
        // console.log("Current Items Are", currentItems, action.payload);
        state.menuAccompsList = Object.values(currentItems);
        // console.log("The State is " + state.menuAccompsList);
      })

      //getContactDetails
      .addCase(getContactDetails.pending, (state) => {
        state.getContactDetailsStatus = "loading";
      })
      .addCase(getContactDetails.rejected, (state) => {
        state.getContactDetailsStatus = "rejected";
        logger.log("getContactDetails::REJECTED");
      })
      .addCase(getContactDetails.fulfilled, (state, action) => {
        state.getContactDetailsStatus = "fulfilled";
        state.getContactDetails = action.payload;
      })

      //getCheckIns
      .addCase(getCheckIns.pending, (state) => {
        state.getCheckInsStatus = "loading";
      })
      .addCase(getCheckIns.rejected, (state) => {
        state.getCheckInsStatus = "rejected";
        logger.log("getCheckIns::REJECTED");
      })
      .addCase(getCheckIns.fulfilled, (state, action) => {
        state.getCheckInsStatus = "fulfilled";
        state.getCheckIns = action.payload;
      })

      //getRoomInventory
      .addCase(getRoomInventory.pending, (state) => {
        state.getRoomInventoryStatus = "loading";
      })
      .addCase(getRoomInventory.rejected, (state) => {
        state.getRoomInventoryStatus = "rejected";
        logger.log("getRoomInventory::REJECTED");
      })
      .addCase(getRoomInventory.fulfilled, (state, action) => {
        state.getRoomInventoryStatus = "fulfilled";
        state.getRoomInventory = action.payload;
      })


      //getConferences
      .addCase(getConferences.pending, (state) => {
        state.getConferencesStatus = "loading";
      })
      .addCase(getConferences.rejected, (state) => {
        state.getConferencesStatus = "rejected";
        logger.log("getConferences::REJECTED");
      })
      .addCase(getConferences.fulfilled, (state, action) => {
        state.getConferencesStatus = "fulfilled";
        state.getConferences = action.payload;
      })

      //getHouseKeeping
      .addCase(getHouseKeeping.pending, (state) => {
        state.getHouseKeepingStatus = "loading";
      })
      .addCase(getHouseKeeping.rejected, (state) => {
        state.getHouseKeepingStatus = "rejected";
        logger.log("getHouseKeeping::REJECTED");
      })
      .addCase(getHouseKeeping.fulfilled, (state, action) => {
        state.getHouseKeepingStatus = "fulfilled";
        state.getHouseKeeping = action.payload;
      })

      //getFacilities
      .addCase(getFacilities.pending, (state) => {
        state.getFacilitiesStatus = "loading";
      })
      .addCase(getFacilities.rejected, (state) => {
        state.getFacilitiesStatus = "rejected";
        logger.log("getFacilities::REJECTED");
      })
      .addCase(getFacilities.fulfilled, (state, action) => {
        state.getFacilitiesStatus = "fulfilled";
        state.getFacilities = action.payload;
      })
      //getFacilityDetails
      .addCase(getFacilityDetails.pending, (state) => {
        state.getFacilityDetailsStatus = "loading";
      })
      .addCase(getFacilityDetails.rejected, (state) => {
        state.getFacilityDetailsStatus = "rejected";
        logger.log("getFacilityDetails::REJECTED");
      })
      .addCase(getFacilityDetails.fulfilled, (state, action) => {
        state.getFacilityDetailsStatus = "fulfilled";
        state.getFacilityDetails = action.payload;
      })
      //getRoomSizes
      .addCase(getRoomSizes.pending, (state) => {
        state.getRoomSizesStatus = "loading";
      })
      .addCase(getRoomSizes.rejected, (state) => {
        state.getRoomSizesStatus = "rejected";
        logger.log("getRoomSizes::REJECTED");
      })
      .addCase(getRoomSizes.fulfilled, (state, action) => {
        state.getRoomSizesStatus = "fulfilled";
        state.getRoomSizes = action.payload;
      })
      //getBeds
      .addCase(getBeds.pending, (state) => {
        state.getBedsStatus = "loading";
      })
      .addCase(getBeds.rejected, (state) => {
        state.getBedsStatus = "rejected";
        logger.log("getBeds::REJECTED");
      })
      .addCase(getBeds.fulfilled, (state, action) => {
        state.getBedsStatus = "fulfilled";
        state.getBeds = action.payload;
      })
      //getBookingTypes
      .addCase(getBookingTypes.pending, (state) => {
        state.getBookingTypesStatus = "loading";
      })
      .addCase(getBookingTypes.rejected, (state) => {
        state.getBookingTypesStatus = "rejected";
        logger.log("getBookingTypes::REJECTED");
      })
      .addCase(getBookingTypes.fulfilled, (state, action) => {
        state.getBookingTypesStatus = "fulfilled";
        state.getBookingTypes = action.payload;
      })
      //getComplementaries
      .addCase(getComplementaries.pending, (state) => {
        state.getComplementariesStatus = "loading";
      })
      .addCase(getComplementaries.rejected, (state) => {
        state.getComplementariesStatus = "rejected";
        logger.log("getComplementaries::REJECTED");
      })
      .addCase(getComplementaries.fulfilled, (state, action) => {
        state.getComplementariesStatus = "fulfilled";
        state.getComplementaries = action.payload;
      })

      //getLands
      .addCase(getLands.pending, (state) => {
        state.getLandsStatus = "loading";
      })
      .addCase(getLands.rejected, (state) => {
        state.getLandsStatus = "rejected";
        logger.log("getLands::REJECTED");
      })
      .addCase(getLands.fulfilled, (state, action) => {
        state.getLandsStatus = "fulfilled";
        state.getLands = action.payload;
      })

      //getVendorDetails
      .addCase(getVendorDetails.pending, (state) => {
        state.getVendorDetailsStatus = "loading";
      })
      .addCase(getVendorDetails.rejected, (state) => {
        state.getVendorDetailsStatus = "rejected";
        logger.log("getVendorDetails::REJECTED");
      })
      .addCase(getVendorDetails.fulfilled, (state, action) => {
        state.getVendorDetailsStatus = "fulfilled";
        state.getVendorDetails = action.payload;
      })

      //getRoomRequirements
      .addCase(getRoomRequirements.pending, (state) => {
        state.getRoomRequirementsStatus = "loading";
      })
      .addCase(getRoomRequirements.rejected, (state) => {
        state.getRoomRequirementsStatus = "rejected";
        logger.log("getRoomRequirements::REJECTED");
      })
      .addCase(getRoomRequirements.fulfilled, (state, action) => {
        state.getRoomRequirementsStatus = "fulfilled";
        state.getRoomRequirements = action.payload;
      })

      //getVendorAdjustments
      .addCase(getVendorAdjustments.pending, (state) => {
        state.getVendorAdjustmentsStatus = "loading";
      })
      .addCase(getVendorAdjustments.rejected, (state) => {
        state.getVendorAdjustmentsStatus = "rejected";
        logger.log("getVendorAdjustments::REJECTED");
      })
      .addCase(getVendorAdjustments.fulfilled, (state, action) => {
        state.getVendorAdjustmentsStatus = "fulfilled";
        state.getVendorAdjustments = action.payload;
      })

      //getComboSubItems
      .addCase(getComboSubItems.pending, (state) => {
        state.getComboSubItemsStatus = "loading";
      })
      .addCase(getComboSubItems.rejected, (state) => {
        state.getComboSubItemsStatus = "rejected";
        logger.log("getComboSubItems::REJECTED");
      })
      .addCase(getComboSubItems.fulfilled, (state, action) => {
        state.getComboSubItemsStatus = "fulfilled";
        state.getComboSubItems = action.payload;
      })

      //getIncome
      .addCase(getIncome.pending, (state) => {
        state.getIncomeStatus = "loading";
      })
      .addCase(getIncome.rejected, (state) => {
        state.getIncomeStatus = "rejected";
        logger.log("getIncome::REJECTED");
      })
      .addCase(getIncome.fulfilled, (state, action) => {
        state.getIncomeStatus = "fulfilled";
        state.getIncome = action.payload;
      })

      //getAssets
      .addCase(getAssets.pending, (state) => {
        state.getAssetsStatus = "loading";
      })
      .addCase(getAssets.rejected, (state) => {
        state.getAssetsStatus = "rejected";
        logger.log("getAssets::REJECTED");
      })
      .addCase(getAssets.fulfilled, (state, action) => {
        state.getAssetsStatus = "fulfilled";
        state.getAssets = action.payload;
      })

      //getLiabilities
      .addCase(getLiabilities.pending, (state) => {
        state.getLiabilitiesStatus = "loading";
      })
      .addCase(getLiabilities.rejected, (state) => {
        state.getLiabilitiesStatus = "rejected";
        logger.log("getLiabilities::REJECTED");
      })
      .addCase(getLiabilities.fulfilled, (state, action) => {
        state.getLiabilitiesStatus = "fulfilled";
        state.getLiabilities = action.payload;
      })

      //
      .addCase(fetchSelectMenus.pending, (state) => {
        state.selectedProductStatus = "loading";
      })
      .addCase(fetchSelectMenus.rejected, (state, action) => {
        state.selectedProductStatus = "rejected";
        logger.log("fetchSelectMenus::REJECTED", action.error);
      })
      .addCase(fetchSelectMenus.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSelectMenus::FULFILLED", { payload });

        state.selectMenusStatus = "fulfilled";
        state.selected_menus = action.payload;
      })

      // getContacts Data
      .addCase(getContacts.pending, (state) => {
        state.getContactsStatus = "loading";
      })
      .addCase(getContacts.rejected, (state) => {
        state.getContactsStatus = "rejected";
        logger.log("getContacts::REJECTED");
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.getContactsStatus = "fulfilled";
        state.getContacts = action.payload;
      })

      // fetchContacts Data
      .addCase(fetchContacts.pending, (state) => {
        state.contactListStatus = "loading";
      })
      .addCase(fetchContacts.rejected, (state) => {
        state.contactListStatus = "rejected";
        logger.log("fetchContacts::REJECTED");
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contactListStatus = "fulfilled";
        state.contactList = action.payload;
      })

      // getProductDetails Data
      .addCase(getProductDetails.pending, (state) => {
        state.getProductDetailsStatus = "loading";
      })
      .addCase(getProductDetails.rejected, (state) => {
        state.getProductDetailsStatus = "rejected";
        logger.log("getProductDetailsStatus::REJECTED");
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.getProductDetailsStatus = "fulfilled";
        state.getProductDetails = action.payload;
      })

      // getAccoDetails Data
      .addCase(getAccoDetails.pending, (state) => {
        state.getAccoDetailsStatus = "loading";
      })
      .addCase(getAccoDetails.rejected, (state) => {
        state.getAccoDetailsStatus = "rejected";
        logger.log("getAccoDetails::REJECTED");
      })
      .addCase(getAccoDetails.fulfilled, (state, action) => {
        state.getAccoDetailsStatus = "fulfilled";
        state.getAccoDetails = action.payload;
      })

      // getMenuItems Data
      .addCase(getMenuItems.pending, (state) => {
        state.getMenuItemsStatus = "loading";
      })
      .addCase(getMenuItems.rejected, (state) => {
        state.getMenuItemsStatus = "rejected";
        logger.log("getRestaurant::REJECTED");
      })
      .addCase(getMenuItems.fulfilled, (state, action) => {
        state.getMenuItemsStatus = "fulfilled";
        state.getMenuItems = action.payload;
      })

      // getAdjustments Data
      .addCase(getAdjustments.pending, (state) => {
        state.getAdjustmentStatus = "loading";
      })
      .addCase(getAdjustments.rejected, (state) => {
        state.getAdjustmentStatus = "rejected";
        logger.log("getAdjustments::REJECTED");
      })
      .addCase(getAdjustments.fulfilled, (state, action) => {
        state.getAdjustmentStatus = "fulfilled";
        state.getAdjustments = action.payload;
      })

      // getVendors Data
      .addCase(getVendors.pending, (state) => {
        state.getVendorStatus = "loading";
      })
      .addCase(getVendors.rejected, (state) => {
        state.getVendorStatus = "rejected";
        logger.log("getVendors::REJECTED");
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.getVendorStatus = "fulfilled";
        state.getVendors = action.payload;
      })

      // getPurchases Data
      .addCase(getPurchases.pending, (state) => {
        state.getPurchaseStatus = "loading";
      })
      .addCase(getPurchases.rejected, (state) => {
        state.getPurchaseStatus = "rejected";
        logger.log("getPurchases::REJECTED");
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.getPurchaseStatus = "fulfilled";
        state.getPurchases = action.payload;
      })

      //getProperties
      .addCase(getProperties.pending, (state) => {
        state.getPropertiesStatus = "loading";
      })
      .addCase(getProperties.rejected, (state) => {
        state.getPropertiesStatus = "rejected";
        logger.log("getProperties::REJECTED");
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.getPropertiesStatus = "fulfilled";
        state.getProperties = action.payload;
      })

      //getServices Data
      .addCase(getServices.pending, (state) => {
        state.getServicesStatus = "loading";
      })
      .addCase(getServices.rejected, (state) => {
        state.getServicesStatus = "rejected";
        logger.log("getServices::REJECTED");
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.getServicesStatus = "fulfilled";
        state.getServices = action.payload;
      })

      //getServicesDetails Data
      .addCase(getServicesDetails.pending, (state) => {
        state.getServicesDetailsStatus = "loading";
      })
      .addCase(getServicesDetails.rejected, (state) => {
        state.getServicesDetailsStatus = "rejected";
        logger.log("getServicesDetails::REJECTED");
      })
      .addCase(getServicesDetails.fulfilled, (state, action) => {
        state.getServicesDetailsStatus = "fulfilled";
        state.getServicesDetails = action.payload;
      })

      //getAccompaniments Data
      .addCase(getAccompaniments.pending, (state) => {
        state.getAccompanimentsStatus = "loading";
      })
      .addCase(getAccompaniments.rejected, (state) => {
        state.getAccompanimentsStatus = "rejected";
        logger.log("getAccompaniments::REJECTED");
      })
      .addCase(getAccompaniments.fulfilled, (state, action) => {
        state.getAccompanimentsStatus = "fulfilled";
        state.getAccompaniments = action.payload;
      })

      //fetchBatchDetails Data
      .addCase(fetchBatchDetails.pending, (state) => {
        state.fetchBatchDetailsStatus = "loading";
      })
      .addCase(fetchBatchDetails.rejected, (state) => {
        state.fetchBatchDetailsStatus = "rejected";
        logger.log("fetchBatchDetails::REJECTED");
      })
      .addCase(fetchBatchDetails.fulfilled, (state, action) => {
        state.fetchBatchDetailsStatus = "fulfilled";
        state.fetchBatchDetails = action.payload;
      });
  },
});

export const {setStockManagement} = inventorySlice.actions;

export default inventorySlice.reducer;
