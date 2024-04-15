import React, { useEffect, useState } from "react";
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
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
} from "@mantine/core";

// images
import { Stack } from "@mui/system";
import { getSingleConsignment } from "../../../src/store/consignments/consignments-slice";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import store from "../../../src/store/Store";
import { fileType, formatDateTime } from "../../../lib/shared/data-formatters";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getVendors } from "../../../src/store/merchants/inventory/inventory-slice";

const COC = ({itemId, item}) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  //setCocAmount
  const [cocAmount, setCocAmount] = useState(item?.coc_amount ?? "");
  const [cocPaymentStatus, setCocPaymentStatus] = useState(item?.payment_status ?? "");
  const [portCharges, setPortCharges] = useState(item?.port_cost ?? "");
  const [loadContainerStatus, setLoadContainerStatus] = useState(item?.container_status ?? "");
  const [truckNumber, setTruckNumber] = useState(item?.truck_number ?? "");
  const [selectedDriver, setSelectedDriver] = useState(item?.driver ?? "");
  const [loadingDateTime, setLoadingDateTime] = useState(formatDateTime(item?.loading_date) ?? "");
  const [transporterCompanyName, setTransporterCompanyName] = useState(item?.transporter ?? "");
  const [loadingPerson, setLoadingPerson] = useState(item?.loading_person ?? "");
  const [transportationCost, setTransportationCost] = useState(item?.transport_cost ?? "");
  const [paidBy, setPaidBy] = useState(item?.paid_by ?? "");
  const [paymentMethod, setPaymentMethod] = useState(item?.payment_method ?? "");
  const [paymentDateTime, setPaymentDateTime] = useState(formatDateTime(item?.payment_date) ?? "");
  const [paymentProof, setPaymentProof] = useState(null);


  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("am here 1");

    const formData = new FormData();
    formData.append('consignment_id', itemId);
    // Append data to formData
    formData.append('payment_status', cocPaymentStatus);
    formData.append('port_cost', portCharges);
    formData.append('container_status', loadContainerStatus);
    formData.append('truck_number', truckNumber);
    formData.append('driver', selectedDriver);
    formData.append('loading_date', loadingDateTime);
    formData.append('transporter', transporterCompanyName);
    formData.append('loading_person', loadingPerson);
    formData.append('transport_cost', transportationCost);
    formData.append('paid_by', paidBy);
    formData.append('payment_method', paymentMethod);
    formData.append('payment_date', paymentDateTime);
    // Append files if they are selected
    if (paymentProof) {
      formData.append('payment_proof', paymentProof);
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/consignment-coc`;

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
          message: "Consignment COC updated successful!",
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

  console.log("Monyancha Enock", item);

  //Fetch Vendors
  const vendors = useSelector((state) => state.inventory.getVendors);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getVendors(params));
  }, [session, status]);

  const vendorsList =
  vendors?.data?.map((item) => ({
    value: item.name,
    label: item.name,
  })) ?? [];



  return (
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
        <Typography variant="h5" mb={1}>
          Update COC Details
        </Typography>
        <Typography color="textSecondary" mb={3}>
          To change your details, edit and save from here
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
            label="Port Charges(KES)"
            placeholder="Port Charges(KES)"
            value={portCharges}
            onChange={(e) => setPortCharges(e.target.value)}
          />

          <Select
              label="Select Currency"
              placeholder="Select Currency"
              data={[
                { value: "kes", label: "KES" },
                { value: "usd", label: "USD" },
              ]}
              clearable
              searchable
              // value={currency}
              // onChange={setCurrency}
            />

<Select
            label="Payment Method"
            placeholder="Payment Method"
            value={paymentMethod}
            onChange={(value) => setPaymentMethod(value)}
            data={[
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Cheque', label: 'Cheque' },
              { value: 'M-Pesa', label: 'M-Pesa' },
            ]}
            clearable
            searchable
          />

<Select
            label="Paid By"
            placeholder="Paid By"
            value={paidBy}
            onChange={(value) => setPaidBy(value)}
            data={[
              { value: 'Merchant', label: 'Merchant' },
              { value: 'Client', label: 'Client' },
            ]}
            clearable
            searchable
          />

          

          <TextInput
            type="datetime-local"
            placeholder="Date & Time of Payment"
            label="Date & Time of Payment"
            value={paymentDateTime}
            onChange={(e) => setPaymentDateTime(e.target.value)}
          />

<Stack>
          <FileInput
            label="Upload Payment Proof"
            placeholder="Upload Payment Proof"
            onChange={(file) => setPaymentProof(file)}
          />
          {item?.payment_proof && (
            <Link href={item?.payment_proof} target='_blank'>
              {fileType(item.payment_proof)}
            </Link>
          )}
          </Stack>

<TextInput
            label="Loading Person"
            placeholder="Loading Person"
            value={loadingPerson}
            onChange={(e) => setLoadingPerson(e.target.value)}
          />

<TextInput
            type="datetime-local"
            placeholder="Date & Time of Loading"
            label="Date & Time of Loading"
            value={loadingDateTime}
            onChange={(e) => setLoadingDateTime(e.target.value)}
          />
          

          <Select
            label="Load Container Status"
            placeholder="Load Container Status"
            value={loadContainerStatus}
            onChange={(value) => setLoadContainerStatus(value)}
            data={[
              { value: 'Pending', label: 'Pending' },
              { value: 'Complete', label: 'Complete' },
            ]}
            clearable
            searchable
            withAsterisk
          />

<Select
            label="Transporter Company (Vendor)"
            placeholder="Transporter Company (Vendor)"
            value={transporterCompanyName}
            onChange={(value) => setTransporterCompanyName(value)}
            data={vendorsList}
            clearable
            searchable
          />


<TextInput
            label="Enter Driver"
            placeholder="Enter Driver"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          />
        

          <TextInput
            label="Truck Number"
            placeholder="Truck Number"
            value={truckNumber}
            onChange={(e) => setTruckNumber(e.target.value)}
          />

<TextInput
            label="Transportation Cost(KES)"
            placeholder="Transportation Cost(KES)"
            value={transportationCost}
            onChange={(e) => setTransportationCost(e.target.value)}
          />

<TextInput
            type="datetime-local"
            placeholder="Date transport cost was paid "
            label="Date transport cost was paid "
            value={loadingDateTime}
            onChange={(e) => setLoadingDateTime(e.target.value)}
          />


         

          

          
          
          

        </SimpleGrid>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "end" }}
          mt={3}
        >

          <Button onClick={handleSubmit} loading={loading} variant="outline">Update COC Details</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default COC;
