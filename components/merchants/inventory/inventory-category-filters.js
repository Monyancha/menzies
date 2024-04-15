import {
  fetchMarketplaceCategories,
  fetchMarketplaceSubCategories,
} from "@/store/merchants/inventory/categories-slice";
import store from "@/store/store";
import { Loader, Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function InventoryCategoryFilters({
  categoryId = null,
  onChangeCategory = () => {},
  subCategoryId = null,
  onChangeSubCategory = () => {},
  showSubCategories = true,
} = {}) {
  const { data: session, status } = useSession();
  const [categoryFilter, setCategoryFilter] = useState(categoryId ?? "");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  const isLoadingCategories = useSelector(
    (state) => state.categories.marketplaceCategoryStatus === "loading"
  );

  const isLoadingSubCategories = useSelector(
    (state) => state.categories.marketplaceSubCategoryStatus === "loading"
  );

  const categories = useSelector(
    (state) => state.categories.marketplaceCategoryList
  );

  const subCategories = useSelector(
    (state) => state.categories.marketplaceSubCategoryList
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (categoryFilter) {
      params["filter"] = categoryFilter;
    }

    store.dispatch(fetchMarketplaceCategories(params));
  }, [session, status, categoryFilter]);

  useEffect(() => {
    if (!session || status !== "authenticated" || !categoryId) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["marketplaceCategoryId"] = categoryId;

    if (subCategoryFilter) {
      params["filter"] = subCategoryFilter;
    }

    store.dispatch(fetchMarketplaceSubCategories(params));
  }, [session, status, categoryId, subCategoryFilter]);

  const category_data =
    categories?.data?.map((item) => ({
      value: `${item.id}`,
      label: item.name,
    })) ?? [];

  const sub_category_data =
    subCategories?.data?.map((item) => ({
      value: `${item.id}`,
      label: item.name,
    })) ?? [];

  return (
    <>
      <Select
        label="Category"
        placeholder="Category"
        data={[...category_data]}
        value={categoryId ?? ""}
        onChange={(id) => {
          onChangeCategory(id);
          onChangeSubCategory("");
        }}
        onSearchChange={setCategoryFilter}
        searchValue={categoryFilter}
        icon={isLoadingCategories && <Loader size="xs" color="gray" />}
        searchable
        clearable
      />

      {showSubCategories && (
        <Select
          label="Sub Category"
          placeholder="Sub Category"
          data={[...sub_category_data]}
          value={subCategoryId ?? ""}
          disabled={!categoryId}
          onChange={onChangeSubCategory}
          onSearchChange={setSubCategoryFilter}
          searchValue={subCategoryFilter}
          icon={isLoadingSubCategories && <Loader size="xs" color="gray" />}
          searchable
          clearable
        />
      )}
    </>
  );
}
