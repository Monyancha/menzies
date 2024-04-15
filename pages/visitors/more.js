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
import { IconPlus, IconTrash, IconCircleCheck } from "@tabler/icons-react";
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
    to: "/visitors/more",
    title: "Visitor Details",
  },
];

export default function MoreVisitor(item) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const visitorId = router.query?.visitor_id ?? null;



  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Visitor Details" items={BCrumb} />
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
                  {item?.first_name}
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

                </SimpleGrid>


                <Typography mt={4} variant="h5" mb={1}>
                  Documents and Images
                </Typography>
                <Typography color="textSecondary" mb={3}>
                  You can upload multiple documents and images
                </Typography>


              </Grid>
            </Grid>
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
