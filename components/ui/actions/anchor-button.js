function AnchorButton(props) {
  const { icon, href, title, filled, responsive } = props;
  const variant = props.variant ?? "primary";
  const isResponsive = responsive ?? true;
  const isLoading = props.isLoading ?? false;

  const onClickHandler = (event) => {
    if (isLoading) {
      event.preventDefault();
    }
  };

  const button = (
    <a
      className={`btn btn-sm
          ${variant === "info" && "btn-info"}
          ${variant === "primary" && "btn-primary"}
          ${variant === "success" && "btn-success"}
          ${variant === "error" && "btn-error"} font-normal
          ${!filled && "btn-outline"} ${icon && "gap-2"}
        `}
      href={href}
      onClick={onClickHandler}
    >
      {!isLoading && icon && <i className={`${icon}`}></i>}
      {isLoading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
      {!isLoading && (
        <span className={`${icon && isResponsive && "hidden lg:inline"}`}>
          {title}
        </span>
      )}
    </a>
  );

  return button;
}

export default AnchorButton;
