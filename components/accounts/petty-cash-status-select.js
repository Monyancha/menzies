import { Select } from "@mantine/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function PettyCashStatusSelect({
  value = "",
  onChange = (v) => {},
  error = "",
  withAsterisk = false,
} = {}) {


  return (
    <Select
      label="Status"
      placeholder="Status"
      data={[
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" },
        { value: "approved", label: "Approved" },
        { value: "issued", label: "Issued" },
      ]}
      value={value}
      onChange={onChange}
      error={error}
      searchable
      clearable
      withAsterisk={withAsterisk}
    />
  );
}
