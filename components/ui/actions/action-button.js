import Link from "next/link";

function ActionButton(props) {
  const { icon, clickHandler, title, filled, responsive } = props;
  const variant = props.variant ?? "primary";
  const isResponsive = responsive ?? true;
  const isLoading = props.isLoading ?? false;
  const size = props.size ?? "sm";

  const button = (
    <button
      onClick={clickHandler}
      className={`btn
          ${size === "sm" && "btn-sm"}
          ${size === "md" && "btn-md"}
          ${variant === "info" && "btn-info"}
          ${variant === "primary" && "btn-primary"}
          ${variant === "error" && "btn-error"} font-normal
          ${!filled && "btn-outline"}
          ${icon && "gap-2"}
        `}
    >
      {!isLoading && icon && <i className={`${icon}`}></i>}
      {isLoading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
      {!isLoading && (
        <span className={`${icon && isResponsive && "hidden lg:inline"}`}>
          {title}
        </span>
      )}
    </button>
  );

  return button;
}

export default ActionButton;
