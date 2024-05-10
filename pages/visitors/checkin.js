import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import React, { useState, useEffect } from "react";
import {
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import {
  Button,
  FileInput,
  Group,
  Radio,
  Image,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
  Flex,
  Title,
} from "@mantine/core";
import Card from "../../components/ui/layouts/card";
// images
import { Stack } from "@mui/system";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import store from "../../src/store/Store";
import { fileType } from "../../lib/shared/data-formatters";
import { getSingleConsignment } from "../../src/store/consignments/consignments-slice";
import {
  formatDateTime,
  formatDateOnly,
} from "../../lib/shared/data-formatters";
import { IconPlus, IconTrash, IconCircleCheck, IconUpload } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getLists } from "../../src/store/cargo/cargo-slice";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/visitors",
    title: "Visitors",
  },
  {
    to: "/visitors/checkin",
    title: "Checkin Visitor",
  },
];

export default function CheckinVisitor() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const visitorId = router.query?.visitor_id ?? null;

  // File states
  const [companyId, setCompanyId] = useState(null);
  const [carNo, setCarNo] = useState("");
  const [passNo, setPassNo] = useState("");
  const [visitType, setVisitType] = useState("");
  const [visitStatus, setVisitStatus] = useState("");
  const [cargoStatus, setCargoStatus] = useState("");
  const [shipperName, setShipperName] = useState("");
  const [person, setPerson] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [remarks, setRemarks] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [form, setForm] = useState(
    {
    awbs: [{ number: "", ulds: [{ number: "" }] }],
  }
);
//setNIdImage
const [nIdImage, setNIdImage] = useState(null);
const [userImage, setUserImage] = useState(null);

  //Radio Buttons

  const handleImageChange = {

  }

   const handleUserImageChange = {

  }

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!passNo) {
      showNotification({
        title: "Error",
        message: "Visitor Pass Number is required!",
        color: "red",
      });
      return;
    }

    if (!visitType) {
      showNotification({
        title: "Error",
        message: "Visitor Type is required!",
        color: "red",
      });
      return;
    }

    const formData = new FormData();
    formData.append("visitor_id", visitorId);
    if (passNo) formData.append("pass_number", passNo);
    if (carNo) formData.append("car_number", carNo);
    if (visitType) formData.append("visit_type", visitType);
    if (visitStatus) formData.append("visit_status", visitStatus);
    if (person) formData.append("person", person);
    if (cargoStatus) formData.append("cargo_status", cargoStatus);
    if (shipperName) formData.append("shipper_name", shipperName);
    if (companyId) formData.append("company", companyId);
    if (visitReason) formData.append("visit_reason", visitReason);
    if (form) formData.append("awbs", JSON.stringify(form.awbs));
    if (nIdImage) formData.append("id_image", nIdImage);
    if (userImage) formData.append("user_image", userImage);
    if (origin) formData.append("origin", origin);
    if (destination) formData.append("destination", destination);
    if (weight) formData.append("weight", weight);
    if (remarks) formData.append("remarks", remarks);


    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/checkin-visitor`;

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
          message: "Visitor checkin successful!",
          color: "green",
        });
        // clearForm();
        setLoading(false);
        if(visitType == 4)
        {
          router.push(`/imports/receivedimports?visitor_id=${visitorId}`);
        }else{
        router.push("/visitors");          
        }
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

  const addAwb = () => {
    setForm((prevState) => ({
      awbs: [...prevState.awbs, { number: "", ulds: [{ number: "" }] }],
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

  // Get Companies
  const items = useSelector((state) => state.cargo.getLists);
  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getLists(params));
  }, [session, status]);

  const companies = items?.lists?.companies;

  const companiesList =
    companies?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const users = items?.lists?.users;

  const usersList =
    users?.map((item) => ({
      value: item.email,
      label: item.first_name +" "+ item.last_name +" - "+ item.phone_number,
    })) ?? [];    

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Checkin Visitor" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <Grid container spacing={3}>
              {/* Edit Details */}
              <Grid item xs={12}>
                <Typography variant="h5" mb={1}>
                  Checkin Details
                </Typography>
                <Typography color="textSecondary" mb={3}>
                  Fill in the visitor details
                </Typography>

                <SimpleGrid
                  cols={2}
                  spacing="xs"
                  breakpoints={[
                    { maxWidth: "md", cols: 2, spacing: "xs" },
                    { maxWidth: "sm", cols: 2, spacing: "xs" },
                    { maxWidth: "xs", cols: 1, spacing: "xs" },
                  ]}
                >
                  <TextInput
                    value={carNo}
                    onChange={(e) => setCarNo(e.target.value)}
                    placeholder="Car Number Plate"
                    label="Car Number Plate"
                  />
                  <TextInput
                    value={passNo}
                    onChange={(e) => setPassNo(e.target.value)}
                    placeholder="Visitor Pass Number"
                    label="Visitor Pass Number"
                  />
                </SimpleGrid>

                <Radio.Group
                  value={visitType}
                  onChange={setVisitType}
                  label="Visit Type"
                  mt="sm"
                  mb="sm"
                >
                  <Group grow>
                    <Radio
                      value="1"
                      onChange={(e) => setVisitType(e.target.value)}
                      label="Official Visit"
                      mb="xs"
                    />
                    <Radio
                      value="2"
                      onChange={(e) => setVisitType(e.target.value)}
                      label="Staff"
                    />
                    <Radio
                      value="3"
                      onChange={(e) => setVisitType(e.target.value)}
                      label="Cargo Delivery"
                    />
                    <Radio
                      value="4"
                      onChange={(e) => setVisitType(e.target.value)}
                      label="Cargo Collection"
                    />
                  </Group>
                </Radio.Group>

                <SimpleGrid cols={2}>
                  {visitType === "1" && (
                    <>
                      <SimpleGrid cols={1} mt="xl">
                        <Radio.Group
                          value={visitStatus}
                          onChange={setVisitStatus}
                          label="Visit Status"
                          mt="sm"
                          mb="sm"
                        >
                          <Group grow>
                            <Radio
                              value="1"
                              onChange={(e) => setVisitStatus(e.target.value)}
                              mb="xs"
                              label="See Person"
                            />
                            <Radio
                              value="2"
                              onChange={(e) => setVisitStatus(e.target.value)}
                              mb="xs"
                              label="Other Reason"
                            />
                          </Group>
                        </Radio.Group>
                      </SimpleGrid>
                    </>
                  )}

                  {visitType === "1" && visitStatus === "1" && (
                    <>
                      <SimpleGrid cols={1} mt="sm">
                        <Select
                          label="Person"
                          placeholder="Person"
                          data={usersList}
                          onChange={setPerson}
                          value={person}
                          searchable
                          clearable
                        />
                      </SimpleGrid>
                    </>
                  )}

                  {visitType === "1" && visitStatus === "2" && (
                    <>
                      <SimpleGrid cols={1} mt="xl">
                        <TextInput
                          value={visitReason}
                          onChange={(e) => setVisitReason(e.target.value)}
                          placeholder="Reason for Visit"
                          label="Visit Reason"
                        />
                      </SimpleGrid>
                    </>
                  )}

                  {visitType === "2" && (
                    <>
                      <SimpleGrid cols={1} mt="sm">
                        <Select
                          label="Company"
                          placeholder="Company"
                          data={companiesList}
                          onChange={setCompanyId}
                          value={companyId}
                          searchable
                          clearable
                        />
                      </SimpleGrid>
                    </>
                  )}

                  {visitType === "3" && (
                    <>
                      <SimpleGrid cols={1} mt="xl">
                        <TextInput
                          value={shipperName}
                          onChange={(e) => setShipperName(e.target.value)}
                          placeholder="Shipper Name"
                          label="Shipper Name"
                        />

                        <Radio.Group
                          value={cargoStatus}
                          onChange={setCargoStatus}
                          label="Cargo Status"
                          mt="sm"
                          mb="sm"
                        >
                          <Group grow>
                            <Radio
                              value="0"
                              onChange={(e) => setCargoStatus(e.target.value)}
                              mb="xs"
                              label="Known"
                            />
                            <Radio
                              value="1"
                              onChange={(e) => setCargoStatus(e.target.value)}
                              mb="xs"
                              label="Unknown"
                            />
                            <Radio
                              value="2"
                              onChange={(e) => setCargoStatus(e.target.value)}
                              mb="xs"
                              label="General"
                            />
                          </Group>
                        </Radio.Group>
                      </SimpleGrid>
                    </>
                  )}
                </SimpleGrid>

                <SimpleGrid>
                  {visitType === "3" && cargoStatus === "0" && (
                    <>

                    <SimpleGrid
                      cols={2}
                      spacing="xs"
                      breakpoints={[
                        { maxWidth: "md", cols: 2, spacing: "xs" },
                        { maxWidth: "sm", cols: 2, spacing: "xs" },
                        { maxWidth: "xs", cols: 1, spacing: "xs" },
                      ]}
                    >
                      <TextInput
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Country/City of Origin"
                        label="Origin"
                      />
                      <TextInput
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Destination"
                        label="Destination"
                      />
                      <TextInput
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Weight"
                        label="Weight"
                      />
                      <Textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Remarks"
                        label="Remarks"
                      />
                    </SimpleGrid>
                    
                        {form.awbs.map((awb, awbIndex) => (
                          <div key={awbIndex}>
                            <TextInput
                              mb="xs"
                              label="Awb Number"
                              id={`awb-number-${awbIndex}`}
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
                  )}
                </SimpleGrid>

                <SimpleGrid cols={2} >
                <FileInput
                label="Upload National ID Image"
                placeholder="National ID Image"
                onChange={setNIdImage}
                icon={<IconUpload size={14} />}
                />

                <FileInput
                label="Upload User Image"
                placeholder="User Image"
                onChange={setUserImage}
                icon={<IconUpload size={14} />}
                />

              </SimpleGrid>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "end" }}
                  mt={3}
                >
                  <Button
                    leftIcon={<IconCircleCheck size={18} />}
                    onClick={handleSubmit}
                    loading={loading}
                    variant="outline"
                  >
                    Submit
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
