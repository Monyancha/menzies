import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import store from "@/store/store";
import { fetchClients } from "@/store/merchants/partners/clients-slice";
import { Select, Loader } from "@mantine/core";

export default function ContactSelectInput({
  value = null,
  error = null,
  onChange = (contact) => {},
} = {}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const clientListStatus = useSelector(
    (state) => state.clients.clientListStatus
  );
  const clientList = useSelector(
    (state) => state.clients.clientList?.data ?? []
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["value"] = value;

    if (clientListStatus === "idle") {
      store.dispatch(fetchClients(params));
    }
  }, [accessToken, clientListStatus, value]);

  const onInputHandler = debounce((value) => {
    if (!accessToken || !value) {
      return;
    }

    const client = clientList.find((item) => item.id == value);
    if (client) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["filter"] = value;

    store.dispatch(fetchClients(params));
  }, 1000);

  const clients =
    clientList?.map((client) => ({
      value: `${client.id}`,
      label: `${client.name} ${client.phone !== null ? client.phone : ""} ${
        client.car_plate ?? ""
      }`,
    })) ?? [];

  return (
    <div className="flex flex-col gap-2">
      <Select
        placeholder="Select Client"
        label="Client"
        value={`${value}`}
        data={clients}
        onSearchChange={onInputHandler}
        onChange={(clientId) => {
          onChange(clientId);
        }}
        icon={
          clientListStatus === "loading" && <Loader size="xs" color="gray" />
        }
        searchable
        clearable
        error={error}
      />
    </div>
  );
}
