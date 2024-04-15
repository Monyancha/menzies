import store from "../../src/store/Store";
import { Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

export default function ExpenseStatusSelect({
  value = "",
  onChange = (v) => {},
  error = "",
  withAsterisk = false,
} = {}) {
  const merchantFlags = useSelector((state) => state.security.merchantFlags);

  const requireApproval = useMemo(
    () =>
      merchantFlags?.find(
        (item) => item.name === "require-approval-for-expenses"
      )?.details?.value ?? false,
    [merchantFlags]
  );


  if (!requireApproval) {
    return;
  }

  return (
    <>
      

      <Select
        label="Approval Status"
        placeholder="Approval Status"
        data={[
          { value: "rejected", label: "Rejected" },
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" }
        ]}
        value={value}
        onChange={onChange}
        error={error}
        searchable
        clearable
        withAsterisk={withAsterisk}
      />
    </>
  );
}
