import React, { useEffect, useState } from 'react';
import PageContainer from '../../src/components/container/PageContainer';
import Breadcrumb from '../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Grid, Tabs, Tab, Box, CardContent, Divider } from '@mui/material';

// components
import {
  IconArticle,
  IconBell,
  IconCheckupList,
  IconDiscountCheckFilled,
  IconFileAnalytics,
  IconFileInvoice,
  IconLock,
  IconUserCircle,
} from '@tabler/icons-react';
import BlankCard from '../../src/components/shared/BlankCard';
import { useRouter } from 'next/router';
import ReceivingTab from './tabs/receive';
import BillOfLanding from './tabs/billof-landing';
import CustomsEntry from './tabs/customs-entry';
import FieldVerification from './tabs/field-verification';
import COC from './tabs/coc';
import AccountsTab from './tabs/accounts';
import { useSelector } from 'react-redux';
import { getSingleConsignment } from '../../src/store/consignments/consignments-slice';
import { useSession } from 'next-auth/react';
import store from '../../src/store/Store';
import FileSummary from './tabs/file-summary';

const BCrumb = [
  {
    to: '/dashboard',
    title: 'Dashboard',
  },
  {
    to: '/consignments',
    title: 'Consignments',
  },
  {
    title: 'Update Consignments',
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function UpdateConsignment() {
  const { data: session, status } = useSession();
  const [value, setValue] = useState(0);
  const router = useRouter();
  const itemId = router?.query?.itemId;
  const code = router?.query?.code;

  //Fetch a single Consignment
  const itemStatus = useSelector(
    (state) => state.consignments.getSingleConsignmentStatus
  );
  const item = useSelector((state) => state.consignments.getSingleConsignment);

  const isLoading = itemStatus === "loading";


  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (itemId) {
      params["itemId"] = itemId;
    }

    store.dispatch(getSingleConsignment(params));
  }, [session, status, itemId]);

  console.log("Habakkuk", item);

  //End Fetching

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title={`#${itemId} Update Consignment ${code}`} items={BCrumb} />
      {/* end breadcrumb */}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BlankCard>
            <Box sx={{ maxWidth: { xs: 320, sm: 480, md:800, lg: 1000, xl: 2000 } }}>
              <Tabs
                value={value}
                onChange={handleChange}
                scrollButtons="auto"
                aria-label="basic tabs example"
              >
                <Tab
                  iconPosition="start"
                  icon={<IconCheckupList size="22" />}
                  label="Receiving"
                  {...a11yProps(0)}
                />

                <Tab
                  iconPosition="start"
                  icon={<IconArticle size="22" />}
                  label="Bill of Lading"
                  {...a11yProps(2)}
                />

                <Tab
                  iconPosition="start"
                  icon={<IconBell size="22" />}
                  label="Customs Entry"
                  {...a11yProps(1)}
                />

                <Tab
                  iconPosition="start"
                  icon={<IconDiscountCheckFilled size="22" />}
                  label="Field Verification"
                  {...a11yProps(3)}
                />
                
                <Tab
                  iconPosition="start"
                  icon={<IconLock size="22" />}
                  label="Loading"
                  {...a11yProps(4)}
                />

                <Tab
                  iconPosition="start"
                  icon={<IconFileInvoice size="22" />}
                  label="Accounts"
                  {...a11yProps(5)}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconFileAnalytics size="22" />}
                  label="Files Summary"
                  {...a11yProps(6)}
                />
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              <TabPanel value={value} index={0}>
                <ReceivingTab itemId={itemId} item={item?.receival}/>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <BillOfLanding item={item?.bill_of_lading} itemId={itemId} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <CustomsEntry item={item?.customs_entry} itemId={itemId} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <FieldVerification item={item?.field_verification} itemId={itemId}/>
              </TabPanel>
              <TabPanel value={value} index={4}>
                <COC item={item?.coc} itemId={itemId}/>
              </TabPanel>
              <TabPanel value={value} index={5}>
                <AccountsTab item={item} itemId={itemId}/>
              </TabPanel>
              <TabPanel value={value} index={6}>
                <FileSummary item={item} itemId={itemId}/>
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
