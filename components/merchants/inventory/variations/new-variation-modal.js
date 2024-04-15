import { Button, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useElementSize } from "@mantine/hooks";

import {
  submitVariation,
  fetchVariationList,
} from "@/store/merchants/inventory/variation-slice";
import store from "@/store/store";

function NewVariationModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const { ref, width, height } = useElementSize();

  const [variationValues, setVariationValues] = useState([]);

  const [name, setName] = useState();
  const dataStatus = useSelector(
    (state) => state.variation.submitVariationStatus
  );

  const params = {};
  params["accessToken"] = session?.user?.accessToken;

  const addValues = () => {
    setVariationValues([...variationValues, { value_name: "" }]);
  };

  const handleChange = (index, evnt) => {
    let list = [...variationValues];
    list[index]["value_name"] = evnt;

    setVariationValues(list);
    //console.log(variationValues);
  };

  function clearForm() {
    setName("");
    setVariationValues([]);
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (dataStatus === "fulfilled") {
      store.dispatch(fetchVariationList(params));
    }
  }, [dataStatus, session, status]);

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
    params["variation_values"] = variationValues;

    try {
      await dispatch(submitVariation(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "Success ",
        message: "New Variation Added",
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
        message = "Could not add variation";
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
        title="New "
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
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <div className="flex space-x-4">
            <div>
              <span className="text-dark text-sm font-bold">
                Variation Values
              </span>
            </div>
            <div className="flex flex-col">
              {variationValues?.map((value, index) => (
                <div className="flex" key={index}>
                  <TextInput
                    key={index}
                    placeholder=""
                    label=""
                    style={{ width: 100 }}
                    className="mb-3"
                    value={value?.value_name}
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
            Save
          </Button>
        </section>
      </Modal>

      <Button variant="outline" size="xs" onClick={() => setOpened(true)}>
        New Variation
      </Button>
    </>
  );
}

export default NewVariationModal;
