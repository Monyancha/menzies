import ReactSelect from "react-select";

function Select(props) {
  const { options, inputHandler, changeHandler, selectedValue } = props;

  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 40,
      minHeight: 40,
      borderRadius: "8px",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="w-full">
      <ReactSelect
        options={options}
        menuPortalTarget={typeof document !== "undefined" && document.body}
        value={selectedValue && selectedValue}
        styles={selectStyles}
        onInputChange={inputHandler}
        onChange={changeHandler}
        id="long-value-select"
        instanceId="long-value-select"
      />
    </div>
  );
}

export default Select;
