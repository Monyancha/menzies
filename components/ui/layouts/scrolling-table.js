import { TextInput, Menu, Button } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { IconChevronDown } from "@tabler/icons-react";

export function Table(props) {
  return (
    <div className="flex flex-col ilo-table">
      <div className="overflow-x-auto horiz">
        <div className="inline-block py-2 min-w-full">
          <div className="overflow-hidden rounded-lg">
            <table className="rounded-lg min-w-full striped ">{props.children}</table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Thead(props) {
  return <thead className="bg-gray-50">{props.children}</thead>;
}

export function Trow(props) {
  return (
    <tr
      className={`border-b border-info border-opacity-40 bg-white even:bg-info even:bg-opacity-10 even:text-dark hover:bg-opacity-75 odd:hover:bg-info tr-eo
      ${props?.className}`}
    >
      {props.children}
    </tr>
  );
}

export function TDateFilter({
  startDate = "",
  endDate = "",
  onChangeStartDate = () => {},
  onChangeEndDate = () => {},
  disabled = false,
} = {}) {
  return (
    <>
      <TextInput
        label="From"
        placeholder="From"
        type="date"
        value={startDate}
        onChange={(e) => onChangeStartDate(e.target.value)}
        disabled={disabled}
      />

      <TextInput
        label="To"
        placeholder="To"
        type="date"
        value={endDate}
        onChange={(e) => onChangeEndDate(e.target.value)}
        disabled={disabled}
      />
    </>
  );
}

export function TDateTimeFilter({
  startDateTime = "",
  endDateTime = "",
  onChangeStartDateTime = () => {},
  onChangeEndDateTime = () => {},
  disabled = false,
} = {}) {
  return (
    <>
      <TextInput
        label="Start Date Time"
        placeholder="Start Date Time"
        type="datetime-local"
        value={startDateTime}
        onChange={(e) => onChangeStartDateTime(e.target.value)}
        disabled={disabled}
      />

      <TextInput
        label="End Date time"
        placeholder="End Date time"
        type="datetime-local"
        value={endDateTime}
        onChange={(e) => onChangeEndDateTime(e.target.value)}
        disabled={disabled}
      />
    </>
  );
}


export function TSearchFilter({
  debounceMs = 750,
  onChangeSearchTerm = () => {},
} = {}) {
  const [value, setValue] = useState("");

  const debouncedOnChangeDefinition = useMemo(
    () =>
      debounce((searchTerm) => {
        onChangeSearchTerm(searchTerm);
      }, debounceMs),
    [debounceMs, onChangeSearchTerm]
  );
  const onChangeDebounced = useCallback(
    (searchTerm) => debouncedOnChangeDefinition(searchTerm),
    [debouncedOnChangeDefinition]
  );

  return (
    <TextInput
      label="Search"
      placeholder="Search"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChangeDebounced(e.target.value);
      }}
    />
  );
}

export function PageSizeSelect({
  pageSize = 10,
  setPageSize = (v) => {},
  size = "sm",
} = {}) {
  return (
    <Menu shadow="sm" width={70} size={size}>
      <Menu.Target>
        <Button variant="light" rightIcon={<IconChevronDown size={16} />}>
          <span className="flex flex-row gap-1">
            <span className="text-xs font-normal">Per Page</span>
            <span className="text-xs font-bold">{pageSize}</span>
          </span>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {[10, 25, 50, 100, 200].map((item) => (
          <Menu.Item onClick={() => setPageSize(item)} key={item}>
            {item}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
