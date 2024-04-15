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
  Checkbox,
  FileInput,
  Group,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";

// images
import { Stack } from "@mui/system";
import { useSession } from "next-auth/react";
import { couldStartTrivia } from "typescript";
import { showNotification } from "@mantine/notifications";
import store from "../../../src/store/Store";
import {
  formatDateTime,
  formatDateOnly,
  fileType,
} from "../../../lib/shared/data-formatters";
import { getSingleConsignment } from "../../../src/store/consignments/consignments-slice";
import Link from "next/link";


const CustomsEntry = ({ itemId, item }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [entryType, setEntryType] = useState(item?.entry_type ?? "");
  const [entryNumber, setEntryNumber] = useState(item?.entry_no ?? "");
  const [cost, setCost] = useState(item?.cost ?? "");
  const [draftEntryFile, setDraftEntryFile] = useState(null);
  const [cdFile, setCdFile] = useState(null);
  const [fieldOfficerDateTime, setFieldOfficerDateTime] = useState(formatDateTime(item?.eta_field) ?? "");
  const [paidBy, setPaidBy] = useState(item?.paid_by ?? "");
  const [paymentMethod, setPaymentMethod] = useState(item?.payment_method ?? "");
  const [paymentDateTime, setPaymentDateTime] = useState(formatDateTime(item?.date_of_payment) ?? "");
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("am here 1");

    const formData = new FormData();
    // Append data to formData
    formData.append('consignment_id', itemId);
    formData.append("entry_type", entryType);
    formData.append("entry_no", entryNumber);
    formData.append("cost", cost);
    formData.append("eta_field", fieldOfficerDateTime);
    formData.append("paid_by", paidBy);
    formData.append("payment_method", paymentMethod);
    formData.append("date_of_payment", paymentDateTime);
    formData.append("release_date", releaseDateTime);
    // Append files if they are selected
    if (cdFile) {
      formData.append("cd_file", cdFile);
    }
    if (draftEntryFile) {
      formData.append("draft_entry", draftEntryFile);
    }
    if (paymentProofFile) {
      formData.append("payment_proof", paymentProofFile);
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/customs-entry`;

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
          message: "Customs entry updated successful!",
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

  return (
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
        <Typography variant="h5" mb={1}>
          Update Customs Entry
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
            value={entryType}
            onChange={(e) => setEntryType(e.target.value)}
            label="Enter Entry Type"
            placeholder="Enter Entry Type Eg. C490"
          />
          <Stack>
          <FileInput
            onChange={(file) => setDraftEntryFile(file)}
            label="Upload Draft Entry"
            placeholder="Upload Draft Entry"
          />
          {item?.draft_entry && (
            <Link href={item?.draft_entry} target='_blank'>
              {fileType(item.draft_entry)}
            </Link>
          )}
          <Checkbox mt="md" label="Director Approval" />
          <Checkbox mt="md" label="Client Approval" />
          </Stack>
          <TextInput
            value={entryNumber}
            onChange={(e) => setEntryNumber(e.target.value)}
            label="Enter Entry Number"
            placeholder="Enter Entry Number"
          />
          <TextInput
            type="datetime-local"
            value={fieldOfficerDateTime}
            onChange={(e) => setFieldOfficerDateTime(e.target.value)}
            placeholder="Date & Time shared by Field Officer"
            label="Date & Time shared by Field Officer"
          />

<Select
            label="Payment Method"
            placeholder="Payment Method"
            data={[
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cash", label: "Cash" },
              { value: "Cheque", label: "Cheque" },
              { value: "M-Pesa", label: "M-Pesa" },
            ]}
            clearable
            searchable
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
          
          <Select
            label="Paid By"
            placeholder="Paid By"
            data={[
              { value: "Merchant", label: "Merchant" },
              { value: "Client", label: "Client" },
            ]}
            clearable
            searchable
            value={paidBy}
            onChange={setPaidBy}
          />

<Stack>
          <FileInput
            onChange={(file) => setPaymentProofFile(file)}
            label="Upload Payment Proof"
            placeholder="Upload Payment Proof"
          />
          {item?.payment_proof && (
            <Link href={item?.payment_proof} target='_blank'>
              {fileType(item.payment_proof)}
            </Link>
          )}
          </Stack>

          
          <Stack>
          <FileInput
            onChange={(file) => setCdFile(file)}
            label="Upload CD"
            placeholder="Upload CD"
          />
          {item?.cd_file && (
            <Link href={item?.cd_file} target='_blank'>
              {fileType(item.cd_file)}
            </Link>
          )}
          </Stack>

          <TextInput
            type="datetime-local"
            value={paymentDateTime}
            onChange={(e) => setPaymentDateTime(e.target.value)}
            placeholder="Date & Time of Payment"
            label="Date & Time of Payment"
          />
          
          <TextInput
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost"
            label="Cost"
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


        
          
        </SimpleGrid>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "end" }}
          mt={3}
        >
          <Button onClick={handleSubmit} loading={loading} variant="outline">
            Update Customs Entry
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CustomsEntry;
