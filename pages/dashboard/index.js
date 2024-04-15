import React from "react";
import { useEffect, useState } from "react";
import PageContainer from "../../src/components/container/PageContainer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Box,
  Avatar,
  Typography,
  Card,
  Paper,
  Chip,
  LinearProgress,
  CardContent,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import {
  IconArrowUpRight,
  IconFileDollar,
  IconFileInvoice,
  IconMoneybag,
  IconPackage,
  IconPackageExport,
  IconPigMoney,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import { Button, Image } from "@mantine/core";
import DashboardCard from "../../src/components/shared/DashboardCard";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../lib/shared/data-formatters";
import { getConsignmentDashboard } from "../../src/store/consignments/consignments-slice";
import { useSelector } from "react-redux";
import store from "../../src/store/Store";
import TableCardHeader from "../../components/ui/layouts/table-card-header";
import { TDateFilter } from "../../components/ui/layouts/scrolling-table";
import { getDashboard } from "../../src/store/cargo/cargo-slice";
import { IconBriefcase } from "@tabler/icons-react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const itemStatus = useSelector(
    (state) => state.cargo.getDashboardStatus
  );
  const item = useSelector((state) => state.cargo.getDashboard);

  const isLoading = itemStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(getDashboard(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getDashboard(params));
  }, [session, status, startDate, endDate]);

  console.log('Dashboard Data', item);


  return (
    <PageContainer>
      <Box mt={1}>
        <Grid container spacing={1}>
          {/* column */}
          <Grid item xs={12} lg={8}>
            
            <Card
              elevation={0}
              sx={{
                backgroundColor: "#1f3567",
                // background: "url('/images/bg.jpg')",
                color: "#ffffff",
                py: 0,
              }}
            >
              <CardContent sx={{ py: 4, px: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item sm={6} display="flex" alignItems="center">
                    <Box>
                      <Box
                        gap="16px"
                        mb={5}
                        sx={{
                          display: {
                            xs: "block",
                            sm: "flex",
                          },
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src="/images/profile/user-1.jpg"
                          alt="img"
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography variant="h5" whiteSpace="nowrap">
                          Hi <span style={{ color: "#00bcc8"}}> {session?.user?.name}!</span>
                        </Typography>
                      </Box>

                      <Stack
                        spacing={2}
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                      >
                        <Box>
                          <Typography variant="h2" whiteSpace="nowrap">
                            {formatNumber(item?.cargo) ?? 0}{" "}
                            <span>
                              <IconArrowUpRight width={30} color="#00bcc8" />
                            </span>
                          </Typography>
                          <Typography variant="subtitle1" whiteSpace="nowrap">
                            Total Cargo
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item sm={6}>
                    <Box mb="-51px">
                      <Image
                        src="/images/backgrounds/welcome-bg.svg"
                        alt="img"
                        width={"340px"}
                        height={"204px"}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{item?.visitors ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total Visitors
                    </Typography>
                    <Box height="100px">
                      <IconUsers color="orange" size={130} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{item?.companies ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total Companies
                    </Typography>
                    <Box height="100px">
                      <IconBriefcase color="green" size={130} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{item?.awbs ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total AWBs
                    </Typography>
                    <Box height="100px">
                      <IconFileInvoice color="green" size={130} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{item?.total_ulds ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total ULDs
                    </Typography>
                    <Box height="100px">
                      <IconMoneybag color="purple" size={130} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
              <Grid item xs={12}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{formatNumber(item?.known_cargo) ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total Known Cargo
                    </Typography>
                    <Box height="100px">
                      <IconFileDollar color="red" size={370} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Grid container spacing={1}>
            <Grid item xs={12}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{formatNumber(item?.visits) ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total Visits
                    </Typography>
                    <Box height="100px">
                      <IconFileDollar color="orange" size={370} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{item?.visits_in ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total Checkins
                    </Typography>
                    <Box height="100px">
                      <IconPigMoney color="green" size={130} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DashboardCard>
                  <>
                    <Typography variant="h4">{item?.visits_out ?? 0}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      mb={2}
                    >
                      Total Checkouts
                    </Typography>
                    <Box height="100px">
                      <IconMoneybag color="maroon" size={130} />
                    </Box>
                  </>
                </DashboardCard>
              </Grid>
              
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Paper
              sx={{ bgcolor: "#00bcc8", border: `1px solid #00bcc8` }}
              variant="outlined"
              shadow
            >
              <CardContent>
                <Typography variant="h5" color="white">
                  Quick Summary
                </Typography>
                <Typography variant="subtitle1" color="white" mb={4}>
                  Overall quick glance statistics
                </Typography>

                <Box textAlign="center" mt={2} mb="-40px">
                  <Image
                    src={`images/backgrounds/welcome-bg2.png`}
                    alt={"SavingsImg"}
                    width="270"
                  />
                </Box>
              </CardContent>
              <Paper
                sx={{
                  overflow: "hidden",
                  zIndex: "1",
                  position: "relative",
                  margin: "10px",
                  mt: "-43px",
                }}
              >
                <Box p={3}>
                  <Stack spacing={3}>
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        mb={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                          Unkown Cargo: {item?.unknown_cargo ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          General Cargo: {item?.general_cargo ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Cargo Details: {item?.cargo_details ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Cargo Status: {item?.cargo_status ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Aircraft Palletes: {item?.aircraft_pallets ?? 0}
                          </Typography>
                          
                          
                          <Typography variant="subtitle2" color="textSecondary">
                          Logged Out: {item?.logged_out ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Offloaded Cargo: {item?.offloaded_cargo ?? 0}
                          </Typography>

                          <Typography variant="subtitle2" color="textSecondary">
                          Known Pallete Ulds: {item?.pallet_ulds_known ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Pallete Ulds: {item?.palleted_ulds ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Pallets: {item?.pallets ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Pending Pallets: {item?.pending_pallets ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Pending Screening: {item?.pending_screens ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Received Imports: {item?.received_imports ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Recent Ulds: {item?.recent_ulds ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Roles: {item?.roles ?? 0}
                          </Typography>

                          <Typography variant="subtitle2" color="textSecondary">
                          Screened: {item?.screened ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Screening: {item?.screening ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Storage Pallets: {item?.storage_pallets ?? 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                          Stored Cargo: {item?.stored_cargo ?? 0}
                          </Typography>
                          
                          <Typography variant="subtitle2" color="textSecondary">
                          Awaiting Acceptance: {item?.awaiting ?? 0}
                          </Typography>
                        </Box>

                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Paper>
          </Grid>
          
        </Grid>
      </Box>
    </PageContainer>
  );
}
