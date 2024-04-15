import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Categories");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  marketplaceCategoryList: null,
  marketplaceCategoryStatus: "idle",

  platformCategoryList: null,
  platformCategoryStatus: "idle",

  storeCategoryList: null,
  storeCategoryStatus: "idle",

  storeSubCategoryList: null,
  storeSubCategoryStatus: "idle",

  marketplaceSubCategoryList: null,
  marketplaceSubCategoryStatus: "idle",

  mcSubmissionStatus: "idle",
  mcEditSubmissionStatus: "idle",
  mcSubSubmissionStatus: "idle",
  mcSubEditSubmissionStatus: "idle",

  scSubmissionStatus: "idle",
  scEditSubmissionStatus: "idle",
  scSubSubmissionStatus: "idle",
  scSubEditSubmissionStatus: "idle",
};

export const fetchMarketplaceCategories = createAsyncThunk(
  "categoriesSlice/fetchMarketplaceCategories",
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
      url = `${API_URL}/categories/marketplace-categories?`;
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
    logger.log("fetchMarketplaceCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchMarketplaceCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStoreCategories = createAsyncThunk(
  "categoriesSlice/fetchStoreCategories",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    branch_id,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/categories/store-categories?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStoreCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStoreCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPlatformCategories = createAsyncThunk(
  "categoriesSlice/fetchPlatformCategories",
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
      url = `${API_URL}/categories/platform-categories?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPlatformCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPlatformCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitMarketplaceCategory = createAsyncThunk(
  "categoriesSlice/submitMarketplaceCategory",
  async ({
    accessToken = null,
    name = null,
    description = null,
    ps_sub_category_id = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/categories/marketplace-categories`;
    let body = {};

    body["name"] = name;
    body["description"] = description;
    body["ps_sub_category_id"] = ps_sub_category_id;
    body["branch_id"] = branch_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitMarketplaceCategory::BEGIN", body);
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
      logger.log("submitMarketplaceCategory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitEditMarketplaceCategory = createAsyncThunk(
  "categoriesSlice/submitEditMarketplaceCategory",
  async ({
    accessToken = null,

    id = null,
    name = null,
    description = null,
    ps_sub_category_id = null,
  } = {}) => {
    if (!accessToken || id === null) {
      return;
    }

    let url = `${API_URL}/categories/marketplace-categories/${id}`;
    let body = {};

    body["name"] = name;
    body["description"] = description;
    body["ps_sub_category_id"] = ps_sub_category_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditMarketplaceCategory::BEGIN", body);
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
      logger.log("submitEditMarketplaceCategory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitStoreCategory = createAsyncThunk(
  "categoriesSlice/submitStoreCategory",
  async ({
    accessToken = null,

    name = null,
    description = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/categories/store-categories`;
    let body = {};

    body["name"] = name;
    body["description"] = description;
    body["branch_id"] = branch_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitStoreCategory::BEGIN", body);
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
      logger.log("submitStoreCategory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitEditStoreCategory = createAsyncThunk(
  "categoriesSlice/submitEditStoreCategory",
  async ({
    accessToken = null,

    id = null,
    name = null,
    description = null,
  } = {}) => {
    if (!accessToken || id === null) {
      return;
    }

    let url = `${API_URL}/categories/store-categories/${id}`;
    let body = {};

    body["name"] = name;
    body["description"] = description;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditStoreCategory::BEGIN", body);
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
      logger.log("submitEditStoreCategory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchMarketplaceSubCategories = createAsyncThunk(
  "categoriesSlice/fetchMarketplaceSubCategories",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    marketplaceCategoryId = null,
  } = {}) => {
    if (!accessToken || marketplaceCategoryId === null) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/categories/marketplace-categories/${marketplaceCategoryId}/sub-categories?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchMarketplaceSubCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchMarketplaceSubCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitMarketplaceSubCategory = createAsyncThunk(
  "categoriesSlice/submitMarketplaceSubCategory",
  async ({
    accessToken = null,
    marketplaceCategoryId = null,

    name = null,
    description = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/categories/marketplace-categories/${marketplaceCategoryId}/sub-categories`;
    let body = {};

    body["name"] = name;
    body["description"] = description;
    body["inventory_product_category_id"] = marketplaceCategoryId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitMarketplaceSubCategory::BEGIN", body);
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
      logger.log("submitMarketplaceSubCategory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitEditMarketplaceSubCategory = createAsyncThunk(
  "categoriesSlice/submitEditMarketplaceSubCategory",
  async ({
    accessToken = null,
    marketplaceCategoryId = null,

    id = null,
    name = null,
    description = null,
  } = {}) => {
    if (!accessToken || id === null) {
      return;
    }

    let url = `${API_URL}/categories/marketplace-categories/${marketplaceCategoryId}/sub-categories/${id}`;
    let body = {};

    body["name"] = name;
    body["description"] = description;
    body["inventory_product_category_id"] = marketplaceCategoryId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditMarketplaceSubCategory::BEGIN", body);
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
      logger.log("submitEditMarketplaceSubCategory::END", {
        took: seconds,
        data,
      });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStoreSubCategories = createAsyncThunk(
  "categoriesSlice/fetchStoreSubCategories",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    storeCategoryId = null,
  } = {}) => {
    if (!accessToken || storeCategoryId === null) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/categories/store-categories/${storeCategoryId}/sub-categories?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStoreSubCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStoreSubCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitStoreSubCategory = createAsyncThunk(
  "categoriesSlice/submitStoreSubCategory",
  async ({
    accessToken = null,
    storeCategoryId = null,

    name = null,
    description = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/categories/store-categories/${storeCategoryId}/sub-categories`;
    let body = {};

    body["name"] = name;
    body["description"] = description;
    body["storage_category_id"] = storeCategoryId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitStoreSubCategory::BEGIN", body);
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
      logger.log("submitStoreSubCategory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitEditStoreSubCategory = createAsyncThunk(
  "categoriesSlice/submitEditStoreSubCategory",
  async ({
    accessToken = null,
    storeCategoryId = null,

    id = null,
    name = null,
    description = null,
  } = {}) => {
    if (!accessToken || id === null) {
      return;
    }

    let url = `${API_URL}/categories/store-categories/${storeCategoryId}/sub-categories/${id}`;
    let body = {};

    body["name"] = name;
    body["description"] = description;
    body["storage_category_id"] = storeCategoryId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitEditStoreSubCategory::BEGIN", body);
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
      logger.log("submitEditStoreSubCategory::END", {
        took: seconds,
        data,
      });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // fetchMarketplaceCategories
      .addCase(fetchMarketplaceCategories.pending, (state) => {
        state.marketplaceCategoryStatus = "loading";
      })
      .addCase(fetchMarketplaceCategories.rejected, (state) => {
        state.marketplaceCategoryStatus = "rejected";
        logger.log("fetchMarketplaceCategories::REJECTED");
      })
      .addCase(fetchMarketplaceCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchMarketplaceCategories::FULFILLED", { payload });

        state.marketplaceCategoryStatus = "fulfilled";
        state.marketplaceCategoryList = action.payload;
      })

      // fetchStoreCategories
      .addCase(fetchStoreCategories.pending, (state) => {
        state.storeCategoryStatus = "loading";
      })
      .addCase(fetchStoreCategories.rejected, (state) => {
        state.storeCategoryStatus = "rejected";
        logger.log("fetchStoreCategories::REJECTED");
      })
      .addCase(fetchStoreCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchStoreCategories::FULFILLED", { payload });

        state.storeCategoryStatus = "fulfilled";
        state.storeCategoryList = action.payload;
      })

      // fetchPlatformCategories
      .addCase(fetchPlatformCategories.pending, (state) => {
        state.platformCategoryStatus = "loading";
      })
      .addCase(fetchPlatformCategories.rejected, (state) => {
        state.platformCategoryStatus = "rejected";
        logger.log("fetchPlatformCategories::REJECTED");
      })
      .addCase(fetchPlatformCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchPlatformCategories::FULFILLED", { payload });

        state.platformCategoryStatus = "fulfilled";
        state.platformCategoryList = action.payload;
      })

      // fetchMarketplaceSubCategories
      .addCase(fetchMarketplaceSubCategories.pending, (state) => {
        state.marketplaceSubCategoryStatus = "loading";
      })
      .addCase(fetchMarketplaceSubCategories.rejected, (state) => {
        state.marketplaceSubCategoryStatus = "rejected";
        logger.log("fetchMarketplaceSubCategories::REJECTED");
      })
      .addCase(fetchMarketplaceSubCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchMarketplaceSubCategories::FULFILLED", { payload });

        state.marketplaceSubCategoryStatus = "fulfilled";
        state.marketplaceSubCategoryList = action.payload;
      })

      // fetchStoreSubCategories
      .addCase(fetchStoreSubCategories.pending, (state) => {
        state.storeSubCategoryStatus = "loading";
      })
      .addCase(fetchStoreSubCategories.rejected, (state) => {
        state.storeSubCategoryStatus = "rejected";
        logger.log("fetchStoreSubCategories::REJECTED");
      })
      .addCase(fetchStoreSubCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchStoreSubCategories::FULFILLED", { payload });

        state.storeSubCategoryStatus = "fulfilled";
        state.storeSubCategoryList = action.payload;
      })

      // submitMarketplaceCategory
      .addCase(submitMarketplaceCategory.pending, (state) => {
        state.mcSubmissionStatus = "loading";
      })
      .addCase(submitMarketplaceCategory.rejected, (state, action) => {
        state.mcSubmissionStatus = "rejected";
        logger.warn("submitMarketplaceCategory::REJECTED", action.error);
      })
      .addCase(submitMarketplaceCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitMarketplaceCategory::FULFILLED", { payload });

        state.mcSubmissionStatus = "fulfilled";
      })

      // submitStoreCategory
      .addCase(submitStoreCategory.pending, (state) => {
        state.scSubmissionStatus = "loading";
      })
      .addCase(submitStoreCategory.rejected, (state, action) => {
        state.scSubmissionStatus = "rejected";
        logger.warn("submitStoreCategory::REJECTED", action.error);
      })
      .addCase(submitStoreCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitStoreCategory::FULFILLED", { payload });

        state.scSubmissionStatus = "fulfilled";
      })

      // submitEditMarketplaceCategory
      .addCase(submitEditMarketplaceCategory.pending, (state) => {
        state.mcEditSubmissionStatus = "loading";
      })
      .addCase(submitEditMarketplaceCategory.rejected, (state, action) => {
        state.mcEditSubmissionStatus = "rejected";
        logger.warn("submitEditMarketplaceCategory::REJECTED", action.error);
      })
      .addCase(submitEditMarketplaceCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditMarketplaceCategory::FULFILLED", { payload });

        state.mcEditSubmissionStatus = "fulfilled";
      })

      // submitEditStoreCategory
      .addCase(submitEditStoreCategory.pending, (state) => {
        state.scEditSubmissionStatus = "loading";
      })
      .addCase(submitEditStoreCategory.rejected, (state, action) => {
        state.scEditSubmissionStatus = "rejected";
        logger.warn("submitEditStoreCategory::REJECTED", action.error);
      })
      .addCase(submitEditStoreCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditStoreCategory::FULFILLED", { payload });

        state.scEditSubmissionStatus = "fulfilled";
      })

      // submitMarketplaceSubCategory
      .addCase(submitMarketplaceSubCategory.pending, (state) => {
        state.mcSubSubmissionStatus = "loading";
      })
      .addCase(submitMarketplaceSubCategory.rejected, (state, action) => {
        state.mcSubSubmissionStatus = "rejected";
        logger.warn("submitMarketplaceSubCategory::REJECTED", action.error);
      })
      .addCase(submitMarketplaceSubCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitMarketplaceSubCategory::FULFILLED", { payload });

        state.mcSubSubmissionStatus = "fulfilled";
      })

      // submitEditMarketplaceSubCategory
      .addCase(submitEditMarketplaceSubCategory.pending, (state) => {
        state.mcSubEditSubmissionStatus = "loading";
      })
      .addCase(submitEditMarketplaceSubCategory.rejected, (state, action) => {
        state.mcSubEditSubmissionStatus = "rejected";
        logger.warn("submitEditMarketplaceSubCategory::REJECTED", action.error);
      })
      .addCase(submitEditMarketplaceSubCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditMarketplaceSubCategory::FULFILLED", { payload });

        state.mcSubEditSubmissionStatus = "fulfilled";
      })

      // submitStoreSubCategory
      .addCase(submitStoreSubCategory.pending, (state) => {
        state.scSubSubmissionStatus = "loading";
      })
      .addCase(submitStoreSubCategory.rejected, (state, action) => {
        state.scSubSubmissionStatus = "rejected";
        logger.warn("submitStoreSubCategory::REJECTED", action.error);
      })
      .addCase(submitStoreSubCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitStoreSubCategory::FULFILLED", { payload });

        state.scSubSubmissionStatus = "fulfilled";
      })

      // submitEditStoreSubCategory
      .addCase(submitEditStoreSubCategory.pending, (state) => {
        state.scSubEditSubmissionStatus = "loading";
      })
      .addCase(submitEditStoreSubCategory.rejected, (state, action) => {
        state.scSubEditSubmissionStatus = "rejected";
        logger.warn("submitEditStoreSubCategory::REJECTED", action.error);
      })
      .addCase(submitEditStoreSubCategory.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditStoreSubCategory::FULFILLED", { payload });

        state.scSubEditSubmissionStatus = "fulfilled";
      });

    //
  },
});

export default categoriesSlice.reducer;
