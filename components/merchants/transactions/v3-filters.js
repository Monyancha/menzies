import { Button, Modal, TextInput, Alert } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IconAdjustmentsHorizontal, IconAlertCircle } from "@tabler/icons";
import {
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import {
  Table,
  Thead,
  Trow,
  TDateFilter,
  TSearchFilter,
} from "@/components/ui/layouts/scrolling-table";

function V3Filters({ edit_expenses }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [suspended, setSuspended] = useState(true);

  return (
    <>
      <Modal
        opened={opened}
        title={`Date and Search Filters`}
        onClose={() => setOpened(false)}
        padding="sm"
        overflow="inside"

      >

<Alert
            icon={<IconAlertCircle size={16} />}
            title="How it works"
            radius="md"
            color="red"
            withCloseButton
          >
            You can search or apply the date filters or both.
          </Alert>

        <div className="col-span-1 md:col-span-2 mt-2">
          <TSearchFilter onChangeSearchTerm={setSearchTerm} />
        </div>

        <TDateFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
        />

      
        <section className="flex justify-end rounded-lg mt-5 ">
          <Button > Apply Filters </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconAdjustmentsHorizontal size="1rem" />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        Filters
      </Button>
    </>
  );
}

export default V3Filters;
