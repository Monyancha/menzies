import { Button, Modal, Select, TextInput,Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    submitUnitEdit,
    fetchUnitFamilies,
    fetchUnits
 } from "@/store/merchants/inventory/units-slice";
import store from "@/store/store";
import Link from "next/link";
import { IconPlus } from "@tabler/icons";


function EditUnitModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState(item?.name);

  const [unit_family_id, setFamilyId] = useState(item?.unit_family_id);
  
  console.log({item});

  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  const unitFamiliesList = useSelector((state) => state.branches.unitFamiliesList);

  const staffsList = useSelector((state) => state.staffs.fetchStaffList);

  const params = {};
  params["accessToken"] = session?.user?.accessToken;

  console.log("The Array is " + staffsList);
  let options = staffsList?.data?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));
let vals = [{id:1,name:"Weight"},{id:2,name:"Length"}]
  let familiesData =
    vals?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  //   const isCarWashAc = isCarWash(session?.user);

  function clearForm() {
    setName("");
    
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = "All";
    store.dispatch(fetchUnitFamilies(params));
    

    if (dataStatus === "fulfilled") {
      store.dispatch(fetchBranchesData(params));
    }
  }, [dataStatus, session, status]);

  //   const carTypes =
  //     carFormData?.car_types?.map((item) => ({
  //       value: item.name,
  //       label: item.name,
  //     })) ?? [];

  //   const carMakes =
  //     carFormData?.car_makes?.map((item) => ({
  //       value: item.name,
  //       label: item.name,
  //     })) ?? [];

  //   const selectedCarMake = carFormData?.car_makes?.find(
  //     (item) => item.name === carMake
  //   );

  //   const carModels =
  //     selectedCarMake?.models?.map((item) => ({
  //       value: item.name,
  //       label: item.name,
  //     })) ?? [];

  const isSubmitting = useSelector(
    (state) => state.branches.submissionStatus == "loading"
  );

  const dispatch = useDispatch();
  const branch_id = useSelector((state) => state.branches.branch_id);

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["description"] = "New Description";
    params["unit_family_id"] = unit_family_id;
    params["id"] = item?.id;


    try {
      await dispatch(submitUnitEdit(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "Success",
        message:
          " Unit Successfully Updated",
        color: "green"
      });
      clearForm();
      setOpened(false);
      const pars = {};
      pars["accessToken"] = session.user.accessToken;

      store.dispatch(fetchUnits(pars));
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
        title="Edit Unit"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            EDIT UNIT
          </span>
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            defaultValue={item?.name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <Select
            placeholder="Unit Family"
            label="Select Unit Family"
            defaultValue={item?.unit_family_id}
            onChange={setFamilyId}
            data={familiesData}
            searchable
            clearable
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            EDIT
          </Button>
        </section>
      </Modal>

      <Button
        
        variant="outline"
        onClick={() => setOpened(true)}
      >
        EDIT
      </Button>
    </>
  );
}

export default EditUnitModal;
