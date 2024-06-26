import { Modal, Select, Menu, Button, Text, TextInput, Textarea, SimpleGrid } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconEdit, IconPlus
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../src/store/Store";
import Link from "next/link";
import { getLists } from "../../src/store/cargo/cargo-slice";

function NewImportModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);


  const [loading, setLoading] = useState(false);
  const [fnumber, setFNumber] = useState("");
  const [pieces, setPieces] = useState("");
  const [weight, setWeight] = useState("");
  const [nature, setNature] = useState("");
  const [action, setAction] = useState("");
  const [remarks, setRemarks] = useState("");
   const [form, setForm] = useState({
    ulds: [
      {
        number: '',
        awbs: [{ number: '' }] // Initially one empty AWB for each ULD
      }
    ]
  });

   const updateUldNumber = (uldIndex, value) => {
    const updatedUlDs = [...form.ulds];
    updatedUlDs[uldIndex].number = value;
    setForm({ ...form, ulds: updatedUlDs });
  };

  const updateAwbNumber = (uldIndex, awbIndex, value) => {
    const updatedUlDs = [...form.ulds];
    updatedUlDs[uldIndex].awbs[awbIndex].number = value;
    setForm({ ...form, ulds: updatedUlDs });
  };

  const removeAwb = (uldIndex, awbIndex) => {
    const updatedUlDs = [...form.ulds];
    updatedUlDs[uldIndex].awbs.splice(awbIndex, 1);
    setForm({ ...form, ulds: updatedUlDs });
  };

  const addAwb = (uldIndex) => {
    const updatedUlDs = [...form.ulds];
    updatedUlDs[uldIndex].awbs.push({ number: '' });
    setForm({ ...form, ulds: updatedUlDs });
  };

  const removeUld = (uldIndex) => {
    const updatedUlDs = [...form.ulds];
    updatedUlDs.splice(uldIndex, 1);
    setForm({ ...form, ulds: updatedUlDs });
  };

  const addUld = () => {
    const updatedUlDs = [...form.ulds];
    updatedUlDs.push({ number: '', awbs: [{ number: '' }] });
    setForm({ ...form, ulds: updatedUlDs });
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.currentTarget.value); // Set the value of Remarks based on event value
  };

  const handleChange = (e) => {
    // Remove non-numeric characters using a regular expression
    const value = e.currentTarget.value.replace(/\D/g, '');
    setPieces(value);
  };

  function clearForm() {
    setFNumber("");
    setNature("");
    setWeight("");
    setNature("");
    setAction("");
    setRemarks("");
    setPieces("");
    // setForm("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!fnumber) {
      showNotification({
        title: "Error",
        message: "Flight Number is required!",
        color: "red",
      });
      return;
    }

    if (!pieces) {
      showNotification({
        title: "Error",
        message: "No of Pieces is required!",
        color: "red",
      });
      return;
    }

    if (!weight) {
      showNotification({
        title: "Error",
        message: "Weight is required!",
        color: "red",
      });
      return;
    }

    if (!nature) {
      showNotification({
        title: "Error",
        message: "Nature is required!",
        color: "red",
      });
      return;
    }

    if (!action) {
      showNotification({
        title: "Error",
        message: "Action is required!",
        color: "red",
      });
      return;
    }

    if (!remarks) {
      showNotification({
        title: "Error",
        message: "Remarks is required!",
        color: "red",
      });
      return;
    }




    const formData = new FormData();
    formData.append("flight_number", fnumber);
    formData.append("no_of_pieces", pieces);
    if (weight) formData.append("weight", weight);
    if (action) formData.append("action", action);
    if (nature) formData.append("nature_of_irregularity", nature);
    if (remarks) formData.append("remarks", remarks);
    if (form) formData.append("ulds", JSON.stringify(form.ulds));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/receiveimport`;

      const accessToken = session.user.accessToken;

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: formData,
      };

      console.log("Am here 2");

      setLoading(true);

      const response = await fetch(endpoint, options);

      const result = await response.json();
      console.log("Aiden Kabalake", response);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Receive import successful!",
          color: "green",
        });
        clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getLists(params));
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result?.message,
          color: "red",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification({
        title: "Error",
        message: "Try uploading files below 100Kbs. " + error,
        color: "red",
      });
      setLoading(false); // Turn off loading indicator in case of error
    }
  };


  return (
    <>
      <Modal
        opened={opened}
        title="Receive Import"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
        <TextInput
            placeholder="Flight Number"
            label="Flight Number"
            withAsterisk
            value={fnumber}
            onChange={(e) => setFNumber(e.currentTarget.value)}
          />

        <TextInput
            placeholder="No. of Pieces"
            label="No. of Pieces"
            withAsterisk
            inputMode="numeric"
            value={pieces}
            onChange={handleChange}
          />

          <TextInput
            placeholder="Weight"
            label="Weight"
            withAsterisk
            value={weight}
            onChange={(e) => setWeight(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Nature of Irregularity"
            label="Nature of Irregularity"
            withAsterisk
            value={nature}
            onChange={(e) => setNature(e.currentTarget.value)}
          />

           <TextInput
            placeholder="Action Taken"
            label="Action Taken"
            withAsterisk
            value={action}
            onChange={(e) => setAction(e.currentTarget.value)}
          />

          <Textarea
            placeholder="Remarks"
            label="Remarks"
            value={remarks}
            onChange={handleRemarksChange}
            withAsterisk
          />


 <SimpleGrid>
      <>
        {form.ulds.map((uld, uldIndex) => (
          <div key={uldIndex} className="col-lg-3 border m-4">
            <label className="form-label" htmlFor={`uld-number-${uldIndex}`}>ULD Number:</label>
            <TextInput
              type="text"
              list="ulds"
              value={uld.number}
              onChange={(e) => updateUldNumber(uldIndex, e.target.value)}
              className="form-control"
            />

            <div className="row col-lg-12">
              {uld.awbs.map((awb, awbIndex) => (
                <div key={awbIndex} className="col-sm-9">
                  <label className="form-label" htmlFor={`awb-number-${uldIndex}-${awbIndex}`}>AWB Number:</label>
                  <TextInput
                    type="text"
                    value={awb.number}
                    onChange={(e) => updateAwbNumber(uldIndex, awbIndex, e.target.value)}
                    className="form-control"
                  />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              color="red"
              size="xs"
              mr="xs"
              mb="xs"
              onClick={() => removeAwb(uldIndex)}
            >
              Remove AWB
            </Button>
            <Button
              variant="outline"
              size="xs"
              mb="xs"
              onClick={() => addAwb(uldIndex)}
            >
              Add AWB
            </Button>
          </div>
        ))}

        <div className="col-lg-8">
          <Button
            variant="outline"
            color="red"
            size="xs"
            mr="xs"
            onClick={removeUld}
          >
            Remove ULD
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={addUld}
          >
            Add ULD
          </Button>
        </div>
      </>
    </SimpleGrid>


        <section className="flex justify-end space-y-2 p-3 rounded-lg my-3">
          <Button variant="outline" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        color="green"
      >
        New Import
      </Button>

    </>
  );
}

export default NewImportModal;
