import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("AccessControlSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  accessGroupList: null,
  accessGroupListStatus: "idle",

  permissionsList: null,
  permissionsListStatus: "idle",

  submitAccessGroupStatus: "idle",
  deleteAccessGroupStatus: "idle",

  submitWarehouseTransferStatus: "idle",
  approveWarehouseTransferStatus: "idle",
  editWarehouseTransferStatus: "idle",
  submitWarehouseStaffStatus: "idle",
  removeWarehouseTransferStatus: "idle",
  removeWarehouseAdminStatus: "idle",

  submitAccessGroupUsersStatus: "idle",
  submitAccessGroupPagesStatus: "idle",

  myAccountDataStatus: "idle",
  myAccountData: null,

  getTransfersPDF: null,
  getTransfersPDFStatus: "idle",

  getWarehouseProductsPDFStatus: "idle",
  getWarehouseProductsPDF: null,

  getTransfersListPDF: null,
  getTransfersListPDFStatus: "idle",

  fetchBranchesList: [],
  fetchBranchesListStatus: "idle",

  getExistingWarehouseStatus: "idle",
  existingWarehouse: null,

  existingWarehouseProductsStatus: "idle",
  existingWarehouseProducts: null,

  existingWarehouseStaffsStatus: "idle",
  existingWarehouseStaffs: null,

  existingWarehouseTransfersStatus: "idle",
  existingWarehouseTransfers: null,

  packagesList: null,
  packagesListStatus: "idle",

  subscriptionInvoiceList: null,
  subscriptionInvoiceStatus: "idle",

  //getLoyaltyTemplates
  getLoyaltyTemplates: null,
  getLoyaltyTemplatesStatus: "idle",

  //getLoyaltyTemplates
  getLoyaltyTemplatesTwo: null,
  getLoyaltyTemplatesStatusTwo: "idle",

  //getFeatureModules
  getFeatureModules: null,
  getFeatureModulesStatus: "idle",

  //getAllTaxesList
  getAllTaxesList: null,
  getAllTaxesListStatus: "idle",

  //getAllSettingUnits
  getAllSettingUnits: null,
  getAllSettingUnitsStatus: "idle",

  //getAllWarehouses
  getAllWarehouses: null,
  getAllWarehousesStatus: "idle",

  //getPaymentSettings
  getPaymentSettings: null,
  getPaymentSettingsStatus: "idle",

  //getMarketplaceSettings
  getMarketplaceSettings: null,
  getMarketplaceSettingsStatus: "idle",

  //getAccountSettings
  getAccountSettings: null,
  getAccountSettingsStatus: "idle",

  //getStaff
  getStaff: null,
  getStaffStatus: "idle",

  //getWarehouses
  getWarehouses: null,
  getWarehousesStatus: "idle",
};

export const fetchBranchesList = createAsyncThunk(
  "branches/fetchBranchesList",
  async () => {
    let url = `${API_URL}/branches-list`;

    const startTime = new Date();
    logger.log("fetchBranchesList::BEGIN");
    const response = await fetch(url, {
      headers: {
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

export const submitAccessGroup = createAsyncThunk(
  "accessControlSlice/submitAccessGroup",
  async ({ accessToken = null, name = null, branch = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/accessGroups`;

    let body = {};

    body["name"] = name;
    body["branch"] = branch;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitAccessGroup::BEGIN", body);
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
      logger.log("submitAccessGroup::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getWarehouses
export const getWarehouses = createAsyncThunk(
  "warehouses/getWarehouses",
  async ({ page = null, accessToken = null,branch_id=null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/warehouses/all?`;
    }

    const params = {};
    params["branch_id"] = branch_id
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getWarehouses::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getWarehouses::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getTransfersListPDF = createAsyncThunk(
  "products/getTransfersListPDF",
  async ({ page = null, accessToken = null, warehouse_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/warehouses/transfer-list-pdf?`;
    }

    const params = {};
    if (warehouse_id) {
      params["warehouse_id"] = warehouse_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getTransfersListPDF::BEGIN");
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
      logger.log("getTransfersListPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Transfers List.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const getWarehouseProductsPDF = createAsyncThunk(
  "products/getWarehouseProductsPDF",
  async ({ page = null, accessToken = null, warehouse_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/warehouses/warehouse-products-pdf?`;
    }

    const params = {};
    if (warehouse_id) {
      params["warehouse_id"] = warehouse_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getWarehouseProductsPDF::BEGIN");
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
      logger.log("getWarehouseProductsPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Transfers.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const getTransfersPDF = createAsyncThunk(
  "products/getTransfersPdf",
  async ({ page = null, accessToken = null, transfer_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/warehouses/transfer-pdf?`;
    }

    const params = {};

    params["transfer_id"] = transfer_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getTransfersPdf::BEGIN");
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
      logger.log("getTransfersPdf::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Transfers.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

//get Existing Warehouse Stock Movements
export const getExistingWarehouse = createAsyncThunk(
  "warehouses/getExistingWarehouse",
  async ({
    page = null,
    accessToken = null,
    warehouse_id = null,
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
      url = `${API_URL}/settings/warehouses/show?`;
    }

    const params = {};
    params["warehouse_id"] = warehouse_id;

    params["start_date"] = startDate;

    params["end_date"] = endDate;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getExistingWarehouse::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getExistingWarehouse::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//get Existing Warehouse Products
export const getExistingWarehouseProducts = createAsyncThunk(
  "warehouses/getExistingWarehouseProducts",
  async ({
    page = null,
    accessToken = null,
    warehouse_id = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/warehouses/warehouse-products?`;
    }

    const params = {};
    params["warehouse_id"] = warehouse_id;
    params["filter"] = filter;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getExistingWarehouseProducts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getExistingWarehouseProducts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//get Existing Warehouse Staffs
export const getExistingWarehouseStaffs = createAsyncThunk(
  "warehouses/getExistingWarehouseStaffs",
  async ({ page = null, accessToken = null, warehouse_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/warehouses/warehouse-staffs?`;
    }

    const params = {};
    params["warehouse_id"] = warehouse_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getExistingWarehouseStaffs::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getExistingWarehouseStaffs::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//get Existing Warehouse Transfers
export const getExistingWarehouseTransfers = createAsyncThunk(
  "warehouses/getExistingWarehouseTransfers",
  async ({
    page = null,
    accessToken = null,
    warehouse_id = null,
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
      url = `${API_URL}/settings/warehouses/warehouse-transfers?`;
    }

    const params = {};
    params["warehouse_id"] = warehouse_id;
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (endDate) {
      params["filter"] = filter;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getExistingWarehouseTransfers::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getExistingWarehouseTransfers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAllWarehouses
export const getAllWarehouses = createAsyncThunk(
  "warehouses/getAllWarehouses",
  async ({ page = null, accessToken = null,branch_id=null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/warehouses/list?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getAllWarehouses::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAllWarehouses::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAccountSettings
export const getAccountSettings = createAsyncThunk(
  "account/getAccountSettings",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/settings/account-details`;

    const startTime = new Date();
    logger.log("getAccountSettings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAccountSettings::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getPaymentSettings
export const getPaymentSettings = createAsyncThunk(
  "payments/getPaymentSettings",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/settings/payment-settings`;

    const startTime = new Date();
    logger.log("getPaymentSettings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getPaymentSettings::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Get Staff
export const getStaff = createAsyncThunk(
  "staff/getStaff",
  async ({ accessToken = null, userId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/auth/${userId}/staff`;

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

//getMarketplaceSettings
export const getMarketplaceSettings = createAsyncThunk(
  "marketplace/getMarketplaceSettings",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/settings/marketplace-settings`;

    const startTime = new Date();
    logger.log("getMarketplaceSettings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getMarketplaceSettings::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getLoyaltyTemplates
export const getLoyaltyTemplates = createAsyncThunk(
  "loyalty/getLoyaltyTemplates",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/templates?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getLoyaltyTemplates::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLoyaltyTemplates::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getLoyaltyTemplates
export const getLoyaltyTemplatesTwo = createAsyncThunk(
  "loyalty/getLoyaltyTemplatesTwo",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/templates?`;
    }

    const params = {};
    params["template_status"] = "Two";
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getLoyaltyTemplatesTwo::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLoyaltyTemplatesTwo::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAllTaxesList
export const getAllTaxesList = createAsyncThunk(
  "taxes/getAllTaxesList",
  async ({ page = null, accessToken = null, branch_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/tax/list?`;
    }

    const startTime = new Date();
    logger.log("getAllTaxesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAllTaxesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAllSettingUnits
export const getAllSettingUnits = createAsyncThunk(
  "units/getAllSettingUnits",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/units/list?`;
    }

    const startTime = new Date();
    logger.log("getAllSettingUnits::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAllSettingUnits::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getFeatureModules
export const getFeatureModules = createAsyncThunk(
  "features/getFeatureModules",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/settings/modules`;

    const startTime = new Date();
    logger.log("getFeatureModules::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getFeatureModules::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitAccessGroupUsers = createAsyncThunk(
  "accessControlSlice/submitAccessGroupUsers",
  async ({
    accessToken = null,
    accessGroupId = null,
    accessGroupUsers = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken || !accessGroupId || !accessGroupUsers) {
      return;
    }

    let url = `${API_URL}/settings/accessGroupUsers/${accessGroupId}`;

    let body = {};
    body["users"] = [...accessGroupUsers];
    body["branch_id"] = branch_id;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitAccessGroupUsers::BEGIN", body);
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
      logger.log("submitAccessGroupUsers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitAccessGroupPages = createAsyncThunk(
  "accessControlSlice/submitAccessGroupPages",
  async ({
    accessToken = null,
    accessGroupId = null,
    accessGroupPages = null,
    accessGroupPermissions = null,
  } = {}) => {
    if (
      !accessToken ||
      !accessGroupId ||
      !accessGroupPages ||
      !accessGroupPermissions
    ) {
      return;
    }

    let url = `${API_URL}/settings/accessGroupPermissions/${accessGroupId}`;

    let body = {};
    body["pages"] = [...accessGroupPages];
    body["permissions"] = [...accessGroupPermissions];
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitAccessGroupPages::BEGIN", body);
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
      logger.log("submitAccessGroupPages::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteAccessGroup = createAsyncThunk(
  "accessControlSlice/deleteAccessGroup",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken || !itemId) {
      return;
    }

    let url = `${API_URL}/settings/accessGroups/${itemId}`;

    const startTime = new Date();
    logger.log("deleteAccessGroup::BEGIN");
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
      logger.log("deleteAccessGroup::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchAccessGroups = createAsyncThunk(
  "accessControlSlice/fetchAccessGroups",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/accessGroups?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchAccessGroups::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchAccessGroups::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPermissions = createAsyncThunk(
  "accessControlSlice/fetchPermissions",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/accessGroupPermissions`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPermissions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPermissions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchMyAccountData = createAsyncThunk(
  "accessControlSlice/fetchMyAccountData",
  async ({ accessToken = null, branch_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/auth/me?`;

    const params = {};
    params["detailed"] = true;
    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchMyAccountData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchMyAccountData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPackagesList = createAsyncThunk(
  "accessControlSlice/fetchPackagesList",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/packages`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPackagesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPackagesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Submit  Product Warehouse Transfer
export const submitWarehouseTransfer = createAsyncThunk(
  "accessControlSlice/submitWarehouseTransfer",
  async ({
    accessToken = null,
    product_components = [],
    warehouse_from = null,
    warehouse_to_transfer = null,
    transfer_comments = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/warehouses/transfer-to-warehouse`;
    let body = {};

    body["product_components"] = product_components;
    body["warehouse_to_transfer"] = warehouse_to_transfer;
    body["warehouse_from"] = warehouse_from;
    body["transfer_comments"] = transfer_comments;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitWarehouseTransfer::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("submitWarehouseTransfer::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Edit  Product Warehouse Transfer
export const approveWarehouseTransfer = createAsyncThunk(
  "accessControlSlice/approveWarehouseTransfer",
  async ({
    accessToken = null,
    transfer_components = [],
    warehouse_from = null,
    warehouse_to = null,
    transfer_id = null,
    receival_comments = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/warehouses/approve-transfer`;
    let body = {};

    body["transfer_components"] = transfer_components;
    body["warehouse_to"] = warehouse_to;
    body["warehouse_from"] = warehouse_from;
    body["transfer_id"] = transfer_id;
    body["receival_comments"] = receival_comments;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("approveWarehouseTransfer::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("approveWarehouseTransfer::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Approve  Product Warehouse Transfer
export const editWarehouseTransfer = createAsyncThunk(
  "accessControlSlice/editWarehouseTransfer",
  async ({
    accessToken = null,
    transfer_components = [],
    warehouse_from = null,
    warehouse_to = null,
    transfer_id = null,
    transfer_comments = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/warehouses/edit-transfer`;
    let body = {};

    body["transfer_components"] = transfer_components;
    body["warehouse_to"] = warehouse_to;
    body["warehouse_from"] = warehouse_from;
    body["transfer_id"] = transfer_id;
    body["transfer_comments"] = transfer_comments;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("editWarehouseTransfer::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("editWarehouseTransfer::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//remove warehouse admin
export const removeWarehouseAdmin = createAsyncThunk(
  "accessControlSlice/removeWarehouseAdmin",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/warehouses/remove-staff-warehouse?`;

    const params = {};
    params["staff_id"] = itemId;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("removeWarehouseAdmin::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("removeWarehouseAdmin::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Remove  Product Warehouse Transfer
export const removeWarehouseProduct = createAsyncThunk(
  "accessControlSlice/removeWarehouseProduct",
  async ({
    accessToken = null,
    product_id = null,
    warehouse_from = null,
    warehouse_id = null,
    transfer_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/warehouses/remove-warehouse-product`;
    let body = {};

    body["product_id"] = product_id;
    body["warehouse_to"] = warehouse_id;
    body["warehouse_from"] = warehouse_from;
    body["transfer_id"] = transfer_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("removeWarehouseProduct::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("editWarehouseTransfer::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Submit   Warehouse Staff
export const submitWarehouseStaff = createAsyncThunk(
  "accessControlSlice/submitWarehouseStaff",
  async ({ accessToken = null, warehouse_id = null, staff_id = null } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = `${API_URL}/settings/warehouses/add-staff-to-warehouse`;
    let body = {};

    body["warehouse_id"] = warehouse_id;
    body["staff_id"] = staff_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitWarehouseStaff::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("submitWarehouseStaff::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const sendSubscriptionStk = createAsyncThunk(
  "accessControlSlice/sendSubscriptionStk",
  async ({
    accessToken = null,
    phone = null,
    amount = null,
    package_id = null,
    billing_period = null,
  } = {}) => {
    if (!accessToken || !phone || !amount || !package_id || !billing_period) {
      return;
    }

    const url = `${API_URL}/settings/packages/purchase`;

    let body = { phone, amount, package_id, billing_period };
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("sendSubscriptionStk::BEGIN");
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
      logger.log("sendSubscriptionStk::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSubscriptionInvoices = createAsyncThunk(
  "accessControlSlice/fetchSubscriptionInvoices",
  async ({
    page = null,
    accessToken = null,
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
      url = `${API_URL}/settings/packages/invoices?`;
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
    logger.log("fetchSubscriptionInvoices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSubscriptionInvoices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const accessControl = createSlice({
  name: "accessControl",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // fetchAccessGroups
      .addCase(fetchAccessGroups.pending, (state) => {
        state.accessGroupListStatus = "loading";
      })
      .addCase(fetchAccessGroups.rejected, (state) => {
        state.accessGroupListStatus = "rejected";
        logger.log("fetchAccessGroups::REJECTED");
      })
      .addCase(fetchAccessGroups.fulfilled, (state, action) => {
        state.accessGroupListStatus = "fulfilled";
        state.accessGroupList = action.payload;
      })

      //Get Staff
      .addCase(getStaff.pending, (state) => {
        state.getStaffStatus = "loading";
      })
      .addCase(getStaff.rejected, (state) => {
        state.getStaffStatus = "rejected";
        logger.log("getStaff::REJECTED");
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.getStaffStatus = "fulfilled";
        state.getStaff = action.payload;
      })

      //getWarehouses
      .addCase(getWarehouses.pending, (state) => {
        state.getWarehousesStatus = "loading";
      })
      .addCase(getWarehouses.rejected, (state) => {
        state.getWarehousesStatus = "rejected";
        logger.log("getWarehouses::REJECTED");
      })
      .addCase(getWarehouses.fulfilled, (state, action) => {
        state.getWarehousesStatus = "fulfilled";
        state.getWarehouses = action.payload;
      })

      //getAccountSettings
      .addCase(getAccountSettings.pending, (state) => {
        state.getAccountSettingsStatus = "loading";
      })
      .addCase(getAccountSettings.rejected, (state) => {
        state.getAccountSettingsStatus = "rejected";
        logger.log("getAccountSettings::REJECTED");
      })
      .addCase(getAccountSettings.fulfilled, (state, action) => {
        state.getAccountSettingsStatus = "fulfilled";
        state.getAccountSettings = action.payload;
      })

      //getMarketplaceSettings
      .addCase(getMarketplaceSettings.pending, (state) => {
        state.getMarketplaceSettingsStatus = "loading";
      })
      .addCase(getMarketplaceSettings.rejected, (state) => {
        state.getMarketplaceSettingsStatus = "rejected";
        logger.log("getMarketplaceSettings::REJECTED");
      })
      .addCase(getMarketplaceSettings.fulfilled, (state, action) => {
        state.getMarketplaceSettingsStatus = "fulfilled";
        state.getMarketplaceSettings = action.payload;
      })

      //getPaymentSettings
      .addCase(getPaymentSettings.pending, (state) => {
        state.getPaymentSettingsStatus = "loading";
      })
      .addCase(getPaymentSettings.rejected, (state) => {
        state.getPaymentSettingsStatus = "rejected";
        logger.log("getPaymentSettings::REJECTED");
      })
      .addCase(getPaymentSettings.fulfilled, (state, action) => {
        state.getPaymentSettingsStatus = "fulfilled";
        state.getPaymentSettings = action.payload;
      })

      //getAllWarehouses
      .addCase(getAllWarehouses.pending, (state) => {
        state.getAllWarehousesStatus = "loading";
      })
      .addCase(getAllWarehouses.rejected, (state) => {
        state.getAllWarehousesStatus = "rejected";
        logger.log("getAllWarehouses::REJECTED");
      })
      .addCase(getAllWarehouses.fulfilled, (state, action) => {
        state.getAllWarehousesStatus = "fulfilled";
        state.getAllWarehouses = action.payload;
      })

      //getExisitng Warehouse
      .addCase(getExistingWarehouse.pending, (state) => {
        state.getExistingWarehouseStatus = "loading";
      })
      .addCase(getExistingWarehouse.rejected, (state) => {
        state.getExistingWarehouseStatus = "rejected";
        logger.log("getExistingWarehouse::REJECTED");
      })
      .addCase(getExistingWarehouse.fulfilled, (state, action) => {
        state.getExistingWarehouseStatus = "fulfilled";
        state.existingWarehouse = action.payload;
      })

      //getExisitng Warehouse Products
      .addCase(getExistingWarehouseProducts.pending, (state) => {
        state.existingWarehouseProductsStatus = "loading";
      })
      .addCase(getExistingWarehouseProducts.rejected, (state) => {
        state.existingWarehouseProductsStatus = "rejected";
        logger.log("getExistingWarehouseProducts::REJECTED");
      })
      .addCase(getExistingWarehouseProducts.fulfilled, (state, action) => {
        state.existingWarehouseProductsStatus = "fulfilled";
        state.existingWarehouseProducts = action.payload;
      })

      //getExisitng Warehouse Staffs
      .addCase(getExistingWarehouseStaffs.pending, (state) => {
        state.existingWarehouseStaffsStatus = "loading";
      })
      .addCase(getExistingWarehouseStaffs.rejected, (state) => {
        state.existingWarehouseStaffsStatus = "rejected";
        logger.log("getExistingWarehouseStaffs::REJECTED");
      })
      .addCase(getExistingWarehouseStaffs.fulfilled, (state, action) => {
        state.existingWarehouseStaffsStatus = "fulfilled";
        state.existingWarehouseStaffs = action.payload;
      })

      // PDF Data
      .addCase(getTransfersPDF.pending, (state) => {
        state.getTransfersPDFStatus = "loading";
      })
      .addCase(getTransfersPDF.rejected, (state) => {
        state.getTransfersPDFStatus = "rejected";
        logger.log("getTransfersPDFStatus::REJECTED");
      })
      .addCase(getTransfersPDF.fulfilled, (state, action) => {
        state.getTransfersPDFStatus = "fulfilled";
        state.getTransfersPDF = action.payload;
      })

      // PDF Data
      .addCase(getWarehouseProductsPDF.pending, (state) => {
        state.getWarehouseProductsPDFStatus = "loading";
      })
      .addCase(getWarehouseProductsPDF.rejected, (state) => {
        state.getWarehouseProductsPDFStatus = "rejected";
        logger.log("getWarehouseProductsPDFStatus::REJECTED");
      })
      .addCase(getWarehouseProductsPDF.fulfilled, (state, action) => {
        state.getWarehouseProductsPDFStatus = "fulfilled";
        state.getWarehouseProductsPDF = action.payload;
      })

      // PDF Transfers List Data
      .addCase(getTransfersListPDF.pending, (state) => {
        state.getTransfersPDFStatus = "loading";
      })
      .addCase(getTransfersListPDF.rejected, (state) => {
        state.getTransfersListPDFStatus = "rejected";
        logger.log("getTransfersListPDFStatus::REJECTED");
      })
      .addCase(getTransfersListPDF.fulfilled, (state, action) => {
        state.getTransfersListPDFStatus = "fulfilled";
        state.getTransfersListPDF = action.payload;
      })

      //getExisitng Warehouse Transfers
      .addCase(getExistingWarehouseTransfers.pending, (state) => {
        state.existingWarehouseTransfersStatus = "loading";
      })
      .addCase(getExistingWarehouseTransfers.rejected, (state) => {
        state.existingWarehouseTransfersStatus = "rejected";
        logger.log("getExistingWarehouseTransfers::REJECTED");
      })
      .addCase(getExistingWarehouseTransfers.fulfilled, (state, action) => {
        state.existingWarehouseTransfersStatus = "fulfilled";
        state.existingWarehouseTransfers = action.payload;
      })

      //getAllTaxesList
      .addCase(getAllTaxesList.pending, (state) => {
        state.getAllTaxesListStatus = "loading";
      })
      .addCase(getAllTaxesList.rejected, (state) => {
        state.getAllTaxesListStatus = "rejected";
        logger.log("getAllTaxesList::REJECTED");
      })
      .addCase(getAllTaxesList.fulfilled, (state, action) => {
        state.getAllTaxesListStatus = "fulfilled";
        state.getAllTaxesList = action.payload;
      })

      //getAllSettingUnits
      .addCase(getAllSettingUnits.pending, (state) => {
        state.getAllSettingUnitsStatus = "loading";
      })
      .addCase(getAllSettingUnits.rejected, (state) => {
        state.getAllSettingUnitsStatus = "rejected";
        logger.log("getAllTaxesList::REJECTED");
      })
      .addCase(getAllSettingUnits.fulfilled, (state, action) => {
        state.getAllSettingUnitsStatus = "fulfilled";
        state.getAllSettingUnits = action.payload;
      })

      //getFeatureModules
      .addCase(getFeatureModules.pending, (state) => {
        state.getFeatureModulesStatus = "loading";
      })
      .addCase(getFeatureModules.rejected, (state) => {
        state.getFeatureModulesStatus = "rejected";
        logger.log("getFeatureModules::REJECTED");
      })
      .addCase(getFeatureModules.fulfilled, (state, action) => {
        state.getFeatureModulesStatus = "fulfilled";
        state.getFeatureModules = action.payload;
      })

      //getLoyaltyTemplates
      .addCase(getLoyaltyTemplates.pending, (state) => {
        state.getLoyaltyTemplatesStatus = "loading";
      })
      .addCase(getLoyaltyTemplates.rejected, (state) => {
        state.getLoyaltyTemplatesStatus = "rejected";
        logger.log("getLoyaltyTemplates::REJECTED");
      })
      .addCase(getLoyaltyTemplates.fulfilled, (state, action) => {
        state.getLoyaltyTemplatesStatus = "fulfilled";
        state.getLoyaltyTemplates = action.payload;
      })

      //getLoyaltyTemplateTwo
      .addCase(getLoyaltyTemplatesTwo.pending, (state) => {
        state.getLoyaltyTemplatesStatusTwo = "loading";
      })
      .addCase(getLoyaltyTemplatesTwo.rejected, (state) => {
        state.getLoyaltyTemplatesStatusTwo = "rejected";
        logger.log("getLoyaltyTemplates::REJECTED");
      })
      .addCase(getLoyaltyTemplatesTwo.fulfilled, (state, action) => {
        state.getLoyaltyTemplatesStatusTwo = "fulfilled";
        state.getLoyaltyTemplatesTwo = action.payload;
      })

      // submitAccessGroup
      .addCase(submitAccessGroup.pending, (state) => {
        state.submitAccessGroupStatus = "loading";
      })
      .addCase(submitAccessGroup.rejected, (state, action) => {
        state.submitAccessGroupStatus = "rejected";
        logger.warn("submitAccessGroup::REJECTED", action.error);
      })
      .addCase(submitAccessGroup.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitAccessGroup::FULFILLED", { payload });

        state.submitAccessGroupStatus = "fulfilled";
      })

      // submitWarehouseTransfer
      .addCase(submitWarehouseTransfer.pending, (state) => {
        state.submitWarehouseTransferStatus = "loading";
      })
      .addCase(submitWarehouseTransfer.rejected, (state, action) => {
        state.submitWarehouseTransferStatus = "rejected";
        logger.warn("submitWarehouseTransfer::REJECTED", action.error);
      })
      .addCase(submitWarehouseTransfer.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitWarehouseTransfer::FULFILLED", { payload });

        state.submitWarehouseTransferStatus = "fulfilled";
      })

      // approveWarehouseTransfer
      .addCase(approveWarehouseTransfer.pending, (state) => {
        state.approveWarehouseTransferStatus = "loading";
      })
      .addCase(approveWarehouseTransfer.rejected, (state, action) => {
        state.approveWarehouseTransferStatus = "rejected";
        logger.warn("approveWarehouseTransfer::REJECTED", action.error);
      })
      .addCase(approveWarehouseTransfer.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("approveWarehouseTransfer::FULFILLED", { payload });

        state.approveWarehouseTransferStatus = "fulfilled";
      })

      // editWarehouseTransfer
      .addCase(editWarehouseTransfer.pending, (state) => {
        state.editWarehouseTransferStatus = "loading";
      })
      .addCase(editWarehouseTransfer.rejected, (state, action) => {
        state.editWarehouseTransferStatus = "rejected";
        logger.warn("editWarehouseTransfer::REJECTED", action.error);
      })
      .addCase(editWarehouseTransfer.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("editWarehouseTransfer::FULFILLED", { payload });

        state.editWarehouseTransferStatus = "fulfilled";
      })

      // removeWarehouseTransfer
      .addCase(removeWarehouseProduct.pending, (state) => {
        state.removeWarehouseTransferStatus = "loading";
      })
      .addCase(removeWarehouseProduct.rejected, (state, action) => {
        state.removeWarehouseTransferStatus = "rejected";
        logger.warn("removeWarehouseTransfer::REJECTED", action.error);
      })
      .addCase(removeWarehouseProduct.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("removeWarehouseTransfer::FULFILLED", { payload });

        state.removeWarehouseTransferStatus = "fulfilled";
      })

      // removeWarehouseAdmin
      .addCase(removeWarehouseAdmin.pending, (state) => {
        state.removeWarehouseAdminStatus = "loading";
      })
      .addCase(removeWarehouseAdmin.rejected, (state, action) => {
        state.removeWarehouseAdminStatus = "rejected";
        logger.warn("removeWarehouseAdmin::REJECTED", action.error);
      })
      .addCase(removeWarehouseAdmin.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("removeWarehouseAdmin::FULFILLED", { payload });

        state.removeWarehouseAdminStatus = "fulfilled";
      })

      // submitWarehouseTransfer
      .addCase(submitWarehouseStaff.pending, (state) => {
        state.submitWarehouseStaffStatus = "loading";
      })
      .addCase(submitWarehouseStaff.rejected, (state, action) => {
        state.submitWarehouseStaffStatus = "rejected";
        logger.warn("submitWarehouseStaff::REJECTED", action.error);
      })
      .addCase(submitWarehouseStaff.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitWarehouseStaff::FULFILLED", { payload });

        state.submitWarehouseStaffStatus = "fulfilled";
      })

      // fetchPackagesList
      .addCase(fetchPackagesList.pending, (state) => {
        state.packagesListStatus = "loading";
      })
      .addCase(fetchPackagesList.rejected, (state) => {
        state.packagesListStatus = "rejected";
        logger.log("fetchPackagesList::REJECTED");
      })
      .addCase(fetchPackagesList.fulfilled, (state, action) => {
        state.packagesListStatus = "fulfilled";
        state.packagesList = action.payload;
      })

      // fetchSubscriptionInvoices
      .addCase(fetchSubscriptionInvoices.pending, (state) => {
        state.subscriptionInvoiceStatus = "loading";
      })
      .addCase(fetchSubscriptionInvoices.rejected, (state) => {
        state.subscriptionInvoiceStatus = "rejected";
        logger.log("fetchSubscriptionInvoices::REJECTED");
      })
      .addCase(fetchSubscriptionInvoices.fulfilled, (state, action) => {
        state.subscriptionInvoiceStatus = "fulfilled";
        state.subscriptionInvoiceList = action.payload;
      })

      // deleteAccessGroup
      .addCase(deleteAccessGroup.pending, (state) => {
        state.deleteAccessGroupStatus = "loading";
      })
      .addCase(deleteAccessGroup.rejected, (state, action) => {
        state.deleteAccessGroupStatus = "rejected";
        logger.warn("deleteAccessGroup::REJECTED", action.error);
      })
      .addCase(deleteAccessGroup.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteAccessGroup::FULFILLED", { payload });

        state.deleteAccessGroupStatus = "fulfilled";
      })

      // submitAccessGroupUsers
      .addCase(submitAccessGroupUsers.pending, (state) => {
        state.submitAccessGroupUsersStatus = "loading";
      })
      .addCase(submitAccessGroupUsers.rejected, (state, action) => {
        state.submitAccessGroupUsersStatus = "rejected";
        logger.warn("submitAccessGroupUsers::REJECTED", action.error);
      })
      .addCase(submitAccessGroupUsers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitAccessGroupUsers::FULFILLED", { payload });

        state.submitAccessGroupUsersStatus = "fulfilled";
      })

      // fetchPermissions
      .addCase(fetchPermissions.pending, (state) => {
        state.permissionsListStatus = "loading";
      })
      .addCase(fetchPermissions.rejected, (state) => {
        state.permissionsListStatus = "rejected";
        logger.log("fetchPermissions::REJECTED");
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissionsListStatus = "fulfilled";
        state.permissionsList = action.payload;
      })

      // fetchMyAccountData
      .addCase(fetchMyAccountData.pending, (state) => {
        state.myAccountDataStatus = "loading";
      })
      .addCase(fetchMyAccountData.rejected, (state) => {
        state.myAccountDataStatus = "rejected";
        logger.log("fetchMyAccountData::REJECTED");
      })
      .addCase(fetchMyAccountData.fulfilled, (state, action) => {
        state.myAccountDataStatus = "fulfilled";
        state.myAccountData = action.payload;
      })

      // submitAccessGroupPages
      .addCase(submitAccessGroupPages.pending, (state) => {
        state.submitAccessGroupPagesStatus = "loading";
      })
      .addCase(submitAccessGroupPages.rejected, (state, action) => {
        state.submitAccessGroupPagesStatus = "rejected";
        logger.warn("submitAccessGroupPages::REJECTED", action.error);
      })
      .addCase(submitAccessGroupPages.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitAccessGroupPages::FULFILLED", { payload });

        state.submitAccessGroupPagesStatus = "fulfilled";
      })

      //fetchBranchesList
      .addCase(fetchBranchesList.pending, (state) => {
        state.fetchBranchesListStatus = "loading";
      })
      .addCase(fetchBranchesList.rejected, (state, action) => {
        state.fetchBranchesListStatus = "rejected";
        logger.warn("fetchBranchesList::REJECTED", action.error);
      })
      .addCase(fetchBranchesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchBranchesList::FULFILLED", { payload });

        state.fetchBranchesListStatus = "fulfilled";
      });

    // END
  },
});

export default accessControl.reducer;

export const canViewPages = (page) => (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return true;
  }

  const myAccount = state.accessControl.myAccountData;

  // The merchant has accesss to everything
  if (myAccount?.role_id === "2") {
    return true;
  }

  const canViewThisPage = myAccount?.access_group_pages?.find(
    (item) => item?.accessible_page?.name === page
  );

  return canViewThisPage ? true : false;
};

export const hasBeenGranted = (permission) => (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return true;
  }

  const myAccount = state.accessControl.myAccountData;

  // The merchant has accesss to everything
  if (myAccount?.role_id === "2") {
    return true;
  }

  const canDoThing = myAccount?.access_group_permissions?.find(
    (item) => item?.grantable_permission?.name === permission
  );

  return canDoThing ? true : false;
};

export const subscriptionDays = (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return 0;
  }

  const myAccount = state.accessControl.myAccountData;

  return myAccount?.subscription.remaining_days ?? 0;
};

export const hasActiveSubscription = (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (
    loadingStatus === "idle" ||
    loadingStatus === "loading" ||
    loadingStatus === "rejected"
  ) {
    return true;
  }

  const myAccount = state.accessControl.myAccountData;

  return myAccount?.subscription?.is_active ?? false;
};

export const isCarWash = (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return false;
  }

  const myAccount = state.accessControl.myAccountData;

  return myAccount?.carwash ?? false;
};

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("next_url");
    window.localStorage.removeItem("with_data");
  }
};
