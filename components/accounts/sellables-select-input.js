import { fetchSellables } from "../../src/store/transactions/transaction-slice";
import store from "../../src/store/Store";
import { Loader, Select } from "@mantine/core";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function SellablesSelectInput({
  parentValue = "",
  parentOption = null,
  onChange = (v) => {},
  onSellableChange = (sellable) => {},
}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => session?.user?.accessToken, [session]);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const [selectedOption, setSelectedOption] = useState(parentOption || null);
  const [value, setValue] = useState(parentValue || "");
  const valRef = useRef("");
  const [filter, setFilter] = useState("");
  const [products, setProducts] = useState([]); // Added this line
  const isLoading = useSelector(
    (state) => state.posTransaction.sellablesListStatus === "loading"
  );

  console.log("Selected Option Monyancha", selectedOption);

  const sellablesListStatus = useSelector(
    (state) => state.posTransaction.sellablesListStatus
  );

  useEffect(() => {
    if (!accessToken || sellablesListStatus !== "idle") return;

    const params = {
      accessToken,
      branch_id,
    };

    store.dispatch(fetchSellables(params));
  }, [accessToken, branch_id, sellablesListStatus]);

  useEffect(() => {
    if (!accessToken) return;

    const params = { accessToken };

    if (filter) {
      params.filter = filter;
    }

    store.dispatch(fetchSellables(params));
  }, [accessToken, filter]);

  const sellables = useSelector((state) => state.posTransaction.sellablesList);

  const onFilterChangeDebounced = useMemo(
    () =>
      debounce((term) => {
        if (valRef.current === term) {
          console.log("invoice-sellable::ignored", valRef.current, term);
          return;
        }

        console.log("invoice-sellable::updated", valRef.current, term);

        valRef.current = term;
        setFilter(term);
      }, 750),
    [valRef]
  );

  const options = useMemo(() => {
    const sellablesData = sellables?.data || [];
    const newOptions = sellablesData.map((item) => ({
      value: `${item.id}`,
      label: item?.sellable?.name,
    }));

    if (
      selectedOption?.value &&
      selectedOption?.label &&
      !newOptions.some((opt) => opt.value === selectedOption.value)
    ) {
      newOptions.push(selectedOption);
    }

    setProducts(newOptions);

    return newOptions;
  }, [sellables, selectedOption]);

  const handleCreateProduct = (query) => {
    const newItem = { value: query, label: query };
    setProducts((current) => [...current, newItem]);
    setSelectedOption(newItem);
    setValue(query); // Update the value state with the newly created item
  
    // Call onSellableChange with the newly created item
    onSellableChange({
      sellable: {
        id: null, // You can set the appropriate ID or leave it as null
        name: query,
      },
    });
  };
  
  return (
    <>
      <Select
        placeholder="Select Product/Service"
        data={products}
        searchable
        clearable
        value={value}
        onChange={(v) => {
          setValue(v);
          onChange(v);

          const sellable = sellables?.data?.find((item) => item?.id == v);
          onSellableChange(sellable);

          if (sellable) {
            setSelectedOption({
              value: `${sellable?.id}`,
              label: `${sellable?.sellable?.name}`,
            });

            valRef.current = sellable?.sellable?.name;
          } else {
            setSelectedOption(null);
          }
        }}
        onSearchChange={(v) => onFilterChangeDebounced(v)}
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={handleCreateProduct}
        icon={isLoading && <Loader size="xs" color="gray" />}
      />

    </>
  );
}
