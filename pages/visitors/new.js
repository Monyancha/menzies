import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
} from "@mui/material";
import {
  Button,
  FileInput,
  Group,
  Radio,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import Card from "../../components/ui/layouts/card";
// images
import { Stack } from "@mui/system";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import store from "../../src/store/Store";
import { getSingleConsignment } from "../../src/store/consignments/consignments-slice";
import { IconPlus, IconTrash, IconCircleCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";

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
    to: "/visitors/new",
    title: "New Visitor",
  },
];

export default function NewVisitor() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const  router = useRouter();

  //Radio Buttons
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [phone, setPhone] = useState("");
  const [nid, setNId] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fname) {
      showNotification({
        title: "Error",
        message: "First Name is required!",
        color: "red",
      });
      return;
    }

    if (!lname) {
      showNotification({
        title: "Error",
        message: "Last Name is required!",
        color: "red",
      });
      return;
    }

    if (!phone) {
      showNotification({
        title: "Error",
        message: "Phone Number is required!",
        color: "red",
      });
      return;
    }

    if (!nid) {
      showNotification({
        title: "Error",
        message: "National ID is required!",
        color: "red",
      });
      return;
    }

    const formData = new FormData();
    formData.append("first_name", fname);
    formData.append("last_name", lname);
    formData.append("phone_number", phone);
    formData.append("id_no", nid);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/store-visitor`;

      const accessToken = session.user.accessToken;

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
      console.log("result", result);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Visitor created successfully! Redirecting you to checkin...",
          color: "green",
        });
        // clearForm();
        setLoading(false);
        router.push(`/visitors/checkin?visitor_id=${result?.visitor?.id}`)
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result?.errors?.id_no,
          color: "red",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification({
        title: "Error",
        message: "An Error Occured. Please Try Again Later " + error,
        color: "red",
      });
      setLoading(false); // Turn off loading indicator in case of error
    }
  };


  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="New Visitor" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <Grid container spacing={3}>
              {/* Edit Details */}
              <Grid item xs={12}>
                <Typography variant="h5" mb={1}>
                  Visitor Details
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

                <TextInput value={fname} onChange={(e) => setFName(e.target.value)} placeholder="First Name." label="First Name." />
                <TextInput value={lname} onChange={(e) => setLName(e.target.value)} placeholder="Last Name" label="Last Name" />
                <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" label="Phone Number" />
                <TextInput value={nid} onChange={(e) => setNId(e.target.value)} placeholder="National ID" label="National ID" />

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
                    Next
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