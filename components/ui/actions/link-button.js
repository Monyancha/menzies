import Link from "next/link";

function LinkButton(props) {
  const { icon, href, title, filled, responsive } = props;
  const variant = props.variant ?? "primary";
  const isResponsive = responsive ?? true;
  const isLoading = props.isLoading ?? false;

  const button = (
    <Link href={href}>
      <a
        className={`btn btn-sm
          ${variant === "info" && "btn-info"}
          ${variant === "primary" && "btn-primary"}
          ${variant === "warning" && "btn-warning"}
          ${variant === "success" && "btn-success"}
          ${variant === "error" && "btn-error"} font-normal
          ${!filled && "btn-outline"} ${icon && "gap-2"}
        `}
      >
        {!isLoading && icon && <i className={`${icon}`}></i>}
        {isLoading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
        {!isLoading && (
          <span className={`${icon && isResponsive && "hidden lg:inline"}`}>
            {title}
          </span>
        )}
      </a>
    </Link>
  );

  return button;
}

export default LinkButton;
