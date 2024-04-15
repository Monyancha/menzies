import { Button } from "@mantine/core";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { useState } from "react";
import { PageSizeSelect } from "./scrolling-table";

export default function CursorPaginationLinks({
  paginatedData = null,
  onLinkClicked = (url) => {},
  pageSize = 10,
  setPageSize = (v) => {},
}) {
  return (
    paginatedData && (
      <section className="flex justify-between items-center px-3 py-2 flex-col lg:flex-row gap-2 w-full">
        <PageSizeSelect
          size="xs"
          pageSize={pageSize}
          setPageSize={setPageSize}
        />

        <div className="flex items-center gap-1">
          <Button
            size="xs"
            leftIcon={<IconChevronLeft size={16} />}
            variant={paginatedData?.prev_page_url ? "light" : "subtle"}
            color={paginatedData?.prev_page_url ? "blue" : "gray"}
            onClick={() => {
              if (!paginatedData?.prev_page_url) {
                return;
              }
              onLinkClicked(paginatedData?.prev_page_url);
            }}
          >
            Prev
          </Button>

          <Button
            size="xs"
            rightIcon={<IconChevronRight size={16} />}
            variant={paginatedData?.next_page_url ? "light" : "subtle"}
            color={paginatedData?.next_page_url ? "blue" : "gray"}
            onClick={() => {
              if (!paginatedData?.next_page_url) {
                return;
              }
              onLinkClicked(paginatedData?.next_page_url);
            }}
          >
            Next
          </Button>
        </div>
      </section>
    )
  );
}
