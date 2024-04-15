import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Checkbox, Select, Textarea, TextInput,FileInput,Card } from "@mantine/core";
import {
  IconDeviceFloppy,
  IconChevronLeft,
  IconUpload,
  IconPlus,
} from "@tabler/icons-react";
import { getStaffRoles,createStaffAllowance } from "../../../../src/store/partners/staff-slice";
import Link from "next/link";
import { DatePicker } from "@mantine/dates";
import store from "../../../../src/store/Store";
import { showNotification } from "@mantine/notifications";
import { fetchStaffAttendance } from "../../../../src/store/partners/staff-slice";
import { fetchAllAllowances } from "../../../../src/store/merchants/inventory/units-slice";
import NewAllowanceModal from "./new-allowance";
function AllowanceDetailsForm() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);

    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [selected_staff, setStaffId] = useState();



    const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

    const staff_id = useSelector((state)=>state.staff.current_staff_id);

    const allowanceList = useSelector((state) => state.units.allowanceList);


    // console.log("Staff Id At Financial Stage " + staff_id);
    const staffsList = useSelector(
      (state) => state.staff.staff_attendance_list
    );

    let options = staffsList?.map((staff) => ({
      value: staff?.id,
      label: staff?.name,
    })) ?? [];

    let allowancesData = allowanceList?.map((allowance) => ({
      value: allowance?.id,
      label: allowance?.name,
    })) ?? [];

    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }

      const params = {};
      params["accessToken"] = session?.user?.accessToken;
      params["branch_id"] = "All";

      store.dispatch(fetchStaffAttendance(params));
      store.dispatch(fetchAllAllowances(params));
    }, [dataStatus, session, status]);




    const submitInfo = async () => {
      if (!session || status !== "authenticated" || !status) {
        return;
      }

      let staff_id =  staff_id ?? selected_staff;

      const params = {
        name,
        amount,
       staff_id
      };
      params["accessToken"] = session.user.accessToken;

      try {
        setIsSubmitting(true);

        await dispatch(createStaffAllowance(params)).unwrap();

        showNotification({
          title: "Success",
          message: "Allowances Details Succesfully Added",
          color: "green",
        });

        // router.push("/merchants/partners/staffs");
      } catch (e) {
        let message = "Could not save record";
        message = e.message ? e.message : message;
        showNotification({
          title: "Warning",
          message,
          color: "orange",
        });
      } finally {
        setIsSubmitting(false);
      }
    };



    useEffect(() => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;

        store.dispatch(getStaffRoles(params));
      }, [session, status]);


      return (

        <Card>
          <div className="flex justify-between mb-3">

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end">
            <Select
            placeholder="Staff"
            label="Choose Staff"
            value={selected_staff}
            onChange={setStaffId}
            data={options}
            searchable
            clearable
          />
            </div>
            

          </div>
          <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-4 content-end">
          <Select
                  placeholder="Allowance List"
                  label="Choose Allowance"
                  data={allowancesData}
                  onChange={(e) => setName(e)}
                  searchable
                  clearable
                  size="md"
                  className="mb-2"
                />
               <div className="flex mt-5">
               <NewAllowanceModal/>
               </div>
            
          </div>
            <>

          <section className="w-full grid grid-cols-2 gap-2 mt-2 space-y-3">
          <TextInput
              label="Amount"
              type="number"
              value={amount}
              name="amount"
              onChange={(e) => setAmount(e.target.value)}
            />


          </section>

          </>



          <div className="mt-5">
            <Button
              leftIcon={<IconDeviceFloppy size={16} />}
              onClick={submitInfo}


            >
              UPDATE
            </Button>
          </div>
        </Card>


      )

}
export default AllowanceDetailsForm;