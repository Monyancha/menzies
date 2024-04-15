import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../../lib/shared/logger";

const logger = getLogger("Products");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getProducts: null,
  getProductsStatus: "idle",

  getCombos: null,
  getCombosStatus: "idle",

  getComboSubItemDetails: null,
  getComboSubItemDetailsStatus: "idle",

  submitVariantProductStatus: "idle",
  submitProductComponentStatus: "idle",
  submitStageProcessingStatus:"idle",
  submitProductManufacturingStatus: "idle",
  startStageStatus:"idle",
  updateMenuItemsDetailStatus: "idle",
  startManufacturingStatus:"idle",
  EditComponentStatus: "idle",
  EditExpenseStatus: "idle",
  EditManufacturingStatus: "idle",
  addVariantToProductStatus: "idle",
  deleteComponentStatus: "idle",
  deleteExpenseStatus: "idle",

  getCombosSubItems: null,
  getCombosSubItemsStatus: "idle",

  getProductsPDF: null,
  getProductsPDFStatus: "idle",

  getProductsExcel: null,
  getProductsExcelStatus: "idle",

  fetchManualAdjustment: null,
  fetchManualAdjustmentStatus: "idle",

  getComboDetails: null,
  getComboDetailsStatus: "idle",

  getInventoryCategories: null,
  getInventoryCategoriesStatus: "idle",

  getStorageCategories: null,
  getStorageCategoriesStatus: "idle",

  getProductTax: null,
  getProductTaxStatus: "idle",

  existingProduct: null,
  existingProductId: null,
  existingProductStatus: "idle",
  existingComponentStatus: "idle",
  existingManufacturingStatus: null,
  existingComponents: null,
  existingProductComponentStatus:"idle",
  existingProductComponents:null,
  existingManufacturings: null,
  existingExpenses: null,
  existingExpenseStatus: "idle",
  manufactureProductsStatus: "idle",
  manufactured_products: null,
  component_stock:null,
  manufacturing_id:null,
  recipeStatus: "idle",
  recipeStageStatus:"idle",
  recipes: null,
  recipe_stages:null,
  selected_products: null,
  selectedProductStatus: "idle"
};

export const updateMenuItem = createAsyncThunk(
  "products/updateMenuItem",
  async ({
    accessToken = null,

    recordId = null,

    body = {},
  } = {}) => {
    if (!accessToken || !recordId) {
      return;
    }

    let url = `${API_URL}/menu-items/${recordId}`;

    logger.log("updateMenuItem::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "PUT",
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
      logger.log("updateMenuItem::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitNewMenuItem = createAsyncThunk(
  "products/submitNewMenuItem",
  async ({
    accessToken = null,

    body = {},
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/menu-items`;

    logger.log("submitNewMenuItem::BEGIN", body);
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
      logger.log("submitNewMenuItem::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({
    page = null,
    accessToken = null,
    branch_id = null,
    entries = null,
    category_id = null,
    sub_category_id = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/products?`;
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
    logger.log("getProducts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProducts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Product
export const fetchExistingProduct = createAsyncThunk(
  "products/fetchExistingProduct",
  async ({ accessToken = null, productId = null } = {}) => {
    if (!accessToken || !productId) {
      return;
    }

    let url = `${API_URL}/products/${productId}?`;

    const startTime = new Date();
    logger.log("fetchExistingProduct::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingProduct:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Product
export const fetchExistingServiceComponent = createAsyncThunk(
  "products/fetchExistingComponent",
  async ({
    accessToken = null,
    productId = null,
    startDate = null,
    endDate = null,
    searchTerm = null,
    product_status = null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/product-service-components?`;
    }
    // console.log("Here Is The Data");
    const params = {};
    if (productId) {
      params["productId"] = productId;
    }

    if (recipe_id) {
      params["recipe_id"] = recipe_id;
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (product_status) {
      params["product_status"] = product_status;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingComponent::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingComponent:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Product
export const fetchExistingComponent = createAsyncThunk(
  "products/fetchExistingComponent",
  async ({
    accessToken = null,
    productId = null,
    recipe_id = null,
    startDate = null,
    endDate = null,
    searchTerm = null,
    product_status = null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/product-components?`;
    }
    // console.log("Here Is The Data");
    const params = {};
    if (productId) {
      params["productId"] = productId;
    }

    if (recipe_id) {
      params["recipe_id"] = recipe_id;
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (product_status) {
      params["product_status"] = product_status;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingComponent::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingComponent:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Product
export const fetchProductComponents = createAsyncThunk(
  "products/fetchProductComponents",
  async ({
    accessToken = null,
    productId = null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/stock-register-report?`;
    }
    // console.log("Here Is The Data");
    const params = {};
    if (productId) {
      params["sellable_id"] = productId;
    }




    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchProductComponents::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchProductComponents:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Manufacturings
export const fetchExistingManufacturings = createAsyncThunk(
  "products/fetchExistingManufacturings",
  async ({
    accessToken = null,
    productId = null,
    start_date = null,
    end_date = null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/manufacturings?`;
    }
    // console.log("Here Is The Data");
    const params = {};
    if (productId) {
      params["productId"] = productId;
    }
    if (start_date && end_date) {
      params["start_date"] = start_date;
      params["end_date"] = end_date;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingManufacturings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingManufacturings:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Recipes
export const fetchExistingRecipes = createAsyncThunk(
  "products/fetchExistingRecipes",
  async ({
    accessToken = null,
    recipe_id = null,
    productId = null,
    product_status=null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/recipes?`;
    }
    // console.log("Here Is The Data");
    const params = {};
    console.log("The productId is" + productId);
    //  if(productId)
    //  {
    params["productId"] = productId;
    //  }
    //  if(recipe_id)
    //  {
    params["recipe_id"] = recipe_id;
    //  }
    params["product_status"] = product_status;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingRecipes::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingRecipes:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Recipes
export const fetchExistingRecipeStages = createAsyncThunk(
  "products/fetchExistingRecipeStages",
  async ({
    accessToken = null,
    recipe_id = null,
    productId = null,
    product_status=null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/recipe_stages?`;
    }
    // console.log("Here Is The Data");
    const params = {};
    console.log("The productId is" + productId);
    //  if(productId)
    //  {
    params["productId"] = productId;
    //  }
    //  if(recipe_id)
    //  {
    params["recipe_id"] = recipe_id;
    //  }
    params["product_status"] = product_status;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingRecipeStages::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingRecipeStages:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Product
export const fetchExistingExpenses = createAsyncThunk(
  "products/fetchExistingExpenses",
  async ({ accessToken = null, productId = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/product-expenses?`;
    }
    console.log("Here Is The Data");
    const params = {};

    params["productId"] = productId;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingExpenses::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingExpenses:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Select Products
export const fetchSelectProducts = createAsyncThunk(
  "products/fetchSelectProducts",
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
      url = `${API_URL}/all-products?`;
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
    logger.log("fetchSelectProducts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSelectProducts:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Fetch Existing Product
export const fetchManufacturedProducts = createAsyncThunk(
  "products/fetchManufacturedProducts",
  async ({
    accessToken = null,
    raw_material_id = null,
    start_date = null,
    end_date = null,
    filter = null,
    page = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/manufactured-products?`;
    }
    // console.log("Here Is The Data");
    const params = {};
    if (raw_material_id) {
      params["raw_material_id"] = raw_material_id;
    }
    if (start_date) {
      params["start_date"] = start_date;
    }
    if (end_date) {
      params["end_date"] = end_date;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchManufacturedProducts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchManufacturedProducts:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);
export const deleteComponent = createAsyncThunk(
  "products/deleteComponent",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/product-components/${itemId}`;

    const startTime = new Date();
    logger.log("deleteComponent::BEGIN");
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
      logger.log("deleteComponent::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteExpense = createAsyncThunk(
  "products/deleteExpense",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/remove-expense/${itemId}`;

    const startTime = new Date();
    logger.log("deleteExpense::BEGIN");
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
      logger.log("deleteExpense::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);
// /combo/{combo_id}/sub-item/{combo_item_id}

export const getComboSubItemDetails = createAsyncThunk(
  "products/getComboSubItemDetails",
  async ({ accessToken = null, comboId = null, comboItemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/combo/${comboId}/sub-item/${comboItemId}`;

    const startTime = new Date();
    logger.log("getComboSubItemDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getComboSubItemDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Submit Variant Product
export const addVariantToProduct = createAsyncThunk(
  "products/addVariantToProduct",
  async ({
    accessToken = null,
    product_values = [],
    product_type = null,
    name = null,
    tax_id = null,
    tax_method = null,
    product_details = null,
    show_on_marketplace = null,
    inventory_category_id = null,
    inventory_sub_category_id = null,
    storage_category_id = null,
    storage_sub_category_id = null,
    active_image = null,
    expires = null,
    existing_stock = null,
    productId = null,
    sellable_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/product/${productId}/add-variation-to-product`;

    let body = {};

    body["product_values"] = product_values;
    body["product_type"] = product_type;
    body["show_on_marketplace"] = show_on_marketplace;
    body["inventory_category_id"] = inventory_category_id;
    body["inventory_sub_category_id"] = inventory_sub_category_id;
    body["storage_category_id"] = storage_category_id;
    body["storage_sub_category_id"] = storage_sub_category_id;
    body["active_image"] = active_image;
    body["expires"] = expires;
    body["name"] = name;
    body["product_type"] = product_type;
    body["tax_id"] = tax_id;
    body["tax_method"] = tax_method;
    body["product_details"] = product_details;
    body["existing_stock"] = existing_stock;
    body["sellable_id"] = sellable_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("addVariantToProduct::BEGIN", body);
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
      logger.log("addVariantToProduct::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Submit Variant Product
export const submitVariantProduct = createAsyncThunk(
  "products/submitVariantProduct",
  async ({
    accessToken = null,
    product_values = [],
    product_type = null,
    name = null,
    tax_id = null,
    tax_method = null,
    product_details = null,
    show_on_marketplace = null,
    inventory_category_id = null,
    inventory_sub_category_id = null,
    storage_category_id = null,
    storage_sub_category_id = null,
    active_image = null,
    expires = null,
    branch_id = null,
    unit_id=null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/products`;
    let body = {};

    body["product_values"] = product_values;
    body["product_type"] = product_type;
    body["show_on_marketplace"] = show_on_marketplace;

    body["inventory_category_id"] = inventory_category_id;
    body["inventory_sub_category_id"] = inventory_sub_category_id;
    body["storage_category_id"] = storage_category_id;
    body["storage_sub_category_id"] = storage_sub_category_id;

    body["active_image"] = active_image;
    body["expires"] = expires;
    body["name"] = name;
    body["product_type"] = product_type;
    body["tax_id"] = tax_id;
    body["unit_id"] = unit_id;
    body["tax_method"] = tax_method;
    body["product_details"] = product_details;
    body["branch_id"] = branch_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitVariantProduct::BEGIN", body);
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
      logger.log("submitVariantProduct::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Submit  Product Components
export const submitProductComponent = createAsyncThunk(
  "products/submitProductComponent",
  async ({
    accessToken = null,
    product_components = [],
    other_expenses = [],
    productId = null,
    quantity_to_manufacture = null,
    recipe_name = null,
    product_status = null,
    recipe_id = null,
    stages = []
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/product-components`;
    let body = {};

    body["product_components"] = product_components;
    body["other_expenses"] = other_expenses;
    body["product_sellable_id"] = productId;
    body["quantity_to_manufacture"] = quantity_to_manufacture;
    body["recipe_name"] = recipe_name;
    body["product_status"] = product_status;
    body["recipe_id"] = recipe_id;
    body["stages"] = stages;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitProductComponent::BEGIN", body);
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
      logger.log("submitProductComponent::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Submit  Stage Processing
export const submitStageProcessing = createAsyncThunk(
  "products/submitStageProcessing",
  async ({
    accessToken = null,
    stage_id = null,
    qty = null,
    manufacturing_id,
    recipe_id=null

  } = {}) => {
    if (!accessToken) {
      return;
    }


    let url = `${API_URL}/process_stage`;
    let body = {};

    body["qty"] = qty;
    body["stage_id"] = stage_id;
    body["manufacturing_id"] = manufacturing_id;
    body["recipe_id"] = recipe_id;


    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitStageProcessing::BEGIN", body);
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
      logger.log("submitStageProcessing::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Submit  Product Components
export const submitProductManufacturing = createAsyncThunk(
  "products/submitProductManufacturing",
  async ({
    accessToken = null,
    recipe_id = null,
    quantity_to_manufacture = null,
    productId = null,
    selling_price = null,
    buying_price = null,
    status = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/manufacturings`;
    let body = {};

    body["selling_price"] = selling_price;
    body["product_sellable_id"] = productId;
    body["quantity_to_manufacture"] = quantity_to_manufacture;
    body["recipe_id"] = recipe_id;
    body["selling_price"] = selling_price;
    body["buying_price"] = buying_price;
    body["status"] = status;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitProductManufacturing::BEGIN", body);
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
      logger.log("submitProductManufacturing::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Start Manufacturing
export const startManufacturing = createAsyncThunk(
  "products/startManufacturing",
  async ({
    accessToken = null,
    recipe_id = null,
    quantity_to_manufacture = null,
    productId = null,

  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/start-manufacturing`;
    let body = {};


    body["product_sellable_id"] = productId;
    body["quantity_to_manufacture"] = quantity_to_manufacture;
    body["recipe_id"] = recipe_id;


    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("startManufacturing::BEGIN", body);
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
      logger.log("startManufacturing::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Start Stage
export const startStage = createAsyncThunk(
  "products/startStage",
  async ({
    accessToken = null,
    recipe_id = null,
    stage_id = null,
    manufacturing_id = null,

  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/start-stage`;
    let body = {};


    body["stage_id"] = stage_id;
    body["manufacturing_id"] = manufacturing_id;
    body["recipe_id"] = recipe_id;


    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("startStage::BEGIN", body);
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
      logger.log("startStage::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Update Menu Items Details
export const updateMenuItemsDetails = createAsyncThunk(
  "products/updateMenuItemsDetails",
  async ({
    accessToken = null,
    recipe_id = null,
    quantity_to_manufacture = null,
    productId = null,
    selling_price = null,
    buying_price = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/update-menu-items`;
    let body = {};

    body["selling_price"] = selling_price;
    body["product_sellable_id"] = productId;
    body["quantity_to_manufacture"] = quantity_to_manufacture;
    body["recipe_id"] = recipe_id;
    body["selling_price"] = selling_price;
    body["buying_price"] = buying_price;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("updateMenuItemsDetails::BEGIN", body);
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
      logger.log("updateMenuItemsDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Edit Product Components
export const submitEditComponent = createAsyncThunk(
  "products/submitEditComponent",
  async ({
    accessToken = null,
    product_components = [],
    productId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/product-components/${productId}`;
    let body = {};
    body["product_components"] = product_components;
    body["product_sellable_id"] = productId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditComponent::BEGIN", body);
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
      logger.log("submitEditComponent::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Edit  Expense
export const submitEditExpense = createAsyncThunk(
  "products/submitEditExpense",
  async ({
    accessToken = null,
    product_expenses = [],
    productId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/product-components/${productId}`;
    let body = {};
    body["product_expenses"] = product_expenses;
    body["product_sellable_id"] = productId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditExpense::BEGIN", body);
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
      logger.log("submitEditExpense::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Edit Product Manufacturings
export const submitEditManufacturing = createAsyncThunk(
  "products/submitEditManufacturing",
  async ({
    accessToken = null,
    quantity_to_manufacture,
    manufacture_id = null,
    selling_price = null,
    buying_price = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/manufacturings/${manufacture_id}`;
    let body = {};
    body["manufacture_id"] = manufacture_id;
    body["quantity_to_manufacture"] = quantity_to_manufacture;
    body["selling_price"] = selling_price;
    body["buying_price"] = buying_price;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditManufacturing::BEGIN", body);
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
      logger.log("submitEditManufacturing::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getInventoryCategories = createAsyncThunk(
  "products/getInventoryCategories",
  async ({ accessToken = null, page = null,branch_id=null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/categories?`;
    }

    const params = {};
    params['branch_id']= branch_id;
    url += new URLSearchParams(params);


    const startTime = new Date();
    logger.log("getInventoryCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInventoryCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Combo Sub Items
export const getCombosSubItems = createAsyncThunk(
  "combos/getCombosSubItems",
  async ({ accessToken = null, page = null, comboId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/combo/${comboId}/sub-item`;
    }

    const startTime = new Date();
    logger.log("getCombosSubItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCombosSubItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStorageCategories = createAsyncThunk(
  "products/getStorageCategories",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/storage/categories`;
    }

    const startTime = new Date();
    logger.log("getStorageCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStorageCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getProductTax = createAsyncThunk(
  "products/getProductTax",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/product/tax`;
    }

    const startTime = new Date();
    logger.log("getProductTax::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductTax::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getCombos = createAsyncThunk(
  "products/getCombos",
  async ({
    accessToken = null,
    page = null,
    filter = null,
    branch_id = null,
    entries = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/combos?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    if (entries) {
      params["entries"] = entries;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getCombos::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCombos::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getComboDetails = createAsyncThunk(
  "products/getComboDetails",
  async ({ accessToken = null, page = null, comboId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/combos/${comboId}`;
    }

    const startTime = new Date();
    logger.log("getComboDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getComboDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getProductsPDF = createAsyncThunk(
  "products/getProductsPDF",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
    branch_id = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/products/downloadPDF/exportPDF?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProductsPDF::BEGIN");
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
      logger.log("getProductsPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Products.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const getProductsExcel = createAsyncThunk(
  "products/getProductsExcel",
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
      url = `${API_URL}/products/downloadExcel/exportExcel`;
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
    logger.log("getProductsExcel::BEGIN");
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
      logger.log("getProductsExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Products.xlsx`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchManualAdjustment = createAsyncThunk(
  "adjustment/fetchManualAdjustment",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/manual-adjustment-req`;

    const startTime = new Date();
    logger.log("fetchManualAdjustment::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchManualAdjustment::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getProducts Data
      .addCase(getProducts.pending, (state) => {
        state.getProductsStatus = "loading";
      })
      .addCase(getProducts.rejected, (state) => {
        state.getProductsStatus = "rejected";
        logger.log("getRestaurant::REJECTED");
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.getProductsStatus = "fulfilled";
        state.getProducts = action.payload;
      })

      //getComboSubItemDetails
      .addCase(getComboSubItemDetails.pending, (state) => {
        state.getComboSubItemDetailsStatus = "loading";
      })
      .addCase(getComboSubItemDetails.rejected, (state) => {
        state.getComboSubItemDetailsStatus = "rejected";
        logger.log("getComboSubItemDetails::REJECTED");
      })
      .addCase(getComboSubItemDetails.fulfilled, (state, action) => {
        state.getComboSubItemDetailsStatus = "fulfilled";
        state.getComboSubItemDetails = action.payload;
      })

      //getCombosSubItems
      .addCase(getCombosSubItems.pending, (state) => {
        state.getCombosSubItemsStatus = "loading";
      })
      .addCase(getCombosSubItems.rejected, (state) => {
        state.getCombosSubItemsStatus = "rejected";
        logger.log("getCombosSubItems::REJECTED");
      })
      .addCase(getCombosSubItems.fulfilled, (state, action) => {
        state.getCombosSubItemsStatus = "fulfilled";
        state.getCombosSubItems = action.payload;
      })

      // getInventoryCategories Data
      .addCase(getInventoryCategories.pending, (state) => {
        state.getInventoryCategoriesStatus = "loading";
      })
      .addCase(getInventoryCategories.rejected, (state) => {
        state.getInventoryCategoriesStatus = "rejected";
        logger.log("getInventoryCategories::REJECTED");
      })
      .addCase(getInventoryCategories.fulfilled, (state, action) => {
        state.getInventoryCategoriesStatus = "fulfilled";
        state.getInventoryCategories = action.payload;
      })

      // getStorageCategories Data
      .addCase(getStorageCategories.pending, (state) => {
        state.getStorageCategoriesStatus = "loading";
      })
      .addCase(getStorageCategories.rejected, (state) => {
        state.getStorageCategoriesStatus = "rejected";
        logger.log("getStorageCategories::REJECTED");
      })
      .addCase(getStorageCategories.fulfilled, (state, action) => {
        state.getStorageCategoriesStatus = "fulfilled";
        state.getStorageCategories = action.payload;
      })

      // deleteComponent
      .addCase(deleteComponent.pending, (state) => {
        state.deleteComponentStatus = "loading";
      })
      .addCase(deleteComponent.rejected, (state, action) => {
        state.deleteComponentStatus = "rejected";
        logger.warn("deleteComponent::REJECTED", action.error);
      })
      .addCase(deleteComponent.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteComponent::FULFILLED");

        state.deleteComponentStatus = "fulfilled";
      })

      // deleteExpense
      .addCase(deleteExpense.pending, (state) => {
        state.deleteExpenseStatus = "loading";
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteExpenseStatus = "rejected";
        logger.warn("deleteExpense::REJECTED", action.error);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteExpense::FULFILLED");

        state.deleteExpenseStatus = "fulfilled";
      })

      //
      .addCase(fetchExistingProduct.pending, (state) => {
        state.existingProductStatus = "loading";
      })
      .addCase(fetchExistingProduct.rejected, (state, action) => {
        state.existingProductStatus = "rejected";
        logger.log("fetchExistingProduct::REJECTED", action.error);
      })
      .addCase(fetchExistingProduct.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingProduct::FULFILLED", { payload });

        state.existingProductStatus = "fulfilled";

        const product = action.payload;
        state.existingProduct = product;
        state.existingProductId = product?.id ?? null;
      })

      //
      .addCase(fetchExistingRecipes.pending, (state) => {
        state.recipeStatus = "loading";
      })
      .addCase(fetchExistingRecipes.rejected, (state, action) => {
        state.recipeStatus = "rejected";
        logger.log("fetchExistingRecipes::REJECTED", action.error);
      })
      .addCase(fetchExistingRecipes.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingRecipes::FULFILLED", { payload });

        state.recipeStatus = "fulfilled";

        const recipes = action.payload;
        state.recipes = recipes;

      })

       //
       .addCase(fetchExistingRecipeStages.pending, (state) => {
        state.recipeStageStatus = "loading";
      })
      .addCase(fetchExistingRecipeStages.rejected, (state, action) => {
        state.recipeStageStatus = "rejected";
        logger.log("fetchExistingRecipeStages::REJECTED", action.error);
      })
      .addCase(fetchExistingRecipeStages.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingRecipeStages::FULFILLED", { payload });

        state.recipeStageStatus = "fulfilled";

        const recipe_stages = action.payload;
        state.recipe_stages = recipe_stages;

      })
      //
      .addCase(fetchSelectProducts.pending, (state) => {
        state.selectedProductStatus = "loading";
      })
      .addCase(fetchSelectProducts.rejected, (state, action) => {
        state.selectedProductStatus = "rejected";
        logger.log("fetchSelectProducts::REJECTED", action.error);
      })
      .addCase(fetchSelectProducts.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSelectProducts::FULFILLED", { payload });

        state.selectedProductStatus = "fulfilled";
        state.selected_products = action.payload;
      })
      //edit product components
      // submitEditComponent
      .addCase(submitEditComponent.pending, (state) => {
        state.EditComponentStatus = "loading";
      })
      .addCase(submitEditComponent.rejected, (state, action) => {
        state.EditComponentStatus = "rejected";
        logger.warn("submitEditComponent::REJECTED", action.error);
      })
      .addCase(submitEditComponent.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditComponent::FULFILLED", { payload });

        state.EditComponentStatus = "fulfilled";
      })

      // submitEditExpense
      .addCase(submitEditExpense.pending, (state) => {
        state.EditExpenseStatus = "loading";
      })
      .addCase(submitEditExpense.rejected, (state, action) => {
        state.EditExpenseStatus = "rejected";
        logger.warn("submitEditExpense::REJECTED", action.error);
      })
      .addCase(submitEditExpense.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditExpense::FULFILLED", { payload });

        state.EditExpenseStatus = "fulfilled";
      })

      // submitEditManufacturing
      .addCase(submitEditManufacturing.pending, (state) => {
        state.EditManufacturingStatus = "loading";
      })
      .addCase(submitEditManufacturing.rejected, (state, action) => {
        state.EditManufacturingStatus = "rejected";
        logger.warn("submitEditManufacturing::REJECTED", action.error);
      })
      .addCase(submitEditManufacturing.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditManufacturing::FULFILLED", { payload });

        state.EditManufacturingStatus = "fulfilled";
      })

      //
      .addCase(fetchExistingComponent.pending, (state) => {
        state.existingComponentStatus = "loading";
      })
      .addCase(fetchExistingComponent.rejected, (state, action) => {
        state.existingComponentStatus = "rejected";
        logger.log("fetchExistingComponent::REJECTED", action.error);
      })
      .addCase(fetchExistingComponent.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingComponent::FULFILLED", { payload });
        state.existingComponentStatus = "fulfilled";
        state.existingComponents = action.payload;
      })

      //
      .addCase(fetchProductComponents.pending, (state) => {
        state.existingComponentStatus = "loading";
      })
      .addCase(fetchProductComponents.rejected, (state, action) => {
        state.existingComponentStatus = "rejected";
        logger.log("fetchProductComponents::REJECTED", action.error);
      })
      .addCase(fetchProductComponents.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchProductComponents::FULFILLED", { payload });
        state.existingProductComponentStatus = "fulfilled";
        state.existingProductComponents = action.payload;
      })

      //
      .addCase(fetchExistingManufacturings.pending, (state) => {
        state.existingManufacturingStatus = "loading";
      })
      .addCase(fetchExistingManufacturings.rejected, (state, action) => {
        state.existingManufacturingStatus = "rejected";
        logger.log("fetchExistingManufacturings::REJECTED", action.error);
      })
      .addCase(fetchExistingManufacturings.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingManufacturings::FULFILLED", { payload });
        state.existingManufacturingStatus = "fulfilled";
        state.existingManufacturings = action.payload;
      })

      //
      .addCase(fetchManufacturedProducts.pending, (state) => {
        state.manufactureProductsStatus = "loading";
      })
      .addCase(fetchManufacturedProducts.rejected, (state, action) => {
        state.manufactureProductsStatus = "rejected";
        logger.log("fetchManufacturedProducts::REJECTED", action.error);
      })
      .addCase(fetchManufacturedProducts.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchManufacturedProducts::FULFILLED", { payload });

        state.manufactureProductsStatus = "fulfilled";

        state.manufactured_products = action.payload;
       
      })

      //
      .addCase(fetchExistingExpenses.pending, (state) => {
        state.existingExpenseStatus = "loading";
      })
      .addCase(fetchExistingExpenses.rejected, (state, action) => {
        state.existingExpenseStatus = "rejected";
        logger.log("fetchExistingExpense::REJECTED", action.error);
      })
      .addCase(fetchExistingExpenses.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingExpense::FULFILLED", { payload });

        state.existingExpenseStatus = "fulfilled";

        state.existingExpenses = action.payload;
      })

      // getProductTax Data
      .addCase(getProductTax.pending, (state) => {
        state.getProductTaxStatus = "loading";
      })
      .addCase(getProductTax.rejected, (state) => {
        state.getProductTaxStatus = "rejected";
        logger.log("getProductTax::REJECTED");
      })
      .addCase(getProductTax.fulfilled, (state, action) => {
        state.getProductTaxStatus = "fulfilled";
        state.getProductTax = action.payload;
      })

      // PDF Data
      .addCase(getProductsPDF.pending, (state) => {
        state.getProductsPDFStatus = "loading";
      })
      .addCase(getProductsPDF.rejected, (state) => {
        state.getProductsPDFStatus = "rejected";
        logger.log("getProductsPDFStatus::REJECTED");
      })
      .addCase(getProductsPDF.fulfilled, (state, action) => {
        state.getProductsPDFStatus = "fulfilled";
        state.getProductsPDF = action.payload;
      })

      //Submit Variant Products
      .addCase(submitVariantProduct.pending, (state) => {
        state.submitVariantProductStatus = "loading";
      })
      .addCase(submitVariantProduct.rejected, (state, action) => {
        state.submitVariantProductStatus = "rejected";
        logger.warn("submitStockTransfer::REJECTED", action.error);
      })
      .addCase(submitVariantProduct.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitVariantProduct::FULFILLED", { payload });

        state.submitVariantProductStatus = "fulfilled";
      })

      //Submit  Product Component
      .addCase(submitProductComponent.pending, (state) => {
        state.submitProductComponentStatus = "loading";
      })
      .addCase(submitProductComponent.rejected, (state, action) => {
        state.submitProductComponentStatus = "rejected";
        logger.warn("submitProductComponent::REJECTED", action.error);
      })
      .addCase(submitProductComponent.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitProductComponent::FULFILLED", { payload });

        state.submitProductComponentStatus = "fulfilled";
      })

       //Submit  Stage Processing
       .addCase(submitStageProcessing.pending, (state) => {
        state.submitStageProcessingStatus = "loading";
      })
      .addCase(submitStageProcessing.rejected, (state, action) => {
        state.submitStageProcessingStatus = "rejected";
        logger.warn("submitStageProcessing::REJECTED", action.error);
      })
      .addCase(submitStageProcessing.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitStageProcessing::FULFILLED", { payload });

        state.submitStageProcessingStatus = "fulfilled";
      })

      //Submit  Product Manufacturing
      .addCase(submitProductManufacturing.pending, (state) => {
        state.submitProductManufacturingStatus = "loading";
      })
      .addCase(submitProductManufacturing.rejected, (state, action) => {
        state.submitProductManufacturingStatus = "rejected";
        logger.warn("submitProductManufacturing::REJECTED", action.error);
      })
      .addCase(submitProductManufacturing.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitProductManufacturing::FULFILLED", { payload });

        state.submitProductManufacturingStatus = "fulfilled";
      })

      //Update Menu Items Details
      .addCase(updateMenuItemsDetails.pending, (state) => {
        state.updateMenuItemsDetailStatus = "loading";
      })
      .addCase(updateMenuItemsDetails.rejected, (state, action) => {
        state.updateMenuItemsDetailStatus = "rejected";
        logger.warn("updateMenuItemsDetails::REJECTED", action.error);
      })
      .addCase(updateMenuItemsDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("updateMenuItemsDetails::FULFILLED", { payload });

        state.updateMenuItemsDetailStatus = "fulfilled";
      })

      //Start Manufacturing
      .addCase(startManufacturing.pending, (state) => {
        state.startManufacturingStatus = "loading";
      })
      .addCase(startManufacturing.rejected, (state, action) => {
        state.startManufacturingStatus = "rejected";
        logger.warn("startManufacturing::REJECTED", action.error);
      })
      .addCase(startManufacturing.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("startManufacturing::FULFILLED", { payload });

        state.startManufacturingStatus = "fulfilled";
        state.manufacturing_id=payload.id;
      })

      //Start Manufacturing
      .addCase(startStage.pending, (state) => {
        state.startStageStatus = "loading";
      })
      .addCase(startStage.rejected, (state, action) => {
        state.startStageStatus = "rejected";
        logger.warn("startStage::REJECTED", action.error);
      })
      .addCase(startStage.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("startStage::FULFILLED", { payload });

        state.startStageStatus = "fulfilled";
      })

      //Add Variation To Product
      .addCase(addVariantToProduct.pending, (state) => {
        state.addVariantToProductStatus = "loading";
      })
      .addCase(addVariantToProduct.rejected, (state, action) => {
        state.addVariantToProductStatus = "rejected";
        logger.warn("submitStockTransfer::REJECTED", action.error);
      })
      .addCase(addVariantToProduct.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("addVariantToProduct::FULFILLED", { payload });

        state.addVariantToProductStatus = "fulfilled";
      })

      // Excel Data
      .addCase(getProductsExcel.pending, (state) => {
        state.getProductsExcelStatus = "loading";
      })
      .addCase(getProductsExcel.rejected, (state) => {
        state.getProductsExcelStatus = "rejected";
        logger.log("getProductsExcel::REJECTED");
      })
      .addCase(getProductsExcel.fulfilled, (state, action) => {
        state.getProductsExcelStatus = "fulfilled";
        state.getProductsExcel = action.payload;
      })

      // fetchManualAdjustment Data
      .addCase(fetchManualAdjustment.pending, (state) => {
        state.fetchManualAdjustmentStatus = "loading";
      })
      .addCase(fetchManualAdjustment.rejected, (state) => {
        state.fetchManualAdjustmentStatus = "rejected";
        logger.log("fetchManualAdjustment::REJECTED");
      })
      .addCase(fetchManualAdjustment.fulfilled, (state, action) => {
        state.fetchManualAdjustmentStatus = "fulfilled";
        state.fetchManualAdjustment = action.payload;
      })

      //getComboDetails Data
      .addCase(getComboDetails.pending, (state) => {
        state.getComboDetailsStatus = "loading";
      })
      .addCase(getComboDetails.rejected, (state) => {
        state.getComboDetailsStatus = "rejected";
        logger.log("getComboDetails::REJECTED");
      })
      .addCase(getComboDetails.fulfilled, (state, action) => {
        state.getComboDetailsStatus = "fulfilled";
        state.getComboDetails = action.payload;
      })

      // getCombos Data
      .addCase(getCombos.pending, (state) => {
        state.getCombosStatus = "loading";
      })
      .addCase(getCombos.rejected, (state) => {
        state.getCombosStatus = "rejected";
        logger.log("getCombos::REJECTED");
      })
      .addCase(getCombos.fulfilled, (state, action) => {
        state.getCombosStatus = "fulfilled";
        state.getCombos = action.payload;
      });
  },
});

export default productsSlice.reducer;
