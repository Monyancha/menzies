import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import React, { useState } from "react";
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
  Image,
  Select,
  SimpleGrid,
  TextInput,
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
import { IconPlus, IconTrash, IconCircleCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/projects",
    title: "Projects",
  },
  {
    to: "/projects/new",
    title: "New Project",
  },
];

export default function NewProject() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const  router = useRouter();
  // File states
  const [billDocument, setBillDocument] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [deliveryOrder, setDeliveryOrder] = useState(null);

  const constituencies = ["Galole", "Garsen", "Bura"];
  const subCounties = {
    Galole: ["Tana North"],
    Garsen: ["Tana Delta"],
    Bura: ["Tana River"],
  };
  const wards = {
    "Tana North": ["Sala", "Bangal", "Chewele", "Madogo", "Hirimani"],
    "Tana Delta": [
      "Kipini West",
      "Kipini East",
      "Garsen South",
      "Garsen Central",
      "Garsen North",
    ],
    "Tana River": ["Mikinduni", "Chewani", "Wayu", "Kinakomba"],
  };

  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedSubCounty, setSelectedSubCounty] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const handleConstituencyChange = (value) => {
    setSelectedConstituency(value);
    setSelectedSubCounty("");
    setSelectedWard("");
  };

  const handleSubCountyChange = (value) => {
    setSelectedSubCounty(value);
    setSelectedWard("");
  };

  const handleWardChange = (value) => {
    setSelectedWard(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    showNotification({
      title: "Can't Process Request",
      message:
        "We can't process your request now, try again when the backend is ready!",
      color: "red",
    });

    router.push("/projects");

    return;

    const formData = new FormData();
    formData.append("consignment_id", itemId);
    formData.append("eta_time", etaTime);
    formData.append("vessel_no", vesselNumber);
    formData.append("discharge_date", dischargeDate);
    formData.append("container_transfer_date", containerTransferDate);
    formData.append("manifest_no", manifestNumber);
    formData.append("shipping_cost", shippingCharges);
    formData.append("payment_method", paymentMethod);
    formData.append("paid_by", paidBy);
    formData.append("picking_date", pickingDate);
    // Append files if they are selected
    // if (billDocument) {
    //   formData.append("bill_of_lading", billDocument);
    // }
    // if (paymentProof) {
    //   formData.append("proof_of_payment", paymentProof);
    // }

    // Append container deposits if they are selected
    containerDeposits.forEach((deposit, index) => {
      formData.append(
        `container_deposits[${index}][currency]`,
        deposit.currency
      );
      formData.append(`container_deposits[${index}][amount]`, deposit.amount);
      formData.append(
        `container_deposits[${index}][shipping_line]`,
        deposit.shippingLine
      );
    });

    // Append proof of payments if they are selected
    proofOfPayments.forEach((payment, index) => {
      if (payment.file) {
        formData.append(`proof_of_payments[${index}][file]`, payment.file);
      }
      formData.append(
        `proof_of_payments[${index}][description]`,
        payment.description
      );
    });

    if (deliveryOrder) {
      formData.append("delivery_order", deliveryOrder);
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/bill-of-lading`;

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
          message: "Bill of Lading updated successful!",
          color: "green",
        });
        // clearForm();
        setLoading(false);
        const params = {};
        params["accessToken"] = accessToken;
        params["itemId"] = itemId;
        store.dispatch(getSingleConsignment(params));
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

  const [containerDeposits, setContainerDeposits] = useState([
    { currency: "kes", amount: "", shippingLine: "" },
  ]);

  const [proofOfPayments, setProofOfPayments] = useState([
    { file: null, description: "" },
  ]);

  const handleContainerDepositChange = (index, key, value) => {
    const updatedDeposits = [...containerDeposits];
    updatedDeposits[index][key] = value;
    setContainerDeposits(updatedDeposits);
  };

  const handleAddContainerDeposit = () => {
    setContainerDeposits([
      ...containerDeposits,
      { currency: "kes", amount: "", shippingLine: "" },
    ]);
  };

  const handleRemoveContainerDeposit = (index) => {
    const updatedDeposits = [...containerDeposits];
    updatedDeposits.splice(index, 1);
    setContainerDeposits(updatedDeposits);
  };

  const handleProofOfPaymentChange = (index, key, value) => {
    const updatedPayments = [...proofOfPayments];
    updatedPayments[index][key] = value;
    setProofOfPayments(updatedPayments);
  };

  const handleAddProofOfPayment = () => {
    setProofOfPayments([...proofOfPayments, { file: null, description: "" }]);
  };

  const handleRemoveProofOfPayment = (index) => {
    const updatedPayments = [...proofOfPayments];
    updatedPayments.splice(index, 1);
    setProofOfPayments(updatedPayments);
  };
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="New Project" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <Grid container spacing={3}>
              {/* Edit Details */}
              <Grid item xs={12}>
                <Typography variant="h5" mb={1}>
                  Project Details
                </Typography>
                <Typography color="textSecondary" mb={3}>
                  Fill in the project details to commence the project
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

                <TextInput placeholder="Project No." label="Project No." />

                  <TextInput placeholder="Project Name" label="Project Name" />

                  <Select
                    label="Select Constituency"
                    placeholder="Select Constituency"
                    data={constituencies.map((constituency) => ({
                      value: constituency,
                      label: constituency,
                    }))}
                    clearable
                    searchable
                    value={selectedConstituency}
                    onChange={handleConstituencyChange}
                  />

                  {selectedConstituency && (
                    <Select
                      label="Select Sub-County"
                      placeholder="Select Sub-County"
                      data={subCounties[selectedConstituency].map(
                        (subCounty) => ({ value: subCounty, label: subCounty })
                      )}
                      clearable
                      searchable
                      value={selectedSubCounty}
                      onChange={handleSubCountyChange}
                    />
                  )}

                  {selectedSubCounty && (
                    <Select
                      label="Select Ward"
                      placeholder="Select Ward"
                      data={wards[selectedSubCounty].map((ward) => ({
                        value: ward,
                        label: ward,
                      }))}
                      clearable
                      searchable
                      value={selectedWard}
                      onChange={handleWardChange}
                    />
                  )}

                {selectedSubCounty &&  selectedWard && (
                    <Select
                      label="Select Sub-Location"
                      placeholder="Select Sub-Location"
                      data={[
                        { value: "1", label: "Sublocation 1" },
                        { value: "2", label: "Sublocation 2" },
                        { value: "3", label: "Sublocation 3" },
                        { value: "4", label: "Sublocation 4" },
                        { value: "5", label: "Sublocation 5" },
                      ]}
                      clearable
                      searchable
                    />
                  )}

                  <Select
                    label="Contractor/Vendor"
                    placeholder="Contractor/Vendor"
                    data={[
                      { value: "1", label: "Contractor 1" },
                      { value: "2", label: "Contractor 2" },
                      { value: "3", label: "Contractor 3" },
                      { value: "4", label: "Contractor 4" },
                      { value: "5", label: "Contractor 5" },
                    ]}
                    clearable
                    searchable
                  />

                <Select
                    label="Select Department"
                    placeholder="Select Department"
                    data={[
                      { value: "1", label: "Health Department" },
                      { value: "2", label: "Education Department" },
                      { value: "3", label: "Finance Department" },
                      { value: "4", label: "Sports Department" },
                      { value: "5", label: "Agriculture Department" },
                    ]}
                    clearable
                    searchable
                  />

                  <TextInput
                    // defaultValue={etaTime}
                    // onChange={(e) => setEtaTime(e.target.value)}
                    type="date"
                    placeholder="Project Start Date"
                    label="Project Start Date"
                  />
                  <TextInput
                    // defaultValue={etaTime}
                    // onChange={(e) => setEtaTime(e.target.value)}
                    type="date"
                    placeholder="Project Completion Date"
                    label="Project Completion Date"
                  />
                  <TextInput
                    // defaultValue={etaTime}
                    // onChange={(e) => setEtaTime(e.target.value)}
                    type="date"
                    placeholder="Project Hand-over Date"
                    label="Project Hand-Over Date"
                  />
                  <TextInput
                    // defaultValue={etaTime}
                    // onChange={(e) => setEtaTime(e.target.value)}
                    type="date"
                    placeholder="Project Launch  Date"
                    label="Project Launch  Date"
                  />
                  <TextInput
                    // value={vesselNumber}
                    // onChange={(e) => setVesselNumber(e.target.value)}
                    placeholder="Project Budget(KES)"
                    label="Project Budget(KES)"
                  />
                  <Select
                    label="Select Financial Year"
                    placeholder="Select Financial Year"
                    data={[
                      { value: "1", label: "2019/2020" },
                      { value: "2", label: "2020/2021" },
                      { value: "3", label: "2021/2022" },
                      { value: "4", label: "2022/2023" },
                      { value: "5", label: "2023/2024" },
                      { value: "6", label: "2024/2025" },
                      { value: "7", label: "2025/2026" },
                      { value: "8", label: "2026/2027" },
                      { value: "9", label: "2027/2028" },
                    ]}
                    clearable
                    searchable
                  />
                  <Select
                    label="Project Status"
                    placeholder="Project Status"
                    data={[
                      { value: "1", label: "Pending" },
                      { value: "2", label: "Ongoing" },
                      { value: "3", label: "Completed" },
                      { value: "4", label: "In Procurement" },
                      { value: "5", label: "New Project" },
                      { value: "6", label: "Delayed" },
                      { value: "7", label: "Stalled" },
                      { value: "8", label: "Other" },
                    ]}
                    clearable
                    searchable
                  />
               
                </SimpleGrid>

                <Typography mt={4} variant="h5" mb={1}>
                  Documents and Images
                </Typography>
                <Typography color="textSecondary" mb={3}>
                  You can upload multiple documents and images
                </Typography>

                {proofOfPayments.map((payment, index) => (
                  <SimpleGrid
                    cols={3}
                    mt="xl"
                    key={index}
                    spacing="xs"
                    breakpoints={[
                      { maxWidth: "md", cols: 2, spacing: "xs" },
                      { maxWidth: "sm", cols: 2, spacing: "xs" },
                      { maxWidth: "xs", cols: 1, spacing: "xs" },
                    ]}
                  >
                    <Stack>
                      <FileInput
                        onChange={(file) =>
                          handleProofOfPaymentChange(index, "file", file)
                        }
                        label="Upload Image/Document"
                        placeholder="Upload Image/Document"
                      />
                    </Stack>

                    <TextInput
                      value={payment.description}
                      onChange={(e) =>
                        handleProofOfPaymentChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Description"
                      label="Description"
                    />

                    <Button
                      mt={21}
                      leftIcon={<IconTrash size={18} />}
                      variant="outline"
                      color="red"
                      onClick={() => handleRemoveProofOfPayment(index)}
                    >
                      Remove
                    </Button>
                  </SimpleGrid>
                ))}
                <Button
                  mt="xl"
                  leftIcon={<IconPlus size={18} />}
                  variant="outline"
                  onClick={handleAddProofOfPayment}
                >
                  Add Image/Document
                </Button>

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
                    Start Project
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
