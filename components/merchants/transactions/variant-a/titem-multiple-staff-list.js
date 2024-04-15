import { Badge, ActionIcon } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { removeTransactionMultipleStaff } from "@/store/merchants/transactions/transaction-slice";
import store from "@/store/store";
import AddMultipleStaffModal from "./add-multiple-staff-modal";

export default function TitemMultipleStaffList({ item }) {
  return (
    <div className="w-full flex flex-wrap items-center space-x-2 pt-2">
      <AddMultipleStaffModal item={item} />

      {item.staff_list?.map((staff) => (
        <Badge
          rightSection={<RemoveButton item={item} staffListId={staff.id} />}
          key={staff.id}
        >
          {staff.staff_name}: {staff.commission}
        </Badge>
      ))}
    </div>
  );
}

function RemoveButton({ item, staffListId }) {
  function removeStaff() {
    store.dispatch(
      removeTransactionMultipleStaff({
        itemId: item.id,
        staffListId,
      })
    );

    showNotification({
      title: "Success",
      message: "Removed staff successfully",
      color: "green",
    });
  }

  return (
    <ActionIcon
      size="xs"
      color="blue"
      radius="xl"
      variant="transparent"
      onClick={removeStaff}
    >
      <IconX size={10} />
    </ActionIcon>
  );
}
