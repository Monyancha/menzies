import { parseValidInt } from "../../../lib/shared/data-formatters";

export default function PaginationLinksDark({ paginatedData, onLinkClicked }) {
  return (
    paginatedData && (
      <section className="flex justify-between items-center px-3 py-2 flex-col lg:flex-row gap-2 w-full">
        <span className="text-base-content text-sm">
          Showing {paginatedData?.from ?? 0} to {paginatedData?.to ?? 0} of
          {" " + (paginatedData?.total ?? 0)}
        </span>

        <div className="flex flex-row gap-1 flex-wrap lg:flex-nowrap">
          {paginatedData?.links?.map((item) => (
            <PaginationCard
              paginatedData={paginatedData}
              item={item}
              key={`${paginatedData?.current_page ?? 0}_${item.url}_${
                item.label
              }`}
              onClick={() => {
                if (!item?.url) {
                  return;
                }
                onLinkClicked(item?.url);
              }}
            />
          ))}
        </div>
      </section>
    )
  );
}

function PaginationCard({
  paginatedData = null,
  item = null,
  onClick = () => {},
} = {}) {
  const pd = { ...paginatedData };
  const it = { ...item };
  if (item?.label === "...")
    return (
      <span className="h-8 w-8 flex items-center justify-center ">
        <span className="">...</span>
      </span>
    );

  if (item?.label.endsWith("Previous") || item?.label.startsWith("Next"))
    return (
      <span
        className={`h-8 w-8 flex items-center justify-center rounded
          ${
            item?.url &&
            "bg-base-300 hover:bg-primary active:scale-75 cursor-pointer tr-eo"
          }
          ${!item?.url && "bg-base-300 bg-opacity-50"}
                  `}
        onClick={() => {
          if (!item?.url) {
            return;
          }
          onClick(item?.url);
        }}
      >
        <span className="">
          {item?.label.endsWith("Previous") && "<"}
          {item?.label.startsWith("Next") && ">"}
        </span>
      </span>
    );

  return (
    <span
      className={`h-8 w-8 rounded flex items-center  text-primary justify-center cursor-pointer tr-eo
          ${
            it?.label != pd.current_page &&
            "bg-primary hover:bg-primary text-white active:scale-75"
          }
          ${
            it?.label == pd.current_page &&
            "bg-primary hover:scale-125  text-white"
          }
      `}
      onClick={onClick}
    >
      <span>
        {parseValidInt(item?.label) != 0 && parseValidInt(item?.label ?? 0)}
      </span>
    </span>
  );
}
