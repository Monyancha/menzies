import { Button, Modal, Select, TextInput, Tooltip } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    getExistingWarehouseStaffs,
    submitWarehouseStaff
 } from "@/store/merchants/settings/access-control-slice";
import { fetchStaffList } from "../../../../store/merchants/partners/staffs-slice";
import store from "../../../../store/store";
import Link from "next/link";
import { IconPlus } from "@tabler/icons";
import NewStaffModal from "../branches/new-staff-modal";

function NewWarehouseAdminModal(WarehouseId) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [staff_id, setStaffId] = useState();

  const dispatch = useDispatch();
  const branch_id = useSelector((state) => state.branches.branch_id);

  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  const staffsList = useSelector((state) => state.staffs.fetchStaffList);

  const params = {};
  params["accessToken"] = session?.user?.accessToken;

  let options = staffsList?.data?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));

  function clearForm() {
    setStaffId("");
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = "All";
   
    store.dispatch(fetchStaffList(params));
  }, [dataStatus, session, status]);

  const isSubmitting = useSelector(
    (state) => state.branches.submissionStatus == "loading"
  );

  console.log("Warehoue Id " + WarehouseId);

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["warehouse_id"] = WarehouseId.WarehouseId;
    params["staff_id"] = staff_id;

    try {
      await dispatch(submitWarehouseStaff(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "Success",
        message:
          "New Warehouse Admin Successfully Added",
        autoClose: true,
      });
      clearForm();
      setOpened(false);
      
      store.dispatch(getExistingWarehouseStaffs(params));
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="New Warehouse Admin"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            New Warehouse Admin
          </span>

          <Select
            placeholder="Staff"
            label="Assign Staff To This Warehouse"
            value={staff_id}
            onChange={setStaffId}
            data={options}
            searchable
            clearable
          />

          <NewStaffModal />

        
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconUser size={12} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        New Admin
      </Button>
    </>
  );
}

export default NewWarehouseAdminModal;
