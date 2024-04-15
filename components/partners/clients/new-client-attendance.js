import {
    Button,
    useMantineTheme,
    Modal,
    Select,
    Textarea,
    ActionIcon,
    Grid,
    Group
  } from "@mantine/core";
  import { TimeInput, DatePicker } from "@mantine/dates";
  import { useSession } from "next-auth/react";
  import { IconTimeline,IconChecklist } from "@tabler/icons";
  import { useState, useEffect } from "react";
  import { useDispatch,useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "../../../../store/store";
  import { fetchStaffList } from "@/store/merchants/partners/staffs-slice";
  import { fetchClients } from "@/store/merchants/partners/clients-slice";
  import { fetchMembershipList} from "@/store/merchants/settings/membership-slice";
  import { submitClientAttendance } from "@/store/merchants/partners/staff-slice";
  import NewClientModal from "../new-client-modal";
import { parseValidFloat } from "@/lib/shared/data-formatters";


  function NewClientAttendance() {
    const { data: session, status } = useSession();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [date, setDate] = useState(null);
    const [time_in_out, setTimeInOut] = useState(null);
    const [staff_id, setStaffId] = useState();
    const [clock_in,setClockIn] = useState();
    const [clock_out,setClockOut] = useState();
    const [time, handleTime] = useState("");
    const [selected_client_id, setClientId] = useState("");
    const [selected_client_membership, setClientMembership] = useState("");
    const [selected_client_name, setClientName] = useState("");
    const [selected_client_email, setClientEmail] = useState("");
    const [selected_client_phone, setClientPhone] = useState("");
    const [selected_client_dob, setClientDob] = useState("");
    const [selected_client_gender, setClientGender] = useState("");
    const [selectedCl,setClient] = useState(null);


    const isSubmitting = useSelector(
      (state) => state.staff.submitAttendanceStatus == "loading"
    );
    const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

    const memberships = useSelector(
      (state) => state.membership.membership_lists
    );

    const clientList = useSelector(
      (state) => state.membership.clientsList
    );

    const branch_id = useSelector((state) => state.branches.branch_id);



      const clientListStatus = useSelector(
        (state) => state.clients.clientListStatus
      );

      useEffect(()=>{

        let selectedClient = clientList?.find(
          (item) => item.id == selected_client_id
        );
        setClient(selectedClient);
        setClientName(selectedClient?.name);
        setClientPhone(selectedClient?.phone);
        setClientEmail(selectedClient?.email);
        setClientDob(selectedClient?.dob);
        setClientGender(selectedClient?.gender);



      },[selected_client_id,clientList])


      // const selectedClient = clientList?.find((item)=>item.id===selected_client_id);

    let client_memberships = memberships?.map((member) => ({
      value: member?.id,
      label: member?.name,
    }));

    const clients =
    clientList?.map((client) => ({
      value: `${client.id}`,
      label: `${client.name} ${client.phone !== null ? client.phone : ""}`,
    })) ?? [];

    function clearForm() {
      // setDate("");
      // setTime(n);
      setClientId("");
      setClient([]);
        setClientName("");
        setClientPhone("");
        setClientEmail("");
        setClientDob("");
        setClientGender("");
        setClientMembership("");
    }


    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["client_id"] = selected_client_id;

        store.dispatch(fetchMembershipList(params));

      }, [session, status,selected_client_id]);








    const dispatch = useDispatch();




  async function submitDetails() {
      if (!session || status !== "authenticated" || isSubmitting) {
        return;
      }

      const params = {};
      params["accessToken"] = session.user.accessToken;

      params["client_id"] = selected_client_id;
      params["membership_id"] = selected_client_membership;

      params["branch_id"] = branch_id;
      if (!selected_client_id || !selected_client_membership) {
        showNotification({
          title: "Error",
          message: "Kindly Add All The Values To Proceeed",
          color: "red",
        });
        return;
      }

      try {
        await dispatch(submitClientAttendance(params)).unwrap();

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
        // store.dispatch(fetchStaffAttendance(pars));
        // clearForm
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
          title={`Add Client Attendance`}
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
          size="55%"
        >
          {/* Modal content */}
          <div className="grid grid-cols-2 gap-4 justify-items-end">
          <div>
            {selected_client_id && (<Button onClick={submitDetails} loading={isSubmitting}>
              CHECK IN
            </Button>)}
            </div>
            <NewClientModal/>

          </div>

          <form >
            <section className="flex flex-col p-5">
              <div className="space-x-4 space-y-4">
              <Select
              placeholder="Clients"
              label="Choose Client"
              value={selected_client_id}
              onChange={setClientId}
              data={clients}
              searchable
              clearable
            />
              </div>
             {selected_client_id && (
               <div className="space-x-4 space-y-8">
               <Select
               placeholder="Memberships"
               label="Choose Memberships"
               value={selected_client_membership}
               onChange={setClientMembership}
               data={client_memberships}
               searchable
               clearable
             />
               </div>
             )}
              {/* <div className="space-x-2 space-y-2">
              <div className="py-2">
                <label> Date Time</label>
              <input
                  type="datetime-local"
                  name="start_date"
                  className="input-primary h-10"
                  label="Date Time"
                  onChange={(e) => handleTime(e.currentTarget.value)}
                />
                </div>
              </div> */}
              {/* <div className="space-x-2 space-y-2">
                <TimeInput value={time} onChange={setTime}
                 label="Pick Time" />
              </div> */}
            </section>

            <Grid>
            {selected_client_id  && (
            <Grid.Col >
               {selected_client_membership && (
              <h3 className="text-dark text-sm font-bold mt-5">
                Membership Information
              </h3>
               )}
              {selected_client_membership && (
                  <Group mt="xs" grow>
                  <p>Cost </p>
                  <p>Days Valid  </p>
                  <p>Days Accessed </p>
                  <p>Days Remaining </p>

                </Group>

              )}

              <hr/>
              {selected_client_membership && (
              <Group mt="xs" grow>
                <p> {memberships[0]?.cost ?? "-"} </p>
                <p> {memberships[0]?.validity ?? "-"} </p>
                <p> {memberships[0]?.membership_clients[0]?.membership_attendances?.length ?? "-"} </p>
                <p> {parseValidFloat(memberships[0]?.validity)-parseValidFloat(memberships[0]?.membership_clients[0]?.membership_attendances?.length )?? "-"} </p>
                {/* <p> { ?? "-"} </p> */}
              </Group>
               )}
              <hr/>








              <hr
                style={{
                  background: "#068bf9",
                  height: "2px",
                  marginBottom:"3px",
                  marginTop:"3px"
                }}
              ></hr>
              <h3 className="text-dark text-sm font-bold mt-5">
                Personal Information
              </h3>
              <Group mt="xs" grow>
                <p>Name </p>
                <p>Mobile </p>
                <p>Email </p>
              </Group>
              <hr/>
              <Group mt="xs" grow>
                <p> {selected_client_name ?? "-"} </p>
                <p> {selected_client_phone ?? "-"} </p>
                <p> {selected_client_name ?? "-"} </p>
              </Group>
              <hr/>

              <Group mt="xs" grow>

                <p>Gender </p>
                <p>DOB </p>
              </Group>
              <hr/>

              <Group mt="xs" grow>

                <p> {selected_client_gender ?? "-"} </p>
                <p> {selected_client_dob ?? "-"} </p>
              </Group>






              <hr
                style={{
                  background: "#068bf9",
                  height: "2px",
                }}
              ></hr>
               <h3 className="text-dark text-sm font-bold mt-5">
                Medical Information
              </h3>
              <Group mt="xs" grow>
                <p>Alergies: </p>
                <p>Prior Medical Condition: </p>
              </Group>
              <Group mt="xs" grow>
                <p> {selectedCl?.allergies ?? "-"} </p>
                <p> {selectedCl?.med_condition ?? "-"} </p>
              </Group>
              <Group mt="xs" grow>
                <p>Previous Treatment Used: </p>
                <p>Previous Procedure: </p>
              </Group>
              <Group mt="xs" grow>
                <p> {selectedCl?.prev_treatment ?? "-"} </p>
                <p> {selectedCl?.prev_procedure ?? "-"} </p>
              </Group>
              <Group mt="xs" grow>
                <p>Blood Pressure: </p>
                <p>Body Weight: </p>
              </Group>
              <Group mt="xs" grow>
                <p> {selectedCl?.blood_pressure ?? "-"} </p>
                <p> {selectedCl?.body_weight ?? "-"} </p>
              </Group>
              <Group mt="xs" grow>
                <p>Hair Type: </p>
                <p>Next of Kin Contact: </p>
              </Group>
              <Group mt="xs" grow>
                <p> {selectedCl?.hair_type ?? "-"} </p>
                <p> {selectedCl?.next_of_kin_contact ?? "-"} </p>
              </Group>
              <Group mt="xs" grow>
                <p>Blood Type: </p>
                <p>Skin Type: </p>
              </Group>
              <Group mt="xs" grow>
                <p> {selectedCl?.blood_type ?? "-"} </p>
                <p> {selectedCl?.skin_type ?? "-"} </p>
              </Group>
            </Grid.Col>
           )}

              </Grid>

            {/* <div className="space-x-2 space-y-2 p-5">
            <Select
              placeholder="Time in /Time Out"
              label="Time In/Time Out"
              value={time_in_out}
              onChange={setTimeInOut}
              data={times}
              searchable
              clearable
            />


            </div> */}
             <section className="flex justify-center space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={submitDetails} loading={isSubmitting}>
              CHECK IN
            </Button>
          </section>
          </form>
        </Modal>

        <Button
          variant="outline"
          onClick={() => setOpened(true)}
          leftIcon={<IconChecklist size={14} />}
          size="xs"
        >
         CHECK IN
        </Button>
      </>
    );
  }

  export default NewClientAttendance;
