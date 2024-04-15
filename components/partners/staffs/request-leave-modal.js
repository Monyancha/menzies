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
  import { IconCpuOff } from "@tabler/icons-react";
  import { useState, useEffect } from "react";
  import { useDispatch,useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "../../../src/store/Store";
import { submitNewLeaveRequest,fetchLeaveList,fetchLeaveRequests } from "../../../src/store/merchants/hr/hr-slice";
import { fetchStaffAttendance } from "../../../src/store/partners/staff-slice";
import { formatDate } from "../../../lib/shared/data-formatters";

  function RequestLeave() {
    const { data: session, status } = useSession();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [staff_id, setStaff] = useState(null);
    const [start_date, setStartDate] = useState(null);
    const [end_date, setEndDate] = useState();
    const [leave_type_id,setLeaveType] = useState();
    const [comment,setComment] = useState();

    const isSubmitting = useSelector(
      (state) => state.hr.submitNewLeaveRequestStatus  == "loading"
    );
    const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

    const staffsList = useSelector(
      (state) => state.staff.staff_attendance_list
    );;

    let options = staffsList?.map((staff) => ({
      value: staff?.id,
      label: staff?.name,
    })) ?? [];

    function clearForm() {
      setStartDate("");
      setEndDate("");
      setLeaveType("");
      setComment("")
      setStaff("");
      setLeaveType("");
    }



    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }

      const params = {};
      params["accessToken"] = session?.user?.accessToken;
      params["branch_id"] = "All";

      store.dispatch(fetchStaffAttendance(params));
      store.dispatch(fetchLeaveList(params));

      
    }, [dataStatus, session, status]);

    const branch_id = useSelector((state) => state.branches.branch_id);

    const dispatch = useDispatch();

    const leaveList = useSelector(
      (state) => state.hr.leave_list
    );

    let leave_options = leaveList?.data?.map((leave) => ({
      value: leave?.id,
      label: leave?.name,
    })) ?? [];



  async function submitDetails() {
      if (!session || status !== "authenticated" || isSubmitting) {
        return;
      }

      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["staff_id"] = staff_id;
      params["leave_type_id"] = leave_type_id;
      params["start_date"] = start_date;
      params["end_date"] =  end_date;
      params["comment"] = comment;
      params["branch_id"] = branch_id;
      if (!leave_type_id|| !staff_id || !start_date || !end_date) {
        showNotification({
          title: "Error",
          message: "Kindly Add All The Values To Proceeed",
          color: "red",
        });
        return;
      }

      try {
        await dispatch(submitNewLeaveRequest(params)).unwrap();

        showNotification({
          position: "top-right",
          zIndex: 2077,
          title: "SUCCESS",
          message:
            "Leave  Successfully Added",
          color: "green",
          autoClose: true,
        });
        clearForm();
        setOpened(false);
        const pars = {};
        pars["accessToken"] = session?.user?.accessToken;
        pars["branch_id"] = branch_id;
        store.dispatch(fetchLeaveRequests(pars));
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
          title={`Request Leave/Time Off`}
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          {/* Modal content */}

          <form >
            <section className="flex flex-col p-5">
            <div className="space-x-2 space-y-2 p-5">
            <Select
              placeholder="Leave Type"
              label="Type"
              value={leave_type_id}
              onChange={(e)=>setLeaveType(e)}
              data={leave_options}
              searchable
              clearable
            />


            </div>

            <div className="space-x-2 space-y-2 p-5">
            <Select
              placeholder="Choose Staff"
              label="Staff"
              value={staff_id}
              onChange={(e)=>setStaff(e)}
              data={options}
              searchable
              clearable
            />


            </div>

              <div className="space-x-2 space-y-2">
              <div className="py-2">
                <label>FROM</label>
              <input
                  type="date"
                  name="start_date"
                  className="input-primary h-10"

                  onChange={(e) => setStartDate(e.currentTarget.value)}
                />
                </div>
              </div>
              <div className="space-x-2 space-y-2">
              <div className="py-2">
                <label>TO</label>
              <input
                  type="date"
                  name="start_date"
                  className="input-primary h-10"

                  onChange={(e) => setEndDate(e.currentTarget.value)}
                />
                </div>
              </div>

            
            </section>
          
            <Textarea
                label="Comment"
                type="text"
                placeholder="Leave Comment"
                onChange={(e) => setComment(e.currentTarget.value)}


              />
             <section className="flex justify-center space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={submitDetails} loading={isSubmitting}>
              REQUEST
            </Button>
          </section>
          </form>
        </Modal>

        <Button
          variant="outline"
          onClick={() => setOpened(true)}
          leftIcon={<IconCpuOff size={14} />}
          size="xs"
        >
          REQUEST LEAVE
        </Button>
      </>
    );
  }

  export default RequestLeave;
