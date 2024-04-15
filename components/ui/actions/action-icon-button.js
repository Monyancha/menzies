function ActionIconButton(props) {
  const { icon, clickHandler, tooltip } = props;
  const isLoading = props.isLoading ?? false;

  return (
    <button
      className="button-primary-outline tooltip"
      data-tip={tooltip}
      onClick={clickHandler}
    >
      <i
        className={`
${isLoading ? "fa-solid fa-circle-notch animate-spin" : icon}
      text-lg`}
      ></i>
    </button>
  );
}

export default ActionIconButton;
