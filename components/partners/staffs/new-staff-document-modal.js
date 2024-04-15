import {
    Button,
    useMantineTheme,
    Modal,
    TextInput,
    Select,
    Textarea,
    ActionIcon
  } from "@mantine/core";
  import { TimeInput, DatePicker } from "@mantine/dates";
  import { useSession } from "next-auth/react";
  import { IconCashBanknote } from "@tabler/icons-react";
  import { useState, useEffect } from "react";
  import { useDispatch,useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "../../../src/store/Store";
  import { fetchStaffList } from "../../../src/store/partners/staffs-slice";
  import { fetchStaffAttendance,submitStaffAttendance,setShowPayroll } from "../../../src/store/partners/staff-slice";


  function NewStaffDocumentModal() {
    const { data: session, status } = useSession();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
   
    const [time_in_out, setTimeInOut] = useState(null);
    const [staff_id, setStaffId] = useState();
    const [clock_in,setClockIn] = useState();
    const [clock_out,setClockOut] = useState();
    const [time, handleTime] = useState("");

    const isSubmitting = useSelector(
      (state) => state.staff.submitAttendanceStatus == "loading"
    );
    const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

    const staffsList = useSelector(
      (state) => state.staff.staff_attendance_list
    );;

    let options = staffsList?.map((staff) => ({
      value: staff?.id,
      label: staff?.name,
    }));

    function clearForm() {
      // setDate("");
      // setTime(n);
      setStaffId("");
      handleTime("");
      setTimeInOut("");
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

    const times = [{label:"Main Branch",value:"main"},{label:"Main Branch",value:"main"},{label:"Branch A",value:"A"}]



  async function submitDetails() {
      if (!session || status !== "authenticated" || isSubmitting) {
        return;
      }

      
        store.dispatch(setShowPayroll());
        setOpened(false);
        showNotification({
          title: "Success",
          message: "New Document Successfully Added",
          color: "green",
        });
        return;
      

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
          title={`Add New Staff Document`}
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          {/* Modal content */}

          <form >
            <section className="flex flex-col p-5">

              <div className="space-x-2 space-y-2">
              <div className="py-2">
              <TextInput
            label="Document Name"
            type="text"
            placeholder="Document Name"
            
          />
                </div>
              </div>
              <div className="space-x-2 space-y-2">
              <div className="py-2">
                <label>Document</label>
                <input
            type="file"
            name="active_image"
            className="input-primary h-fit py-3 text-sm"
            
          />
                </div>
              </div>

              
            </section>

           
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
          leftIcon={<IconCashBanknote size={14} />}
          size="xs"
        >
          New Document
        </Button>
      </>
    );
  }

  export default NewStaffDocumentModal;
