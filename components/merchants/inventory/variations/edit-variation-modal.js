import { Button, Modal, Space, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useElementSize } from "@mantine/hooks";

import {
  updateVariation,
  fetchVariationList,
  setIndex,
  setValsName,
  setMultipleVals,
  setVals,
} from "../../../../store/merchants/inventory/variation-slice";
import store from "../../../../store/store";

function EditVariationModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const { ref, width, height } = useElementSize();
  let variation_vals =
    useSelector((state) => state.variation.variation_vals) ?? [];
  const [variationValues, setVariationValues] = useState([
    item.variation_values,
  ]);
  const [name, setName] = useState(item.name);
  const dataStatus = useSelector(
    (state) => state.variation.submitVariationStatus
  );
  const params = {};
  params["accessToken"] = session?.user?.accessToken;

  const addValues = () => {
    let data = { id: "", name: "" };
    let vals = { vals: data };
    store.dispatch(setVals(vals));
    console.log(variation_vals);
  };

  const handleChange = (index, evnt) => {
    let index_pars = { index_id: index };
    let val_pars = { values: evnt };
    store.dispatch(setIndex(index_pars));
    store.dispatch(setValsName(val_pars));

    console.log(variation_vals);
  };

  function clearForm() {
    setName("");
    store.dispatch(setMultipleVals([]));
  }

  const data_one = useMemo(
    () => ({ vals: item.variation_values }),
    [item.variation_values]
  );

  useEffect(() => {
    if (!session || status !== "authenticated" || !opened) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (dataStatus === "fulfilled") {
      store.dispatch(fetchVariationList(params));
    }

    store.dispatch(setMultipleVals(data_one));
    setName(item.name);
  }, [opened, dataStatus, session, status, data_one, item.name]);

  const isSubmitting = useSelector(
    (state) => state.variation.submissionStatus == "loading"
  );

  const dispatch = useDispatch();
  // const branch_id = useSelector((state) => state.branches.branch_id);
  const removeValue = (index) => {
    let data = [...variationValues];

    data.splice(index, 1);
    setVariationValues(data);
  };
  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["id"] = item.id;
    params["variation_values"] = variation_vals;

    try {
      await dispatch(updateVariation(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "Success ",
        message: "Variation Edited Successfully",
        color: "green",
        autoClose: true,
      });
      clearForm();
      setOpened(false);
      const pars = {};
      pars["accessToken"] = session.user.accessToken;
      store.dispatch(fetchVariationList(pars));
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not update variation";
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
        title="Edit "
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Variation Information
          </span>
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            defaultValue={item.name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <div className="flex space-x-4">
            <div>
              <span className="text-dark text-sm font-bold">
                Variation Values
              </span>
            </div>
            <div className="flex flex-col">
              {variation_vals?.map((value, index) => (
                <div className="flex" key={index}>
                  <TextInput
                    key={index}
                    placeholder=""
                    label=""
                    style={{ width: 100 }}
                    className="mb-3"
                    defaultValue={value.name}
                    onChange={(e) => handleChange(index, e.currentTarget.value)}
                  />
                  <i
                    onClick={() => removeValue(index)}
                    className="text-red-800 font-bold px-2 cursor-pointer"
                  >
                    X
                  </i>
                </div>
              ))}
            </div>
            <div>
              <button
                onClick={addValues}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-1.5 py-1.5 text-center mr-1 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-green-800"
              >
                +
              </button>
            </div>
          </div>
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            UPDATE
          </Button>
        </section>
      </Modal>

      <Button
        variant="outline"
        onClick={() => {
          setOpened(true);
        }}
      >
        Edit
      </Button>
    </>
  );
}

export default EditVariationModal;
