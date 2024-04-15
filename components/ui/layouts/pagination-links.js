import PaginationLinksDark from "./pagination-links-dark";

function PaginationLinks({ paginatedData, onLinkClicked }) {
  return (
    <PaginationLinksDark
      paginatedData={paginatedData}
      onLinkClicked={onLinkClicked}
    />
  );
}

export default PaginationLinks;
