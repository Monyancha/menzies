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
  fetchSellables,
} from "../../../store/merchants/transactions/transaction-slice";
import { formatNumber } from "../../../lib/shared/data-formatters";
import store from "../../../store/store";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import { TextInput } from "@mantine/core";
import { useRouter } from "next/router";

export default function SellableCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const dispatch = useDispatch();

  const sellablesList = useSelector(
    (state) => state.posTransaction.sellablesList
  );
  const sellablesListStatus = useSelector(
    (state) => state.posTransaction.sellablesListStatus
  );
  const isLoadingSellables = sellablesListStatus === "loading";
  const searchInputRef = useRef(null);

  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    searchInputRef.current.select();
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

  const onSearchInputHandler = (event) => {
    setSearchTerm(event.target.value);
    sendSearchRequest(event.target.value);
  };

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    // if (sellablesListStatus === "idle") {
    store.dispatch(fetchSellables(params));
    //   searchInputRef.current.select();
    // }
  }, [branch_id, accessToken, status]);

  function addItem(sellableId) {
    store.dispatch(addTransactionItem(sellableId));
  }

  const body = (
    <Fragment>
      {!isLoadingSellables && sellablesList && sellablesList.data.length > 0 && (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {sellablesList.data.map((item) => (
            <div
              className="h-full"
              key={item.id}
              onClick={() => addItem(item.id)}
            >
              <section className="h-full flex flex-col items-center justify-center bg-white rounded-xl w-full py-8 hover:bg-primary hover:text-white cursor-pointer shadow-xl hover:shadow-sm transition-all ease-out duration-150 hover:-translate-y-1 active:scale-95">
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
        <input
          type="text"
          name="search"
          id="posSellableSearchInput"
          className="input input-primary inline py-2 h-10 rounded-md"
          placeholder="Search for items. Make sure this is highlighted to use a barcode scanner"
          onInput={onSearchInputHandler}
          value={searchTerm}
          autoComplete="off"
          ref={searchInputRef}
          autoFocus={true}
        />
      </div>

      <div className="w-full">{body}</div>
    </div>
  );
}
