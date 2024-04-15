import { useSession } from "next-auth/react";
import { useState } from "react";

import { Modal, Button, Group } from "@mantine/core";

import { IconPrinter, IconToolsKitchen2, IconGlassFull } from "@tabler/icons";

import { isRestaurant } from "../../../lib/shared/roles_and_permissions";

import { printRemotePdf } from "../../../lib/shared/printing-helpers";

function OrderPrinter({ transaction = null } = {}) {
  const [opened, setOpened] = useState(false);
  const { data: session } = useSession();

  const isRestaurantAc = isRestaurant(session?.user);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Print Order #${transaction?.id ?? "-"}`}
      >
        {/* Modal content */}
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            color="green"
            leftIcon={<IconPrinter size={15} />}
            onClick={() => printRemotePdf(transaction?.receipt_address)}
          >
            Print
          </Button>

          {transaction?.is_draft && isRestaurantAc && (
            <Button
              variant="outline"
              color="indigo"
              leftIcon={<IconToolsKitchen2 size={15} />}
              onClick={() => printRemotePdf(transaction?.food_receipt_address)}
            >
              Food Receipt
            </Button>
          )}

          {transaction?.is_draft && isRestaurantAc && (
            <Button
              variant="outline"
              color="indigo"
              leftIcon={<IconGlassFull size={15} />}
              onClick={() => printRemotePdf(transaction?.drink_receipt_address)}
            >
              Drinks Receipt
            </Button>
          )}
        </div>
      </Modal>

      <Group position="center">
        <button
          className="btn btn-info btn-outline gap-2"
          onClick={() => setOpened(true)}
        >
          <i className="fa-solid fa-print text-lg"></i>
          <span className="hidden sm:inline">Print</span>
        </button>
      </Group>
    </>
  );
}

export default OrderPrinter;
