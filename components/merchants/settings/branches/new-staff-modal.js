import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import {
  createStaff,
  getStaffRoles,
} from "../../../../store/merchants/partners/staff-slice";
import { fetchStaffList } from "@/store/merchants/partners/staffs-slice";
import store from "../../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Select,
  Textarea,
  TextInput,
  Modal,
} from "@mantine/core";
import AddAccessGroupModal from "../../../../components/merchants/settings/access-control/add-access-group-modal";
import Card from "../../../../components/ui/layouts/card";
import { IconDeviceFloppy, IconUser } from "@tabler/icons";

function NewStaffModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
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
  const [rent, setRent] = useState();
  const [salary, setSalary] = useState();
  const [pay_day, setPayDay] = useState();
  const [password, setPassword] = useState();
  const [password_confirmation, setPasswordConfirmation] = useState();

  const roles = useSelector((state) => state.staff.getStaffRoles);

  function clearForm() {
    setName("");
    setEmail("");
    setPhone("");
    setFacebook("");
    setRole("");
    setBio("");
    setPayDay("");
  }

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
      rent,
      salary,
      pay_day,
      password,
      password_confirmation,
      branch_id,
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
      store.dispatch(fetchStaffList(params));

      setOpened(false);
      clearForm();
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

  return (
    <>
      <Modal
        opened={opened}
        title="Add New Staff"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="55%"
      >
        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end">
              <TextInput
                label="Name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextInput
                label="Phone"
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <TextInput
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
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

              <div className={`${is_tenant ? "block w-full" : "hidden"}`}>
                <TextInput
                  label="Amount Paid Per Month"
                  type="number"
                  placeholder="Amount"
                  value={rent}
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
                onChange={(e) => setRate(e.target.value)}
              />

              <TextInput
                label="Salary"
                type="number"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />

              <TextInput
                label="Pay Day"
                type="number"
                placeholder="Pay Day"
                value={pay_day}
                onChange={(e) => setPayDay(e.target.value)}
              />

              <Textarea
                label="Bio"
                type="text"
                placeholder="Staff Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="mt-5">
              <Button
                leftIcon={<IconDeviceFloppy size={16} />}
                onClick={submitStaff}
                loading={isSubmitting}
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      </Modal>

      <Button
        leftIcon={<IconUser size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        New Staff
      </Button>
    </>
  );
}

export default NewStaffModal;
