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
  Image,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";

// images
import { Stack } from "@mui/system";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import store from "../../../src/store/Store";
import { fileType } from "../../../lib/shared/data-formatters";
import { getSingleConsignment } from "../../../src/store/consignments/consignments-slice";
import { useEffect } from "react";

const ReceivingTab = ({ itemId, item }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [proformaInvoice, setProformaInvoice] = useState(null);
  const [commercialInvoice, setCommercialInvoice] = useState(null);
  const [billOfLading, setBillOfLading] = useState(null);
  const [packingList, setPackingList] = useState(null);
  const [idfFile, setIdfFile] = useState(null);
  const [idfDone, setIdfDone] = useState('');
  const [idfDate, setIdfDate] = useState('');

  const [permits, setPermits] = useState(item?.permits ? JSON.parse(item?.permits) : [
    {
      permitFile: null,
      cost: "",
      paymentMethod: "",
      paidBy: "",
      currency: "kes",
      proofFile: null,
    },
  ]);

  const addPermit = () => {
    setPermits([
      ...permits,
      {
        permitFile: null,
        cost: "",
        paymentMethod: "",
        paidBy: "",
        currency: "kes",
        proofFile: null,
      },
    ]);
  };

  const removePermit = (index) => {
    const newPermits = [...permits];
    newPermits.splice(index, 1);
    setPermits(newPermits);
  };

  const handleInputChange = (index, field, value) => {
    const newPermits = [...permits];
    newPermits[index][field] = value;
    setPermits(newPermits);
  };

  const handlePermitFileChange = (index, file) => {
    const newPermits = [...permits];
    newPermits[index].permitFile = file;
    setPermits(newPermits);
  };

  const handleProofFileChange = (index, file) => {
    const newPermits = [...permits];
    newPermits[index].proofFile = file;
    setPermits(newPermits);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    // Add consignmentId to formData
    formData.append("consignment_id", itemId);
    // Append files if they are selected
    if (proformaInvoice) {
      formData.append("proforma_invoice", proformaInvoice);
    }
    if (commercialInvoice) {
      formData.append("commercial_invoice", commercialInvoice);
    }
    if (billOfLading) {
      formData.append("bill_of_lading", billOfLading);
    }
    if (packingList) {
      formData.append("packing_list", packingList);
    }
    if (idfFile) {
      formData.append("idf", idfFile);
    }
    if (idfDone) {
      formData.append("idf_done", idfDone);
    }
    if (idfDate) {
      formData.append("idf_date", idfDate);
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/receive-consignment`;

      const accessToken = session.user.accessToken;

      // Add permits to formData
      permits.forEach((permit, index) => {
        for (const field in permit) {
          if (Array.isArray(permit[field])) {
            permit[field].forEach((file) => {
              formData.append(`permits[${index}][${field}]`, file);
            });
          } else if (permit[field] != null) {
            formData.append(`permits[${index}][${field}]`, permit[field]);
          }
        }
      });

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: formData,
      };

      setLoading(true);

      const response = await fetch(endpoint, options);

      const result = await response.json();
      console.log(result);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Consignment Receival updated successful!",
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

  console.log("Monyancha Blake", permits);

  useEffect(() => {
    // Update the photos state if the item prop changes
    if (item?.permits) {
      setPermits(JSON.parse(item.permits));
    }
  }, [item]);


  return (
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
        <Typography variant="h5" mb={1}>
          Update Receiving Details
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
          <Stack>
            <FileInput
              label="Upload Proforma Invoice"
              placeholder="Upload Proforma Invoice"
              onChange={setProformaInvoice}
            />
            {item?.proforma_invoice && (
              <Link href={item?.proforma_invoice} target="_blank">
                {fileType(item.proforma_invoice)}
              </Link>
            )}
          </Stack>
          <Stack>
            <FileInput
              label="Upload Commercial Invoice"
              placeholder="Upload Commercial Invoice"
              onChange={setCommercialInvoice}
            />
            {item?.commercial_invoice && (
              <Link href={item?.commercial_invoice} target="_blank">
                {fileType(item.commercial_invoice)}
              </Link>
            )}
          </Stack>
          <Stack>
            <FileInput
              label="Upload Bill of Lading"
              placeholder="Upload Bill of Lading"
              onChange={setBillOfLading}
            />
            {item?.bill_of_lading && (
              <Link href={item?.bill_of_lading} target="_blank">
                {fileType(item.bill_of_lading)}
              </Link>
            )}
          </Stack>
          <Stack>
            <FileInput
              label="Upload Packing List"
              placeholder="Upload Packing List"
              onChange={setPackingList}
            />
            {item?.packing_list && (
              <Link href={item?.packing_list} target="_blank">
                {fileType(item.packing_list)}
              </Link>
            )}
          </Stack>
          <Select
              label="Is the IDF approved?"
              placeholder="Is the IDF approved?"
              data={[
                { value: "No", label: "No" },
                { value: "Yes", label: "Yes" },
              ]}
              clearable
              searchable
              value={idfDone}
              onChange={setIdfDone}
            />
            {idfDone === 'No' && (
              <>
          <Stack>
            <FileInput
              label="Upload IDF Draft"
              placeholder="Upload IDF Draft"
              onChange={setIdfFile}
              
            />
            {item?.idf && (
              <Link href={item?.idf} target="_blank">
                {fileType(item.idf)}
              </Link>
            )}
            <Checkbox mt="md" label="Director Approval of the IDF Draft " />
          </Stack>
          </>
          )}
            {idfDone === 'Yes' && (
              <>
          <Stack>
            <FileInput
              label="Upload Final IDF"
              placeholder="Upload Final IDF"
              onChange={setIdfFile}
              
            />
            {item?.idf && (
              <Link href={item?.idf} target="_blank">
                {fileType(item.idf)}
              </Link>
            )}
            <Checkbox mt="md" checked label="IDF approved by the Director" />
          </Stack>
          <TextInput
          placeholder="Enter IDF date"
          label="Enter IDF date"
          type="datetime-local"
          value={idfDate}
          onChange={(e) => setIdfDate(e.target.value)}
          />
          </>
          )}
        </SimpleGrid>
        <Typography variant="h5" mt={3} mb={1}>
          Upload Permits
        </Typography>
        {permits?.map((permit, index) => (
          <SimpleGrid
            key={index}
            cols={4}
            spacing="xs"
            breakpoints={[
              { maxWidth: "md", cols: 2, spacing: "xs" },
              { maxWidth: "sm", cols: 2, spacing: "xs" },
              { maxWidth: "xs", cols: 1, spacing: "xs" },
            ]}
          >
            <Stack>
            <FileInput
              label="Upload Permit"
              placeholder="Upload Permit"
              onChange={(file) => handlePermitFileChange(index, file)}
            />
            {permit?.permitFile && 
              typeof permit?.permitFile === 'string' && (
              <Link href={permit?.permitFile} target='_blank'>
                <Image alt="" src={permit?.permitFile} radius="sm" mt="xs" height={50} width={50} />
              </Link>
            )}
            </Stack>
            <TextInput
              label="Cost"
              placeholder="Cost"
              value={permit.cost}
              onChange={(event) => handleInputChange(index, "cost", event.currentTarget.value)}
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
              value={permit.currency}
              onChange={(value) => handleInputChange(index, "currency", value)}
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
              value={permit.paymentMethod}
              onChange={(value) =>
                handleInputChange(index, "paymentMethod", value)
              }
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
              value={permit.paidBy}
              onChange={(value) => handleInputChange(index, "paidBy", value)}
            />
            <Stack>
            <FileInput
              label="Upload Proof"
              placeholder="Upload Proof"
              onChange={(file) => handleProofFileChange(index, file)}
            />
            {permit?.proofFile &&
              typeof permit?.proofFile === 'string' && (
              <Link href={permit?.proofFile} target='_blank'>
                <Image alt="" src={permit?.proofFile} radius="sm" mt="xs" height={50} width={50} />
              </Link>
            )}
            </Stack>
            <Button
              variant="outline"
              mt="xl"
              color="red"
              onClick={() => removePermit(index)}
            >
              Remove
            </Button>
          </SimpleGrid>
        ))}
        <SimpleGrid cols="3">
          <Button mt="md" onClick={addPermit} variant="outline">
            Add More Permits
          </Button>
        </SimpleGrid>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "end" }}
          mt={3}
        >
          <Link href={`/consignments`} >
          <Button variant="outline" color="red">
            Cancel
          </Button>
          </Link>
          <Button loading={loading} onClick={handleSubmit} variant="outline">
            Receive Consignment
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ReceivingTab;
