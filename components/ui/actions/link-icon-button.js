import Link from "next/link";

function LinkIconButton({ icon, href, tooltip }) {
  return (
    <Link href={href}>
      <a className="button-primary-outline tooltip" data-tip={tooltip}>
        <i className={`${icon} text-lg`}></i>
      </a>
    </Link>
  );
}

export default LinkIconButton;
