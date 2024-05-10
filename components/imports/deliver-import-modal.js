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
import { useRouter } from "next/router";

function DeliverImportModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);


  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const visitorId = router.query?.visitor_id ?? null;
  console.log("vistotrId", visitorId)

  const [clearingCompany, setCompany] = useState("");
  const [pieces, setPieces] = useState("");
  const [weight, setWeight] = useState("");
  const [agentName, setAgent] = useState("");
  const [nid, setNid] = useState("");
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
    setCompany("");
    setAgent("");
    setWeight("");
    setNid("");
    // setAction("");
    setRemarks("");
    setPieces("");
    // setForm("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

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


    if (!remarks) {
      showNotification({
        title: "Error",
        message: "Remarks is required!",
        color: "red",
      });
      return;
    }




    const formData = new FormData();
    formData.append("visitor_id", visitorId);    
    formData.append("clearing_company", clearingCompany);
    formData.append("no_of_pieces", pieces);
    if (weight) formData.append("weight", weight);
    if (agentName) formData.append("agent_name", agentName);
    if (nid) formData.append("id_number", nid);
    if (remarks) formData.append("remarks", remarks);
    if (form) formData.append("ulds", JSON.stringify(form.ulds));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/deliverimport`;

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
          message: "Import delivery successful!",
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
        title="Deliver Import"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
        {/*<TextInput
            placeholder="Clearing Company"
            label="Clearing Company"
            withAsterisk
            value={clearingCompany}
            onChange={(e) => setCompany(e.currentTarget.value)}
          />*/}

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

          {/*<TextInput
            placeholder="Agent Name"
            label="Agent Name"
            withAsterisk
            value={agentName}
            onChange={(e) => setAgent(e.currentTarget.value)}
          />

           <TextInput
            placeholder="National ID Number"
            label="National ID Number"
            withAsterisk
            value={nid}
            onChange={(e) => setNid(e.currentTarget.value)}
          />*/}

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
            <label className="form-label" htmlFor={`uld-number-${uldIndex}`}>House AWB Number:</label>
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
            Remove House AWB
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={addUld}
          >
            Add House AWB
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
        Deliver
      </Button>

    </>
  );
}

export default DeliverImportModal;
