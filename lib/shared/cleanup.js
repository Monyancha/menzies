export const clearLocalStorageCache = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("redux_cache_pos");
    window.localStorage.removeItem("redux_cache_branches");
    window.localStorage.removeItem("branch_id");
  }
};

export const clearMerchantCache = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("merchant_json");
    window.localStorage.clear();
  }
};
