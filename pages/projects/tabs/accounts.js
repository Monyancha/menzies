import React, { useState } from 'react';
import { CardContent, Grid, Typography, MenuItem, Box, Avatar } from '@mui/material';
import { Button, FileInput, Group, Select, SimpleGrid, Text, TextInput, Textarea } from '@mantine/core';


// images
import { Stack } from '@mui/system';
import { IconEye, IconLoader, IconSettings2 } from '@tabler/icons-react';
import Link from 'next/link';
import { showNotification } from '@mantine/notifications';
import { IconLoader2 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { getConsignments } from '../../../src/store/consignments/consignments-slice';
import store from '../../../src/store/Store';


const AccountsTab = ({itemId, item}) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

    const [permits, setPermits] = useState([]);

    const addPermit = () => {
      setPermits([...permits, {
        permitFile: null,
        cost: '',
        paymentMethod: '',
        paidBy: '',
        proofFile: null
      }]);
    };
  
    const removePermit = index => {
      const newPermits = [...permits];
      newPermits.splice(index, 1);
      setPermits(newPermits);
    };
  
    const handleInputChange = (index, field, value) => {
      const newPermits = [...permits];
      newPermits[index][field] = value;
      setPermits(newPermits);
    };
  
    const handleFileChange = (index, field, file) => {
      const newPermits = [...permits];
      newPermits[index][field] = file;
      setPermits(newPermits);
    };

    const handleGenerate = async (event) => {
      event.preventDefault();
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `${API_URL}/consignment-invoice/${itemId}`;
  
        const accessToken = session.user.accessToken;
  
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          }
        };
  
        console.log("Am here 2");
  
        setLoading(true);
  
        const response = await fetch(endpoint, options);
  
        const result = await response.json();
        console.log("Aiden Kabalake", response);
  
        if (response?.status === 200) {
          showNotification({
            title: "Success",
            message: "Generated Successfully!",
            color: "green",
          });
        setLoading(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getConsignments(params));
        } else {
          showNotification({
            title: "Error",
            message: "Sorry! Kindly fill all the steps to be able to generate!",
            color: "red",
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification({
          title: "Error",
          message: "Check your internet " + error,
          color: "red",
        });
        setLoading(false); // Turn off loading indicator in case of error
      }
    };


  return (
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
            <Typography variant="h5" mb={1}>
              View Consignment Account Reports
            </Typography>
            <Typography color="textSecondary" mb={1}>To view your consignment account reports click on either of the buttons to be redirected</Typography>
            <Text weight="bold" color="red" mb={3}>NOTE: Before generating make sure you have filled accurately all the steps!</Text>

            {!item?.invoice_id && !item?.quotation_id && !item?.expense_id && (
                <Button loading={loading} onClick={handleGenerate} mt="md" fullWidth variant='outline' leftIcon={<IconSettings2 size={18} />} >Generate Invoice, Quotation & Expenses</Button>
               )}

            <SimpleGrid
                cols={2}
                spacing="xs"
                breakpoints={[
                  { maxWidth: 'md', cols: 2, spacing: 'xs' },
                  { maxWidth: 'sm', cols: 2, spacing: 'xs' },
                  { maxWidth: 'xs', cols: 1, spacing: 'xs' },
                ]}
              >
              
               {item?.invoice_id && item?.quotation_id && item?.expense_id && (
                <>
              <Link href={`/accounts/invoices`}>
                <Button mt="md" fullWidth  variant='outline' color='blue' leftIcon={<IconEye size={18} />} >View Invoice</Button>
              </Link>
              <Link href={`/accounts/quotations`}>
              <Button mt="md" fullWidth  variant='outline' color='blue' leftIcon={<IconEye size={18} />} >View Quotation</Button>
              </Link>
              <Link href={`/accounts/expenses`}>
              <Button mt="md" fullWidth  variant='outline' color='yellow' leftIcon={<IconEye size={18} />} >View Expenses</Button>
              </Link>
              
              <Button mt="md" fullWidth  variant='outline' color='yellow' disabled leftIcon={<IconEye size={18} />} >View Payments</Button>
              <Button mt="md" fullWidth  variant='outline' color='yellow' disabled leftIcon={<IconEye size={18} />} >View Sales Report</Button>
              <Button mt="md" fullWidth  variant='outline' color='yellow' disabled leftIcon={<IconEye size={18} />} >View Profit & Loss Report</Button>
              <Button mt="md" fullWidth  variant='outline' color='yellow' disabled leftIcon={<IconEye size={18} />} >View Customer Statement of Account</Button>
              <Button mt="md" fullWidth  variant='outline' color='yellow' disabled leftIcon={<IconEye size={18} />} >View Invoice Aging Report</Button>
              </>
               )}
              </SimpleGrid>

      </Grid>
    </Grid>
  );
};

export default AccountsTab;
