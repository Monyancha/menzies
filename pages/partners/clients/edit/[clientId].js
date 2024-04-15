import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import store from "../../../../src/store/Store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import { Textarea, TextInput, Checkbox } from "@mantine/core";
import { Button, Select, MultiSelect } from "@mantine/core";
import { getAllCustomerCategories } from "../../../../src/store/partners/clients-slice";
import { parseValidInt } from "../../../../lib/shared/data-formatters";
//
import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/clients",
    title: "Clients",
  },
  {
    title: "Edit Client",
  },
];


function EditClients() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const clientId = router?.query?.clientId ?? null;
  //Get Next Url
  const next_url = router?.query?.next_url ?? null;

  const currentClient = useSelector((state) =>
    state.clients?.clientList?.data?.find((item) => item.id == clientId)
  );

  //Medical Information
  const [medicalInformation, setMedicalInformation] = useState(false);

  //
  const [categoryId, setCategoryId] = useState(
    currentClient?.category_id ?? []
  );

  console.log("Selected Categories", categoryId);

  //Medical Info
  const [allergies, setAllergies] = useState(currentClient?.allergies ?? "");
  const [medCondition, setMedCondition] = useState(
    currentClient?.med_condition ?? ""
  );

  // State variables for  additional medical fields
  //setShowAllergies
  const [showAllergies, setShowAllergies] = useState(false);

  const [showPriorMedCondition, setShowPriorMedCondition] = useState(false);

  const [showPreviousTreatment, setShowPreviousTreatment] = useState(false);
  const [previousTreatment, setPreviousTreatment] = useState(
    currentClient?.prev_treatment ?? ""
  );

  const [showPreviousProcedure, setShowPreviousProcedure] = useState(false);
  const [previousProcedure, setPreviousProcedure] = useState(
    currentClient?.prev_procedure ?? ""
  );

  const [showNextOfKinContact, setShowNextOfKinContact] = useState(false);
  const [nextOfKinContact, setNextOfKinContact] = useState(
    currentClient?.next_of_kin_contact ?? ""
  );

  const [showBloodPressure, setShowBloodPressure] = useState(false);
  const [bloodPressure, setBloodPressure] = useState(
    currentClient?.blood_pressure ?? ""
  );

  const [showBodyWeight, setShowBodyWeight] = useState(false);
  const [bodyWeight, setBodyWeight] = useState(
    currentClient?.body_weight ?? ""
  );

  const [showSkinType, setShowSkinType] = useState(false);
  const [skinType, setSkinType] = useState(currentClient?.skin_type ?? "");

  const [showHairType, setShowHairType] = useState(false);
  const [hairType, setHairType] = useState(currentClient?.hair_type ?? "");

  //setShowBloodType
  const [showBloodType, setShowBloodType] = useState(false);
  const [bloodType, setBloodType] = useState(currentClient?.blood_type ?? "");

  const clientListLoaded = useSelector(
    (state) => state.clients?.clientListStatus === "fulfilled"
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!clientListLoaded) {
      router.replace("/partners/clients");
    }
  }, [clientListLoaded, router]);

  console.log("Client details", currentClient);

  const submitClient = async (event) => {
    event.preventDefault();

    if (!event.target.name.value) {
      showNotification({
        title: "Error",
        message: "Name is required!",
        color: "red",
      });
      return;
    }

    const data = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      dob: event.target.dob.value,
      gender: event.target.gender.value,
      house_no: event.target.house_no.value,
      estate: event.target.estate.value,
      city: event.target.city.value,
      kra_pin: event.target.kra_pin.value,
      street_name: event.target.street_name.value,
      allergies: allergies,
      med_condition: medCondition,
      //
      prev_treatment: previousTreatment,
      prev_procedure: previousProcedure,
      blood_pressure: bloodPressure,
      body_weight: bodyWeight,
      hair_type: hairType,
      next_of_kin_contact: nextOfKinContact,
      blood_type: bloodType,
      skin_type: skinType,
      //Add Category Id
      category_id: categoryId,
    };

    console.log("Create Client Payload", data);

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/partners/clients/update/${clientId}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log("Update Client Api Response", result);

    if (!result.error) {
      showNotification({
        title: "Success",
        message: "Client Updated Successfully",
        color: "green",
      });
      router.push(`/partners/clients?next_url=${next_url}`);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  const items = useSelector((state) => state.clients.getAllCustomerCategories);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getAllCustomerCategories(params));
  }, [session, status]);

  const categories =
    items?.map((item) => ({
      value: parseValidInt(item.id),
      label: item.name,
    })) ?? [];


  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Create Company" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>


      {currentClient && (
        <form onSubmit={submitClient} autoComplete="off">
          <div className="h-full w-full bg-white rounded-t-xl px-6 py-4 pb-8">
            <div className="flex flex-wrap justify-between items-stretch">
              <div className="basis-full md:basis-6/12 flex flex-col justify-between flex-wrap h-auto">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>Name</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Customer Name"
                    defaultValue={currentClient?.name}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>Email</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Customer Email"
                    defaultValue={currentClient?.email}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>Phone</span>
                  </div>
                  <input
                    type="text"
                    name="phone"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Customer Phone"
                    defaultValue={currentClient?.phone}
                  />
                </div>
                <div className="px-2 py-2">
                  <MultiSelect
                    label="Customer Category"
                    placeholder="Select Customer Category"
                    searchable
                    clearable
                    data={categories}
                    onChange={setCategoryId}
                    defaultValue={categoryId}
                  />
                </div>

                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>House No</span>
                  </div>
                  <input
                    type="text"
                    name="house_no"
                    className="input-primary h-12 text-sm"
                    placeholder="House No"
                    defaultValue={currentClient?.house_no}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>City</span>
                  </div>
                  <input
                    type="text"
                    name="city"
                    className="input-primary h-12 text-sm"
                    placeholder="City"
                    defaultValue={currentClient?.city}
                  />
                </div>

                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>KRA PIN</span>
                  </div>
                  <input
                    type="text"
                    name="kra_pin"
                    className="input-primary h-12 text-sm"
                    placeholder="KRA PIN"
                    defaultValue={currentClient?.kra_pin}
                  />
                </div>
              </div>
              <div className="basis-full md:basis-6/12 flex flex-col justify-start flex-wrap">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>Gender</span>
                  </div>
                  <select
                    className="py-3 select select-bordered h-fit"
                    required=""
                    name="gender"
                    defaultValue={currentClient?.gender}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>Date of Birth</span>
                  </div>
                  <input
                    type="date"
                    name="dob"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Date of Birth"
                    defaultValue={currentClient?.dob}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>Street/Road</span>
                  </div>
                  <input
                    type="text"
                    name="street_name"
                    className="input-primary h-12 text-sm"
                    placeholder="Street Name"
                    defaultValue={currentClient?.street_name}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm">
                    <span>Estate/Building</span>
                  </div>
                  <input
                    type="text"
                    name="estate"
                    className="input-primary h-12 text-sm"
                    placeholder="Estate/Building"
                    defaultValue={currentClient?.estate}
                  />
                </div>

                <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg mt-3">
                  <Checkbox
                    checked={medicalInformation}
                    onChange={(e) =>
                      setMedicalInformation(e.currentTarget.checked)
                    }
                    label="Additional Medical Information"
                  />

                  {medicalInformation && (
                    <div className="grid grid-cols-2 gap-4">
                      <Checkbox
                        checked={showAllergies}
                        onChange={(e) =>
                          setShowAllergies(e.currentTarget.checked)
                        }
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
                          onChange={(e) =>
                            setMedCondition(e.currentTarget.value)
                          }
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
                          onChange={(e) =>
                            setPreviousTreatment(e.currentTarget.value)
                          }
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
                          onChange={(e) =>
                            setPreviousProcedure(e.currentTarget.value)
                          }
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
                          onChange={(e) =>
                            setNextOfKinContact(e.currentTarget.value)
                          }
                        />
                      )}

                      <Checkbox
                        checked={showBloodPressure}
                        onChange={(e) =>
                          setShowBloodPressure(e.currentTarget.checked)
                        }
                        label="Blood Pressure"
                      />

                      {showBloodPressure && (
                        <TextInput
                          type="text"
                          placeholder="Blood Pressure"
                          label="Blood Pressure"
                          value={bloodPressure}
                          onChange={(e) =>
                            setBloodPressure(e.currentTarget.value)
                          }
                        />
                      )}

                      <Checkbox
                        checked={showBloodType}
                        onChange={(e) =>
                          setShowBloodType(e.currentTarget.checked)
                        }
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
                        onChange={(e) =>
                          setShowBodyWeight(e.currentTarget.checked)
                        }
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
                        onChange={(e) =>
                          setShowSkinType(e.currentTarget.checked)
                        }
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
                        onChange={(e) =>
                          setShowHairType(e.currentTarget.checked)
                        }
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
              </div>
            </div>
          </div>
          <div className="h-full w-full bg-white rounded-b-xl px-6 py-4 mt-1">
            <div className="flex justify-start mx-2 space-x-2">
              <button className="btn btn-primary gap-2">
                <i className="fa-solid fa-save" />
                Save
              </button>
            </div>
          </div>
        </form>
      )}
     </Box>
    </PageContainer>
  );
}

export default EditClients;
