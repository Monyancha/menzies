import {
  Button,
  useMantineTheme,
  Modal,
  Select,
  Textarea,
  ActionIcon
} from "@mantine/core";
import { TimeInput, DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { IconTimeline,IconClock } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import { fetchStaffList } from "@/store/merchants/partners/staffs-slice";
import { fetchStaffAttendance,submitStaffAttendance } from "@/store/merchants/partners/staff-slice";


function NewAttendanceModal() {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [date, setDate] = useState(null);
  const [time_in_out, setTimeInOut] = useState(null);
  const [staff_id, setStaffId] = useState();
  const [shift_id, setShiftId] = useState();
  const [clock_in,setClockIn] = useState();
  const [clock_out,setClockOut] = useState();
  const [time, handleTime] = useState("");

  const isSubmitting = useSelector(
    (state) => state.staff.submitAttendanceStatus == "loading"
  );
  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  const staffsList = useSelector(
    (state) => state.staff.staff_attendance_list
  );

  const staff_shifts = useSelector(
    (state) => state.staff.staff_shifts
  );

  let options = staffsList?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));

  let shifts = staff_shifts?.filter((sh)=>sh.staff_id===staff_id).map((shift)=>({
    value:shift.shift_id,
    label:shift.shift_name
  }));

  function clearForm() {
    // setDate("");
    // setTime(n);
    setStaffId("");
    handleTime("");
    setTimeInOut("");
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

    if (dataStatus === "fulfilled") {
      store.dispatch(fetchStaffList(params));
    }
  }, [dataStatus, session, status]);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const dispatch = useDispatch();

  const times = [{label:"Time In",value:"time_in"},{label:"Time Out",value:"time_out"}]



async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["time"] = time;
    params["staff_id"] = staff_id;
    params["shift_id"] = shift_id;
    params["time_in_out"] =  time_in_out;
    params["branch_id"] = branch_id;
    if (!time_in_out || !staff_id || !time) {
      showNotification({
        title: "Error",
        message: "Kindly Add All The Values To Proceeed",
        color: "red",
      });
      return;
    }

    try {
      await dispatch(submitStaffAttendance(params)).unwrap();

      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message:
          "Attendance Successfully Added",
        color: "green",
        autoClose: true,
      });
      clearForm();
      setOpened(false);
      const pars = {};
      pars["accessToken"] = session?.user?.accessToken;
      pars["branch_id"] = branch_id;
      store.dispatch(fetchStaffAttendance(pars));
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
        title={`Add Staff Attendance`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form >
          <section className="flex flex-col p-5">
            <div className="space-x-4 space-y-4">
            <Select
            placeholder="Staff"
            label="Choose Staff"
            value={staff_id}
            onChange={setStaffId}
            data={options}
            searchable
            clearable
          />
          <Select
            placeholder="Shift"
            label="Choose Shift"
            value={shift_id}
            onChange={setShiftId}
            data={shifts}
            searchable
            clearable
          />
            </div>
            <div className="space-x-2 space-y-2">
            <div className="py-2">
              <label>Time</label>
            <input
                type="datetime-local"
                name="start_date"
                className="input-primary h-10"
                label="Date Time"
                onChange={(e) => handleTime(e.currentTarget.value)}
              />
              </div>
            </div>
            {/* <div className="space-x-2 space-y-2">
              <TimeInput value={time} onChange={setTime}
               label="Pick Time" />
            </div> */}
          </section>

          <div className="space-x-2 space-y-2 p-5">
          <Select
            placeholder="Time in /Time Out"
            label="Time In/Time Out"
            value={time_in_out}
            onChange={setTimeInOut}
            data={times}
            searchable
            clearable
          />


          </div>
           <section className="flex justify-center space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            ADD
          </Button>
        </section>
        </form>
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        leftIcon={<IconTimeline size={14} />}
        size="xs"
      >
       Attendance
      </Button>
    </>
  );
}

export default NewAttendanceModal;
