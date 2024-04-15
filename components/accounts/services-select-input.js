import { fetchLeanServices } from "@/store/merchants/inventory/inventory-slice";
import store from "@/store/store";
import { Loader, Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function ServicesSelectInput({
  parentValue = "",
  parentOption = null,
  onChange = (v) => {},
  onServiceChange = (service) => {},
}) {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);
  const branch_id = useSelector((state) => state.branches.branch_id);

  // ===========================================================================
  // Locally Cached Values
  // ===========================================================================
  // This is for when editing, we don't have to make network calls
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    setSelectedOption(parentOption);
  }, [parentOption]);

  // This is for just in case the parent takes time to update
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(parentValue);
  }, [parentValue]);
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  const [filter, setFilter] = useState("");

  const listStatus = useSelector(
    (state) => state.posTransaction.leanServicesStatus
  );

  const isLoading = useSelector(
    (state) => state.inventory.leanServicesStatus === "loading"
  );

  // Does the initial loading
  useEffect(() => {
    if (!accessToken || listStatus != "idle") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(fetchLeanServices(params));
  }, [accessToken, branch_id, listStatus]);

  // Does the loading on filter change
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;

    if (filter) {
      params["filter"] = filter;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    


    store.dispatch(fetchLeanServices(params));
  }, [accessToken, filter,branch_id]);

  const services = useSelector((state) => state.inventory.leanServicesList);

  const data = useMemo(() => {
    const options =
      services?.data?.map((item) => ({
        value: `${item.id}`,
        label: item?.name,
      })) ?? [];

    if (
      selectedOption?.value &&
      selectedOption?.label &&
      // The option doesn't already exist
      options.findIndex((opt) => opt.value === selectedOption.value) === -1
    ) {
      options.push(selectedOption);
    }

    return options;
  }, [services, selectedOption]);

  return (
    <Select
      label="Service"
      placeholder="Select Service"
      data={data}
      searchable
      clearable
      value={value}
      onChange={(v) => {
        // Update the local state
        setValue(v);

        // Update parent state
        onChange(v);

        // For the service hook
        const service = services?.data?.find((item) => item?.id == v);
        onServiceChange(service);

        if (service) {
          setSelectedOption({
            value: `${service?.id}`,
            label: `${service?.name}`,
          });
        } else {
          setSelectedOption(null);
        }
      }}
      onSearchChange={setFilter}
      icon={isLoading && <Loader size="xs" color="gray" />}
    />
  );
}
