import {
  Button,
  Modal,
  Select,
  TextInput,
  Textarea,
  Checkbox,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCarWash } from "../../../lib/shared/roles_and_permissions";
import {
  fetchClientFormData,
  submitClient,
} from "../../../store/merchants/partners/clients-slice";
import store from "../../../store/store";
import { getBookingsSelect } from "../../../store/merchants/bookings/bookings-slice";
import {
  setClient,
  setSelectedClient,
} from "@/store/merchants/transactions/transaction-slice";

function NewClientModal({mt, size}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [moreOptions, setMoreOptions] = useState(false);

  //Medical Information
  const [medicalInformation, setMedicalInformation] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [gender, setGender] = useState();
  const [dob, setDob] = useState();
  const [house_no, setHouseNo] = useState();
  const [street_name, setStreet] = useState();
  const [estate, setEstate] = useState();
  const [city, setCity] = useState();

  const [carMake, setCarMake] = useState();
  const [carModel, setCarModel] = useState();
  const [carPlate, setCarPlate] = useState();
  const [carSeries, setCarSeries] = useState();
  const [carType, setCarType] = useState();
  const [carYom, setCarYom] = useState();

  //Medical Info
  const [allergies, setAllergies] = useState();
  const [medCondition, setMedCondition] = useState();

  // State variables for  additional medical fields
  //setShowAllergies
  const [showAllergies, setShowAllergies] = useState(false);

  const [showPriorMedCondition, setShowPriorMedCondition] = useState(false);

  const [showPreviousTreatment, setShowPreviousTreatment] = useState(false);
  const [previousTreatment, setPreviousTreatment] = useState("");

  const [showPreviousProcedure, setShowPreviousProcedure] = useState(false);
  const [previousProcedure, setPreviousProcedure] = useState("");

  const [showNextOfKinContact, setShowNextOfKinContact] = useState(false);
  const [nextOfKinContact, setNextOfKinContact] = useState("");

  const [showBloodPressure, setShowBloodPressure] = useState(false);
  const [bloodPressure, setBloodPressure] = useState("");

  const [showBodyWeight, setShowBodyWeight] = useState(false);
  const [bodyWeight, setBodyWeight] = useState("");

  const [showSkinType, setShowSkinType] = useState(false);
  const [skinType, setSkinType] = useState("");

  const [showHairType, setShowHairType] = useState(false);
  const [hairType, setHairType] = useState("");

  //setShowBloodType
  const [showBloodType, setShowBloodType] = useState(false);
  const [bloodType, setBloodType] = useState("");

  const dataStatus = useSelector((state) => state.clients.clientFormDataStatus);
  const carFormData = useSelector((state) => state.clients.clientFormData);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const isCarWashAc = isCarWash(session?.user);

  function clearForm() {
    setMoreOptions(false);

    setName("");
    setEmail("");
    setPhone("");
    setGender(null);
    setDob(null);
    setHouseNo("");
    setStreet("");
    setCity("");
    setEstate("");
    setCarMake(null);
    setCarModel(null);
    setCarPlate("");
    setCarSeries("");
    setCarType(null);
    setCarYom("");

    setHouseNo("");
    setCity("");
    setEstate("");

    //Medical Info
    setAllergies("");
    setMedCondition("");
    //Additional
    setPreviousTreatment("");
    setPreviousProcedure("");
    setNextOfKinContact("");
    setBloodPressure("");
    setBodyWeight("");
    setSkinType("");
    setHairType("");
    setBloodType("");
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (dataStatus === "idle") {
      store.dispatch(fetchClientFormData(params));
    }
  }, [session, status, dataStatus]);

  const carTypes =
    carFormData?.car_types?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const carMakes =
    carFormData?.car_makes?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const selectedCarMake = carFormData?.car_makes?.find(
    (item) => item.name === carMake
  );

  const carModels =
    selectedCarMake?.models?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const isSubmitting = useSelector(
    (state) => state.clients.submissionStatus == "loading"
  );

  const dispatch = useDispatch();

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["email"] = email;
    params["phone"] = phone;
    params["gender"] = gender;
    params["dob"] = dob?.toISOString();
    params["house_no"] = house_no;
    params["street_name"] = street_name;
    params["estate"] = estate;
    params["city"] = city;
    params["car_model"] = carModel;
    params["car_plate"] = carPlate;
    params["car_series"] = carSeries;
    params["car_year"] = carYom;
    params["car_type"] = carType;

    params["house_no"] = house_no;
    params["estate"] = estate;
    params["city"] = city;

    //
    params["allergies"] = allergies;
    params["med_condition"] = medCondition;
    //Additional medical information
    params["prev_treatment"] = previousTreatment;
    params["prev_procedure"] = previousProcedure;
    params["blood_pressure"] = bloodPressure;
    params["body_weight"] = bodyWeight;
    params["hair_type"] = hairType;
    params["next_of_kin_contact"] = nextOfKinContact;
    params["blood_type"] = bloodType;
    params["skin_type"] = skinType;

    try {
      const response = await dispatch(submitClient(params)).unwrap();

      // Set this to be the selected client
      if (response?.id) {
        dispatch(setClient({ client_id: response?.id }));
        dispatch(setSelectedClient({ client: response }));
      }

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });

      clearForm();
      const param = {};
      param["accessToken"] = session.user.accessToken;
      param["branch_id"] = branch_id;
      store.dispatch(getBookingsSelect(param));
      setOpened(false);
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
        title="New Customer"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="lg"
      >
        <section className="flex flex-col space-y-2 px-3 rounded-lg">
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            name="customer_name"
          />

          <TextInput
            placeholder="Email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Phone"
            label="Phone"
            type="telephone"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />

          <Checkbox
            checked={moreOptions}
            onChange={(e) => setMoreOptions(e.currentTarget.checked)}
            label="More"
          />

          {moreOptions && (
            <>
              <Select
                placeholder="Gender"
                label="Gender"
                value={gender}
                onChange={setGender}
                data={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
                searchable
                clearable
              />

              <DatePicker
                placeholder="DOB"
                label="Date of Birth"
                value={dob}
                onChange={setDob}
              />

              <TextInput
                placeholder="House Number"
                label="House Number"
                type="text"
                value={house_no}
                onChange={(e) => setHouseNo(e.currentTarget.value)}
              />
              <TextInput
                placeholder="Street Name"
                label="Street Name"
                type="text"
                value={street_name}
                onChange={(e) => setStreet(e.currentTarget.value)}
              />
              <TextInput
                placeholder="Estate"
                label="Estate"
                type="text"
                value={estate}
                onChange={(e) => setEstate(e.currentTarget.value)}
              />
              <TextInput
                placeholder="City"
                label="City"
                type="text"
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
              />
            </>
          )}
        </section>

        {moreOptions && isCarWashAc && (
          <section className="flex flex-col space-y-2 px-3 rounded-lg mt-3">
            <span className="text-dark text-sm font-bold">
              Customer Information
            </span>
            <div className="grid grid-cols-2 gap-4">
              <Select
                placeholder="Car Make"
                label="Car Make"
                value={carMake}
                onChange={setCarMake}
                data={carMakes}
                searchable
                clearable
              />

              <Select
                placeholder="Car Model"
                label="Car Model"
                value={carModel}
                onChange={setCarModel}
                data={carModels}
                searchable
                clearable
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                placeholder="Car Plate"
                label="Car Plate"
                value={carPlate}
                onChange={(e) => setCarPlate(e.currentTarget.value)}
              />

              <TextInput
                placeholder="Car Series"
                label="Car Series"
                value={carSeries}
                onChange={(e) => setCarSeries(e.currentTarget.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                placeholder="Car Type"
                label="Car Type"
                value={carType}
                onChange={setCarType}
                data={carTypes}
                searchable
                clearable
              />

              <TextInput
                placeholder="Year of Manufacture"
                label="Year of Manufacture"
                type="number"
                value={carYom}
                onChange={(e) => setCarYom(e.currentTarget.value)}
              />
            </div>
          </section>
        )}

        <section className="flex flex-col space-y-2 px-3 rounded-lg mt-3">
          <Checkbox
            checked={medicalInformation}
            onChange={(e) => setMedicalInformation(e.currentTarget.checked)}
            label="Additional Medical Information"
          />

          {medicalInformation && (
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                checked={showAllergies}
                onChange={(e) => setShowAllergies(e.currentTarget.checked)}
                label="Allergies"
              />

              {showAllergies && (
                <Textarea
                  placeholder="Allergies"
                  label="Allergies"
                  autosize
                  minRows={3}
                  sx={{ flex: 1 }}
                  value={allergies}
                  onChange={(e) => setAllergies(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showPriorMedCondition}
                onChange={(e) =>
                  setShowPriorMedCondition(e.currentTarget.checked)
                }
                label="Prior Medical Condition"
              />

              {showPriorMedCondition && (
                <Textarea
                  placeholder="Any Prior Medical Condition"
                  label="Prior Medical Condition"
                  autosize
                  minRows={3}
                  sx={{ flex: 1 }}
                  value={medCondition}
                  onChange={(e) => setMedCondition(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showPreviousTreatment}
                onChange={(e) =>
                  setShowPreviousTreatment(e.currentTarget.checked)
                }
                label="Previous Treatment Used"
              />

              {showPreviousTreatment && (
                <Textarea
                  placeholder="Previous Treatment Used"
                  label="Previous Treatment Used"
                  autosize
                  minRows={3}
                  sx={{ flex: 1 }}
                  value={previousTreatment}
                  onChange={(e) => setPreviousTreatment(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showPreviousProcedure}
                onChange={(e) =>
                  setShowPreviousProcedure(e.currentTarget.checked)
                }
                label="Previous Procedure"
              />

              {showPreviousProcedure && (
                <Textarea
                  placeholder="Previous Procedure"
                  label="Previous Procedure"
                  autosize
                  minRows={3}
                  sx={{ flex: 1 }}
                  value={previousProcedure}
                  onChange={(e) => setPreviousProcedure(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showNextOfKinContact}
                onChange={(e) =>
                  setShowNextOfKinContact(e.currentTarget.checked)
                }
                label="Next of Kin Contact"
              />

              {showNextOfKinContact && (
                <TextInput
                  type="tel"
                  placeholder="Next of Kin Contact"
                  label="Next of Kin Contact"
                  value={nextOfKinContact}
                  onChange={(e) => setNextOfKinContact(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showBloodPressure}
                onChange={(e) => setShowBloodPressure(e.currentTarget.checked)}
                label="Blood Pressure"
              />

              {showBloodPressure && (
                <TextInput
                  type="text"
                  placeholder="Blood Pressure"
                  label="Blood Pressure"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showBloodType}
                onChange={(e) => setShowBloodType(e.currentTarget.checked)}
                label="Blood Type (eg. A+, B, O+, O-)"
              />

              {showBloodType && (
                <TextInput
                  type="text"
                  placeholder="Blood Type (eg. A+, B, O)"
                  label="Blood Type"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showBodyWeight}
                onChange={(e) => setShowBodyWeight(e.currentTarget.checked)}
                label="Body Weight (Kgs)"
              />

              {showBodyWeight && (
                <TextInput
                  type="text"
                  placeholder="Body Weight (Kgs)"
                  label="Body Weight (Kgs)"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showSkinType}
                onChange={(e) => setShowSkinType(e.currentTarget.checked)}
                label="Skin Type"
              />

              {showSkinType && (
                <TextInput
                  type="text"
                  placeholder="Skin Type"
                  label="Skin Type"
                  value={skinType}
                  onChange={(e) => setSkinType(e.currentTarget.value)}
                />
              )}

              <Checkbox
                checked={showHairType}
                onChange={(e) => setShowHairType(e.currentTarget.checked)}
                label="Hair Type"
              />

              {showHairType && (
                <TextInput
                  type="text"
                  placeholder="Hair Type"
                  label="Hair Type"
                  value={hairType}
                  onChange={(e) => setHairType(e.currentTarget.value)}
                />
              )}
            </div>
          )}
        </section>

        <section className="flex justify-end space-y-2 mx-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconUser size={14} />}
        variant="outline"
        size={size ?? "xs"}
        mt={mt}
        onClick={() => setOpened(true)}
      >
        New
      </Button>
    </>
  );
}

export default NewClientModal;
