import Link from "next/link";

export default function LinkCrumbDark({ title, href }) {
  return (
    <>
      <Link href={href} className="cursor-pointer text-base-content/50">
        {title}
      </Link>
      <i className="fa-solid fa-chevron-right hover:cursor-pointer mx-1 text-xs text-base-content/25"></i>
    </>
  );
}
