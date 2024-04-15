import {
  Button,
  useMantineTheme,
  Modal,
  Select,
  MultiSelect,
} from "@mantine/core";
import { TimeInput, DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { IconTiltShiftOff } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import { fetchStaffList } from "@/store/merchants/partners/staffs-slice";
import { fetchStaffAttendance } from "@/store/merchants/partners/staff-slice";

import { assignShift } from "@/store/merchants/partners/shift-slice";
import { formatDateNoTime } from "@/lib/shared/data-formatters";

function AssignStaffShiftModal() {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const [staff_id, setStaffId] = useState();
  const [shift_id, setShiftId] = useState();
  const [shift_days, setShiftDays] = useState();

  const isSubmitting = useSelector(
    (state) => state.staff.submitAttendanceStatus == "loading"
  );
  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  const staffsList = useSelector((state) => state.staff.staff_attendance_list);

  let options = staffsList?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));

  const shift_list = useSelector((state) => state.shift.shift_list);

  console.log(options);

  let shift_options = shift_list?.map((shift) => ({
    value: shift?.id,
    label: shift?.name
  }));

  function clearForm() {
    setStaffId("");
    setShiftId("");
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["branch_id"] = "All";

    store.dispatch(fetchStaffList(params));
    store.dispatch(fetchStaffAttendance(params));

    if (dataStatus === "fulfilled") {
      store.dispatch(fetchStaffList(params));
    }
  }, [dataStatus, session, status]);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const dispatch = useDispatch();

  const times = [
    { label: "Time In", value: "time_in" },
    { label: "Time Out", value: "time_out" },
  ];

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["staffs"] = staff_id;
    params["shift_id"] = shift_id;
    params["shift_days"] = shift_days;
    params["branch_id"] = branch_id;
    if (!shift_id || !staff_id) {
      showNotification({
        title: "Error",
        message: "Kindly Add All The Values To Proceeed",
        color: "red",
      });
      return;
    }

    try {
      await dispatch(assignShift(params)).unwrap();

      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message: "Shift Successfully Assigned",
        color: "green",
        autoClose: true,
      });
      clearForm();
      setOpened(false);
      // const pars = {};
      // pars["accessToken"] = session?.user?.accessToken;
      // pars["branch_id"] = branch_id;
      // store.dispatch(fetchStaffAttendance(pars));
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
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        title={`Assign Staff Shift`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form>
          <section className="flex flex-col p-5">
            <div className="space-x-4 space-y-4">
              <MultiSelect
                placeholder="Staff"
                label="Choose Staff"
                value={staff_id}
                onChange={setStaffId}
                data={options}
                searchable
                clearable
              />
            </div>
            <div className="space-x-2 space-y-2">
              <div className="py-2">
                <Select
                  placeholder="Shift"
                  label="Choose Shift"
                  value={shift_id}
                  onChange={setShiftId}
                  data={shift_options}
                  searchable
                  clearable
                />
              </div>
            </div>
            {/* <div className="space-x-2 space-y-2">
              <div className="py-2">

                <MultiSelect
              placeholder="Shift Days"
              label="Choose Day"
              value={shift_days}
              onChange={setShiftDays}
              data={[
                { label: "Monday", value: "Monday"},
                { label: "Tuesday", value: "Tuesday"},
                { label: "Wensday", value: "Wenesday"},
                { label: "Thursday", value: "Thursday"},
                { label: "Friday", value: "Friday"},
                { label: "Saturday", value: "Saturday"},
                { label: "Sunday", value: "Sunday"},
              ]}
              searchable
              clearable
            />
                </div>
              </div> */}
            {/* <div className="space-x-2 space-y-2">
                <TimeInput value={time} onChange={setTime}
                 label="Pick Time" />
              </div> */}
          </section>

          <section className="flex justify-center space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={submitDetails} loading={isSubmitting}>
              ASSIGN
            </Button>
          </section>
        </form>
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        leftIcon={<IconTiltShiftOff size={14} />}
        size="xs"
      >
        ASSIGN SHIFT
      </Button>
    </>
  );
}

export default AssignStaffShiftModal;
