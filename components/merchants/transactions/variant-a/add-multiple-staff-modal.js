import { Button, Modal, Select, TextInput, Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons";
import { useSelector } from "react-redux";
import store from "@/store/store";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import { addTransactionMultipleStaff } from "@/store/merchants/transactions/transaction-slice";
import { showNotification } from "@mantine/notifications";
import { parseValidFloat } from "@/lib/shared/data-formatters";

export default function AddMultipleStaffModal({ item }) {
  const [opened, setOpened] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [commission, setCommission] = useState("");
  const [commissionType, setCommissionType] = useState("amount");

  const staffList = useSelector((state) => state.staff.staffList);
  const options = staffList.map((staff) => ({
    value: staff.id,
    label: staff.name,
  }));

  const commissionTypeService = item?.staff_list?.find(
    (staffItem) => staffItem?.commission_type === "service_rate"
  );

  useEffect(() => {
    if (!commissionTypeService) {
      return;
    }

    setCommissionType("service_rate");
  }, [commissionTypeService]);

  const canDoSharedRate = useSelector(
    hasBeenGranted("can_do_shared_service_rate_commission")
  );

  const canDoSharedAmount = useSelector(
    hasBeenGranted("can_do_shared_service_amount_commission")
  );

  useEffect(() => {
    if (canDoSharedRate && !canDoSharedAmount) {
      setCommissionType("service_rate");
    }
  }, [canDoSharedAmount, canDoSharedRate]);

  function addStaff() {
    let commision_total =
      item?.staff_list?.reduce(
        (sum, item) => sum + parseValidFloat(item.commission),
        0
      ) ?? 0;

    commision_total += parseValidFloat(commission);

    if (commision_total > parseValidFloat(item.sub_total)) {
      showNotification({
        title: "Warning",
        message: "Total given commissions exceed service value",
        color: "orange",
      });

      return;
    }

    store.dispatch(
      addTransactionMultipleStaff({
        itemId: item.id,
        staffId: staffId,
        commission,
        staffList,
        commissionType,
      })
    );

    showNotification({
      title: "Success",
      message: "Added staff successfully",
      color: "green",
    });

    setStaffId("");
    setCommission("");
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Add Staff"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">Add Staff</span>

          <Select
            placeholder="Add Multiple Staff"
            label="Staff"
            value={staffId}
            onChange={setStaffId}
            data={options}
            searchable
            clearable
          />

          <Radio.Group
            value={commissionType}
            onChange={setCommissionType}
            label="Commission Type"
          >
            {((canDoSharedRate && canDoSharedAmount) || !canDoSharedRate) && (
              <Radio value="amount" label="Amount" />
            )}
            <Radio value="service_rate" label="Service Rate" />
          </Radio.Group>

          {commissionType === "amount" && (
            <TextInput
              placeholder="amount"
              label="Commission"
              type="number"
              value={commission}
              onChange={(e) => setCommission(e.currentTarget.value)}
            />
          )}
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={addStaff}>Add</Button>
        </section>
      </Modal>

      <Button
        rightIcon={<IconPlus size={14} />}
        variant="outline"
        size="xs"
        onClick={() => setOpened(true)}
      >
        Add Multiple Staff
      </Button>
    </>
  );
}
