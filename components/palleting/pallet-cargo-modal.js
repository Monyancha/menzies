import { Modal, Select, Menu, Button, Text, TextInput, Textarea, SimpleGrid } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconEdit,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../src/store/Store";
import Link from "next/link";
import { getLists, getDashboard } from "../../src/store/cargo/cargo-slice";

function PalletCargoModal({item}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

    const awbNumber = item.awb;   
    const cargoId = item.cargo_id;   


    const addAwb = () => {
      setForm((prevState) => ({
        awbs: [...prevState.awbs, { number: awbNumber, ulds: [{ number: "" }] }],
      }));
    };

    const removeAwb = (awbIndex) => {
      setForm((prevState) => ({
        awbs: prevState.awbs.filter((_, index) => index !== awbIndex),
      }));
    };

    const addUld = (awbIndex) => {
      setForm((prevState) => {
        const updatedAwbs = [...prevState.awbs];
        updatedAwbs[awbIndex].ulds.push({ number: "" });
        return { awbs: updatedAwbs };
      });
    };

    const removeUld = (awbIndex, uldIndex) => {
      setForm((prevState) => {
        const updatedAwbs = [...prevState.awbs];
        updatedAwbs[awbIndex].ulds.splice(uldIndex, 1);
        return { awbs: updatedAwbs };
      });
    }; 

  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [remarks, setRemarks] = useState("");
  const [form, setForm] = useState(
      {
      awbs: [{ number: awbNumber, ulds: [{ number: "" }] }],
    }
  );

  const handleRemarksChange = (e) => {
    setRemarks(e.currentTarget.value); // Set the value of Remarks based on event value
  };

  function clearForm() {
    setAwb("");
    setNature("");
    setPieces("");
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (!origin) {
      showNotification({
        title: "Error",
        message: "Origin is required!",
        color: "red",
      });
      return;
    }

    if (!destination) {
      showNotification({
        title: "Error",
        message: "Destination is required!",
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


    const formData = new FormData();
    formData.append("origin", origin);
    formData.append("cargo_id", cargoId);
    if (destination) formData.append("destination", destination);
    if (weight) formData.append("weight", weight);
    if (remarks) formData.append("remarks", remarks);
    if (form) formData.append("awbs", JSON.stringify(form.awbs));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/palleting`;

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
          message: "Cargo palleting successful!",
          color: "green",
        });
        // clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getDashboard(params));
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
        title="Pallet Cargo"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
 
        <TextInput
            placeholder="Origin"
            label="Origin"
            withAsterisk
            value={origin}
            onChange={(e) => setOrigin(e.currentTarget.value)}
          />

        <TextInput
            placeholder="Destination"
            label="Destination"
            withAsterisk
            value={destination}
            onChange={(e) => setDestination(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Weight"
            label="Weight"
            withAsterisk
            value={weight}
            onChange={(e) => setWeight(e.currentTarget.value)}
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
                    
                        {form.awbs.map((awb, awbIndex) => (
                          <div key={awbIndex}>
                            <TextInput
                              mb="xs"
                              label="AWB Number"
                              id={`awb-number-${awbIndex}`}
                              editable={false}
                              value={awb.number}
                              onChange={(e) => {
                                const updatedAwbs = [...form.awbs];
                                updatedAwbs[awbIndex].number = e.target.value;
                                setForm({ awbs: updatedAwbs });
                              }}
                            />


                              {awb.ulds.map((uld, uldIndex) => (
                                <div className="mb-5" key={uldIndex}>
                                  <TextInput
                                    mb="xs"
                                    label="ULD Number"
                                    id={`uld-number-${awbIndex}-${uldIndex}`}
                                    value={uld.number}
                                    onChange={(e) => {
                                      const updatedAwbs = [...form.awbs];
                                      updatedAwbs[awbIndex].ulds[
                                        uldIndex
                                      ].number = e.target.value;
                                      setForm({ awbs: updatedAwbs });
                                    }}
                                  />
                                </div>
                              ))}
                          
                            <Button
                              variant="outline"
                              color="red"
                              size="xs"
                              mr="xs"
                              mb="xs"
                              onClick={() => removeUld(awbIndex)}
                            >
                              Remove ULD
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              mb="xs"
                              onClick={() => addUld(awbIndex)}
                            >
                              Add ULD
                            </Button>
                          
                            </div>
                        ))}

                        <div className="col-lg-8">
                          <Button
                            variant="outline"
                            color="red"
                            size="xs"
                            mr="xs"
                            onClick={() => removeAwb()}
                          >
                            Remove AWB
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => addAwb()}
                          >
                            Add AWB
                          </Button>
                        </div>
               
                    </>
                </SimpleGrid>

        <section className="flex justify-between p-3 rounded-lg my-3"> {/* Change justify-end to justify-between */}
          <Button variant="outline" color="green" onClick={() => setOpened(false)}>{/* Add Cancel button */}
            Cancel
          </Button>
          <Button variant="outline" color="purple" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEdit size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        color="green"
      >
        Pallet
      </Button>

    </>
  );
}

export default PalletCargoModal;
