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
import { getStaffRoles,createStaffPersonal, } from "../../../../src/store/partners/staff-slice";
import Link from "next/link";
import { DatePicker } from "@mantine/dates";
import store from "../../../../src/store/Store";
import AddAccessGroupModal from "../../settings/access-control/add-access-group-modal";
import { showNotification } from "@mantine/notifications";
import { fetchStaffDepartments } from "../../../../src/store/partners/staff-slice";

function PersonalDetailsForm() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);

    const departmentsList = useSelector(
      (state) => state.staff.staff_departments_list
    );

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [facebook, setFacebook] = useState();
    const [role, setRole] = useState();
    const [instagram, setInstagram] = useState();
    const [bio, setBio] = useState();
    const [rate, setRate] = useState();
    const [is_tenant, setIsTenant] = useState();
    const [can_book, setCanBook] = useState();
    const [show_on_marketplace, setShowOnMarketplace] = useState();
    const [rent, setRent] = useState();
    const [salary, setSalary] = useState();
    const [pay_day, setPayDay] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setPasswordConfirmation] = useState();
    const [date_joined, setDate] = useState();
    const [department_id, setDepartment] = useState();
    const [next_of_kin, setNextOfKin] = useState();

    const roles = useSelector((state) => state.staff.getStaffRoles);
    const staff_id = useSelector((state)=>state.staff.current_staff);

    let options = departmentsList?.data?.map((dept) => ({
      value: dept?.id,
      label: dept?.name,
    })) ?? [];

    const submitInfo = async () => {
      if (!session || status !== "authenticated" || !status) {
        return;
      }

      const params = {
        name,
        email,
        facebook,
        phone,
        role,
        instagram,
        bio,
        rate,
        is_tenant,
        can_book,
        show_on_marketplace,
        rent,
        salary,
        pay_day,
        password,
        password_confirmation,
        branch_id,
        date_joined,
        next_of_kin,
        department_id
      };
      params["accessToken"] = session.user.accessToken;

      try {
        setIsSubmitting(true);

        await dispatch(createStaffPersonal(params)).unwrap();

        showNotification({
          title: "Success",
          message: "Record created successfully",
          color: "green",
        });

        console.log("The Current Staff Is " + staff_id);

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

        store.dispatch(fetchStaffDepartments(params));
      }, [session, status]);

      let departments =
      [
        { label: "Sales", value: "1" },
        { label: "Accounting", value: "2" },
        { label: "Sales", value: "3" },
      ] ?? [];

    let payments_freq =
      [
        { label: "Monthly", value: "Monthly" },
        { label: "Weekly", value: "Weekly" },
      ] ?? [];
      return (

        <Card>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 content-end">
            <TextInput
              label="Name"
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextInput
              label="Phone"
              type="text"
              name="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <TextInput
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="password_confirmation"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <Checkbox
              label="Is Tenant"
              name="is_tenant"
              checked={is_tenant}
              onChange={(e) => setIsTenant(e.currentTarget.checked)}
            />

            <Checkbox
              label="Can Book"
              name="can_book"
              checked={can_book}
              onChange={(e) => setCanBook(e.currentTarget.checked)}
            />

            <Checkbox
              label="Hide On Marketplace"
              name="hide_on_marketplace"
              checked={show_on_marketplace}
              onChange={(e) => setShowOnMarketplace(e.currentTarget.checked)}
            />

            <div className={`${is_tenant ? "block w-full" : "hidden"}`}>
              <TextInput
                label="Amount Paid Per Month"
                type="number"
                placeholder="Amount"
                value={rent}
                name="rent"
                onChange={(e) => setRent(e.target.value)}
                fullWidth
              />
            </div>

            <section className="w-full flex justify-between items-end space-x-2">
              <span className="grow">
                <Select
                  label="Role"
                  placeholder="Role"
                  name="role"
                  data={
                    roles?.map((item) => ({
                      value: item.name,
                      label: item.name,
                    })) ?? []
                  }
                  value={role}
                  onChange={setRole}
                  clearable
                  searchable
                />
              </span>
              <span className="flex-none">
                <AddAccessGroupModal />
              </span>
            </section>

            <TextInput
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* <TextInput
              label="Facebook Link"
              type="url"
              placeholder="Facebook Link"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />

            <TextInput
              label="Instagram Link"
              type="url"
              placeholder="Instagram Link"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            /> */}







            <Textarea
              label="Bio"
              type="text"
              placeholder="Staff Bio"
              value={bio}
              name="bio"
              onChange={(e) => setBio(e.target.value)}
            />

          </div>


            <>
          <section className="w-full grid grid-cols-2 gap-2 mt-2">
            <span className="grow">
              <Select
                label="Select Department"
                placeholder="Department"
                name="department"
                data={options}
                value={department_id}
                onChange={setDepartment}
                clearable
                searchable
              />
            </span>
            <TextInput
              label="Next Of Kin"
              type="text"
              placeholder="Next Of Kin"
              value={next_of_kin}
              onChange={(e) => setNextOfKin(e.target.value)}
            />
          </section>
          <section className="w-full grid grid-cols-2 gap-2 mt-2">
          <DatePicker
              label="Date Joined"
              value={date_joined}
              name="date_joined"
              onChange={setDate}
            />
          </section>


          </>




          <div className="mt-5">
            <Button
              leftIcon={<IconDeviceFloppy size={16} />}
              onClick={submitInfo}

            >
              Save
            </Button>
          </div>
        </Card>


      )

}
export default PersonalDetailsForm;