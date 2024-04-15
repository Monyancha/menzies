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
  Image,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
} from "@mantine/core";

import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
// images
import { Stack } from "@mui/system";
import { getSingleConsignment } from "../../src/store/consignments/consignments-slice";
import { showNotification } from "@mantine/notifications";
import store from "../../src/store/Store";
import { useSession } from "next-auth/react";
import { fileType } from "../../lib/shared/data-formatters";
import Link from "next/link";

const BCrumb = [
    {
      to: "/dashboard",
      title: "Dashboard",
    },
    {
      to: "/settings",
      title: "Settings",
    },
    {
        title: "Currency Exchange",
      },
  ];

const Currency = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [rate, setRate] = useState("167");
  const [currency, setCurrency] = useState("usd");


  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    // Append non-dynamic data to formData
    formData.append('rate', rate);
    formData.append('currency', currency);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/currency-exchange`;

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
          message: "USD Currency exchange updated successful!",
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
      setLoading(false);

  };


  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title=" Currency Exchange" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
        <Typography variant="h5" mb={1}>
          Update USD Currency Exchange Rate
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
         
          <Select
              label="Select Currency"
              placeholder="Select Currency"
              data={[
                { value: "usd", label: "USD" },
                { value: "kes", label: "KES", disabled: true },
              ]}
              clearable
              searchable
              value={currency}
              onChange={setCurrency}
            />

        <TextInput 
            label="Exchange Rate(1 USD = ? KES)" 
            placeholder="Exchange Rate(1 Usd = ? KES)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />

        </SimpleGrid>


        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "end" }}
          mt={3}
        >
          <Button loading={loading} onClick={handleSubmit} variant="outline">Update Currency</Button>
        </Stack>
      </Grid>
    </Grid>
    </Box>
    </PageContainer>
  );
};

export default Currency;
