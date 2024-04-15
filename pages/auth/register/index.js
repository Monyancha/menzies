/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Grid, Box, Stack, Typography, Divider, FormGroup, FormControlLabel, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery from @mui/material
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { Button, Group } from '@mantine/core';
import PageContainer from '../../../src/components/container/PageContainer';
import CustomFormLabel from '../../../src/components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../../src/components/forms/theme-elements/CustomCheckbox';
import { showNotification } from '@mantine/notifications';
import { IconLogin2 } from '@tabler/icons-react';
import React, { useRef } from 'react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); 

    async function submit(event) {
        event.preventDefault();

        if(!name){
          showNotification({
            title: "Error",
            message: "Sorry, Kindly enter your name!",
            color: "red",
          });
          return;
        }

        if(!email){
            showNotification({
              title: "Error",
              message: "Sorry, Kindly enter your email!",
              color: "red",
            });
            return;
          }

        if(!password){
          showNotification({
            title: "Error",
            message: "Sorry, Kindly enter your password!",
            color: "red",
          });
          return;
        }

        setIsSubmitting(true);

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            category_id: 8,
            location: "Nairobi, Kenya",
            package_id: 5,
            name,
            email,
            password,
            role_id: 1,
            confirmPassword: password,
            phone
          }),
        });

        const res = await response.json();
        if (response.status === 200) {
          showNotification({
            title: "Success",
            message: "Registration completed Successfully!",
            color: "green",
          });
        } else {
          showNotification({
            title: "Error",
            message: "Sorry! " + res.message,
            color: "red",
          });
        }

        // TODO: Add validation
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            });
        
            if (result.error) {
                showNotification({
                    title: "Error",
                    message: "Invalid Login Credentials!",
                    color: "red",
                  });
            } else {
            router.push('/dashboard');
            }
        
            console.log("login result aiden", result);
            await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
            });


        setIsSubmitting(false);
    }


    return (
        <PageContainer>
            <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={7}
                    xl={8}
                    sx={{
                        position: 'relative',
                        '&:before': {
                            content: '""',
                            background: '#1f3567',
                            backgroundSize: '400% 400%',
                            animation: 'gradient 15s ease infinite',
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            // opacity: '0.5',
                        },
                    }}
                >
                    <Box position="relative">
                        {/* <Box px={3}>
                            <Logo />
                        </Box> */}
                        <Box
                            alignItems="center"
                            justifyContent="center"
                            height={'calc(100vh)'}
                            sx={{
                                display: {
                                    xs: 'none',
                                    lg: 'flex',
                                },
                            }}
                        >
                            <img
                                src="/images/logo.png"
                                alt="bg"
                                style={{
                                    width: '100%',
                                    maxWidth: '300px',
                                    maxHeight: '300px',
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={5}
                    xl={4}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box p={4}>
                        <Typography fontWeight="700" variant="h3" mb={1}>
                        Tana River County Gvt.
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" mb={1}>
                        Managing County Projects Made Easy.
                        </Typography>
                        {/* Login form here */}
                        <Box mt={3}>
                        <Divider>
                            <Typography
                            component="span"
                            color="textSecondary"
                            variant="h6"
                            fontWeight="400"
                            position="relative"
                            px={2}
                            >
                            Sign up & Get Started
                            </Typography>
                        </Divider>
                        </Box>
                        <Stack>
                            <Box>
                                <CustomFormLabel htmlFor="username">Name</CustomFormLabel>
                                <TextField type='text' placeholder='Enter your Name' variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} />
                            </Box>
                            <Box>
                                <CustomFormLabel htmlFor="username">Email</CustomFormLabel>
                                <TextField type='text' placeholder='Enter your email' variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
                            </Box>
                            <Box>
                                <CustomFormLabel htmlFor="username">Phone No.</CustomFormLabel>
                                <TextField type='text' placeholder='Enter your phone no.' variant="outlined" fullWidth value={phone} onChange={e => setPhone(e.target.value)} />
                            </Box>
                            <Box>
                                <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                                <TextField id="password" type='password' placeholder='Enter your password' variant="outlined" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
                            </Box>
                            <Stack
                                justifyContent="space-between"
                                direction="row"
                                alignItems="center"
                                my={2}
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        control={<CustomCheckbox defaultChecked />}
                                        label="Remember this Device"
                                    />
                                </FormGroup>
                                <Typography
                                    component={Link}
                                    href="#"
                                    fontWeight="500"
                                    sx={{
                                        textDecoration: "none",
                                        color: "primary.main",
                                    }}
                                >
                                    Forgot Password ?
                                </Typography>
                            </Stack>
                        </Stack>
                        <Box>
                            <Button
                                loading={isSubmitting}
                                size='md'
                                radius="md"
                                fullWidth
                                variant='outline'
                                onClick={submit} // Add an onClick handler for the submit action
                            >
                                Sign Up
                            </Button>
                        </Box>
                        {/* End Login Form */}
                        <Stack direction="row" spacing={1} mt={3}>
                            <Typography color="textSecondary" variant="h6" fontWeight="500">
                                Already have an Account?
                            </Typography>
                            <Typography
                                component={Link}
                                href="/auth/login"
                                fontWeight="500"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                }}
                            >
                                Sign In
                            </Typography>
                        </Stack>
                        {/* end form */}
                    </Box>
                </Grid>
            </Grid>
        </PageContainer>
    );
}

Register.layout = "Blank";
export default Register;