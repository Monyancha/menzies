import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
//
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import {
  createStaff,
  getStaffRoles,
} from "../../../src/store/partners/staff-slice";
import store from "../../../src/store/Store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Checkbox, Select, Textarea, TextInput,FileInput } from "@mantine/core";
import Card from "../../../components/ui/layouts/card";
import { IconDeviceFloppy, IconChevronLeft,IconUpload,IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { DatePicker, DatePickerInput } from "@mantine/dates";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/staff",
    title: "Staff",
  },
  {
    to: "/partners/staff/create",
    title: "Create Staff",
  },
];

export default function CreateStaff() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
  
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
    const [moreOptions, setMoreOptions] = useState(false);
  
    const roles = useSelector((state) => state.staff.getStaffRoles);
  
    const isRoleLoading = "loading";
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(getStaffRoles(params));
    }, [session, status]);
  
    const submitStaff = async () => {
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
      };
      params["accessToken"] = session.user.accessToken;
  
      try {
        setIsSubmitting(true);
  
        await dispatch(createStaff(params)).unwrap();
  
        showNotification({
          title: "Success",
          message: "Record created successfully",
          color: "green",
        });
  
        router.push("/merchants/partners/staffs");
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
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Create Staff" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <div className="w-full flex flex-wrap mt-2">
        <Card>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end">
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

            {/* <Checkbox
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
            /> */}

            {/* <Checkbox
              label="Hide On Marketplace"
              name="hide_on_marketplace"
              checked={show_on_marketplace}
              onChange={(e) => setShowOnMarketplace(e.currentTarget.checked)}
            /> */}

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
          
            </section>

            <TextInput
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextInput
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
            />

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
              placeholder="Pay Day"
              value={pay_day}
              name="pay_day"
              onChange={(e) => setPayDay(e.target.value)}
            />

            <Textarea
              label="Bio"
              type="text"
              placeholder="Staff Bio"
              value={bio}
              name="bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <DatePickerInput
              label="Date Joined"
              value={date_joined}
              name="date_joined"
              onChange={setDate}
            />
          </div>
          <section className="w-full flex justify-between items-end space-x-2 mt-2">
            <Checkbox
              checked={moreOptions}
              onChange={(e) => setMoreOptions(e.currentTarget.checked)}
              label="Add More Info"
            />
          </section>
          {moreOptions && (
            <>
          <section className="w-full grid grid-cols-2 gap-2 mt-2">
            <span className="grow">
              <Select
                label="Select Department"
                placeholder="Department"
                name="department"
                data={departments}
                value={role}
                onChange={setRole}
                clearable
                searchable
              />
            </span>
            <TextInput
              label="Next Of Kin"
              type="text"
              placeholder="Next Of Kin"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </section>
          <section className="w-full grid grid-cols-2 gap-2 mt-2">
            <TextInput
              label="KRA PIN"
              type="text"
              placeholder="KRA PIN"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />

            <TextInput
              label="NSSF NO"
              type="text"
              placeholder="NSSF NO"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </section>
           <section className="w-full grid grid-cols-2 gap-2 mt-2">
            <TextInput
              label="NHIF NO"
              type="text"
              placeholder="NHIF NO"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />

            <span className="grow">
              <Select
                label="Select Payment Frequency"
                placeholder="Payment Frequency"
                name="payment_frequency"
                data={payments_freq}
                value={role}
                onChange={setRole}
                clearable
                searchable
              />
            </span>
          </section>
          </>
          )}
          {moreOptions && (
            <>
          <section className="w-full grid grid-cols-4 gap-2 mt-2">
          <TextInput
              label="Name"
              type="text"
              placeholder="Name"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
              <FileInput
                label="Document"
                placeholder="Upload (Max 2mb)"
                icon={<IconUpload size={14} />}
                style={{ width: "100%" }}
              />
              <TextInput
              label="Comment"
              type="text"
              placeholder="Comment"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <div className="mt-7">
            <IconPlus size={20}/>
            </div>
          </section>
          </>
          )}

          <div className="mt-5">
            <Button
              leftIcon={<IconDeviceFloppy size={16} />}
              onClick={submitStaff}
              loading={isSubmitting}
              variant="outline"
            >
              Save
            </Button>
          </div>
        </Card>
      </div>

      </Box>
    </PageContainer>
  );
}
