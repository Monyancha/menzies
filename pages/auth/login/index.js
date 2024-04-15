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

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    
    async function submit(event) {
        event.preventDefault();

        if(!username){
          showNotification({
            title: "Error",
            message: "Sorry, Kindly enter your email/phone!",
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

        // TODO: Add validation
        const result = await signIn("credentials", {
            redirect: false,
            email: username,
            password,
        });

        console.log("Login Result Data", result);

        if (result.error) {
            showNotification({
                title: "Error",
                message: "Invalid Credentials, Please try again!",
                color: "red",
            });
            setIsSubmitting(false);
            console.log("An Error Occurred", result.error);
        } else {
            // router.replace("/");
            showNotification({
                title: "Success",
                message: "Login Successfull",
                color: "green",
            });
            setIsSubmitting(false);
            router.push("/");
        }
        setIsSubmitting(false);
    }

    //loginAsAgent
    function loginAsAgent() {
        setUsername('agent@menzies.com');
        setPassword('password');
    }
    //loginAsManager
    function loginAsManager(){
        setUsername('globaladmin@menzies.com');
        setPassword('password');
    }
    //loginAsSecurity
    function loginAsSecurity(){
        setUsername('security@menzies.com');
        setPassword('password');
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
                                src="/images/backgrounds/auth.png"
                                alt="bg"
                                style={{
                                    width: '100%',
                                    maxWidth: '600px',
                                    maxHeight: '600px',
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
                        <Typography justifyContent="center" alignItems="center" fontWeight="700" variant="h3" mb={1}>
                            Menzies Aviation
                        </Typography>
                        <Typography justifyContent="center" alignItems="center" variant="subtitle1" color="textSecondary" mb={1}>
                        Managing Cargo Made Easy.
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
                            Sign in & Get Started
                            </Typography>
                        </Divider>
                        </Box>
                        <Stack>
                            <Box>
                                <CustomFormLabel htmlFor="username">Email/Phone No.</CustomFormLabel>
                                <TextField type='text' placeholder='Enter your email/phone' id="username" variant="outlined" fullWidth value={username} onChange={e => setUsername(e.target.value)} />
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
                                Sign In
                            </Button>
                            <Group grow>
                            <Button leftSection={<IconLogin2/>} mt="md" radius="md" variant='outline' color="yellow"  onClick={loginAsManager}>Login as Manager</Button>
                            <Button leftSection={<IconLogin2/>} mt="md" radius="md" variant='outline' color="green"  onClick={loginAsAgent}>Login as Agent</Button>
                            <Button leftSection={<IconLogin2/>} mt="md" radius="md" variant='outline' color="green"  onClick={loginAsSecurity}>Login as Security</Button>
                            </Group>
                        </Box>
                        {/* End Login Form */}
                        {/* <Stack direction="row" spacing={1} mt={3}>
                            <Typography color="textSecondary" variant="h6" fontWeight="500">
                                New to Menzies Aviation?
                            </Typography>
                            <Typography
                                component={Link}
                                href="/auth/register"
                                fontWeight="500"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                }}
                            >
                                Sign Up
                            </Typography>
                        </Stack> */}
                        {/* end form */}
                    </Box>
                </Grid>
            </Grid>
        </PageContainer>
    );
}

Login.layout = "Blank";
export default Login;