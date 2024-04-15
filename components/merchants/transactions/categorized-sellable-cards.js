import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransactionItem,
  fetchSellableCategories,
  fetchSellables,
} from "../../../store/merchants/transactions/transaction-slice";
import { fetchMenuItemsAccomp } from "@/store/merchants/inventory/inventory-slice";
import { formatNumber } from "../../../lib/shared/data-formatters";
import store from "../../../store/store";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../ui/layouts/pagination-links";
import { NavLink } from "@mantine/core";
import KeyboardInput from "../../ui/forms/keyboard-input";
import { isViewTab } from "../../../lib/shared/printing-helpers";
import { showNotification } from "@mantine/notifications";
import { isRestaurant } from "../../../lib/shared/roles_and_permissions";

export default function CategorizedSellableCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const dispatch = useDispatch();
  const [currentParams, setCurrentParams] = useState(null);

  const sellablesList = useSelector(
    (state) => state.posTransaction.sellablesList
  );
  const sellablesListStatus = useSelector(
    (state) => state.posTransaction.sellablesListStatus
  );

  const sellableCategoryList = useSelector(
    (state) => state.posTransaction.sellableCategoryList?.data ?? []
  );
  const sellableCategoryStatus = useSelector(
    (state) => state.posTransaction.sellableCategoryStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const combo_sellable_list = useSelector(
    (state) => state.posTransaction.comboSellableList
  );

  const isLoadingSellables = sellablesListStatus === "loading";
  const searchInputRef = useRef(null);

  const isTab = isViewTab();
  const showCategoryMenu = useSelector(
    (state) => state.posTransaction.showCategoryMenu
  );

  useEffect(() => {
    // searchInputRef.current.select();
  }, []);

  // Avoid recreating the function on every state change
  // https://stackoverflow.com/a/67266725/7450617
  // https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks
  const debouncedSearchRequest = useMemo(
    () =>
      debounce(async (term) => {
        if (!term || !accessToken || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = accessToken;
        params["branch_id"] = branch_id;

        params["filter"] = term;
        setCurrentParams(params);
        try {
          const sellables = await dispatch(fetchSellables(params)).unwrap();
          const theSellable = sellables.data[0];
          if (
            sellables.data?.length === 1 &&
            theSellable?.metadata?.upc === term
          ) {
            dispatch(addTransactionItem(theSellable.id));
            setSearchTerm("");
          }
        } catch (e) {
          console.warn(e);
        }
      }, 150),
    [branch_id, accessToken, status, dispatch]
  );

  const sendSearchRequest = useCallback(
    (term) => debouncedSearchRequest(term),
    [debouncedSearchRequest]
  );

  const onSearchInputHandler = (event_value) => {
    setSearchTerm(event_value);
    sendSearchRequest(event_value);
  };

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    setCurrentParams(params);

    store.dispatch(fetchSellables(params));
    // searchInputRef?.current?.select();
  }, [branch_id, accessToken, status]);

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;
    params["pageCount"] = 40;

    store.dispatch(fetchSellableCategories(params));
    // searchInputRef.current.select();
  }, [branch_id, accessToken, status]);

  async function addItem(sellableId, sellable_type, sellable_id) {
    if (isRestaurant(session.user)) {
      // alert("This is A Menu Item " + sellable_id);
      const params = {};
      params["accessToken"] = accessToken;
      params["id"] = sellable_id;

      store.dispatch(fetchMenuItemsAccomp(params));
    }
    if (sellable_type === "App\\Models\\Sellables\\ComboSellable") {
      store.dispatch(addTransactionItem(sellableId));
    } else {
      store.dispatch(addTransactionItem(sellableId));
    }
  }

  function fetchFromCategory(show, category_id, sub_category_id) {
    setSearchTerm("");

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    if (!show) {
      params["category_id"] = null;
      params["sub_category_id"] = null;
      store.dispatch(fetchSellables(params));
      setCurrentParams(params);
      return;
    }

    params["category_id"] = category_id;
    params["sub_category_id"] = sub_category_id;
    setCurrentParams({ ...params });

    if (isTab) {
      showNotification({
        title: "Info",
        message: "Applying filter",
        color: "blue",
      });
    }

    store.dispatch(fetchSellables(params));
  }

  function onPaginationLinkClicked(page) {
    if (!page || !currentParams) {
      return;
    }

    const params = { ...currentParams, page };
    store.dispatch(fetchSellables(params));
  }

  const isRestaurantAc = isRestaurant(session?.user);

  const body = (
    <Fragment>
      {!isLoadingSellables && sellablesList && sellablesList.data.length > 0 && (
        <div className="w-full grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-2">
          {sellablesList.data.map((item) => (
            <div
              className="h-full"
              key={item.id}
              onClick={() =>
                addItem(item.id, item.sellable_type, item.sellable_id)
              }
            >
              <section className="h-full flex flex-col items-center justify-center bg-white rounded w-full py-6 hover:bg-primary hover:text-white cursor-pointer shadow-xl hover:shadow-sm transition-all ease-out duration-150 hover:-translate-y-1 active:scale-95">
                <div className="font-bold text-center">
                  {item.sellable.name}
                </div>
                <div className="text-center text-sm space-x-2">
                  <span className="tracking-wide">KSh.</span>
                  <span className="tracking-widest font-medium">
                    {formatNumber(item.sellable.cost)}
                  </span>
                </div>
              </section>
            </div>
          ))}
        </div>
      )}

      {!isLoadingSellables &&
        (sellablesList?.length === 0 || !sellablesList) && (
          <div className="w-full text-dark text-center">No Results</div>
        )}

      {isLoadingSellables && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </Fragment>
  );

  return (
    <div className="w-full h-full">
      <div className="w-full pb-5">
        <KeyboardInput
          placeholder="Search for items. Make sure this is highlighted to use a barcode scanner"
          ref={searchInputRef}
          onChangeHandler={onSearchInputHandler}
          value={searchTerm}
        />
      </div>
      <section className="flex gap-4">
        {((!isTab && isRestaurantAc) || showCategoryMenu) && (
          <div
            className={`${
              isTab ? "w-full" : "w-96"
            } bg-white rounded-lg p-3 max-h-[75vh] overflow-y-auto`}
          >
            {sellableCategoryList?.map((item, index) =>
              item.product_sub_categories.length > 0 ? (
                <NavLink
                  label={item.name}
                  childrenOffset={28}
                  key={item.id}
                  variant={index % 2 == 0 ? "filled" : "light"}
                  description={
                    item.description ??
                    `${item.product_sub_categories.length} subcategories`
                  }
                  onChange={(value) => fetchFromCategory(value, item.id, null)}
                  active
                >
                  {item.product_sub_categories.map((sub_item) => (
                    <NavLink
                      label={sub_item.name}
                      key={sub_item.id}
                      description={sub_item.description ?? "No description"}
                      onClick={() =>
                        fetchFromCategory(true, item.id, sub_item.id)
                      }
                    />
                  ))}
                </NavLink>
              ) : (
                <NavLink
                  label={item.name}
                  childrenOffset={28}
                  key={item.id}
                  variant={index % 2 == 0 ? "filled" : "light"}
                  description={
                    item.description ??
                    `${item.product_sub_categories.length} subcategories`
                  }
                  onClick={() => fetchFromCategory(true, item.id, null)}
                  active
                />
              )
            )}
          </div>
        )}

        {(!isTab || !showCategoryMenu) && (
          <div className="w-full flex-col">
            {body}
            <PaginationLinks
              paginatedData={sellablesList}
              onLinkClicked={onPaginationLinkClicked}
            />
          </div>
        )}
      </section>
    </div>
  );
}
