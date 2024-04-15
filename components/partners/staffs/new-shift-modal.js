import {
  Button,
  useMantineTheme,
  Modal,
  Select,
  Textarea,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { TimeInput,DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { IconTiltShift, IconClock } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import { fetchStaffList } from "@/store/merchants/partners/staffs-slice";
import {
  fetchStaffAttendance,
  submitStaffAttendance,
} from "@/store/merchants/partners/staff-slice";
import { submitShift,fetchShiftList } from "@/store/merchants/partners/shift-slice";

function NewShiftModal() {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [shift_name, setShift] = useState(null);
  const [start_time, setStartTime] = useState(null);
  const [end_time, setEndTime] = useState();
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);

  const isSubmitting = useSelector(
    (state) => state.staff.submitAttendanceStatus == "loading"
  );
  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  const staffsList = useSelector((state) => state.staff.staff_attendance_list);

  let options = staffsList?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));

  function clearForm() {
    setShift(null);
    setStartTime(null);
    setEndTime(null);
    setStartDate(null);
    setEndDate(null);
    setOpened(false);
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["branch_id"] = "All";

    store.dispatch(fetchStaffList(params));

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
    params['name'] = shift_name;
    params["start_time"] = start_time;
    params["end_time"] = end_time;
    params["start_date"] = start_date;
    params["end_date"] = end_date;

    params["branch_id"] = branch_id;
    if (!start_time || !end_time) {
      showNotification({
        title: "Error",
        message: "Kindly Add All The Values To Proceeed",
        color: "red",
      });
      return;
    }

    try {
      await dispatch(submitShift(params)).unwrap();

      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message: "Shift Successfully Created",
        color: "green",
        autoClose: true,
      });
      clearForm();

      const pars = {};
      pars["accessToken"] = session?.user?.accessToken;
      pars["branch_id"] = branch_id;
      store.dispatch(fetchShiftList(pars));
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
        title={`Add New Shift`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form>
          <section className="flex flex-col p-5">
          <div className="space-x-4 space-y-4">
              <TextInput
                label="Shift Name"
                placeholder="Name"
                type="text"
                value={shift_name}
                onChange={(e) => setShift(e.currentTarget.value)}
              />
            </div>
          {/* <div className="space-x-4 space-y-4">
          <DatePicker
          label="Shift Start Date"
          value={start_date} onChange={setStartDate} />


            </div>
            <div className="space-x-2 space-y-2">
              <div className="py-2">
              <DatePicker label="Shift End Date" value={end_date} onChange={setEndDate} />
              </div>
            </div> */}


            <div className="space-x-2 space-y-2">
              <div className="py-2">
                <TimeInput
                  label="Shift Start Time"
                  onChange={(e) => setStartTime(e)}
                />
              </div>
            </div>
            <div className="space-x-2 space-y-2">
              <div className="py-2">
                {/* <label>End Time</label> */}
                <TimeInput
                  label="Shift End Time"
                  onChange={(e) => setEndTime(e)}
                />

              </div>
            </div>


          </section>

          <section className="flex justify-center space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={submitDetails} loading={isSubmitting}>
              CREATE
            </Button>
          </section>
        </form>
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        leftIcon={<IconTiltShift size={14} />}
        size="xs"
      >
        CREATE SHIFT
      </Button>
    </>
  );
}

export default NewShiftModal;
