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
import { getStaffRoles,createStaffFinancial } from "../../../../src/store/partners/staff-slice";
import Link from "next/link";
import { DatePicker } from "@mantine/dates";
import store from "../../../../src/store/Store";
import { showNotification } from "@mantine/notifications";
import { fetchStaffAttendance } from "../../../../src/store/partners/staff-slice";

function FinancialDetailsForm() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [role, setRole] = useState();
    const [kra_pin, setKra] = useState();
    const [nssf, setNssf] = useState();
    const [rate, setRate] = useState();
    const [nhif, setNhif] = useState();
    const [payment_freq, setFreq] = useState();
    const [show_on_marketplace, setShowOnMarketplace] = useState();
    const [rent, setRent] = useState();
    const [salary, setSalary] = useState();
    const [pay_day, setPayDay] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setPasswordConfirmation] = useState();
    const [date_joined, setDate] = useState();
    const [selected_staff, setStaffId] = useState();


    const roles = useSelector((state) => state.staff.getStaffRoles);
    const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

    const staff_id = useSelector((state)=>state.staff.current_staff_id);

    // console.log("Staff Id At Financial Stage " + staff_id);
    const staffsList = useSelector(
      (state) => state.staff.staff_attendance_list
    );

    let options = staffsList?.map((staff) => ({
      value: staff?.id,
      label: staff?.name,
    }));

    console.log(staffsList);

    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }

      const params = {};
      params["accessToken"] = session?.user?.accessToken;
      params["branch_id"] = "All";

      store.dispatch(fetchStaffAttendance(params));


    }, [dataStatus, session, status]);

    




    const submitInfo = async () => {
      if (!session || status !== "authenticated" || !status) {
        return;
      }

      let staff_id =  staff_id ?? selected_staff;

      const params = {
        kra_pin,
        nssf,
        nhif,
        rate,
        payment_freq,
        salary,
        pay_day,
       staff_id
      };
      params["accessToken"] = session.user.accessToken;

      try {
        setIsSubmitting(true);

        await dispatch(createStaffFinancial(params)).unwrap();

        showNotification({
          title: "Success",
          message: "Financial Details Succesfully Added",
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

      let departments =
      [
        { label: "Department One", value: "Department One" },
        { label: "Department Two", value: "Department Two" },
        { label: "Department Three", value: "Department Three" },
      ] ?? [];

    let payments_freq =
      [
        { label: "Monthly", value: "Monthly" },
        { label: "Weekly", value: "Weekly" },
      ] ?? [];
      return (

        <Card>
          <div className="flex justify-between">

          <div className="space-x-4 space-y-4">
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
            <Link href={`/merchants/partners/staffs/commission/${selected_staff ?? staff_id}`}>
          <Button variant="outline" size="xs">
            Edit Commission
          </Button>
          </Link>

          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end">
            <TextInput
              label="Commission"
              type="number"
              placeholder="Commission in % e.g. 0.8"
              value={rate}
              name="rate"
              onChange={(e) => setRate(e.target.value)}
            />

            <TextInput
              label="Salary"
              type="number"
              placeholder="Salary"
              value={salary}
              name="salary"
              onChange={(e) => setSalary(e.target.value)}
            />

            <TextInput
              label="Pay Day"
              type="number"
              placeholder="Pay Day e.g 5th"
              value={pay_day}
              name="pay_day"
              onChange={(e) => setPayDay(e.target.value)}
            />


          </div>


            <>

          <section className="w-full grid grid-cols-2 gap-2 mt-2">
            <TextInput
              label="KRA PIN"
              type="text"
              placeholder="KRA PIN"
              value={kra_pin}
              onChange={(e) => setKra(e.target.value)}
            />

            <TextInput
              label="NSSF NO"
              type="text"
              placeholder="NSSF NO"
              value={nssf}
              onChange={(e) => setNssf(e.target.value)}
            />
          </section>
           <section className="w-full grid grid-cols-2 gap-2 mt-2">
            <TextInput
              label="NHIF NO"
              type="text"
              placeholder="NHIF NO"
              value={nhif}
              onChange={(e) => setNhif(e.target.value)}
            />

            <span className="grow">
              <Select
                label="Select Payment Frequency"
                placeholder="Payment Frequency"
                name="payment_frequency"
                data={payments_freq}
                value={payment_freq}
                onChange={setFreq}
                clearable
                searchable
              />
            </span>
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
export default FinancialDetailsForm;