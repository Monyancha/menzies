import { Button, Modal, Select, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccessGroups,
  submitAccessGroup,
  fetchBranchesList,
} from "../../../../src/store/access/access-control-slice";
import store from "../../../../src/store/Store";
import { getStaffRoles } from "../../../../src/store/partners/staff-slice";

function AddAccessGroupModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState();
  const [branch, setBranch] = useState();

  function clearForm() {
    setName("");
    setBranch(null);
  }

  const isSubmitting = useSelector(
    (state) => state.accessControl.submitAccessGroupStatus == "loading"
  );

  const branchesList = useSelector(
    (state) => state.accessControl.fetchBranchesList?.data ?? []
  );
  const branchesListStatus = useSelector(
    (state) => state.accessControl.fetchBranchesListStatus
  );

  const isLoading = branchesListStatus == "loading";

  //useEffect Hook to fetch the branches List
  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    // const params = {};
    // params["accessToken"] = session.user.accessToken;

    // console.log(session.user.accessToken);

    store.dispatch(fetchBranchesList());
  }, [session, status]);

  //console.log(branchesList?.data[0]?.name);

  const dispatch = useDispatch();

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["branch"] = branch;

    try {
      await dispatch(submitAccessGroup(params)).unwrap();

      dispatch(fetchAccessGroups(params));

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
      //
      store.dispatch(getStaffRoles(params));
      setOpened(false);
      clearForm();
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
        opened={opened}
        title="Add Access Group"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col px-2 rounded-lg">
          <TextInput
            placeholder="e.g. Cashier, Waiter etc."
            label="Role"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end p-2 rounded-lg my-3">
          <Button variant="outline" onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Add Role
      </Button>
    </>
  );
}

export default AddAccessGroupModal;
