import {
  fetchMarketplaceCategories,
  fetchMarketplaceSubCategories,
} from "@/store/merchants/inventory/categories-slice";
import store from "@/store/store";
import { Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NewMarketplaceCategoryModal from "./categories/new-marketplace-category-modal";
import NewMarketplaceSubCategoryModal from "./categories/new-marketplace-sub-category-modal";

export default function InventoryCategoryInputs({
  newModalIsLean = false,
  subCatModalIsLean = false,
  categoryId = null,
  onChangeCategory = () => {},
  subCategoryId = null,
  showSubCategories = true,
  onChangeSubCategory = () => {},
  categoryError = null,
} = {}) {
  const { data: session, status } = useSession();
  const [categoryFilter, setCategoryFilter] = useState(categoryId ?? "");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  const marketplaceCategoryStatus = useSelector(
    (state) => state.categories.marketplaceCategoryStatus
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
    if (
      !session ||
      status !== "authenticated" ||
      !categoryId ||
      !showSubCategories
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["marketplaceCategoryId"] = categoryId;

    if (subCategoryFilter) {
      params["filter"] = subCategoryFilter;
    }

    store.dispatch(fetchMarketplaceSubCategories(params));
  }, [session, status, categoryId, subCategoryFilter, showSubCategories]);

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
      <div className="w-full flex items-end space-x-2">
        <div className="grow">
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
            error={categoryError}
            searchable
            clearable
          />
        </div>

        <div className="flex-none">
          <NewMarketplaceCategoryModal
            isLean={newModalIsLean}
            onSuccess={(categoryId) => {
              onChangeCategory(`${categoryId}`);
              onChangeSubCategory("");

              // INFO: This will trigger the fetching of a category with this ID
              setCategoryFilter(`${categoryId}`);
            }}
          />
        </div>
      </div>

      {showSubCategories && (
        <div className="w-full flex items-end space-x-2">
          <div className="grow">
            <Select
              label="Sub Category"
              placeholder="Sub Category"
              data={[...sub_category_data]}
              value={subCategoryId ?? ""}
              disabled={!categoryId}
              onChange={onChangeSubCategory}
              onSearchChange={setSubCategoryFilter}
              searchValue={subCategoryFilter}
              searchable
              clearable
            />
          </div>

          <div className="flex-none">
            <NewMarketplaceSubCategoryModal
              categoryId={categoryId}
              isLean={subCatModalIsLean}
              onSuccess={(subCategoryId) => {
                onChangeSubCategory(`${subCategoryId}`);

                // INFO: This will trigger the fetching of a subcategory with this ID
                setSubCategoryFilter(`${subCategoryId}`);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
